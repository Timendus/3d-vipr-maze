#!/bin/bash

cd screens
./convert.sh
./combine.sh
cd ..
./scripts/compress.js screens/screens.txt screens/compressed-screens.txt

cat src/shared-macros.8o > 3dvipermaze.8o

echo >> 3dvipermaze.8o
echo ":org 0x200" >> 3dvipermaze.8o
echo >> 3dvipermaze.8o

cat src/main.8o >> 3dvipermaze.8o
cat src/map-management.8o >> 3dvipermaze.8o
cat src/render-3d.8o >> 3dvipermaze.8o
cat src/key-input.8o >> 3dvipermaze.8o
cat src/decompression.8o >> 3dvipermaze.8o

cat screens/compressed-screens.txt >> 3dvipermaze.8o
cat data/binary-tree.8o >> 3dvipermaze.8o

cat data/maps.8o >> 3dvipermaze.8o
cat data/game-state.8o >> 3dvipermaze.8o

echo "# That's all folks!" >> 3dvipermaze.8o

# Put on the clipboard for convenient pasting into Octo
cat 3dvipermaze.8o | pbcopy
