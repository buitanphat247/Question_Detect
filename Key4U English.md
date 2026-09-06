---
title: Key4U English
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Key4U English

MiniMax Text-to-Audio API with support for streaming and non-streaming output

Base URLs:

* <a href="https://api.key4u.vn">Prod Env: https://api.key4u.vn</a>

Web: <a href="https://platform.minimaxi.com">MiniMax API Support</a> 
 License: MIT

# Authentication

- HTTP Authentication, scheme: bearer

# Key4U English/Text-to-Music/Suno/Task Submission

## POST Generate Song (Integrated)

POST /suno/submit/music

# Integration Steps

## A. Generate Music

After generating a song through the song generation API, obtain the `clip_id` of one of the songs: 54834687-5e79-4f08-8e14-cf188f15b598

## B. Create a Persona

- The `clip_id` must already exist in the system and must not be from an uploader
- It cannot be used across accounts, so it may become unavailable if the account goes offline

## C. Create Using persona_id

Notes:
- mv must be `chirp-v3-5-tau` or `chirp-v4-tau`
- task must be `artist_consistency`
- persona_id is the value obtained in Step B
- artist_clip_id is the `clip_id` from Step A
- Can be used across accounts

> Body Parameters

```json
{
    "gpt_description_prompt": "A light, upbeat jazz piano piece suitable as background music for a cafe",
    "mv": "chirp-v4"
}
```

```json
{
    "prompt": "verse: The night breeze blows gently
chorus: Starlight illuminates the earth",
    "tags": "pop, piano, emotional",
    "title": "Promise Under the Starlight",
    "mv": "chirp-v4"
}
```

```json
{
    "tags": "ambient, electronic, calm",
    "mv": "chirp-v4",
    "make_instrumental": true
}
```

```json
{
    "tags": "classical, piano",
    "title": "Morning Light Overture",
    "mv": "chirp-v4",
    "make_instrumental": true
}
```

```json
{
    "gpt_description_prompt": "Test the default model version"
}
```

```json
{
    "task": "sound",
    "mv": "chirp-v5",
    "metadata_params": {
        "sound": "bird sound",
        "type": "loop"
    }
}
```

```json
{
    "continue_clip_id": "{{clip_id}}",
    "continue_at": 30.5,
    "prompt": "Make this section more intense and add a drumbeat",
    "mv": "chirp-v4"
}
```

```json
{
    "continue_clip_id": "{{clip_id}}",
    "continue_at": 20,
    "task_id": "{{task_id}}",
    "prompt": "Continue with the second half",
    "mv": "chirp-v4"
}
```

```json
{
    "gpt_description_prompt": "Create a new pop song inspired by the atmosphere of this audio clip",
    "artist_clip_id": "{{clip_id}}",
    "tags": "pop, emotional",
    "mv": "chirp-v5"
}
```

```json
{
    "task": "artist_consistency",
    "persona_id": "{{persona_id}}",
    "artist_clip_id": "{{clip_id}}",
    "prompt": "[Verse]
Test lyrics",
    "tags": "pop",
    "title": "Artist Style Test",
    "mv": "chirp-v5"
}
```

```json
{
    "task": "cover",
    "prompt": "Cover this song in a female pop vocal style",
    "tags": "pop, female vocal",
    "mv": "chirp-v5",
    "metadata_params": {
        "clip_id": "{{clip_id}}"
    }
}
```

```json
{
    "task": "remaster",
    "prompt": "Preserve the original song's style while making moderate changes",
    "tags": "pop",
    "title": "Remaster Test",
    "mv": "chirp-v5",
    "metadata_params": {
        "clip_id": "{{clip_id}}",
        "variation_category": "normal"
    }
}
```

```json
{
    "task": "infill",
    "mv": "chirp-v4-5",
    "prompt": "[Verse]\
Previous lyrics context",
    "continue_clip_id": "{{clip_id}}",
    "metadata_params": {
        "infill_start_s": 28.48,
        "infill_end_s": 53.16,
        "infill_context_start_s": 1.44,
        "infill_context_end_s": 80.2
    }
}
```

```json
{
    "task": "infill",
    "continue_clip_id": "{{clip_id}}",
    "prompt": "[Verse]\
Previous lyrics context",
    "mv": "chirp-v4-5",
    "metadata_params": {
        "infill_start_s": 28.48,
        "infill_end_s": 53.16,
        "infill_context_start_s": 1.44,
        "infill_context_end_s": 80.2,
        "metadata": {
            "infill_lyrics": "[Verse]\
Here are the new replacement lyrics"
        }
    }
}
```

```json
{
    "task": "underpainting",
    "title": "Add Accompaniment Test",
    "tags": "ambient",
    "mv": "chirp-v5",
    "metadata_params": {
        "underpainting_clip_id": "{{clip_id}}",
        "underpainting_start_s": 0,
        "underpainting_end_s": 30
    }
}
```

```json
{
    "task": "underpainting",
    "prompt": "Add a gentle female vocal verse",
    "tags": "pop, female vocal",
    "title": "Add Vocals Test",
    "make_instrumental": false,
    "mv": "chirp-v5",
    "metadata_params": {
        "underpainting_clip_id": "{{clip_id}}",
        "underpainting_start_s": 0,
        "underpainting_end_s": 30
    }
}
```

```json
{
    "task": "vox",
    "artist_clip_id": "{{clip_id}}",
    "prompt": "Generate a complete pop song based on the hummed melody",
    "tags": "pop, piano",
    "title": "Humming-to-Song Test",
    "mv": "chirp-v5"
}
```

```json
{
    "mv": "chirp-v5",
    "make_instrumental": false,
    "prompt": "[Verse 1]
The sun climbs above the little windowsill
...",
    "tags": "",
    "title": "Song A x Song B (Mashup)",
    "task": "mashup_condition",
    "metadata_params": {
        "mashup_clip_ids": [
            "498c3c1b-c538-4857-866e-31b35d752efd",
            "5469b97c-3bab-49d7-8d05-bc13d6df48b3"
        ]
    }
}
```

```json
Write a warm, upbeat pop song inspired by the atmosphere of this image, with female vocals, a moderate tempo, and a feel suited to afternoon sunshine
```

```json
{
    "task": "upload_extend",
    "prompt": "Continue extending the uploaded audio with fuller emotion",
    "tags": "pop, emotional",
    "title": "Post-Upload Continuation Test",
    "mv": "chirp-v4",
    "make_instrumental": false,
    "continue_clip_id": "{{clip_id}}",
    "continue_at": 15,
    "metadata_params": {
        "clip_id": "{{clip_id}}"
    }
}
```

```json
{
    "task": "fixed_infill",
    "mv": "chirp-v4-5",
    "prompt": "[Verse]
Preserve the lyrical context before and after",
    "tags": "pop",
    "title": "Fixed-Range Section Infill",
    "continue_clip_id": "{{clip_id}}",
    "metadata_params": {
        "continue_clip_id": "{{clip_id}}",
        "continued_aligned_prompt": "[Verse]
Preserve the lyrical context before and after",
        "infill_start_s": 20,
        "infill_end_s": 40,
        "infill_context_start_s": 0,
        "infill_context_end_s": 90
    }
}
```

```json
{
    "task": "infill_intro",
    "mv": "chirp-v4-5",
    "prompt": "[Intro]
New opening section",
    "title": "Intro Infill Test",
    "continue_clip_id": "{{clip_id}}",
    "metadata_params": {
        "infill_start_s": 0,
        "infill_end_s": 12,
        "infill_context_start_s": 0,
        "infill_context_end_s": 60,
        "metadata": {
            "infill_lyrics": "[Intro]
Brand-new opening lyrics"
        }
    }
}
```

```json
{
    "task": "infill_outro",
    "mv": "chirp-v4-5",
    "prompt": "[Outro]
Fade out",
    "title": "Outro Infill Test",
    "continue_clip_id": "{{clip_id}}",
    "metadata_params": {
        "infill_start_s": 75,
        "infill_end_s": 95,
        "infill_context_start_s": 50,
        "infill_context_end_s": 120
    }
}
```

```json
{
    "task": "cover_infill",
    "mv": "chirp-v4-5",
    "prompt": "[Verse]
Partial re-singing in Cover style",
    "tags": "rock, cover",
    "title": "Cover Partial Edit",
    "continue_clip_id": "{{clip_id}}",
    "metadata_params": {
        "clip_id": "{{clip_id}}",
        "infill_start_s": 30,
        "infill_end_s": 55,
        "infill_context_start_s": 5,
        "infill_context_end_s": 85
    }
}
```

```json
{
    "task": "cover_extend",
    "prompt": "Continue the Cover section, emphasizing the guitar and drum beat",
    "tags": "rock, energetic",
    "title": "Cover Extension",
    "mv": "chirp-v4",
    "continue_clip_id": "{{clip_id}}",
    "continue_at": 45,
    "metadata_params": {
        "clip_id": "{{clip_id}}"
    }
}
```

```json
{
    "task": "artist_infill",
    "persona_id": "{{persona_id}}",
    "artist_clip_id": "{{clip_id}}",
    "mv": "chirp-v4-tau",
    "prompt": "[Verse] Keep the singer's vocal timbre and change only this section",
    "title": "Persona Partial Section Infill",
    "continue_clip_id": "{{clip_id}}",
    "metadata_params": {
        "persona_id": "{{persona_id}}",
        "artist_clip_id": "{{clip_id}}",
        "infill_start_s": 25,
        "infill_end_s": 48,
        "infill_context_start_s": 0,
        "infill_context_end_s": 80
    }
}
```

```json
{
    "task": "video_to_song",
    "gpt_description_prompt": "Compose an electronic ambient track with a cinematic feel based on the rhythm of the video footage",
    "tags": "electronic, cinematic, ambient",
    "title": "Video-to-Song Test",
    "mv": "chirp-v4",
    "make_instrumental": false,
    "metadata_params": {
        "video_url": "https://your-domain/path/to/reference.mp4"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes | SunoSubmitMusicRequest|none|
|» gpt_description_prompt|body|string| no ||Inspiration mode description. This field and `prompt` have branching precedence: when this field is present, use inspiration mode (`inputType=10`); do not treat them as fields that can be populated simultaneously.|
|» prompt|body|string| no ||Custom lyrics/text. When `prompt` is provided and `gpt_description_prompt` is absent, custom mode is used (`inputType=20`). During infill, it can also be automatically injected as `continued_aligned_prompt`.|
|» mv|body|string| no ||Model version. Open defaults to chirp-v5; artist_consistency is supported only by chirp-v3-5-tau / chirp-v4-tau; custom duration is supported only by chirp-v5-5.|
|» title|body|string| no ||Song Title|
|» tags|body|string| no ||Style tags, comma-separated|
|» continue_at|body|number| no ||Continuation start time in seconds, used with continue_clip_id|
|» continue_clip_id|body|string(uuid)| no ||The source clip_id for continuation/segment extension must come from the song.id returned by a previous fetch request and must not be fabricated.|
|» make_instrumental|body|boolean| no ||Instrumental music (no lyrics). Stability may vary across different inputType branches; testing each branch separately is recommended.|
|» duration|body|number| no ||Custom mode target duration (seconds). Open 114 only; upstream, this takes effect only when mv=chirp-v5-5; it is ignored in Inspiration mode.|
|» negative_tags|body|string| no ||Style tags excluded in custom mode (comma-separated; maps to the upstream `negativeTags`). This does not apply in inspiration mode.|
|» task_id|body|string| no ||Associated original task ID, used for channel routing (optional)|
|» task|body|string| no ||Special task type; if omitted, standard generation is used|
|» persona_id|body|string| no ||Persona ID, obtained via fetch after POST /suno/submit/persona succeeds|
|» artist_clip_id|body|string(uuid)| no ||Source track clip_id, used for artist_consistency; usually equal to the root_clip_id used when creating the Persona|
|» clip_id|body|string(uuid)| no ||Single source clip ID; when creating a Persona, clip_id can be used instead of root_clip_id|
|» root_clip_id|body|string(uuid)| no ||Persona creates the source track `clip_id`, obtained from `fetch`|
|» cover_clip_id|body|string(uuid)| no ||[PASTE YOUR CHINESE TEXT HERE]|
|» metadata_params|body|object| no ||none|
|» metadata|body|object| no ||Extension field; parameters can be passed via metadata.task or metadata.metadata_params (use either this or the top-level field).|
|»» task|body|string| no ||Equivalent to a top-level task|
|»» metadata_params|body|object| no ||none|
|»» metadataParams|body|object| no ||none|
|» callback_url|body|string(uri)| no ||Upstream task completion callback URL|
|» image_url|body|string(uri)| no ||Image URLs for scenarios such as image_to_song|
|» language|body|string| no ||Language code|

#### Description

**» cover_clip_id**: [PASTE YOUR CHINESE TEXT HERE]
"Cover scene clip reference"

#### Enum

|Name|Value|
|---|---|
|» task|extend|
|» task|upload_extend|
|» task|infill|
|» task|fixed_infill|
|» task|infill_intro|
|» task|infill_outro|
|» task|cover_infill|
|» task|cover_extend|
|» task|artist_infill|
|» task|artist_consistency|
|» task|cover|
|» task|image_to_song|
|» task|video_to_song|
|» task|concat|
|» task|sound|
|» task|underpainting|
|» task|remaster|
|» task|vox|
|» task|mashup_condition|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "1268154180129529857"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|
|» data|string|true|none||none|

## POST Generate Song (Concatenate Song)

POST /suno/submit/concat

[PASTE YOUR CHINESE TEXT HERE]
" Concatenate after extending the song"

> Body Parameters

```json
{
  "clip_id": "4b2300c2-f200-4011-8f80-e3401da28c4f"      // clipId returned by continuation
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» clip_id|body|string| yes ||The clipId returned by continuation|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Create a Singer Persona

POST /suno/submit/persona

> Body Parameters

```json
{
  "root_clip_id": "518d910f-a6b7-43fc-9f65-c9f116f3f8a3",  // Source song clipId; clip_id can also be used
  "vocal_start_s": 10,                                   // Vocal segment start time in seconds
  "vocal_end_s": 30,                                     // Vocal segment end time in seconds; must be greater than start
  "user_input_styles": "pop,female voice"                // Style description; tags can be used instead
}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» root_clip_id|body|string| yes ||Source song clipId; clip_id can also be used|
|» vocal_start_s|body|integer| yes ||Vocal clip start time (seconds)|
|» vocal_end_s|body|integer| yes ||Vocal segment end time in seconds; must be greater than start|
|» user_input_styles|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|

#### Description

**» user_input_styles**: [PASTE YOUR CHINESE TEXT HERE]
"Style description; tags can be used instead"

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Generate Lyrics

POST /suno/submit/lyrics

> Body Parameters

```json
{
  "prompt": "my love"                                    // Lyrics theme/keywords
}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» prompt|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|

#### Description

**» prompt**: [PASTE YOUR CHINESE TEXT HERE]
"Lyrics Theme/Keywords"

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Enhance the musical style

POST /suno/submit/upsample-tags

> Body Parameters

```json
{
  "original_tags": "deep house, emotional, melodic"                  // Original style description
}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» original_tags|body|string| yes ||Original Style Description|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Upload copyrighted songs

POST /suno/uploads/audio

> Body Parameters

```json
{
    "url": "https://cdn1.suno.ai/ad94e107-37a2-4ee1-acbe-9138a47b07b7.mp3?v=1.6",
    "name": "Rivers and Seas",
    "uploadType": "MUSIC_COPYRIGHT",
    "speedMultiplier": 1.0,
    "speedMultiplierFix": true
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» url|body|string| yes ||The source URL of the reference audio file, such as https://cdn1.suno.ai/xxx.mp3|
|» name|body|string| yes ||Song Title|
|» upload_type|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|
|» speed_multiplier|body|number| yes ||Adjust the speed before uploading. Value range: [0.25, 2.0]|
|» speed_multiplier_fix|body|boolean| yes ||Whether to restore the speed. true = restore the original speed; false = retain the adjusted speed|

#### Description

**» upload_type**: [PASTE YOUR CHINESE TEXT HERE]
"Upload type. NORMAL=standard upload (free); MUSIC_COPYRIGHT=copyright upload (costs 30 points). Set this API parameter to MUSIC_COPYRIGHT."

#### Enum

|Name|Value|
|---|---|
|» upload_type|NORMAL|
|» upload_type|MUSIC_COPYRIGHT|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Text-to-Music/Suno/Query Interface

## GET Query a Single Task (Primary)

GET /suno/fetch/{task_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||Task ID|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Timing: Lyrics, Audio Timeline

GET /suno/act/timing/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||clipId|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get WAV

GET /suno/act/wav/{clip_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|clip_id|path|string| yes ||clipId|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Batch Retrieve Tasks

POST /suno/fetch

> Body Parameters

```json
{
  "ids": ["1264606079846457344"],                        // taskBatchId array
  "action": ""                                           // nullable
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» ids|body|[string]| yes ||array|
|» action|body|string| yes ||Nullable|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET My Music List

GET /suno/act/my-musics

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|pageNum|query|string| no ||none|
|pageSize|query|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Generate MIDI

GET /suno/act/midi

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|clipId|query|string| yes ||none|
|stemClipId|query|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Waveform Data

GET /suno/act/waveform

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|clipId|query|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET MP4 Generation Status

GET /suno/act/mp4-state

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|taskBatchId|query|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Account Points Balance

GET /suno/account/integral

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get Music Genre

GET /suno/act/music-style

> Response Examples

> 200 Response

```json
{
    "code": 200,
    "msg": "Operation successful",
    "total": 17,
    "data": [
        {
            "createTime": "2026-06-12T14:43:12.000+08:00",
            "id": "2065324014708158466",
            "inputType": "10",
            "makeInstrumental": false,
            "prompt": "[Instrumental]",
            "gptDescriptionPrompt": "A light, upbeat jazz piano piece suitable as background music for a coffee shop",
            "title": "Afternoon Coffee Cup",
            "tags": "Jazz piano instrumental, light upbeat swing feel with brushed ride cymbal, walking bass, and crisp syncopated left-hand comping; intro starts with solo piano and coffee-shop room tone, verse section adds bass and soft brushes, middle lifts with bright passing chords and a playful turnaround, final section opens with fuller piano flourishes and a gentle tag. Close, intimate piano tone with warm vintage glow, subtle vinyl crackle, and a clean, cozy mix.",
            "clipId": "9fbef640-3a1e-49a0-8240-1e4491392c77",
            "duration": 114.8,
            "progress": 100,
            "waitNum": 0,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/9fbef640-3a1e-49a0-8240-1e4491392c77.mp3",
            "progressMsg": "Production completed",
            "cld2VideoUrl": "",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_9fbef640-3a1e-49a0-8240-1e4491392c77.jpeg"
        },
        {
            "createTime": "2026-06-12T14:43:12.000+08:00",
            "id": "2065324014708158465",
            "inputType": "10",
            "makeInstrumental": false,
            "prompt": "[Instrumental]",
            "gptDescriptionPrompt": "A light, upbeat jazz piano piece suitable as background music for a coffee shop",
            "title": "Afternoon Coffee Cup",
            "tags": "Jazz piano instrumental, light upbeat swing feel with brushed ride cymbal, walking bass, and crisp syncopated left-hand comping; intro starts with solo piano and coffee-shop room tone, verse section adds bass and soft brushes, middle lifts with bright passing chords and a playful turnaround, final section opens with fuller piano flourishes and a gentle tag. Close, intimate piano tone with warm vintage glow, subtle vinyl crackle, and a clean, cozy mix.",
            "clipId": "227c8897-2216-45eb-83bd-70e52375027d",
            "duration": 96.36,
            "progress": 100,
            "waitNum": 0,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/227c8897-2216-45eb-83bd-70e52375027d.mp3",
            "progressMsg": "Production completed",
            "cld2VideoUrl": "",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_227c8897-2216-45eb-83bd-70e52375027d.jpeg"
        },
        {
            "createTime": "2026-06-12T14:25:05.000+08:00",
            "id": "2065319458364276738",
            "inputType": "fade",
            "prompt": "[Intro]
[staccato synth riff, palm-muted electric guitar, steady kick drum]
Da da da da da da da da
Da da da da da da da da
[snare enters]
Hey!
[falsetto vocalization]
Oh
Yeah
Da da da da da da da da
Da da da da da da da da
Da da da da da da da da
Da da

[Verse 1]
[bass guitar enters]
The sun climbs onto my shoulder straps
Da da da da da da da da
Da da da da da da da da
The sun climbs onto my shoulder straps
Da da da da da da da da
Da da da da da da da da",
            "title": "Reference Audio (Fade In)",
            "tags": "Mandopop with electronic and rock elements. A clean electric guitar plays a syncopated, palm-muted rhythmic pattern alongside a bright, staccato synthesizer riff. The drums feature a crisp snare and a steady kick. A female vocalist performs with a clear, melodic tone, utilizing falsetto during the chorus. The bass guitar follows the kick drum with a rounded, warm tone. The arrangement includes layered vocal harmonies and occasional synth swells. Key of G Major, 128 BPM.",
            "clipId": "6c45fcd7-457f-4616-b7b6-6e21cf0372b4",
            "duration": 44.52,
            "progress": 100,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/6c45fcd7-457f-4616-b7b6-6e21cf0372b4.mp3",
            "progressMsg": "Production completed",
            "cld2VideoUrl": "",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_6c45fcd7-457f-4616-b7b6-6e21cf0372b4.jpeg"
        },
        {
            "createTime": "2026-06-12T14:06:13.000+08:00",
            "id": "2065314707077820418",
            "inputType": "adjustSpeed",
            "prompt": "[Instrumental]",
            "gptDescriptionPrompt": "https://cdn1.suno.ai/a3911719-eded-4585-a4bb-90ea52d786b5.mp3",
            "title": "Beside the Coffee Cup (1.5x)",
            "tags": "Jazz piano instrumental with a light bouncy swing feel, brushed-swing rhythm and walking bass; intro opens on solo upright piano with soft room tone, verse-like sections add brushed drums and a warm bass pulse, then a small chorus lift brings brighter piano runs and syncopated chord hits before settling back into a gentle outro. Sparse tasteful fills, occasional glockenspiel sparkles, subtle vinyl crackle, intimate close-mic and cozy café mix.",
            "clipId": "421054bd-8721-4b63-8aef-e863bb1ee991",
            "duration": 148.36,
            "progress": 100,
            "status": 30,
            "cld2AudioUrl": "https://file.dzwlai.com/suno/music/api/000/047/722/1272194363468537857.mp3",
            "progressMsg": "Production completed",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_a3911719-eded-4585-a4bb-90ea52d786b5.jpeg"
        },
        {
            "createTime": "2026-06-12T11:55:43.000+08:00",
            "id": "2065281868781285379",
            "inputType": "10",
            "makeInstrumental": false,
            "prompt": "[Instrumental]",
            "gptDescriptionPrompt": "A light, upbeat jazz piano piece suitable as background music for a coffee shop",
            "title": "Beside the Coffee Cup",
            "tags": "Jazz piano instrumental with a light bouncy swing feel, brushed-swing rhythm and walking bass; intro opens on solo upright piano with soft room tone, verse-like sections add brushed drums and a warm bass pulse, then a small chorus lift brings brighter piano runs and syncopated chord hits before settling back into a gentle outro. Sparse tasteful fills, occasional glockenspiel sparkles, subtle vinyl crackle, intimate close-mic and cozy café mix.",
            "clipId": "beda6002-727e-4ad6-b10b-0923dc35a381",
            "duration": 103.92,
            "progress": 100,
            "waitNum": 0,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/beda6002-727e-4ad6-b10b-0923dc35a381.mp3",
            "progressMsg": "Production completed",
            "cld2VideoUrl": "",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_beda6002-727e-4ad6-b10b-0923dc35a381.jpeg"
        },
        {
            "createTime": "2026-06-12T11:55:43.000+08:00",
            "id": "2065281868781285378",
            "inputType": "10",
            "makeInstrumental": false,
            "prompt": "[Instrumental]",
            "gptDescriptionPrompt": "A light, upbeat jazz piano piece suitable as background music for a coffee shop",
            "title": "Beside the Coffee Cup",
            "tags": "Jazz piano instrumental with a light bouncy swing feel, brushed-swing rhythm and walking bass; intro opens on solo upright piano with soft room tone, verse-like sections add brushed drums and a warm bass pulse, then a small chorus lift brings brighter piano runs and syncopated chord hits before settling back into a gentle outro. Sparse tasteful fills, occasional glockenspiel sparkles, subtle vinyl crackle, intimate close-mic and cozy café mix.",
            "clipId": "a3911719-eded-4585-a4bb-90ea52d786b5",
            "duration": 148.36,
            "progress": 100,
            "waitNum": 0,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/a3911719-eded-4585-a4bb-90ea52d786b5.mp3",
            "progressMsg": "Production completed",
            "cld2VideoUrl": "https://cdn1.suno.ai/a3911719-eded-4585-a4bb-90ea52d786b5.mp4",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_a3911719-eded-4585-a4bb-90ea52d786b5.jpeg"
        },
        {
            "createTime": "2026-06-05T10:13:55.000+08:00",
            "id": "2062719535512956930",
            "inputType": "10",
            "makeInstrumental": false,
            "prompt": "[Verse 1]
I push the door open
And the wind rushes in first
I don't feel like spacing out today
I want to turn my heartbeat inside out

I tie my shoelaces any old way
And set my worries aside
You see me smile
And even the air turns sweet

[Pre-Chorus]
Don't ask me why
I can't explain it either
I just want to follow the beat
Keep moving forward, never stop

There's light in my eyes
And sparks in my palms
In the very next second
I'll turn up the joy

[Chorus]
A little more upbeat
A little more upbeat
Today, I'll be a little more upbeat

Spin around with me
Spin around with me
Spin all the sadness farther away

A little more upbeat
A little more upbeat
A whole sky opens up in my heart

The moment you appear
All I want is to be
A little more upbeat

[Verse 2]
Outside the bus window flashes
A whole row of old buildings
I bite into a piece of candy
And even the flavor lights up

A message chimes
It turns out you're asking
If I want to go for a walk
And catch the sunset along the way

[Pre-Chorus]
Don't ask me why
I can't explain it either
I just want to follow the beat
Keep moving forward, never stop

There's light in my eyes
And sparks in my palms
In the very next second
I'll turn up the joy

[Chorus]
A little more upbeat
A little more upbeat
Today, I'll be a little more upbeat

Spin around with me
Spin around with me
Spin all the sadness farther away

A little more upbeat
A little more upbeat
A whole sky opens up in my heart

The moment you appear
All I want is to be
A little more upbeat

[Bridge]
Fold up yesterday
And tuck it into a drawer
Let a new breeze
Blow this way

When you smile
The whole world softens
Together, we can
Take it slow

[Final Chorus]
A little more upbeat
A little more upbeat
Today, I'll be a little more upbeat

Spin around with me
Spin around with me
Spin all the sadness farther away

A little more upbeat
A little more upbeat
A whole sky opens up in my heart

With you by my side
All I want is to be
A little more upbeat",
            "gptDescriptionPrompt": "An upbeat pop test",
            "title": "Little Windblown Test",
            "tags": "Pop with bright four-on-the-floor pulse and syncopated handclaps; verse rides light synth plucks and tight bass, pre-chorus pulls back to filtered pads and rising percussion, chorus opens wide with stacked harmonies and a chantable hook. Lead vocal stays close-mic and playful with doubled chorus lines, little breathy ad-libs, and short delay throws on the hook word. Use sparkling risers, reversed swells, and a tiny bell sparkle between phrases. Bright, glossy, radio-ready mix with punchy low end., pop",
            "clipId": "bfad77a3-7aee-4ac0-a140-b084697d2048",
            "duration": 184.96,
            "progress": 100,
            "waitNum": 0,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/bfad77a3-7aee-4ac0-a140-b084697d2048.mp3",
            "progressMsg": "Production completed",
            "cld2VideoUrl": "",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_bfad77a3-7aee-4ac0-a140-b084697d2048.jpeg"
        },
        {
            "createTime": "2026-06-05T10:13:55.000+08:00",
            "id": "2062719535512956929",
            "inputType": "10",
            "makeInstrumental": false,
            "prompt": "[Verse 1]
I push the door open
And the wind rushes in first
I don't feel like spacing out today
I want to turn my heartbeat inside out

I tie my shoelaces any old way
And set my worries aside
You see me smile
And even the air turns sweet

[Pre-Chorus]
Don't ask me why
I can't explain it either
I just want to follow the beat
Keep moving forward, never stop

There's light in my eyes
And sparks in my palms
In the very next second
I'll turn up the joy

[Chorus]
A little more upbeat
A little more upbeat
Today, I'll be a little more upbeat

Spin around with me
Spin around with me
Spin all the sadness farther away

A little more upbeat
A little more upbeat
A whole sky opens up in my heart

The moment you appear
All I want is to be
A little more upbeat

[Verse 2]
Outside the bus window flashes
A whole row of old buildings
I bite into a piece of candy
And even the flavor lights up

A message chimes
It turns out you're asking
If I want to go for a walk
And catch the sunset along the way

[Pre-Chorus]
Don't ask me why
I can't explain it either
I just want to follow the beat
Keep moving forward, never stop

There's light in my eyes
And sparks in my palms
In the very next second
I'll turn up the joy

[Chorus]
A little more upbeat
A little more upbeat
Today, I'll be a little more upbeat

Spin around with me
Spin around with me
Spin all the sadness farther away

A little more upbeat
A little more upbeat
A whole sky opens up in my heart

The moment you appear
All I want is to be
A little more upbeat

[Bridge]
Fold up yesterday
And tuck it into a drawer
Let a new breeze
Blow this way

When you smile
The whole world softens
Together, we can
Take it slow

[Final Chorus]
A little more upbeat
A little more upbeat
Today, I'll be a little more upbeat

Spin around with me
Spin around with me
Spin all the sadness farther away

A little more upbeat
A little more upbeat
A whole sky opens up in my heart

With you by my side
All I want is to be
A little more upbeat",
            "gptDescriptionPrompt": "An upbeat pop test",
            "title": "Little Windblown Test",
            "tags": "Pop with bright four-on-the-floor pulse and syncopated handclaps; verse rides light synth plucks and tight bass, pre-chorus pulls back to filtered pads and rising percussion, chorus opens wide with stacked harmonies and a chantable hook. Lead vocal stays close-mic and playful with doubled chorus lines, little breathy ad-libs, and short delay throws on the hook word. Use sparkling risers, reversed swells, and a tiny bell sparkle between phrases. Bright, glossy, radio-ready mix with punchy low end., pop",
            "clipId": "d0c1b22f-8959-4d9f-836b-d8bd7b47fdac",
            "duration": 171.12,
            "progress": 100,
            "waitNum": 0,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/d0c1b22f-8959-4d9f-836b-d8bd7b47fdac.mp3",
            "progressMsg": "Production completed",
            "cld2VideoUrl": "",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_d0c1b22f-8959-4d9f-836b-d8bd7b47fdac.jpeg"
        },
        {
            "createTime": "2026-06-05T09:51:56.000+08:00",
            "id": "2062714000214470658",
            "inputType": "createPersona",
            "prompt": "[Intro]
[Verse]
Thursday sunshine warms my face
A gentle breeze blows through the window
Friends gather together, busy singing
Laughter drifts through the air

[Verse]
The lawn unfolds with the fragrance of flowers
Everyone sits together in a circle
The guitar plays a lingering melody
And happiness flows just like this

[Chorus]
Thursday joy never ends
Cheers and laughter fill our hearts
Gathering with friends is truly unforgettable
These happy times will never be forgotten

[Verse]
Night falls and the stars shine bright
We dance beside the bonfire
Forget our troubles and set our spirits free
This day is our treasure

[Verse]
The beer is cold, but our palms are warm
We chat and laugh without end
No matter how busy tomorrow is, we still have to party
Thursday joy lasts forever

[Pre-Chorus]
Looking back, the laughter is sweet
There are even more wonderful moments ahead
Thursday joy, every day
Let life be filled with color

[Chorus]
Thursday joy never ends
Cheers and laughter fill our hearts
Gathering with friends is truly unforgettable
These happy times will never be forgotten
",
            "title": "Singing for You",
            "tags": "pop,female voice",
            "duration": 216.56,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/518d910f-a6b7-43fc-9f65-c9f116f3f8a3.mp3",
            "progressMsg": "Production completed",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_518d910f-a6b7-43fc-9f65-c9f116f3f8a3.jpeg",
            "result": {
                "artist_clip_id": "820fbb29-78fc-4b16-942c-34b2978c80e6",
                "persona_id": "273afb09-71d4-4104-9e2e-244eae272bec",
                "name": "Singing for You"
            }
        },
        {
            "createTime": "2026-06-05T09:41:48.000+08:00",
            "id": "2062711452644552705",
            "inputType": "createPersona",
            "prompt": "[Intro]
[Verse]
Thursday sunshine warms my face
A gentle breeze blows through the window
Friends gather together, busy singing
Laughter drifts through the air

[Verse]
The lawn unfolds with the fragrance of flowers
Everyone sits together in a circle
The guitar plays a lingering melody
And happiness flows just like this

[Chorus]
Thursday joy never ends
Cheers and laughter fill our hearts
Gathering with friends is truly unforgettable
These happy times will never be forgotten

[Verse]
Night falls and the stars shine bright
We dance beside the bonfire
Forget our troubles and set our spirits free
This day is our treasure

[Verse]
The beer is cold, but our palms are warm
We chat and laugh without end
No matter how busy tomorrow is, we still have to party
Thursday joy lasts forever

[Pre-Chorus]
Looking back, the laughter is sweet
There are even more wonderful moments ahead
Thursday joy, every day
Let life be filled with color

[Chorus]
Thursday joy never ends
Cheers and laughter fill our hearts
Gathering with friends is truly unforgettable
These happy times will never be forgotten
",
            "title": "Singing for You",
            "tags": "pop,female voice",
            "duration": 216.56,
            "status": 30,
            "cld2AudioUrl": "https://cdn1.suno.ai/518d910f-a6b7-43fc-9f65-c9f116f3f8a3.mp3",
            "progressMsg": "Production completed",
            "cld2ImageUrl": "https://cdn2.suno.ai/image_518d910f-a6b7-43fc-9f65-c9f116f3f8a3.jpeg",
            "result": {
                "artist_clip_id": "820fbb29-78fc-4b16-942c-34b2978c80e6",
                "persona_id": "273afb09-71d4-4104-9e2e-244eae272bec",
                "name": "Singing for You"
            }
        }
    ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Text-to-Music/Suno/Audio Processing

## POST Vocal/Accompaniment Separation (clipId)

POST /suno/submit/stems

Separate vocals and accompaniment by clipId. Costs 0 credits and runs asynchronously. Returns taskBatchId; poll using the query API.

> Body Parameters

```json
{
    "clip_id": "227c8897-2216-45eb-83bd-70e52375027d"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» clip_id|body|string| yes ||Song clipId|
|» callback_url|body|string| no ||Task completion callback URL. Leave blank to disable callbacks.|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "1268154180129529857"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|
|» data|string|true|none||taskBatchId|

## POST Vocals/Accompaniment Separation (URL)

POST /suno/submit/stems-by-url

Separate vocals and accompaniment by URL, 0 credits, asynchronous.

> Body Parameters

```json
{
    "url": "https://example.com/audio.mp3"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» url|body|string| yes ||Audio file URL|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "1268154180129529857"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|
|» data|string|true|none||taskBatchId|

## POST Full-track 12-channel separation (clipId)

POST /suno/submit/stems-all

Full-track 12-stem separation, asynchronous. Returns taskBatchId.

> Body Parameters

```json
{
    "clip_id": "9846ddf3-f154-4198-aad9-2652c22aa879"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes | SunoSubmitStemsAllRequest|none|
|» clip_id|body|string| no ||Song clip_id; stems-all is required. Mutually exclusive with url (by path).|
|» type|body|string| no ||Separation mode; defaults to split_stemsAll if omitted (12 stems, 50 credits)|
|» stem_task|body|string| no ||split_stemsAll defaults to twelve; the extract class defaults to extract|
|» stem_name|body|string| no ||Required when type is split_stem or split_stem_advanced. Examples: Lead Vocal, Drum Kit, Bass (see the gateway's NormalizeStemsAllRequest for the complete list).|

#### Enum

|Name|Value|
|---|---|
|» type|split_stemsAll|
|» type|split_stem|
|» type|split_stem_advanced|
|» stem_task|twelve|
|» stem_task|extract|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "1268154180129529857"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|
|» data|string|true|none||taskBatchId|

## POST Full-Track 12-Channel Separation (URL)

POST /suno/submit/stems-all-by-url

Full-track separation by URL, 0 credits, asynchronous.

> Body Parameters

```json
{
    "url": "https://example.com/audio.mp3"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes | SunoSubmitStemsAllRequest|none|
|» url|body|string(uri)| no ||Audio URL; used only by stems-all-by-url. Mutually exclusive with clip_id (depending on the route)|
|» type|body|string| no ||Separation mode; defaults to split_stemsAll if omitted (12 stems, 50 credits)|
|» stem_task|body|string| no ||split_stemsAll defaults to twelve; the extract class defaults to extract|
|» stem_name|body|string| no ||Required when type is split_stem or split_stem_advanced. Examples: Lead Vocal, Drum Kit, Bass (see the gateway's NormalizeStemsAllRequest for the complete list).|

#### Enum

|Name|Value|
|---|---|
|» type|split_stemsAll|
|» type|split_stem|
|» type|split_stem_advanced|
|» stem_task|twelve|
|» stem_task|extract|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "1268154180129529857"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|
|» data|string|true|none||taskBatchId|

## POST Generate MP4 Video

POST /suno/submit/mp4

Generate an MP4 video, 0 credits, asynchronous.

> Body Parameters

```json
{
    "clip_id": "9846ddf3-f154-4198-aad9-2652c22aa879"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» clip_id|body|string| yes ||Song clipId|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "1268154180129529857"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|
|» data|string|true|none||taskBatchId|

## POST Regenerate the cover image

POST /suno/submit/regen-img

Regenerate the cover, 0 credits, asynchronously.

> Body Parameters

```json
{
    "task_batch_id": "1265431382265176065"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» task_batch_id|body|string| yes ||Task taskBatchId|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "1268154180129529857"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|string|true|none||none|
|» message|string|true|none||none|
|» data|string|true|none||taskBatchId|

## POST Adjust playback speed

POST /suno/submit/adjust-speed

Synchronously adjust the playback speed, 0 points.

> Body Parameters

```json
{
    "clip_id": "a3911719-eded-4585-a4bb-90ea52d786b5",
    "speed": 1.5,
    "keep_pitch": true
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» clip_id|body|string| yes ||Song clipId|
|» speed|body|number| yes ||Playback speed 0.25–4.0|
|» keep_pitch|body|boolean| no ||Preserve pitch|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Change Title/Cover

POST /suno/submit/set-metadata

Update the title and cover image together

> Body Parameters

```json
{
    "clip_id": "e42808c7-e08a-4eb1-a288-1cd3ba952871",
    "title": "New Song Title",
    "image_url": "https://cdn2.suno.ai/image_e42808c7-e08a-4eb1-a288-1cd3ba952871.jpeg"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» clip_id|body|string| yes ||none|
|» title|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|
|» image_url|body|string| yes ||New cover URL|

#### Description

**» title**: [PASTE YOUR CHINESE TEXT HERE]
"New Title"

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Fade In and Out

POST /suno/submit/fade

Synchronous fade processing, 0 points.

> Body Parameters

```json
{
    "clip_id": "9846ddf3-f154-4198-aad9-2652c22aa879",
    "fade_in_s": 2,
    "fade_out_s": 3
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» clip_id|body|string| yes ||Song clipId|
|» fade_in_s|body|number| no ||Fade-in duration in seconds|
|» fade_out_s|body|number| no ||Fade-out duration in seconds|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Convert Resource to Temporary URL

POST /suno/submit/url-transfer

Convert the resource URL into a temporary accessible URL. 0 credits. Synchronous.

> Body Parameters

```json
{
    "url": "https://example.com/track.mp3"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» url|body|string| yes ||Original Resource URL|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Image Generation/Midjourney

## POST Upload Image

POST /mj/submit/upload-discord-images

Official Documentation: https://docs.midjourney.com/hc/en-us/articles/33329380893325-Managing-Image-Uploads

> Body Parameters

```json
{
    "base64Array": [
        "data:image/png;base64,iVBORw0KGgoAAAA..."
    ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|content-type|header|string| yes ||none|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» base64Array|body|[string]| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Submit Imagine Task

POST /mj/submit/imagine

Official Documentation: https://docs.midjourney.com/hc/en-us/articles/32023408776205-Prompt-Basics

> Body Parameters

```json
{
  "base64Array": [],
  "notifyHook": "",
  "prompt": "cat",
  "state": "",
  "botType": "MID_JOURNEY"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» botType|body|string| yes ||bot type, mj (default) or niji|
|» prompt|body|string| yes ||Prompt|
|» base64Array|body|[string]| no ||Padding image base64 array|
|» notifyHook|body|string| no ||Callback address, uses global notifyHook when empty|
|» state|body|string| no ||Custom Parameters|

#### Enum

|Name|Value|
|---|---|
|» botType|MID_JOURNEY|
|» botType|NIJI_JOURNEY|

> Response Examples

> 200 Response

```json
{
    "code": 1,
    "description": "Submit success",
    "result": "1730621718151844", // task id
    "properties": {
        "discordChannelId": "1300842676874379336",
        "discordInstanceId": "1572398367386955776"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query task status by task ID

GET /mj/task/1743326750223591/fetch

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|

> Response Examples

```json
{
    "id": "1730621826053455",
    "action": "IMAGINE",
    "customId": "",
    "botType": "",
    "prompt": "pig --v 6.1",
    "promptEn": "pig --v 6.1",
    "description": "Submit success",
    "state": "",
    "submitTime": 1730621826053,
    "startTime": 1730621828024,
    "finishTime": 1730621855817,
    "imageUrl": "https://cdnmjp.oneabc.org/attachments/1300842274347028520/1302547211321741343/kennedyhernandez46715_74108_pig_3785da15-4f70-4034-9128-f3ff1ac634fa.png?ex=6728831f&is=6727319f&hm=f6d701914d608e4da9298d2290b3616317264a70635fbf08a37ca6c1bb671b50&",
    "status": "SUCCESS",
    "progress": "100%",
    "failReason": "",
    "buttons": [
        {
            "customId": "MJ::JOB::upsample::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U4",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::reroll::0::3785da15-4f70-4034-9128-f3ff1ac634fa::SOLO",
            "emoji": "🔄",
            "label": "",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V4",
            "type": 2,
            "style": 2
        }
    ],
    "maskBase64": "",
    "properties": {
        "finalPrompt": "pig --v 6.1",
        "finalZhPrompt": ""
    }
}
```

```json
{
    "id": "1730621826053455",
    "action": "IMAGINE",
    "customId": "",
    "botType": "",
    "prompt": "pig --v 6.1",
    "promptEn": "pig --v 6.1",
    "description": "Submit success",
    "state": "",
    "submitTime": 1730621826053,
    "startTime": 1730621828024,
    "finishTime": 1730621855817,
    "imageUrl": "https://cdnmjp.oneabc.org/attachments/1300842274347028520/1302547211321741343/kennedyhernandez46715_74108_pig_3785da15-4f70-4034-9128-f3ff1ac634fa.png?ex=6728831f&is=6727319f&hm=f6d701914d608e4da9298d2290b3616317264a70635fbf08a37ca6c1bb671b50&",
    "status": "SUCCESS",
    "progress": "100%",
    "failReason": "",
    "buttons": [
        {
            "customId": "MJ::JOB::upsample::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U4",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::reroll::0::3785da15-4f70-4034-9128-f3ff1ac634fa::SOLO",
            "emoji": "🔄",
            "label": "",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V4",
            "type": 2,
            "style": 2
        }
    ],
    "maskBase64": "",
    "properties": {
        "finalPrompt": "pig --v 6.1",
        "finalZhPrompt": ""
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» action|string|true|none||none|
|» customId|string|true|none||none|
|» botType|string|true|none||none|
|» prompt|string|true|none||none|
|» promptEn|string|true|none||none|
|» description|string|true|none||none|
|» state|string|true|none||none|
|» submitTime|integer|true|none||none|
|» startTime|integer|true|none||none|
|» finishTime|integer|true|none||none|
|» imageUrl|string|true|none||none|
|» status|string|true|none||none|
|» progress|string|true|none||none|
|» failReason|string|true|none||none|
|» buttons|[object]|true|none||none|
|»» customId|string|true|none||none|
|»» emoji|string|true|none||none|
|»» label|string|true|none||none|
|»» type|integer|true|none||none|
|»» style|integer|true|none||none|
|» maskBase64|string|true|none||none|
|» properties|object|true|none||none|
|»» finalPrompt|string|true|none||none|
|»» finalZhPrompt|string|true|none||none|

## POST Query tasks by ID list

POST /mj/task/list-by-condition

> Body Parameters

```json
{
    "ids": [
        "1743326750223591"
    ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» ids|body|[string]| yes ||none|

> Response Examples

```json
{
    "id": "1730621826053455",
    "action": "IMAGINE",
    "customId": "",
    "botType": "",
    "prompt": "pig --v 6.1",
    "promptEn": "pig --v 6.1",
    "description": "Submit success",
    "state": "",
    "submitTime": 1730621826053,
    "startTime": 1730621828024,
    "finishTime": 1730621855817,
    "imageUrl": "https://cdnmjp.oneabc.org/attachments/1300842274347028520/1302547211321741343/kennedyhernandez46715_74108_pig_3785da15-4f70-4034-9128-f3ff1ac634fa.png?ex=6728831f&is=6727319f&hm=f6d701914d608e4da9298d2290b3616317264a70635fbf08a37ca6c1bb671b50&",
    "status": "SUCCESS",
    "progress": "100%",
    "failReason": "",
    "buttons": [
        {
            "customId": "MJ::JOB::upsample::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U4",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::reroll::0::3785da15-4f70-4034-9128-f3ff1ac634fa::SOLO",
            "emoji": "🔄",
            "label": "",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V4",
            "type": 2,
            "style": 2
        }
    ],
    "maskBase64": "",
    "properties": {
        "finalPrompt": "pig --v 6.1",
        "finalZhPrompt": ""
    }
}
```

```json
[
    {
        "id": "1730621826053455",
        "action": "IMAGINE",
        "customId": "",
        "botType": "",
        "prompt": "pig --v 6.1",
        "promptEn": "pig --v 6.1",
        "description": "Submit success",
        "state": "",
        "submitTime": 1730621826053,
        "startTime": 1730621828024,
        "finishTime": 1730621855817,
        "imageUrl": "https://cdnmjp.oneabc.org/attachments/1300842274347028520/1302547211321741343/kennedyhernandez46715_74108_pig_3785da15-4f70-4034-9128-f3ff1ac634fa.png?ex=6728831f&is=6727319f&hm=f6d701914d608e4da9298d2290b3616317264a70635fbf08a37ca6c1bb671b50&",
        "status": "SUCCESS",
        "progress": "100%",
        "failReason": "",
        "buttons": [
            {
                "customId": "MJ::JOB::upsample::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "U1",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::upsample::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "U2",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::upsample::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "U3",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::upsample::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "U4",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::reroll::0::3785da15-4f70-4034-9128-f3ff1ac634fa::SOLO",
                "emoji": "🔄",
                "label": "",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::variation::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "V1",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::variation::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "V2",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::variation::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "V3",
                "type": 2,
                "style": 2
            },
            {
                "customId": "MJ::JOB::variation::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
                "emoji": "",
                "label": "V4",
                "type": 2,
                "style": 2
            }
        ],
        "maskBase64": "",
        "properties": {
            "finalPrompt": "pig --v 6.1",
            "finalZhPrompt": ""
        }
    }
]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|false|none||none|
|» action|string|false|none||none|
|» customId|string|false|none||none|
|» botType|string|false|none||none|
|» prompt|string|false|none||none|
|» promptEn|string|false|none||none|
|» description|string|false|none||none|
|» state|string|false|none||none|
|» submitTime|integer|false|none||none|
|» startTime|integer|false|none||none|
|» finishTime|integer|false|none||none|
|» imageUrl|string|false|none||none|
|» status|string|false|none||none|
|» progress|string|false|none||none|
|» failReason|string|false|none||none|
|» buttons|[object]|false|none||none|
|»» customId|string|true|none||none|
|»» emoji|string|true|none||none|
|»» label|string|true|none||none|
|»» type|integer|true|none||none|
|»» style|integer|true|none||none|
|» maskBase64|string|false|none||none|
|» properties|object|false|none||none|
|»» finalPrompt|string|true|none||none|
|»» finalZhPrompt|string|true|none||none|

## GET Get the seed of the task image

GET /mj/task/{id}/image-seed

> Body Parameters

```yaml
ids:
  - "1231234123"
  - "456456456"

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» ids|body|[string]| no ||none|

> Response Examples

> 200 Response

```json
{
    "id": "1730621826053455",
    "action": "IMAGINE",
    "customId": "",
    "botType": "",
    "prompt": "pig --v 6.1",
    "promptEn": "pig --v 6.1",
    "description": "Submit success",
    "state": "",
    "submitTime": 1730621826053,
    "startTime": 1730621828024,
    "finishTime": 1730621855817,
    "imageUrl": "https://cdnmjp.oneabc.org/attachments/1300842274347028520/1302547211321741343/kennedyhernandez46715_74108_pig_3785da15-4f70-4034-9128-f3ff1ac634fa.png?ex=6728831f&is=6727319f&hm=f6d701914d608e4da9298d2290b3616317264a70635fbf08a37ca6c1bb671b50&",
    "status": "SUCCESS",
    "progress": "100%",
    "failReason": "",
    "buttons": [
        {
            "customId": "MJ::JOB::upsample::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::upsample::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "U4",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::reroll::0::3785da15-4f70-4034-9128-f3ff1ac634fa::SOLO",
            "emoji": "🔄",
            "label": "",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::1::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V1",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::2::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V2",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::3::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V3",
            "type": 2,
            "style": 2
        },
        {
            "customId": "MJ::JOB::variation::4::3785da15-4f70-4034-9128-f3ff1ac634fa",
            "emoji": "",
            "label": "V4",
            "type": 2,
            "style": 2
        }
    ],
    "maskBase64": "",
    "properties": {
        "finalPrompt": "pig --v 6.1",
        "finalZhPrompt": ""
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» action|string|true|none||none|
|» customId|string|true|none||none|
|» botType|string|true|none||none|
|» prompt|string|true|none||none|
|» promptEn|string|true|none||none|
|» description|string|true|none||none|
|» state|string|true|none||none|
|» submitTime|integer|true|none||none|
|» startTime|integer|true|none||none|
|» finishTime|integer|true|none||none|
|» imageUrl|string|true|none||none|
|» status|string|true|none||none|
|» progress|string|true|none||none|
|» failReason|string|true|none||none|
|» buttons|[object]|true|none||none|
|»» customId|string|true|none||none|
|»» emoji|string|true|none||none|
|»» label|string|true|none||none|
|»» type|integer|true|none||none|
|»» style|integer|true|none||none|
|» maskBase64|string|true|none||none|
|» properties|object|true|none||none|
|»» finalPrompt|string|true|none||none|
|»» finalZhPrompt|string|true|none||none|

## POST Execute Action

POST /mj/submit/action

Official Documentation: https://docs.midjourney.com/hc/en-us/articles/32804058614669-Upscalers

> Body Parameters

```json
{
  "chooseSameChannel": true,
  "customId": "MJ::JOB::upsample::2::3dbbd469-36af-4a0f-8f02-df6c579e7011",
  "taskId": "14001934816969359",
  "notifyHook": "",
  "state": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» chooseSameChannel|body|boolean| yes ||Whether to select accounts under the same channel. By default, only the account associated with the task is used.|
|» customId|body|string| no ||Action Identifier|
|» taskId|body|string| no ||Task ID|
|» notifyHook|body|string| no ||Callback address, uses global notifyHook when empty|
|» state|body|string| no ||Custom Parameters|

> Response Examples

> 200 Response

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» created|integer|true|none||none|
|» data|[object]|true|none||none|
|»» url|string|true|none||none|

## POST Submit Blend Task

POST /mj/submit/blend

Official documentation: https://docs.midjourney.com/hc/en-us/articles/32635189884557-Blend-Images-on-Discord

> Body Parameters

```json
{
  "botType": "MID_JOURNEY",
  "base64Array": [
    "data:image/png;base64,xxx1",
    "data:image/png;base64,xxx2"
  ],
  "dimensions": "SQUARE",
  "notifyHook": "",
  "state": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» botType|body|string| yes ||Bot type, mj (default) or niji|
|» base64Array|body|string| no ||Image base64 array|
|» dimensions|body|string| no ||Aspect Ratio: PORTRAIT(2:3); SQUARE(1:1); LANDSCAPE(3:2)|
|» quality|body|string| no ||The quality of the generated image. `hd` creates images with finer details and higher consistency. This parameter is only supported by `dall-e-3`.|
|» notifyHook|body|string| no ||Callback address, uses global notifyHook when empty|
|» state|body|string| no ||Custom Parameters|

#### Enum

|Name|Value|
|---|---|
|» botType|NIJI_JOURNEY|
|» botType|MID_JOURNEY|
|» dimensions|PORTRAIT|
|» dimensions|SQUARE|
|» dimensions|LANDSCAPE|

> Response Examples

> 200 Response

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» created|integer|true|none||none|
|» data|[object]|true|none||none|
|»» url|string|true|none||none|

## POST Submit Describe Task

POST /mj/submit/describe

Official Documentation: https://docs.midjourney.com/hc/en-us/articles/32497889043981-Describe

> Body Parameters

```json
{
  "botType": "MID_JOURNEY",
  "base64": "data:image/png;base64,iVBORw0KGgoAAAA...",
  "notifyHook": "",
  "state": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» botType|body|string| yes ||Bot type, mj (default) or niji|
|» base64|body|string| no ||Model for image generation.|
|» notifyHook|body|integer| no ||The number of images to generate. Must be between 1 and 10.|
|» state|body|string| no ||The quality of the generated image. `hd` creates images with finer details and higher consistency. This parameter is only supported by `dall-e-3`.|

#### Enum

|Name|Value|
|---|---|
|» botType|MID_JOURNEY|
|» botType|NIJI_JOURNEY|

> Response Examples

> 200 Response

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» created|integer|true|none||none|
|» data|[object]|true|none||none|
|»» url|string|true|none||none|

## POST Submit Modal

POST /mj/submit/modal

> Body Parameters

```json
{
  "maskBase64": "",
  "prompt": "",
  "taskId": "14001934816969359"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» maskBase64|body|string| yes ||Partial redraw mask base64|
|» prompt|body|string| no ||Prompt|
|» taskId|body|integer| no ||Task ID|

> Response Examples

> 200 Response

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» created|integer|true|none||none|
|» data|[object]|true|none||none|
|»» url|string|true|none||none|

# Key4U English/Image Generation/Ideogram

## POST Generate 3.0 (Text-to-Image) Generate

POST /ideogram/v1/ideogram-v3/generate

Generate images synchronously using the Ideogram 3.0 model based on the given prompt and optional parameters.
For specific parameters, please refer to the official documentation: https://developer.ideogram.ai/api-reference/api-reference/generate-v3
The returned image URLs are valid for 24 hours. Images will be inaccessible after this time period.
Image proxy has been configured.

> Body Parameters

```json
{
    "prompt": "voluptate reprehenderit",
    "seed": 511526458,
    "rendering_speed": "DEFAULT"
   
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt text required for image generation|
|» seed|body|integer| no ||Random seed. Setting this value enables reproducible generation results.|
|» resolution|body|string| no ||Supported Resolution Options|
|» aspect_ratio|body|string| no ||Aspect ratio for image generation, which determines the image resolution. Cannot be used simultaneously with the resolution parameter. Defaults to 1x1.|
|» rendering_speed|body|string| no ||Rendering Speed Options|
|» magic_prompt|body|string| no ||Determines whether to use Magic Prompt when generating requests|
|» negative_prompt|body|string| no ||Describe content to be excluded from the image. Descriptions in the prompt take priority over descriptions in the negative prompt.|
|» num_images|body|integer| no ||Number of images to generate|
|» color_palette|body|object| no ||The generated color palette must be explicitly specified either through one of the presets (name) or through hexadecimal representation of colors with optional weights (members)|
|»» *anonymous*|body|object| no ||none|
|»»» name|body|string| yes ||Preset Palette Name|
|»» *anonymous*|body|object| no ||none|
|»»» members|body|[object]| yes ||none|
|»»»» color|body|string| yes ||Hexadecimal representation of color|
|»»»» weight|body|number| no ||Color weight|
|» style_codes|body|[string]| no ||A list of 8-character hexadecimal codes representing image styles. Cannot be used together with style_reference_images or style_type|
|» style_type|body|string| no ||Style type to be generated|

#### Enum

|Name|Value|
|---|---|
|» resolution|512x1536|
|» resolution|576x1408|
|» resolution|576x1472|
|» resolution|576x1536|
|» resolution|640x1344|
|» resolution|640x1408|
|» resolution|640x1472|
|» resolution|640x1536|
|» resolution|704x1152|
|» resolution|704x1216|
|» resolution|704x1280|
|» resolution|704x1344|
|» resolution|704x1408|
|» resolution|704x1472|
|» resolution|736x1312|
|» resolution|768x1088|
|» resolution|768x1216|
|» resolution|768x1280|
|» resolution|768x1344|
|» resolution|800x1280|
|» resolution|832x960|
|» resolution|832x1024|
|» resolution|832x1088|
|» resolution|832x1152|
|» resolution|832x1216|
|» resolution|832x1248|
|» resolution|864x1152|
|» resolution|896x960|
|» resolution|896x1024|
|» resolution|896x1088|
|» resolution|896x1120|
|» resolution|896x1152|
|» resolution|960x832|
|» resolution|960x896|
|» resolution|960x1024|
|» resolution|960x1088|
|» resolution|1024x832|
|» resolution|1024x896|
|» resolution|1024x960|
|» resolution|1024x1024|
|» resolution|1088x768|
|» resolution|1088x832|
|» resolution|1088x896|
|» resolution|1088x960|
|» resolution|1120x896|
|» resolution|1152x704|
|» resolution|1152x832|
|» resolution|1152x864|
|» resolution|1152x896|
|» resolution|1216x704|
|» resolution|1216x768|
|» resolution|1216x832|
|» resolution|1248x832|
|» resolution|1280x704|
|» resolution|1280x768|
|» resolution|1280x800|
|» resolution|1312x736|
|» resolution|1344x640|
|» resolution|1344x704|
|» resolution|1344x768|
|» resolution|1408x576|
|» resolution|1408x640|
|» resolution|1408x704|
|» resolution|1472x576|
|» resolution|1472x640|
|» resolution|1472x704|
|» resolution|1536x512|
|» resolution|1536x576|
|» resolution|1536x640|
|» aspect_ratio|1x3|
|» aspect_ratio|3x1|
|» aspect_ratio|1x2|
|» aspect_ratio|2x1|
|» aspect_ratio|9x16|
|» aspect_ratio|16x9|
|» aspect_ratio|10x16|
|» aspect_ratio|16x10|
|» aspect_ratio|2x3|
|» aspect_ratio|3x2|
|» aspect_ratio|3x4|
|» aspect_ratio|4x3|
|» aspect_ratio|4x5|
|» aspect_ratio|5x4|
|» aspect_ratio|1x1|
|» rendering_speed|TURBO|
|» rendering_speed|DEFAULT|
|» rendering_speed|QUALITY|
|» magic_prompt|AUTO|
|» magic_prompt|ON|
|» magic_prompt|OFF|
|» style_type|AUTO|
|» style_type|GENERAL|
|» style_type|REALISTIC|
|» style_type|DESIGN|

> Response Examples

> 200 Response

```json
{
    "data": [
        {
            "seed": 511526458,
            "prompt": "voluptate reprehenderit",
            "resolution": "1024x1024",
            "url": "https://v3.fal.media/files/koala/mSnuEvKTrnyY2mXY1i_qc_image.png",
            "is_image_safe": true,
            "style_type": "REALISTIC"
        }
    ],
    "created": "2025-08-27T18:23:28.806107195+08:00"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST Generate 3.0 (Image Editing) Edit

POST /ideogram/v1/ideogram-v3/edit

Generate images synchronously using the Ideogram 3.0 model based on the given prompt and optional parameters.
For specific parameters, please refer to the official documentation: https://developer.ideogram.ai/api-reference/api-reference/edit-v3
The returned image URLs are valid for 24 hours. After that time, the images will no longer be accessible.
Image reverse proxy has been configured.

> Body Parameters

```yaml
image: file://C:\Users\Administrator\Desktop\example.png
mask: file://C:\Users\Administrator\Desktop\example.png
seed: 12345
prompt: A photo of a cat wearing a hat.

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» image|body|string(binary)| yes ||The image is being reprocessed (maximum size: 10 megabytes); currently only JPEG, WebP, and PNG formats are supported.|
|» mask|body|string(binary)| no ||none|
|» seed|body|integer| no ||Random seed, range 0-2147483647, setting this value enables reproducible results|
|» prompt|body|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "CjMT7WdSwWcAAAAAALvB3g",
    "data": {
        "task_id": "CjMT7WdSwWcAAAAAALvB3g",
        "task_status": "submitted",
        "created_at": 1733851336696,
        "updated_at": 1733851336696
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST Generate 3.0 (Image Remaster) Remix

POST /ideogram/v1/ideogram-v3/remix

Generate images synchronously using the Ideogram 3.0 model based on the given prompt and optional parameters.
For detailed parameters, see the official documentation: https://developer.ideogram.ai/api-reference/api-reference/remix-v3
The returned image URLs are valid for 24 hours. After that time, the images will no longer be accessible.
Image reverse proxy has been enabled.

> Body Parameters

```yaml
image: file://C:\Users\Administrator\Desktop\example.png
prompt: A photo of a cat
num_images: "1"
rendering_speed: DEFAULT

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» image|body|string(binary)| yes ||The image is being reprocessed (maximum size: 10 megabytes); currently only JPEG, WebP, and PNG formats are supported.|
|» prompt|body|string| no ||none|
|» num_images|body|string| no ||none|
|» rendering_speed|body|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "data": [
        {
            "seed": 12345,
            "prompt": "A photo of a cat",
            "resolution": "1024x1024",
            "url": "https://v3.fal.media/files/panda/-6uzsYt1XEco4s6BThKaP_image.png",
            "is_image_safe": true,
            "style_type": "REALISTIC"
        }
    ],
    "created": "2025-08-27T22:13:44.972624193+08:00"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST Generate 3.0 (Image Reconstruction) Reframe

POST /ideogram/v1/ideogram-v3/reframe

Synchronously generate images using the Ideogram 3.0 model based on the given prompt and optional parameters.
For specific parameters, please refer to the official documentation: https://developer.ideogram.ai/api-reference/api-reference/reframe-v3
The returned image URLs are valid for 24 hours. Images cannot be accessed after this time period.
Image reverse proxy has been configured.

> Body Parameters

```yaml
image: file://C:\Users\Administrator\Desktop\example.png
resolution: 512x1536

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» image|body|string(binary)| yes ||The image is being reprocessed (maximum size: 10 megabytes); currently only JPEG, WebP, and PNG formats are supported.|
|» resolution|body|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "CjMT7WdSwWcAAAAAALvB3g",
    "data": {
        "task_id": "CjMT7WdSwWcAAAAAALvB3g",
        "task_status": "submitted",
        "created_at": 1733851336696,
        "updated_at": 1733851336696
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST Generate 3.0 (Replace Background) Replace Background

POST /ideogram/v1/ideogram-v3/replace-background

Generate images synchronously using the Ideogram 3.0 model based on the given prompt and optional parameters.
For specific parameters, please refer to the official documentation: https://developer.ideogram.ai/api-reference/api-reference/replace-background-v3
The returned image URLs are valid for 24 hours. Images cannot be accessed after this time period.
Image proxy has been enabled.

> Body Parameters

```yaml
image: file://C:\Users\Administrator\Desktop\example.png
prompt: Add a forest in the background

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» image|body|string(binary)| yes ||The image is being reprocessed (maximum size: 10 megabytes); currently only JPEG, WebP, and PNG formats are supported.|
|» prompt|body|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "CjMT7WdSwWcAAAAAALvB3g",
    "data": {
        "task_id": "CjMT7WdSwWcAAAAAALvB3g",
        "task_status": "submitted",
        "created_at": 1733851336696,
        "updated_at": 1733851336696
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST ideogram (text-to-image)

POST /ideogram/generate

Generates images synchronously based on a given prompt and optional parameters.
For specific parameters, please refer to the official documentation: https://developer.ideogram.ai/api-reference/api-reference/describe

Generates images synchronously based on a given prompt and optional parameters.
The returned image URLs are valid for 24 hours. After that time, the images will no longer be accessible.
Images have been reverse-proxied.

> Body Parameters

```json

{
  "image_request": {
    "aspect_ratio": "ASPECT_10_16",
    "magic_prompt_option": "AUTO",
    "model": "V_1",
    "prompt": "A serene tropical beach scene. Dominating the foreground are tall palm trees with lush green leaves, standing tall against a backdrop of a sandy beach. The beach leads to the azure waters of the sea, which gently kisses the shoreline. In the distance, there is an island or landmass with a silhouette of what appears to be a lighthouse or tower. The sky above is painted with fluffy white clouds, some of which are tinged with hues of pink and orange, suggesting either a sunrise or sunset."
  }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» image_request|body|object| yes ||Image Request Object (Required)|
|»» prompt|body|string| yes ||Prompt for generating images (required)|
|»» aspect_ratio|body|string| yes ||Image aspect ratio (optional) Optional values: ASPECT_10_16/ASPECT_16_10/ASPECT_9_16/ASPECT_16_9/ASPECT_3_2/ASPECT_2_3/ASPECT_4_3/ASPECT_3_4/ASPECT_1_1/ASPECT_1_3/ASPECT_3_1|
|»» model|body|string| yes ||Model used (optional) Default V_2, optional values: V_1/V_1_TURBO/V_2/V_2_TURBO|
|»» magic_prompt_option|body|string| yes ||Whether to use MagicPrompt (optional) Optional values: AUTO/ON/OFF|
|»» seed|body|integer| yes ||Random seed (optional) Range: 0-2147483647|
|»» style_type|body|string| yes ||Style type (optional) Optional values: AUTO/GENERAL/REALISTIC/DESIGN/RENDER_3D/ANIME|
|»» negative_prompt|body|string| yes ||Negative Prompt (Optional) Describes content you do not want to appear in the image|
|»» num_images|body|integer| yes ||Number of images to generate (optional) Range: 1-8, default 1|
|»» resolution|body|string| yes ||Resolution (optional) Optional values include various resolution combinations ranging from 512x1536 to 1536x640|
|»» color_palette|body|object| yes ||Color Palette (Optional)|
|»»» name|body|string| yes ||Preset palette name (choose one with members) Optional values: EMBER/FRESH/JUNGLE/MAGIC/MELON/MOSAIC/PASTEL/ULTRAMARINE|

> Response Examples

> 200 Response

```json
{
  "created": "2024-12-15T17:32:00.965408+00:00",
  "data": [
    {
      "is_image_safe": true,
      "prompt": "A serene tropical beach scene. Dominating the foreground are tall palm trees with lush green leaves, standing tall against a backdrop of a sandy beach. The beach leads to the azure waters of the sea, which gently kisses the shoreline. In the distance, there is an island or landmass with a silhouette of what appears to be a lighthouse or tower. The sky above is painted with fluffy white clouds, some of which are tinged with hues of pink and orange, suggesting either a sunrise or sunset.",
      "resolution": "768x1232",
      "seed": 1785282233,
      "style_type": null,
      "url": "https://ideogram.ai/api/images/ephemeral/WkoxvqiOTaaCqG1nO2tQoA.png?exp=1734370337&sig=110fe96dc9e01002c8d837e5b4cde1aaa266195561d231ce76e19e095e478ffe"
    }
  ]
}

```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» created|string|true|none||none|
|» data|[object]|true|none||none|
|»» is_image_safe|boolean|false|none||none|
|»» prompt|string|false|none||none|
|»» resolution|string|false|none||none|
|»» seed|integer|false|none||none|
|»» style_type|null|false|none||none|
|»» url|string|false|none||none|

## POST Remix (Blend Image)

POST /ideogram/remix

Official documentation: https://developer.ideogram.ai/api-reference/api-reference/remix

> Body Parameters

```yaml
image_request: '{    "image_weight": 50,    "model":
  "V_1",    "magic_prompt_option": "AUTO",    "prompt":
  "A%20serene%20tropical%20beach%20",    "aspect_ratio":
  "ASPECT_10_16",    "seed": 12345,    "negative_prompt":
  "brush%20strokes%2C%20painting"}'
image_file: file://C:\Users\Administrator\Desktop\example.png

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» image_request|body|string| no ||"prompt": "a beautiful sunset over mountains",  // Prompt used to generate the image (required)|
|» image_file|body|string(binary)| no ||Image file (required) - the source image file used to generate a new image|

#### Description

**» image_request**: "prompt": "a beautiful sunset over mountains",  // Prompt used to generate the image (required)
    "aspect_ratio": "ASPECT_16_9",  // Image aspect ratio (optional) Possible values: ASPECT_10_16/ASPECT_16_10/ASPECT_9_16/ASPECT_16_9/ASPECT_3_2/ASPECT_2_3/ASPECT_4_3/ASPECT_3_4/ASPECT_1_1/ASPECT_1_3/ASPECT_3_1
    "color_palette": {  // Color palette (optional)
      "name": "FRESH"  // Preset palette name (mutually exclusive with members) Possible values: EMBER/FRESH/JUNGLE/MAGIC/MELON/MOSAIC/PASTEL/ULTRAMARINE
      // Or use custom colors:
      /*"members": [
        {
          "color_hex": "#FF0000",  // Color hex value (required)
          "color_weight": 1.0  // Color weight (optional) Range: 0.05–1.0
        }
      ]*/
    },
    "image_weight": 50,  // Image weight (optional) Range: 1–100, default 50
    "magic_prompt_option": "AUTO",  // Whether to use MagicPrompt (optional) Possible values: AUTO/ON/OFF
    "model": "V_2",  // Model to use (optional) Default V_2, possible values: V_1/V_1_TURBO/V_2/V_2_TURBO
    "negative_prompt": "clouds,blur",  // Negative prompt (optional) Describes content you do not want to appear in the image
    "num_images": 1,  // Number of images to generate (optional) Range: 1–8, default 1
    "resolution": "RESOLUTION_1024_1024",  // Resolution (optional) Possible values include various resolution combinations ranging from 512x1536 to 1536x640
    "seed": 123456,  // Random seed (optional) Range: 0–2147483647
    "style_type": "REALISTIC"  // Style type (optional) Possible values: AUTO/GENERAL/REALISTIC/DESIGN/RENDER_3D/ANIME

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "CjMT7WdSwWcAAAAAALvB3g",
    "data": {
        "task_id": "CjMT7WdSwWcAAAAAALvB3g",
        "task_status": "submitted",
        "created_at": 1733851336696,
        "updated_at": 1733851336696
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST Upscale (Enhance to High Definition)

POST /ideogram/upscale

Official Documentation: https://developer.ideogram.ai/api-reference/api-reference/upscale

> Body Parameters

```yaml
image_request: "{\r

  \    \"resemblance\": 50,\r

  \    \"magic_prompt_option\": \"AUTO\",\r

  \    \"prompt\": \"A%20serene%20tropical%20beach%20\",\r

  \    \"seed\": 12345,\r

  \    \"detail\": 50\r

  }"
image_file: file://C:\Users\Administrator\Desktop\example.png

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» image_request|body|string| no ||"prompt": "a beautiful sunset over mountains",  // Prompt for guiding upscaling (optional)|
|» image_file|body|string(binary)| no ||Image file (required) - the source image file to be enlarged|

#### Description

**» image_request**: "prompt": "a beautiful sunset over mountains",  // Prompt for guiding upscaling (optional)
    "resemblance": 50,  // Similarity (optional) Range: 1-100, default 50
    "detail": 50,  // Detail level (optional) Range: 1-100, default 50 
    "magic_prompt_option": "AUTO",  // Whether to use MagicPrompt (optional) Options: AUTO/ON/OFF
    "num_images": 1,  // Number of images to generate (optional) Range: 1-8, default 1
    "seed": 123456  // Random seed (optional) Range: 0-2147483647

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "CjMT7WdSwWcAAAAAALvB3g",
    "data": {
        "task_id": "CjMT7WdSwWcAAAAAALvB3g",
        "task_status": "submitted",
        "created_at": 1733851336696,
        "updated_at": 1733851336696
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST Describe

POST /ideogram/describe

Official documentation: https://developer.ideogram.ai/api-reference/api-reference/describe

> Body Parameters

```yaml
image_file: file://C:\Users\Administrator\Desktop\example.png

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» image_file|body|string(binary)| no ||(Required) Source image file|

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "CjMT7WdSwWcAAAAAALvB3g",
    "data": {
        "task_id": "CjMT7WdSwWcAAAAAALvB3g",
        "task_status": "submitted",
        "created_at": 1733851336696,
        "updated_at": 1733851336696
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

# Key4U English/Image Generation/Dreamina

## POST Edit Image

POST /v1/images/edits

Given a prompt, the model will return one or more predicted completions, and can also return the probability of alternative tokens at each position.

Create a completion for the provided prompt and parameters

Official documentation: https://platform.openai.com/docs/api-reference/images/createEdit

> Body Parameters

```yaml
size: 1024x1024
prompt: a cute little pig
model: gpt-image-1
n: 1

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Accept|header|string| yes ||none|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» image|body|string(binary)| yes ||The image to be edited. Must be a supported image file or image array. For gpt-image-1, each image should be a png, webp, or jpg file smaller than 25MB. For dall-e-2, you can only provide one image, and the image should be a square png file smaller than 4MB.|
|» prompt|body|string| yes ||Text description of the desired image. The maximum length for dall-e-2 is 1000 characters, and the maximum length for gpt-image-1 is 32000 characters.|
|» mask|body|string| no ||An additional image where fully transparent regions (for example, alpha value of zero) indicate the location of the image that should be edited. If multiple images are provided, the mask will be applied to the first image. Must be a valid PNG file, smaller than 4MB, and have the same dimensions as the image.|
|» model|body|string| no ||Model for generating images. Only gpt-image-1, gpt-image-1-all, flux-kontext-pro, flux-kontext-max.|
|» n|body|string| no ||The number of images to generate. Must be between 1 and 10.|
|» quality|body|string| no ||The quality of the generated image. Only gpt-image-1 supports high, medium, and low quality. dall-e-2 only supports standard quality. Defaults to auto.|
|» response_format|body|string| no ||Returns the format of the generated image. Must be either url or b64_json. URLs are valid for 60 minutes after image generation. This parameter only applies to dall-e-2, as gpt-image-1 always returns base64-encoded images. Do not use this parameter.|
|» size|body|string| no ||The size of the generated image. For gpt-image-1, it must be one of 1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), or auto (default); for dall-e-2, it must be one of 256x256, 512x512, or 1024x1024.|
|» background|body|string| no ||Allows setting the transparency of the background for generated images. This parameter is only supported in gpt-image-1. Its value must be one of "transparent", "opaque", or "auto" (default). When using "auto", the model will automatically determine the best background for the image.|
|» moderation|body|string| no ||Controls the content moderation level for images generated by gpt-image-1. Can be set to "low" for less restrictive filtering, or set to "auto" (default value).|

> Response Examples

> 200 Response

```json
{
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1677652288,
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "\n\nHello there, how may I assist you today?"
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 12,
        "total_tokens": 21
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» object|string|true|none||none|
|» created|integer|true|none||none|
|» choices|[object]|true|none||none|
|»» index|integer|false|none||none|
|»» message|object|false|none||none|
|»»» role|string|true|none||none|
|»»» content|string|true|none||none|
|»» finish_reason|string|false|none||none|
|» usage|object|true|none||none|
|»» prompt_tokens|integer|true|none||none|
|»» completion_tokens|integer|true|none||none|
|»» total_tokens|integer|true|none||none|

# Key4U English/Image Generation/Doubao

## POST  Seedream 5.0 Pro 

POST /api/v3/images/generations

> Body Parameters

```json
{
    "model": "doubao-seedream-5-0-pro-260628",
    "prompt": "A cat",
    "size": "2K",
    "response_format": "url",
    "watermark": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|
|Content-Type|header|string| yes ||none|
|body|body|object| yes ||none|
|» model|body|string| yes ||Model Name|
|» prompt|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|
|» size|body|string| no ||Resolution tier or pixel dimensions. Common options are 1K/2K; dimensions such as 1024x1024, 2048x2048, and 2816x1584 are also supported. An empty value is billed at the high-tier rate.|
|» n|body|integer| no ||Number of images to generate; for Pro, this is usually 1|
|» response_format|body|string| no ||Return type|
|» output_format|body|string| no ||Image file format|
|» watermark|body|boolean| no ||Whether to add a watermark|
|» seed|body|integer| no ||Random seed, range [-1, 2147483647], default: -1|
|» guidance_scale|body|number| no ||Degree of alignment with the prompt, range [1, 10]|
|» optimize_prompt_options|body|object| no ||[PASTE YOUR CHINESE TEXT HERE]|
|»» mode|body|string| yes ||Optimization Mode|
|» image|body|any| no ||Reference image (official field). A URL string for a single image, or an array of URLs for multiple images (interactive editing/image-to-image, up to approximately 10 images)|
|»» *anonymous*|body|string(uri)| no ||none|
|»» *anonymous*|body|[string]| no ||none|
|» images|body|any| no ||Compatibility field; the gateway normalizes it to image. Use either this field or image.|
|»» *anonymous*|body|string(uri)| no ||none|
|»» *anonymous*|body|[string]| no ||none|

#### Description

**» prompt**: [PASTE YOUR CHINESE TEXT HERE]
"Generate/Edit Prompt"

**» optimize_prompt_options**: [PASTE YOUR CHINESE TEXT HERE]
"Prompt Optimization Configuration"

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedream-5-0-pro-260628|
|» size|1K|
|» size|2K|
|» size|1024x1024|
|» size|1152x864|
|» size|864x1152|
|» size|1424x800|
|» size|800x1424|
|» size|1248x832|
|» size|832x1248|
|» size|1568x672|
|» size|2048x2048|
|» size|2368x1776|
|» size|1776x2368|
|» size|2816x1584|
|» size|1584x2816|
|» size|2496x1664|
|» size|1664x2496|
|» size|3136x1344|
|» response_format|url|
|» response_format|b64_json|
|» output_format|jpeg|
|» output_format|png|
|»» mode|standard|
|»» mode|fast|

> Response Examples

> 200 Response

```json
{
  "created": 1753347123,
  "data": [
    {
      "url": "https://p3-bot-sign.byteimg.com/tos-cn-i-xxx/generated-image.png~tplv-xxx.jpeg?rk3s=xxx&x-expires=1753433523&x-signature=xxx"
    }
  ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» created|integer|true|none||none|
|» data|[object]|true|none||none|
|»» url|string|false|none||none|

# Key4U English/Image Generation/Fal.ai

## POST /fal-ai/nano-banana Text-to-Image

POST /fal-ai/nano-banana

Official documentation: https://fal.ai/models/fal-ai/nano-banana

> Body Parameters

```json
{
    "prompt": "An action shot of a black lab swimming in an inground suburban swimming pool. The camera is placed meticulously on the water line, dividing the image in half, revealing both the dogs head above water holding a tennis ball in it's mouth, and it's paws paddling underwater.",
    "num_images": 1
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt for generating images.|
|» num_images|body|integer| no ||Number of images to generate. Range: 1-4. Default value: 1|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca",
    "response_url": "https://queue.fal.run/fal-ai/nano-banana/requests/e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca",
    "status_url": "https://queue.fal.run/fal-ai/nano-banana/requests/e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca/status",
    "cancel_url": "https://queue.fal.run/fal-ai/nano-banana/requests/e7e9202c-efb8-40f2-81c3-13b3f7aaa4ca/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» request_id|string|true|none||none|
|» response_url|string|true|none||none|
|» status_url|string|true|none||none|
|» cancel_url|string|true|none||none|
|» logs|null|true|none||none|
|» metrics|object|true|none||none|
|» queue_position|integer|true|none||none|

## POST /fal-ai/nano-banana/edit Image Editing

POST /fal-ai/nano-banana/edit

Official documentation: https://fal.ai/models/fal-ai/nano-banana/edit

> Body Parameters

```json
{
  "prompt": "make a photo of the man driving the car down the california coastline",
  "image_urls": [
    "https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input.png",
    "https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input-2.png"
  ],
  "num_images": 1
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompts for image editing.|
|» image_urls|body|[string]| yes ||URL of the image that needs to be edited.|
|» num_images|body|integer| no ||Number of images to generate. Range: 1-4. Default value: 1|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "f8837f29-26cb-4213-90f5-22b2911a0ea7",
    "response_url": "https://queue.fal.run/fal-ai/nano-banana/requests/f8837f29-26cb-4213-90f5-22b2911a0ea7",
    "status_url": "https://queue.fal.run/fal-ai/nano-banana/requests/f8837f29-26cb-4213-90f5-22b2911a0ea7/status",
    "cancel_url": "https://queue.fal.run/fal-ai/nano-banana/requests/f8837f29-26cb-4213-90f5-22b2911a0ea7/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» request_id|string|true|none||none|
|» response_url|string|true|none||none|
|» status_url|string|true|none||none|
|» cancel_url|string|true|none||none|
|» logs|null|true|none||none|
|» metrics|object|true|none||none|
|» queue_position|integer|true|none||none|

# Key4U English/Image Generation/Tencent AIGC Image Generation

## POST Create Task

POST /tencent-vod/v1/aigc-image

Official documentation: https://cloud.tencent.com/document/product/266/126240

> Body Parameters

```json
{
    "model_name": "GEM",
    "model_version": "3.0",
    "file_infos": [
        {
            "type": "file",
            "file_id": "387702299774574677",
            "url": "",
            "text": "Description of the original image"
        }
    ],
    "prompt": "convert this image to anime style",
    "negative_prompt": "blur, distorted",
    "enhance_prompt": "Enabled",
    "output_config": {
        "storage_mode": "Temporary",
        "resolution": "1080P",
        "aspect_ratio": "1:1",
        "person_generation": "AllowAdult",
        "input_compliance_check": "Enabled",
        "output_compliance_check": "Enabled"
    },
    "session_id": "image-task-67890",
    "session_context": "{"user_id": "123", "scene": "profile_picture"}",
    "tasks_priority": 10,
    "ext_info": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no | TencentVodAigcImageRequest|none|
|» model_name|body|string| yes ||Model name (must match Tencent Cloud's ModelName). Use the series name aigc-image-<lowercase-series>; do not pass an internal full name such as aigc-image-kling-3.0.|
|» model_version|body|string| yes ||Model version, which must be combined with model_name to match an entry in the allowlist. Kling: 2.1, 3.0, 3.0-Omni, O1 (use the capitalization specified in the documentation; the gateway internally applies ToLower and maps it to aigc-image-kling-*).|
|» prompt|body|string| no ||The prompt used for generation. Required when file_infos is empty; optional when reference images are provided.|
|» negative_prompt|body|string| no ||Negative prompt, prevents specified content from being generated|
|» enhance_prompt|body|string| no ||Whether to automatically optimize the prompt|
|» file_infos|body|[object]| no ||Reference images. Default: 1 image; GEM supports up to 3 images. Use lowercase file/url for type (gateway side).|
|» output_config|body|object| no ||none|
|» session_id|body|string| no ||Deduplication identifier; using the same identifier within three days will cause an error. An empty or omitted value disables deduplication.|
|» session_context|body|string| no ||Source context; callbacks/queries can pass it through in the response.|
|» tasks_priority|body|integer| no ||Task priority; the higher the value, the higher the priority. Defaults to 0.|
|» ext_info|body|any| no ||Extended parameters; a JSON object or string can be passed, and the gateway converts it as needed when forwarding it to the official API|
|»» *anonymous*|body|object| no ||none|
|»» *anonymous*|body|string| no ||none|

#### Enum

|Name|Value|
|---|---|
|» model_name|GEM|
|» model_name|Qwen|
|» model_name|Hunyuan|
|» model_name|Kling|
|» model_version|2.5|
|» model_version|3.0|
|» model_version|0925|
|» model_version|2.1|
|» model_version|3.0-Omni|
|» model_version|O1|
|» enhance_prompt|Enabled|
|» enhance_prompt|Disabled|

> Response Examples

> 200 Response

```json
{
    "Response": {
        "TaskId": "251007502-AigcImage***2782aff1e896673f1ft",
        "RequestId": "f50d7667-72d8-46bb-a7e3-0613588971b6"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

*TencentVodQueryTaskResponse*

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» Response|object|true|none||none|

# Key4U English/Image Generation/Wan

## POST wan2.7-image-pro

POST /v1/images/generations

> Body Parameters

```json
{
    "model": "wan2.7-image-pro",
    "prompt": "A flower shop with elegant windows, a beautiful wooden door, and flowers on display"
}
```

```json
{
    "model": "wan2.7-image-pro",
    "prompt": "Sunrise over a snow-capped mountain lake, photorealistic photography",
    "size": "4K"
}
```

```json
{
    "model": "wan2.7-image-pro",
    "prompt": "Cinematic widescreen cityscape at night",
    "size": "1920*1080",
    "watermark": false
}
```

```json
{
    "model": "wan2.7-image-pro",
    "prompt": "Same-seed reproducibility test, red rose",
    "size": "2K",
    "n": 1,
    "watermark": false,
    "seed": 42
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes | wan2.7-image-pro Text-to-Image Request|none|
|» model|body|string| yes | model|Always set to wan2.7-image-pro|
|» prompt|body|string| yes | Prompt|[Required] Text-to-image positive prompt|
|» size|body|string| no | Resolution|[PASTE YOUR CHINESE TEXT HERE]|
|» n|body|integer| no | Number of Images to Generate|1-4, default: 1|
|» watermark|body|boolean| no | Watermark|false = no watermark (upstream default), true = add an 'AI-generated' watermark|
|» seed|body|integer| no | Random seed|Optional; using the same seed can improve reproducibility.|

#### Description

**» size**: [PASTE YOUR CHINESE TEXT HERE]
"Optional. (1) Resolution tier: 1K / 2K (default) / 4K (text-to-image only) (2) Dimensions: 1920*1080 or 1920x1080 (Note: Custom dimensions are supported. The total pixel count must be within [768 * 768, 4096 * 4096], and the aspect ratio must be within [1:8, 8:1].)"

> Response Examples

> 200 Response

```json
{"error":{"message":"invalid request body: json: cannot unmarshal string into Go struct field GeneralOpenAIRequest.response_format of type dto.ResponseFormat (request id: 20260507163239913971004ZVwereT)","type":"new_api_error","param":"","code":"invalid_request"}}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

*[PASTE YOUR CHINESE TEXT HERE]
"POST /v1/images/generations · wan2.7-image-pro Successful Response"*

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» created|integer|true|none||Unix timestamp (seconds)|
|» data|[object]|true|none||none|

# Key4U English/Video Generation/Veo/3.1 Native Format

## POST Video Generation veo-3.1-generate-preview

POST /v1/video/generations

> Body Parameters

```json
{
  "model": "veo-3.1-fast-generate-preview",
  "prompt": "A close up of two people staring at a cryptic drawing on a wall",
  "metadata": {
    "aspectRatio": "16:9",
    "durationSeconds": 6
  }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Video generation veo-3.1-fast-generate-preview

POST /v1beta/models/veo-3.1-fast-generate-preview:predictLongRunning

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Video Generation/Luma/Official API Format

## POST Submit Video Generation Task

POST /luma/generations

Official documentation: https://docs.lumalabs.ai/docs/video-generation

> Body Parameters

```json
{
    "user_prompt": "A gust of wind blows through the forest, causing the woman's veil to flutter gently.",
    "model_name": "ray-v2",
    "duration": "5s",
    "resolution": "720p"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» user_prompt|body|string| yes ||Required. The prompt/question description input by the user.|
|» expand_prompt|body|boolean| yes ||Optional, prompt optimization switch|
|» loop|body|boolean| yes ||Optional, whether to loop through the reference image|
|» image_url|body|string| yes ||Optional, refer to image source|
|» image_end_url|body|string| yes ||Optional, target keyframe image|
|» notify_hook|body|string| yes ||Optional, callback notification address after processing is completed|
|» resolution|body|string| yes ||720p or 1080p, default is 720p|
|» duration|body|string| yes ||Duration only supports 5s|
|» model_name|body|string| yes ||ray-v1, ray-v2 official display is ray1.6 ray2|

> Response Examples

> 200 Response

```json
{
    "id": "4665a07c-7641-4809-a133-10786201bb56",
    "prompt": "",
    "state": "pending",
    "queue_state": null,
    "created_at": "2024-12-22T13:38:40.139409Z",
    "batch_id": "",
    "video": null,
    "video_raw": null,
    "liked": null,
    "estimate_wait_seconds": null,
    "thumbnail": null,
    "last_frame": null
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## POST Extended Video

POST /luma/generations/{task_id}/extend

Official documentation: https://docs.lumalabs.ai/docs/video-generation

> Body Parameters

```json
{
    "user_prompt": "add cat",
    "expand_prompt": true
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||task id is the video task id that needs to be extended|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» user_prompt|body|string| yes ||Required. The prompt/question description input by the user, serving as the primary input for content generation.|
|» expand_prompt|body|boolean| yes ||Optional, whether to enable prompt optimization feature|
|» image_url|body|string| yes ||Optional, reference image URL or Base64 encoding|
|» image_end_url|body|string| yes ||Optional, keyframe image URL or Base64 encoded data|
|» notify_hook|body|string| yes ||Optional, callback notification address|

> Response Examples

> 200 Response

```json
{
    "id": "749d328e-4fd0-43a8-8c89-32394d60da69",
    "prompt": "",
    "state": "pending",
    "queue_state": null,
    "created_at": "2024-12-22T14:48:39.947851Z",
    "batch_id": "",
    "video": null,
    "video_raw": null,
    "liked": null,
    "estimate_wait_seconds": null,
    "thumbnail": null,
    "last_frame": null
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

# Key4U English/Video Generation/Luma/Query Task

## GET Query a Single Task

GET /luma/generations/{task_id}

state": "completed" Enumeration values: "pending", "processing", "completed", "failed

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||Task ID|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{"id": "4665a07c-7641-4809-a133-10786201bb56", "state": "completed", "video": {"url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4", "width": 1360, "height": 752, "download_url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4"}, "request": {"prompt": "cat dance", "aspect_ratio": "16:9"}, "artifact": {"video": {"url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4", "width": 1360, "height": 752, "download_url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4"}, "thumbnail": {"url": "https://imagedelivery.net/1KomXrSWiTojGGip43n0SQ/e4268de5-4a74-45ff-67b8-dc46df12de00/public", "width": 1360, "height": 752, "palette": {"grid": "em9csKqXYUgqdHVmmqeZLB8YaFpLjVw2bmFTTElBHhMNTzgodD8eVzUeTDorRSkYYEQymV80e1M0ck0ugWVRwKCApWk0hF1BgmVP"}, "media_type": "image"}, "video_raw": {"url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4", "width": 1360, "height": 752, "duration": 5.041667, "media_type": "video"}, "created_at": "0001-01-01T00:00:00Z", "last_frame": {"url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/606108d9-9daf-4265-84fb-595f18240ac5/video_0_last_frame.jpg", "width": 1360, "height": 752, "palette": null, "media_type": "image"}}, "thumbnail": {"url": "https://imagedelivery.net/1KomXrSWiTojGGip43n0SQ/e4268de5-4a74-45ff-67b8-dc46df12de00/public", "width": 1360, "height": 752, "palette": {"grid": "em9csKqXYUgqdHVmmqeZLB8YaFpLjVw2bmFTTElBHhMNTzgodD8eVzUeTDorRSkYYEQymV80e1M0ck0ugWVRwKCApWk0hF1BgmVP"}, "media_type": "image"}, "video_raw": {"url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4", "width": 1360, "height": 752, "duration": 5.041667, "media_type": "video"}, "created_at": "2024-12-22T13:38:40.139Z", "last_frame": {"url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/606108d9-9daf-4265-84fb-595f18240ac5/video_0_last_frame.jpg", "width": 1360, "height": 752, "palette": null, "media_type": "image"}}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» state|string|true|none||none|
|» video|object|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|
|»» height|integer|true|none||none|
|»» download_url|string|true|none||none|
|» request|object|true|none||none|
|»» prompt|string|true|none||none|
|»» aspect_ratio|string|true|none||none|
|» artifact|object|true|none||none|
|»» video|object|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|»»» height|integer|true|none||none|
|»»» download_url|string|true|none||none|
|»» thumbnail|object|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|»»» height|integer|true|none||none|
|»»» palette|object|true|none||none|
|»»»» grid|string|true|none||none|
|»»» media_type|string|true|none||none|
|»» video_raw|object|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|»»» height|integer|true|none||none|
|»»» duration|number|true|none||none|
|»»» media_type|string|true|none||none|
|»» created_at|string|true|none||none|
|»» last_frame|object|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|»»» height|integer|true|none||none|
|»»» palette|null|true|none||none|
|»»» media_type|string|true|none||none|
|» thumbnail|object|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|
|»» height|integer|true|none||none|
|»» palette|object|true|none||none|
|»»» grid|string|true|none||none|
|»» media_type|string|true|none||none|
|» video_raw|object|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|
|»» height|integer|true|none||none|
|»» duration|number|true|none||none|
|»» media_type|string|true|none||none|
|» created_at|string|true|none||none|
|» last_frame|object|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|
|»» height|integer|true|none||none|
|»» palette|null|true|none||none|
|»» media_type|string|true|none||none|

## POST Batch Retrieve Tasks

POST /luma/tasks

state": "completed" Enumeration values: "pending", "processing", "completed", "failed

> Body Parameters

```json
{
    "ids": [
        "4665a07c-7641-4809-a133-10786201bb56"
    ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||The model to use, optional, defaults to kling-image|
|» prompt|body|string| yes ||Positive prompt, required, describes the image content you want to generate, cannot exceed 500 characters|
|» negative_prompt|body|string| yes ||Negative prompt, optional, describes elements you do not want to appear in the image, cannot exceed 200 characters|
|» image|body|string| yes ||Reference image, optional, supports Base64 encoding or image URL, supports .jpg/.jpeg/.png formats, size must not exceed 10MB|
|» image_fidelity|body|number| yes ||Reference image influence strength, optional, value range: 0-1, the larger the value, the more closely the generated image resembles the reference image|
|» n|body|integer| yes ||The number of images to generate, optional, valid range: 1-9|
|» aspect_ratio|body|string| yes ||The aspect ratio of the generated image, optional. Possible values: 16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3|
|» callback_url|body|string| yes ||Callback notification address, optional. When the task status changes, the system will send a notification to this address.|

> Response Examples

> 200 Response

```json
[
    {
        "artifact": {
            "created_at": "0001-01-01T00:00:00Z",
            "last_frame": {
                "height": 752,
                "media_type": "image",
                "palette": null,
                "url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/606108d9-9daf-4265-84fb-595f18240ac5/video_0_last_frame.jpg",
                "width": 1360
            },
            "thumbnail": {
                "height": 752,
                "media_type": "image",
                "palette": {
                    "grid": "em9csKqXYUgqdHVmmqeZLB8YaFpLjVw2bmFTTElBHhMNTzgodD8eVzUeTDorRSkYYEQymV80e1M0ck0ugWVRwKCApWk0hF1BgmVP"
                },
                "url": "https://imagedelivery.net/1KomXrSWiTojGGip43n0SQ/e4268de5-4a74-45ff-67b8-dc46df12de00/public",
                "width": 1360
            },
            "video": {
                "download_url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4",
                "height": 752,
                "url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4",
                "width": 1360
            },
            "video_raw": {
                "duration": 5.041667,
                "height": 752,
                "media_type": "video",
                "url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4",
                "width": 1360
            }
        },
        "created_at": "2024-12-22T13:38:40.139Z",
        "id": "4665a07c-7641-4809-a133-10786201bb56",
        "last_frame": {
            "height": 752,
            "media_type": "image",
            "palette": null,
            "url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/606108d9-9daf-4265-84fb-595f18240ac5/video_0_last_frame.jpg",
            "width": 1360
        },
        "request": {
            "aspect_ratio": "16:9",
            "prompt": "cat dance"
        },
        "state": "completed",
        "thumbnail": {
            "height": 752,
            "media_type": "image",
            "palette": {
                "grid": "em9csKqXYUgqdHVmmqeZLB8YaFpLjVw2bmFTTElBHhMNTzgodD8eVzUeTDorRSkYYEQymV80e1M0ck0ugWVRwKCApWk0hF1BgmVP"
            },
            "url": "https://imagedelivery.net/1KomXrSWiTojGGip43n0SQ/e4268de5-4a74-45ff-67b8-dc46df12de00/public",
            "width": 1360
        },
        "video": {
            "download_url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4",
            "height": 752,
            "url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4",
            "width": 1360
        },
        "video_raw": {
            "duration": 5.041667,
            "height": 752,
            "media_type": "video",
            "url": "https://storage.cdn-luma.com/dream-machine/b0d67582-c6f0-4973-a89c-3fea9d46d5e9/35049450-c008-4607-b1d0-0b025599f15d/video0b6619468da8e409da860706bbf26bbad.mp4",
            "width": 1360
        }
    }
]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» artifact|object|false|none||none|
|»» created_at|string|true|none||none|
|»» last_frame|object|true|none||none|
|»»» height|integer|true|none||none|
|»»» media_type|string|true|none||none|
|»»» palette|null|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|»» thumbnail|object|true|none||none|
|»»» height|integer|true|none||none|
|»»» media_type|string|true|none||none|
|»»» palette|object|true|none||none|
|»»»» grid|string|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|»» video|object|true|none||none|
|»»» download_url|string|true|none||none|
|»»» height|integer|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|»» video_raw|object|true|none||none|
|»»» duration|number|true|none||none|
|»»» height|integer|true|none||none|
|»»» media_type|string|true|none||none|
|»»» url|string|true|none||none|
|»»» width|integer|true|none||none|
|» created_at|string|false|none||none|
|» id|string|false|none||none|
|» last_frame|object|false|none||none|
|»» height|integer|true|none||none|
|»» media_type|string|true|none||none|
|»» palette|null|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|
|» request|object|false|none||none|
|»» aspect_ratio|string|true|none||none|
|»» prompt|string|true|none||none|
|» state|string|false|none||none|
|» thumbnail|object|false|none||none|
|»» height|integer|true|none||none|
|»» media_type|string|true|none||none|
|»» palette|object|true|none||none|
|»»» grid|string|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|
|» video|object|false|none||none|
|»» download_url|string|true|none||none|
|»» height|integer|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|
|» video_raw|object|false|none||none|
|»» duration|number|true|none||none|
|»» height|integer|true|none||none|
|»» media_type|string|true|none||none|
|»» url|string|true|none||none|
|»» width|integer|true|none||none|

# Key4U English/Video Generation/Runway

## POST Submit video generation task

POST /runwayml/v1/image_to_video

Official documentation: https://docs.dev.runwayml.com/api/#tag/Start-generating/paths/~1v1~1image_to_video/post

> Body Parameters

```json
{
    "promptImage": "https://www.bt.cn/bbs/template/qiao/style/image/btlogo.png",
    "model": "gen4_turbo",
    "promptText": "cat dance",
    "watermark": false,
    "duration": 5,
    "ratio": "1280:768"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» promptImage|body|string| yes ||Required, HTTPS URL or data URI containing an encoded image as the first frame for video generation|
|» model|body|string| yes ||Required. Specifies the model variant to use. Possible values: "gen4_turbo" or "gen3a_turbo"|
|» ratio|body|string| yes ||Required. Output video resolution in the format "width:height". Different models support different resolutions.|
|» seed|body|integer| yes ||Optional, random seed value (0-4294967295), identical seeds produce similar results for identical requests|
|» promptText|body|string| yes ||Optional, string (≤1000 characters), detailed description of the content expected to appear in the video|
|» duration|body|integer| yes ||Optional, video duration in seconds, possible values: 5 or 10, default is 10|

> Response Examples

> 200 Response

```json
{
    "id": "4665a07c-7641-4809-a133-10786201bb56",
    "prompt": "",
    "state": "pending",
    "queue_state": null,
    "created_at": "2024-12-22T13:38:40.139409Z",
    "batch_id": "",
    "video": null,
    "video_raw": null,
    "liked": null,
    "estimate_wait_seconds": null,
    "thumbnail": null,
    "last_frame": null
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## GET Query Video Task (Free)

GET /runwayml/v1/tasks/{task_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||Task ID|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{
    "id": "4665a07c-7641-4809-a133-10786201bb56",
    "prompt": "",
    "state": "pending",
    "queue_state": null,
    "created_at": "2024-12-22T13:38:40.139409Z",
    "batch_id": "",
    "video": null,
    "video_raw": null,
    "liked": null,
    "estimate_wait_seconds": null,
    "thumbnail": null,
    "last_frame": null
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

# Key4U English/Video Generation/Kling

## POST lip-sync

POST /kling/v1/videos/lip-sync

1. Generate video
2. This API requires a video ID or video URL
When using a video ID, it must be used on the parent task account. Please proceed as soon as possible to avoid resource package expiration.
Official documentation: https://app.klingai.com/cn/dev/document-api/apiReference/model/videoTolip

The system provides multiple voice options to choose from. For specific voice effects, voice ID, and voice language correspondence relationships, [click here to view](https://docs.qingque.cn/s/home/eZQDvafJ4vXQkP8T9ZPvmye8S?identityId=2E1MlYrrPk4)

> Body Parameters

```json
{
    "input":{
        "video_id":"827964097668337738",//ID of the video generated by Kling AI
        // "video_url": "https://xxxxxxx.mp4", //The retrieval link for the uploaded video; fill in either this or the input·video_id parameter, not both empty and not both present at the same time
        "mode":"text2video",
        "text":"The weather is great todayThe weather is great todayThe weather is great todayThe weather is great todayThe weather is great todayThe weather is great todayThe weather is great todayThe weather is great todayThe weather is great todayThe weather is great todayThe weather is great today",
        "voice_id":"girlfriend_1_speech02",
        "voice_language":"zh"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» input|body|object| yes ||none|
|»» video_id|body|string| yes ||The ID of a video generated by Keling AI|
|»» video_url|body|string| yes ||The access link of the uploaded video and the input·video_id parameter must choose one to fill in; they cannot both be empty, and they cannot both have values|
|»» mode|body|string| yes ||Video Generation Mode|
|»» text|body|string| yes ||Audio synthesis script|
|»» voice_id|body|string| yes ||Timbre ID|
|»» voice_language|body|string| yes ||Timbre language, corresponding to timbre ID|

#### Enum

|Name|Value|
|---|---|
|»» mode|std|
|»» mode|pro|
|»» voice_language|zh|
|»» voice_language|en|

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "38905f60-e76c-4f77-adb3-867a5b67d41e",
    "data": {
        "task_id": "817067112967086149",
        "task_status": "submitted",
        "created_at": 1762832498885,
        "updated_at": 1762832498885
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» task_info|object|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## GET Query Task (Free)

GET /kling/v1/{action}/{action2}/{task_id}

> Body Parameters

```json
{}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|action|path|string| yes ||images or videos|
|action2|path|string| yes ||generations（images）、text2video（videos）、image2video（videos）、lip-sync（videos）、kolors-virtual-try-on（images）|
|task_id|path|string| yes ||Task ID|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|

#### Description

**action2**: generations（images）、text2video（videos）、image2video（videos）、lip-sync（videos）、kolors-virtual-try-on（images）

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "data": {
        "task_id": "CjMT7WdSwWcAAAAAALvB3g",
        "created_at": 1733851336696,
        "updated_at": 1733851344553,
        "task_result": {
            "images": [
                {
                    "id": "",
                    "url": "https://cdn.klingai.com/bs2/upload-kling-api/0923471513/image/CjMT7WdSwWcAAAAAALvB3g-0_raw_image_0.png"
                }
            ]
        },
        "task_status": "succeed",
        "task_status_msg": ""
    },
    "message": "SUCCEED",
    "request_id": "CjNTkGdSwxYAAAAAALud5A"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» object|string|true|none||none|
|» created|integer|true|none||none|
|» choices|[object]|true|none||none|
|»» index|integer|false|none||none|
|»» message|object|false|none||none|
|»»» role|string|true|none||none|
|»»» content|string|true|none||none|
|»» finish_reason|string|false|none||none|
|» usage|object|true|none||none|
|»» prompt_tokens|integer|true|none||none|
|»» completion_tokens|integer|true|none||none|
|»» total_tokens|integer|true|none||none|

# Key4U English/Video Generation/Dreamina

## POST Submit video generation task

POST /jimeng/submit/videos

> Body Parameters

```json
{
    "prompt": "A little pig running happily on the highway",
    "duration": 5,
    "aspect_ratio": "21:9",
    "cfg_scale": 0.5
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» image_url|body|string| yes ||This parameter must be passed for image-to-video generation.|
|» duration|body|integer| yes ||Video duration enumeration values 5, 10|
|» aspect_ratio|body|string| yes ||Video dimensions enumeration values "1:1", "21:9", "16:9", "9:16", "4:3", "3:4"|
|» cfg_scale|body|integer| yes ||none|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": "cgt-20250829165122-qkwch"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

## GET Query Video Task (Free)

GET /jimeng/fetch/{task_id}

TaskStatus:
"NOT_START"
"SUBMITTED"
"QUEUED"
"IN_PROGRESS"
"FAILURE"
"SUCCESS"

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||Task ID|

> Response Examples

> 200 Response

```json
{
    "code": "success",
    "message": "",
    "data": {
        "task_id": "cgt-20250829165122-qkwch",
        "action": "jimeng-videos",
        "status": "SUCCESS",
        "fail_reason": "",
        "submit_time": 1756457484,
        "start_time": 0,
        "finish_time": 1756457496,
        "progress": "100%",
        "data": {
            "code": "success",
            "data": {
                "data": {
                    "video": "https://ark-content-generation-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-1-0-pro/02175645748366600000000000000000000ffffac144da8be727d.mp4?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=AKLTYWJkZTExNjA1ZDUyNDc3YzhjNTM5OGIyNjBhNDcyOTQ%2F20250829%2Fcn-beijing%2Ftos%2Frequest&X-Tos-Date=20250829T085221Z&X-Tos-Expires=86400&X-Tos-Signature=21b6342d402b99e61d2f842485451b1bf6635d4547103233586f15e485b02a05&X-Tos-SignedHeaders=host",
                    "status": "SUCCESS",
                    "created_at": "2025-08-29T16:52:26.472319"
                },
                "action": "jimeng-videos",
                "status": "SUCCESS",
                "task_id": "cgt-20250829165122-qkwch",
                "platform": "jimeng",
                "progress": "100%",
                "start_time": 1756457496,
                "fail_reason": "",
                "finish_time": 1756457546,
                "search_item": "",
                "submit_time": 1756457484
            },
            "message": ""
        }
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» message|string|true|none||none|
|» request_id|string|true|none||none|
|» data|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|
|»» created_at|integer|true|none||none|
|»» updated_at|integer|true|none||none|

# Key4U English/Video Generation/Doubao

## POST seedance-1-5-pro

POST /volc/v1/contents/generations/tasks

> Body Parameters

```json
{
    "model": "doubao-seedance-1-5-pro-251215",
    "content": [
        {
            "type": "text",
            "text": "A girl holds a fox. The girl opens her eyes and gazes gently into the camera. The fox is held in a friendly manner. The camera slowly pulls back. The girl's hair is blown by the wind, and the sound of the wind can be heard."
        },
        {
            "type": "image_url",
            "image_url": {
                "url": "https://ark-project.tos-cn-beijing.volces.com/doc_image/i2v_foxrgirl.png"
            }
        }
    ],
    "ratio": "adaptive",
    "duration": 4,
    "watermark": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» model|body|string| yes ||The ID of the model you need to call|
|» content|body|[object]| yes ||Information input to the model for video generation, supporting both text information and image information.|
|»» type|body|string| yes ||Input Content Type|
|»» text|body|string| no ||Text content input to the model that describes the desired video to be generated|
|»» image_url|body|object| yes ||none|
|»»» url|body|string| yes ||Image object input to the model, image URL|
|»» role|body|string| yes ||The location or purpose of the image.|

> Response Examples

```json
{
    "id": "cgt-20250918170228-dw9rb",
    "status": "submitted"
}
```

```json
{
    "id": "cgt-20260108111352-gwv4p",
    "status": "submitted"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|

## GET Query Video Generation Task List - Search Multiple Task IDs

GET /volc/v1/contents/generations/tasks

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|filter.task_ids|query|array[string]| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query a Single Task

GET /volc/v1/contents/generations/tasks/{task_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Accept|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Create Video Generation Task API (doubao-2.0)

POST /api/v3/contents/generations/tasks

https://www.volcengine.com/docs/82379/1520757?lang=zh

> Body Parameters

```json
{
    "model": "doubao-seedance-2-0-260128",
    "content": [
        {
            "type": "text",
            "text": "Use the first-person perspective composition from Video 1 throughout. Use Audio 1 as background music throughout. First-person perspective fruit tea promotional advertisement for Seedance brand's 'Ping Ping An An' limited edition apple fruit tea; The first frame is Image 1: your hand picks an Aksu red apple with morning dew, accompanied by a crisp apple collision sound; 2-4 seconds: quick cut to your hand dropping apple chunks into a shaker cup, adding ice cubes and tea base, shaking vigorously with ice collision sounds and shaking rhythm synced to upbeat drum beats, background voice: 'Freshly cut and shaken'; 4-6 seconds: first-person close-up of the finished product, layered fruit tea poured into a transparent cup, your hand gently spreading milk foam on top, attaching a pink and red label on the cup body, camera zooms in to show the layered texture between milk foam and fruit tea; 6-8 seconds: first-person holding the cup up, you hold the fruit tea from Image 2 in front of the lens (simulating handing it to the audience), cup label clearly visible, background voice 'Take a refreshing sip', final frame freezes on Image 2. Background audio consistently uses a female voice tone."
        },
        {
            "type": "image_url",
            "image_url": {
                "url": "https://ark-project.tos-cn-beijing.volces.com/doc_image/r2v_tea_pic1.jpg"
            },
            "role": "reference_image"
        },
        {
            "type": "image_url",
            "image_url": {
                "url": "https://ark-project.tos-cn-beijing.volces.com/doc_image/r2v_tea_pic2.jpg"
            },
            "role": "reference_image"
        },
        {
            "type": "video_url",
            "video_url": {
                "url": "https://pro.filesystem.site/cdn/20260403/0e80a635b859e7716671a40d836135.mp4"
            },
            "role": "reference_video"
        },
        {
            "type": "audio_url",
            "audio_url": {
                "url": "https://ark-project.tos-cn-beijing.volces.com/doc_audio/r2v_tea_audio1.mp3"
            },
            "role": "reference_audio"
        }
    ],
    "generate_audio": true,
    "ratio": "21:9",
    "duration": 11,
    "watermark": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||none|
|» content|body|[object]| yes ||none|
|»» type|body|string| yes ||none|
|»» text|body|string| no ||none|
|»» image_url|body|object| yes ||none|
|»»» url|body|string| yes ||none|
|»» role|body|string| yes ||none|
|»» video_url|body|object| no ||none|
|»»» url|body|string| yes ||none|
|»» audio_url|body|object| no ||none|
|»»» url|body|string| yes ||none|
|» generate_audio|body|boolean| no ||none|
|» ratio|body|string| no ||none|
|» duration|body|integer| no ||none|
|» watermark|body|boolean| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET doubao-2.0 query video generation task list

GET /api/v3/contents/generations/tasks

https://www.volcengine.com/docs/82379/1521675?lang=zh

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|page_size|query|string| no ||none|
|filter.status|query|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET doubao-2.0 Query Video Generation Task API

GET /api/v3/contents/generations/tasks/{id}

https://www.volcengine.com/docs/82379/1521309?lang=zh

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|

> Response Examples

> 200 Response

```json
{
    "content": {
        "video_url": "https://ark-acg-cn-beijing.tos-cn-beijing.volces.com/doubao-seedance-2-0/02177831701906400000000000000000000ffffac1778adc6a32f.mp4?X-Tos-Algorithm=TOS4-HMAC-SHA256&X-Tos-Credential=AKLTYWJkZTExNjA1ZDUyNDc3YzhjNTM5OGIyNjBhNDcyOTQ%2F20260509%2Fcn-beijing%2Ftos%2Frequest&X-Tos-Date=20260509T090109Z&X-Tos-Expires=86400&X-Tos-Signature=699d4a345c3573c9b86f2f145db21c00bfd32d7f8d1fe0bbe499ce54d92a0af5&X-Tos-SignedHeaders=host"
    },
    "created_at": 1778317019,
    "draft": false,
    "duration": 10,
    "execution_expires_after": 172800,
    "framespersecond": 24,
    "generate_audio": true,
    "id": "cgt-20260509165650-6rxbv",
    "model": "doubao-seedance-2-0-260128",
    "ratio": "1:1",
    "resolution": "720p",
    "seed": 70882,
    "service_tier": "default",
    "status": "succeeded",
    "updated_at": 1778317294,
    "usage": {
        "completion_tokens": 216900,
        "total_tokens": 216900
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» content|object|true|none||none|
|»» video_url|string|true|none||none|
|» created_at|integer|true|none||none|
|» draft|boolean|true|none||none|
|» duration|integer|true|none||none|
|» execution_expires_after|integer|true|none||none|
|» framespersecond|integer|true|none||none|
|» generate_audio|boolean|true|none||none|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» ratio|string|true|none||none|
|» resolution|string|true|none||none|
|» seed|integer|true|none||none|
|» service_tier|string|true|none||none|
|» status|string|true|none||none|
|» updated_at|integer|true|none||none|
|» usage|object|true|none||none|
|»» completion_tokens|integer|true|none||none|
|»» total_tokens|integer|true|none||none|

# Key4U English/Video Generation/sora

## POST Create Role

POST /sora/v1/characters

> Body Parameters

```json
{
  // "url": "https://filesystem.site/cdn/20251030/javYrU4etHVFDqg8by7mViTWHlMOZy.mp4",
    "timestamps": "1,3",
    "from_task":"video_e50c76ca-21d4-40e9-8485-e4ead2d37133"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» url|body|string| no ||The video contains roles that need to be created. Either url or from_task must be selected (choose one).|
|» timestamps|body|string| yes ||In seconds, for example '1,2' refers to characters appearing in the 1-2 second range of the video. Note that the range difference must be a maximum of 3 seconds and a minimum of 1 second.|
|» from_task|body|string| no ||You can create a role based on the task ID that has already been generated.|

> Response Examples

> 200 Response

```json
{
    "id": "ch_6918d62178e48191a0b1ae49be428a13",
    "username": "hfspncadz.mooflapand",
    "permalink": "https://sora.chatgpt.com/profile/hfspncadz.mooflapand",
    "profile_picture_url": "https://videos.openai.com/az/files/00000000-b788-71f7-9de5-96555ff29024%2Fraw?se=2025-11-20T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-15T01%3A48%3A34Z&ske=2025-11-22T01%3A53%3A34Z&sks=b&skv=2024-08-04&sig=3/KGVtkEsZWBTmErhzUEU5pWrnL8JxRKH0wVCQvh6Fo%3D&ac=oaisdmntprsouthcentralus"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||role id|
|» username|string|true|none||Role name, used to be placed in the prompt @{username}|
|» permalink|string|true|none||Role homepage, navigate to OpenAI role homepage|
|» profile_picture_url|string|true|none||Character Avatar|

# Key4U English/Video Generation/sora/OpenAI Official Video Format

## GET OpenAI Query Task

GET /v1/videos/{id}

Given a prompt, the model will return one or more predicted completions, and can also return the probability of alternative tokens at each position.

Create a completion for the provided prompt and parameters

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| no ||none|
|X-Forwarded-Host|header|string| no ||none|
|body|body|object| no ||none|

> Response Examples

```json
{
    "id": "sora-2:task_01k6x15vhrff09dkkqjrzwhm60",
    "detail": {
        "id": "task_01k6x15vhrff09dkkqjrzwhm60",
        "input": {
            "size": "small",
            "model": "sy_ore",
            "images": [
                "https://filesystem.site/cdn/20250612/VfgB5ubjInVt8sG6rzMppxnu7gEfde.png",
                "https://filesystem.site/cdn/20250612/998IGmUiM2koBGZM3UnZeImbPBNIUL.png"
            ],
            "prompt": "make animate",
            "orientation": "portrait"
        },
        "status": "pending",
        "pending_info": {
            "id": "task_01k6x15vhrff09dkkqjrzwhm60",
            "seed": null,
            "type": "video_gen",
            "user": "user-a1sGDUIOXV32hNITe59LEkHa",
            "model": "sy_8",
            "title": "New Video",
            "width": 352,
            "height": 640,
            "prompt": "make animate",
            "sdedit": null,
            "status": "processing",
            "actions": null,
            "guidance": null,
            "n_frames": 450,
            "priority": 2,
            "operation": "simple_compose",
            "preset_id": null,
            "created_at": "2025-10-06T15:10:26.875729Z",
            "n_variants": 1,
            "project_id": null,
            "request_id": null,
            "generations": [],
            "tracking_id": null,
            "progress_pct": 0.9302178175176704,
            "remix_config": null,
            "inpaint_items": [
                {
                    "type": "image",
                    "preset_id": null,
                    "crop_bounds": null,
                    "frame_index": 0,
                    "cameo_file_id": null,
                    "generation_id": null,
                    "upload_media_id": "media_01k6x15tnzezbst05sth2qgd8r",
                    "source_end_frame": 0,
                    "uploaded_file_id": null,
                    "source_start_frame": 0
                },
                {
                    "type": "image",
                    "preset_id": null,
                    "crop_bounds": null,
                    "frame_index": 0,
                    "cameo_file_id": null,
                    "generation_id": null,
                    "upload_media_id": "media_01k6x15tzafwztz74t018v3enw",
                    "source_end_frame": 0,
                    "uploaded_file_id": null,
                    "source_start_frame": 0
                }
            ],
            "interpolation": null,
            "is_storyboard": null,
            "failure_reason": null,
            "organization_id": null,
            "moderation_result": {
                "code": null,
                "type": "passed",
                "task_id": "task_01k6x15vhrff09dkkqjrzwhm60",
                "is_output_rejection": false,
                "results_by_frame_index": {}
            },
            "needs_user_review": false,
            "queue_status_message": null,
            "progress_pos_in_queue": null,
            "num_unsafe_generations": 0,
            "estimated_queue_wait_time": null
        }
    },
    "status": "pending",
    "status_update_time": 1759763621142
}
```

```json
{
    "id": "video_5c6a605a-30c0-4a6a-9dbd-d1d6cfdd9980",
    "size": "1280x720",
    "model": "sora-2",
    "object": "video",
    "status": "completed",
    "seconds": "10",
    "progress": 100,
    "video_url": "https://midjourney-plus.oss-us-west-1.aliyuncs.com/sora/cc4fb429-22a5-4747-a6f9-a6badccf8f42.mp4",
    "created_at": 1761622232,
    "completed_at": 1761622385
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|
|» video_url|null|true|none||none|
|» enhanced_prompt|string|true|none||none|
|» status_update_time|integer|true|none||none|

## GET openai download video

GET /v1/videos/{id}/content

Given a prompt, the model will return one or more predicted completions, and can also return the probability of alternative tokens at each position.

Create a completion for the provided prompt and parameters

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| no ||none|
|X-Forwarded-Host|header|string| no ||none|
|body|body|object| no ||none|

> Response Examples

> 200 Response

```json
{
  "id": "string",
  "status": "string",
  "video_url": null,
  "enhanced_prompt": "string",
  "status_update_time": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|
|» video_url|null|true|none||none|
|» enhanced_prompt|string|true|none||none|
|» status_update_time|integer|true|none||none|

## POST Create a character from the uploaded video

POST /v1/videos/characters

> Body Parameters

```yaml
name: Cute little fish
video: file://C:\Users\Administrator\Desktop\download.mp4

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» name|body|string| yes ||Define the role name.|
|» video|body|string(binary)| yes ||Video files used for creating characters. Currently, short clips of 2 to 4 seconds work best when uploading characters, with aspect ratios of 16:9 or 9:16 and resolutions ranging from 720p to 1080p. Character source videos perform best when they match the output aspect ratio. If the aspect ratios differ, characters may appear stretched or distorted. A single video can contain up to two characters.|

#### Description

**» name**: Define the role name.

Maximum length: 80
Minimum length: 1

> Response Examples

> 200 Response

```json
{
    "id": "video_5c6a605a-30c0-4a6a-9dbd-d1d6cfdd9980",
    "object": "video",
    "model": "sora-2",
    "status": "queued",
    "progress": 0,
    "created_at": 1761622232,
    "seconds": "10",
    "size": "1280x720"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST OpenAI video editing

POST /v1/videos/{id}/remix

> Body Parameters

```json
{
    "prompt": "Make the image more detailed",
    "size": "1280x720"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| yes ||none|
|body|body|object| no ||none|
|» prompt|body|string| yes ||none|

> Response Examples

> 401 Response

```json
{
    "id": "video_8a60610c-3a5e-4ca8-be05-405f0dc635d0",
    "object": "video",
    "model": "sora_video2",
    "status": "queued",
    "progress": 0,
    "created_at": 1766374127,
    "seconds": "10",
    "size": "1280x720",
    "remixed_from_video_id": "e3215864-dd3c-49b1-8475-e4669b6d5c33",
    "detail": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **401**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» error|object|true|none||none|
|»» message|string|true|none||none|
|»» message_zh|string|true|none||none|
|»» type|string|true|none||none|

# Key4U English/Video Generation/grok/Unified Video Format

## POST Extended Video

POST /v1/video/extend

> Body Parameters

```json
{
    "model": "grok-video-3",
    "prompt": "play with another white cat",
    "task_id": "grok:7fd641dc-437f-44c3-97a2-e3778e0e10fb",
    "size": "1080p",
    "start_time": 3,
    "upscale": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Model name, e.g.: grok-video-3|
|» prompt|body|string| yes ||Prompt|
|» task_id|body|string| yes ||Expand video task ID|
|» aspect_ratio|body|string| no ||Optional ratios are 2:3, 3:2, and 1:1; extend the video dimensions as needed.|
|» size|body|string| no ||720P or 1080P|
|» start_time|body|integer| yes ||Start Time|
|» upscale|body|boolean| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Video Generation/grok/OpenAI video format

## POST OpenAI creates videos, image-to-video

POST /v1/videos

> Body Parameters

```yaml
model: grok-videos
prompt: Make the cow happily dance Ke Mu San
seconds: 6
input_reference: ""
size: 16:9

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Model Name|
|» prompt|body|string| yes ||Prompt|
|» seconds|body|number| no ||Duration: 6s / 10s|
|» input_reference|body|string| no ||Image URL|
|» size|body|string| no ||16:9  , 9:16|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Video Generation/grok/Official Format

## POST Create Video

POST /v1/videos/generations

> Body Parameters

```json
{
  "model": "string",
  "prompt": "string",
  "resolution": "string",
  "aspect_ratio": "string",
  "duration": 0,
  "image": {
    "url": "string"
  },
  "reference_images": [
    {
      "url": "string"
    }
  ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model|body|string| yes ||grok-imagine-video、grok-imagine-video-1.5-preview|
|» prompt|body|string| yes ||Prompt|
|» resolution|body|string| yes ||("480p" | "720p")|
|» aspect_ratio|body|string| yes ||("1:1" | "16:9" | "9:16")|
|» duration|body|integer| yes ||[1, 15]|
|» image|body|object| no ||Cannot be used together with reference_images|
|»» url|body|string| yes ||none|
|» reference_images|body|[object]| no ||Cannot be used together with reference_images|
|»» url|body|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "model": "grok-imagine-video",
    "prompt": "A serene lake at sunrise with mist rolling over the water",
    "duration": 4,
    "aspect_ratio": "16:9",
    "resolution": "480p",
    // "image":{
    //     "url":"https://imageproxy.zhongzhuan.chat/api/proxy/image/bb9bd34363da4fa486c9e645a6b1349e.png"
    // }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Edit Video

POST /v1/videos/edits

> Body Parameters

```json
{
  "model": "string",
  "prompt": "string",
  "resolution": "string",
  "aspect_ratio": "string",
  "video": {
    "url": "string"
  }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model|body|string| yes ||grok-imagine-video|
|» prompt|body|string| yes ||Prompt|
|» resolution|body|string| yes ||("480p" | "720p")|
|» aspect_ratio|body|string| yes ||("1:1" | "16:9" | "9:16" )|
|» video|body|object| yes ||none|
|»» url|body|string| yes ||none|

> Response Examples

> 200 Response

```json
{
    "model": "grok-imagine-video",
    "prompt": "Give the woman a silver necklace",
    "video": {
        "url": "https://imageproxy.zhongzhuan.chat/api/proxy/image/5dada4bd5c095d1062b79582a51481bf.mp4"
    },
    "aspect_ratio": "16:9",
    "resolution": "480p",
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Search Videos

GET /v1/videos/{request_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|request_id|path|string| yes ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Video Generation/Tongyi Wanxiang

## POST happyhorse-1.0-video-edit

POST /alibailian/api/v1/services/aigc/video-generation/video-synthesis

> Body Parameters

```json
{
    "model": "happyhorse-1.0-video-edit",
    "input": {
        "prompt": "Make the horse-headed human-bodied character in the video wear the striped sweater in the picture",
        "media": [
            {
                "type": "video",
                "url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20260409/dozxak/Wan_Video_Edit_33_1.mp4"
            },
            {
                "type": "reference_image",
                "url": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20260415/hynnff/wan-video-edit-clothes.webp"
            }
        ]
    },
    "parameters": {
        "resolution": "720P"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Model name.|
|» input|body|object| yes ||Input|
|»» prompt|body|string| yes ||Text prompt. Used to describe the editing intent for the video, such as style transfer, local replacement, etc.|
|»» media|body|[object]| yes ||Media assets list, used to specify the video to be edited and reference images.|
|»»» type|body|string| yes ||Media material type. Optional values:|
|»»» url|body|string| yes ||Input Video (type=video)|
|» parameters|body|object| no ||parameter|
|»» resolution|body|string| no ||The resolution level of the generated video.|
|»» watermark|body|boolean| no ||Whether to add a watermark identifier on the generated video. The watermark is located in the lower right corner of the video, and the text is fixed as "Happy Horse".|
|»» audio_setting|body|string| no ||Sound control.|

#### Description

**» model**: Model name.

Fixed value: happyhorse-1.0-video-edit.

**»» prompt**: Text prompt. Used to describe the editing intent for the video, such as style transfer, local replacement, etc.

Supports any language input, length not exceeding 5000 non-Chinese characters or 2500 Chinese characters. Excess portions will be automatically truncated.

**»» media**: Media assets list, used to specify the video to be edited and reference images.

The array must contain 1 video type element; optionally contains 0~5 reference_image type elements.

**»»» type**: Media material type. Optional values:

video: Required. The video to be edited.

reference_image: Optional. Reference image.

Material restrictions:

Video count: Exactly 1.

Reference image count: 0-5.

**»»» url**: Input Video (type=video)

The URL of the video to be edited must be a publicly accessible URL.

Supports the HTTP and HTTPS protocols.

Example value: https://xxx/xxx.mp4.

Video Restrictions:

Format: MP4, MOV (H.264 encoding recommended).

Duration: 3~60 seconds.

Resolution: The longer side does not exceed 2160 pixels, and the shorter side is no less than 320 pixels.

Aspect ratio: 1:2.5~2.5:1.

File size: No more than 100MB.

Frame rate: Greater than 8fps.

Description
Output video duration: 3~15 seconds.

When the input video is no more than 15 seconds, the output video duration remains consistent with the input video.

When the input video exceeds 15 seconds, the system will automatically capture the first 15 seconds from the beginning as the valid segment, so the maximum output duration is 15 seconds.

Input Image (type=reference_image)

The URL of the reference image must be a publicly accessible URL.

Supports the HTTP or HTTPS protocol.

Example value: https://xxx/xxx.png.

Image Restrictions:

Format: JPEG, JPG, PNG, WEBP.

Resolution: Width and height must each be no less than 300 pixels.

Aspect ratio: 1:2.5~2.5:1.

File size: No more than 10MB.

**»» resolution**: The resolution level of the generated video.

Optional values:

1080P: Default value.

720P

**»» watermark**: Whether to add a watermark identifier on the generated video. The watermark is located in the lower right corner of the video, and the text is fixed as "Happy Horse".

true: default value, add watermark.

false: do not add watermark.

**»» audio_setting**: Sound control.

auto: default value, controlled by the model itself.

origin: preserve the original sound of the input video.

> Response Examples

> 200 Response

```json
{
    "request_id": "1445f928-f1b6-9c43-8143-bfaddb5989cf",
    "output": {
        "task_id": "86438901-c911-4bfa-9137-621478c85efd",
        "task_status": "PENDING"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» request_id|string|true|none||none|
|» output|object|true|none||none|
|»» task_id|string|true|none||none|
|»» task_status|string|true|none||none|

## GET Video Query

GET /alibailian/api/v1/tasks/{task_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||none|

> Response Examples

> 200 Response

```json
{
    "usage": {
        "SR": 480,
        "duration": 5,
        "video_count": 1
    },
    "output": {
        "task_id": "a55bfe14-6e78-4b9d-b97d-128420399ed1",
        "end_time": "2025-10-11 19:02:27.297",
        "video_url": "https://dashscope-result-bj.oss-cn-beijing.aliyuncs.com/1d/21/20251011/9b1c82b0/a55bfe14-6e78-4b9d-b97d-128420399ed1.mp4?Expires=1760266939&OSSAccessKeyId=LTAI5tDUB1cEqFCYhEwWry26&Signature=Fjpx1uAlmLmeYGWx0Ye7n%2F%2F9Isw%3D",
        "orig_prompt": "Change the lighting",
        "submit_time": "2025-10-11 18:55:56.952",
        "task_status": "SUCCEEDED",
        "actual_prompt": "A man in orange clothing rides a broomstick, flying at high speed from the right side of the frame to the left. His body is leaning forward, both hands gripping the broomstick handle tightly, head facing forward, mouth open as he shouts: 'Hey! Don't try to stop me!' The broomstick moves rapidly through the air, with the bristles blurred due to the speed. Below, three people stand on the sidewalk, wands raised and pointed at the airborne figure, their heads turning slightly to follow the direction of his flight as they watch his movements. Throughout the background, the continuous sounds of city street traffic, pedestrians conversing, wind, and the whooshing of the broomstick cutting through the air can be heard.",
        "scheduled_time": "2025-10-11 18:55:57.908"
    },
    "request_id": "ec8f059e-f2e5-4887-bb43-3306cd38f403"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» usage|object|true|none||none|
|»» SR|integer|true|none||none|
|»» duration|integer|true|none||none|
|»» video_count|integer|true|none||none|
|» output|object|true|none||none|
|»» task_id|string|true|none||none|
|»» end_time|string|true|none||none|
|»» video_url|string|true|none||none|
|»» orig_prompt|string|true|none||none|
|»» submit_time|string|true|none||none|
|»» task_status|string|true|none||none|
|»» actual_prompt|string|true|none||none|
|»» scheduled_time|string|true|none||none|
|» request_id|string|true|none||none|

# Key4U English/Video Generation/TC-Vidu/Unified Video Format

## POST Create Video

POST /vidu-native/video/generations

> Body Parameters

```json
// Use Vidu 1.5 for text-to-video
{
  "model": "TC-Vidu",
  "prompt": "A cute kitten is playing in the garden",
  "settings": {
    "settings": {
      "duration": 4,
      "resolution": "1080p",
      "aspect_ratio": "16:9"
    }
  } 
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||Model name grok-video-3|
|» prompt|body|string| yes ||prompt|
|» aspect_ratio|body|string| yes ||Optional: 2:3, 3:2, 1:1|
|» size|body|string| yes ||720P or 1080P|
|» images|body|[string]| yes ||Image link|

> Response Examples

```json
{
    "id": "veo3.1-components:1762241017-xTL0P9HvGF",
    "status": "pending",
    "status_update_time": 1762241017286
}
```

```json
{
    "id": "grok:299604b7-c5ea-47b5-bc64-c06f300f0d27",
    "status": "processing",
    "status_update_time": 1764522528
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|
|» status_update_time|integer|true|none||none|

## GET Query Task

GET /vidu-native/video/generations/{task_id}

Given a prompt, the model will return one or more predicted completions, and can also return the probability of alternative tokens at each position.

Create a completion for the provided prompt and parameters

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||none|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| no ||none|
|X-Forwarded-Host|header|string| no ||none|
|body|body|object| no ||none|

> Response Examples

````json
{
    "id": "033fa60e-f37c-4ff6-a44d-5585ffea938d",
    "status": "pending",
    "video_url": null,
    "enhanced_prompt": "```\nA surreal and whimsical digital painting of a majestic brown cow with large, feathered wings soaring gracefully through a vibrant blue sky. The cow has a joyful expression, its tail streaming behind it as it flies among fluffy white clouds. Below, a patchwork of green farmland stretches into the distance, with tiny farm buildings and a group of astonished farmers looking up in amazement. The scene is bathed in warm golden sunlight, creating a dreamlike and magical atmosphere. Art style inspired by fantasy illustrations with soft brushstrokes and rich, saturated colors.\n```",
    "status_update_time": 1750323167003
}
````

```json
{
    "id": "grok:299604b7-c5ea-47b5-bc64-c06f300f0d27",
    "mode": "text",
    "type": "create",
    "error": "",
    "model": "grok-3",
    "ratio": "3:2",
    "prompt": "cat fish  --mode=custom",
    "status": "completed",
    "post_id": "393ae1ec-1dc7-4f26-bb53-afe361bc3b3a",
    "asset_id": "393ae1ec-1dc7-4f26-bb53-afe361bc3b3a",
    "progress": 100,
    "trace_id": "4cc3a75aa6d6a0788f86195e0cbad44e",
    "upscaled": false,
    "video_id": "393ae1ec-1dc7-4f26-bb53-afe361bc3b3a",
    "video_url": "https://soruxgpt-saas-yimeng.soruxgpt.com/file_download/ca10efbb-ae64-426e-99f0-f365bc3cd941.mp4",
    "completed_at": 1764522552,
    "thumbnail_url": "https://soruxgpt-saas-yimeng.soruxgpt.com/file_download/f4fd6fe4-8091-4528-be32-335f4fc9af65.jpg",
    "video_file_id": "ca10efbb-ae64-426e-99f0-f365bc3cd941",
    "thumbnail_file_id": "f4fd6fe4-8091-4528-be32-335f4fc9af65",
    "status_update_time": 1764522552,
    "upscale_on_complete": false
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|
|» video_url|null|true|none||none|
|» enhanced_prompt|string|true|none||none|
|» status_update_time|integer|true|none||none|

# Key4U English/Video Generation/Tencent AIGC

## GET Get request result

GET /tencent-vod/v1/query/{task_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "Response": {
        "Status": "FINISH",
        "TaskType": "AigcImageTask",
        "RequestId": "12082802-fe37-410e-ae20-0cf14e91e018",
        "CreateTime": "2025-12-29T12:03:30Z",
        "FinishTime": "2025-12-29T12:03:43Z",
        "AigcImageTask": {
            "Input": {
                "Prompt": "pig",
                "ModelName": "GEM",
                "ModelVersion": "2.5",
                "OutputConfig": {
                    "StorageMode": "Temporary"
                },
                "EnhancePrompt": "Enabled",
                "NegativePrompt": "blur, distorted"
            },
            "Output": {
                "FileInfos": [
                    {
                        "FileUrl": "http://251000800.vod2.myqcloud.com/1a168d62vodcq251000800/ef0aa3215145403710877804273/aigcImageGenFile.png",
                        "ExpireTime": "2026-01-05T12:03:57Z",
                        "StorageMode": "Temporary"
                    }
                ]
            },
            "Status": "FINISH",
            "TaskId": "1392336703-AigcImageTask-47965947a83db42af4b1e3a74c243531t",
            "Progress": 100
        },
        "BeginProcessTime": "2025-12-29T12:03:30Z"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Create Task

POST /tencent-vod/v1/aigc-video

Official documentation: https://cloud.tencent.com/document/product/266/126240

> Body Parameters

```json
{
    "model_name": "Kling",
    "model_version": "1.6",
    "prompt": "A car driving on a highway, sunny weather",
    "negative_prompt": "blurry, shaky",
    "enhance_prompt": "Enabled",
    "output_config": {
        "storage_mode": "Temporary",
        "media_name": "car-video",
        "duration": 8,
        "resolution": "1080P",
        "aspect_ratio": "16:9",
        "audio_generation": "Enabled",
        "person_generation": "AllowAdult",
        "input_compliance_check": "Enabled",
        "output_compliance_check": "Enabled",
        "enhance_switch": "Enabled"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» model_name|body|string| yes ||Model name. Possible values:|
|» model_version|body|string| yes ||Model version. Valid values:|
|» prompt|body|string| yes ||Prompt|
|» negative_prompt|body|string| no ||Prompt words to prevent the model from generating videos.|
|» enhance_prompt|body|string| no ||Whether to automatically optimize the prompt. When enabled, it will automatically optimize the input Prompt to improve generation quality. Possible values are:|
|» file_infos|body|[object]| no ||A list containing up to three material resource images, used to describe the resource images that the model should use when generating videos.|
|»» type|body|string| no ||Input video file type. Possible values are:|
|»» category|body|string| no ||File classification. Values are:|
|»» file_id|body|string| no ||The media file ID of the image file, which is the globally unique identifier of the file on Video on Demand (VOD). This identifier is assigned by the VOD backend after the upload is successful. You can obtain this field from the video upload completion event notification or the VOD console. This parameter is valid when Type is set to File.|
|»» url|body|string| no ||Accessible file URL. This parameter is valid when Type is set to Url.|
|»» text|body|string| no ||Enter a description of the input image to help the model understand the image. Only valid for GEM 2.5 and GEM 3.0.|
|» last_frame_url|body|string| no ||Media file URL used as the last frame image to generate video. Notes:|
|» output_config|body|object| no ||Output media file configuration for video generation tasks.|
|»» storage_mode|body|string| no ||Storage mode. Possible values:|
|»» resolution|body|string| no ||Resolution of the generated video.|
|»» aspect_ratio|body|string| no ||Specifies the aspect ratio of the generated video.|
|»» audio_generation|body|string| no ||Whether to generate audio. Supported models include GV and OS. Valid values are:|
|»» duration|body|string| no ||The duration of the generated video, in seconds.|
|»» person_generation|body|string| no ||Whether to allow generation of people or faces. Possible values are:|
|»» input_compliance_check|body|string| no ||Whether to enable compliance checking of input content. Possible values are:|
|»» output_compliance_check|body|string| no ||Whether to enable compliance checking of output content. Possible values are:|
|» scene_type|body|string| no ||Scene type. Values are as follows:|
|» session_id|body|string| no ||Identification code used for deduplication. If a request with the same identification code has been made within three days, this request will return an error. Maximum 50 characters. Omitting this parameter or passing an empty string means deduplication is not performed.|
|» session_context|body|string| no ||Source context, used to pass through user request information. The callback upon completion of audio and video quality regeneration will return this field value. Maximum length: 1000 characters.|
|» tasks_priority|body|string| no ||The priority level of the task. A higher numerical value indicates higher priority. The value range is -10 to 10. If not specified, the default value is 0.|
|» ext_info|body|object| no ||Reserved field, used for special purposes.|
|»» AdditionalParameters|body|object| no ||none|
|»»» multi_shot|body|boolean| no ||Should a multi-shot video be generated?|
|»»» shot_type|body|string| no ||Storyboarding Method|
|»»» multi_prompt|body|[object]| no ||Scene information, such as prompts and durations.|
|»»»» index|body|integer| no ||Storyboard Index:|
|»»»» prompt|body|string| no ||Storyboard Prompt: "When using this, the content passed to the outer total prompt parameter is invalid.|
|»»»» duration|body|integer| no ||Storyboard Duration:|

#### Description

**» model_name**: Model name. Possible values:
Hailuo: Hailuo;
Kling: Kling;
Vidu;

Example value: GV

**» model_version**: Model version. Valid values:
- When ModelName is Hailuo, valid values are 02, 2.3, and 2.3-fast;
- When ModelName is Kling, valid values are 1.6, 2.0, 2.1, 2.5, O1, 3.0, and 3.0-Omni;
- When ModelName is Vidu, valid values are q2, q2-pro, q2-turbo, q3-pro, and q3-turbo;
Example value: 2.3

**» negative_prompt**: Prompt words to prevent the model from generating videos.
Example value: red

**» enhance_prompt**: Whether to automatically optimize the prompt. When enabled, it will automatically optimize the input Prompt to improve generation quality. Possible values are:
Enabled: Enable;
Disabled: Disable;

Example value: Enabled

**» file_infos**: A list containing up to three material resource images, used to describe the resource images that the model should use when generating videos.

Models that support multi-image input:
1. GV: When using multi-image input, LastFrameFileId and LastFrameUrl cannot be used.
2. Vidu: Supports multi-image reference for video generation. For the q2 model, 1-7 images are supported. You can pass the ObjectId from FileInfos as the subject ID.

Notes:
1. Image size must not exceed 10 MB.
2. Supported image formats: jpeg, png.

**»» type**: Input video file type. Possible values are:
File: On-demand media file;
Url: Accessible URL;

Example value: File

**»» category**: File classification. Values are:
Image: Image;
Video: Video.
Example value: Image

**»» file_id**: The media file ID of the image file, which is the globally unique identifier of the file on Video on Demand (VOD). This identifier is assigned by the VOD backend after the upload is successful. You can obtain this field from the video upload completion event notification or the VOD console. This parameter is valid when Type is set to File.

Note:
1. It is recommended to use images smaller than 7MB.
2. The valid image formats are: jpeg, jpg, png, webp.

Example value: 3704211***509819

**»» url**: Accessible file URL. This parameter is valid when Type is set to Url.

Notes:
1. It is recommended to use images smaller than 7 MB.
2. The valid image formats are: jpeg, jpg, png, webp.

Example value: https://test.com/1.png

**»» text**: Enter a description of the input image to help the model understand the image. Only valid for GEM 2.5 and GEM 3.0.

Example value: Task background: This is the main building that needs renovation (Figure 1), and its geometric structure must not be altered.

**» last_frame_url**: Media file URL used as the last frame image to generate video. Notes:
1. Only supports models GV, Kling, and Vidu; other models are not supported. When ModelName is GV, if this parameter is specified, FileInfos must also be specified as the first frame of the video to be generated. When ModelName is Kling, ModelVersion is 2.1, and the output resolution Resolution is specified as 1080P, this parameter can be specified. When ModelName is Vidu and ModelVersion is q2-pro or q2-turbo, this parameter can be specified.
2. Image size must be less than 5M.
3. Image format values are: jpeg, jpg, png, webp.
Example value: https://test.com/1.png

**»» storage_mode**: Storage mode. Possible values:
Permanent: Permanent storage. The generated image files will be stored in Cloud VOD and you can obtain the FileId in the event notification;
Temporary: Temporary storage. The generated image files will not be stored in Cloud VOD, and you can obtain a temporary access URL in the event notification;

Default value: Temporary

**»» resolution**: Resolution of the generated video.
When ModelName is Kling, optional values are 720P, 1080P, default is 720P;
When ModelName is Hailuo, optional values are 768P, 1080P, default is 768P;
When ModelName is Vidu, optional values are 720P, 1080P, default is 720P;

Example value: 720P

**»» aspect_ratio**: Specifies the aspect ratio of the generated video.

When ModelName is Kling and generating video from text, the optional values are 16:9, 9:16, 1:1, with a default of 16:9;

When ModelName is Vidu and generating video from text or using reference images, the optional values are 16:9, 9:16, 4:3, 3:4, 1:1, where only version q2 supports 4:3 and 3:4.

When ModelName is Hailuo, this is not currently supported.

Example value: 16:9

**»» audio_generation**: Whether to generate audio. Supported models include GV and OS. Valid values are:
Enabled: Enabled;
Disabled: Disabled;

Default value: Disabled
Example value: Enabled

**»» duration**: The duration of the generated video, in seconds.
- When ModelName is Kling, optional values are 5 and 10, default is 5;
- When ModelName is Kling and ModelVersion is 3.0 or 3.0-Omni, optional values are 3-15, default is 5;
- When ModelName is Kling and ModelVersion is 3.0-Omni with the uploaded file category as Video, optional values are 3-10, default is 5;
- When ModelName is Hailuo, optional values are 6 and 10, default is 6;
- When ModelName is Vidu, values from 1 to 10 can be specified;

Example value: 8.0

**»» person_generation**: Whether to allow generation of people or faces. Possible values are:
AllowAdult: Allow generation of adults;
Disallowed: Prohibit people or faces from being included in images;

Example value: AllowAdult

**»» input_compliance_check**: Whether to enable compliance checking of input content. Possible values are:
Enabled: Enable;
Disabled: Disable;

Example value: Enabled

**»» output_compliance_check**: Whether to enable compliance checking of output content. Possible values are:
Enabled: Enable;
Disabled: Disable;

Example value: Enabled

**» scene_type**: Scene type. Values are as follows:
When ModelName is Kling:
motion_control indicates motion control;
avatar_i2v indicates digital human;
lip_sync indicates lip-sync;
Other ModelName values are not currently supported.

Example value: motion_control

**» session_id**: Identification code used for deduplication. If a request with the same identification code has been made within three days, this request will return an error. Maximum 50 characters. Omitting this parameter or passing an empty string means deduplication is not performed.

Example value: mysession

**» session_context**: Source context, used to pass through user request information. The callback upon completion of audio and video quality regeneration will return this field value. Maximum length: 1000 characters.

Example value: mySessionContext

**» tasks_priority**: The priority level of the task. A higher numerical value indicates higher priority. The value range is -10 to 10. If not specified, the default value is 0.

Example value: 10

**» ext_info**: Reserved field, used for special purposes.
Example value: myextinfo

**»»» multi_shot**: Should a multi-shot video be generated?
● When the current parameter is true, the prompt parameter is invalid.
● When the current parameter is false, the shot_type and multi_prompt parameters are invalid.

Available models:
Kling 3.0 and 3.0-Omni

Note: Kling 3.0-Omni video reference does not support multi-shot mode.

**»»» shot_type**: Storyboarding Method
● Enum Value: customize
Required when the `multi_shot` parameter is set to true.

Available Models:
Kling 3.0 and Kling 3.0-Omni

**»»» multi_prompt**: Scene information, such as prompts and durations.
● Define the scene index, corresponding prompt, and duration using the `index`, `prompt`, and `duration` parameters, where:
○ Supports a maximum of 6 scenes and a minimum of 1 scene.
○ The maximum length for content related to each scene does not exceed 512 characters.
○ The duration of each scene must be less than or equal to the total duration of the current task and at least 1 second.
○ The sum of durations for all scenes equals the total duration of the current task.
Data is carried using key:value pairs.

Available models:
Kling 3.0 and 3.0-Omni

**»»»» index**: Storyboard Index:
○ Supports a maximum of 6 storyboards and a minimum of 1 storyboard.
○ The maximum length for content related to each storyboard does not exceed 512.

**»»»» duration**: Storyboard Duration:
○ The duration of each storyboard must not exceed the total duration of the current task and must be at least 1.
○ The sum of the durations of all storyboards must equal the total duration of the current task.

> Response Examples

> 200 Response

```json
{
    "Response": {
        "TaskId": "251007502-AigcImage***2782aff1e896673f1ft",
        "RequestId": "f50d7667-72d8-46bb-a7e3-0613588971b6"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Special Effects Template Creation Task

POST /tencent-vod/v1/template-effect

Official documentation: https://cloud.tencent.com/document/product/266/126240

> Body Parameters

```json
{
    "scene_type": "template_effect",
    "prompt": "Video content:
The scene begins with the main subject suddenly exploding, scattering fine particles.
# Requirements
1. Determine the number of subjects based on the user-uploaded image; each subject must explode.
2. Set Motion Level to: Middle
3. Prioritize 'My Video Content' as the primary factor; ensure background descriptions are unified and logical, avoiding repetition.",
    "file_infos": [
        {
            "type": "Url",
            "category": "Image",
            "url": "https://image01.vidu.zone/vidu/example/20241206-175531.jpeg"
        }
    ],
    "ext_info": {
        "AdditionalParameters": {
            "template": "morphlab"
        }
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» scene_type|body|string| yes ||Get value template_effect|
|» prompt|body|string| no ||Prompt|
|» file_infos|body|object| no ||A list containing up to three asset resource images, used to describe the resource images that the model will use when generating the video.  |
|»» type|body|string| no ||Input video file type. Possible values are:|
|»» category|body|string| no ||File classification. Values are:|
|»» file_id|body|string| no ||The media file ID of the image file, which is the globally unique identifier for the file on Cloud VOD, assigned by the Cloud VOD backend after successful upload. This field can be obtained from the **Video Upload Completion Event Notification** or the **Cloud VOD Console**. This parameter is valid when the `Type` value is set to `File`.|
|»» url|body|string| no ||URL of the accessible file. This parameter is valid when the Type value is Url.|
|» ext_info|body|object| yes ||none|
|»» AdditionalParameters|body|object| yes ||none|
|»»» template|body|string| yes ||Scenario Template Parameters|

#### Description

**» file_infos**: A list containing up to three asset resource images, used to describe the resource images that the model will use when generating the video.  
Note:  

1. Image size must not exceed 10MB.  
2. Supported image formats: jpeg, png.

**»» type**: Input video file type. Possible values are:
File: On-demand media file;
Url: Accessible URL;

Example value: File

**»» category**: File classification. Values are:
Image: Image;
Video: Video.
Example value: Image

**»» file_id**: The media file ID of the image file, which is the globally unique identifier for the file on Cloud VOD, assigned by the Cloud VOD backend after successful upload. This field can be obtained from the **Video Upload Completion Event Notification** or the **Cloud VOD Console**. This parameter is valid when the `Type` value is set to `File`.

**Description:**

1. It is recommended to use images smaller than 7MB.
2. Supported image formats are: `jpeg`, `jpg`, `png`, and `webp`.
Example value: `3704211***509819`

**»» url**: URL of the accessible file. This parameter is valid when the Type value is Url.
Description:

1.
It is recommended to use images smaller than 7M;

2.
The supported image formats are: jpeg, jpg, png, webp.
Example value: https://test.com/1.png

**»»» template**: Scenario Template Parameters
Different scenario templates correspond to different calling parameters. We provide two ways to view them:
● Official Example Center: https://platform.vidu.cn/docs/templates
● Online Documentation (supports querying by release date): https://shengshu.feishu.cn/wiki/L2Dbwi7QeilCAgkdJKjcrj2Lnrg?from=from_copylink

Note: Special effect templates currently only support video generation templates.

> Response Examples

> 200 Response

```json
{
    "Response": {
        "TaskId": "251007502-AigcImage***2782aff1e896673f1ft",
        "RequestId": "f50d7667-72d8-46bb-a7e3-0613588971b6"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Video Generation/Omni 

## POST omni video generation

POST /v1/video/create

> Body Parameters

```json
{
    "model": "omni-flash",
    "prompt": "hello world"
}
```

```json
{
    "model": "omni-flash",
    "prompt": "Aerial shot of a sunset by the sea",
    "aspect_ratio": "16:9",
    "seconds": "8"
}
```

```json
Street character in slow motion
```

```json
{
    "model": "omni-flash",
    "prompt": "Smooth transition between the first and last frames",
    "images": [
        "https://ts1.tc.mm.bing.net/th/id/R-C.8dbf8e136e7d71653b63fdbd4d17fb6c?rik=KEcgD1%2fwKEKc9A&riu=http%3a%2f%2fimg.xintp.com%2f2019%2f12%2f10%2fxl5gp5kgesw.jpg&ehk=j5IVfJ0NDf2S9Ki9dJ7uXRMGlqubf9rR8TGsNLZP%2fMQ%3d&risl=&pid=ImgRaw&r=0",
        "https://ts1.tc.mm.bing.net/th/id/R-C.ef98ae99612a621c19aaf5c02df8590a?rik=bpRpplfXRRo8pA&riu=http%3a%2f%2fimg95.699pic.com%2fphoto%2f50166%2f6903.jpg_wh300.jpg&ehk=yf0pMNdv%2bxIdqiWephK%2fg%2bt9K%2fTLDd8Db46yw8Q%2bSXM%3d&risl=&pid=ImgRaw&r=0"
    ],
    "seconds": "8"
}
```

```json
Generate a video while preserving the subject's style
```

```json
{
    "model": "omni-flash-edit",
    "prompt": "Give the original video a cinematic look",
    "video": "https://example.com/input.mp4",
    "type": 4
}
```

```json
{
    "model": "omni-flash",
    "prompt": "Combine the subjects and color palettes of the three reference images",
    "images": [
        "https://ts2.tc.mm.bing.net/th/id/OIP-C.iBy7zllJXvjrzOH-VdwH_gHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
        "https://imgs.699pic.com/images/600/406/117.jpg!list1x.v2",
        "https://ts2.tc.mm.bing.net/th/id/OIP-C.thJJkD55hZLuc-D86OW7bgHaEW?rs=1&pid=ImgDetMain&o=7&rm=3"
    ],
    "aspect_ratio": "9:16",
    "seconds": "8"
}
```

```json
Enhance color and lighting
```

```json
{
    "model": "omni-flash",
    "prompt": "City skyline time-lapse",
    "type": 1,
    "seconds": "8"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||Request Body Data Format|
|Accept|header|string| no ||The response data format expected by the client|
|Authorization|header|string| no ||API authentication key, in the format Bearer + space + your API Key|
|body|body|object| yes | Video Create Request Schema|none|
|» model|body|string| yes ||Model name (e.g., omni-flash, omni-flash-edit)|
|» prompt|body|string| yes ||Video content description|
|» type|body|integer| no ||Generation type: 1 = text-to-video, 2 = first-and-last-frame generation, 3 = reference image, 4 = Omni-Flash video editing|
|» aspect_ratio|body|string| no ||Aspect Ratio|
|» images|body|[string]| no ||Array of image URLs (type=2 requires 1-2 images; type=3 requires 1-3 images)|
|» enable_upsample|body|boolean| no ||Upgrade to 1080p (available for some 4K models)|
|» enable_sample|body|boolean| no ||Switch the Omni-Flash series to 1080p (ignore 4K models)|
|» input_reference|body|string| no ||Omni-Flash edit reference video (pass a URL or data URI in JSON scenarios)|
|» seconds|body|string| no ||Video duration (seconds), example: "8"|
|» size|body|string| no ||Custom dimensions: use 16:9 when the width is greater than the height, and 9:16 when the height is greater than the width. This parameter is ignored when aspect_ratio is in effect.|
|» *anonymous*|body|any| no ||none|
|» *anonymous*|body|any| no ||none|
|» *anonymous*|body|any| no ||none|
|» *anonymous*|body|any| no ||none|

#### Enum

|Name|Value|
|---|---|
|» type|1|
|» type|2|
|» type|3|
|» type|4|
|» aspect_ratio|16:9|
|» aspect_ratio|9:16|

> Response Examples

> 200 Response

```json
{
    "id": "omni-flash_X:task_uAbDkbRmcOafvSBBmNWwQkIA1gvTdoaX",
    "status": "queued",
    "status_update_time": 1779950697931
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|
|» status_update_time|integer|true|none||none|

## GET Query results

GET /v1/video/query

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|query|string| no ||none|
|model|query|string| no ||Model Name|

> Response Examples

> 200 Response

```json
{"id":"omni-flash:1779717386-QYRfzV5zLK","status":"failed","status_update_time":1779717416,"error":"Video generation failed"}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST google-omni-flash (synchronous text-to-video)

POST /v1beta/interactions

> Body Parameters

```json
{
    "model": "gemini-omni-flash-preview",
    "input": "Generate a 9:16 video of a city in the early morning, using a fixed camera position and without any text.",
    "response_format": {
        "type": "video",
        "aspect_ratio": "9:16",
        "delivery": "uri"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|
|Content-Type|header|string| yes ||none|
|Api-Revision|header|string| yes ||none|
|body|body|object| yes ||none|
|» model|body|string| yes ||none|
|» background|body|boolean| no ||Omitted or false for synchronous mode; a client timeout of 600s is recommended|
|» input|body|string| yes ||Text-to-video prompt|
|» response_format|body|object| no ||none|
|»» type|body|string| yes ||none|
|»» aspect_ratio|body|string| no ||none|
|»» delivery|body|string| no ||none|
|» generation_config|body|object| no ||none|
|»» video_config|body|object| no ||none|
|»»» task|body|string| no ||none|
|» store|body|boolean| no ||none|
|» stream|body|boolean| no ||none|

#### Enum

|Name|Value|
|---|---|
|» background|false|
|»» aspect_ratio|16:9|
|»» aspect_ratio|9:16|
|»» delivery|uri|
|»» delivery|inline|
|»»» task|text_to_video|

> Response Examples

> 200 Response

```json
{
  "id": "v1_example_interaction_id",
  "status": "completed",
  "object": "interaction",
  "model": "gemini-omni-flash-preview",
  "steps": [
    {
      "type": "model_output",
      "content": [
        {
          "type": "video",
          "mime_type": "video/mp4",
          "uri": "https://generativelanguage.googleapis.com/v1beta/files/example-file-id:download?alt=media"
        }
      ]
    }
  ],
  "usage": {
    "total_input_tokens": 30,
    "total_output_tokens": 58717,
    "total_thought_tokens": 659,
    "total_tokens": 59406,
    "output_tokens_by_modality": [ { "modality": "video", "tokens": 57920 } ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|
|» object|string|true|none||none|
|» model|string|true|none||none|
|» steps|[object]|true|none||none|
|»» type|string|false|none||none|
|»» content|[object]|false|none||none|
|»»» type|string|false|none||none|
|»»» mime_type|string|false|none||none|
|»»» uri|string|false|none||none|
|» usage|object|true|none||none|
|»» total_input_tokens|integer|true|none||none|
|»» total_output_tokens|integer|true|none||none|
|»» total_thought_tokens|integer|true|none||none|
|»» total_tokens|integer|true|none||none|
|»» output_tokens_by_modality|[object]|true|none||none|
|»»» modality|string|false|none||none|
|»»» tokens|integer|false|none||none|

## GET google-omni-flash (query interaction)

GET /v1beta/interactions/{interaction_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|interaction_id|path|string| yes ||none|
|Authorization|header|string| yes ||none|
|Api-Revision|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{ "id": "v1_example_interaction_id", "status": "in_progress", "object": "interaction", "model": "gemini-omni-flash-preview" }
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» status|string|true|none||none|
|» object|string|true|none||none|
|» model|string|true|none||none|

## GET google-omni-flash (Download Videos (Google Files))

GET /v1beta/files/{example-file-id}:download

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|example-file-id|path|string| yes ||none|
|alt|query|string| yes ||none|
|Authorization|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET google-omni-flash (Download Video (GCS))

GET /v1beta/files/gcs

> Body Parameters

```yaml
{}

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|uri|query|string| yes ||none|
|Authorization|header|string| yes ||none|
|body|body|object| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET google-omni-flash (query file status)

GET /v1beta/files/{example-file-id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|example-file-id|path|string| yes ||none|
|Authorization|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Voice Generation/Tongyi Wanxiang Speech Synthesis

## POST Speech Synthesis Copy

POST /alibailian/api/v1/services/aigc/multimodal-generation/generation

> Body Parameters

```json
{
  "model": "string",
  "input": {
    "text": "string",
    "voice": "string",
    "language_type": "string"
  }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model|body|string| yes ||none|
|» input|body|object| yes ||none|
|»» text|body|string| yes ||none|
|»» voice|body|string| yes ||none|
|»» language_type|body|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Intelligent Interaction/GPTs 

## POST GPTs Conversation

POST /v1/chat/completions

The model name format is: gpt-4-gizmo-*, and the system will automatically recognize it.

For example, this GPT: https://chatgpt.com/g/g-B3hgivKK9-write-for-me

Then its model name should be filled in as: gpt-4-gizmo-g-B3hgivKK9

GPTs list: https://chatgpt.com/gpts

> Body Parameters

```json
{
    "model": "gpt-4-gizmo-g-2fkFE8rbu",
    "messages": [
        {
            "role": "user",
            "content": "Who are you"
        }
    ],
    "stream": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||The ID of the model to be used. For detailed information on which models can be used with the Chat API, please refer to the model endpoint compatibility table.|
|» messages|body|[object]| yes ||List of messages contained in the conversation so far. Python code example.|
|»» role|body|string| no ||none|
|»» content|body|string| no ||none|
|» temperature|body|integer| no ||What sampling temperature to use, between 0 and 2. Higher values (such as 0.8) will make the output more random, while lower values (such as 0.2) will make the output more focused and deterministic. We generally recommend changing this or `top_p` but not both.|
|» top_p|body|integer| no ||An alternative method to temperature sampling, called nucleus sampling, in which the model considers the results of tokens with top_p probability mass. So 0.1 means only tokens that constitute the top 10% of probability mass are considered. We generally recommend changing this or `temperature` but not both.|
|» n|body|integer| no ||Defaults to 1|
|» stream|body|boolean| no ||Defaults to false. If set, partial message deltas will be sent in the same manner as in ChatGPT. Tokens will be sent as server-sent events in data-only format, these events are available when sent, and the stream terminates with a data: [DONE] message. Python code example.|
|» stop|body|string| no ||Defaults to null. A maximum of 4 sequences; the API will stop generating further tokens.|
|» max_tokens|body|integer| no ||Defaults to inf|
|» presence_penalty|body|number| no ||A number between -2.0 and 2.0. Positive values penalize new tokens based on whether they have appeared in the text so far, thereby increasing the likelihood of the model discussing new topics. [View more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)|
|» frequency_penalty|body|number| no ||Defaults to 0. A number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text, reducing the likelihood of the model repeating the same lines. For more information on frequency and presence penalties.|
|» logit_bias|body|null| no ||Modify the likelihood of specified tokens appearing in completions.|
|» user|body|string| no ||A unique identifier representing your end user, which can help OpenAI monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).|
|» response_format|body|object| no ||An object that specifies the format the model must output. Setting { "type": "json_object" } enables JSON mode, which ensures that messages generated by the model are valid JSON. Important: When using JSON mode, you must also instruct the model to generate JSON through a system or user message. Failure to do so may cause the model to generate endless blank streams until generation reaches the token limit, resulting in increased latency and the appearance of the request being "stuck". Also note that if finish_reason="length", the message content may be partially truncated, which indicates that generation exceeded max_tokens or the conversation exceeded the maximum context length. Show properties|
|» seen|body|integer| no ||This feature is in beta. If specified, our system will make a best effort to sample deterministically, so that repeated requests with the same seed and parameters should return the same result. Determinism is not guaranteed, and you should refer to the system_fingerprint response parameter to monitor changes in the backend.|
|» tools|body|[string]| yes ||A list of tools that the model can call. Currently, only functions are supported as tools. Use this feature to provide a list of functions for which the model can generate JSON inputs.|
|» tool_choice|body|object| yes ||Controls which function the model calls (if any). none means the model will not call a function and will instead generate a message. auto means the model can choose between generating a message and calling a function. Force the model to call a specific function by using {"type": "function", "function": {"name": "my_function"}}. If no functions exist, the default is none. If functions exist, the default is auto. Show possible types|

#### Description

**» n**: Defaults to 1
How many chat completion choices to generate for each input message.

**» max_tokens**: Defaults to inf
The maximum number of tokens generated in chat completion.

The total length of input tokens and generated tokens is limited by the model's context length. Python code example for calculating tokens.

**» logit_bias**: Modify the likelihood of specified tokens appearing in completions.

Accepts a JSON object that maps tokens (token IDs as specified by the tokenizer) to associated bias values (ranging from -100 to 100). Mathematically, the bias is added to the logits generated by the model before sampling. The exact effect varies by model, but values between -1 and 1 should decrease or increase the likelihood of selecting the relevant token; values such as -100 or 100 should result in disabling or exclusively selecting the relevant token.

> Response Examples

> 200 Response

```json
{
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1677652288,
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "\n\nHello there, how may I assist you today?"
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 12,
        "total_tokens": 21
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» object|string|true|none||none|
|» created|integer|true|none||none|
|» choices|[object]|true|none||none|
|»» index|integer|false|none||none|
|»» message|object|false|none||none|
|»»» role|string|true|none||none|
|»»» content|string|true|none||none|
|»» finish_reason|string|false|none||none|
|» usage|object|true|none||none|
|»» prompt_tokens|integer|true|none||none|
|»» completion_tokens|integer|true|none||none|
|»» total_tokens|integer|true|none||none|

# Key4U English/Text Embedding/Rerank 

## POST Reordering

POST /v1/rerank

Given a prompt, the model will return one or more predicted completions, and can also return the probability of alternative tokens at each position.

Create a completion for the provided prompt and parameters

Official documentation: https://docs.siliconflow.cn/cn/api-reference/rerank/create-rerank

> Body Parameters

```json
{
    "model": "qwen3-rerank",
    "documents": [
        "Text ranking models are widely used in search engines and recommendation systems, where they rank candidate texts based on textual relevance",
        "Quantum computing is a cutting-edge field in computational science",
        "The development of pre-trained language models has brought new advances to text ranking models"
    ],
    "query": "What is a text ranking model",
    "top_n": 2,
    "instruct": "Given a web search query, retrieve relevant passages that answer the query."
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|Accept|header|string| yes ||none|
|Authorization|header|string| no ||none|
|X-Forwarded-Host|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||none|
|» documents|body|[string]| yes ||none|
|» query|body|string| yes ||none|
|» top_n|body|integer| yes ||none|
|» instruct|body|string| yes ||none|

> Response Examples

```json
{
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1677652288,
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "\n\nHello there, how may I assist you today?"
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 12,
        "total_tokens": 21
    }
}
```

```json
{
    "results": [
        {
            "document": {
                "text": "Text ranking models are widely used in search engines and recommendation systems, where they rank candidate texts based on textual relevance"
            },
            "index": 0,
            "relevance_score": 0.915543128021105
        },
        {
            "document": {
                "text": "The development of pre-trained language models has brought new advances to text ranking models"
            },
            "index": 2,
            "relevance_score": 0.7576691095659295
        }
    ],
    "usage": {
        "prompt_tokens": 107,
        "completion_tokens": 0,
        "total_tokens": 107,
        "prompt_tokens_details": {
            "cached_tokens": 0,
            "text_tokens": 0,
            "audio_tokens": 0,
            "image_tokens": 0
        },
        "completion_tokens_details": {
            "text_tokens": 0,
            "audio_tokens": 0,
            "reasoning_tokens": 0
        },
        "input_tokens": 0,
        "output_tokens": 0,
        "input_tokens_details": null
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» object|string|true|none||none|
|» created|integer|true|none||none|
|» choices|[object]|true|none||none|
|»» index|integer|false|none||none|
|»» message|object|false|none||none|
|»»» role|string|true|none||none|
|»»» content|string|true|none||none|
|»» finish_reason|string|false|none||none|
|» usage|object|true|none||none|
|»» prompt_tokens|integer|true|none||none|
|»» completion_tokens|integer|true|none||none|
|»» total_tokens|integer|true|none||none|

# Key4U English/Brand Platform/Kling/Kling 3.0 Turbo

## POST Text-to-video

POST /kling/text-to-video/kling-3.0-turbo

> Body Parameters

```json
{
  "contents": [
    {
      "type": "prompt",
      "text": "A cat running"
    }
  ],
  "settings": {
    "resolution": "720p",
    "duration": 5
  }
}
```

```json
{
    "prompt": "Young woman walking through neon-lit Tokyo street at night, slow motion",
    "settings": {
        "resolution": "720p",
        "aspect_ratio": "9:16",
        "duration": 5
    }
}
```

```json
{
    "prompt": "Coffee being poured into a glass cup, macro shot, warm tones",
    "settings": {
        "resolution": "720p",
        "aspect_ratio": "1:1",
        "duration": 5
    }
}
```

```json
{
    "prompt": "Epic aerial view of Zhangjiajie mountains emerging from clouds, golden hour, cinematic drone footage",
    "settings": {
        "resolution": "1080p",
        "aspect_ratio": "16:9",
        "duration": 10
    }
}
```

```json
{
    "prompt": "Fashion model walking on runway, dynamic lighting, high fashion editorial style",
    "settings": {
        "resolution": "1080p",
        "aspect_ratio": "9:16",
        "duration": 15
    }
}
```

```json
{
    "contents": [
        {
            "type": "prompt",
            "text": "Autumn leaves falling in a Japanese garden, koi pond reflections, peaceful atmosphere"
        }
    ],
    "settings": {
        "resolution": "720p",
        "aspect_ratio": "16:9",
        "duration": 8
    },
    "options": {
        "external_task_id": "biz-order-20240623-001",
        "callback_url": "https://your-server.com/webhook/kling"
    }
}
```

```json
{
    "prompt": "Shot 1,2,a young woman stands at window looking outside, morning light filters in;Shot 2,3,she turns around with a smile, coffee cup in hand;Shot 3,5,she walks to the balcony, city skyline in background, golden hour;",
    "settings": {
        "resolution": "1080p",
        "aspect_ratio": "16:9",
        "duration": 10
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Accept|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» prompt|body|string| no ||[Recommended] Top-level prompt. Maximum 3,072 characters. Full-width punctuation (, ; :) is automatically converted to half-width punctuation by the gateway. Mutually exclusive with contents[]; if both are provided, contents[] is ignored.|
|» contents|body|[object]| no ||[Alternative] Prompt array syntax; use either this or the top-level prompt. The type of each item must be "prompt" (text-to-video does not support first_frame). The gateway extracts contents[].text, converts it to a top-level prompt, and then forwards it upstream.|
|»» type|body|string| yes ||For text-to-video generation, the parameter is fixed as "prompt"; passing "first_frame" results in a 400 error.|
|»» text|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|
|» settings|body|object| no ||Generation parameters, all optional. If omitted, the gateway automatically supplies the default values: resolution=720p, aspect_ratio=16:9, duration=5.|
|»» resolution|body|string| no ||Output resolution. The default is 720p. 1080p costs approximately 1.25x as much.|
|»» aspect_ratio|body|string| no ||Aspect ratio, 16:9 by default.|
|»» duration|body|integer| no ||Video duration (seconds), ranging from 3 to 15, with a default of 5. The billed amount increases linearly with duration.|
|» options|body|object| no ||Task control parameters; all are optional.|
|»» callback_url|body|string(uri)| no ||The URL for the upstream callback after the task is completed (must be publicly accessible).|
|»» external_task_id|body|string| no ||A custom task ID defined by the business side, used to facilitate idempotent queries and reconciliation.|
|»» watermark_info|body|object| no ||Watermark configuration. Its structure is defined upstream and passed through unchanged.|

#### Description

**»» text**: [PASTE YOUR CHINESE TEXT HERE]
"Prompt text, up to 3072 characters."

#### Enum

|Name|Value|
|---|---|
|»» resolution|720p|
|»» resolution|1080p|
|»» aspect_ratio|16:9|
|»» aspect_ratio|9:16|
|»» aspect_ratio|1:1|

> Response Examples

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "id": "string",
    "task_id": "string",
    "status": "string",
    "task_status": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||0 = success; non-zero = failure. See the message field for details.|
|» message|string|true|none||none|
|» request_id|string|false|none||Upstream request ID; provide it to upstream support when troubleshooting issues|
|» data|object|true|none||Task information. Both id and task_id may contain the task ID; prefer id.|
|»» id|string|false|none||[PASTE YOUR CHINESE TEXT HERE]<br />"Task ID (Priority)"|
|»» task_id|string|false|none||Task ID (fallback; some upstream services return this field)|
|»» status|string|false|none||Initial task status, such as submitted / queued|
|»» task_status|string|false|none||Same as `status`; the field name varies depending on the upstream source.|

## POST Image-to-Video

POST /kling/image-to-video/kling-3.0-turbo

> Body Parameters

```json
{
  "contents": [
    {
      "type": "first_frame",
      "url": "{{first_frame_url}}"
    }
  ],
  "settings": {
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "duration": 5
  }
}
```

```json
{
    "contents": [
        {
            "type": "first_frame",
            "url": "{{first_frame_url}}"
        },
        {
            "type": "prompt",
            "text": "The character slowly turns around and waves, soft natural lighting, smooth camera movement"
        }
    ],
    "settings": {
        "resolution": "720p",
        "aspect_ratio": "16:9",
        "duration": 5
    }
}
```

```json
{
  "contents": [
    {
      "type": "first_frame",
      "url": "{{first_frame_url}}"
    }
  ],
  "settings": {
    "resolution": "720p",
    "aspect_ratio": "9:16",
    "duration": 5
  }
}
```

```json
{
  "contents": [
    {
      "type": "first_frame",
      "url": "{{first_frame_url}}"
    },
    {
      "type": "prompt",
      "text": "Camera slowly zooms in, subject smiles gently, wind blows hair slightly"
    }
  ],
  "settings": {
    "resolution": "1080p",
    "aspect_ratio": "16:9",
    "duration": 5
  }
}
```

```json
{
  "contents": [
    {
      "type": "first_frame",
      "url": "{{first_frame_url}}"
    },
    {
      "type": "prompt",
      "text": "Subject walks forward confidently, dynamic background blur, cinematic style"
    }
  ],
  "settings": {
    "resolution": "1080p",
    "aspect_ratio": "9:16",
    "duration": 10
  },
  "options": {
    "external_task_id": "biz-img2v-20240623-001",
    "callback_url": "https://your-server.com/webhook/kling"
  }
}
```

```json
{
    "contents": [
        {
            "type": "first_frame",
            "url": "{{first_frame_url}}"
        },
        {
            "type": "prompt",
            "text": "Flower petals gently swaying, bokeh background shimmers, dreamy atmosphere"
        }
    ],
    "settings": {
        "resolution": "720p",
        "aspect_ratio": "1:1",
        "duration": 5
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» contents|body|[oneOf]| yes ||Content array, required. Rules: (1) At least one item with type=first_frame (url is required); (2) items with type=prompt may be appended (text may contain up to 2,500 characters); (3) type only supports prompt / first_frame; any other value results in a 400 error.|
|»» *anonymous*|body|object| no ||First-frame image (at least one is required)|
|»»» type|body|string| yes ||none|
|»»» url|body|string(uri)| yes ||A publicly accessible URL for the first-frame image. Upstream constraints: the format must be jpg/jpeg/png (webp is not supported); the file size must be <= 50 MB; both width and height must be >= 300 px; the image aspect ratio must be between 1:2.5 and 2.5:1, otherwise the upstream service returns an error.|
|»» *anonymous*|body|object| no ||Text prompt (optional, maximum of one)|
|»»» type|body|string| yes ||none|
|»»» text|body|string| yes ||Prompt text, up to 2,500 characters (image-to-video limit, lower than the 3,072-character text-to-video limit).|
|» settings|body|object| no ||Generation parameters; all are optional. ⚠️ For image-to-video generation, the body is passed through to the upstream service unchanged. If settings is missing, no default values are added; explicitly specifying it is recommended.|
|»» resolution|body|string| no ||Output resolution. 1080p costs approximately 1.5x.|
|»» aspect_ratio|body|string| no ||Aspect ratio. ⚠️ Official note: For image-to-video generation, the aspect ratio is determined by the first-frame image, so this field has no actual effect on the upstream service. However, the gateway still uses it to calculate billing. It is recommended to keep it consistent with the actual aspect ratio of the first-frame image (or omit it).|
|»» duration|body|integer| no ||Video duration (seconds), ranging from 3 to 15. The billing amount increases linearly with the duration.|
|» options|body|object| no ||Task control parameters; all are optional.|
|»» callback_url|body|string(uri)| no ||The URL for the upstream callback after the task is completed.|
|»» external_task_id|body|string| no ||A custom task ID defined by the business side to facilitate idempotent queries.|
|»» watermark_info|body|object| no ||Watermark configuration, passed through unchanged.|

#### Enum

|Name|Value|
|---|---|
|»» resolution|720p|
|»» resolution|1080p|
|»» aspect_ratio|16:9|
|»» aspect_ratio|9:16|
|»» aspect_ratio|1:1|

> Response Examples

> 200 Response

```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "id": "string",
    "task_id": "string",
    "status": "string",
    "task_status": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» code|integer|true|none||0 = success; non-zero = failure. See the message field for details.|
|» message|string|true|none||none|
|» request_id|string|false|none||Upstream request ID; provide it to upstream support when troubleshooting issues|
|» data|object|true|none||Task information. Both id and task_id may contain the task ID; prefer id.|
|»» id|string|false|none||[PASTE YOUR CHINESE TEXT HERE]<br />"Task ID (Priority)"|
|»» task_id|string|false|none||Task ID (fallback; some upstream services return this field)|
|»» status|string|false|none||Initial task status, such as submitted / queued|
|»» task_status|string|false|none||Same as `status`; the field name varies depending on the upstream source.|

## GET Search Videos

GET /kling/text-to-video/kling-3.0-turbo/{task_id}

| Path | `GET /kling/text-to-video/kling-3.0-turbo/{task_id}` |
| Prerequisite | Obtain `{{task_id}}` from `data.id` in the submission response |
| Note | For image-to-video generation, change the path to `/kling/image-to-video/kling-3.0-turbo/{{task_id}}` |

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Accept|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
"string"
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|string|

# Key4U English/Brand Platform/Kling/Text-to-video

## POST Text-to-video

POST /kling/v1/videos/text2video

> Body Parameters

```json
{
    "model_name": "kling-v1",
    "prompt": "A drone shot of a beautiful coastline at golden hour sunset",
    "mode": "std",
    "duration": "5",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v2-master",
    "prompt": "Cinematic dolly-in over a misty mountain lake at dawn, soft rim light",
    "mode": "pro",
    "duration": "10",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v2-6",
    "prompt": "A street musician plays violin on a rainy city corner, crowd ambience",
    "mode": "pro",
    "duration": "5",
    "sound": "on",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v3",
    "prompt": "Slow push-in shot of a detective reading case files under a desk lamp",
    "mode": "pro",
    "duration": 8,
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v1-6",
    "prompt": "A white horse galloping along the beach at sunrise, cinematic motion blur",
    "negative_prompt": "blurry, low quality, watermark, text overlay",
    "cfg_scale": 0.7,
    "mode": "std",
    "duration": "5",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v3",
    "prompt": "Cyberpunk portrait in neon rain, camera slowly orbits the subject",
    "mode": "4k",
    "duration": 6,
    "aspect_ratio": "9:16",
    "callback_url": "{{callback_url}}",
    "external_task_id": "{{external_task_id}}"
}
```

```json
{
    "model_name": "kling-v3",
    "mode": "pro",
    "duration": "6",
    "aspect_ratio": "16:9",
    "multi_shot": true,
    "shot_type": "customize",
    "multi_prompt": [
        {
            "index": 1,
            "prompt": "Wide establishing shot of a futuristic city skyline at dusk",
            "duration": 2
        },
        {
            "index": 2,
            "prompt": "Medium shot, a courier runs through crowded streets with neon signs",
            "duration": 2
        },
        {
            "index": 3,
            "prompt": "Close-up on the courier's determined face, rain droplets on skin",
            "duration": 2
        }
    ]
}
```

```json
{
    "model_name": "kling-v3",
    "prompt": "A time-lapse journey through four seasons in the same forest clearing",
    "mode": "pro",
    "duration": "10",
    "aspect_ratio": "16:9",
    "multi_shot": true,
    "shot_type": "intelligence"
}
```

```json
{
    "model_name": "kling-v2-5-turbo",
    "prompt": "Drone-like forward movement over a deep mountain valley with morning fog",
    "mode": "pro",
    "duration": "5",
    "aspect_ratio": "16:9",
    "camera_control": {
        "type": "simple",
        "config": {
            "horizontal": 0,
            "vertical": 0,
            "pan": 0,
            "tilt": -2.5,
            "roll": 0,
            "zoom": 1.5
        }
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| no | KlingText2VideoRequest|none|
|» model_name|body|string| yes ||Model name. If omitted, the gateway uses kling-v1 for billing by default; specifying it explicitly is recommended. When multi_shot=true, it must be kling-v3; when mode=4k, it must be kling-v3.|
|» prompt|body|string| no ||Positive prompt. Required when multi_shot=false (default); ignored when multi_shot=true, and providing it will result in a 400 error. Upstream limit: <=2500 characters.|
|» multi_shot|body|boolean| no ||Whether multiple shots are enabled. When true, only kling-v3 is supported, and prompt has no effect; when false, shot_type / multi_prompt must not be provided.|
|» shot_type|body|string| no ||Storyboard mode. Required when multi_shot=true; must not be provided when multi_shot=false. customize must be used with multi_prompt; intelligence automatically splits the storyboard into shots upstream.|
|» multi_prompt|body|[object]| no ||Custom storyboard list. Required when shot_type=customize, with a maximum of 6 shots. For each shot, prompt≤512 and duration≥1; the sum of the duration values for all shots must equal the top-level duration (tolerance ≤0.1).|
|»» index|body|integer| yes ||Storyboard shot number, starting from 1|
|»» prompt|body|string| yes ||Positive prompt for this storyboard, ≤512 characters|
|»» duration|body|any| yes ||Duration of this storyboard shot (seconds), >=1|
|»»» *anonymous*|body|string| no ||none|
|»»» *anonymous*|body|number| no ||none|
|»»» *anonymous*|body|integer| no ||none|
|» negative_prompt|body|string| no ||Negative prompt. Describes content that should not appear. Passed through by the gateway.|
|» cfg_scale|body|number| no ||Generation guidance (CFG). The higher the value, the more strongly the generated result correlates with the prompt; the gateway does not prevalidate the range, and upstream constraints are typically 0–1.|
|» mode|body|string| no ||Generation mode. If omitted, the billing side defaults to std. 4k is supported only by kling-v3; enabling sound for kling-v2-6 requires pro.|
|» sound|body|string| no ||Audio switch. The gateway performs model/mode validation only for non-empty values; setting it to on triggers audio billing. Only kling-v2-6 and kling-v3 are supported; v2-6 requires mode=pro.|
|» aspect_ratio|body|string| no ||Aspect ratio (width:height). Upstream constraint: Common values are 16:9 / 9:16 / 1:1; the gateway does not prevalidate the enum.|
|» duration|body|any| yes ||Video duration (seconds), required. For models other than kling-v3: only 5 or 10; for kling-v3: 3–15. Supports string or integer; the gateway normalizes the value to a string.|
|»» *anonymous*|body|string| no ||none|
|»» *anonymous*|body|integer| no ||none|
|» camera_control|body|object| no ||Camera movement control. If omitted, the model selects an appropriate setting automatically; the gateway passes the value through without validating the specific numeric range.|
|»» type|body|string| no ||Control type, such as simple|
|»» config|body|object| no ||Camera Movement Parameter Configuration|
|»»» horizontal|body|number| no ||Horizontal displacement|
|»»» vertical|body|number| no ||Vertical displacement|
|»»» pan|body|number| no ||Horizontal pan (left/right)|
|»»» tilt|body|number| no ||Vertical tilt (up/down)|
|»»» roll|body|number| no ||Rotation|
|»»» zoom|body|number| no ||Zoom|
|» callback_url|body|string(uri)| no ||Task completion callback URL. A POST notification is sent after the upstream task finishes. The URL must be publicly accessible, and the gateway passes the notification through unchanged.|
|» external_task_id|body|string| no ||The caller's external task ID, used for idempotent association and business reconciliation; this is not `data.task_id` in the response body.|
|» voice_list|body|[object]| no ||Custom voice list. Fields can be passed through; the current text2video billing path does not separately recognize voice_list (unlike image2video, this does not affect the hasVoiceId multiplier).|
|»» voice_id|body|string| yes ||Custom voice ID, obtained from the voice creation API|

#### Enum

|Name|Value|
|---|---|
|» model_name|kling-v1|
|» model_name|kling-v1-6|
|» model_name|kling-v2-master|
|» model_name|kling-v2-1-master|
|» model_name|kling-v2-5-turbo|
|» model_name|kling-v2-6|
|» model_name|kling-v3|
|» shot_type|customize|
|» shot_type|intelligence|
|» mode|std|
|» mode|pro|
|» mode|4k|
|» sound|on|
|» sound|off|
|» aspect_ratio|16:9|
|» aspect_ratio|9:16|
|» aspect_ratio|1:1|

> Response Examples

> 200 Response

```json
{
    "code": 0,
    "message": "SUCCEED",
    "request_id": "603e2a28-fb89-4146-ae33-412d74012a6d",
    "data": {
        "task_id": "831922345719271433",
        "task_status": "submitted",
        "task_info": {},
        "created_at": 1766374262370,
        "updated_at": 1766374262370
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/text2video/{id}

> Body Parameters

```json
// {
//     "task_id": "kling-v1825380683199176793",      // Task ID for text-to-video — a request path parameter; fill in the value directly in the request path. Use either this or external_task_id to query.
//     "external_task_id": "",    // Custom task ID for text-to-video — the external_task_id specified when creating the task. Use either this or task_id to query.
// }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Image-to-Video

## POST Image-to-Video

POST /kling/v1/videos/image2video

> Body Parameters

```json
{
    "model_name": "kling-v2-6",
    "image": "{{image_url}}",
    "prompt": "A panda drinks coffee in a cozy cafe",
    "mode": "pro",
    "duration": "5"
}
```

```json
{
    "model_name": "kling-v1",
    "image": "{{image_url}}",
    "prompt": "A cat slowly turns its head toward the camera",
    "mode": "std",
    "duration": "5"
}
```

```json
{
    "model_name": "kling-v2-master",
    "image": "{{image_url}}",
    "prompt": "Cinematic dolly-in, soft rim light",
    "mode": "pro",
    "duration": "10",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v2-6",
    "image": "{{image_url}}",
    "prompt": "A street musician plays violin, crowd ambience",
    "mode": "pro",
    "duration": "5",
    "sound": "on"
}
```

```json
{
    "model_name": "kling-v3",
    "image": "{{image_url}}",
    "prompt": "Slow push-in shot with dramatic lighting",
    "mode": "pro",
    "duration": 8
}
```

```json
{
    "model_name": "kling-v1-6",
    "image": "{{image_url}}",
    "prompt": "A white horse running on the beach at sunrise",
    "negative_prompt": "blurry, low quality, watermark",
    "cfg_scale": 0.7,
    "mode": "std",
    "duration": "5",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v2-6",
    "image": "{{image_url}}",
    "prompt": "A news anchor speaks to camera in a studio",
    "mode": "pro",
    "duration": "10",
    "sound": "on",
    "voice_list": [
        {
            "voice_id": "{{voice_id}}"
        }
    ]
}
```

```json
{
    "model_name": "kling-v3",
    "image": "{{image_url}}",
    "prompt": "Cyberpunk portrait, rain reflections, high contrast",
    "mode": "4k",
    "duration": 6,
    "aspect_ratio": "9:16",
    "callback_url": "{{callback_url}}",
    "external_task_id": "{{external_task_id}}"
}
```

```json
{
    "model_name": "kling-v3",
    "image": "{{image_url}}",
    "duration": 6,
    "mode": "pro",
    "multi_shot": true,
    "shot_type": "customize",
    "multi_prompt": [
        {
            "index": 1,
            "prompt": "Wide shot of the city skyline at dusk",
            "duration": 2
        },
        {
            "index": 2,
            "prompt": "Medium shot, character walks into frame",
            "duration": 2
        },
        {
            "index": 3,
            "prompt": "Close-up on face, subtle smile",
            "duration": 2
        }
    ]
}
```

```json
{
    "model_name": "kling-v2-5-turbo",
    "image": "{{image_url}}",
    "prompt": "Drone-like forward movement over mountain valley",
    "mode": "pro",
    "duration": "5",
    "camera_control": {
        "type": "simple",
        "config": {
            "horizontal": 0,
            "vertical": 0,
            "pan": 0,
            "tilt": -2.5,
            "roll": 0,
            "zoom": 1.5
        }
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes | KlingImage2VideoRequest|none|
|» model_name|body|string| yes ||Model name. If omitted, gateway billing defaults to kling-v1; explicitly specifying it is recommended. Compared with text2video, the available options additionally include kling-v1-5 and kling-v2-1. When multi_shot=true, it must be kling-v3; when mode=4k, it must be kling-v3.|
|» image|body|string| yes ||Input an image URL or Base64 data. Required. Used as the reference for the first frame of the video; this is a core field for image-to-video generation. Format, size, and resolution are validated upstream; the gateway only checks that the field is non-empty.|
|» image_tail|body|string| no ||End-frame image URL or Base64 data, optional. Use it together with `image` to create a transition between the first and last frames; if omitted, the output is generated from the first frame only. The gateway passes it through without validating the format.|
|» prompt|body|string| no ||Positive prompt. Required when `multi_shot=false` (default); ignored when `multi_shot=true`, and providing it will result in a 400 error. Describe the motion, camera work, and style of the scene. The upstream limit is <=2,500 characters.|
|» multi_shot|body|boolean| no ||Whether to use multiple shots. When set to true, only kling-v3 is supported, and prompt is ignored; when set to false, shot_type and multi_prompt must not be provided, or a 400 error will be returned.|
|» shot_type|body|string| no ||Storyboard mode. Required when multi_shot=true; must not be provided when multi_shot=false. customize must be used with multi_prompt; intelligence automatically splits the storyboard into shots upstream.|
|» multi_prompt|body|[object]| no ||Custom storyboard list. Required when shot_type=customize, with a maximum of 6 shots. For each shot, prompt≤512 and duration≥1; the sum of the duration values for all shots must equal the top-level duration (tolerance ≤0.1).|
|»» index|body|integer| yes ||Storyboard shot number, starting from 1|
|»» prompt|body|string| yes ||Positive prompt for this storyboard, ≤512 characters|
|»» duration|body|any| yes ||Duration of this storyboard shot (seconds), >=1|
|»»» *anonymous*|body|string| no ||none|
|»»» *anonymous*|body|number| no ||none|
|»»» *anonymous*|body|integer| no ||none|
|» negative_prompt|body|string| no ||Negative prompt. Describes content that should not appear (such as blur, low image quality, or distortion). Passed through by the gateway.|
|» cfg_scale|body|number| no ||Generation guidance (CFG). The higher the value, the more strongly the generated result correlates with the prompt; the gateway does not prevalidate the range, and upstream constraints are typically 0–1.|
|» mode|body|string| no ||Generation mode. If omitted, the billing side defaults to std. 4k is supported only by kling-v3; enabling sound for kling-v2-6 requires pro.|
|» sound|body|string| no ||Audio switch. The gateway performs model/mode validation only for non-empty values; setting it to on triggers audio billing. Only kling-v2-6 and kling-v3 are supported; v2-6 requires mode=pro.|
|» voice_list|body|[object]| no ||Custom voice list. When sound=on and the list is non-empty, it contributes to the billing multiplier (hasVoiceId); it is recognized only for the image2video path and is not counted for text2video. Must be used with the audio capabilities of kling-v2-6 / kling-v3.|
|»» voice_id|body|string| yes ||Custom voice ID, obtained from the voice creation API|
|» aspect_ratio|body|string| no ||Aspect ratio (width:height). Upstream constraint: Common values are 16:9 / 9:16 / 1:1; the gateway does not prevalidate the enum.|
|» duration|body|any| yes ||Video duration (seconds), required. For models other than kling-v3: only 5 or 10; for kling-v3: 3–15. Supports string or integer; the gateway normalizes the value to a string.|
|»» *anonymous*|body|string| no ||none|
|»» *anonymous*|body|integer| no ||none|
|» camera_control|body|object| no ||Camera movement control. If omitted, the model selects an appropriate setting automatically; the gateway passes the value through without validating the specific numeric range.|
|»» type|body|string| no ||Control type, such as simple|
|»» config|body|object| no ||Camera Movement Parameter Configuration|
|»»» horizontal|body|number| no ||Horizontal displacement|
|»»» vertical|body|number| no ||Vertical displacement|
|»»» pan|body|number| no ||Horizontal pan (left/right)|
|»»» tilt|body|number| no ||Vertical tilt (up/down)|
|»»» roll|body|number| no ||Rotation|
|»»» zoom|body|number| no ||Zoom|
|» callback_url|body|string(uri)| no ||Task completion callback URL. A POST notification is sent after the upstream task finishes. The URL must be publicly accessible, and the gateway passes the notification through unchanged.|
|» external_task_id|body|string| no ||The caller's external task ID, used for idempotent association and business reconciliation; this is not `data.task_id` in the response body.|

#### Enum

|Name|Value|
|---|---|
|» model_name|kling-v1|
|» model_name|kling-v1-5|
|» model_name|kling-v1-6|
|» model_name|kling-v2-master|
|» model_name|kling-v2-1|
|» model_name|kling-v2-1-master|
|» model_name|kling-v2-5-turbo|
|» model_name|kling-v2-6|
|» model_name|kling-v3|
|» shot_type|customize|
|» shot_type|intelligence|
|» mode|std|
|» mode|pro|
|» mode|4k|
|» sound|on|
|» sound|off|
|» aspect_ratio|16:9|
|» aspect_ratio|9:16|
|» aspect_ratio|1:1|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/image2video/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Omni-Video

## POST Omni-Video

POST /kling/v1/videos/omni-video

> Body Parameters

```json
{
    "model_name": "kling-video-o1",
    "prompt": "A cinematic aerial shot over a misty mountain lake at sunrise",
    "mode": "pro",
    "duration": "5",
    "aspect_ratio": "16:9",
    "multi_shot": false
}
```

```json
{
    "model_name": "kling-video-o1",
    "prompt": "The character walks through a neon alley, cyberpunk style",
    "mode": "pro",
    "duration": "5",
    "aspect_ratio": "16:9",
    "multi_shot": false,
    "image_list": [
        {
            "image_url": "{{image_url_1}}"
        },
        {
            "image_url": "{{image_url_2}}"
        }
    ]
}
```

```json
{
    "model_name": "kling-video-o1",
    "prompt": "Smooth transition from day to night over the same street",
    "mode": "pro",
    "duration": "5",
    "image_list": [
        {
            "image_url": "{{first_frame_url}}",
            "type": "first_frame"
        },
        {
            "image_url": "{{end_frame_url}}",
            "type": "end_frame"
        }
    ],
    "multi_shot": false
}
```

```json
{
    "model_name": "kling-v3-omni",
    "prompt": "A jazz band performs on a rainy street corner",
    "mode": "pro",
    "duration": 8,
    "aspect_ratio": "16:9",
    "sound": "on",
    "multi_shot": false
}
```

```json
{
    "model_name": "kling-v3-omni",
    "prompt": "Replace the background with a futuristic city skyline",
    "mode": "pro",
    "video_list": [
        {
            "video_url": "{{video_url}}",
            "refer_type": "base",
            "keep_original_sound": "no"
        }
    ],
    "multi_shot": false
}
```

```json
{
    "model_name": "kling-video-o1",
    "prompt": "A dancer mimics the motion style of the reference video",
    "mode": "pro",
    "duration": "10",
    "aspect_ratio": "16:9",
    "video_list": [
        {
            "video_url": "{{ref_video_url}}",
            "refer_type": "feature",
            "keep_original_sound": "yes"
        }
    ],
    "multi_shot": false
}
```

```json
{
    "model_name": "kling-v3-omni",
    "prompt": "The subject walks into a sunlit studio and waves at camera",
    "mode": "pro",
    "duration": 6,
    "aspect_ratio": "1:1",
    "element_list": [
        {
            "element_id": "{{element_id}}"
        }
    ],
    "multi_shot": false
}
```

```json
{
    "model_name": "kling-v3-omni",
    "mode": "pro",
    "aspect_ratio": "16:9",
    "multi_shot": true,
    "shot_type": "customize",
    "multi_prompt": [
        {
            "index": 1,
            "prompt": "Wide shot of an empty train platform",
            "duration": 3
        },
        {
            "index": 2,
            "prompt": "Train arrives, doors open, passengers exit",
            "duration": 4
        },
        {
            "index": 3,
            "prompt": "Close-up on a ticket fluttering in the wind",
            "duration": 3
        }
    ]
}
```

```json
{
    "model_name": "kling-v3-omni",
    "prompt": "Product showcase rotating on a clean white pedestal",
    "mode": "pro",
    "duration": 5,
    "aspect_ratio": "9:16",
    "callback_url": "{{callback_url}}",
    "external_task_id": "{{external_task_id}}",
    "multi_shot": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes | KlingOmniVideoRequest|none|
|» model_name|body|string| yes ||Omni model name, required. o1 does not support sound/4k/multi_shot; v3-omni supports all features.|
|» prompt|body|string| no ||Text prompt, up to 2,500 characters. Required when multi_shot=false; ignored when multi_shot=true.|
|» multi_shot|body|boolean| no ||Whether to use multiple shots. Defaults to false. Only kling-v3-omni can be set to true.|
|» shot_type|body|string| no ||Storyboard mode. Required when multi_shot=true; customize must be used with multi_prompt.|
|» multi_prompt|body|[object]| no ||Custom storyboard list. Required when shot_type=customize. Up to 6 shots.|
|»» index|body|integer| yes ||Storyboard shot number, starting from 1|
|»» prompt|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|
|»» duration|body|any| yes ||Duration of this storyboard shot (seconds), >=1|
|»»» *anonymous*|body|string| no ||none|
|»»» *anonymous*|body|number| no ||none|
|»»» *anonymous*|body|integer| no ||none|
|» image_list|body|[object]| no ||Reference image list. Used as a reference for the subject, scene, or style, or as the first and last frames.|
|»» image_url|body|string| no ||Image URL or Base64|
|»» type|body|string| no ||First and last frame types. If end_frame is specified, first_frame must also be specified.|
|» video_list|body|[object]| no ||Reference video list, with a maximum of 1 item.|
|»» video_url|body|string| yes ||Reference video URL; must be publicly accessible|
|»» refer_type|body|string| yes ||feature=feature reference; base=video editing (duration is determined by video probing).|
|»» keep_original_sound|body|string| no ||Keep the video's original audio?|
|» element_list|body|[object]| no ||Principal reference list.|
|»» element_id|body|any| yes ||Principal ID, returned by the Create Principal API|
|»»» *anonymous*|body|string| no ||none|
|»»» *anonymous*|body|integer| no ||none|
|» mode|body|string| no ||Generation mode. The default gateway appends pro; 4K is supported only by kling-v3-omni.|
|» aspect_ratio|body|string| no ||[PASTE YOUR CHINESE TEXT HERE]|
|» duration|body|any| no ||Video duration (seconds). o1: 5/10; v3-omni: 3–15; when refer_type=base, this is overridden by video detection and may be omitted.|
|»» *anonymous*|body|string| no ||none|
|»» *anonymous*|body|integer| no ||none|
|» sound|body|string| no ||Audio switch. `on` is supported only by `kling-v3-omni`; passing `on` to `o1` returns a 400 error.|
|» callback_url|body|string(uri)| no ||Task completion callback URL, which must be publicly accessible|
|» external_task_id|body|string| no ||External task ID of the caller, used for business correlation|
|» watermark_info|body|object| no ||Watermark configuration, gateway pass-through|
|»» enabled|body|boolean| no ||true generates a watermarked result|

#### Description

**»» prompt**: [PASTE YOUR CHINESE TEXT HERE]
"This storyboard prompt must be no more than 512 characters"

**» aspect_ratio**: [PASTE YOUR CHINESE TEXT HERE]
"Aspect ratio. It is recommended to specify this field when no first frame is used and the operation is not video editing."

#### Enum

|Name|Value|
|---|---|
|» model_name|kling-video-o1|
|» model_name|kling-v3-omni|
|» shot_type|customize|
|»» type|first_frame|
|»» type|end_frame|
|»» refer_type|feature|
|»» refer_type|base|
|»» keep_original_sound|yes|
|»» keep_original_sound|no|
|» mode|std|
|» mode|pro|
|» mode|4k|
|» aspect_ratio|16:9|
|» aspect_ratio|9:16|
|» aspect_ratio|1:1|
|» sound|on|
|» sound|off|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/omni-video/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Multi-image reference video

## POST Multi-image reference video

POST /kling/v1/videos/multi-image2video

> Body Parameters

```json
{
    "model_name": "kling-v1-6",
    "image_list": [
        {
            "image": "{{image_url_1}}"
        },
        {
            "image": "{{image_url_2}}"
        }
    ],
    "prompt": "A cinematic scene blending the subjects from reference images, smooth camera movement",
    "mode": "std",
    "duration": "5",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v1-6",
    "image_list": [
        {
            "image": "{{image_url_1}}"
        }
    ],
    "prompt": "The character turns and walks forward, soft natural lighting",
    "mode": "std",
    "duration": 5,
    "aspect_ratio": "9:16"
}
```

```json
{
    "model_name": "kling-v1-6",
    "image_list": [
        {
            "image": "{{image_url_1}}"
        },
        {
            "image": "{{image_url_2}}"
        },
        {
            "image": "{{image_url_3}}"
        },
        {
            "image": "{{image_url_4}}"
        }
    ],
    "prompt": "Combine scene, character, style and lighting from all reference images",
    "duration": "10",
    "aspect_ratio": "16:9"
}
```

```json
{
    "model_name": "kling-v1-6",
    "image_list": [
        {
            "image": "{{image_url_1}}"
        },
        {
            "image": "{{image_url_2}}"
        }
    ],
    "prompt": "Epic wide shot merging both characters into one cohesive action scene",
    "negative_prompt": "blurry, distorted face, low quality, watermark",
    "cfg_scale": 0.5,
    "mode": "pro",
    "duration": "10",
    "aspect_ratio": "16:9"
}
```

```json
{
  "model_name": "kling-v1-6",
  "image_list": [
    { "image": "{{image_url_1}}" },
    { "image": "{{image_url_2}}" },
    { "image": "{{image_url_3}}" }
  ],
  "prompt": "Fashion editorial style video with dynamic camera pan",
  "mode": "pro",
  "duration": "5",
  "aspect_ratio": "1:1",
  "callback_url": "https://your-server.com/webhook/kling",
  "external_task_id": "biz-mi2v-20260701-001"
}
```

```json
{
    "model_name": "kling-v1-6",
    "image_list": [
        {
            "image": "{{image_url_1}}"
        },
        {
            "image": "{{image_url_2}}"
        }
    ],
    "prompt": "Slow motion transition between two reference scenes",
    "mode": "std",
    "duration": 10,
    "aspect_ratio": "16:9"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes | KlingMultiImage2VideoRequest|none|
|» model_name|body|string| yes ||Model name. Required. The gateway only allows kling-v1-6; a missing or different value returns 400.|
|» image_list|body|[object]| yes ||Reference image list. Required. 1-4 images; each item must contain an image field (URL or Base64). The gateway only verifies that image is non-empty; the format and size are validated upstream.|
|»» image|body|string| yes ||Reference image URL or Base64 data. Required. Do not use image_url instead (the gateway only recognizes the image field).|
|»» image_url|body|string| no ||Fallback image URL field. Gateway validation does not read this field; use image instead.|
|»» image_fidelity|body|number| no ||Image fidelity, gateway pass-through, no scope pre-validation.|
|»» type|body|string| no ||Image type identifier, passed through by the gateway. This API does not pre-validate the enum.|
|» prompt|body|string| no ||Positive prompt, optional. The gateway does not require this field; if provided, it must be no more than 2,500 characters. It is recommended to specify one to guide motion and style.|
|» negative_prompt|body|string| no ||Negative prompt, optional. Passed through by the gateway without length pre-validation (only `prompt` is validated against the 2,500-character limit).|
|» cfg_scale|body|number| no ||Generation freedom (CFG), optional. The gateway passes it through without validating the range.|
|» mode|body|string| no ||Generation mode. If omitted, the billing side defaults to `std`. 4K is not supported.|
|» aspect_ratio|body|string| no ||Aspect ratio. Optional; when provided, the gateway validates it against the enum during preflight; when omitted, it is determined by the upstream service.|
|» duration|body|any| yes ||Video duration (seconds), required. Only 5 or 10 is allowed; string / integer is supported, and the gateway normalizes the value to a string. If omitted, the Relay billing layer reports duration must be 5 or 10.|
|»» *anonymous*|body|string| no ||none|
|»» *anonymous*|body|integer| no ||none|
|» callback_url|body|string(uri)| no ||Task completion callback URL. It must be publicly accessible, and the gateway forwards it unchanged.|
|» external_task_id|body|string| no ||The caller's external task ID, used for idempotent association and business reconciliation; this is not the `data.task_id` returned in the response.|

#### Enum

|Name|Value|
|---|---|
|» model_name|kling-v1-6|
|» mode|std|
|» mode|pro|
|» aspect_ratio|16:9|
|» aspect_ratio|9:16|
|» aspect_ratio|1:1|
|»» *anonymous*|5|
|»» *anonymous*|10|
|»» *anonymous*|5|
|»» *anonymous*|10|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/multi-image2video/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Multimodal Video Editing

## POST Initialize video to be edited

POST /kling/v1/videos/multi-elements/init-selection

> Body Parameters

```json
{
    "video_id": "828013548709777428",
    "video_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» video_id|body|string| no ||Video ID. Select a video to be edited from historical works. Only supports video works generated within 30 days. Only supports videos with duration ≥2 seconds and ≤5 seconds, or ≥7 seconds and ≤10 seconds. Related to the video_url parameter; cannot be empty at the same time, and cannot both have values at the same time.|
|» video_url|body|string| no ||Obtain the video URL. Pass the video download link during upload, and pass the video URL returned by the interface when editing the selection. Only MP4 and MOV formats are supported. Only videos with duration ≥2 seconds and ≤5 seconds, or ≥7 seconds and ≤10 seconds are supported.|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Add Video Selection

POST /kling/v1/videos/multi-elements/add-selection

> Body Parameters

```json
{
    "session_id": "828033558945619987",
    "frame_index": 1,
    "points": [
        {
            "x": 0.0,
            "y": 1.0
        }
    ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» session_id|body|string| yes ||Session ID, which is generated based on the video initialization task and will not change with editing selection behavior|
|» frame_index|body|integer| yes ||Frame Number: A maximum of 10 marker frames are supported, meaning you can mark video selections based on up to 10 frames. Only 1 frame can be marked at a time.|
|» points|body|[object]| yes ||Click to select coordinates, represented by x and y. Value range: [0,1], expressed as a percentage; [0,1] represents the top-left corner of the canvas. Multiple marker points can be added simultaneously; a maximum of 10 points can be marked in a single frame.|
|»» x|body|integer| no ||none|
|»» y|body|integer| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Delete Video Selection

POST /kling/v1/videos/multi-elements/delete-selection

> Body Parameters

```json
{
    "session_id": "828033558945619987",
    "frame_index": 1,
    "points": [
        {
            "x": 1.0,
            "y": 0.0
        }
    ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» session_id|body|string| yes ||Session ID, which is generated based on the video initialization task and will not change with editing selection behavior|
|» frame_index|body|integer| yes ||Frame Number: A maximum of 10 marker frames are supported, meaning you can mark video selections based on up to 10 frames. Only 1 frame can be marked at a time.|
|» points|body|[object]| yes ||Click to select coordinates, represented by x and y. Value range: [0,1], expressed as a percentage; [0,1] represents the top-left corner of the canvas. Multiple marker points can be added simultaneously; a maximum of 10 points can be marked in a single frame.|
|»» x|body|integer| no ||none|
|»» y|body|integer| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Preview Selected Region Video

POST /kling/v1/videos/multi-elements/preview-selection

> Body Parameters

```json
{
    "session_id": "828033558945619987"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» session_id|body|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Multimodal Video

POST /kling/v1/videos/multi-elements

> Body Parameters

```json
{
    "model_name": "kling-v1-6",
    "session_id": "",
    "edit_mode": "",
    "image_list": [],
    "prompt": "",
    "negative_prompt": "",
    "mode": "std",
    "duration": "5",
    "callback_url": "",
    "external_task_id": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model_name|body|string| yes ||Model name enumeration value: kling-v1-6|
|» session_id|body|string| yes ||Session ID, which is generated based on the video initialization task and will not change with editing selection behavior|
|» edit_mode|body|string| yes ||Operation type enumeration values: addition, swap, removal, where: addition: add element, swap: replace element, removal: delete element|
|» image_list|body|[string]| no ||Cropped reference image|
|» prompt|body|string| yes ||Positive Text Prompt|
|» negative_prompt|body|string| no ||Negative text prompt|
|» mode|body|string| yes ||Video Generation Mode|
|» duration|body|string| yes ||Video duration generation, unit: s|
|» callback_url|body|string| no ||none|
|» external_task_id|body|string| no ||none|

#### Description

**» mode**: Video Generation Mode
Enumeration values: std, pro
Where std: Standard mode (standard), basic mode, high cost-effectiveness
Where pro: Expert mode (high quality), high performance mode, superior video generation quality

**» duration**: Video duration generation, unit: s
Enumeration values: 5, 10

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/multi-elements/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Video Extension

## POST Video Extension

POST /kling/v1/videos/video-extend

> Body Parameters

```json
{
    "video_id": "828006748715380777",
    "prompt": "Extend animation effect",
    "negative_prompt": "",
    "cfg_scale": 0.5,
    "callback_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» video_id|body|string| yes ||Video ID: Supports extending the video ID generated through text, images, and video (the original video cannot exceed 3 minutes)|
|» prompt|body|string| yes ||Positive text prompt cannot exceed 2500 characters|
|» negative_prompt|body|string| no ||Negative text prompt|
|» cfg_scale|body|number| no ||Prompt Reference Strength  Value range: [0,1], the larger the value, the stronger the reference strength|
|» callback_url|body|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/video-extend/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Video Effects

## POST Video Effects

POST /kling/v1/videos/effects

> Body Parameters

```json
{
    "effect_scene": "pet_lion",
    "input": {
        "image": "https://p4-kling.klingai.com/bs2/upload-ylab-stunt/c54e463c95816d959602f1f2541c62b2.png?x-kcdn-pid=112452"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» effect_scene|body|string| yes ||Scene Name|
|» input|body|object| no ||Reference Image  Supports passing image Base64 encoding or image URL (ensure accessibility). Supports struct input for different tasks. Depending on the scene, the fields passed in the struct differ. See "Scene Request Body" for details.|
|»» images|body|[string]| no ||Two-player|
|»» image|body|string| no ||Single player|
|» callback_url|body|string| no ||none|
|» external_task_id|body|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/effects/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Image Generation

## POST Image Generation

POST /kling/v1/images/generations

> Body Parameters

```json
{
    "model_name": "kling-v1",
    "prompt": "Generate an image of a seaside",
    "negative_prompt": "",
    "image": "",
    "image_reference": "",
    // "image_fidelity": "0.5",
    "human_fidelity": 0.45,
    "resolution": "1k",
    "n": 2,
    "aspect_ratio": "16:9",
    "callback_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model_name|body|string| yes ||Model name enumeration values: kling-v1, kling-v1-5, kling-v2, kling-v2-new, kling-v2-1, kling-v3|
|» prompt|body|string| yes ||Positive text prompt cannot exceed 2500 characters|
|» negative_prompt|body|string| no ||Negative text prompt cannot exceed 2500 characters|
|» image|body|string| no ||The reference image supports passing in image Base64 encoding or image URL (ensure it is accessible)|
|» image_reference|body|string| no ||Image Reference Type|
|» image_fidelity|body|number| no ||Reference strength of user-uploaded images during the generation process|
|» human_fidelity|body|number| no ||Facial reference strength, which refers to the similarity of facial features of the person in the reference image.|
|» resolution|body|string| no ||Image Generation Clarity|
|» n|body|integer| yes ||Number of images to generate|
|» aspect_ratio|body|string| no ||Aspect ratio (width:height) of the generated image|
|» callback_url|body|string| no ||none|

#### Description

**» image_reference**: Image Reference Type
Enumeration values: subject (character trait reference), face (facial appearance reference)
When using face (facial appearance reference), the uploaded image must contain only 1 face.
When using kling-v1-5 and the image parameter is not empty, this parameter is required.

**» image_fidelity**: Reference strength of user-uploaded images during the generation process
Value range: [0,1], the larger the value, the stronger the reference strength

**» human_fidelity**: Facial reference strength, which refers to the similarity of facial features of the person in the reference image.
Only takes effect when the image_reference parameter is subject.
Value range: [0,1], the larger the value, the stronger the reference strength.

**» resolution**: Image Generation Clarity
Enumeration values: 1k, 2k
1k: 1K Standard Definition
2k: 2K High Definition

**» n**: Number of images to generate
Value range: [1, 9]

**» aspect_ratio**: Aspect ratio (width:height) of the generated image
Enumerated values: 16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/images/generations/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Multi-image reference image generation

## POST Multi-image reference image generation

POST /kling/v1/images/multi-image2image

> Body Parameters

```json
{
    "model_name": "kling-v2",
    "prompt": "Merge based on the characteristics of the two images",
    "subject_image_list": [
        {
            "subject_image": "https://p2-fdl.klingai.com/ksc2/z3PF_5x5kcBzfxZU-uZ66pg5k_lhpifyoCyTFjn_jsKOiBYQGMoR7_kLKO34JyIdJbCSKR3vRneCwiyPHHjTPk01J7Dr65Ovoa7vYQuEh9c4j1_0G03JjIyKUMI58c29jou3zMmAyhzg7p8CrG7esV5agnr2P9XuO5VdTKdr0sUjEDycWEFe07ajsaYFg-wCu7vTJGLD0cr3nvYKnUl-CA.png?cacheKey=ChtzZWN1cml0eS5rbGluZy5tZXRhX2VuY3J5cHQSsAEeMBuZg7aCbU7N7Rcp5oJ-kfGAN3V073p1GMw7U9oTuISV4gRwnqW7X62AbPhPQVRmzngQDHsFrcGU8kCtzGOJEUWdikBNDmI_JPyD4jpae40CyqnscoIaQhbakFkkDSf515oxxHoFKX2uekXxhaC-Ux41JUupV2RFEPtWRqJtZy4w5ozqI6jbHeVXI7LP_zHpYOGuULmTPK93QFpw13NYPzMPddw3UIRVMrgRQxivnBoS0TR4h_eyjkvDOmDeFijUb3cSIiCmxVk1M5S1rqBZGCnxiZ3evpByg-3YWaVjVOSCzNW4rCgFMAE&x-kcdn-pid=112757&pkey=AAXAHqkraVdXL-kd_qQmLBUx0arOSG4SaHfdeXdQqN5MCBxYZ4QHE_nMRaT_7H8WHOAkbT65kOvXwPx8qkIAOsrbUM980pOy5e_FSqUqJgc_1oYe5msfxxfxRU6wi85LgDw"
        },
        {
            "subject_image": "https://p2-fdl.klingai.com/ksc2/r4gHNdLJu7R_NKFagBrRhUo3pHsXVPKzNvpK03wlneD_9vJUZW305KBZOtLLDMPi3x_S2OA3_kElUJ9OTGiTMJEgl_JquTY_F18h_3T_bUuMAJMwv-Ab4Q0lxaqv5hkTkPf3RiMM-e8L6YDoiu_hqlEWNRoMfcF600L9QjzdeCNWHxt6l1yQHNN-2F1dlnIEEFRCUNtIYl4ld4CTrXU0zQ.png?cacheKey=ChtzZWN1cml0eS5rbGluZy5tZXRhX2VuY3J5cHQSsAG1PSTwbCq6_SmEkj2U-TQz3h6o_RMO0KUqJXA27NGRFxm-LmGTjaZHzO05ErU-1RdPfZjNK3M0uZQgSW8l2wVcgIou7OGlV4U0SpKzy-YxHgDwmjhlD389wl-rkRst5lcT-7rHQIBfz43n6hQpftalgQdQjzzX9Ba3mYFhNzCtRqeBJDHWZtmqR7Z_VjyVv6JuKd17mIdxVvUnUbrWebqODuRgWdconrxD-f2sXDo2JxoSbgFFnrpiqTZzapT733K7iU3CIiA53wUUSuPo6Nl3x-sMGxPpxWlgCCGZxjsdEzImNu8MQSgFMAE&x-kcdn-pid=112757&pkey=AAVbt25OjExCTX4XvCkIx0TYQ04HQw2NzKf4Lr5yxgJLFDF-iCUXHjGNnRg50Hk2CbkG5E905N4sXT4AkKNgSeYxfSs4YmmPRabsUxE-4lvP915Q3JT0nV1IvaUlXcBPwuY"
        }
    ],
    "scene_image": "",
    "style_image": "",
    "n": 1,
    "aspect_ratio": "16:9",
    "callback_url": "",
    "external_task_id": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model_name|body|string| yes ||Model name enumeration values: kling-v2, kling-v2-1|
|» prompt|body|string| no ||Positive text prompt|
|» subject_image_list|body|[object]| yes ||Supports a maximum of 4 images and a minimum of 1 image|
|»» subject_image|body|string| yes ||none|
|» scene_image|body|string| no ||Scene reference image|
|» style_image|body|string| no ||Style reference image|
|» n|body|integer| yes ||Number of images to generate|
|» aspect_ratio|body|string| no ||Aspect ratio (width:height) of the generated image|
|» callback_url|body|string| no ||none|
|» external_task_id|body|string| no ||none|

#### Description

**» prompt**: Positive text prompt
Cannot exceed 2500 characters

**» scene_image**: Scene reference image
Supports passing image Base64 encoding or image URL (ensure it is accessible)

**» style_image**: Style reference image
Supports passing image Base64 encoding or image URL (ensure accessibility)

**» n**: Number of images to generate
Value range: [1, 9]

**» aspect_ratio**: Aspect ratio (width:height) of the generated image
Enumerated values: 16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/images/multi-image2image/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Omni-Image

## POST Omni-Image

POST /kling/v1/images/omni-image

> Body Parameters

```json
{
    "model_name": "kling-image-o1",
    "prompt": "Generate an image of people dancing by the seaside",
    // "image_list": [
    //     {
    //         "image": "https://p2-fdl.klingai.com/ksc2/z3PF_5x5kcBzfxZU-uZ66pg5k_lhpifyoCyTFjn_jsKOiBYQGMoR7_kLKO34JyIdJbCSKR3vRneCwiyPHHjTPk01J7Dr65Ovoa7vYQuEh9c4j1_0G03JjIyKUMI58c29jou3zMmAyhzg7p8CrG7esV5agnr2P9XuO5VdTKdr0sUjEDycWEFe07ajsaYFg-wCu7vTJGLD0cr3nvYKnUl-CA.png?cacheKey=ChtzZWN1cml0eS5rbGluZy5tZXRhX2VuY3J5cHQSsAEeMBuZg7aCbU7N7Rcp5oJ-kfGAN3V073p1GMw7U9oTuISV4gRwnqW7X62AbPhPQVRmzngQDHsFrcGU8kCtzGOJEUWdikBNDmI_JPyD4jpae40CyqnscoIaQhbakFkkDSf515oxxHoFKX2uekXxhaC-Ux41JUupV2RFEPtWRqJtZy4w5ozqI6jbHeVXI7LP_zHpYOGuULmTPK93QFpw13NYPzMPddw3UIRVMrgRQxivnBoS0TR4h_eyjkvDOmDeFijUb3cSIiCmxVk1M5S1rqBZGCnxiZ3evpByg-3YWaVjVOSCzNW4rCgFMAE&x-kcdn-pid=112757&pkey=AAXAHqkraVdXL-kd_qQmLBUx0arOSG4SaHfdeXdQqN5MCBxYZ4QHE_nMRaT_7H8WHOAkbT65kOvXwPx8qkIAOsrbUM980pOy5e_FSqUqJgc_1oYe5msfxxfxRU6wi85LgDw"
    //     }
    // ],
    "element_list": [
        {
            "element_id": 835266081714884677
        }
    ],
    "resolution": "",
    "n": 1,
    "aspect_ratio": "",
    "callback_url": "",
    "external_task_id": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model_name|body|string| yes ||Model name enumeration values: kling-image-o1, kling-v3-omni|
|» prompt|body|string| yes ||Text prompt, which can include positive descriptions and negative descriptions|
|» image_list|body|[object]| no ||List of Figures|
|»» image|body|string| no ||none|
|» resolution|body|string| no ||Image Generation Clarity|
|» n|body|integer| no ||Number of Images to Generate|
|» result_type|body|string| no ||Generated result single image/image series toggle switch|
|» series_amount|body|integer| no ||Number of images to generate in a group image|
|» aspect_ratio|body|string| no ||Aspect ratio of the generated image (width:height)|
|» watermark_info|body|object| no ||Whether to also generate a watermarked result|
|»» enabled|body|boolean| yes ||none|
|» callback_url|body|string| no ||none|
|» external_task_id|body|string| no ||none|

#### Description

**» prompt**: Text prompt, which can include positive descriptions and negative descriptions
Prompts can be templated to meet different image generation requirements
Cannot exceed 2500 characters

**» resolution**: Image Generation Clarity

Enumeration values: 1k, 2k
1k: 1K Standard Definition
2k: 2K High Definition

**» n**: Number of Images to Generate

Value range: [1, 9]

**» result_type**: Generated result single image/image series toggle switch
Enumeration values: single, series

**» series_amount**: Number of images to generate in a group image
● Value range: [2, 9]
When result_type is set to single, this parameter is invalid

**» aspect_ratio**: Aspect ratio of the generated image (width:height)
Enum values: 16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9, auto
Where: auto intelligently generates video based on the input content
When generating a new image based on the aspect ratio of the reference original image, this parameter is invalid

**» watermark_info**: Whether to also generate a watermarked result
● Defined via the `enabled` parameter, carried as key:value pairs, as follows:
```
"watermark_info": {
    "enabled": boolean // true = generate, false = do not generate
}
```
● Custom watermarks are not currently supported

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/images/omni-image/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Expand image

## POST Expand image

POST /kling/v1/images/editing/expand

> Body Parameters

```json
{
    "image": "https://h2.inkwai.com/bs2/upload-ylab-stunt/se/ai_portal_queue_mmu_image_upscale_aiweb/3214b798-e1b4-4b00-b7af-72b5b0417420_raw_image_0.jpg",
    "up_expansion_ratio": 0.1,
    "down_expansion_ratio": 0.1,
    "left_expansion_ratio": 0.1,
    "right_expansion_ratio": 0.1,
    "prompt": "focus on the center",
    "n": 1,
    "callback_url": "",
    "external_task_id": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» image|body|string| yes ||Reference image|
|» up_expansion_ratio|body|number| yes ||Expand upward; calculated based on multiples of the original image height|
|» down_expansion_ratio|body|number| yes ||Expand downward range; calculated based on multiples of the original image height|
|» left_expansion_ratio|body|number| yes ||Expand range to the left; calculated based on a multiple of the original image width|
|» right_expansion_ratio|body|number| yes ||Expand range to the right; calculated based on a multiple of the original image width|
|» prompt|body|string| no ||Positive text prompt|
|» n|body|integer| yes ||Number of images to generate|
|» callback_url|body|string| no ||none|
|» external_task_id|body|string| no ||none|

#### Description

**» image**: Reference image
Supports passing image Base64 encoding or image URL (ensure accessibility)

**» up_expansion_ratio**: Expand upward; calculated based on multiples of the original image height
Value range: [0, 2], the total area of the new image must not exceed 3 times the original image
For example, if the original image height is 20 and the current parameter value is 0.1, then:
The distance from the top edge of the original image to the top edge of the new image is 20 × 0.1 = 2, and the entire area within this region is the expansion range

**» down_expansion_ratio**: Expand downward range; calculated based on multiples of the original image height
Value range: [0, 2], the total area of the new image must not exceed 3 times the original image
For example, if the original image height is 20 and the current parameter value is 0.2, then:
The distance between the original image bottom edge and the new image bottom edge is 20 × 0.2 = 4, and the area within this range is the expansion region

**» left_expansion_ratio**: Expand range to the left; calculated based on a multiple of the original image width
Value range: [0, 2], the total area of the new image must not exceed 3 times the original image
For example, if the original image width is 30 and the current parameter value is 0.3, then:
The distance from the left edge of the original image to the left edge of the new image is 30 × 0.3 = 9, and the entire area within this region is the expansion range

**» right_expansion_ratio**: Expand range to the right; calculated based on a multiple of the original image width
Value range: [0, 2], the total area of the new image must not exceed 3 times the original image
For example, if the original image width is 30 and the current parameter value is 0.4, then:
The distance from the right edge of the original image to the right edge of the new image is 30 × 0.4 = 12, and the entire area within this region is the expansion range

**» prompt**: Positive text prompt
Cannot exceed 2500 characters

**» n**: Number of images to generate
Value range: [1, 9]

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/images/editing/expand/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Image Recognition

## POST Image Recognition

POST /kling/v1/videos/image-recognize

> Body Parameters

```json
{
    "image": "https://h2.inkwai.com/bs2/upload-ylab-stunt/se/ai_portal_queue_mmu_image_upscale_aiweb/3214b798-e1b4-4b00-b7af-72b5b0417420_raw_image_0.jpg"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» image|body|string| yes ||Image to be recognized: Supports passing image Base64 encoding or image URL (ensure accessibility). Image formats supported: .jpg / .jpeg / .png. Image file size must not exceed 10MB. Image width and height dimensions must be no less than 300px. Image aspect ratio must be between 1:2.5 ~ 2.5:1.|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Digital human

## POST Digital human

POST /kling/v1/videos/avatar/image2video

> Body Parameters

```json
{
    "image": "https://h2.inkwai.com/bs2/upload-ylab-stunt/se/ai_portal_queue_mmu_image_upscale_aiweb/3214b798-e1b4-4b00-b7af-72b5b0417420_raw_image_0.jpg",
    "audio_id": "825455158141661278",
    "sound_file": "",
    "prompt": "",
    "mode": "std",
    "callback_url": "",
    "external_task_id": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» image|body|string| yes ||Digital human reference images support passing in image Base64 encoding or image URL (ensure accessibility). Image formats support .jpg / .jpeg / .png. Image file size cannot exceed 10MB. Image width and height dimensions must not be less than 300px. Image aspect ratio must be between 1:2.5 ~ 2.5:1.|
|» audio_id|body|string| yes ||The audio ID generated through the trial listening interface only supports audio generated within 30 days with a duration of no less than 2 seconds and no more than 300 seconds. The audio_id and sound_file parameters must choose one, cannot both be empty, and cannot both have values.|
|» sound_file|body|string| yes ||Audio file; supports passing in audio Base64 encoding or audio URL (ensure accessibility); audio files support .mp3/.wav/.m4a/.aac formats, file size must not exceed 5MB, format mismatch or oversized files will return error codes and related information; only supports audio with duration not shorter than 2 seconds and not longer than 300 seconds; audio_id and sound_file parameters are mutually exclusive — they cannot both be empty, and they cannot both be present; the system will validate audio content, and if there are issues, it will return error codes and related information|
|» prompt|body|string| yes ||Positive Text Prompt|
|» mode|body|string| yes ||Video Generation Mode|
|» callback_url|body|string| yes ||none|
|» external_task_id|body|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/avatar/image2video/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Text-to-Speech Sound Effects

## POST Text-to-Speech Sound Effects

POST /kling/v1/audio/text-to-audio

> Body Parameters

```json
{
    "prompt": "Audio describing scenery",
    "duration": 5.0,
    "external_task_id": "",
    "callback_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» prompt|body|string| yes ||text prompt|
|» duration|body|string| yes ||The duration range for generated audio: 3.0 seconds to 10.0 seconds, with support for one decimal place precision.|
|» external_task_id|body|string| no ||none|
|» callback_url|body|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/audio/text-to-audio/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Video-to-Audio

## POST Video-to-Audio

POST /kling/v1/audio/video-to-audio

> Body Parameters

```json
{
    "video_id": "825406034503692376",
    "video_url": "",
    "sound_effect_prompt": "Human voice that matches the video",
    "bgm_prompt": "",
    "asmr_mode": false,
    "external_task_id": "",
    "callback_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» video_id|body|string| no ||ID of video generated by Keling AI. Only supports videos generated within 30 days and with a duration between 3.0 seconds and 20.0 seconds.|
|» video_url|body|string| no ||The acquisition link of the uploaded video and the video_id parameter must have one filled in; they cannot both be empty, and they cannot both have values. Video format supports only MP4/MOV, file size ≤ 100M, and video duration between 3.0 seconds and 20.0 seconds.|
|» sound_effect_prompt|body|string| no ||Audio Generation Prompt|
|» bgm_prompt|body|string| no ||Music Generation Prompt|
|» asmr_mode|body|boolean| no ||Whether to enable ASMR mode; this mode enhances detailed sound effects and is suitable for high-immersion content scenarios. true indicates enabled, false indicates disabled (default value)|
|» external_task_id|body|string| no ||none|
|» callback_url|body|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/audio/video-to-audio/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Speech Synthesis

## POST Speech Synthesis

POST /kling/v1/audio/tts

> Body Parameters

```json
{
    "text": "Describe what you see",
    "voice_id": "genshin_vindi2",
    "voice_language": "zh",
    "voice_speed": "1.0"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» text|body|string| yes ||Text content for synthesized audio; the maximum length of text content is 1000 characters. If the content exceeds this limit, the system will return error codes and related information. The system will validate the text content, and if there are any issues, it will return error codes and related information.|
|» voice_id|body|string| yes ||Voice ID  The system provides multiple voice options to choose from. For specific voice effects, voice ID, and the correspondence between voice language types, please refer to the documentation. Voice preview does not support custom text. Voice preview file naming convention: Voice Name#Voice ID#Voice Language. Speech synthesis currently only supports official voices; custom voices are not supported.|
|» voice_language|body|string| yes ||Text content for synthesized audio; the maximum length of text content is 1000 characters. If the content exceeds this limit, the system will return error codes and related information. The system will validate the text content, and if there are any issues, it will return error codes and related information.|
|» voice_speed|body|integer| no ||Speech rate valid range: 0.8–2.0, precise to one decimal place, values outside this range will be automatically rounded|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Virtual Try-On

## POST Virtual Try-On

POST /kling/v1/images/kolors-virtual-try-on

> Body Parameters

```json
{
    "model_name": "kolors-virtual-try-on-v1",
    "human_image": "https://h2.inkwai.com/bs2/upload-ylab-stunt/se/ai_portal_queue_mmu_image_upscale_aiweb/3214b798-e1b4-4b00-b7af-72b5b0417420_raw_image_0.jpg",
    "cloth_image": "https://imageproxy.zhongzhuan.chat/api/proxy/image/1db2a32c24087cab3405a00ee4454c94.jpg",
    "callback_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model_name|body|string| yes ||Model name enumeration values: kolors-virtual-try-on-v1, kolors-virtual-try-on-v1-5|
|» human_image|body|string| yes ||Uploaded portrait image; supports passing in image Base64 encoding or image URL (ensure it is accessible); supported image formats: .jpg / .jpeg / .png; image file size must not exceed 10MB, and image width and height dimensions must be no less than 300px|
|» cloth_image|body|string| yes ||Virtual try-on clothing image|
|» callback_url|body|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/images/kolors-virtual-try-on/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/lip-sync

## POST Face Recognition

POST /kling/v1/videos/identify-face

> Body Parameters

```json
{
    "video_id": "827297867148050499",
    "video_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» video_id|body|string| no ||The ID of a video generated by Keling AI; used to specify the video and determine whether the video is available for lip-sync service; choose either this parameter or the video_url parameter—they cannot both be empty and cannot both have values; only supports videos generated within the last 30 days with a duration not exceeding 60 seconds|
|» video_url|body|string| no ||URL for obtaining the uploaded video; used to specify the video and determine whether the video is available for lip-sync service; either this parameter or the video_id parameter must be filled in, they cannot both be empty, and they cannot both have values; video files support .mp4/.mov formats, file size must not exceed 100MB, video duration must not exceed 60s and must not be shorter than 2s, only 720p and 1080p resolutions are supported, with both width and height dimensions between 512px and 2160px, if the above validation fails, error codes and related information will be returned; the system will validate the video content, and if there are any issues, error codes and related information will be returned|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST lip-sync

POST /kling/v1/videos/advanced-lip-sync

> Body Parameters

```json
{
    "session_id": "825465778199224380",
    "face_choose": [
        {
            "face_id": "-1",
            "audio_id": "825451760499568680",
            "sound_file": "",
            "sound_start_time": 0,
            "sound_end_time": 5000,
            "sound_insert_time": 1000,
            "sound_volume": 1.0,
            "original_audio_volume": 1.0
        }
    ],
    "external_task_id": "",
    "callback_url": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» session_id|body|string| yes ||Session ID, which will be generated based on the lip-sync face recognition interface|
|» face_choose|body|[object]| yes ||Specify face lip-syncing; includes face ID, lip-sync reference content, etc.; currently only supports single-person lip-syncing specification|
|»» face_id|body|string| yes ||The face ID is returned by the face recognition interface.|
|»» audio_id|body|string| no ||Audio IDs generated through the trial listening interface only support audio generated within 30 days, with a duration of no less than 2 seconds and no more than 60 seconds. The audio_id and sound_file parameters are mutually exclusive — they cannot both be empty, and they cannot both have values.|
|»» sound_file|body|string| no ||Audio File: Supports passing audio Base64 encoding or audio URL (ensure accessibility). Audio files support .mp3/.wav/.m4a formats with a maximum file size of 5MB. Format mismatch or oversized files will return error codes and related information. Only audio with a duration of at least 2 seconds and no more than 60 seconds is supported. The audio_id and sound_file parameters are mutually exclusive—they cannot both be empty or both have values. The system will validate the audio content and return error codes and related information if there are any issues.|
|»» sound_start_time|body|integer| yes ||Audio trim start time; based on the original audio start time, with start time at 0 minutes 0 seconds, unit in ms; audio before the start point will be trimmed, and the trimmed audio must not be shorter than 2 seconds|
|»» sound_end_time|body|integer| yes ||Audio trim end time: The end time must not be later than the total duration of the original audio|
|»» sound_insert_time|body|integer| yes ||Trimmed Audio Insertion Time: The time range of the inserted audio must overlap with the lip-sync time interval of the face for at least 2 seconds. The start time of the inserted audio must not be earlier than the video start time, and the end time of the inserted audio must not be later than the video end time.|
|»» sound_volume|body|integer| yes ||Audio volume level; the larger the value, the louder the volume. Value range: [0, 2]|
|»» original_audio_volume|body|integer| yes ||Original video volume size; the larger the value, the louder the volume. Value range: [0, 2]; when the original video is muted, this parameter has no effect.|
|» external_task_id|body|string| no ||none|
|» callback_url|body|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/advanced-lip-sync/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Custom Voice

## POST Custom Voice

POST /kling/v1/general/custom-voices

> Body Parameters

```json
{
  "voice_name": "string",
  "voice_url": "string",
  "video_id": "string",
  "callback_url": "string",
  "external_task_id": "string"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» voice_name|body|string| yes ||Timbre Name|
|» voice_url|body|string| no ||Timbre Data File Acquisition Link|
|» video_id|body|string| no ||Historical work ID, which can provide audio materials through referencing historical works.|
|» callback_url|body|string| no ||none|
|» external_task_id|body|string| no ||none|

#### Description

**» voice_url**: Timbre Data File Acquisition Link
Supports audio and video files in .mp3/.wav/.mp4/.mov formats
The audio must be clean with no background noise, contain exactly one human voice, and have a duration of no less than 5 seconds and no more than 30 seconds

**» video_id**: Historical work ID, which can provide audio materials through referencing historical works.

Only videos that meet the following conditions can be used for voice customization:
- Videos generated using the V2.6 version model with the sound parameter set to on
- Videos generated through the Digital Human API
- Videos generated through the Lip-sync API
- The human voice in the audio must be clean and free of noise, with only one type of human voice, with a duration of no less than 5 seconds and no more than 30 seconds

> Response Examples

> 200 Response

```json
{
    "voice_name": "Test Voice",
    "voice_url": "",
    "video_id": "830460928805724256",
    "callback_url": "",
    "external_task_id": ""
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Custom Voice (Single)

GET /kling/v1/general/custom-voices/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Official Voice

GET /kling/v1/general/presets-voices

> Body Parameters

```json
{}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|pageNum|query|integer| no ||none|
|pageSize|query|integer| no ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Delete Custom Voice

POST /kling/v1/general/delete-voices

> Body Parameters

```json
{
  "voice_id": "string"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» voice_id|body|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/Action Control

## POST Action Control

POST /kling/v1/videos/motion-control

> Body Parameters

```json
{
    "model_name": "kling-v3",
    // "image_url": "https://p2-kling.klingai.com/kcdn/cdn-kcdn112452/kling-qa-test/multi-3.ng.png",
    "prompt": "The girl is wearing a gray loose T-shirt and denim shorts",
    "video_url": "https://p2-kling.klingai.com/kcdn/cdn-kcdn112452/kling-qa-test/dance.mp4",
    "keep_original_sound": "yes",
    // "character_orientation": "image",
    "mode": "pro",
    // "callback_url": "",
    // "external_task_id": "xxx"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» model_name|body|string| no ||Default kling-v2-6 kling-v3|
|» prompt|body|string| no ||Text prompt, which may include positive and negative descriptions.|
|» image_url|body|string| yes ||Reference Image: All elements in the generated video, including characters and backgrounds, shall be based on the reference image.|
|» video_url|body|string| yes ||Video content must meet the following requirements:|
|» element_list|body|[object]| no ||Subject Reference List|
|»» element_id|body|string| no ||When referencing the main subject, the generated video can currently only align with the character's orientation in the source video.|
|» keep_original_sound|body|string| no ||Optional: whether to retain the original audio of the video|
|» character_orientation|body|string| yes ||Generate the orientation of the person in the video, with the option to match the image or match the video.|
|» mode|body|string| yes ||Video Generation Mode|
|» callback_url|body|string| no ||none|
|» external_task_id|body|string| no ||none|
|» watermark_info|body|[object]| no ||Whether to simultaneously generate results containing watermarks|
|»» watermark_info|body|boolean| no ||true for generation, false for not generating|

#### Description

**» prompt**: Text prompt, which may include positive and negative descriptions.
Prompts can be used to add elements to the image or achieve camera movement effects; see the Kling "Motion Control" user guide for details.
Must not exceed 2500 characters.
https://docs.qingque.cn/d/home/eZQAl5y8xNSkr0iYUS8-bpGvP?identityId=2Cn18n4EIHT#section=h.xtmfpd68o18

**» image_url**: Reference Image: All elements in the generated video, including characters and backgrounds, shall be based on the reference image.

Video content must meet the following requirements:

- Characters can be realistic-style figures or cartoon-style figures with proportions similar to natural human bodies; avoid occlusion. Realistic-style figures produce better results.
- The character area in the image must exceed 5% of the image area.
- Support passing images via Base64 encoding or image URL (ensure accessibility).
- Supported image formats: .jpg / .jpeg / .png
- Image file size must not exceed 10MB; image dimensions must be no less than 300px in width and height; image aspect ratio must be between 1:2.5 and 2.5:1.

**» video_url**: Video content must meet the following requirements:

There must be exactly one character in a realistic style, shown in full body or upper body, with head included, and avoid occlusion.

Character limb movements and facial expressions must be clear and must not include complex actions such as somersaults or handstands.

Action video must be a single continuous shot; the character must remain visible in the frame at all times, avoiding scene cuts or camera movements.

Video files support .mp4/.mov formats, with file size not exceeding 100MB. Only dimensions where both width and height are between 340px and 3850px are supported. If the above validation fails, error codes and related information will be returned.

Video duration must be at least 3 seconds at minimum. The maximum duration is related to character orientation (character_orientation):

When the character orientation matches the character in the video, the video duration can be up to 30 seconds.

When the character orientation matches the character in the image, the video duration can be up to 10 seconds.

The system will validate the video content, and if there are any issues, error codes and related information will be returned.

**»» element_id**: When referencing the main subject, the generated video can currently only align with the character's orientation in the source video.
Currently, only one subject is supported for import.

**» keep_original_sound**: Optional: whether to retain the original audio of the video
Enumeration values: yes, no
Where yes: retain the original audio of the video
Where no: do not retain the original audio of the video

**» character_orientation**: Generate the orientation of the person in the video, with the option to match the image or match the video.
Enumeration values: image, video, where:
image: The person's orientation matches that in the image; in this case, the reference video duration must not exceed 10 seconds.
video: The person's orientation matches that in the video; in this case, the reference video duration must not exceed 30 seconds.

**» mode**: Video Generation Mode
Enumeration values: std, pro
Where std: Standard mode (standard), basic mode, high cost-effectiveness
Where pro: Expert mode (high quality), high performance mode, superior video generation quality

**»» watermark_info**: true for generation, false for not generating
Custom watermarks are not yet supported

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Task (Single)

GET /kling/v1/videos/motion-control/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Kling/subject

## POST Subject (Legacy)

POST /kling/v1/general/custom-elements

> Body Parameters

```json
{
    "element_name": "",
    "element_description": "",
    "element_frontal_image": "",
    "element_refer_list": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» element_name|body|string| yes ||Subject Name|
|» element_description|body|string| yes ||Main description|
|» element_frontal_image|body|string| yes ||Subject Front Reference Image|
|» element_refer_list|body|[object]| yes ||Subject Other Reference List|
|»» image_url|body|string| yes ||none|

#### Description

**» element_name**: Subject Name
Cannot exceed 20 characters

**» element_description**: Main description
Cannot exceed 100 characters

**» element_frontal_image**: Subject Front Reference Image
Supports passing image Base64 encoding or image URL (ensure accessibility)
Image format supports .jpg / .jpeg / .png
Image file size cannot exceed 10MB, image width and height dimensions must be no less than 300px, image aspect ratio must be between 1:2.5 ~ 2.5:1

**» element_refer_list**: Subject Other Reference List
Define the subject appearance by uploading multiple reference images from different angles
Upload at least 1 reference image and at most 3 reference images
Carried using key:value format, with specific details as follows:
1
2
3
4
5
"element_refer_list":[
  {"image_url":"image_url_1"},
  {"image_url":"image_url_2"},
  {"image_url":"image_url_3"}
]

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Subject (New Version)

POST /kling/v1/general/advanced-custom-elements

> Body Parameters

```json
{
    "element_name": "Main body ysh11112311213",
    "element_description": "Test",
    "reference_type": "image_refer",
    "element_image_list": {
        "frontal_image": "https://imageproxy.zhongzhuan.chat/api/proxy/image/bb9bd34363da4fa486c9e645a6b1349e.png",
        "refer_images": [
            {
                "image_url": "https://imageproxy.zhongzhuan.chat/api/proxy/image/bb9bd34363da4fa486c9e645a6b1349e.png"
            }
        ]
    },
    // "element_video_list": {
    //     "refer_videos": [
    //         {
    //             "video_url": "xxx"
    //         }
    //     ]
    // },
    // "element_voice_id": string,
    // "tag_list": [
    //     {
    //         "tag_id": "xxx"
    //     }
    // ],
    // "callback_url": "xxx",
    // "external_task_id": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|
|» element_name|body|string| yes | Subject Name|Cannot exceed 20 characters|
|» element_description|body|string| yes | Subject Description|Cannot exceed 100 characters|
|» reference_type|body|string| yes | Reference Subject Method|Enumeration values: video_refer, image_refer|
|» element_image_list|body|object| no | Subject Reference Image|Multiple images can be used to define the subject and its details.|
|»» frontal_image|body|string| no ||none|
|»» refer_images|body|[object]| no ||none|
|»»» image_url|body|string| yes ||none|
|» element_video_list|body|object| no | Reference video|Subject and details can be configured via video.|
|»» refer_videos|body|[object]| no ||none|
|»»» video_url|body|string| no ||none|
|» element_voice_id|body|string| no | Main Tone|The current sound bank already contains the sound.|
|» tag_list|body|[object]| no | Subject Configuration Tag|A subject can be configured with multiple tags, carried by key:value pairs. Tag IDs and names: o_101 Trending Topics, o_102 Characters, o_103 Animals, o_104 Props, o_105 Clothing, o_106 Scenes, o_107 Special Effects, o_108 Others|
|»» tag_id|body|string| no ||none|
|» callback_url|body|string| no ||Callback notification URL for task results; if configured, the server will proactively notify when the task status changes.|
|» external_task_id|body|string| no ||Custom task ID. A user-defined task ID; if provided, it will not overwrite the system-generated task ID, but it supports querying tasks via this ID. Please note that uniqueness must be guaranteed under a single user.|

#### Description

**» reference_type**: Enumeration values: video_refer, image_refer
video_refer: Video subject; the subject's appearance is referenced from element_video_list.
image_refer: Multi-image subject; the subject's appearance is referenced from element_image_list.
The scope of availability for subjects customized via video differs from those customized via images. See the capability map and parameter description for details.

**» element_image_list**: Multiple images can be used to define the subject and its details.

This includes a frontal reference image and additional reference images from other angles or close-ups. Specifically:
- At least one frontal reference image is required, specified via the `frontal_image` parameter.
- One to three additional reference images are required, differing from the frontal reference image; these are specified via the `image_url` parameter.

The data is carried as key:value pairs, as follows:

"element_image_list": {
  "frontal_image": "image_url_0",
  "refer_images": [{ "image_url": "image_url_1" }, ...]
}

Both Base64-encoded images and publicly accessible image URLs are supported.

Supported image formats: `.jpg`, `.jpeg`, `.png`. Each image file must not exceed 10 MB in size, must have minimum dimensions of 300×300 pixels, and must maintain an aspect ratio between 1:2.5 and 2.5:1.

When the `reference_type` parameter is set to `image_refer`, this parameter is mandatory.

**» element_video_list**: Subject and details can be configured via video.

Uploading an audio-enabled video triggers voice cloning if human speech is detected (involving cloning, adding to the voice library, and binding to the subject).

Currently, only realistic human-like avatars can be customized using videos.

The current parameters are required when referencing a video but are invalid when referencing an image.

Data is carried using key:value pairs. Video formats are limited to MP4 and MOV. Only 1080p videos with a duration between 3s and 8s and an aspect ratio of 16:9 or 9:16 are supported. A maximum of one video can be uploaded, with a size limit of 200MB. The `video_url` parameter value must not be empty.

```json
"element_video_list": {
    "refer_videos": [{ "video_url": "video_url_1" }, ...]
}
```

Subjects customized via video are only supported for the kling-video-o3 model and later versions.

**» element_voice_id**: The current sound bank already contains the sound.

When the current parameters are empty, the current subject does not bind a sound.

You can obtain the ID via sound-related APIs. Click here to view.

Only subjects supporting video customization can bind sounds.

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Custom Subject (Single New Version)

GET /kling/v1/general/advanced-custom-elements/{task_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|path|string| yes ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Query Official Entity (List New Version)

GET /kling/v1/general/advanced-presets-elements

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|pageNum|query|string| no ||none|
|pageSize|query|string| no ||none|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Delete Custom Subject (New Version)

POST /kling/v1/general/delete-elements

> Body Parameters

```json
{
    "element_id":"elem_805498da-90b2-40c1-a866-cd26eec99263"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Alibaba Pix

## POST Generate text-to-video

POST /openapi/v2/video/text/generate

Generating text-to-video via prompt

> Body Parameters

```json
{
    "aspect_ratio": "16:9",
    "duration": 5,
    "model": "v6",
    "motion_mode": "normal",
    //"camera_movement": "zoom_in", //You can add camera movement to text/image-to-video generation (supports v4, v4.5 versions). Refer to the documentation for parameter details.
    "prompt": "string",
    "quality": "540p",
    //"template_id": 302325299692608, Available only after activating the template
    //"sound_effect_switch":true,
    //"sound_effect_content":"",
    //"lip_sync_tts_switch":true,
    //"lip_sync_tts_content":"",
    //"lip_sync_tts_speaker_id":"",
    "seed": 0
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|API-KEY|header|string| no ||API-KEY comes from the Paiwo API Open Platform|
|Content-Type|header|string| no ||none|
|body|body|object| yes ||none|
|» aspect_ratio|body|string| yes ||1. The base provides aspect ratios of "16:9", "9.16", "4:3", "3:4", and "1:1"|
|» duration|body|integer| yes ||Video generation duration|
|» model|body|string| yes ||Models "v3.5","v4","v4.5", "v5","v5.5","v5.6","v6","c1"|
|» motion_mode|body|string| no ||"normal","fast". "fast" does not support 8s, versions above "v5" do not support this field|
|» camera_movement|body|string| no ||You can add camera movement to text-to-video/image-to-video generation (supports v4, v4.5 versions)|
|» prompt|body|string| yes ||Within 5000 characters|
|» quality|body|string| yes ||"360p","540p","720p","1080p"|
|» seed|body|integer| no ||Optional random number 0 - 2147483647|
|» template_id|body|integer| no ||Template (effect) ID, must be activated before use|
|» generate_audio_switch|body|boolean| no ||Supports v5.5, v5.6, v6, c1|
|» generate_multi_clip_switch|body|boolean| no ||Supported: v5.5, v6|
|» sound_effect_switch|body|boolean| no ||Can be used in v5 and below or when there is a template_id. true, false|
|» sound_effect_content|body|string| no ||Available for v5 and below, or when template_id is present. You can enter the sound effect you want; if you do not fill it in, a sound effect will be generated based on the video content.|
|» lip_sync_tts_switch|body|boolean| no ||true, false|
|» lip_sync_tts_content|body|string| no ||~140Chracters (UTF-8). You can enter the TTS content you want|
|» lip_sync_tts_speaker_id|body|string| no ||The id obtained after getting the TTS voice tone|

#### Description

**» aspect_ratio**: 1. The base provides aspect ratios of "16:9", "9.16", "4:3", "3:4", and "1:1"
2. v6,c1 supports "16:9", "9.16", "4:3", "3:4", "1:1", "2:3", "3:2", and "21:9"

**» duration**: Video generation duration
Video generation duration
v.3.5/v4/v4.5: 5/8 (v3.5 1080p cannot use 8)
v5: 5/8
v5.5/5.6: 5/8/10 (1080p cannot use 10)
v6/c1: any duration from 1 to 15

**» camera_movement**: You can add camera movement to text-to-video/image-to-video generation (supports v4, v4.5 versions)
Supported parameters: "horizontal_left","horizontal_right","vertical_up","vertical_down",
"zoom_in","zoom_out","crane_up",
"quickly_zoom_in","quickly_zoom_out","smooth_zoom_in",
"camera_rotation","robo_arm","super_dolly_out","whip_pan","hitchcock",
"left_follow","right_follow","pan_left","pan_right","fix_bg"

**» generate_audio_switch**: Supports v5.5, v5.6, v6, c1
/ Control switch Audio. true: Audio on, false: Audio off

**» generate_multi_clip_switch**: Supported: v5.5, v6
Controls single-lens, multi-lens true: multi-lens, false: single-lens/

**» sound_effect_switch**: Can be used in v5 and below or when there is a template_id. true, false
If you want to use it together with sound_effect, please set it to true

**» lip_sync_tts_switch**: true, false
If you want to use lip sync together, please set it to true

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get video status

GET /openapi/v2/video/result/{video_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|video_id|path|string| yes ||none|
|API-KEY|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Generate video template

POST /openapi/v2/video/img/generate

How to Generate a Video Template Based on Image-to-Video

> Body Parameters

```json
{
    "duration": 5,
    "img_id": 1,
    "model": "v6",
    "template_id": 0,
    "prompt": "string",
    "quality": "720p",
    //"sound_effect_switch":true
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» duration|body|integer| yes ||Pass 5 is enough; the actual duration is generated according to the template duration.|
|» prompt|body|string| yes ||The template does not recognize prompt; pass an empty value.|
|» img_id|body|integer| yes ||Used for single-image template mode|
|» img_ids|body|[integer]| no ||Used when there are multiple image templates, e.g. "img_ids": [0, 0]|
|» model|body|string| yes ||Any model can be passed; the template is unrelated to the model.|
|» template_id|body|integer| yes ||Template ID|
|» quality|body|string| yes ||"360p","540p","720p","1080p"|
|» sound_effect_switch|body|boolean| no ||When true, there will be background music|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST First and Last Frame Video Generation

POST /openapi/v2/video/transition/generate

> Body Parameters

```json
{
    "prompt": "trasnfrom into character",
    "model": "v4.5",
    "duration": 5,
    "quality": "540p",
    "motion_mode": "normal",
    "seed": 937433858,
    "first_frame_img": 0,
    "last_frame_img": 0
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» prompt|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|
|» model|body|string| yes ||Models "v3.5","v4","v4.5", "v5","v5.5","v5.6","v6","c1"|
|» duration|body|integer| yes ||Video generation duration|
|» quality|body|string| yes ||"360p","540p","720p","1080p"|
|» seed|body|integer| no ||Optional random number 0 - 2147483647|
|» first_frame_img|body|integer| yes ||img_id obtained after uploading the image|
|» last_frame_img|body|integer| yes ||img_id obtained after uploading the image|
|» motion_mode|body|string| no ||"normal","fast". "fast" does not support 8s, "v5" does not support this field|
|» generate_audio_switch|body|boolean| no ||Supports v5.5, v5.6, v6, c1 use / to control the Audio toggle. true: Audio on, false: Audio off|
|» sound_effect_switch|body|boolean| no ||Can be used for v5 and below, or when there is a template_id. true, false|
|» sound_effect_content|body|string| no ||You can enter the sound effect you want; if you leave it blank, a sound effect will be generated based on the video content.|
|» lip_sync_tts_switch|body|boolean| no ||true, false|
|» lip_sync_tts_content|body|string| no ||~140Chracters (UTF-8). You can input the TTS content you want|
|» lip_sync_tts_speaker_id|body|string| no ||ID obtained after getting the TTS voice|

#### Description

**» prompt**: [PASTE YOUR CHINESE TEXT HERE]
"Within 2048 characters"

**» duration**: Video generation duration
v.3.5/v4/v4.5: 5/8 (v3.5 1080p cannot use 8)
v5: 5/8
v5.5/v5.6: 5/8/10 (1080p cannot use 10)
v6/c1: 1~15

**» sound_effect_switch**: Can be used for v5 and below, or when there is a template_id. true, false
If you want to use sound_effect together, please pass true

**» lip_sync_tts_switch**: true, false
If you want to use lip sync together, please set it to true

**» lip_sync_tts_content**: ~140Chracters (UTF-8). You can input the TTS content you want
Applicable scope: "v3.5", "v4", "v4.5", "v5"

**» lip_sync_tts_speaker_id**: ID obtained after getting the TTS voice
Applicable scope: "v3.5", "v4", "v4.5", "v5"

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Generate lip sync (Lipsync) video

POST /openapi/v2/video/lip_sync/generate

> Body Parameters

```json
{
    "video_media_id": 0,
    //"source_media_id":0,
    //"audio_media_id":0,
    "lip_sync_tts_speaker_id": "auto",
    "lip_sync_tts_content": "hello this is harry, where are you from?"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» video_media_id|body|integer| no ||source_video_id or video_media_id is required for videos generated via pixverse|
|» source_media_id|body|integer| no ||source_video_id or video_media_id is required. Uploaded by the user video|
|» audio_media_id|body|integer| no ||Either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_conent is required. Use the audio uploaded by the user|
|» lip_sync_tts_speaker_id|body|string| no ||audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_conent is required. Use our TTS service. Obtain the TTS voice via the API.|
|» lip_sync_tts_content|body|string| no ||Either audio_media_id or lip_sync_tts_speaker_id + lip_sync_tts_conent is required to use our TTS service|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get TTS voice

GET /openapi/v2/video/lip_sync/tts_list

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|page_num|query|string| yes ||none|
|page_size|query|string| yes ||none|
|API-KEY|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Generate Extended (Extend) Video

POST /openapi/v2/video/extend/generate

> Body Parameters

```json
{
    "source_video_id": 123123,
    //"video_media_id":123123,
    "prompt": "across the universe",
    "seed": 123123,
    "quality": "540p",
    "duration": 8,
    "model": "v5",
    "motion_mode": "normal",
    "water_mark": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» source_video_id|body|integer| no ||Either source_video_id or video_media_id is required|
|» video_media_id|body|integer| no ||Either source_video_id or video_media_id is required|
|» model|body|string| yes ||Model "v3.5","v4","v4.5","v5",“v5.5“,"v6"|
|» prompt|body|string| yes ||[PASTE YOUR CHINESE TEXT HERE]|
|» seed|body|integer| no ||none|
|» quality|body|string| yes ||"360p","540p","720p","1080p"|
|» duration|body|integer| yes ||Video generation duration|
|» water_mark|body|boolean| yes ||none|
|» motion_mode|body|string| no ||"normal","fast". "fast" does not support 8s, "v5" does not support this field|
|» style|body|string| no ||Style, optional: "anime", "3d_animation", "day", "cyberpunk", "comic"; omit if not necessary.|

#### Description

**» prompt**: [PASTE YOUR CHINESE TEXT HERE]
"Within 2048 characters"

**» duration**: Video generation duration
v3.5/v4/v4.5: 5/8 (8 is not available for v3.5 at 1080p)
v5: 5/8
v5.5: 5/8/10 (10 is not available at 1080p)
v6: 1–15

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Sound Effect Generation (sound_effect) Interface

POST /openapi/v2/video/sound_effect/generate

> Body Parameters

```json
{
    "source_video_id": 343252978602905,
    //"video_media_id":123123,
    "original_sound_switch": true,
    "sound_effect_content": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» source_video_id|body|integer| no ||Either source_video_id or video_media_id is required|
|» video_media_id|body|integer| no ||Either source_video_id or video_media_id is required|
|» original_sound_switch|body|boolean| no ||Controls whether background music is played. Must be a boolean value.|
|» sound_effect_content|body|string| no ||Optional. If not provided, a random sound effect will be generated.|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Multi-agent (multi-reference) video generation

POST /openapi/v2/video/fusion/generate

> Body Parameters

```json
{
    "image_references": [
        {
            "type": "subject",
            "img_id": 0,
            "ref_name": "dog"
        },
        {
            "type": "background",
            "img_id": 0,
            "ref_name": "room"
        }
    ],
    "prompt": "@dog plays at @room",
    "model": "v5.6",
    "duration": 5,
    "quality": "720p",
    "aspect_ratio": "16:9",
    "seed": 123456789
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» image_references|body|[object]| yes ||Image reference array (1–3 items), containing a “subject” or “background”|
|»» type|body|string| no ||"subject" or "background"|
|»» img_id|body|integer| yes ||img_id comes from the image upload API|
|»» ref_name|body|string| no ||You can specify a name for the image to achieve more precise results. Only about 30 bytes of text (UTF-8).|
|» prompt|body|string| yes ||Use @ref_name to describe the scenario precisely|
|» model|body|string| yes ||"v4.5","v5","v5.5","v5.6",,"v6", "c1"|
|» duration|body|integer| yes ||Video generation duration|
|» quality|body|string| yes ||"360p","540p","720p","1080p"|
|» aspect_ratio|body|string| yes ||1. The basic version provides aspect ratios "16:9", "9.16", "4:3", "3:4", "1:1"|
|» generate_audio_switch|body|boolean| no ||Supports v5.6, v6, c1 / control switch Audio. true: Audio on, false: Audio off|
|» seed|body|integer| no ||none|

#### Description

**» image_references**: Image reference array (1–3 items), containing a “subject” or “background”
v4.5/v5: up to 3 images
v5.5/v5.6/v6: up to 7 images

**» prompt**: Use @ref_name to describe the scenario precisely
1.
@ref_name must be followed by a space, such as @cat plays
2.
The name referenced in the prompt must exactly match the ref_name in image_references

**» duration**: Video generation duration
v4.5: 5/8 (v3.5 1080p cannot use 8)
v5: 5/8
v5.5/5.6: 5/8/10 (1080p cannot use 10)

**» aspect_ratio**: 1. The basic version provides aspect ratios "16:9", "9.16", "4:3", "3:4", "1:1"
2. v6 and c1 additionally support "2:3", "3:2", "21:9"

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Redraw video generation video

POST /openapi/v2/video/restyle/generate

> Body Parameters

```json
{
    "source_video_id": 0,
    "restyle_id": 0,
    "seed": 0
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» source_video_id|body|integer| no ||Videos previously generated by the user with the Paimo API must include either source_video_id or video_media_id.|
|» video_media_id|body|integer| no ||For user-uploaded videos, either source_video_id or video_media_id is required.|
|» restyle_id|body|integer| no ||The ID obtained from the redraw effect list, restyle_id or restyle_prompt needs to be filled in.|
|» restyle_prompt|body|string| no ||Supports prompt replacement styles; either restyle_id or restyle_prompt must be provided|
|» seed|body|integer| no ||none|

#### Description

**» restyle_prompt**: Supports prompt replacement styles; either restyle_id or restyle_prompt must be provided
Within 5000 characters

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Body Replacement (Swap) Mask Generation

POST /openapi/v2/video/mask/selection

> Body Parameters

```json
{
    "source_video_id": 0,
    "keyframe_id": 1
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» video_media_id|body|integer| no ||For videos uploaded via the API, media_id is required; source_video_id or video_media_id must be provided|
|» source_video_id|body|integer| no ||For the video_id generated by the Paiwo API, source_video_id or video_media_id is required.|
|» keyframe_id|body|integer| no ||From 1 to the last video frame. If not provided, defaults to 1.|

#### Description

**» source_video_id**: For the video_id generated by the Paiwo API, source_video_id or video_media_id is required.
The encoding must be h.264/h.265

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Subject Replacement (Swap) Video Generation

POST /openapi/v2/video/swap/generate

> Body Parameters

```json
{
    "source_video_id": 0,
    "keyframe_id": 1,
    "mask_id": "0",
    "img_id": 0,
    "quality": "360p"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» video_media_id|body|integer| no ||For videos uploaded via the API, media_id is required; source_video_id or video_media_id must be provided|
|» source_video_id|body|integer| no ||For the video_id generated via the Paimai API, either source_video_id or video_media_id is required.|
|» keyframe_id|body|integer| yes ||From 1 to the last video frame. If not provided, defaults to 1.|
|» mask_id|body|string| yes ||none|
|» img_id|body|integer| yes ||none|
|» quality|body|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Multi-frame (Multi-transition) Video Generation

POST /openapi/v2/video/multi_transition/generate

> Body Parameters

```json
{
    "multi_transition": [
        {
            "img_id": 0,
            "duration": 3,
            "prompt": ""
        },
        {
            "img_id": 0,
            "duration": 3,
            "prompt": ""
        },
        {
            "img_id": 0,
            "duration": 3,
            "prompt": ""
        },
        {
            "img_id": 0,
            "duration": 3,
            "prompt": ""
        },
        {
            "img_id": 0,
            "duration": 0,
            "prompt": ""
        }
    ],
    "model": "v5",
    "quality": "360p",
    "motion_mode": "normal"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» multi_transition|body|[object]| yes ||1. multi_transition must be an array containing 2 to 7 elements. 2|
|»» img_id|body|integer| yes ||none|
|»» duration|body|integer| yes ||none|
|»» prompt|body|string| no ||none|
|» model|body|string| yes ||"v3.5","v4","v4.5","v5"|
|» quality|body|string| yes ||"360p","540p","720p","1080p"|

#### Description

**» multi_transition**: 1. multi_transition must be an array containing 2 to 7 elements. 2
. Each element in multi_transition should include: img_id (required, integer), duration (required, integer, optional for the last element), prompt (optional, string).

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Action Imitation (Mimic) Video Generation

POST /openapi/v2/video/mimic/generate

> Body Parameters

```json
{
    "video_media_id": 0,
    //"source_video_id":0,
    "img_id": 0,
    "quality": "360p"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» video_media_id|body|integer| no ||For videos uploaded via the API, media_id is required; source_video_id or video_media_id must be provided|
|» source_video_id|body|integer| no ||For the video_id generated via the Paimai API, either source_video_id or video_media_id is required.|
|» img_id|body|integer| yes ||img_id obtained after uploading the image|
|» quality|body|string| yes ||"360p","540p","720p","1080p"|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Video Editing (Modify) Generate Video

POST /openapi/v2/video/modify/generate

> Body Parameters

```json
{
    "video_media_id": 1234,
    "prompt": "@selection0 subject is swapped with @img0",
    "img_ids": [
        123
    ],
    "mask_ids": [
        "3847593904"
    ],
    "keyframe_ids": 1,
    "quality": "540p"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||none|
|API-KEY|header|string| yes ||none|
|body|body|object| yes ||none|
|» video_media_id|body|integer| no ||For videos uploaded via the API, media_id is required; source_video_id or video_media_id must be provided|
|» source_video_id|body|string| yes ||For videos generated by Paiwo AI, the video_id must include either source_video_id or video_media_id|
|» prompt|body|string| yes ||If a mask is used in the Prompt, use @selection0 and @selection1; if reference images are used, use @img0 and @img1|
|» img_ids|body|[integer]| no ||"img_id" obtained through the upload API supports up to 3 items|
|» mask_ids|body|[string]| no ||The mask_id obtained through the swap-mask interface supports up to 3.|
|» keyframe_ids|body|integer| no ||Specify which frame in the video to use for replacement (editing)|
|» quality|body|string| yes ||"360p","540p","720p"|

#### Description

**» prompt**: If a mask is used in the Prompt, use @selection0 and @selection1; if reference images are used, use @img0 and @img1
, supports 5000 characters

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Upload Image

POST /openapi/v2/image/upload

Image-to-video / both the first and last frames require uploading images first; generation is completed via img_id.
When generating, you need to pass the path of the image file.
Supported formats: "png", "webp", "jpeg", "jpg". Supported mime-types: "image/jpeg", "image/jpg", "image/png", "image/webp"
Maximum supported image size: within 10000px

> Body Parameters

```yaml
image: ""
image_url: ""

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» image|body|string(binary)| no ||Important: When uploading images, you must use form-data format with a local image file path. Uploading images via URL is not currently supported.|
|» image_url|body|string| no ||Supports URL uploads. Just provide image or image_url. Only the following formats/mime-types are supported: "image/jpeg", "image/jpg", "image/png", "image/webp"|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Upload resources (video/audio)

POST /openapi/v2/media/upload

1.
Supported mime/type & extensions below
"video/mp4": "mp4",
"video/mov": "mov",
"video/webm": "webm",
"video/quicktime": "mov"
"audio/mpeg": "mp3",
"audio/wav": "wav",
"audio/vnd.wave": "wav",
"audio/x-wav": "wav",
"audio/x-m4a": "m4a",
"audio/aac": "aac",
"audio/x-aac": "aac",
"audio/wave": "wav",
"audio/mp4": "mp3"
2.
Video file restrictions
Maximum resolution: 1920
Maximum file size: 50MB
Maximum duration: 30 seconds
3.
Audio file restrictions
Maximum file size: 50MB
Maximum duration: 30 seconds

> Body Parameters

```yaml
file: ""
file_url: ""

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» file|body|string(binary)| no ||file or file_url, choose one|
|» file_url|body|string| no ||Resources can be uploaded via URL. The following mime types / extensions are supported|

#### Description

**» file_url**: Resources can be uploaded via URL. The following mime types / extensions are supported
"video/mp4": "mp4", "video/mov": "mov", "video/webm": "webm", "video/quicktime": "mov"
"audio/mpeg": "mp3", "audio/wav": "wav", "audio/vnd.wave": "wav", "audio/x-wav": "wav", "audio/x-m4a": "m4a", "audio/aac": "aac", "audio/x-aac": "aac", "audio/wave": "wav", "audio/mp4": "mp3"

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST Image Template Generation API

POST /openapi/v2/image/template/generate

> Body Parameters

```json
{
    "img_ids": [
        0
    ],
    "template_id": 384631857552768
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|API-KEY|header|string| no ||none|
|body|body|object| yes ||none|
|» img_ids|body|[integer]| yes ||none|
|» template_id|body|integer| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Image Result Query API

GET /openapi/v2/image/result/{image_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|image_id|path|string| yes ||none|
|API-KEY|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Replicate Aggregation

## POST Create task black-forest-labs/flux-kontext-dev

POST /replicate/v1/models/black-forest-labs/flux-kontext-dev/predictions

Official documentation: https://replicate.com/black-forest-labs/flux-kontext-dev

> Body Parameters

```json
{
    "input": {
      "prompt": "Change the car color to red, turn the headlights on",
      "go_fast": true,
      "guidance": 2.5,
      "input_image": "https://replicate.delivery/pbxt/N5YURZv4ifaW2bMwU7hmrwzgtxf99DTQXpBeobLt1O7dEc3h/pexels-jmark-253096.jpg",
      "aspect_ratio": "match_input_image",
      "output_format": "jpg",
      "output_quality": 80,
      "num_inference_steps": 30
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||A text description of the content you want to generate, or instructions on how to edit a given image.|
|»» go_fast|body|boolean| no ||Makes the model run faster, but output quality may slightly decrease for more difficult prompts. Default value: true.|
|»» guidance|body|number| no ||Prompt guidance strength. Default value: 2.5. Minimum value: 0, Maximum value: 10|
|»» input_image|body|string| yes ||Image to be used as reference. Must be in jpeg, png, gif, or webp format.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Use "match_input_image" to match the aspect ratio of the input image. Default value: "match_input_image".|
|»» output_format|body|string| no ||Output image format. Default value: "webp".|
|»» output_quality|body|integer| no ||Quality when saving output images, ranging from 0 to 100. 100 is the best quality, 0 is the lowest quality. Not applicable to .png output. Default value: 80. Minimum value: 0, maximum value: 100.|
|»» num_inference_steps|body|integer| no ||Number of reasoning steps, default value: 28. Minimum value: 4, maximum value: 50.|

> Response Examples

> 200 Response

```json
{
    "id": "tpdf40dypdrma0cram394vvzkg",
    "model": "black-forest-labs/flux-kontext-dev",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "go_fast": true,
        "guidance": 2.5,
        "input_image": "https://replicate.delivery/pbxt/N5YURZv4ifaW2bMwU7hmrwzgtxf99DTQXpBeobLt1O7dEc3h/pexels-jmark-253096.jpg",
        "num_inference_steps": 30,
        "output_format": "jpg",
        "output_quality": 80,
        "prompt": "Change the car color to red, turn the headlights on"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-29T07:12:42.163Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/tpdf40dypdrma0cram394vvzkg/cancel",
        "get": "https://api.replicate.com/v1/predictions/tpdf40dypdrma0cram394vvzkg",
        "stream": "https://stream.replicate.com/v1/files/bcwr-6rywfvqq3376h7243k7xrgtnkaqpwiogzgh7kcehtx7kz3nre6fq",
        "web": "https://replicate.com/p/tpdf40dypdrma0cram394vvzkg"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|false|none||none|
|» model|string|false|none||none|
|» version|string|false|none||none|
|» input|object|false|none||none|
|»» aspect_ratio|string|false|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|false|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|false|none||none|
|»» safety_tolerance|integer|false|none||none|

## GET Query Task

GET /replicate/v1/predictions/{task_id}

Official documentation: https://replicate.com/black-forest-labs/flux-kontext-max

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Task ID|path|string| yes ||none|
|Authorization|header|string| no ||none|

> Response Examples

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

```json
{
    "id": "w44zs9cet5rmc0cqzp49gpkhf8",
    "logs": "Starting generate image\nUsing seed: 29889\nTotal safe images: 1 out of 1\ngenerate image took 3.53 seconds\n",
    "urls": {
        "get": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8",
        "web": "https://replicate.com/p/w44zs9cet5rmc0cqzp49gpkhf8",
        "cancel": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8/cancel",
        "stream": "https://stream.replicate.com/v1/files/bcwr-h7bu76ujftxzwih5u35puoysogps56mqvpvjz4nrxskhfe7ks42a"
    },
    "error": null,
    "input": {
        "prompt": "Make the letters 3D, floating in space on a city street",
        "input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
        "aspect_ratio": "match_input_image",
        "output_format": "jpg",
        "safety_tolerance": 2,
        "prompt_upsampling": false
    },
    "model": "black-forest-labs/flux-kontext-dev",
    "output": "https://replicate.delivery/xezq/FB7iNUmvHJ4NHFIMPea2hEoa4N4mTbwf3GBQjGzGQ4yeD4fTB/output.jpg",
    "status": "succeeded",
    "metrics": {
        "image_count": 1,
        "predict_time": 3.590520183
    },
    "version": "hidden",
    "created_at": "2025-07-12T07:27:54.577Z",
    "started_at": "2025-07-12T07:27:54.587120975Z",
    "completed_at": "2025-07-12T07:27:58.177641162Z",
    "data_removed": false
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» logs|string|true|none||none|
|» urls|object|true|none||none|
|»» get|string|true|none||none|
|»» web|string|true|none||none|
|»» cancel|string|true|none||none|
|»» stream|string|true|none||none|
|» error|null|true|none||none|
|» input|object|true|none||none|
|»» prompt|string|true|none||none|
|»» input_image|string|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» output_format|string|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|» model|string|true|none||none|
|» output|string|true|none||none|
|» status|string|true|none||none|
|» metrics|object|true|none||none|
|»» image_count|integer|true|none||none|
|»» predict_time|number|true|none||none|
|» version|string|true|none||none|
|» created_at|string|true|none||none|
|» started_at|string|true|none||none|
|» completed_at|string|true|none||none|
|» data_removed|boolean|true|none||none|

## POST Create task lucataco/remove-bg

POST /replicate/v1/predictions

Official documentation: https://replicate.com/lucataco/remove-bg

> Body Parameters

```json
{
    "version": "95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
    "input": {
      "image": "https://replicate.delivery/pbxt/JWsRA6DxCK24PlMYK5ENFYAFxJGUQTLr0JmLwsLb8uhv1JTU/shoe.jpg"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» version|body|string| no ||none|
|» input|body|object| no ||none|
|»» image|body|string| yes ||Remove the background from this image.|

> Response Examples

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

```json
{
    "id": "w44zs9cet5rmc0cqzp49gpkhf8",
    "model": "black-forest-labs/flux-kontext-dev",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
        "output_format": "jpg",
        "prompt": "Make the letters 3D, floating in space on a city street",
        "prompt_upsampling": false,
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-12T07:27:54.577Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8/cancel",
        "get": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8",
        "stream": "https://stream.replicate.com/v1/files/bcwr-h7bu76ujftxzwih5u35puoysogps56mqvpvjz4nrxskhfe7ks42a",
        "web": "https://replicate.com/p/w44zs9cet5rmc0cqzp49gpkhf8"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task ideogram-ai/ideogram-v2-turbo

POST /replicate/v1/models/ideogram-ai/ideogram-v2-turbo/predictions

Official documentation: https://replicate.com/ideogram-ai/ideogram-v2-turbo

> Body Parameters

```json
{
    "input": {
      "prompt": "An illustration of a gold running shoe with the text \"Run AI with an API\" written on the shoe. The shoe is placed on a pink background. The text is white and bold. The overall image has a modern and techy vibe, with elements of speed.",
      "resolution": "None",
      "style_type": "None",
      "aspect_ratio": "1:1",
      "magic_prompt_option": "Auto"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» resolution|body|string| no ||Resolution. Aspect ratio coverage. If a corrected image is specified, this parameter is ignored. Default value: "None".|
|»» style_type|body|string| no ||Style helps define the specific aesthetic you want for the generated image. Default value: "None".|
|»» aspect_ratio|body|string| no ||Aspect ratio. Ignored if resolution or image repair is specified. Default value: "1:1".|
|»» magic_prompt_option|body|string| no ||Magic Prompt will interpret your prompt and optimize it to maximize the diversity and quality of the generated images. You can also use it to write prompts in different languages. Default value: "Auto".|

> Response Examples

> 200 Response

```json
{
    "id": "2jycc2v9nnrmc0crap5tv5zaxr",
    "model": "ideogram-ai/ideogram-v2-turbo",
    "version": "hidden",
    "input": {
        "aspect_ratio": "1:1",
        "magic_prompt_option": "Auto",
        "prompt": "An illustration of a gold running shoe with the text \"Run AI with an API\" written on the shoe. The shoe is placed on a pink background. The text is white and bold. The overall image has a modern and techy vibe, with elements of speed.",
        "resolution": "None",
        "style_type": "None"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-29T09:37:36.685Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/2jycc2v9nnrmc0crap5tv5zaxr/cancel",
        "get": "https://api.replicate.com/v1/predictions/2jycc2v9nnrmc0crap5tv5zaxr",
        "stream": "https://stream.replicate.com/v1/files/bcwr-irvir7a5lzv2z6pja5hol5cy36lt5jekok743kcmbfu4gtvpv7vq",
        "web": "https://replicate.com/p/2jycc2v9nnrmc0crap5tv5zaxr"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task minimax/video-01-live

POST /replicate/v1/models/minimax/video-01-live/predictions

Official documentation: https://replicate.com/minimax/video-01-live

> Body Parameters

```json
{
    "input": {
      "prompt": "a man is talking angrily",
      "prompt_optimizer": true,
      "first_frame_image": "https://replicate.delivery/pbxt/M9jlcXgeaypBr2yQYGf9JXgxUCJWRt8ODUDvt90UWPUsQBXC/back-to-the-future.png"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Generate text prompt.|
|»» prompt_optimizer|body|boolean| no ||Use prompt optimizer. Default value: true|
|»» first_frame_image|body|string| yes ||Used to generate the first frame image of a video. The output video will have the same aspect ratio as this image.|

> Response Examples

> 200 Response

```json
{
    "id": "x18c1re8mxrma0crb3x8wbwqmg",
    "model": "minimax/video-01-live",
    "version": "hidden",
    "input": {
        "first_frame_image": "https://replicate.delivery/pbxt/M9jlcXgeaypBr2yQYGf9JXgxUCJWRt8ODUDvt90UWPUsQBXC/back-to-the-future.png",
        "prompt": "a man is talking angrily",
        "prompt_optimizer": true
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T01:38:07.143Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/x18c1re8mxrma0crb3x8wbwqmg/cancel",
        "get": "https://api.replicate.com/v1/predictions/x18c1re8mxrma0crb3x8wbwqmg",
        "stream": "https://stream.replicate.com/v1/files/bcwr-tfjtzspnxcjigf5eyyqqfkc3rrtv7ruou6yxzspuiy2cdzi7gizq",
        "web": "https://replicate.com/p/x18c1re8mxrma0crb3x8wbwqmg"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task minimax/video-01

POST /replicate/v1/models/minimax/video-01/predictions

Official documentation: https://replicate.com/minimax/video-01

> Body Parameters

```json
{
    "input": {
      "prompt": "a woman is walking through a busy Tokyo street at night, she is wearing dark sunglasses",
      "prompt_optimizer": true
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Generate text prompt.|
|»» prompt_optimizer|body|boolean| no ||Use prompt optimizer. Default value: true|

> Response Examples

> 200 Response

```json
{
    "id": "ree8dymk95rmc0crb3yt2pqhr4",
    "model": "minimax/video-01",
    "version": "hidden",
    "input": {
        "prompt": "a woman is walking through a busy Tokyo street at night, she is wearing dark sunglasses",
        "prompt_optimizer": true
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T01:41:10.089Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/ree8dymk95rmc0crb3yt2pqhr4/cancel",
        "get": "https://api.replicate.com/v1/predictions/ree8dymk95rmc0crb3yt2pqhr4",
        "stream": "https://stream.replicate.com/v1/files/bcwr-wykptlq2o5ws5ukylao2u654xfxv6aaaekgxijlr7aibzkftt7bq",
        "web": "https://replicate.com/p/ree8dymk95rmc0crb3yt2pqhr4"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_optimizer|boolean|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task recraft-ai/recraft-v3

POST /replicate/v1/models/recraft-ai/recraft-v3/predictions

Official documentation: https://replicate.com/recraft-ai/recraft-v3

> Body Parameters

```json
{
    "input": {
      "size": "1365x1024",
      "style": "any",
      "prompt": "a wildlife photography photo of a red panda using a laptop in a snowy forest",
      "aspect_ratio": "Not set"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» size|body|string| no ||The width and height of the generated image. If an aspect ratio is set, the dimensions are ignored. Default value: "1024x1024"|
|»» style|body|string| no ||The style of the generated image. Default value: "any"|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Default value: "Not set"|

> Response Examples

> 200 Response

```json
{
    "id": "w5k77rccg1rma0crb40tssh86g",
    "model": "recraft-ai/recraft-v3",
    "version": "hidden",
    "input": {
        "aspect_ratio": "Not set",
        "prompt": "a wildlife photography photo of a red panda using a laptop in a snowy forest",
        "size": "1365x1024",
        "style": "any"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T01:45:30.496Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/w5k77rccg1rma0crb40tssh86g/cancel",
        "get": "https://api.replicate.com/v1/predictions/w5k77rccg1rma0crb40tssh86g",
        "stream": "https://stream.replicate.com/v1/files/bcwr-otkjt5aiey7d63eore5rhoezsvrxwsc5q6ow2x5lpqh3l6x33hgq",
        "web": "https://replicate.com/p/w5k77rccg1rma0crb40tssh86g"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task recraft-ai/recraft-v3-svg

POST /replicate/v1/models/recraft-ai/recraft-v3-svg/predictions

Official documentation: https://replicate.com/recraft-ai/recraft-v3-svg

> Body Parameters

```json
{
    "input": {
      "size": "1024x1024",
      "style": "any",
      "prompt": "a portrait of a cute red panda using a laptop, the poster has the title \"Red panda is Recraft v3\", against a red background",
      "aspect_ratio": "Not set"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» size|body|string| no ||The width and height of the generated image. If an aspect ratio is set, the dimensions are ignored. Default value: "1024x1024"|
|»» style|body|string| no ||The style of the generated image. Default value: "any"|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Default value: "Not set"|

> Response Examples

> 200 Response

```json
{
    "id": "21r1gkwrzxrme0crb42tx4qrem",
    "model": "recraft-ai/recraft-v3-svg",
    "version": "hidden",
    "input": {
        "aspect_ratio": "Not set",
        "prompt": "a portrait of a cute red panda using a laptop, the poster has the title \"Red panda is Recraft v3\", against a red background",
        "size": "1024x1024",
        "style": "any"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T01:49:55.839Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/21r1gkwrzxrme0crb42tx4qrem/cancel",
        "get": "https://api.replicate.com/v1/predictions/21r1gkwrzxrme0crb42tx4qrem",
        "stream": "https://stream.replicate.com/v1/files/bcwr-7u7q63im74v2xjin5o7xj5prlfisac3m7ni22gh22jfejdfwi22q",
        "web": "https://replicate.com/p/21r1gkwrzxrme0crb42tx4qrem"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task black-forest-labs/flux-1.1-pro-ultra

POST /replicate/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions

Official documentation: https://replicate.com/black-forest-labs/flux-1.1-pro-ultra

> Body Parameters

```json
{
    "input": {
      "raw": false,
      "prompt": "a majestic snow-capped mountain peak bathed in a warm glow of the setting sun",
      "aspect_ratio": "3:2",
      "output_format": "jpg",
      "safety_tolerance": 2,
      "image_prompt_strength": 0.1
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» raw|body|boolean| no ||Generate images with lower processing levels and more natural appearance. Default value: false.|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image, default value: "1:1".|
|»» output_format|body|string| no ||The format of the output image. Default value: "jpg".|
|»» safety_tolerance|body|integer| no ||Security tolerance. 1 indicates the strictest, 6 indicates the most lenient. Default value: 2.|
|»» image_prompt_strength|body|number| no ||Blending between prompt and image prompt. Minimum: 0, Maximum: 1.|

> Response Examples

> 200 Response

```json
{
    "id": "brgfcps121rm80crajvr2x4jg4",
    "model": "black-forest-labs/flux-1.1-pro-ultra",
    "version": "hidden",
    "input": {
        "aspect_ratio": "3:2",
        "image_prompt_strength": 0.1,
        "output_format": "jpg",
        "prompt": "a majestic snow-capped mountain peak bathed in a warm glow of the setting sun",
        "raw": false,
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-29T05:45:44.464Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/brgfcps121rm80crajvr2x4jg4/cancel",
        "get": "https://api.replicate.com/v1/predictions/brgfcps121rm80crajvr2x4jg4",
        "stream": "https://stream.replicate.com/v1/files/bcwr-bx7iokgbhtcqohbyy7i5lnli25grd3mhcljqvwxliud4o7ov7mgq",
        "web": "https://replicate.com/p/brgfcps121rm80crajvr2x4jg4"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» input|object|true|none||none|
|»» aspect_ratio|string|false|none||none|
|»» image_prompt_strength|number|false|none||none|
|»» output_format|string|false|none||none|
|»» prompt|string|true|none||none|
|»» raw|boolean|false|none||none|
|»» safety_tolerance|integer|false|none||none|

## POST Create task black-forest-labs/flux-kontext-pro

POST /replicate/v1/models/black-forest-labs/flux-kontext-pro/predictions

Official documentation: https://replicate.com/black-forest-labs/flux-kontext-pro

> Body Parameters

```json
{
    "input": {
      "prompt": "Make this a 90s cartoon",
      "input_image": "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png",
      "aspect_ratio": "match_input_image",
      "output_format": "jpg",
      "safety_tolerance": 2,
      "prompt_upsampling": false
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||A text description of the content you want to generate, or instructions on how to edit a given image.|
|»» input_image|body|string| no ||Image to be used as reference. Must be in jpeg, png, gif, or webp format.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Use "match_input_image" to match the aspect ratio of the input image. Default value: "match_input_image". Supported values: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 4:5, 5:4, 21:9, 9:21, 2:1, 1:2.|
|»» output_format|body|string| no ||Output format for generated images. Default value: "png".|
|»» safety_tolerance|body|integer| no ||Security tolerance, 0 is the strictest, 6 is the most lenient. 2 is the maximum value currently allowed when using input images. Default value: 2|
|»» prompt_upsampling|body|boolean| no ||Auto-suggestion improvement. Default value: false.|

> Response Examples

```json
{
    "id": "b1qw7g8h9xrma0crakst3xbj8m",
    "model": "black-forest-labs/flux-kontext-pro",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "input_image": "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png",
        "output_format": "jpg",
        "prompt": "Make this a 90s cartoon",
        "prompt_upsampling": false,
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-29T06:51:12.591Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/b1qw7g8h9xrma0crakst3xbj8m/cancel",
        "get": "https://api.replicate.com/v1/predictions/b1qw7g8h9xrma0crakst3xbj8m",
        "stream": "https://stream.replicate.com/v1/files/bcwr-3g5lstbmjxzikqt225npeguwi4bu47ndhirdgete5npgzzzogkpq",
        "web": "https://replicate.com/p/b1qw7g8h9xrma0crakst3xbj8m"
    }
}
```

```json
{
    "id": "w44zs9cet5rmc0cqzp49gpkhf8",
    "model": "black-forest-labs/flux-kontext-dev",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
        "output_format": "jpg",
        "prompt": "Make the letters 3D, floating in space on a city street",
        "prompt_upsampling": false,
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-12T07:27:54.577Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8/cancel",
        "get": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8",
        "stream": "https://stream.replicate.com/v1/files/bcwr-h7bu76ujftxzwih5u35puoysogps56mqvpvjz4nrxskhfe7ks42a",
        "web": "https://replicate.com/p/w44zs9cet5rmc0cqzp49gpkhf8"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» input|object|true|none||none|
|»» aspect_ratio|string|false|none||none|
|»» input_image|string|false|none||none|
|»» output_format|string|false|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|false|none||none|
|»» safety_tolerance|integer|false|none||none|

## POST Create task black-forest-labs/flux-kontext-max

POST /replicate/v1/models/black-forest-labs/flux-kontext-max/predictions

Official documentation: https://replicate.com/black-forest-labs/flux-kontext-max

> Body Parameters

```json
{
    "input": {
      "prompt": "Make the letters 3D, floating in space on a city street",
      "input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
      "aspect_ratio": "match_input_image",
      "output_format": "jpg",
      "safety_tolerance": 2,
      "prompt_upsampling": false
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||A text description of the content you want to generate, or instructions on how to edit a given image.|
|»» input_image|body|string| no ||Image to be used as reference. Must be in jpeg, png, gif, or webp format.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Use "match_input_image" to match the aspect ratio of the input image. Default value: "match_input_image".|
|»» output_format|body|string| no ||Output format for generated images. Default value: "png".|
|»» safety_tolerance|body|integer| no ||Security tolerance, 0 is the strictest, 6 is the most lenient. 2 is the maximum value currently allowed when using input images. Default value: 2. Minimum value: 0, maximum value: 6.|
|»» prompt_upsampling|body|boolean| no ||Auto-suggestion improvement. Default value: false.|

> Response Examples

> 200 Response

```json
{
    "id": "5pcmjq6sfnrmc0cram79p95eg4",
    "model": "black-forest-labs/flux-kontext-max",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
        "output_format": "jpg",
        "prompt": "Make the letters 3D, floating in space on a city street",
        "prompt_upsampling": false,
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-29T07:21:33.309Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/5pcmjq6sfnrmc0cram79p95eg4/cancel",
        "get": "https://api.replicate.com/v1/predictions/5pcmjq6sfnrmc0cram79p95eg4",
        "stream": "https://stream.replicate.com/v1/files/bcwr-o4bl6hrud4sg7ceoi45imkh7lq32nbyqvnsyg736v7ghpxwqxheq",
        "web": "https://replicate.com/p/5pcmjq6sfnrmc0cram79p95eg4"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task flux-kontext-apps/multi-image-kontext-max

POST /replicate/v1/models/flux-kontext-apps/multi-image-kontext-max/predictions

Official documentation: https://replicate.com/flux-kontext-apps/multi-image-kontext-max

> Body Parameters

```json
{
    "input": {
      "prompt": "Put the woman into a white t-shirt with the text on it",
      "aspect_ratio": "1:1",
      "input_image_1": "https://replicate.delivery/pbxt/N5rSeJrCafWpmJuLb62moY8pSMEpSBBwSf7N6hxyIn4fNYMa/w8msa88d01rm80cq3hzsqrdehg.png",
      "input_image_2": "https://replicate.delivery/pbxt/N5rSdTCgBqIRvbkedcfLfS5xTSEEOqMtX9FsR1hLK9JYryml/0_1.webp",
      "output_format": "png",
      "safety_tolerance": 2
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Text description of how to combine or transform two input images.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Use "match_input_image" to match the aspect ratio of the input image. Default value: "match_input_image"|
|»» input_image_1|body|string| yes ||The first input image. Must be in jpeg, png, gif, or webp format.|
|»» input_image_2|body|string| yes ||The second input image. Must be in jpeg, png, gif, or webp format.|
|»» output_format|body|string| no ||Output format for generated images. Default value: "png".|
|»» safety_tolerance|body|integer| no ||Safety tolerance, 0 indicates the strictest, 2 indicates the most lenient. 2 is the maximum value currently allowed. Default value: 2|

> Response Examples

> 200 Response

```json
{
    "id": "b6k38vmb01rme0crb4bbr2apw4",
    "model": "flux-kontext-apps/multi-image-kontext-max",
    "version": "hidden",
    "input": {
        "aspect_ratio": "1:1",
        "input_image_1": "https://replicate.delivery/pbxt/N5rSeJrCafWpmJuLb62moY8pSMEpSBBwSf7N6hxyIn4fNYMa/w8msa88d01rm80cq3hzsqrdehg.png",
        "input_image_2": "https://replicate.delivery/pbxt/N5rSdTCgBqIRvbkedcfLfS5xTSEEOqMtX9FsR1hLK9JYryml/0_1.webp",
        "output_format": "png",
        "prompt": "Put the woman into a white t-shirt with the text on it",
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T02:08:26.368Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/b6k38vmb01rme0crb4bbr2apw4/cancel",
        "get": "https://api.replicate.com/v1/predictions/b6k38vmb01rme0crb4bbr2apw4",
        "stream": "https://stream.replicate.com/v1/files/bcwr-4lncowbqyyr5toyxguv6tr47ffpade3muguvemzik5let3hnlryq",
        "web": "https://replicate.com/p/b6k38vmb01rme0crb4bbr2apw4"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image_1|string|true|none||none|
|»» input_image_2|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task flux-kontext-apps/multi-image-kontext-pro

POST /replicate/v1/models/flux-kontext-apps/multi-image-kontext-pro/predictions

Official documentation: https://replicate.com/flux-kontext-apps/multi-image-kontext-pro

> Body Parameters

```json
{
    "input": {
      "prompt": "Put the woman next to the house",
      "aspect_ratio": "match_input_image",
      "input_image_1": "https://replicate.delivery/pbxt/N7gRAUNcVF6HarL0hdAQA2JYNMlJD52LP1wyaIWRUXWeHzqT/0_1-1.webp",
      "input_image_2": "https://replicate.delivery/pbxt/N7gRAK5kbPwdsbOpqgyAIOFQX45U6suTlbL6ws2N74SnGFpo/test.jpg",
      "output_format": "png",
      "safety_tolerance": 2
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Text description of how to combine or transform two input images.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Use "match_input_image" to match the aspect ratio of the input image. Default value: "match_input_image"|
|»» input_image_1|body|string| yes ||The first input image. Must be in jpeg, png, gif, or webp format.|
|»» input_image_2|body|string| yes ||The second input image. Must be in jpeg, png, gif, or webp format.|
|»» output_format|body|string| no ||Output format for generated images. Default value: "png".|
|»» safety_tolerance|body|integer| no ||Safety tolerance, where 0 represents the strictest and 2 represents the most lenient. 2 is the maximum value currently allowed. Default value: 2.|

> Response Examples

> 200 Response

```json
{
    "id": "26t3agjpx9rme0crb4es5cbxx4",
    "model": "flux-kontext-apps/multi-image-kontext-pro",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "input_image_1": "https://replicate.delivery/pbxt/N7gRAUNcVF6HarL0hdAQA2JYNMlJD52LP1wyaIWRUXWeHzqT/0_1-1.webp",
        "input_image_2": "https://replicate.delivery/pbxt/N7gRAK5kbPwdsbOpqgyAIOFQX45U6suTlbL6ws2N74SnGFpo/test.jpg",
        "output_format": "png",
        "prompt": "Put the woman next to the house",
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T02:15:51.786Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/26t3agjpx9rme0crb4es5cbxx4/cancel",
        "get": "https://api.replicate.com/v1/predictions/26t3agjpx9rme0crb4es5cbxx4",
        "stream": "https://stream.replicate.com/v1/files/bcwr-5cw3763ksezvhhtvt4n5ztxeywdagdmyes4uphs7ud3n65mftzba",
        "web": "https://replicate.com/p/26t3agjpx9rme0crb4es5cbxx4"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task riffusion/riffusion

POST /replicate/v1/models/riffusion/riffusion/predictions

Official documentation: https://replicate.com/riffusion/riffusion

> Body Parameters

```json
{
    "version": "8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
    "input": {
      "alpha": 0.5,
      "prompt_a": "funky synth solo",
      "prompt_b": "90's rap",
      "denoising": 0.75,
      "seed_image_id": "vibes",
      "num_inference_steps": 50
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» version|body|string| no ||none|
|» input|body|object| no ||none|
|»» alpha|body|number| no ||If two prompts are used, interpolate alpha. A value of 0 means using prompt_a entirely, and a value of 1 means using prompt_b entirely. Default value: 0.5. Minimum value: 0, maximum value: 1.|
|»» prompt_a|body|string| no ||Audio prompt.|
|»» prompt_b|body|string| no ||Interpolate the second prompt with the first prompt. Leave empty if interpolation is not performed.|
|»» denoising|body|number| no ||Number of transformations to apply to the input spectrogram. Default value: 0.75. Minimum value: 0, maximum value: 1.|
|»» seed_image_id|body|string| no ||none|
|»» num_inference_steps|body|integer| no ||Number of steps to run the diffusion model. Default value: 50. Minimum: 1.|

> Response Examples

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

```json
{
    "id": "w44zs9cet5rmc0cqzp49gpkhf8",
    "model": "black-forest-labs/flux-kontext-dev",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
        "output_format": "jpg",
        "prompt": "Make the letters 3D, floating in space on a city street",
        "prompt_upsampling": false,
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-12T07:27:54.577Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8/cancel",
        "get": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8",
        "stream": "https://stream.replicate.com/v1/files/bcwr-h7bu76ujftxzwih5u35puoysogps56mqvpvjz4nrxskhfe7ks42a",
        "web": "https://replicate.com/p/w44zs9cet5rmc0cqzp49gpkhf8"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task black-forest-labs/flux-fill-dev

POST /replicate/v1/models/black-forest-labs/flux-fill-dev/predictions

Official documentation: https://replicate.com/black-forest-labs/flux-fill-dev

> Body Parameters

```json
{
    "input": {
      "mask": "https://replicate.delivery/pbxt/M0hxLu8a1YBcybWuumSsfoEec8ooer6JZ2fR28vuM1U0CN9m/74b40bb1-364a-461a-bec5-200a38c7bc87.png",
      "image": "https://replicate.delivery/pbxt/M0hxMJeO7wFCMr7QYNZsjRxzHhz6ntlLllMteRQNsRD7f3Nf/flux-fill-dev.webp",
      "prompt": "a spaceship",
      "guidance": 30,
      "lora_scale": 1,
      "megapixels": "1",
      "num_outputs": 2,
      "output_format": "webp",
      "output_quality": 80,
      "num_inference_steps": 28
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» mask|body|string| no ||A black and white image used to describe the parts of the image that need to be repaired. Black areas will be preserved, and white areas will be repaired.|
|»» image|body|string| yes ||Image to be restored. May contain alpha mask. If the image width or height is not a multiple of 32, it will be scaled to the nearest multiple of 32. If the image dimensions exceed the 1440x1440 range, it will be downscaled to fit within 1440x1440 dimensions.|
|»» prompt|body|string| yes ||Prompt to generate image.|
|»» guidance|body|integer| no ||Guidance information for image generation. Default value: 30. Minimum value: 0, maximum value: 100.|
|»» lora_scale|body|integer| no ||Determine the applicable strength of the primary LoRA. For basic inference, reasonable results fall between 0 and 1. For go_fast, we apply a 1.5x multiplier to this value; typically, performance is good when the base value is scaled by this multiplier. You may still need to experiment to find the optimal value for your specific LoRA. Default value: 1. Minimum value: -1, Maximum value: 3.|
|»» megapixels|body|string| no ||Approximate number of pixels for the generated image. Use match_input to match the input size (maximum 1440x1440 pixels), default value: "1".|
|»» num_outputs|body|integer| no ||The number of outputs to generate. Default value: 1. Minimum value: 1, maximum value: 4.|
|»» output_format|body|string| no ||The format of the output image. Default value: "webp".|
|»» output_quality|body|integer| no ||Quality when saving the output image, ranging from 0 to 100. 100 is the best quality, 0 is the lowest quality. Not applicable to .png output. Default value: 80|
|»» num_inference_steps|body|integer| no ||Denoising steps. Recommended range: 28-50. Fewer steps result in lower output quality but faster speed. Default value: 28. Minimum value: 1, maximum value: 50.|

> Response Examples

> 200 Response

```json
{
    "id": "tv3jnp73n1rmc0crb54b3srz94",
    "model": "black-forest-labs/flux-fill-dev",
    "version": "hidden",
    "input": {
        "guidance": 30,
        "image": "https://replicate.delivery/pbxt/M0hxMJeO7wFCMr7QYNZsjRxzHhz6ntlLllMteRQNsRD7f3Nf/flux-fill-dev.webp",
        "lora_scale": 1,
        "mask": "https://replicate.delivery/pbxt/M0hxLu8a1YBcybWuumSsfoEec8ooer6JZ2fR28vuM1U0CN9m/74b40bb1-364a-461a-bec5-200a38c7bc87.png",
        "megapixels": "1",
        "num_inference_steps": 28,
        "num_outputs": 1,
        "output_format": "webp",
        "output_quality": 80,
        "prompt": "a spaceship"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T03:03:25.864Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/tv3jnp73n1rmc0crb54b3srz94/cancel",
        "get": "https://api.replicate.com/v1/predictions/tv3jnp73n1rmc0crb54b3srz94",
        "stream": "https://stream.replicate.com/v1/files/bcwr-epcf2nmmvkvxq7trerel6zuoiwzyoji3ifhkuu3lf7rtdzh3i6ca",
        "web": "https://replicate.com/p/tv3jnp73n1rmc0crb54b3srz94"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task black-forest-labs/flux-fill-pro

POST /replicate/v1/models/black-forest-labs/flux-fill-pro/predictions

Official documentation: https://replicate.com/black-forest-labs/flux-fill-pro

> Body Parameters

```json
{
    "input": {
      "mask": "https://replicate.delivery/pbxt/M0gpLCYdCLbnhcz95Poy66q30XW9VSCN65DoDQ8IzdzlQonw/kill-bill-mask.png",
      "image": "https://replicate.delivery/pbxt/M0gpKVE9wmEtOQFNDOpwz1uGs0u6nK2NcE85IihwlN0ZEnMF/kill-bill-poster.jpg",
      "steps": 50,
      "prompt": "movie poster says \"FLUX FILL\"",
      "guidance": 60,
      "outpaint": "None",
      "output_format": "jpg",
      "safety_tolerance": 2,
      "prompt_upsampling": false
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» mask|body|string| no ||A black and white image used to describe the parts of the image that need to be repaired. Black areas will be preserved, and white areas will be repaired. Must be the same size as the image. This parameter is optional if you have provided an alpha mask in the original image. Must be in jpeg, png, gif, or webp format.|
|»» image|body|string| yes ||Image to be repaired. Can contain an alpha mask. Must be in jpeg, png, gif, or webp format.|
|»» steps|body|integer| no ||Number of diffusion steps. Higher values result in finer details but longer processing time. Default value: 50. Minimum value: 15, maximum value: 50.|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» guidance|body|integer| no ||Controls the balance between adherence to text prompts and image quality/diversity. Higher values result in output that more closely follows the prompt, but may reduce overall image quality. Lower values provide greater creative freedom in the output, but may have lower relevance to the prompt. Default value: 60. Minimum value: 1.5, maximum value: 100.|
|»» outpaint|body|string| no ||Options for fast inpainting of the input image. The mask will be ignored. Default value: "None"|
|»» output_format|body|string| no ||The format of the output image. Default value: "jpg".|
|»» safety_tolerance|body|integer| no ||Security tolerance, 1 indicates the strictest, 6 indicates the most lenient. Default value: 2.|
|»» prompt_upsampling|body|boolean| no ||Auto-modify prompt to generate more creative results. Default value: false|

> Response Examples

> 200 Response

```json
{
    "id": "w72vtvbb79rmc0crb57tckqt24",
    "model": "black-forest-labs/flux-fill-pro",
    "version": "hidden",
    "input": {
        "guidance": 60,
        "image": "https://replicate.delivery/pbxt/M0gpKVE9wmEtOQFNDOpwz1uGs0u6nK2NcE85IihwlN0ZEnMF/kill-bill-poster.jpg",
        "mask": "https://replicate.delivery/pbxt/M0gpLCYdCLbnhcz95Poy66q30XW9VSCN65DoDQ8IzdzlQonw/kill-bill-mask.png",
        "outpaint": "None",
        "output_format": "jpg",
        "prompt": "movie poster says \"FLUX FILL\"",
        "prompt_upsampling": false,
        "safety_tolerance": 2,
        "steps": 50
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T03:10:33.786Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/w72vtvbb79rmc0crb57tckqt24/cancel",
        "get": "https://api.replicate.com/v1/predictions/w72vtvbb79rmc0crb57tckqt24",
        "stream": "https://stream.replicate.com/v1/files/bcwr-3y7tn6jo35hzo7xvk5kf2dslvdwmggf5zty5vnbfhq4tsggfhesa",
        "web": "https://replicate.com/p/w72vtvbb79rmc0crb57tckqt24"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task google/imagen-4-fast

POST /replicate/v1/models/google/imagen-4-fast/predictions

Official documentation: https://replicate.com/google/imagen-4-fast

> Body Parameters

```json
{
    "input": {
      "prompt": "The photo: Create a cinematic, photorealistic medium shot capturing the dynamic energy of a high-octane action film. The focus is a young woman with wind-swept dark hair streaked with pink highlights and determined features, looking directly and intently into the camera lens, she is slightly off-center. She wears a fitted pink and gold racing jacket over a black tank top with \"Imagen 4 Fast\" in motion-stylized lettering and on the next line \"on Replicate\" emblazoned across the chest and aviator sunglasses pushed up on her head. The lighting is dramatic with motion blur streaks and neon reflections from passing city lights, creating dynamic lens flares and light trails (they do not cover her face). The background shows a blurred urban nightscape with streaking car headlights and illuminated skyscrapers rushing past, rendered with heavy motion blur and shallow depth of field. High contrast lighting, vibrant neon color palette with deep blues and electric yellows, and razor-sharp focus on her intense eyes enhance the fast-paced, electrifying atmosphere. She is illuminated while the background is darker.",
      "aspect_ratio": "4:3",
      "output_format": "jpg",
      "safety_filter_level": "block_only_high"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Default value: "1:1".|
|»» output_format|body|string| no ||The format of the output image. Default value: "jpg".|
|»» safety_filter_level|body|string| no ||block_low_and_above is the most restrictive, block_medium_and_above will block some prompts, block_only_high is the most permissive, but some prompts will still be blocked. Default value: "block_only_high"|

> Response Examples

> 200 Response

```json
{
    "id": "20z778rke5rm80crb5982z0m1g",
    "model": "google/imagen-4-fast",
    "version": "hidden",
    "input": {
        "aspect_ratio": "4:3",
        "output_format": "jpg",
        "prompt": "The photo: Create a cinematic, photorealistic medium shot capturing the dynamic energy of a high-octane action film. The focus is a young woman with wind-swept dark hair streaked with pink highlights and determined features, looking directly and intently into the camera lens, she is slightly off-center. She wears a fitted pink and gold racing jacket over a black tank top with \"Imagen 4 Fast\" in motion-stylized lettering and on the next line \"on Replicate\" emblazoned across the chest and aviator sunglasses pushed up on her head. The lighting is dramatic with motion blur streaks and neon reflections from passing city lights, creating dynamic lens flares and light trails (they do not cover her face). The background shows a blurred urban nightscape with streaking car headlights and illuminated skyscrapers rushing past, rendered with heavy motion blur and shallow depth of field. High contrast lighting, vibrant neon color palette with deep blues and electric yellows, and razor-sharp focus on her intense eyes enhance the fast-paced, electrifying atmosphere. She is illuminated while the background is darker.",
        "safety_filter_level": "block_only_high"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T03:13:27.921Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/20z778rke5rm80crb5982z0m1g/cancel",
        "get": "https://api.replicate.com/v1/predictions/20z778rke5rm80crb5982z0m1g",
        "stream": "https://stream.replicate.com/v1/files/bcwr-blsi6mnoqvfndurpci2t2i77xl2s3k3xb5r5hru3xwyrev6v7uca",
        "web": "https://replicate.com/p/20z778rke5rm80crb5982z0m1g"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task google/imagen-4-ultra

POST /replicate/v1/models/google/imagen-4-ultra/predictions

Official documentation: https://replicate.com/google/imagen-4-ultra

> Body Parameters

```json
{
    "input": {
      "prompt": "The photo: Create a cinematic, photorealistic medium shot capturing the nostalgic warmth of a mid-2000s indie film. The focus is a young woman with a sleek, straight bob haircut in cool platinum white with freckled skin, looking directly and intently into the camera lens with a knowing smirk, her head is looking up slightly. She wears an oversized band t-shirt that says \"Imagen 4 Ultra on Replicate\" in huge stylized text over a long-sleeved striped top and simple silver stud earrings. The lighting is soft, golden hour sunlight creating lens flare and illuminating dust motes in the air. The background shows a blurred outdoor urban setting with graffiti-covered walls (the graffiti says \"ultra\" in stylized graffiti lettering), rendered with a shallow depth of field. Natural film grain, a warm, slightly muted color palette, and sharp focus on her expressive eyes enhance the intimate, authentic feel",
      "aspect_ratio": "16:9",
      "output_format": "jpg",
      "safety_filter_level": "block_only_high"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Default value: "1:1".|
|»» output_format|body|string| no ||The format of the output image. Default value: "jpg"|
|»» safety_filter_level|body|string| no ||block_low_and_above is the most restrictive, block_medium_and_above will block some prompts, block_only_high is the most permissive, but some prompts will still be blocked. Default value: "block_only_high"|

> Response Examples

> 200 Response

```json
{
    "id": "het8zf0rtnrm80crb5gaw4ecdw",
    "model": "google/imagen-4-ultra",
    "version": "hidden",
    "input": {
        "aspect_ratio": "16:9",
        "output_format": "jpg",
        "prompt": "The photo: Create a cinematic, photorealistic medium shot capturing the nostalgic warmth of a mid-2000s indie film. The focus is a young woman with a sleek, straight bob haircut in cool platinum white with freckled skin, looking directly and intently into the camera lens with a knowing smirk, her head is looking up slightly. She wears an oversized band t-shirt that says \"Imagen 4 Ultra on Replicate\" in huge stylized text over a long-sleeved striped top and simple silver stud earrings. The lighting is soft, golden hour sunlight creating lens flare and illuminating dust motes in the air. The background shows a blurred outdoor urban setting with graffiti-covered walls (the graffiti says \"ultra\" in stylized graffiti lettering), rendered with a shallow depth of field. Natural film grain, a warm, slightly muted color palette, and sharp focus on her expressive eyes enhance the intimate, authentic feel",
        "safety_filter_level": "block_only_high"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T03:28:46.805Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/het8zf0rtnrm80crb5gaw4ecdw/cancel",
        "get": "https://api.replicate.com/v1/predictions/het8zf0rtnrm80crb5gaw4ecdw",
        "stream": "https://stream.replicate.com/v1/files/bcwr-l5a4j53wjt36wq6hvdr5vt5zu2fuzpe3gfvygtciezllg7og3lpq",
        "web": "https://replicate.com/p/het8zf0rtnrm80crb5gaw4ecdw"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task google/imagen-4

POST /replicate/v1/models/google/imagen-4/predictions

Official documentation: https://replicate.com/google/imagen-4

> Body Parameters

```json
{
    "input": {
      "prompt": "The photo: Create a cinematic, photorealistic medium shot capturing the nostalgic warmth of a late 90s indie film. The focus is a young woman with brightly dyed pink-gold hair and freckled skin, looking directly and intently into the camera lens with a hopeful yet slightly uncertain smile, she is slightly off-center. She wears an oversized, vintage band t-shirt that says \"Replicate\" (slightly worn) over a long-sleeved striped top and simple silver stud earrings. The lighting is soft, golden hour sunlight streaming through a slightly dusty window, creating lens flare and illuminating dust motes in the air. The background shows a blurred, cluttered bedroom with posters on the wall and fairy lights, rendered with a shallow depth of field. Natural film grain, a warm, slightly muted color palette, and sharp focus on her expressive eyes enhance the intimate, authentic feel",
      "aspect_ratio": "16:9",
      "output_format": "jpg",
      "safety_filter_level": "block_medium_and_above"
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» input|body|object| no ||none|
|»» prompt|body|string| yes ||Text prompt for image generation.|
|»» aspect_ratio|body|string| no ||The aspect ratio of the generated image. Default value: "1:1". Supported: 1:1, 9:16, 16:9, 3:4, 4:3|
|»» output_format|body|string| no ||The format of the output image. Default value: "jpg".|
|»» safety_filter_level|body|string| no ||block_low_and_above is the most restrictive, block_medium_and_above will block some prompts, block_only_high is the most permissive, but some prompts will still be blocked. Default value: "block_only_high"|

> Response Examples

> 200 Response

```json
{
    "id": "yj1hjjc3c5rme0crb5jtqtxxmw",
    "model": "google/imagen-4",
    "version": "hidden",
    "input": {
        "aspect_ratio": "16:9",
        "output_format": "jpg",
        "prompt": "The photo: Create a cinematic, photorealistic medium shot capturing the nostalgic warmth of a late 90s indie film. The focus is a young woman with brightly dyed pink-gold hair and freckled skin, looking directly and intently into the camera lens with a hopeful yet slightly uncertain smile, she is slightly off-center. She wears an oversized, vintage band t-shirt that says \"Replicate\" (slightly worn) over a long-sleeved striped top and simple silver stud earrings. The lighting is soft, golden hour sunlight streaming through a slightly dusty window, creating lens flare and illuminating dust motes in the air. The background shows a blurred, cluttered bedroom with posters on the wall and fairy lights, rendered with a shallow depth of field. Natural film grain, a warm, slightly muted color palette, and sharp focus on her expressive eyes enhance the intimate, authentic feel",
        "safety_filter_level": "block_medium_and_above"
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-30T03:34:41.761Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/yj1hjjc3c5rme0crb5jtqtxxmw/cancel",
        "get": "https://api.replicate.com/v1/predictions/yj1hjjc3c5rme0crb5jtqtxxmw",
        "stream": "https://stream.replicate.com/v1/files/bcwr-wzn4sniemyumrzyhr364uivh625z7wk5w2qlbvbzqci3lgvzhwrq",
        "web": "https://replicate.com/p/yj1hjjc3c5rme0crb5jtqtxxmw"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» safety_filter_level|string|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task prunaai/vace-14b

POST /replicate/v1/models/prunaai/vace-14b/predictions

Official documentation: https://replicate.com/prunaai/vace-14b

> Body Parameters

```json
{
    "version": "51299232dc3d0946d5f5ed74935d85243e172698f747d291460db1e6ef3669fb",
    "input": {
      "seed": -1,
      "size": "1280*720",
      "prompt": "The video shows a man riding a horse on a vast grassland. He has long lavender hair and wears a traditional dress of a white top and black pants. The animation style makes him look like he is doing some kind of outdoor activity or performing. The background is a spectacular mountain range and cloud sky, giving a sense of tranquility and vastness. The entire video is shot from a fixed angle, focusing on the rider and his horse.",
      "src_mask": "https://replicate.delivery/pbxt/N323tegI7AuoZmg0U5CuTKa7VBFC4gymhe0kT8Jk3o2sjUUj/src_mask.mp4",
      "frame_num": 81,
      "src_video": "https://replicate.delivery/pbxt/N323u1ljtNYyyaLrgw0ZLmXgepvWlBvxbJWi3sAa2VDPuNus/src_video.mp4",
      "speed_mode": "Extra Juiced 🚀 (even more speed)",
      "sample_shift": 16,
      "sample_steps": 50,
      "sample_solver": "unipc",
      "src_ref_images": ["https://replicate.delivery/pbxt/N323t5X69JB1MPD4w4cDIxK4rm0BG0W2JOWBrDrR4O9HTcyp/src_ref_image_1.png"],
      "sample_guide_scale": 5
    }
  }
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|body|body|object| no ||none|
|» version|body|string| no ||none|
|» input|body|object| no ||none|
|»» seed|body|integer| no ||Random seed (-1 means random)|
|»» size|body|string| no ||Output resolution. Default value: "832*480"|
|»» prompt|body|string| yes ||Text description.|
|»» src_mask|body|string| no ||Input the mask video or image to be edited.|
|»» frame_num|body|integer| no ||The number of frames to generate. Default value: 81.|
|»» src_video|body|string| no ||Input the video to be edited.|
|»» speed_mode|body|string| no ||Speed optimization level. Default value: "Lightly Juiced 🍊 (more consistent)"|
|»» sample_shift|body|integer| no ||Sample offset. Default value: 16|
|»» sample_steps|body|integer| no ||Example steps. Default value: 50|
|»» sample_solver|body|string| no ||Example solver. Default value: "unipc"|
|»» src_ref_images|body|[string]| no ||Input reference image for editing.|
|»» sample_guide_scale|body|integer| no ||Sample guide scale. Default value: 5|

> Response Examples

```json
{
    "created": 1589478378,
    "data": [
        {
            "url": "https://..."
        },
        {
            "url": "https://..."
        }
    ]
}
```

```json
{
    "id": "w44zs9cet5rmc0cqzp49gpkhf8",
    "model": "black-forest-labs/flux-kontext-dev",
    "version": "hidden",
    "input": {
        "aspect_ratio": "match_input_image",
        "input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
        "output_format": "jpg",
        "prompt": "Make the letters 3D, floating in space on a city street",
        "prompt_upsampling": false,
        "safety_tolerance": 2
    },
    "logs": "",
    "output": null,
    "data_removed": false,
    "error": null,
    "status": "starting",
    "created_at": "2025-07-12T07:27:54.577Z",
    "urls": {
        "cancel": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8/cancel",
        "get": "https://api.replicate.com/v1/predictions/w44zs9cet5rmc0cqzp49gpkhf8",
        "stream": "https://stream.replicate.com/v1/files/bcwr-h7bu76ujftxzwih5u35puoysogps56mqvpvjz4nrxskhfe7ks42a",
        "web": "https://replicate.com/p/w44zs9cet5rmc0cqzp49gpkhf8"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» model|string|true|none||none|
|» version|string|true|none||none|
|» input|object|true|none||none|
|»» aspect_ratio|string|true|none||none|
|»» input_image|string|true|none||none|
|»» output_format|string|true|none||none|
|»» prompt|string|true|none||none|
|»» prompt_upsampling|boolean|true|none||none|
|»» safety_tolerance|integer|true|none||none|
|» logs|string|true|none||none|
|» output|null|true|none||none|
|» data_removed|boolean|true|none||none|
|» error|null|true|none||none|
|» status|string|true|none||none|
|» created_at|string|true|none||none|
|» urls|object|true|none||none|
|»» cancel|string|true|none||none|
|»» get|string|true|none||none|
|»» stream|string|true|none||none|
|»» web|string|true|none||none|

## POST Create task bytedance/seedream-4

POST /replicate/v1/models/bytedance/seedream-4/predictions

> Body Parameters

```json
{
    "input": {
        "size": "2K",
        "width": 2048,
        "height": 2048,
        "prompt": "a photo of a store front called i\"sedream 4\", it sells books, a poster in the window says i\"sedream 4 now on Replicate!\"",
        "max_images": 2,
        "image_input": [],
        "aspect_ratio": "4:3",
        "sequential_image_generation": "auto"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/MINIMAX

## POST First and Last Frame Video Generation

POST /minimax/v1/video_generation

> Body Parameters

```json
{
    "model": "MiniMax-Hailuo-02",
    "last_frame_image": "https://filecdn.minimax.chat/public/97b7cd08-764e-4b8b-a7bf-87a0bd898575.jpeg",
    "first_frame_image": "https://filecdn.minimax.chat/public/fe9d04da-f60e-444d-a2e0-18ae743add33.jpeg",
    "prompt": "A little girl grow up [Push Forward].",
    "duration": 6,
    "resolution": "1080P",
    "prompt_optimizer": true,
    "callback_url": "https://your-domain.com/api/video/callback",
    "aigc_watermark": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Model name. Only supports MiniMax-Hailuo-02 (Note: the first and last frame generation feature does not support 512P resolution)|
|» last_frame_image|body|string| yes ||End frame image of the video. Supports public network URLs or Base64-encoded Data URLs (data:image/jpeg;base64,...). Format: JPG/JPEG/PNG/WebP, size < 20MB, short side > 300px, aspect ratio between 2:5 and 5:2|
|» first_frame_image|body|string| yes ||The starting frame image of the video. Supports public network URLs or Base64-encoded Data URLs. Format requirements are the same as last_frame_image. ⚠️ The generated video dimensions follow the first frame image; when the first and last frame dimensions are inconsistent, the last frame will be cropped according to the first frame.|
|» prompt|body|string| yes ||Text description of the video, maximum 2000 characters.|
|» duration|body|integer| yes ||Video duration (seconds). Available values: 6 or 10 (10 seconds supports 768P only)|
|» resolution|body|string| yes ||Video resolution. Optional values: 768P (default, supports 6s/10s), 1080P (supports 6s only)|
|» prompt_optimizer|body|boolean| yes ||Whether to automatically optimize the prompt. Set to false for more precise control.|
|» callback_url|body|string| yes ||Callback URL for receiving task status update notifications. Once configured, you will receive asynchronous notifications when the task status changes.|
|» aigc_watermark|body|boolean| yes ||Whether to add an AIGC watermark to the generated video|

> Response Examples

> 200 Response

```json
{
  "task_id": "106916112212032",
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» base_resp|object|true|none||none|
|»» status_code|integer|true|none||none|
|»» status_msg|string|true|none||none|

## GET Query video generation task status

GET /minimax/v1/query/video_generation

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|query|string| no ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

<a id="opIdcreateAsyncTextToAudioTask"></a>

## POST Create Asynchronous Text-to-Speech Task V2

POST /minimax/v1/t2a_async_v2

https://platform.minimaxi.com/docs/api-reference/speech-t2a-async-create

> Body Parameters

```json
{
    "model": "speech-02-hd",
    "text": "The real danger is not that computers will begin to think like humans, but that humans will begin to think like computers.",
    "voice_setting": {
        "voice_id": "moss_audio_ce44fc67-7ce3-11f0-8de5-96e35d26fb85",
        "speed": 1,
        "vol": 1,
        "pitch": 0
    }
}
```

```json
{
    "model": "speech-2.8-hd",
    "text": "The real danger is not that computers start thinking like humans (sighs), but that humans start thinking like computers. Computers are just tools that can help us handle some simple tasks.",
    "language_boost": "auto",
    "voice_setting": {
        "voice_id": "audiobook_male_1",
        "speed": 1,
        "vol": 1,
        "pitch": 1,
        "emotion": "calm"
    },
    "pronunciation_dict": {
        "tone": [
            "dangerous/dangerous"
        ]
    },
    "audio_setting": {
        "audio_sample_rate": 32000,
        "bitrate": 128000,
        "format": "mp3",
        "channel": 2
    },
    "voice_modify": {
        "pitch": 0,
        "intensity": 0,
        "timbre": 0,
        "sound_effects": "spacious_echo"
    },
    "aigc_watermark": false
}
```

```json
{
    "model": "speech-2.8-hd",
    "text_file_id": 123456789,
    "language_boost": "Chinese",
    "voice_setting": {
        "voice_id": "audiobook_male_1",
        "speed": 1.2,
        "vol": 1.5,
        "pitch": 0
    },
    "pronunciation_dict": {
        "tone": [
            "grassland/(cao3)(di1)"
        ]
    },
    "audio_setting": {
        "audio_sample_rate": 44100,
        "bitrate": 256000,
        "format": "flac",
        "channel": 2
    }
}
```

```json
{
    "model": "speech-2.8-turbo",
    "text_file_id": 987654321,
    "voice_setting": {
        "voice_id": "English_Graceful_Lady",
        "speed": 1,
        "vol": 1
    },
    "audio_setting": {
        "format": "mp3",
        "bitrate": 128000
    }
}
```

```json
{
    "model": "speech-2.8-hd",
    "text": "This is a long piece of text content...",
    "voice_setting": {
        "voice_id": "Chinese (Mandarin)_Lyrical_Voice",
        "speed": 1
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||The media type of the request body must be set to application/json to ensure the request data is in JSON format|
|body|body|object| yes ||none|

#### Enum

|Name|Value|
|---|---|
|Content-Type|application/json|

> Response Examples

> Task created successfully, returning task ID and related information

```json
{
    "task_id": "95157322514444",
    "task_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "file_id": 95157322514444,
    "usage_characters": 101,
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
```

> Request parameter error

```json
{
    "base_resp": {
        "status_code": 2013,
        "status_msg": "Parameter error: one of text or text_file_id must be provided"
    }
}
```

> Authentication failed

```json
{
    "base_resp": {
        "status_code": 1004,
        "status_msg": "Authentication failed, please check if the API-Key is correct"
    }
}
```

> Trigger rate limiting

```json
{
    "base_resp": {
        "status_code": 1002,
        "status_msg": "Rate limit triggered, please try again later"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Task created successfully, returning task ID and related information|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Request parameter error|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Authentication failed|Inline|
|429|[Too Many Requests](https://tools.ietf.org/html/rfc6585#section-4)|Trigger rate limiting|Inline|

### Responses Data Schema

<a id="opIdtextToAudioV2"></a>

## POST Synchronous Text-to-Speech V2

POST /minimax/v1/t2a_v2

https://platform.minimaxi.com/docs/api-reference/speech-t2a-http

> Body Parameters

```json
{
    "model": "speech-02-hd",
    "text": "Hello, welcome to the text-to-speech service!",
    "voice_setting": {
        "voice_id": "moss_audio_ce44fc67-7ce3-11f0-8de5-96e35d26fb85"
    }
}
```

```json
{
    "model": "speech-2.8-hd",
    "text": "Are you very happy today (laughs), of course (breath)!",
    "stream": false,
    "voice_setting": {
        "voice_id": "male-qn-qingse",
        "speed": 1,
        "vol": 1,
        "pitch": 0,
        "emotion": "happy"
    },
    "pronunciation_dict": {
        "tone": [
            "processing/(chu3)(li3)",
            "danger/dangerous"
        ]
    },
    "audio_setting": {
        "sample_rate": 32000,
        "bitrate": 128000,
        "format": "mp3",
        "channel": 1
    },
    "subtitle_enable": false
}
```

```json
{
    "model": "speech-2.8-turbo",
    "text": "This is a relatively long piece of text. Using streaming output allows playback to begin while synthesis is still in progress, reducing wait time.",
    "stream": true,
    "stream_options": {
        "exclude_aggregated_audio": false
    },
    "voice_setting": {
        "voice_id": "English_Graceful_Lady",
        "speed": 1.2
    },
    "audio_setting": {
        "format": "mp3",
        "force_cbr": true
    }
}
```

```json
{
    "model": "speech-2.6-hd",
    "text": "This is an example of speech synthesis using a blended voice timbre.",
    "voice_setting": {
        "voice_id": "",
        "speed": 1,
        "vol": 1
    },
    "timber_weights": [
        {
            "voice_id": "female-chengshu",
            "weight": 30
        },
        {
            "voice_id": "female-tianmei",
            "weight": 70
        }
    ]
}
```

```json
{
    "model": "speech-2.6-hd",
    "text": "This is text-to-speech synthesis with sound effects.",
    "voice_setting": {
        "voice_id": "English_Persuasive_Man"
    },
    "voice_modify": {
        "pitch": 20,
        "intensity": -30,
        "timbre": 10,
        "sound_effects": "robotic"
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| yes ||The media type of the request body must be set to application/json to ensure the request data is in JSON format|
|body|body|object| yes ||none|

#### Enum

|Name|Value|
|---|---|
|Content-Type|application/json|

> Response Examples

> Successful response, returning synthesized audio data \(hex\-encoded or URL\) along with related statistics

```json
{
    "data": {
        "audio": "2f2f2f2f504b0304...",
        "status": 2
    },
    "extra_info": {
        "audio_length": 9900,
        "audio_sample_rate": 32000,
        "audio_size": 160323,
        "bitrate": 128000,
        "word_count": 52,
        "invisible_character_ratio": 0,
        "usage_characters": 26,
        "audio_format": "mp3",
        "audio_channel": 1
    },
    "trace_id": "01b8bf9bb7433cc75c18eee6cfa8fe21",
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
```

```json
{
    "data": {
        "audio": "2f2f2f2f504b0304...",
        "subtitle_file": "https://filecdn.minimax.chat/subtitle/subtitle_123.json",
        "status": 2
    },
    "extra_info": {
        "audio_length": 12000,
        "audio_sample_rate": 32000,
        "audio_size": 195000,
        "word_count": 68,
        "usage_characters": 68
    },
    "trace_id": "subtitle_example_123",
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
```

> Request parameter error

```json
{
    "base_resp": {
        "status_code": 2013,
        "status_msg": "Invalid input parameter: voice_id cannot be empty"
    }
}
```

> Authentication failed

```json
{
    "base_resp": {
        "status_code": 1004,
        "status_msg": "Authentication failed, please check if the API-Key is correct"
    }
}
```

> Trigger rate limiting

```json
{
    "base_resp": {
        "status_code": 1002,
        "status_msg": "Rate limit triggered, please try again later"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Successful response, returning synthesized audio data (hex-encoded or URL) along with related statistics|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Request parameter error|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Authentication failed|Inline|
|429|[Too Many Requests](https://tools.ietf.org/html/rfc6585#section-4)|Trigger rate limiting|Inline|

### Responses Data Schema

## POST Upload Sample Audio

POST /minimax/v1/files

The file to be uploaded. Enter the file path.

The files supported for upload must comply with the following requirements:

The format of the audio file to be uploaded must be: mp3, m4a, wav
The duration of the audio file to be uploaded must be less than 8s
The size of the audio file to be uploaded must not exceed 20 MB

> Body Parameters

```yaml
purpose: prompt_audio
file: ""

```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» purpose|body|string| yes ||prompt_audio|
|» file|body|string(binary)| yes ||Select audio file (mp3/m4a/wav)|

> Response Examples

> 200 Response

```json
{
    "file": {
        "file_id": "${file_id}",
        "bytes": 5896337,
        "created_at": 1700469398,
        "filename": "Cloned Audio",
        "purpose": "voice_clone"
    },
    "base_resp": {
        "status_code": 0,
        "status_msg": "success"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» file|object|true|none||none|
|»» file_id|string|true|none||none|
|»» bytes|integer|true|none||none|
|»» created_at|integer|true|none||none|
|»» filename|string|true|none||none|
|»» purpose|string|true|none||none|
|» base_resp|object|true|none||none|
|»» status_code|integer|true|none||none|
|»» status_msg|string|true|none||none|

## POST Timbre Quick Replication

POST /minimax/v1/voice_clone

https://platform.minimaxi.com/docs/api-reference/voice-cloning-clone
The uploaded audio file format must be: mp3, m4a, or wav format
The duration of the uploaded audio file must be at least 10 seconds and no longer than 5 minutes
The size of the uploaded audio file must not exceed 20 MB
If this parameter is used, both sub-properties (prompt_audio and prompt_text) are required fields

> Body Parameters

```json
{
  "file_id": 365182159339614,
  "voice_id": "MyCustomVoice003",
  "clone_prompt": {
    "prompt_audio": 987654321,
    "prompt_text": "This voice sounds natural and pleasant."
  },
  "text": "A gentle breeze sweeps across the soft grass(breath), carrying the fresh scent along with the songs of birds.",
  "model": "speech-2.8-hd",
  "language_boost": "English",
  "need_noise_reduction": true,
  "need_volume_normalization": true,
  "aigc_watermark": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» file_id|body|integer| yes ||The file_id of the audio to be cloned, obtained through the file upload interface. Audio requirements: mp3/m4a/wav format, 10 seconds to 5 minutes, less than 20MB|
|» voice_id|body|string| yes ||Custom voice ID (length 8-256, first character must be a letter, alphanumeric characters, hyphens, and underscores are allowed, last character cannot be a hyphen or underscore)|
|» clone_prompt|body|object| no ||Sample audio object, enhancing similarity and stability; obtained by uploading sample audio|
|»» prompt_audio|body|integer| yes ||none|
|»» prompt_text|body|string| yes ||none|
|» text|body|string| no ||Replica preview text (limited to 1000 characters, supports tone particle tags)|
|» model|body|string| no ||Speech models used for preview audio: speech-2.6-hd, speech-2.6-turbo, speech-02-hd, speech-02-turbo|
|» language_boost|body|string| no ||Enhance the recognition capability for a specified language/dialect. Can be set to auto for automatic detection, or specify a particular language.|
|» need_noise_reduction|body|boolean| no ||Whether to enable noise reduction|
|» need_volume_normalization|body|boolean| no ||Whether to enable volume normalization|
|» aigc_watermark|body|boolean| no ||Whether to add audio rhythm markers at the end of the trial audio|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Retrieval (for video download, asynchronous audio download)

GET /minimax/v1/files/retrieve

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|file_id|query|string| no ||The unique identifier of the file. Obtained through the file_id returned after successfully querying the video generation task status interface|

> Response Examples

> 200 Response

```json
{
  "file": {
    "file_id": "${file_id}",
    "bytes": 0,
    "created_at": 1700469398,
    "filename": "output_aigc.mp4",
    "purpose": "video_generation",
    "download_url": "www.downloadurl.com"
  },
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» file|object|true|none||none|
|»» file_id|string|true|none||none|
|»» bytes|integer|true|none||none|
|»» created_at|integer|true|none||none|
|»» filename|string|true|none||none|
|»» purpose|string|true|none||none|
|»» download_url|string|true|none||none|
|» base_resp|object|true|none||none|
|»» status_code|integer|true|none||none|
|»» status_msg|string|true|none||none|

## POST Text Synthesis

POST /v1/messages

https://platform.minimaxi.com/docs/api-reference/text-post

> Body Parameters

```json
{
    "model": "MiniMax-M2.1",
    "messages": [
        {
            "role": "system",
            "name": "AI Assistant",
            "content": "You are a professional, friendly AI assistant."
        },
        {
            "role": "user",
            "name": "Zhang San",
            "content": "Help me write a poem about autumn."
        }
    ],
    "stream": true,
    "max_completion_tokens": 2048,
    "temperature": 0.9,
    "top_p": 0.95,
    "stream_options": {
        "include_usage": true
    }
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||none|
|» messages|body|[object]| yes ||none|
|»» role|body|string| yes ||none|
|»» name|body|string| yes ||none|
|»» content|body|string| yes ||none|
|» stream|body|boolean| no ||none|
|» max_completion_tokens|body|integer| no ||none|
|» temperature|body|number| no ||none|
|» top_p|body|number| no ||none|
|» stream_options|body|object| no ||none|
|»» include_usage|body|boolean| yes ||none|

> Response Examples

> 200 Response

```json
{
    "id": "04ecb5d9b1921ae0fb0e8da9017a5474",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "Hello! How can I help you?",
                "role": "assistant",
                "name": "MiniMax AI",
                "audio_content": "",
                "reasoning_content": "...omitted"
            }
        }
    ],
    "created": 1755153113,
    "model": "MiniMax-M1",
    "object": "chat.completion",
    "usage": {
        "total_tokens": 249,
        "total_characters": 0,
        "prompt_tokens": 26,
        "completion_tokens": 223,
        "completion_tokens_details": {
            "reasoning_tokens": 214
        }
    },
    "input_sensitive": false,
    "output_sensitive": false,
    "input_sensitive_type": 0,
    "output_sensitive_type": 0,
    "output_sensitive_int": 0,
    "base_resp": {
        "status_code": 0,
        "status_msg": ""
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» id|string|true|none||none|
|» choices|[object]|true|none||none|
|»» finish_reason|string|false|none||none|
|»» index|integer|false|none||none|
|»» message|object|false|none||none|
|»»» content|string|true|none||none|
|»»» role|string|true|none||none|
|»»» name|string|true|none||none|
|»»» audio_content|string|true|none||none|
|»»» reasoning_content|string|true|none||none|
|» created|integer|true|none||none|
|» model|string|true|none||none|
|» object|string|true|none||none|
|» usage|object|true|none||none|
|»» total_tokens|integer|true|none||none|
|»» total_characters|integer|true|none||none|
|»» prompt_tokens|integer|true|none||none|
|»» completion_tokens|integer|true|none||none|
|»» completion_tokens_details|object|true|none||none|
|»»» reasoning_tokens|integer|true|none||none|
|» input_sensitive|boolean|true|none||none|
|» output_sensitive|boolean|true|none||none|
|» input_sensitive_type|integer|true|none||none|
|» output_sensitive_type|integer|true|none||none|
|» output_sensitive_int|integer|true|none||none|
|» base_resp|object|true|none||none|
|»» status_code|integer|true|none||none|
|»» status_msg|string|true|none||none|

## GET Query Speech Synthesis Task Status

GET /minimax/v1/query/t2a_async_query_v2

https://platform.minimaxi.com/docs/api-reference/speech-t2a-async-query

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|task_id|query|string| no ||none|

> Response Examples

> 200 Response

```json
{
  "task_id": 95157322514444,
  "status": "Processing",
  "file_id": 95157322514496,
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|integer|true|none||none|
|» status|string|true|none||none|
|» file_id|integer|true|none||none|
|» base_resp|object|true|none||none|
|»» status_code|integer|true|none||none|
|»» status_msg|string|true|none||none|

## POST Timbre Design

POST /minimax/v1/voice_design

> Body Parameters

```json
{
    "prompt": "A broadcaster narrating mystery stories, with a deep and magnetic voice.",
    "preview_text": "The night grew late, and he was alone in the old house. From outside the window came the faint, elusive sound of footsteps. He held his breath and slowly, ever so slowly, walked toward that creaking door……",
    "voice_id": "yssj00043333",
    "aigc_watermark": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Content-Type|header|string| no ||none|
|Authorization|header|string| no ||none|
|body|body|object| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/VIDU Multimedia

## POST Create a text-to-video task

POST /ent/v2/text2video

Official documentation: https://platform.vidu.cn/docs/text-to-video

> Body Parameters

```json
{
    "model": "viduq2",
    "prompt": "A cute little cat playing in the garden, with bright sunshine and a warm, heartwarming scene"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||Model Name|
|» style|body|string| no ||Style|
|» prompt|body|string| yes ||Text Prompt|
|» duration|body|number| no ||Video duration parameter, default value depends on the model:|
|» seed|body|string| no ||Random Seed|
|» aspect_ratio|body|string| no ||Aspect Ratio|
|» resolution|body|string| no ||Resolution parameter, default value depends on the model and video duration:|
|» movement_amplitude|body|string| no ||Motion Range|
|» bgm|body|string| no ||Whether to add background music to the generated video.|
|» payload|body|string| no ||Pass-through parameter|
|» watermark|body|string| no ||Whether to add a watermark|
|» wm_position|body|string| no ||Watermark position, indicating where the watermark appears on the image. Available options are:|
|» wm_url|body|string| no ||Watermark content, image URL goes here. When not provided, the default watermark is used: Content generated by AI|
|» meta_data|body|string| no ||Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:|
|» callback_url|body|string| no ||Callback Protocol|

#### Description

**» model**: Model Name
Valid values: viduq3-turbo, viduq3-pro, viduq2, viduq1
- viduq3-turbo: Faster generation speed compared to viduq3-pro
- viduq3-pro: Efficiently generates high-quality audiovisual content, making video content more vivid, expressive, and three-dimensional, with superior results
- viduq2: Latest model
- viduq1: High-resolution visuals, smooth transitions, and stable camera movement

**» style**: Style
Default: general. Optional values: general, anime
general: General style, which can be controlled through prompts
anime: Anime style, which only performs well in anime contexts and can be controlled through different anime style prompts
Note: This parameter does not take effect when using the q2 model

**» prompt**: Text Prompt
Text description for generating video.
Note: Character length cannot exceed 2000 characters

**» duration**: Video duration parameter, default value depends on the model:
- viduq3-pro, viduq3-turbo: default 5 seconds, optional range: 1–16
- viduq2: default 5 seconds, optional range: 1–10
- viduq1: default 5 seconds, optional range: 5

**» seed**: Random Seed
When the default is not passed or 0 is passed, a random number will be used instead.
When manually set, the configured seed will be used.

**» aspect_ratio**: Aspect Ratio
Default 16:9, optional values: 16:9, 9:16, 3:4, 4:3, 1:1
Note: 3:4 and 4:3 are only supported by the q2 model

**» resolution**: Resolution parameter, default value depends on the model and video duration:
- viduq3-pro, viduq3-turbo (1–16 seconds): default 720p, options: 540p, 720p, 1080p
- viduq2 (1–10 seconds): default 720p, options: 540p, 720p, 1080p
- viduq1 (5 seconds): default 1080p, options: 1080p

**» movement_amplitude**: Motion Range
Default: auto, optional values: auto, small, medium, large
Note: This parameter does not take effect when using the q2 model

**» bgm**: Whether to add background music to the generated video.
Default: false, optional values: true, false
When true is passed, the system will automatically select appropriate music from the preset BGM library and add it; if not passed or false, no BGM will be added.
- BGM has no duration limit; the system automatically adapts based on the video duration

**» payload**: Pass-through parameter
No processing performed, data transmission only
Note: Maximum 1048576 characters

**» watermark**: Whether to add a watermark
- true: add watermark;
- false: do not add watermark;
Note 1: Currently the watermark content is fixed, generated by AI, and not added by default
Note 2: You can query and retrieve watermarked video content through the watermarked_url parameter. For details, see the query task interface

**» wm_position**: Watermark position, indicating where the watermark appears on the image. Available options are:
1: Top-left
2: Top-right
3: Bottom-right
4: Bottom-left
Default: 3

**» meta_data**: Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:
{
"Label": "your_label","ContentProducer": "yourcontentproducer","ContentPropagator": "your_content_propagator","ProduceID": "yourproductid", "PropagateID": "your_propagate_id","ReservedCode1": "yourreservedcode1", "ReservedCode2": "your_reserved_code2"
}
When this parameter is empty, the metadata identifier generated by Vidu is used by default.

**» callback_url**: Callback Protocol

You need to actively set the callback_url when creating a task. The request method is POST. When the video generation task status changes, Vidu will send a callback request to this address containing the latest status of the task. The callback request content structure is consistent with the response body of the Query Task API.

The "status" returned in the callback includes the following states:
- processing: Task is processing
- success: Task completed (if sending fails, callback three times)
- failed: Task failed (if sending fails, callback three times)

Vidu uses a callback signature algorithm for authentication. For details, see: Callback Signature Algorithm

> Response Examples

> 200 Response

```json
{
    "task_id": "911026047460327424",
    "type": "text2video",
    "state": "created",
    "model": "viduq2",
    "style": "general",
    "prompt": "A cute little cat playing in a garden, with bright sunshine and a warm, heartwarming scene",
    "images": [],
    "duration": 5,
    "seed": 426802853,
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "movement_amplitude": "auto",
    "created_at": "2026-01-20T02:44:10.910316439Z",
    "credits": 35,
    "payload": "",
    "cus_priority": 0,
    "off_peak": false,
    "watermark": false,
    "is_rec": false,
    "wm_position": "unspecified",
    "wm_url": "",
    "meta_data": "",
    "client_request_id": ""
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» type|string|true|none||none|
|» state|string|true|none||none|
|» model|string|true|none||none|
|» style|string|true|none||none|
|» prompt|string|true|none||none|
|» images|[string]|true|none||none|
|» duration|integer|true|none||none|
|» seed|integer|true|none||none|
|» aspect_ratio|string|true|none||none|
|» resolution|string|true|none||none|
|» movement_amplitude|string|true|none||none|
|» created_at|string|true|none||none|
|» credits|integer|true|none||none|
|» payload|string|true|none||none|
|» cus_priority|integer|true|none||none|
|» off_peak|boolean|true|none||none|
|» watermark|boolean|true|none||none|
|» is_rec|boolean|true|none||none|
|» wm_position|string|true|none||none|
|» wm_url|string|true|none||none|
|» meta_data|string|true|none||none|
|» client_request_id|string|true|none||none|

## POST Create Image-to-Video Task

POST /ent/v2/img2video

Official Documentation: https://platform.vidu.cn/docs/image-to-video

> Body Parameters

```json
{
    "model": "viduq2-pro",
    "images": [
        "https://imageproxy.zhongzhuan.chat/api/proxy/image/6fb238cc01649cb7580fbb2dd58f3d6d.png"
    ],
    "prompt": "The camera slowly pushes in, revealing the details in the frame, with the background gradually blurring",
    "duration": 2,
    "resolution": "1080p",
    "aspect_ratio": "16:9",
    "seed": 12345,
    "movement_amplitude": "standard",
    "bgm": false,
    "audio": false,
    "off_peak": false,
    "watermark": false,
    // "payload": "custom-tracking-id-123",
    // "client_request_id": "unique-request-id-456"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||Model Name|
|» images|body|[string]| yes ||First Frame Image|
|» prompt|body|string| yes ||Text Prompt|
|» audio|body|string| no ||Whether to use direct audio-video output capability. Default value is `false`. Enumerated values are:|
|» voice_id|body|string| no ||Timbre ID|
|» is_rec|body|string| no ||Whether to use recommended prompts|
|» duration|body|number| no ||Video duration parameter, default value depends on the model:|
|» seed|body|string| no ||Random Seed|
|» resolution|body|string| no ||Resolution parameter, default value depends on the model and video duration:|
|» movement_amplitude|body|string| no ||Motion Range|
|» payload|body|string| no ||Pass-through parameter|
|» off_peak|body|string| no ||Off-peak mode, default value: false, optional values:|
|» watermark|body|string| no ||Whether to add a watermark|
|» wm_position|body|string| no ||Watermark position, indicating where the watermark appears on the image. Available options are:|
|» wm_url|body|string| no ||Watermark content, image URL goes here. When not provided, the default watermark is used: Content generated by AI|
|» meta_data|body|string| no ||Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:|
|» callback_url|body|string| no ||Callback Protocol|

#### Description

**» model**: Model Name
Optional values: viduq2, viduq1, viduq3-turbo, viduq3-pro
- viduq3-turbo: Faster generation speed compared to viduq3-pro
- viduq3-pro: Efficiently generates high-quality audio and video content, making video content more vivid, realistic, and three-dimensional with better results
- viduq2: Latest model
- viduq1: Clear visuals, smooth transitions, and stable camera movement

**» images**: First Frame Image
The model will generate a video using the image passed in this parameter as the first frame.

Note 1: Supports passing image Base64 encoding or image URL (ensure it is accessible);
Note 2: Only supports inputting 1 image;
Note 3: Image supports png, jpeg, jpg, webp formats;
Note 4: Image aspect ratio must be less than 1:4 or 4:1;
Note 5: Image size must not exceed 50 MB;
Note 6: Please note that the post body of the HTTP request must not exceed 20 MB, and the encoding must include an appropriate content type string, for example:

data:image/png;base64,{base64_encode}

**» prompt**: Text Prompt
Text description for generating video.
Note: Character length cannot exceed 2000 characters

**» audio**: Whether to use direct audio-video output capability. Default value is `false`. Enumerated values are:
- `false`: Direct audio-video output is not required; the output is a video with silent audio.
- `true`: Direct audio-video output is required; the output is a video containing dialogue and background music.

Note 1: This parameter takes effect only when set to `true` for the `voice_id` parameter.
Note 2: When the model is `q3-pro` or `q3-turbo`, the default value of this parameter is `true`.
Note 3: When this parameter is set to `true`, the off-peak mode is not supported.

**» voice_id**: Timbre ID
Used to determine the timbre of the voice in the video. When left empty, the system will automatically recommend one. For optional enumeration values, refer to the list: New Timbre List: https://shengshu.feishu.cn/sheets/EgFvs6DShhiEBStmjzccr5gonOg

**» is_rec**: Whether to use recommended prompts
- true: Yes, the system automatically recommends prompts and uses the prompt content to generate videos. The number of recommended prompts = 1
- false: No, generate videos based on the input prompt
Note: After enabling recommended prompts, each task consumes an additional 10 credits

**» duration**: Video duration parameter, default value depends on the model:
- viduq3-pro, viduq3-turbo: default 5, optional range: 1 - 16
- viduq2: default 5 seconds, optional range: 1-10
- viduq1: default 5 seconds, optional range: 5

**» seed**: Random Seed
When the default is not passed or 0 is passed, a random number will be used instead.
When manually set, the configured seed will be used.

**» resolution**: Resolution parameter, default value depends on the model and video duration:
- viduq3-pro, viduq3-turbo (1–16 seconds): default 720p, options: 540p, 720p, 1080p
- viduq2 (1–10 seconds): default 720p, options: 540p, 720p, 1080p
- viduq1 (5 seconds): default 1080p, options: 1080p

**» movement_amplitude**: Motion Range
Default: auto, optional values: auto, small, medium, large
Note: This parameter does not take effect when using the q2 model

**» payload**: Pass-through parameter
No processing performed, data transmission only
Note: Maximum 1048576 characters

**» off_peak**: Off-peak mode, default value: false, optional values:
- true: Generate video in off-peak mode;
- false: Generate video immediately;

Note 1: Off-peak mode consumes fewer credits. For specific details, please refer to the product pricing.
Note 2: Tasks submitted in off-peak mode will be generated within 48 hours. Tasks that fail to complete will be automatically canceled, and the credits for those tasks will be refunded.
Note 3: You can also manually cancel off-peak tasks.

**» watermark**: Whether to add a watermark
- true: add watermark;
- false: do not add watermark;
Note 1: Currently the watermark content is fixed, generated by AI, and not added by default
Note 2: You can query and retrieve watermarked video content through the watermarked_url parameter. For details, see the query task interface

**» wm_position**: Watermark position, indicating where the watermark appears on the image. Available options are:
1: Top-left
2: Top-right
3: Bottom-right
4: Bottom-left
Default: 3

**» meta_data**: Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:
{
"Label": "your_label","ContentProducer": "yourcontentproducer","ContentPropagator": "your_content_propagator","ProduceID": "yourproductid", "PropagateID": "your_propagate_id","ReservedCode1": "yourreservedcode1", "ReservedCode2": "your_reserved_code2"
}
When this parameter is empty, the metadata identifier generated by Vidu is used by default.

**» callback_url**: Callback Protocol

You need to actively set the callback_url when creating a task. The request method is POST. When the video generation task status changes, Vidu will send a callback request to this address containing the latest status of the task. The callback request content structure is consistent with the response body of the Query Task API.

The "status" returned in the callback includes the following states:
- processing: Task is processing
- success: Task completed (if sending fails, callback three times)
- failed: Task failed (if sending fails, callback three times)

Vidu uses a callback signature algorithm for authentication. For details, see: Callback Signature Algorithm

> Response Examples

> 200 Response

```json
{
    "task_id": "911045603801182208",
    "type": "img2video",
    "state": "created",
    "model": "viduq1",
    "style": "general",
    "prompt": "The camera slowly pushes in, revealing the details in the scene, with the background gradually blurring",
    "images": [
        "https://storage.xuanxu.net/images/1997560136907759618/1768223244152.png"
    ],
    "duration": 5,
    "seed": 12345,
    "aspect_ratio": "",
    "resolution": "1080p",
    "movement_amplitude": "auto",
    "created_at": "2026-01-20T04:01:53.504648743Z",
    "credits": 80,
    "payload": "custom-tracking-id-123",
    "cus_priority": 0,
    "off_peak": false,
    "watermark": false,
    "is_rec": false,
    "wm_position": "unspecified",
    "wm_url": "",
    "meta_data": "",
    "client_request_id": ""
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» type|string|true|none||none|
|» state|string|true|none||none|
|» model|string|true|none||none|
|» style|string|true|none||none|
|» prompt|string|true|none||none|
|» images|[string]|true|none||none|
|» duration|integer|true|none||none|
|» seed|integer|true|none||none|
|» aspect_ratio|string|true|none||none|
|» resolution|string|true|none||none|
|» movement_amplitude|string|true|none||none|
|» created_at|string|true|none||none|
|» credits|integer|true|none||none|
|» payload|string|true|none||none|
|» cus_priority|integer|true|none||none|
|» watermark|boolean|true|none||none|
|» is_rec|boolean|true|none||none|
|» wm_position|string|true|none||none|
|» wm_url|string|true|none||none|
|» meta_data|string|true|none||none|
|» client_request_id|string|true|none||none|

## POST Create Image Generation Task

POST /ent/v2/reference2image

Official documentation: https://platform.vidu.cn/docs/reference-to-image

> Body Parameters

```json
{
    "model": "viduq1",
    "prompt": "A cute little cat sitting on a windowsill, sunlight streaming down on it, a warm and heartwarming scene"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||Model Name|
|» images|body|[string]| no ||Image Reference|
|» prompt|body|string| yes ||Text Prompt|
|» seed|body|string| no ||Random seed parameter|
|» aspect_ratio|body|string| no ||Aspect ratio parameter, different models support different aspect ratios:|
|» resolution|body|string| no ||Resolution parameter. Different models support different resolutions:|
|» payload|body|string| no ||Pass-through parameter|
|» callback_url|body|string| no ||Callback Protocol|

#### Description

**» model**: Model Name
Optional values: viduq2, viduq1
viduq2: Supports text-to-image, image editing, and reference-based image generation
viduq1: Supports reference-based image generation

**» images**: Image Reference
viduq2: Supports input of 0–7 images
viduq1: Supports input of 1–7 images
The model will use the subject in the images passed in this parameter as a reference to generate videos consistent with the subject in the images.
Note 1: Supports passing image Base64 encoding or image URL (ensure accessibility)
Note 2: Images support png, jpeg, jpg, webp formats
Note 3: Image pixels cannot be smaller than 128*128, and the aspect ratio must be less than 1:4 or 4:1
Note 4: The size must not exceed 50M
Note 5: Please note that the HTTP request POST body must not exceed 20MB, and the encoding must include an appropriate content type string, for example:

data:image/png;base64,{base64_encode}

**» prompt**: Text Prompt
Text description for video generation, with a maximum length of 2000 characters
Note 1: The viduq2 model supports text-to-image generation. When using the viduq2 model and no images have been uploaded, the model will generate images using the text content of this parameter

**» seed**: Random seed parameter
When not passed by default or passed as 0, a random number will be used instead
When manually set, the configured seed will be used

**» aspect_ratio**: Aspect ratio parameter, different models support different aspect ratios:
viduq1: default value 16:9, optional values: 16:9, 9:16, 1:1, 3:4, 4:3
viduq2: default value 16:9, optional values as follows: 16:9, 9:16, 1:1, 3:4, 4:3, 21:9, 2:3, 3:2
- auto: indicates maintaining the same aspect ratio as the first input image

**» resolution**: Resolution parameter. Different models support different resolutions:
viduq1: Default 1080p, available options: 1080p
viduq2: Default 1080p, available options: 1080p, 2K, 4K

**» payload**: Pass-through parameter
No processing performed, data transmission only
Note: Maximum 1048576 characters

**» callback_url**: Callback Protocol

You need to actively set the callback_url when creating a task. The request method is POST. When the video generation task status changes, Vidu will send a callback request to this address containing the latest status of the task. The callback request content structure is consistent with the return body of the Query Task API.

The "status" returned in the callback includes the following states:
- processing: Task is processing
- success: Task completed (if sending fails, callback three times)
- failed: Task failed (if sending fails, callback three times)

Vidu uses a callback signature algorithm for authentication. For details, see: Callback Signature Algorithm

> Response Examples

> 200 Response

```json
{
    "task_id": "911092490931552256",
    "state": "created",
    "model": "viduq2",
    "prompt": "A cute little cat sitting on a windowsill, sunlight streaming down on it, a warm and heartwarming scene",
    "images": [],
    "seed": 616519648,
    "aspect_ratio": "auto",
    "callback_url": "",
    "payload": "",
    "cus_priority": 0,
    "credits": 6,
    "created_at": "2026-01-20T07:08:12.262592985Z",
    "watermark": false
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» state|string|true|none||none|
|» model|string|true|none||none|
|» prompt|string|true|none||none|
|» images|[string]|true|none||none|
|» seed|integer|true|none||none|
|» aspect_ratio|string|true|none||none|
|» callback_url|string|true|none||none|
|» payload|string|true|none||none|
|» cus_priority|integer|true|none||none|
|» credits|integer|true|none||none|
|» created_at|string|true|none||none|
|» watermark|boolean|true|none||none|

## POST Create Text-to-Speech Audio Task

POST /ent/v2/text2audio

Official documentation: https://platform.vidu.cn/docs/text-to-audio

> Body Parameters

```json
{
    "model": "audio1.0",
    "prompt": "The sound of raindrops falling on a window, accompanied by soft thunder",
    "duration": 5
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||Model name optional values: audio1.0|
|» prompt|body|string| yes ||Text prompts are used to generate descriptions for audio. The character length cannot exceed 1500 characters.|
|» duration|body|string| no ||Audio duration defaults to 10, optional range: 2–10 seconds|
|» seed|body|string| no ||Random seed: if not provided or set to 0, a random number is automatically generated; if a fixed value is provided, a deterministic result is generated|
|» callback_url|body|string| no ||Callback Protocol|

#### Description

**» callback_url**: Callback Protocol

You need to actively set the callback_url when creating a task. The request method is POST. When the video generation task status changes, Vidu will send a callback request to this address containing the latest status of the task. The callback request content structure is consistent with the return body of the Query Task API.

The "status" returned in the callback includes the following states:
- processing: Task is processing
- success: Task completed (if sending fails, callback three times)
- failed: Task failed (if sending fails, callback three times)

Vidu uses a callback signature algorithm for authentication. For details, see: Callback Signature Algorithm

> Response Examples

> 200 Response

```json
{
    "task_id": "911094612548939776",
    "state": "created",
    "model": "audio1.0",
    "prompt": "The sound of raindrops falling on a window, accompanied by gentle thunder",
    "duration": 5,
    "seed": 0,
    "created_at": "2026-01-20T07:16:38.094635957Z",
    "credits": 10
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» state|string|true|none||none|
|» model|string|true|none||none|
|» prompt|string|true|none||none|
|» duration|integer|true|none||none|
|» seed|integer|true|none||none|
|» created_at|string|true|none||none|
|» credits|integer|true|none||none|

## POST Speech Synthesis

POST /ent/v2/audio-tts

Official documentation: https://platform.vidu.cn/docs/text-to-speech

> Body Parameters

```json
{
    "text": "Artificial intelligence is changing the way we live, from smart homes to autonomous driving — technological advancements are making the world increasingly convenient.",
    "voice_setting_voice_id": "male-qn-daxuesheng"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» text|body|string| yes ||Text to be synthesized into speech|
|» voice_setting_voice_id|body|string| yes ||Timbre ID for synthesized audio|
|» voice_setting_speed|body|string| no ||Speech rate, default is 1.0|
|» voice_setting_volume|body|string| no ||Volume Size|
|» voice_setting_pitch|body|string| no ||Pitch of synthesized audio|
|» voice_setting_emotion|body|string| no ||Control the emotion of synthesized speech|
|» pronunciation_dict_tone|body|string| no ||Define Polyphonic Character Pronunciation|
|» payload|body|string| no ||Pass-through parameter|

#### Description

**» text**: Text to be synthesized into speech
1. Length limit: less than 10,000 characters
2. Paragraph switching is marked with line breaks
3. Pause control: supports custom time intervals between text to achieve the effect of custom speech pause duration.
- Usage: add <#x#> markers in the text, where x is the pause duration (unit: seconds), range [0.01, 99.99], with a maximum of two decimal places. The text interval time should be set between two texts that can be spoken, and multiple pause markers cannot be used consecutively
- Example: Hello<#2#>I am vidu<#2#>Nice to meet you

**» voice_setting_voice_id**: Timbre ID for synthesized audio
You can view the timbre list to query all available timbres: https://shengshu.feishu.cn/sheets/EgFvs6DShhiEBStmjzccr5gonOg

**» voice_setting_speed**: Speech rate, default is 1.0
1.0 is normal speech rate, range [0.5, 2]. When the value is 0.5, the speech rate is slowest; when the value is 2, the speech rate is fastest.

**» voice_setting_volume**: Volume Size
Range 0 - 10, default is 0, representing normal volume, the larger the value the higher the volume

**» voice_setting_pitch**: Pitch of synthesized audio
Range [-12, 12], default 0, where 0 is the original timbre output

**» voice_setting_emotion**: Control the emotion of synthesized speech
1. Parameter range ["happy", "sad", "angry", "fearful", "disgusted", "surprised", "calm"], corresponding to 7 emotions respectively: happy, sad, angry, fearful, disgusted, surprised, neutral
2. The model will automatically match the appropriate emotion based on the input text, and manual specification is generally not required

**» pronunciation_dict_tone**: Define Polyphonic Character Pronunciation
- Define annotation or pronunciation replacement rules for text or symbols that require special marking. For polyphonic character scenarios, in Chinese text, tones are represented by numbers: first tone is 1; second tone is 2; third tone is 3; fourth tone is 4; neutral tone is 5.
- Examples are as follows:
["yan4 shao3 fei1/(yan4)(shao3)(fei1)", "da2 fei1/(da2)(fei1)", "omg/oh my god"]

**» payload**: Pass-through parameter
No processing performed, data transmission only
Note: Maximum 1048576 characters

> Response Examples

> 200 Response

```json
{
    "task_id": "911094612548939776",
    "state": "created",
    "model": "audio1.0",
    "prompt": "The sound of raindrops falling on a window, accompanied by gentle thunder",
    "duration": 5,
    "seed": 0,
    "created_at": "2026-01-20T07:16:38.094635957Z",
    "credits": 10
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» state|string|true|none||none|
|» model|string|true|none||none|
|» prompt|string|true|none||none|
|» duration|integer|true|none||none|
|» seed|integer|true|none||none|
|» created_at|string|true|none||none|
|» credits|integer|true|none||none|

## POST Create reference video generation task (non-main invocation)

POST /ent/v2/reference2video

Official documentation: https://platform.vidu.cn/docs/reference-to-video

> Body Parameters

```json
{
    "model": "viduq3-mix",
    "images": [
        "https://picx.zhimg.com/v2-4911df093b40ee5511938a1ac2a5cdc4_r.jpg"
    ],
    "prompt": "A cute cat running on the grass, sunny day, warm scene"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||Model name options: viduq3-mix, viduq3, viduq2-pro, viduq2, viduq1, vidu2.0|
|» images|body|[string]| no ||Image reference supports multiple images; the model will use the subjects in the uploaded images as references to generate videos with consistent subjects. Different model versions support different numbers of reference images, with specific requirements as follows:|
|» videos|body|[string]| no ||Video reference supports uploading 1–2 videos. The model uses the videos passed in via this parameter as references to generate videos with consistent subjects.|
|» sounds|body|[string]| no ||Audio reference supports uploading 1 to 7 audio files. The model will use the audio provided in these parameters as a reference to generate videos with consistent subjects.|
|» prompt|body|string| yes ||Text prompt for generating video descriptions.|
|» bgm|body|string| no ||Whether to add background music to the generated video. Default: false; valid values: true, false|
|» audio|body|string| no ||Whether to use the direct audio-video output capability. Default is `true`. Enumeration values are:|
|» duration|body|number| no ||Video duration parameter, default value depends on the model:|
|» seed|body|number| no ||Random Seed|
|» aspect_ratio|body|string| no ||Aspect ratio parameters. Models q2 and q3 support any aspect ratio or auto. Default is 16:9. Available options are as follows: 1:1, 9:16, 16:9, 3:4, 4:3.|
|» resolution|body|string| no ||Resolution parameters, with default values depending on the model and video duration:|
|» movement_amplitude|body|string| no ||Motion amplitude|
|» payload|body|string| no ||Pass-through parameter|
|» watermark|body|string| no ||Whether to add a watermark|
|» wm_position|body|string| no ||Watermark position, indicating where the watermark appears on the image. Available options are:|
|» wm_url|body|string| no ||Watermark content, image URL goes here. When not provided, the default watermark is used: Content generated by AI|
|» meta_data|body|string| no ||Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:|
|» callback_url|body|string| no ||Callback Protocol|

#### Description

**» model**: Model name options: viduq3-mix, viduq3, viduq2-pro, viduq2, viduq1, vidu2.0
- viduq3-mix: Strong visual texture, supports intelligent shot transitions, supports synchronized audio and video output, excellent dynamic effects, strongest overall balance
- viduq3: Supports intelligent shot transitions, supports synchronized audio and video output, superior multi-camera consistency
- viduq2-pro: Supports reference videos, supports video editing, supports video replacement
- viduq2: Excellent dynamic effects, rich generation details
- viduq1: Clear visuals, smooth transitions, stable camera movement
- vidu2.0: Fast generation speed

**» images**: Image reference supports multiple images; the model will use the subjects in the uploaded images as references to generate videos with consistent subjects. Different model versions support different numbers of reference images, with specific requirements as follows:

Note 1: The viduq3, viduq2, viduq1, and vidu2.0 series models support uploading 1–7 images.
Note 2: When using the viduq2-pro model, if no video is uploaded, 1–7 images are supported; if a video is uploaded, 1–4 images are supported.
Note 3: Images can be provided as Base64-encoded strings or image URLs (ensure they are accessible).
Note 4: Supported image formats include PNG, JPEG, JPG, and WebP.
Note 5: Image resolution must not be less than 128×128 pixels, and the aspect ratio must be between 1:4 and 4:1.
Note 6: Please note that the HTTP POST request body must not exceed 20MB, and the encoding must include an appropriate Content-Type header, for example:
`data:image/png;base64,{base64_encode}`

**» videos**: Video reference supports uploading 1–2 videos. The model uses the videos passed in via this parameter as references to generate videos with consistent subjects.
Note 1: Only the viduq2-pro model supports this parameter.
Note 2: When using video reference, you may upload at most one 8-second video or two 5-second videos.
Note 3: Supported video formats are MP4, AVI, and MOV.
Note 4: Video resolution must be no smaller than 128×128 pixels; aspect ratio must be less than 1:4 or greater than 4:1; and file size must not exceed 100 MB.
Note 5: Note that the byte length after Base64 decoding must be less than 20 MB, and the Base64-encoded string must include a proper content-type prefix, e.g.: data:video/mp4;base64,{base64_encode}

**» sounds**: Audio reference supports uploading 1 to 7 audio files. The model will use the audio provided in these parameters as a reference to generate videos with consistent subjects.
Note 1: When using the audio reference feature, up to 7 audio files can be uploaded, with each audio file having a maximum duration of 20 seconds.
Note 2: Audio files must be in MP3 format.
Note 3: Each audio file size must not exceed 50 MB.
Note 4: Please note that the byte length after base64 decoding must be less than 20 MB, and the encoding must include an appropriate content type string, for example:
data:video/mp3;base64,{base64_encode}
Note: This is currently not supported; this parameter is reserved for future use only.

**» prompt**: Text prompt for generating video descriptions.
Note: Character length must not exceed 5000 characters.

**» bgm**: Whether to add background music to the generated video. Default: false; valid values: true, false
- When true, the system automatically selects and adds an appropriate track from the preset BGM library; when omitted or set to false, no BGM is added.
- BGM duration is unrestricted—the system automatically adapts the selected track to match the video’s duration.
- This parameter has no effect when using q2-series models with a duration of 9 or 10 seconds.
- This parameter has no effect in q3-series models.

**» audio**: Whether to use the direct audio-video output capability. Default is `true`. Enumeration values are:
- `false`: Audio-video direct output is not required; output a video with static audio.
- `true`: Audio-video synchronization is required; output a video containing both sound (including dialogue and sound effects).
Note: When called by non-subjects, only the q3 model supports this parameter.

**» duration**: Video duration parameter, default value depends on the model:
- viduq3-mix: default 5 seconds, range 1–16
- viduq3: default 5 seconds, range 3–16
- viduq2-pro, viduq2: default 5 seconds, range 1–10
- viduq1: default 5 seconds, range 5
- vidu2.0: default 4 seconds, range 4

**» seed**: Random Seed
When the default is not passed or 0 is passed, a random number will be used instead.
When manually set, the configured seed will be used.

**» aspect_ratio**: Aspect ratio parameters. Models q2 and q3 support any aspect ratio or auto. Default is 16:9. Available options are as follows: 1:1, 9:16, 16:9, 3:4, 4:3.
auto: Automatically recommend based on the input image or video.

**» resolution**: Resolution parameters, with default values depending on the model and video duration:
viduq3-mix (1-16 seconds): Default 720p, Options: 720p, 1080p
viduq3 (3-16 seconds): Default 720p, Options: 540p, 720p, 1080p
viduq2-pro, viduq2 (1-10 seconds): Default 720p, Options: 540p, 720p, 1080p
viduq1 (5 seconds): Default 1080p, Options: 1080p
vidu2.0 (4 seconds): Default 360p, Options: 360p, 720p

**» movement_amplitude**: Motion amplitude
Default: auto. Valid values: auto, small, medium, large.
Note: This parameter is not supported by q2 and q3 series models.

**» payload**: Pass-through parameter
No processing performed, data transmission only
Note: Maximum 1048576 characters

**» watermark**: Whether to add a watermark
- true: add watermark;
- false: do not add watermark;
Note 1: Currently the watermark content is fixed, generated by AI, and not added by default
Note 2: You can query and retrieve watermarked video content through the watermarked_url parameter. For details, see the query task interface

**» wm_position**: Watermark position, indicating where the watermark appears on the image. Available options are:
1: Top-left
2: Top-right
3: Bottom-right
4: Bottom-left
Default: 3

**» meta_data**: Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:
{
"Label": "your_label","ContentProducer": "yourcontentproducer","ContentPropagator": "your_content_propagator","ProduceID": "yourproductid", "PropagateID": "your_propagate_id","ReservedCode1": "yourreservedcode1", "ReservedCode2": "your_reserved_code2"
}
When this parameter is empty, the metadata identifier generated by Vidu is used by default.

**» callback_url**: Callback Protocol

You need to actively set the callback_url when creating a task. The request method is POST. When the video generation task status changes, Vidu will send a callback request to this address containing the latest status of the task. The callback request content structure is consistent with the response body of the Query Task API.

The "status" returned in the callback includes the following states:
- processing: Task is processing
- success: Task completed (if sending fails, callback three times)
- failed: Task failed (if sending fails, callback three times)

Vidu uses a callback signature algorithm for authentication. For details, see: Callback Signature Algorithm

> Response Examples

> 200 Response

```json
{
    "task_id": "911084878697623552",
    "type": "character2video",
    "state": "created",
    "model": "viduq2",
    "style": "general",
    "prompt": "A cute @cat running on the grass, sunny weather, warm and heartwarming scene",
    "images": [
        "https://picx.zhimg.com/v2-4911df093b40ee5511938a1ac2a5cdc4_r.jpg"
    ],
    "duration": 5,
    "seed": 1830691647,
    "aspect_ratio": "16:9",
    "resolution": "720p",
    "movement_amplitude": "auto",
    "created_at": "2026-01-20T06:37:57.371761937Z",
    "credits": 45,
    "payload": "",
    "cus_priority": 0,
    "off_peak": false,
    "watermark": false,
    "is_rec": false,
    "wm_position": "unspecified",
    "wm_url": "",
    "meta_data": "",
    "client_request_id": ""
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» type|string|true|none||none|
|» state|string|true|none||none|
|» model|string|true|none||none|
|» style|string|true|none||none|
|» prompt|string|true|none||none|
|» images|[string]|true|none||none|
|» duration|integer|true|none||none|
|» seed|integer|true|none||none|
|» aspect_ratio|string|true|none||none|
|» resolution|string|true|none||none|
|» movement_amplitude|string|true|none||none|
|» created_at|string|true|none||none|
|» credits|integer|true|none||none|
|» payload|string|true|none||none|
|» cus_priority|integer|true|none||none|
|» off_peak|boolean|true|none||none|
|» watermark|boolean|true|none||none|
|» is_rec|boolean|true|none||none|
|» wm_position|string|true|none||none|
|» wm_url|string|true|none||none|
|» meta_data|string|true|none||none|
|» client_request_id|string|true|none||none|

## POST Create First and Last Frame Generated Video Task

POST /ent/v2/start-end2video

Official documentation: https://platform.vidu.cn/docs/start-end-to-video

> Body Parameters

```json
{
    "task_id": "911088422699962368",
    "type": "headtailimg2video",
    "state": "created",
    "model": "viduq1",
    "style": "general",
    "prompt": "A little girl picking mushrooms goes up the mountain to pick mushrooms and encounters mushrooms larger than herself.",
    "images": [
        "https://storage.xuanxu.net/images/1997560136907759618/1768223244152.png",
        "https://storage.xuanxu.net/images/1997560136907759618/1768223372503.png"
    ],
    "duration": 5,
    "seed": 722073967,
    "aspect_ratio": "",
    "resolution": "1080p",
    "movement_amplitude": "auto",
    "created_at": "2026-01-20T06:52:02.323137590Z",
    "credits": 80,
    "payload": "",
    "cus_priority": 0,
    "off_peak": false,
    "watermark": false,
    "is_rec": false,
    "wm_position": 1,
    "wm_url": "",
    "meta_data": "",
    "client_request_id": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| no ||none|
|Content-Type|header|string| no ||none|
|body|body|object| no ||none|
|» model|body|string| yes ||Model name|
|» images|body|[object]| yes ||Image|
|» prompt|body|string| yes ||Text Prompt|
|» is_rec|body|string| no ||Whether to use recommended prompts|
|» duration|body|integer| no ||Video duration parameter, default value depends on the model:|
|» seed|body|string| no ||Random Seed|
|» resolution|body|string| no ||Resolution parameter, default value depends on the model and video duration:|
|» movement_amplitude|body|string| no ||Resolution parameter, default value depends on the model and video duration:|
|» bgm|body|string| no ||Whether to add background music to the generated video.|
|» payload|body|string| no ||Pass-through parameter|
|» watermark|body|string| no ||Whether to add a watermark|
|» wm_position|body|integer| no ||Watermark position, indicating where the watermark appears on the image. Available options are:|
|» wm_url|body|string| no ||Watermark content, image URL goes here. When not provided, the default watermark is used: Content generated by AI|
|» meta_data|body|string| no ||Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:|
|» callback_url|body|string| no ||Callback Protocol|

#### Description

**» model**: Model name
Allowed values: viduq1, viduq3-turbo, viduq3-pro
- viduq3-turbo: Generates content faster than viduq3-pro
- viduq3-pro: Efficiently generates high-quality audio and video content, making videos more vivid, expressive, and immersive, with better results
- viduq1: Clear visuals, smooth transitions, and stable camera movements

**» images**: Image
Supports input of two images. The first uploaded image is treated as the first frame, and the second image is treated as the last frame. The model will generate a video based on the images passed in this parameter.

Note 1: The resolution of the two input images (first and last frames) should be similar. The ratio of the first frame resolution to the last frame resolution should be between 0.8 and 1.25. Additionally, the image aspect ratio must be less than 1:4 or 4:1.
Note 2: Supports passing images as Base64 encoding or image URLs (ensure accessibility).
Note 3: Images support png, jpeg, jpg, webp formats.
Note 4: Image size must not exceed 50M.
Note 5: Please note that the HTTP request POST body must not exceed 20MB, and the encoding must include an appropriate content-type string, for example:

data:image/png;base64,{base64_encode}

**» prompt**: Text Prompt
Text description for generating video.
Note: Character length cannot exceed 2000 characters

**» is_rec**: Whether to use recommended prompts
- true: Yes, the system automatically recommends prompts and uses the prompt content to generate videos. The number of recommended prompts = 1
- false: No, generate videos based on the input prompt
Note: After enabling recommended prompts, each task consumes an additional 10 credits

**» duration**: Video duration parameter, default value depends on the model:
- viduq3-pro, viduq3-turbo: default 5, optional range: 1 - 16
- viduq2: default 5 seconds, optional range: 1-10
- viduq1: default 5 seconds, optional range: 5

**» seed**: Random Seed
When the default is not passed or 0 is passed, a random number will be used instead.
When manually set, the configured seed will be used.

**» resolution**: Resolution parameter, default value depends on the model and video duration:
- viduq3-pro, viduq3-turbo1 (1-16 seconds): Default 720p, Options: 540p, 720p, 1080p
- viduq2-pro-fast (1-8 seconds): Default 720p, Options: 720p, 1080p
- viduq2-pro (1-8 seconds): Default 720p, Options: 540p, 720p, 1080p
- viduq2-turbo (1-8 seconds): Default 720p, Options: 540p, 720p, 1080p
- viduq1 and viduq1-classic (5 seconds): Default 1080p, Options: 1080p
- vidu2.0 (4 seconds): Default 360p, Options: 360p, 720p, 1080p
- vidu2.0 (8 seconds): Default 720p, Options: 720p

**» movement_amplitude**: Resolution parameter, default value depends on the model and video duration:
viduq2 (1-10 seconds): default 720p, optional: 540p, 720p, 1080p
viduq1 (5 seconds): default 1080p, optional: 1080p
vidu2.0 (4 seconds): default 360p, optional: 360p, 720p

**» bgm**: Whether to add background music to the generated video.
Default: false, optional values: true, false
- When set to true, the system will automatically select and add appropriate music from the preset BGM library; if not passed or set to false, no BGM will be added.
- BGM duration is not limited; the system automatically adapts based on the video duration.

**» payload**: Pass-through parameter
No processing performed, data transmission only
Note: Maximum 1048576 characters

**» watermark**: Whether to add a watermark
- true: add watermark;
- false: do not add watermark;
Note 1: Currently the watermark content is fixed, generated by AI, and not added by default
Note 2: You can query and retrieve watermarked video content through the watermarked_url parameter. For details, see the query task interface

**» wm_position**: Watermark position, indicating where the watermark appears on the image. Available options are:
1: Top-left
2: Top-right
3: Bottom-right
4: Bottom-left
Default: 3

**» meta_data**: Metadata identifier, a JSON-format string, pass-through field. You can use a custom format or the example format. Example:
{
"Label": "your_label","ContentProducer": "yourcontentproducer","ContentPropagator": "your_content_propagator","ProduceID": "yourproductid", "PropagateID": "your_propagate_id","ReservedCode1": "yourreservedcode1", "ReservedCode2": "your_reserved_code2"
}
When this parameter is empty, the metadata identifier generated by Vidu is used by default.

**» callback_url**: Callback Protocol

You need to actively set the callback_url when creating a task. The request method is POST. When the video generation task status changes, Vidu will send a callback request to this address containing the latest status of the task. The callback request content structure is consistent with the response body of the Query Task API.

The "status" returned in the callback includes the following states:
- processing: Task is processing
- success: Task completed (if sending fails, callback three times)
- failed: Task failed (if sending fails, callback three times)

Vidu uses a callback signature algorithm for authentication. For details, see: Callback Signature Algorithm

> Response Examples

> 200 Response

```json
{
    "task_id": "911088422699962368",
    "type": "headtailimg2video",
    "state": "created",
    "model": "viduq1",
    "style": "general",
    "prompt": "A little girl picking mushrooms goes up the mountain to gather mushrooms and encounters a mushroom even bigger than herself",
    "images": [
        "https://storage.xuanxu.net/images/1997560136907759618/1768223244152.png",
        "https://storage.xuanxu.net/images/1997560136907759618/1768223372503.png"
    ],
    "duration": 5,
    "seed": 722073967,
    "aspect_ratio": "",
    "resolution": "1080p",
    "movement_amplitude": "auto",
    "created_at": "2026-01-20T06:52:02.323137590Z",
    "credits": 80,
    "payload": "",
    "cus_priority": 0,
    "off_peak": false,
    "watermark": false,
    "is_rec": false,
    "wm_position": "unspecified",
    "wm_url": "",
    "meta_data": "",
    "client_request_id": ""
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» task_id|string|true|none||none|
|» type|string|true|none||none|
|» state|string|true|none||none|
|» model|string|true|none||none|
|» style|string|true|none||none|
|» prompt|string|true|none||none|
|» images|[string]|true|none||none|
|» duration|integer|true|none||none|
|» seed|integer|true|none||none|
|» aspect_ratio|string|true|none||none|
|» resolution|string|true|none||none|
|» movement_amplitude|string|true|none||none|
|» created_at|string|true|none||none|
|» credits|integer|true|none||none|
|» payload|string|true|none||none|
|» cus_priority|integer|true|none||none|
|» off_peak|boolean|true|none||none|
|» watermark|boolean|true|none||none|
|» is_rec|boolean|true|none||none|
|» wm_position|string|true|none||none|
|» wm_url|string|true|none||none|
|» meta_data|string|true|none||none|
|» client_request_id|string|true|none||none|

## GET Get request result

GET /ent/v2/tasks/{id}/creations

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||none|
|Authorization|header|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "Response": {
        "Status": "FINISH",
        "TaskType": "AigcImageTask",
        "RequestId": "12082802-fe37-410e-ae20-0cf14e91e018",
        "CreateTime": "2025-12-29T12:03:30Z",
        "FinishTime": "2025-12-29T12:03:43Z",
        "AigcImageTask": {
            "Input": {
                "Prompt": "pig",
                "ModelName": "GEM",
                "ModelVersion": "2.5",
                "OutputConfig": {
                    "StorageMode": "Temporary"
                },
                "EnhancePrompt": "Enabled",
                "NegativePrompt": "blur, distorted"
            },
            "Output": {
                "FileInfos": [
                    {
                        "FileUrl": "http://251000800.vod2.myqcloud.com/1a168d62vodcq251000800/ef0aa3215145403710877804273/aigcImageGenFile.png",
                        "ExpireTime": "2026-01-05T12:03:57Z",
                        "StorageMode": "Temporary"
                    }
                ]
            },
            "Status": "FINISH",
            "TaskId": "1392336703-AigcImageTask-47965947a83db42af4b1e3a74c243531t",
            "Progress": 100
        },
        "BeginProcessTime": "2025-12-29T12:03:30Z"
    }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Fal-ai Aggregation

## GET Get request result

GET /fal-ai/{model_name}/requests/{request_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|model_name|path|string| yes ||Model name, auto — our system will automatically determine model_name|
|request_id|path|string| yes ||Task ID|

> Response Examples

> 200 Response

```json
{
    "seed": 2841475369,
    "images": [
        {
            "url": "https://fal.media/files/tiger/BwdOcvXOx0UmkCyCMZGmZ_1ee10db761e146a28fdaadafa528d239.jpg",
            "width": 1024,
            "height": 1024,
            "content_type": "image/jpeg"
        }
    ],
    "prompt": "Put the little duckling on top of the woman's t-shirt.",
    "request": {
        "prompt": "Put the little duckling on top of the woman's t-shirt.",
        "image_urls": [
            "https://v3.fal.media/files/penguin/XoW0qavfF-ahg-jX4BMyL_image.webp",
            "https://v3.fal.media/files/tiger/bml6YA7DWJXOigadvxk75_image.webp"
        ],
        "num_images": 1,
        "output_format": "jpeg",
        "guidance_scale": 3.5,
        "safety_tolerance": "2"
    },
    "timings": {},
    "has_nsfw_concepts": [
        false
    ]
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-1/dev

POST /fal-ai/flux-1/dev

Official documentation: https://fal.ai/models/fal-ai/flux-1/dev

> Body Parameters

```json
{
  "prompt": "Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture.",
  "image_size": "landscape_4_3",
  "num_inference_steps": 28,
  "guidance_scale": 3.5,
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "jpeg",
  "acceleration": "regular"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||none|
|» image_size|body|string| no ||The size of the generated image. Default value: landscape_4_3 Range (3:4, 4:3, 16:9, 9:16)|
|» num_inference_steps|body|integer| no ||Number of inference steps to execute. Default value: 28. Range: 0-50|
|» guidance_scale|body|number| no ||CFG (Classifier-Free Guidance) scale measures how closely you want the model to adhere to the prompt when searching for relevant images. Default value: 3.5. Range: 1-20|
|» num_images|body|integer| no ||Number of generated images. Default value: 1  Range: 1-4|
|» enable_safety_checker|body|boolean| no ||If set to true, enables the security checker. Default value: true|
|» output_format|body|string| no ||The format of the generated image. Default value: "jpeg". Supported formats: default, JPEG, png|
|» acceleration|body|string| no ||Generation speed. The higher the speed, the faster the generation. Default value: "regular". Supported values: default, none, regular, high|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "3892f1e8-5fb1-469f-87b0-696d6054c9f2",
    "response_url": "https://queue.fal.run/fal-ai/flux-1/requests/3892f1e8-5fb1-469f-87b0-696d6054c9f2",
    "status_url": "https://queue.fal.run/fal-ai/flux-1/requests/3892f1e8-5fb1-469f-87b0-696d6054c9f2/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-1/requests/3892f1e8-5fb1-469f-87b0-696d6054c9f2/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» request_id|string|true|none||none|
|» response_url|string|true|none||none|
|» status_url|string|true|none||none|
|» cancel_url|string|true|none||none|
|» logs|null|true|none||none|
|» metrics|object|true|none||none|
|» queue_position|integer|true|none||none|

## POST /fal-ai/flux-1/dev/image-to-image

POST /fal-ai/flux-1/dev/image-to-image

Official documentation: https://fal.ai/models/fal-ai/flux-1/dev/image-to-image

> Body Parameters

```json
{
  "image_url": "https://fal.media/files/koala/Chls9L2ZnvuipUTEwlnJC.png",
  "strength": 0.95,
  "num_inference_steps": 40,
  "prompt": "A cat dressed as a wizard with a background of a mystic forest.",
  "guidance_scale": 3.5,
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "jpeg",
  "acceleration": "regular"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» image_url|body|string| yes ||Drag and drop files here, or provide base64 encoded data URL. Accepted file types: jpg, jpeg, png, webp, gif, avif|
|» strength|body|number| no ||Initial image intensity. The higher the intensity value, the better the model performs. Default value: 0.95  Range: 0.01-1|
|» num_inference_steps|body|integer| no ||Number of reasoning steps to execute. Default value: 40   Range: 10-50|
|» prompt|body|string| yes ||Prompt for Generating Images|
|» guidance_scale|body|number| no ||CFG (Classifier-Free Guidance) scale is used to measure how closely you want the model to adhere to the prompt when searching for relevant images. Default value: 3.5  Range: 1-20|
|» num_images|body|integer| no ||Number of images generated. Default value: 1   Range: 1-4|
|» enable_safety_checker|body|boolean| no ||none|
|» output_format|body|string| no ||The format of the generated image. Default value: "jpeg". Supported formats: default, png, jpeg|
|» acceleration|body|string| no ||Generation speed. The higher the speed, the faster the generation. Default value: "regular"  Supports default, none, regular, high|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-1/dev/redux

POST /fal-ai/flux-1/dev/redux

Official documentation: https://fal.ai/models/fal-ai/flux-1/dev/redux

> Body Parameters

```json
{
  "image_url": "https://fal.media/files/kangaroo/acQvq-Kmo2lajkgvcEHdv.png",
  "image_size": "landscape_4_3",
  "num_inference_steps": 28,
  "guidance_scale": 3.5,
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "jpeg",
  "acceleration": "regular"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» image_url|body|string| yes ||Drag and drop files here, or provide base64 encoded data URL. Accepted file types: jpg, jpeg, png, webp, gif, avif|
|» image_size|body|string| no ||The size of the generated image. Default value: landscape_4_3 Range (3:4, 4:3, 16:9, 9:16)|
|» num_inference_steps|body|integer| no ||Number of reasoning steps to execute. Default value: 28 Range: 1-50|
|» guidance_scale|body|number| no ||CFG (Classifier-Free Guidance) scale measures how closely you want the model to adhere to the prompt when searching for relevant images. Default value: 3.5  Range: 1-20|
|» num_images|body|integer| no ||Number of images generated. Default value: 1   Range: 1-4|
|» enable_safety_checker|body|boolean| no ||If set to true, enables the security checker. Default value: true|
|» output_format|body|string| no ||The format of the generated image. Default value: "jpeg". Supported formats: default, png, jpeg|
|» acceleration|body|string| no ||Generation speed. The higher the speed, the faster the generation. Default value: "regular"  Supports default, none, regular, high|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-1/schnell/redux

POST /fal-ai/flux-1/schnell/redux

Official documentation: https://fal.ai/models/fal-ai/flux-1/schnell/redux

> Body Parameters

```json
{
  "image_url": "https://fal.media/files/kangaroo/acQvq-Kmo2lajkgvcEHdv.png",
  "num_inference_steps": 4,
  "image_size": "landscape_4_3",
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "jpeg",
  "acceleration": "regular"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» image_url|body|string| yes ||Drag and drop files here, or provide base64 encoded data URL. Accepted file types: jpg, jpeg, png, webp, gif, avif|
|» num_inference_steps|body|integer| no ||Number of reasoning steps to execute. Default value: 4 Range: 1-12|
|» image_size|body|string| no ||The size of the generated image. Default value: landscape_4_3 Range (3:4, 4:3, 16:9, 9:16)|
|» num_images|body|integer| no ||Number of images generated. Default value: 1   Range: 1-4|
|» enable_safety_checker|body|boolean| no ||If set to true, enables the security checker. Default value: true|
|» output_format|body|string| no ||The format of the generated image. Default value: "jpeg". Supported formats: default, png, jpeg|
|» acceleration|body|string| no ||Generation speed. The higher the speed, the faster the generation. Default value: "regular"  Supports default, none, regular, high|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-pro/kontext

POST /fal-ai/flux-pro/kontext

Official documentation: https://fal.ai/models/fal-ai/flux-pro/kontext

> Body Parameters

```json
{
  "prompt": "Put a donut next to the flour.",
  "guidance_scale": 3.5,
  "num_images": 1,
  "output_format": "jpeg",
  "safety_tolerance": "2",
  "image_url": "https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt for Generating Images|
|» guidance_scale|body|number| no ||CFG (Classifier-Free Guidance) scale is used to measure how closely you want the model to adhere to the prompt when searching for relevant images. Default value: 3.5  Range: 1-20|
|» num_images|body|integer| no ||Number of images generated. Default value: 1   Range: 1-4|
|» output_format|body|string| no ||The format of the generated image. Default value: "jpeg". Supported formats: default, png, jpeg|
|» safety_tolerance|body|string| no ||Safety tolerance level for image generation. 1 represents the strictest, 5 represents the most lenient. Default value: "2"|
|» image_url|body|string| yes ||Drag and drop files here, or provide base64 encoded data URL. Accepted file types: jpg, jpeg, png, webp, gif, avif|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-pro/kontext/text-to-image

POST /fal-ai/flux-pro/kontext/text-to-image

Official documentation: https://fal.ai/models/fal-ai/flux-pro/kontext/text-to-image

> Body Parameters

```json
{
  "prompt": "Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture.",
  "guidance_scale": 3.5,
  "num_images": 1,
  "output_format": "jpeg",
  "safety_tolerance": "2",
  "aspect_ratio": "1:1"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt for generating images.|
|» guidance_scale|body|number| no ||CFG (Classifier-Free Guidance) scale is used to measure how closely you want the model to adhere to the prompt when searching for relevant images. Default value: 3.5  Range: 1-20|
|» num_images|body|integer| no ||Number of images generated. Default value: 1   Range: 1-4|
|» output_format|body|string| no ||The format of the generated image. Default value: "jpeg". Supported formats: default, png, jpeg|
|» safety_tolerance|body|string| no ||Safety tolerance level for image generation. 1 represents the strictest, 5 represents the most lenient. Default value: "2"|
|» aspect_ratio|body|string| no ||Aspect ratio of the generated image. Default value: "1:1"   Supported: 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-pro/kontext/max

POST /fal-ai/flux-pro/kontext/max

Official documentation: https://fal.ai/models/fal-ai/flux-pro/kontext/max

> Body Parameters

```json
{
    "prompt": "Put a donut next to the flour.",
    "seed": 0,
    "guidance_scale": 3.5,
    "sync_mode": false,
    "num_images": 1,
    "safety_tolerance": "2",
    "output_format": "jpeg",
    "aspect_ratio": "string",
    "image_url": "https://v3.fal.media/files/rabbit/rmgBxhwGYb2d3pl3x9sKf_output.png"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» seed|body|integer| no ||none|
|» guidance_scale|body|number| no ||Range value: 1-20|
|» sync_mode|body|boolean| no ||Synchronous Mode|
|» num_images|body|integer| no ||Output image count, range: 1-4|
|» safety_tolerance|body|string| no ||Safety tolerance|
|» output_format|body|string| yes ||Image output format: "jpeg", "png"|
|» aspect_ratio|body|string| no ||Image aspect ratio, enumeration values: 21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21|
|» image_url|body|string| yes ||Image URL|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "e36fc67f-afa7-416a-a288-50d90a630d7a",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/e36fc67f-afa7-416a-a288-50d90a630d7a",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/e36fc67f-afa7-416a-a288-50d90a630d7a/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/e36fc67f-afa7-416a-a288-50d90a630d7a/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-pro/kontext/max/multi

POST /fal-ai/flux-pro/kontext/max/multi

Official documentation: https://fal.ai/models/fal-ai/flux-pro/kontext/max/multi

> Body Parameters

```json
{
    "prompt": "Put the little duckling on top of the woman's t-shirt.",
    "guidance_scale": 3.5,
    "num_images": 1,
    "output_format": "jpeg",
    "safety_tolerance": "2",
    "image_urls": [
        "https://v3.fal.media/files/penguin/XoW0qavfF-ahg-jX4BMyL_image.webp",
        "https://v3.fal.media/files/tiger/bml6YA7DWJXOigadvxk75_image.webp"
    ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» guidance_scale|body|number| no ||Range value: 1-20|
|» num_images|body|integer| no ||Number of images to generate, range: 1-4|
|» output_format|body|string| no ||Image output format: "jpeg", "png"|
|» safety_tolerance|body|string| no ||Safety tolerance|
|» image_urls|body|[string]| yes ||Image URL|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "30bc4aeb-0543-4198-929c-da97da4d14c9",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/30bc4aeb-0543-4198-929c-da97da4d14c9",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/30bc4aeb-0543-4198-929c-da97da4d14c9/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/30bc4aeb-0543-4198-929c-da97da4d14c9/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/wan/v2.2-a14b/image-to-image

POST /fal-ai/wan/v2.2-a14b/image-to-image

Official documentation: https://fal.ai/models/fal-ai/wan/v2.2-a14b/image-to-image

> Body Parameters

```json
{
  "image_url": "https://storage.googleapis.com/falserverless/example_inputs/wan-image-to-image-input.png",
  "prompt": "A cinematic shot of an ancient city at sunset, intricate stone buildings, warm golden light",
  "strength": 0.5,
  "aspect_ratio": "auto",
  "num_inference_steps": 27,
  "enable_safety_checker": true,
  "enable_prompt_expansion": false,
  "acceleration": "regular",
  "guidance_scale": 3.5,
  "guidance_scale_2": 4,
  "shift": 2,
  "image_format": "jpeg"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» image_url|body|string| yes ||Image URL|
|» prompt|body|string| yes ||Prompt|
|» strength|body|number| no ||Intensity, range: 0-1|
|» aspect_ratio|body|string| no ||Image Size|
|» num_inference_steps|body|integer| no ||Range: 2-40|
|» enable_safety_checker|body|boolean| no ||Enable security checks, default value: true|
|» enable_prompt_expansion|body|boolean| no ||Enable Prompt Extension|
|» acceleration|body|string| no ||Image generation speed, enumeration values: "regular", "none"|
|» guidance_scale|body|number| no ||Range value: 1-10|
|» guidance_scale_2|body|integer| no ||Range value: 1-10|
|» shift|body|integer| no ||Range value: 1-10|
|» image_format|body|string| no ||Image output format: "jpeg", "png"|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "f88f1b41-b325-4f23-926b-da51481bf6c6",
    "response_url": "https://queue.fal.run/fal-ai/wan/requests/f88f1b41-b325-4f23-926b-da51481bf6c6",
    "status_url": "https://queue.fal.run/fal-ai/wan/requests/f88f1b41-b325-4f23-926b-da51481bf6c6/status",
    "cancel_url": "https://queue.fal.run/fal-ai/wan/requests/f88f1b41-b325-4f23-926b-da51481bf6c6/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/bytedance/seedream/v4/text-to-image

POST /fal-ai/bytedance/seedream/v4/text-to-image

Official documentation: https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image

> Body Parameters

```json
{
  "prompt": "Draw a chart showing the typical vegetation distribution in four different climate zones: tropical rainforest, temperate forest, desert, and tundra.",
  "image_size": {
    "height": 1280,
    "width": 1280
  },
  "num_images": 1,
  "enable_safety_checker": true
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/bytedance/seedream/v4/edit

POST /fal-ai/bytedance/seedream/v4/edit

Official documentation: https://fal.ai/models/fal-ai/bytedance/seedream/v4/edit

> Body Parameters

```json
{
  "prompt": "Dress the model in the clothes and shoes.",
  "image_size": {
    "height": 1280,
    "width": 1280
  },
  "num_images": 1,
  "enable_safety_checker": true,
  "image_urls": [
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_2.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_3.png",
    "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_4.png"
  ]
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» image_size|body|object| no ||Image dimensions: width and height value range must be within: 1024-4096.|
|»» height|body|integer| yes ||none|
|»» width|body|integer| yes ||none|
|» num_images|body|integer| no ||Number of images to generate: 1-6|
|» enable_safety_checker|body|boolean| no ||Enable security checks, default value: true|
|» image_urls|body|[string]| yes ||Image URL|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "42a7eb80-8916-43ae-b27b-02e79f479977",
    "response_url": "https://queue.fal.run/fal-ai/bytedance/requests/42a7eb80-8916-43ae-b27b-02e79f479977",
    "status_url": "https://queue.fal.run/fal-ai/bytedance/requests/42a7eb80-8916-43ae-b27b-02e79f479977/status",
    "cancel_url": "https://queue.fal.run/fal-ai/bytedance/requests/42a7eb80-8916-43ae-b27b-02e79f479977/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/vidu/reference-to-image

POST /fal-ai/vidu/reference-to-image

Official documentation: https://fal.ai/models/fal-ai/vidu/reference-to-image

> Body Parameters

```json
{
  "prompt": "The little devil is looking at the apple on the beach and walking around it.",
  "reference_image_urls": [
    "https://storage.googleapis.com/falserverless/web-examples/vidu/new-examples/reference1.png",
    "https://storage.googleapis.com/falserverless/web-examples/vidu/new-examples/reference2.png",
    "https://storage.googleapis.com/falserverless/web-examples/vidu/new-examples/reference3.png"
  ],
  "aspect_ratio": "16:9"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» reference_image_urls|body|[string]| yes ||Reference image URL|
|» aspect_ratio|body|string| no ||Image aspect ratio, enumeration values: 1:1, 16:9, 9:16|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "405a114e-04bd-463a-a98c-895502cfdce9",
    "response_url": "https://queue.fal.run/fal-ai/vidu/requests/405a114e-04bd-463a-a98c-895502cfdce9",
    "status_url": "https://queue.fal.run/fal-ai/vidu/requests/405a114e-04bd-463a-a98c-895502cfdce9/status",
    "cancel_url": "https://queue.fal.run/fal-ai/vidu/requests/405a114e-04bd-463a-a98c-895502cfdce9/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/imagen4/preview

POST /fal-ai/imagen4/preview

Official documentation: https://fal.ai/models/fal-ai/imagen4/preview

> Body Parameters

```json
{
  "prompt": "Capture an intimate close-up bathed in warm, soft, late-afternoon sunlight filtering into a quintessential 1960s kitchen. The focal point is a charmingly designed vintage package of all-purpose flour, resting invitingly on a speckled Formica countertop. The packaging itself evokes pure nostalgia: perhaps thick, slightly textured paper in a warm cream tone, adorned with simple, bold typography (a friendly serif or script) in classic red and blue “ALL-PURPOSE FLOUR”, featuring a delightful illustration like a stylized sheaf of wheat or a cheerful baker character. In smaller bold print at the bottom of the package: “NET WT 5 LBS (80 OZ) 2.27kg”. Focus sharply on the package details – the slightly soft edges of the paper bag, the texture of the vintage printing, the inviting \"All-Purpose Flour\" text. Subtle hints of the 1960s kitchen frame the shot – the chrome edge of the counter gleaming softly, a blurred glimpse of a pastel yellow ceramic tile backsplash, or the corner of a vintage metal canister set just out of focus. The shallow depth of field keeps attention locked on the beautifully designed package, creating an aesthetic rich in warmth, authenticity, and nostalgic appeal.",
  "aspect_ratio": "1:1",
  "num_images": 1,
  "resolution": "1K"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» aspect_ratio|body|string| no ||Image aspect ratio, enumeration values: 1:1, 16:9, 9:16, 3:4, 4:3|
|» num_images|body|integer| no ||Number of images to generate, range: 1-4|
|» resolution|body|string| no ||Resolution: enumeration values: "1K", "2K"|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "484ccb37-5477-44fe-8e75-6d6f6e9160b3",
    "response_url": "https://queue.fal.run/fal-ai/imagen4/requests/484ccb37-5477-44fe-8e75-6d6f6e9160b3",
    "status_url": "https://queue.fal.run/fal-ai/imagen4/requests/484ccb37-5477-44fe-8e75-6d6f6e9160b3/status",
    "cancel_url": "https://queue.fal.run/fal-ai/imagen4/requests/484ccb37-5477-44fe-8e75-6d6f6e9160b3/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/qwen-image-edit-lora

POST /fal-ai/qwen-image-edit-lora

> Body Parameters

```json
{
    "prompt": "Change bag to apple macbook",
    "num_inference_steps": 30,
    "guidance_scale": 4,
    "num_images": 1,
    "enable_safety_checker": true,
    "output_format": "png",
    "image_url": "http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg",
    "negative_prompt": "blurry, ugly",
    "acceleration": "regular"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/qwen-image-edit-plus

POST /fal-ai/qwen-image-edit-plus

Official documentation: https://fal.ai/models/fal-ai/qwen-image-edit-plus

> Body Parameters

```json
{
  "prompt": "Close shot portrait of a woman in front of this car on this highway",
  "image_size": "square_hd",
  "num_inference_steps": 50,
  "guidance_scale": 4,
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "png",
  "image_urls": [
    "https://v3.fal.media/files/monkey/i3saq4bAPXSIl08nZtq9P_ec535747aefc4e31943136a6d8587075.png",
    "https://v3.fal.media/files/penguin/BCOZp6teRhSQFuOXpbBOa_da8ef9b4982347a2a62a516b737d4f21.png",
    "https://v3.fal.media/files/tiger/sCoZhBksx9DvwSR4_U3_C_3d1f581441874005908addeae9c10d0f.png"
  ],
  "negative_prompt": "blurry, ugly"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt.|
|» image_size|body|string| no ||Image dimensions, enumeration values: square, square_hd, landscape_4_3, landscape_16_9, portrait_3_4, portrait_9_16|
|» num_inference_steps|body|integer| no ||Range value: 2-100|
|» guidance_scale|body|integer| no ||Range: 0-20|
|» num_images|body|integer| no ||Number of images to generate, range: 1-4|
|» enable_safety_checker|body|boolean| no ||Enable security checks, default value: true|
|» output_format|body|string| no ||Output image format, supported: jpeg, png|
|» image_urls|body|[string]| yes ||Image URL|
|» negative_prompt|body|string| no ||none|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "9c08e7d8-312c-402d-a691-c207a9cb8121",
    "response_url": "https://queue.fal.run/fal-ai/qwen-image-edit-plus/requests/9c08e7d8-312c-402d-a691-c207a9cb8121",
    "status_url": "https://queue.fal.run/fal-ai/qwen-image-edit-plus/requests/9c08e7d8-312c-402d-a691-c207a9cb8121/status",
    "cancel_url": "https://queue.fal.run/fal-ai/qwen-image-edit-plus/requests/9c08e7d8-312c-402d-a691-c207a9cb8121/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/kling-video/v2.5-turbo/pro/text-to-video

POST /fal-ai/kling-video/v2.5-turbo/pro/text-to-video

> Body Parameters

```json
{
  "prompt": "A noble lord walks among his people, his presence a comforting reassurance. He greets them with a gentle smile, embodying their hopes and earning their respect through simple interactions. The atmosphere is intimate and sincere, highlighting the bond between the leader and community.",
  "duration": "5",
  "aspect_ratio": "16:9",
  "negative_prompt": "blur, distort, and low quality",
  "cfg_scale": 0.5
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/kling-video/v2.5-turbo/pro/image-to-video

POST /fal-ai/kling-video/v2.5-turbo/pro/image-to-video

Official documentation: https://fal.ai/models/fal-ai/kling-video/v2.5-turbo/pro/image-to-video

> Body Parameters

```json
{
  "prompt": "A stark starting line divides two powerful cars, engines revving for the challenge ahead. They surge forward in the heat of competition, a blur of speed and chrome. The finish line looms as they vie for victory.",
  "image_url": "https://v3.fal.media/files/panda/HnY2yf-BbzlrVQxR-qP6m_9912d0932988453aadf3912fc1901f52.jpg",
  "duration": "5",
  "negative_prompt": "blur, distort, and low quality",
  "cfg_scale": 0.5
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» image_url|body|string| yes ||Image URL. Accepted file types: jpg, jpeg, png, webp, gif, avif|
|» duration|body|string| no ||Video duration generation, enumeration values: 5, 10|
|» negative_prompt|body|string| no ||none|
|» cfg_scale|body|number| no ||Range value: 0-1|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "727028ec-aa98-4073-9bcd-0acb386abcfc",
    "response_url": "https://queue.fal.run/fal-ai/kling-video/requests/727028ec-aa98-4073-9bcd-0acb386abcfc",
    "status_url": "https://queue.fal.run/fal-ai/kling-video/requests/727028ec-aa98-4073-9bcd-0acb386abcfc/status",
    "cancel_url": "https://queue.fal.run/fal-ai/kling-video/requests/727028ec-aa98-4073-9bcd-0acb386abcfc/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-lora

POST /fal-ai/flux-lora

Official documentation: https://fal.ai/models/fal-ai/flux-lora

> Body Parameters

```json
{
  "prompt": "Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word \"FLUX\" is painted over it in big, white brush strokes with visible texture.",
  "image_size": "landscape_4_3",
  "num_inference_steps": 28,
  "guidance_scale": 3.5,
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "jpeg"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» image_size|body|string| no ||Image dimensions, enumeration values: square, square pro, landscape_4_3, landscape_16_9, portrait_3_4|
|» num_inference_steps|body|integer| no ||Range value: 1-50|
|» guidance_scale|body|number| no ||Range: 0-35|
|» num_images|body|integer| no ||Number of images, range: 1-4|
|» enable_safety_checker|body|boolean| no ||Enable security checks, default value: true|
|» output_format|body|string| no ||Output image format, supported: jpeg, png|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "07e0be22-3380-4699-a377-48729443435c",
    "response_url": "https://queue.fal.run/fal-ai/flux-lora/requests/07e0be22-3380-4699-a377-48729443435c",
    "status_url": "https://queue.fal.run/fal-ai/flux-lora/requests/07e0be22-3380-4699-a377-48729443435c/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-lora/requests/07e0be22-3380-4699-a377-48729443435c/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-lora/image-to-image

POST /fal-ai/flux-lora/image-to-image

Official documentation: https://fal.ai/models/fal-ai/flux-lora/image-to-image

> Body Parameters

```json
{
  "prompt": "A photo of a lion sitting on a stone bench",
  "num_inference_steps": 28,
  "guidance_scale": 3.5,
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "jpeg",
  "image_url": "https://storage.googleapis.com/falserverless/example_inputs/dog.png",
  "strength": 0.85
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» num_inference_steps|body|integer| no ||Range value: 1-50|
|» guidance_scale|body|number| no ||Range: 0-35|
|» num_images|body|integer| no ||Number of images, range: 1-4|
|» enable_safety_checker|body|boolean| no ||Enable security checks, default value: true|
|» output_format|body|string| no ||Output image format, supported: jpeg, png|
|» image_url|body|string| yes ||Image URL. Accepted file types: jpg, jpeg, png, webp, gif, avif|
|» strength|body|number| no ||Intensity, range: 0.01-1|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "9b54828d-3c2b-4e0e-ac8c-ac234504015e",
    "response_url": "https://queue.fal.run/fal-ai/flux-lora/requests/9b54828d-3c2b-4e0e-ac8c-ac234504015e",
    "status_url": "https://queue.fal.run/fal-ai/flux-lora/requests/9b54828d-3c2b-4e0e-ac8c-ac234504015e/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-lora/requests/9b54828d-3c2b-4e0e-ac8c-ac234504015e/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/flux-lora/inpainting

POST /fal-ai/flux-lora/inpainting

Official documentation: https://fal.ai/models/fal-ai/flux-lora/inpainting

> Body Parameters

```json
{
  "prompt": "A photo of a lion sitting on a stone bench",
  "num_inference_steps": 28,
  "guidance_scale": 3.5,
  "num_images": 1,
  "enable_safety_checker": true,
  "output_format": "jpeg",
  "image_url": "https://storage.googleapis.com/falserverless/example_inputs/dog.png",
  "strength": 0.85,
  "mask_url": "https://storage.googleapis.com/falserverless/example_inputs/dog_mask.png"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» num_inference_steps|body|integer| no ||Range value: 1-50|
|» guidance_scale|body|number| no ||Range: 0-35|
|» num_images|body|integer| no ||Number of images, range: 1-4|
|» enable_safety_checker|body|boolean| no ||Enable security checks, default value: true|
|» output_format|body|string| no ||Output image format, supported: jpeg, png|
|» image_url|body|string| yes ||Image URL. Accepted file types: jpg, jpeg, png, webp, gif, avif|
|» strength|body|number| no ||Intensity, range: 0.01-1|
|» mask_url|body|string| yes ||Mask URL, accepted file types: jpg, jpeg, png, webp, gif, avif|

> Response Examples

```json
{
    "status": "IN_QUEUE",
    "request_id": "acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "response_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730",
    "status_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-pro/requests/acf05732-7cb3-445b-9f39-fdaeccb1d730/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

```json
{
    "status": "IN_QUEUE",
    "request_id": "72a35804-b407-4b09-894b-3a35559c38f9",
    "response_url": "https://queue.fal.run/fal-ai/flux-lora/requests/72a35804-b407-4b09-894b-3a35559c38f9",
    "status_url": "https://queue.fal.run/fal-ai/flux-lora/requests/72a35804-b407-4b09-894b-3a35559c38f9/status",
    "cancel_url": "https://queue.fal.run/fal-ai/flux-lora/requests/72a35804-b407-4b09-894b-3a35559c38f9/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Key4U English/Brand Platform/Fal-ai Aggregation/falai-veo3 video generation

## POST /fal-ai/veo3

POST /fal-ai/veo3

Official documentation URL: https://fal.ai/models/fal-ai/veo3

> Body Parameters

```json
{
  "prompt": "A casual street interview on a busy New York City sidewalk in the afternoon. The interviewer holds a plain, unbranded microphone and asks: Have you seen Google's new Veo3 model It is a super good model. Person replies: Yeah I saw it, it's already available on fal. It's crazy good.",
  "aspect_ratio": "16:9",
  "duration": "8s",
  "enhance_prompt": true,
  "auto_fix": true,
  "resolution": "720p",
  "generate_audio": true
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||none|
|» aspect_ratio|body|string| no ||The aspect ratio of the generated video. If set to 1:1, the video will be letterboxed. Default value: "16:9", range [16:9, 9:16, 1:1]|
|» duration|body|string| no ||Duration of the generated video (in seconds) Default value: "8s"|
|» enhance_prompt|body|boolean| no ||Whether to enhance video generation default value: true|
|» auto_fix|body|boolean| no ||Whether to automatically attempt to fix prompts that fail content policy or other validation checks through rewriting. Default value: true|
|» resolution|body|string| no ||Default resolution for video generation: "720p"  Range: [720p, 1080p]|
|» generate_audio|body|boolean| no ||Whether to generate audio for video. If false, the credit consumption will be reduced by 33%. Default value: true|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "57b19308-8d3e-4196-b8bf-5ca80fa90827",
    "response_url": "https://queue.fal.run/fal-ai/veo3/requests/57b19308-8d3e-4196-b8bf-5ca80fa90827",
    "status_url": "https://queue.fal.run/fal-ai/veo3/requests/57b19308-8d3e-4196-b8bf-5ca80fa90827/status",
    "cancel_url": "https://queue.fal.run/fal-ai/veo3/requests/57b19308-8d3e-4196-b8bf-5ca80fa90827/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/veo3/fast/image-to-video

POST /fal-ai/veo3/fast/image-to-video

Official documentation URL: https://fal.ai/models/fal-ai/veo3/fast/image-to-video

> Body Parameters

```json
{
  "prompt": "A woman looks into the camera, breathes in, then exclaims energetically, \"have you guys checked out Veo3 Image-to-Video on Fal? It's incredible!\"",
  "image_url": "https://storage.googleapis.com/falserverless/example_inputs/veo3-i2v-input.png",
  "aspect_ratio": "16:9",
  "duration": "8s",
  "generate_audio": true,
  "resolution": "720p"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Text prompt describing how an image should be animated|
|» image_url|body|string| yes ||URL of the input image to be animated. The resolution should be 720p or higher with an aspect ratio of 16:9. If the image's aspect ratio is not 16:9, it will be cropped to fit.|
|» aspect_ratio|body|string| no ||Default aspect ratio for generated video: "auto"|
|» duration|body|string| no ||Duration of the generated video (in seconds) Default value: "8s"|
|» generate_audio|body|boolean| no ||Whether to generate audio for video. If false, the credit consumption will be reduced by 33%. Default value: true|
|» resolution|body|string| no ||Default resolution for video generation: "720p"  Range: [720p, 1080p]|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "1b24b3ae-16a2-4d19-b10d-1e323ebff061",
    "response_url": "https://queue.fal.run/fal-ai/veo3/requests/1b24b3ae-16a2-4d19-b10d-1e323ebff061",
    "status_url": "https://queue.fal.run/fal-ai/veo3/requests/1b24b3ae-16a2-4d19-b10d-1e323ebff061/status",
    "cancel_url": "https://queue.fal.run/fal-ai/veo3/requests/1b24b3ae-16a2-4d19-b10d-1e323ebff061/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/veo3/fast

POST /fal-ai/veo3/fast

Official documentation URL: https://fal.ai/models/fal-ai/veo3/fast

> Body Parameters

```json
{
  "prompt": "A casual street interview on a busy New York City sidewalk in the afternoon. The interviewer holds a plain, unbranded microphone and asks: Have you seen Google's new Veo3 model It is a super good model. Person replies: Yeah I saw it, it's already available on fal. It's crazy good.",
  "aspect_ratio": "16:9",
  "duration": "4s",
  "enhance_prompt": true,
  "auto_fix": true,
  "resolution": "720p",
  "generate_audio": false
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Text prompt describing the video to be generated|
|» aspect_ratio|body|string| no ||The aspect ratio of the generated video. If set to 1:1, the video will be letterboxed. Default value: "16:9", range [16:9, 9:16, 1:1]|
|» duration|body|string| no ||Duration of the generated video (in seconds) Default value: "8s"|
|» enhance_prompt|body|boolean| no ||Whether to enhance video generation default value: true|
|» auto_fix|body|boolean| no ||Whether to automatically attempt to fix prompts that fail content policy or other validation checks through rewriting. Default value: true|
|» resolution|body|string| no ||Default resolution for video generation: "720p"  Range: [720p, 1080p]|
|» generate_audio|body|boolean| no ||Whether to generate audio for video. If false, the credit consumption will be reduced by 33%. Default value: true|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "fabda298-3a7c-43f6-ba3a-2bde5b344173",
    "response_url": "https://queue.fal.run/fal-ai/veo3/requests/fabda298-3a7c-43f6-ba3a-2bde5b344173",
    "status_url": "https://queue.fal.run/fal-ai/veo3/requests/fabda298-3a7c-43f6-ba3a-2bde5b344173/status",
    "cancel_url": "https://queue.fal.run/fal-ai/veo3/requests/fabda298-3a7c-43f6-ba3a-2bde5b344173/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET /fal-ai/veo3/requests/{request_id}

GET /fal-ai/veo3/requests/{request_id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|request_id|path|string| yes ||none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST /fal-ai/veo3/image-to-video

POST /fal-ai/veo3/image-to-video

Official documentation: https://fal.ai/models/fal-ai/veo3/image-to-video

> Body Parameters

```json
{
  "prompt": "A woman looks into the camera, breathes in, then exclaims energetically, \"have you guys checked out Veo3 Image-to-Video on Fal? It's incredible!\"",
  "image_url": "https://storage.googleapis.com/falserverless/example_inputs/veo3-i2v-input.png",
  "aspect_ratio": "auto",
  "duration": "8s",
  "generate_audio": true,
  "resolution": "720p"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| no ||none|
|» prompt|body|string| yes ||Prompt|
|» image_url|body|string| yes ||Reference image URL|
|» aspect_ratio|body|string| no ||Size, enumerated values: 16:9, 9:16, auto, default value: "auto"|
|» duration|body|string| no ||Video duration, default value: "8s"|
|» generate_audio|body|boolean| no ||Generate audio, default value: true|
|» resolution|body|string| no ||Resolution, enumeration values: "720p", "1080p"|

> Response Examples

> 200 Response

```json
{
    "status": "IN_QUEUE",
    "request_id": "bcd3b436-b7af-42f3-8649-204657bfaf10",
    "response_url": "https://queue.fal.run/fal-ai/veo3/requests/bcd3b436-b7af-42f3-8649-204657bfaf10",
    "status_url": "https://queue.fal.run/fal-ai/veo3/requests/bcd3b436-b7af-42f3-8649-204657bfaf10/status",
    "cancel_url": "https://queue.fal.run/fal-ai/veo3/requests/bcd3b436-b7af-42f3-8649-204657bfaf10/cancel",
    "logs": null,
    "metrics": {},
    "queue_position": 0
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» request_id|string|true|none||none|
|» response_url|string|true|none||none|
|» status_url|string|true|none||none|
|» cancel_url|string|true|none||none|
|» logs|null|true|none||none|
|» metrics|object|true|none||none|
|» queue_position|integer|true|none||none|

# Key4U English/Brand Platform/Private-Domain Portraits/Virtual Avatar · Asset Group

<a id="opIdgetAssetGroup"></a>

## GET ③ Query a Single Asset Group

GET /v1/private-avatar/groups/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||GroupId|
|model|query|string| yes ||Routing Model (Required)|

#### Enum

|Name|Value|
|---|---|
|model|doubao-seedance-2-0-260128|
|model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "Id": "group-20260601191715-9q47m",
    "Name": "my_virtual_group",
    "Description": "string",
    "GroupType": "AIGC",
    "CreateTime": "2019-08-24T14:15:22Z",
    "UpdateTime": "2019-08-24T14:15:22Z"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Query successful|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» Id|string|false|none||none|
|»» Name|string|false|none||none|
|»» Description|string|false|none||none|
|»» GroupType|string|false|none||none|
|»» CreateTime|string(date-time)|false|none||none|
|»» UpdateTime|string(date-time)|false|none||none|

#### Enum

|Name|Value|
|---|---|
|GroupType|AIGC|
|GroupType|LivenessFace|

<a id="opIdupdateAssetGroup"></a>

## PATCH ④  Update Asset Group

PATCH /v1/private-avatar/groups/{id}

> Body Parameters

```json
{
    "model": "doubao-seedance-2-0-260128",
    "Id": "group-20260601191715-9q47m",
    "Name": "renamed_group",
    "Description": "updated"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||GroupId|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» Id|body|string| yes ||Consistent with the path ID|
|» Name|body|string| no ||none|
|» Description|body|string| no ||none|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Update successful|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|

<a id="opIddeleteAssetGroup"></a>

## DELETE ⑤  Delete Asset Group

DELETE /v1/private-avatar/groups/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||GroupId|
|model|query|string| yes ||Routing Model (Required)|

#### Enum

|Name|Value|
|---|---|
|model|doubao-seedance-2-0-260128|
|model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Deleted successfully|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|

<a id="opIdcreateAssetGroup"></a>

## POST ①  Create an asset group

POST /v1/private-avatar/groups

> Body Parameters

```json
{
    "model": "doubao-seedance-2-0-260128",
    "Name": "my_virtual_group",
    "Description": "Optional description",
    "GroupType": "AIGC"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» Name|body|string| yes ||Asset Group Name (Required)|
|» Description|body|string| no ||Asset group description (optional)|
|» GroupType|body|string| no ||Fixed AIGC for the virtual avatar; optional|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "Id": "group-20260601191715-9q47m"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Created successfully (Volcengine response passed through)|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» Id|string|false|none||GroupId, used by subsequent API calls|

<a id="opIdlistAssetGroups"></a>

## POST ②  Query the asset group list

POST /v1/private-avatar/groups/list

> Body Parameters

```json
{
    "model": "doubao-seedance-2-0-260128",
    "Filter": {
        "Name": "Bao Jianjun",
        "GroupIds": [
            "group-20260601191715-9q47m"
        ],
        "GroupType": "AIGC"
    },
    "PageNumber": 1,
    "PageSize": 10
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» Filter|body|object| no ||none|
|»» Name|body|string| no ||Fuzzy Group Name Matching|
|»» GroupIds|body|[string]| no ||none|
|»» GroupType|body|string| no ||none|
|» PageNumber|body|integer| no ||none|
|» PageSize|body|integer| no ||none|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|
|»» GroupType|AIGC|
|»» GroupType|LivenessFace|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "Total": 1,
    "PageNumber": 1,
    "PageSize": 10,
    "Items": [
      {
        "Id": "group-20260601191715-9q47m",
        "Name": "my_virtual_group",
        "Description": "string",
        "GroupType": "AIGC",
        "CreateTime": "2019-08-24T14:15:22Z",
        "UpdateTime": "2019-08-24T14:15:22Z"
      }
    ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Query successful|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» Total|integer|false|none||none|
|»» PageNumber|integer|false|none||none|
|»» PageSize|integer|false|none||none|
|»» Items|[object]|false|none||none|
|»»» Id|string|false|none||none|
|»»» Name|string|false|none||none|
|»»» Description|string|false|none||none|
|»»» GroupType|string|false|none||none|
|»»» CreateTime|string(date-time)|false|none||none|
|»»» UpdateTime|string(date-time)|false|none||none|

#### Enum

|Name|Value|
|---|---|
|GroupType|AIGC|
|GroupType|LivenessFace|

# Key4U English/Brand Platform/Private-Domain Portraits/Virtual Avatar Assets

<a id="opIdlistAssets"></a>

## POST ⑦  Query the Asset List

POST /v1/private-avatar/assets/list

> Body Parameters

```json
{
    "model": "doubao-seedance-2-0-260128",
    "Filter": {
        "GroupIds": [
            "group-20260601191715-9q47m"
        ],
        "GroupType": "AIGC",
        "Statuses": [
            "Active",
            "Processing"
        ],
        "Name": "Que Guohua"
    },
    "PageNumber": 1,
    "PageSize": 10,
    "SortBy": "GroupId",
    "SortOrder": "Asc"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» Filter|body|object| no ||none|
|»» GroupIds|body|[string]| no ||none|
|»» GroupType|body|string| no ||none|
|»» Statuses|body|[string]| no ||none|
|»» Name|body|string| no ||none|
|» PageNumber|body|integer| no ||none|
|» PageSize|body|integer| no ||none|
|» SortBy|body|string| no ||none|
|» SortOrder|body|string| no ||none|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|
|»» GroupType|AIGC|
|»» GroupType|LivenessFace|
|»» Statuses|Processing|
|»» Statuses|Active|
|»» Statuses|Failed|
|» SortOrder|Asc|
|» SortOrder|Desc|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "Total": 0,
    "PageNumber": 0,
    "PageSize": 0,
    "Items": [
      {
        "Id": "asset-20260318071009-xxxxx",
        "GroupId": "group-20260601191715-9q47m",
        "Status": "Active",
        "AssetType": "Image",
        "Name": "string",
        "URL": "string",
        "CreateTime": "2019-08-24T14:15:22Z",
        "UpdateTime": "2019-08-24T14:15:22Z"
      }
    ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Query successful|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» Total|integer|false|none||none|
|»» PageNumber|integer|false|none||none|
|»» PageSize|integer|false|none||none|
|»» Items|[object]|false|none||none|
|»»» Id|string|false|none||none|
|»»» GroupId|string|false|none||none|
|»»» Status|string|false|none||none|
|»»» AssetType|string|false|none||none|
|»»» Name|string|false|none||none|
|»»» URL|string|false|none||Asset CDN URL, valid for 12 hours|
|»»» CreateTime|string(date-time)|false|none||none|
|»»» UpdateTime|string(date-time)|false|none||none|

#### Enum

|Name|Value|
|---|---|
|Status|Processing|
|Status|Active|
|Status|Failed|
|AssetType|Image|
|AssetType|Video|
|AssetType|Audio|

<a id="opIdgetAsset"></a>

## GET [PASTE YOUR CHINESE TEXT HERE]
"⑧  Query asset status"

GET /v1/private-avatar/assets/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||AssetId (API 6 Result.Id)|
|model|query|string| yes ||Routing Model (Required)|

#### Enum

|Name|Value|
|---|---|
|model|doubao-seedance-2-0-260128|
|model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "Id": "asset-20260318071009-xxxxx",
    "GroupId": "group-20260601191715-9q47m",
    "Status": "Active",
    "AssetType": "Image",
    "Name": "string",
    "URL": "string",
    "CreateTime": "2019-08-24T14:15:22Z",
    "UpdateTime": "2019-08-24T14:15:22Z"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Query successful|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» Id|string|false|none||none|
|»» GroupId|string|false|none||none|
|»» Status|string|false|none||none|
|»» AssetType|string|false|none||none|
|»» Name|string|false|none||none|
|»» URL|string|false|none||Asset CDN URL, valid for 12 hours|
|»» CreateTime|string(date-time)|false|none||none|
|»» UpdateTime|string(date-time)|false|none||none|

#### Enum

|Name|Value|
|---|---|
|Status|Processing|
|Status|Active|
|Status|Failed|
|AssetType|Image|
|AssetType|Video|
|AssetType|Audio|

<a id="opIdupdateAsset"></a>

## PATCH ⑨  Update Assets

PATCH /v1/private-avatar/assets/{id}

> Body Parameters

```json
{
  "model": "doubao-seedance-2-0-260128",
  "Id": "asset-20260318071009-xxxxx",
  "Name": "renamed-asset"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||AssetId|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» Id|body|string| yes ||Consistent with the path ID|
|» Name|body|string| no ||none|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Update successful|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|

<a id="opIddeleteAsset"></a>

## DELETE ⑩  Delete Asset

DELETE /v1/private-avatar/assets/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|string| yes ||AssetId|
|model|query|string| yes ||Routing Model (Required)|

#### Enum

|Name|Value|
|---|---|
|model|doubao-seedance-2-0-260128|
|model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {}
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Deleted successfully|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|

<a id="opIdcreateAsset"></a>

## POST ⑥  Upload Media

POST /v1/private-avatar/assets

> Body Parameters

```json
{
    "model": "doubao-seedance-2-0-260128",
    "GroupId": "184834733006389276",
    "URL": "https://example.com/figure.jpg",
    "AssetType": "Image",   
    "Name": "full-body"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» GroupId|body|string| yes ||Result.Id returned by API 1|
|» URL|body|string| yes ||Publicly accessible URL for the asset (the field name is uppercase `URL`)|
|» AssetType|body|string| yes ||Capitalize the first letter|
|» Name|body|string| no ||Asset note name (optional)|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|
|» AssetType|Image|
|» AssetType|Video|
|» AssetType|Audio|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "Id": "asset-20260318071009-xxxxx"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Submission successful (the asset is Processing and must be polled)|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» Id|string|false|none||AssetId, used for API ⑧ polling and asset:// references|

# Key4U English/Brand Platform/Private-Domain Portraits/Real-Person Portrait · Verification

<a id="opIdcreateVisualValidateSession"></a>

## POST ⑪  Generate a Real-Person Verification Link

POST /v1/real-avatar/auth/session

> Body Parameters

```json
{
  "model": "doubao-seedance-2-0-260128",
  "CallbackURL": "https://your-app.com/volc-auth-done",
  "Lng": "zh"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» CallbackURL|body|string(uri)| yes ||Browser redirect URL after performer verification is completed (the business party's own frontend page; required)|
|» Lng|body|string| no ||H5 Page Language (Optional)|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|
|» Lng|zh|
|» Lng|en|
|» Lng|zh-Hant|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "BytedToken": "202603311449168C23BA26XXXXXXXX",
    "H5Link": "https://h5-v2.kych5.com?token=...",
    "CallbackURL": "string"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success; returns H5Link and BytedToken|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» BytedToken|string|false|none||Save this value and pass it to API ⑫ after successful authentication (valid for 120 seconds)|
|»» H5Link|string|false|none||Send it to the actor to open and complete identity verification.|
|»» CallbackURL|string|false|none||Consistent with the request|

<a id="opIdgetVisualValidateResult"></a>

## POST ⑫ Exchange BytedToken for GroupId

POST /v1/real-avatar/groups/from-token

> Body Parameters

```json
{
  "model": "doubao-seedance-2-0-260128",
  "BytedToken": "202603311449168C23BA26XXXXXXXX"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|body|body|object| yes ||none|
|» model|body|string| yes ||Routing parameter (always pass this value)|
|» BytedToken|body|string| yes ||API ⑪ Result.BytedToken (must be called within 120 seconds)|

#### Enum

|Name|Value|
|---|---|
|» model|doubao-seedance-2-0-260128|
|» model|doubao-seedance-2-0-fast-260128|

> Response Examples

> 200 Response

```json
{
  "ResponseMetadata": {
    "RequestId": "20260601191715C9DAA092032F19CEC367",
    "Action": "CreateAssetGroup",
    "Version": "2024-01-01",
    "Service": "ark",
    "Region": "cn-beijing",
    "Error": {
      "Code": "AccessDenied",
      "Message": "string"
    }
  },
  "Result": {
    "GroupId": "group-20260331145705-xxxxx"
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Success; returns the real-person GroupId|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» ResponseMetadata|object|false|none||none|
|»» RequestId|string|false|none||none|
|»» Action|string|false|none||none|
|»» Version|string|false|none||none|
|»» Service|string|false|none||none|
|»» Region|string|false|none||none|
|»» Error|object|false|none||none|
|»»» Code|string|false|none||none|
|»»» Message|string|false|none||none|
|» Result|object|false|none||none|
|»» GroupId|string|false|none||ID of the real-person asset group, used later by API 6 for uploads|

# Key4U English/UserAPIKey Access/Logs

## GET Get Usage Log

GET /api/logs/usage

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|p|query|integer| no ||Page number|
|page_size|query|integer| no ||Items per page|
|token_name|query|string| no ||Filter by token name|
|model_name|query|string| no ||Filter by model name|
|start_timestamp|query|integer| no ||Start time (Unix timestamp)|
|end_timestamp|query|integer| no ||End time (Unix timestamp)|
|Authorization|header|string| yes ||none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|None|

## GET Get Midjourney Log

GET /api/logs/mj

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|p|query|integer| no ||Page number|
|page_size|query|integer| no ||Items per page|
|mj_id|query|string| no ||Filter by Midjourney ID|
|start_timestamp|query|integer| no ||Start time (Unix timestamp in milliseconds)|
|end_timestamp|query|integer| no ||End time (Unix timestamp in milliseconds)|
|Authorization|header|string| yes ||none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|None|

## GET Get Task Log

GET /api/logs/task

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|p|query|integer| no ||Page number|
|page_size|query|integer| no ||Items per page|
|task_id|query|string| no ||Filter by task ID|
|platform|query|string| no ||Filter by platform|
|status|query|string| no ||Filter by status|
|start_timestamp|query|integer| no ||Start time (Unix timestamp)|
|end_timestamp|query|integer| no ||End time (Unix timestamp)|
|Authorization|header|string| yes ||none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|None|

# Key4U English/UserAPIKey Access/Token

## POST Create New LLM Token

POST /api/token

> Body Parameters

```json
{
    "remain_quota": -391,
    "expired_time": -1,
    "unlimited_quota": true,
    "model_limits_enabled": false,
    "model_limits": "",
    "group": "auto",
    "name": "5sGx0J-MwKpFFDk9mtqSSVELcNtAl"
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|
|Content-Type|header|string| yes ||none|
|body|body|object| no ||none|
|» name|body|string| yes ||Token name (maximum 30 characters)|
|» remain_quota|body|integer| no ||Initial quota (remaining limit: 1 USD = 500000)|
|» unlimited_quota|body|boolean| no ||Unlimited quota|
|» expired_time|body|integer| no ||Expiration time as Unix timestamp, -1 = no expiration|
|» group|body|string| no ||Group retrieved from /api/groups|
|» model_limits_enabled|body|boolean| no ||Enable/disable model limits|
|» model_limits|body|string| no ||List of allowed models, "" means all models are allowed|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Tạo thành công|None|

## PUT Update LLM Token

PUT /api/token

> Body Parameters

```json
{
    "id": 151321,
    "name": "5sGx0J-MwKpFFDk9mtqSSVELcNtAl",
    "email": "abcxyz@gmail.com",
    "remain_quota": -391,
    "unlimited_quota": true,
    "expired_time": -1,
    "group": "Mặc định",
    "model_limits_enabled": false,
    "model_limits": ""
}
```

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|
|Content-Type|header|string| yes ||none|
|body|body|object| no ||none|
|» id|body|integer| yes ||Token ID|
|» name|body|string| no ||Token name (maximum 30 characters)|
|» remain_quota|body|integer| no ||Remaining quota (1 USD = 500000)|
|» unlimited_quota|body|boolean| no ||Unlimited quota flag|
|» expired_time|body|integer| no ||Expiration time as Unix timestamp, -1 means no expiration|
|» group|body|string| no ||Group name (from /api/groups)|
|» model_limits_enabled|body|boolean| no ||Enable or disable model usage limits|
|» model_limits|body|string| no ||Allowed models list, empty string means all models are allowed|
|» email|body|string| no ||Owner email token|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Cập nhật thành công|None|

## GET Get Tokens (Pagination)

GET /api/token

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|p|query|integer| no ||Page number|
|pageSize|query|integer| no ||Items per page (max 100)|
|keyword|query|string| no ||Search by token name|
|Authorization|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{
    "data": {
        "items": [
            {
                "id": 123456789,
                "name": "my-token",
                "key": "sk-xxxxxxxx",
                "status": 1,
                "remain_quota": 500000,
                "used_quota": 12000,
                "unlimited_quota": false,
                "group": "default"
            }
        ],
        "page": 1,
        "page_size": 10,
        "total": 3
    },
    "success": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|Inline|

### Responses Data Schema

## DELETE Delete LLM Token

DELETE /api/token/{id}

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|id|path|integer| yes ||Token ID|
|Authorization|header|string| yes ||none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Xoá thành công|None|

## GET Get All LLM Tokens (No Pagination)

GET /api/tokenAll

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|None|

# Key4U English/UserAPIKey Access/Healthy

## GET Check System Uptime

GET /api/uptime/status

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|None|

# Key4U English/UserAPIKey Access/Wallet

## GET Check Balance

GET /v1/balance

Return wallet balance and usage amount. Supports both User API Key (k4u-...) and LLM token key (sk-...).

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|

> Response Examples

> 200 Response

```json
{
    "key": "k4u-9f8e7d6c5b4a3210...",
    "used": 2.35,
    "balance": 47.65
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|Key không hợp lệ hoặc đã bị tắt|None|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» key|string|false|none||none|
|» used|number|false|none||none|
|» balance|number|false|none||none|

# Key4U English/UserAPIKey Access/Groups

## GET Get Model Group List

GET /api/groups

### Params

|Name|Location|Type|Required|Title|Description|
|---|---|---|---|---|---|
|Authorization|header|string| yes ||none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Thành công|None|

# Data Schema

