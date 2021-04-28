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

echo "  #if COMPRESSION" >> 3dvipermaze.8o
cat src/decompression.8o >> 3dvipermaze.8o
echo "  #end" >> 3dvipermaze.8o

cat src/map-management.8o >> 3dvipermaze.8o
cat src/render-3d.8o >> 3dvipermaze.8o
cat src/key-input.8o >> 3dvipermaze.8o

echo "  #if COMPRESSION" >> 3dvipermaze.8o
cat screens/compressed-screens.txt >> 3dvipermaze.8o
echo "  #else" >> 3dvipermaze.8o
cat screens/screens.txt >> 3dvipermaze.8o
echo "  #end" >> 3dvipermaze.8o

cat data/maps.8o >> 3dvipermaze.8o
cat data/game-state.8o >> 3dvipermaze.8o
cat data/binary-tree.8o >> 3dvipermaze.8o

echo "# That's all folks!" >> 3dvipermaze.8o

./scripts/macros.js 3dvipermaze.8o bin/3dviprmaze-vip.8o VIP
./scripts/macros.js 3dvipermaze.8o bin/3dviprmaze-vip-compression.8o VIP COMPRESSION
./scripts/macros.js 3dvipermaze.8o bin/3dviprmaze-schip.8o SCHIP
rm 3dvipermaze.8o

# Put on the clipboard for convenient pasting into Octo
cat bin/3dviprmaze-vip.8o | pbcopy

# Build binaries using command line octo
# Requires octo repository to have been cloned in the parent directory
../Octo/octo bin/3dviprmaze-vip.8o bin/3dviprmaze-vip.ch8
../Octo/octo bin/3dviprmaze-vip-compression.8o bin/3dviprmaze-vip-compression.ch8
../Octo/octo bin/3dviprmaze-schip.8o bin/3dviprmaze-schip.ch8
../Octo/octo --options octo-html.json bin/3dviprmaze-vip.8o docs/index.html
