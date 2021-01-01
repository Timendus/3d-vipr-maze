# 3D VIP'r Maze

A watered down version of [3D Viper Maze](https://github.com/Timendus/3d-viper-maze),
my [Octojam 7](https://itch.io/jam/octojam-7) submission. Challenge: reduce the
instruction set, speed requirements and overall program size to make it run on
"standard" Chip-8 interpreters. And preferably the original hardware from the
time period too.

## TODO List

* [x] Chuck out music and music code
* [ ] Chuck out four colours and adapt code that renders it
  * [x] Bitmaps
  * [x] Rewrite rendering to use 8x15 tiles
  * [x] Sprites
  * [ ] Pre-XORed finish
* [x] Chuck out font and text routines
* [x] Find & replace out all the invalid instructions
  * [x] `audio`
  * [x] `scroll-up`
  * [x] `plane`
  * [ ] `i := long NNNN`
    * [ ] Reduce the program size to fit in ~3.5K bytes
* [ ] See what we're left with and try to make a game out of it again...
