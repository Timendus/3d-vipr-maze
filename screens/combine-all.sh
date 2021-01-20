#!/bin/bash

# Just combine all parts of all screens, no smarts

echo "" > screens.txt
for file in *
do
  if [ "${file: -4}" == ".txt" ] && [ "$file" != "screens.txt" ] && [ "$file" != "compressed-screens.txt" ]
  then
    echo $file;
    cat $file >> screens.txt
  fi
done
