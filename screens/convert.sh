#!/bin/bash
#
# This script converts any PNG files (that use the right colours and dimensions)
# in this directory to .txt files, using ImageMagick and some Bash magic.
# (Adapted from 16x16 four colour version, so it may be a bit convoluted)

for file in *
do
  if [ "${file: -4}" == ".png" ]
  then
    filename="${file%%.*}.txt"
    if [ "$file" -nt "$filename" ]
    then
      echo "Converting '$file'..."
      echo "" > "$filename"

      for ((x=0;x<64;x+=8))
      do
        for ((y=1;y<31;y+=30))
        do
          # Read in the source file as RGB values, one per line
          values=`convert "$file" -crop 8x30+$x+$y rgb:- | xxd -ps | tr -d '\n' | fold -w6`

          # Convert RGB colours to one bit layer
          layer1=()
          for value in $values
          do
            case $value in
              662200)
                layer1+='0'
                ;;
              996601|795548)
                layer1+='0'
                ;;
              ff6602)
                layer1+='1'
                ;;
              ffcc01|ffc107)
                layer1+='1'
                ;;
              *)
                echo "Unkown colour: $value"
            esac
          done

          # Fix the order of the bytes so we have left column first, then right
          layer1=`echo $layer1 | fold -w8`

          # Convert to hexadecimal values
          layer1bytes=()
          for value in $layer1
          do
            layer1bytes+=`printf '0x%x ' "$((2#$value))"`
          done

          # Output to file
          echo ": ${file%%.*}+$x+$y
    $layer1bytes
  " >> "$filename"
        done
      done
    fi
  fi
done
