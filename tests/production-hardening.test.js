const assert = require('assert');
const { ConsensusSolverEngine } = require('../src/content/solver/ConsensusSolverEngine');
const { Key4uApiClient } = require('../src/background/Key4uApiClient');
const { TextUtils } = require('../src/content/core/TextUtils');

class FakeEngine extends ConsensusSolverEngine {
  constructor(rounds) {
    super({ models: ['model-a', 'model-b', 'model-c'], maxRetries: 2, roundTimeoutMs: 50 });
    this.rounds = rounds;
    this.callCount = 0;
  }

  sendSolveRequest(_prompt, model) {
    const round = this.rounds[Math.floor(this.callCount / 3)] || {};
    this.callCount += 1;
    const response = round[model];
    return response instanceof Error ? Promise.reject(response) : Promise.resolve(response);
  }
}

async function testConsensus() {
  const single = { type: 'single_choice', title: 'Question', options: [{ key: 'A', text: 'One' }, { key: 'B', text: 'Two' }] };
  let result = await new FakeEngine([{ 'model-a': { answer: 'A' }, 'model-b': { answer: 'A' }, 'model-c': { answer: 'A' } }]).solveQuestion(single);
  assert.equal(result.consensus, true);
  assert.equal(result.answer, 'A');

  result = await new FakeEngine([
    { 'model-a': { answer: 'A' }, 'model-b': { answer: 'B' }, 'model-c': { answer: 'A' } },
    { 'model-a': { answer: 'B' }, 'model-b': { answer: 'B' }, 'model-c': { answer: 'B' } }
  ]).solveQuestion(single);
  assert.equal(result.consensus, true, 'disagreement must be re-run before a result is used');
  assert.equal(result.answer, 'B');

  result = await new FakeEngine([{ 'model-a': { answer: 'Z' }, 'model-b': { answer: 'Z' }, 'model-c': { answer: 'Z' } }]).solveQuestion(single);
  assert.equal(result.consensus, false);
  assert.equal(result.consensusStatus, 'INVALID_RESPONSE');

  result = await new FakeEngine([{ 'model-a': { answer: 'A' }, 'model-b': new Error('network unavailable'), 'model-c': { answer: 'A' } }]).solveQuestion(single);
  assert.equal(result.consensus, false);
  assert.equal(result.consensusStatus, 'MODEL_ERROR');
}

async function testTypedNormalization() {
  const multiple = { type: 'multiple_choice', title: 'Question', options: [{ key: 'A' }, { key: 'B' }, { key: 'C' }] };
  let result = await new FakeEngine([{ 'model-a': { answers: ['C', 'A'] }, 'model-b': { answers: ['A', 'C'] }, 'model-c': { answers: ['A', 'C', 'A'] } }]).solveQuestion(multiple);
  assert.equal(result.consensus, true);
  assert.deepEqual(result.answers, ['A', 'C']);

  const dropdown = {
    type: 'dropdown_select', title: 'Question', selects: [
      { id: 'CX', label: 'CX', options: [{ value: 'fe67', text: 'FE67' }] },
      { id: 'BX', label: 'BX', options: [{ value: '67fe', text: '67FE' }] }
    ]
  };
  result = await new FakeEngine([{ 'model-a': { answers: { CX: 'FE67', BX: '67FE' } }, 'model-b': { answers: { BX: '67FE', CX: 'FE67' } }, 'model-c': { answers: { CX: 'FE67', BX: '67FE' } } }]).solveQuestion(dropdown);
  assert.equal(result.consensus, true);
  assert.deepEqual(result.dropdownAnswers, { CX: 'FE67', BX: '67FE' });

  const input = { type: 'short_answer', title: 'Question' };
  result = await new FakeEngine([{ 'model-a': { answerText: 'and EAX,FFFFF000' }, 'model-b': { answerText: 'and EAX,FFFFF000' }, 'model-c': { answerText: 'and EAX,FFFFF000' } }]).solveQuestion(input);
  assert.equal(result.consensus, true);
  assert.equal(result.answerText, 'and EAX,FFFFF000');

  result = await new FakeEngine([{ 'model-a': { answerText: 'AND EAX, 0xFFFFF000' }, 'model-b': { answerText: 'and eax, 0xFFFFF000' }, 'model-c': { answerText: 'AND eax, 0Xfffff000' } }]).solveQuestion(input);
  assert.equal(result.consensus, true, 'text entry consensus must ignore letter case only');
  assert.equal(result.answerText, 'AND EAX, 0xFFFFF000', 'the original agreed response remains available for display/fill');

  result = await new FakeEngine([{ 'model-a': { answerText: 'AND EAX, 0FFFFF000h' }, 'model-b': { answerText: 'and eax, 0xFFFFF000' }, 'model-c': { answerText: 'AND EAX, 0xFFFFF000' } }]).solveQuestion(input);
  assert.equal(result.consensus, true, 'MASM and 0x hexadecimal literals represent the same immediate value');

  const trueFalse = { type: 'true_false_group', title: 'Question', items: [{ key: 'A', text: 'One' }, { key: 'B', text: 'Two' }] };
  result = await new FakeEngine([{ 'model-a': { answers: { A: true, B: false } }, 'model-b': { answers: { A: 'true', B: 'false' } }, 'model-c': { answers: { A: true, B: false } } }]).solveQuestion(trueFalse);
  assert.equal(result.consensus, true);
  assert.deepEqual(result.answers, { A: 'true', B: 'false' });

  result = await new FakeEngine([{ 'model-a': { answers: { A: true } }, 'model-b': { answers: { A: true } }, 'model-c': { answers: { A: true } } }]).solveQuestion(trueFalse);
  assert.equal(result.consensusStatus, 'INVALID_RESPONSE');
}

function testParserAndCacheFingerprint() {
  const client = new Key4uApiClient();
  assert.deepEqual(client.parseFlexibleResponse('["A", "C"]'), { answers: ['A', 'C'] });
  assert.equal(client.parseFlexibleResponse('long explanation that is definitely not a valid answer because it contains a lot of explanatory prose and exceeds the configured contract length'), null);
  assert.equal(client.shouldTryBackupModel({ status: 401 }), false);
  assert.equal(client.shouldTryBackupModel({ status: 429 }), false);
  assert.equal(client.shouldTryBackupModel({ status: 503 }), true);

  const base = { type: 'single_choice', title: 'Question', options: [{ key: 'A', text: 'One' }, { key: 'B', text: 'Two' }] };
  const changedOption = { ...base, options: [{ key: 'A', text: 'Different' }, { key: 'B', text: 'Two' }] };
  const changedType = { ...base, type: 'multiple_choice' };
  assert.notEqual(TextUtils.hashQuestion(base, 'models:a|normalization:2'), TextUtils.hashQuestion(changedOption, 'models:a|normalization:2'));
  assert.notEqual(TextUtils.hashQuestion(base, 'models:a|normalization:2'), TextUtils.hashQuestion(changedType, 'models:a|normalization:2'));
}

(async () => {
  await testConsensus();
  await testTypedNormalization();
  testParserAndCacheFingerprint();
  console.log('production-hardening tests passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
