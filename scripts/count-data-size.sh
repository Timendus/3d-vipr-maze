#!/bin/bash
# Usage: ./count-screens-size.sh

SCREENS=`grep -o '0x' screens/screens.txt | wc -l`
echo "$((1*SCREENS)) bytes in screens.txt"

COORDS=`grep -o '  coord ' data/binary-tree.8o | wc -l`
COORDS=$((COORDS*3))
POINTERS=`grep -o '  pointer ' data/binary-tree.8o | wc -l`
POINTERS=$((POINTERS*2))
echo "$((COORDS + POINTERS)) bytes in binary-tree.8o"

GAMESTATE=`grep -o '0' data/game-state.8o | wc -l`
POINTERS=`grep -o '  pointer ' data/game-state.8o | wc -l`
POINTERS=$((POINTERS*2))
echo "$((POINTERS + GAMESTATE)) bytes in game-state.8o"

POSITIONS=`grep -o '0x' data/maps.8o | wc -l`
echo "$((1*POSITIONS)) bytes in maps.8o"
