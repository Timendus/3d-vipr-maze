#!/bin/bash
# Usage: ./count-size.sh <file or directory>

echo "Rough size estimation:"

function count_size {
  # Find lines of code
  LINES=`cat $1 | sed '/^[ \t]*#/d' | sed '/^:/d' | sed '/^$/d' | wc -l`

  # Size in bytes is roughly lines of code x2
  SIZE=$((LINES*2))

  echo "  $SIZE  $1"
}

if [ -f $1 ]
then
  count_size $1
else if [ -d $1 ]
  then
    for FILE in ${1}/*
    do
      if [ "${FILE: -3}" == ".8o" ]
      then
        count_size $FILE
      fi
    done
  fi
fi
