#!/usr/bin/env bash
# Rebuilds the 480p animatic from ../data.js and ../song.mp3.
# Usage: ./build.sh [version]   e.g. ./build.sh v2
set -euo pipefail
cd "$(dirname "$0")"
VER="${1:-v1}"
BUILD="$(mktemp -d)"
node cards.js "$BUILD"
TOTAL=$(node -e 'global.window={};require("../data.js");console.log((window.SB.song.end+3).toFixed(1))')
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf
cat > "$BUILD/filter.txt" <<F
[0:v]fps=24,scale=854:480,format=yuv420p,drawbox=x=0:y=ih-6:w=iw:h=6:color=white@0.18:t=fill,drawtext=fontfile=$FONT:fontsize=14:fontcolor=white@0.85:x=w-tw-14:y=h-28:text='song %{eif\:floor(max(t-3\,0)/60)\:d}\:%{eif\:mod(floor(max(t-3\,0))\,60)\:d\:2} / 4\:15',drawtext=fontfile=$FONT:fontsize=14:fontcolor=white@0.6:x=14:y=h-28:text='ANIMATIC $VER · My Whole Supply'[bg];
color=c=0x2F6BFF:s=854x6:r=24[bar];
[bg][bar]overlay=x='-W+W*t/$TOTAL':y=H-6:eof_action=pass[v];
[1:a]adelay=3000|3000,apad,atrim=0:$TOTAL[a]
F
ffmpeg -y -loglevel error -f concat -safe 0 -i "$BUILD/concat.txt" -i ../song.mp3 \
  -filter_complex_script "$BUILD/filter.txt" -map "[v]" -map "[a]" -t "$TOTAL" \
  -c:v libx264 -preset medium -crf 26 -tune stillimage -c:a aac -b:a 128k -movflags +faststart \
  "animatic-$VER-480p.mp4"
rm -rf "$BUILD"
echo "animatic-$VER-480p.mp4 ($TOTAL s)"
