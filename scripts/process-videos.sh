#!/bin/bash
# Process final Nightfall videos: 1280x720 H.264 MP4, silent, web-optimized
set -e
SRC=/tmp/vidprobe
OUT=/home/z/my-project/public/assets/videos
POSTERS=$OUT/posters
mkdir -p "$OUT" "$POSTERS"
cd "$SRC"

ENC="-c:v libx264 -preset medium -crf 26 -pix_fmt yuv420p -movflags +faststart -an"

# 1) Hero: moon clouds — full clip
ffmpeg -y -loglevel error -i moon.webm -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" $ENC "$OUT/hero-moon.mp4"

# 2) Green laser show — 24s from 6s in
ffmpeg -y -loglevel error -ss 6 -t 24 -i laser1.webm -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" $ENC "$OUT/g-laser-green.mp4"

# 3) Blue/purple laser storm — 24s from 2s in
ffmpeg -y -loglevel error -ss 2 -t 24 -i laser2.webm -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" $ENC "$OUT/g-laser-blue.mp4"

# 4) Forest rave (portrait source) — blur-pad to 16:9, full clip
ffmpeg -y -loglevel error -i rave.ogg -filter_complex "[0:v]scale=1280:720:force_original_aspect_ratio=decrease[p];[0:v]scale=1280:720,boxblur=24:2[b];[b][p]overlay=(W-w)/2:(H-h)/2" $ENC "$OUT/g-forest-rave.mp4"

# 5) Night storm lightning — full clip
ffmpeg -y -loglevel error -i lightning.ogg -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" $ENC "$OUT/g-storm.mp4"

# 6) Hellfire bonfire sparks — 22s from 3s in
ffmpeg -y -loglevel error -ss 3 -t 22 -i fire.webm -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" $ENC "$OUT/g-hellfire.mp4"

# 7) The Crypt (dark club DJ) — full clip
ffmpeg -y -loglevel error -i club.webm -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" $ENC "$OUT/g-crypt.mp4"

# Posters from each final file (bright, representative frame at 1s)
for f in hero-moon g-laser-green g-laser-blue g-forest-rave g-storm g-hellfire g-crypt; do
  ffmpeg -y -loglevel error -ss 1 -i "$OUT/$f.mp4" -frames:v 1 -q:v 4 "$POSTERS/$f.jpg"
done

echo "--- output ---"
ls -la "$OUT"
ls -la "$POSTERS"
