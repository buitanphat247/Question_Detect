class SupabaseCacheService {
  constructor({ getConfig, getSupabaseConfig } = {}) {
    this.getConfig = getConfig || (() => (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {}));
    this.getSupabaseConfig = getSupabaseConfig || (() => {
      const cfg = typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {};
      return {
        URL: cfg.SUPABASE_URL || 'https://aacpvpfkqhwlltwjjiag.supabase.co',
        ANON_KEY: cfg.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3B2cGZrcWh3bGx0d2pqaWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzU4MTMsImV4cCI6MjEwNDYxMTgxM30.RUNkB2a4_Ji2rAHbqbBOMmmDDo_j8hDl7dmXKj1IooM'
      };
    });
  }

  isCacheActive() {
    if (typeof isSupabaseCacheEnabled === 'function') {
      return isSupabaseCacheEnabled();
    }
    const cfg = this.getConfig();
    return cfg.ENABLE_SUPABASE_CACHE === true;
  }

  async getCachedQuestionsBatch(hashes) {
    if (!this.isCacheActive() || !hashes || !Array.isArray(hashes) || hashes.length === 0) return {};
    try {
      const validHashes = hashes.filter(Boolean);
      if (validHashes.length === 0) return {};
      const hashList = validHashes.map(h => `"${h}"`).join(',');
      const supabase = this.getSupabaseConfig();

      const res = await fetch(`${supabase.URL}/rest/v1/questions_cache?question_hash=in.(${hashList})&select=*`, {
        method: 'GET',
        headers: {
          'apikey': supabase.ANON_KEY,
          'Authorization': `Bearer ${supabase.ANON_KEY}`
        }
      });
      if (!res.ok) return {};
      const items = await res.json();
      const map = {};
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (item && item.question_hash) {
            map[item.question_hash] = item;
          }
        });
      }
      return map;
    } catch (err) {
      return {};
    }
  }

  async saveQuestionToCache(hash, questionText, translatedText, answerData) {
    if (!this.isCacheActive() || !hash || !answerData) return;
    try {
      const supabase = this.getSupabaseConfig();
      fetch(`${supabase.URL}/rest/v1/questions_cache`, {
        method: 'POST',
        headers: {
          'apikey': supabase.ANON_KEY,
          'Authorization': `Bearer ${supabase.ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=ignore-duplicates'
        },
        body: JSON.stringify({
          question_hash: hash,
          question_text: (questionText || '').slice(0, 1000),
          translated_text: translatedText || null,
          answer: answerData,
          created_at: new Date().toISOString()
        })
      }).catch(() => {});
    } catch (err) {}
  }
}

globalThis.SupabaseCacheService = SupabaseCacheService;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SupabaseCacheService };
}
