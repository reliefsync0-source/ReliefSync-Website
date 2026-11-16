VIDEO CAROUSEL
==============
Put video files in this folder. In index.html, update a carousel indicator's
data-video-src to the file path, and data-video-title to its display title.

Example:
  data-video-src="videos/My%20Video.mp4"
  data-video-title="Watch my video"

Use MP4 with H.264 video and AAC audio for broad browser support. GitHub Pages
cannot serve Git LFS pointer files as videos, so carousel videos must be stored
as regular Git files and kept under GitHub's 100 MB per-file limit. Compress
large originals for the website; keep the originals in Git LFS if needed.
