# Screenshot Storage Setup

The quick-capture feature uploads JPEG files to the bucket named by `SCREENSHOT_UPLOAD_BUCKET`.

Before enabling the feature, create that bucket in Supabase Storage and grant the authenticated role used by the extension permission to insert objects into it. Confirm that the bucket name and project URL match the local `.env` configuration.

Use a dedicated bucket with retention and access rules suitable for the screenshots being collected. Verify upload failures through the in-page status notification after pressing `M`.
