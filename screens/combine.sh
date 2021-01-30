#!/bin/bash
#
# This script combines all the txt files in this directory into one big pile of
# bytes for the game.

# Full base image
cat hall-0.txt > screens.txt

# Outer variations
sed -n -e 1,4p -e 22,25p hall-1.txt >> screens.txt
sed -n -e 1,7p -e 19,25p hall-2.txt >> screens.txt

# Inner variations
sed -n -e 7,10p -e 16,19p hall-3.txt >> screens.txt
sed -n 7,19p hall-4.txt >> screens.txt
sed -n 10,16p hall-5.txt >> screens.txt

# Full base image
cat wall-1.txt >> screens.txt

# Outer variations
sed -n -e 1,4p -e 22,25p wall-1-1.txt >> screens.txt
sed -n -e 1,4p -e 22,25p wall-1-2.txt >> screens.txt
sed -n -e 1,4p -e 22,25p wall-1-3.txt >> screens.txt
sed -n -e 1,4p -e 22,25p wall-1-4.txt >> screens.txt
sed -n -e 1,4p -e 22,25p wall-1-5.txt >> screens.txt
sed -n -e 1,4p -e 22,25p wall-1-6.txt >> screens.txt
sed -n -e 1,7p -e 19,25p wall-2-3.txt >> screens.txt
sed -n -e 1,7p -e 19,25p wall-2-4.txt >> screens.txt
sed -n -e 1,7p -e 19,25p wall-2-5.txt >> screens.txt
sed -n -e 1,7p -e 19,25p wall-2-6.txt >> screens.txt

# Inner variations
sed -n 7,19p wall-2.txt >> screens.txt
sed -n 7,19p wall-3.txt >> screens.txt
sed -n -e 7,10p -e 16,19p wall-3-3.txt >> screens.txt
sed -n -e 7,10p -e 16,19p wall-3-4.txt >> screens.txt
sed -n -e 7,10p -e 16,19p wall-3-5.txt >> screens.txt
sed -n -e 7,10p -e 16,19p wall-3-6.txt >> screens.txt
sed -n 10,16p wall-4.txt >> screens.txt
sed -n 10,10p wall-4-3.txt >> screens.txt
sed -n 10,13p wall-4-4.txt >> screens.txt
sed -n 7,19p wall-4-5.txt >> screens.txt
sed -n 7,19p wall-4-6.txt >> screens.txt
sed -n 10,16p wall-5.txt >> screens.txt
sed -n 10,16p wall-5-4.txt >> screens.txt
sed -n 10,16p wall-5-5.txt >> screens.txt
sed -n 10,16p wall-5-6.txt >> screens.txt
