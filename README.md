# 3D VIP'r Maze

A watered down version of [3D Viper
Maze](https://github.com/Timendus/3d-viper-maze), my [Octojam
7](https://itch.io/jam/octojam-7) submission. Challenge: reduce the instruction
set, speed requirements and overall program size to make it run on "standard"
Chip-8 interpreters. And preferably the original hardware from the time period
too.

## TODO List

* [x] Chuck out music and music code
* [ ] Chuck out four colours and adapt code that renders it
  * [x] Bitmaps
  * [x] Rewrite rendering to use 8x15 tiles
  * [x] Sprites
  * [ ] Top-down sprites
  * [ ] Pre-XORed finish
* [x] Chuck out font and text routines
* [x] Find & replace out all the invalid instructions
  * [x] `audio`
  * [x] `scroll-up`
  * [x] `plane`
  * [ ] `i := long NNNN`
    * [ ] Reduce the program size to fit in ~3.5K bytes
* [ ] See what we're left with and try to make a game out of it again...

## Development notes

### Beginning is easy

You just take the instructions that are in XO-Chip, but not in regular Chip-8,
and get to work removing those instructions. For this game that meant first and
foremost to remove all the code and data that has anything to do with sound and
colour.

Throwing out the sound was easy enough; the code was mostly in a single file
with relatively few calls to it. The sound data was also in a single file.
Bye bye... 🎶

Colour was slightly more difficult. It's not enough to just remove all the
`plane` instructions from the program; the image to binary data scripts also
needed to change, so they wouldn't load the extra plane of image data anymore.
While I was working on those scripts I also made them cut the images up in 8x8
sprites instead of 16x16, so we can more easily address the different parts of
the images. Regular Chip-8 doesn't have a way to render 16x16 sprites, as
XO-Chip does.

So the next challenge was to adapt the rendering code to render 8 pixel wide
columns. I kinda forgot that we can render 8xN sprites in Chip-8, where N is a
nibble (0-15). That's a very handy thing to have. The larger the number of
pixels that we can render in one go, the faster the rendering will be. According
to Wikipedia Chip-8 will render a height of N+1 pixels (allowing 16 vertical
pixels), but Octo doesn't seem to think so (and sticks with 15 pixels). But 15
is fine too. We can live with missing the top and bottoms rows from our rendered
image, if that speeds rendering up by a factor of two!

The next things to go were the "drop dead" animation (which used `scroll-up`)
and the text routines. The font was pretty large and the text rendering way too
slow for Chip-8. So that had to go.

Finally, I threw out all the things that weren't gameplay related, like the
title screens, introduction screens and end-of-game screen. Those just take up
space and don't add so much to the game experience.

### For good measure

Those last few steps were also because I knew that the original game was waaay
to large to fit in the miserably small memory size of Chip-8. I needed to cut
away as much as possible to lose some dead weight, otherwise this was never
going to work. Because the last and hardest XO-Chip instruction I needed to
remove was `i := long NNNN`...

We need to go from 16 bits addresses back to 12 bit addresses. Not just the game
code, but the **whole game** now needs to fit within the magic 3.5K limit. I
wondered where I stood with this endeavour, seeing as I had already halved the
number of bytes in the image data going from four to two colours, and thrown out
quite a few bytes left and right. So I made a rough overview of which data was
where in memory.

The result wasn't very promising.

| Address space | Size | Contents                    |
|---------------|------|-----------------------------|
| $0000 - $0200 |  512 | Interpreter code            |
| $0200 - $0B70 | 2416 | Game code                   |
| $0B70 - $2700 | 7056 | Tiles, screens, binary tree |
| $2700 - $29A8 |  680 | Map data and game state     |

Even without the text and music code, my program code size alone was nearing the
3.5K limit 😮

So the code needed to go on a diet first. We can add compression to the image
data, or reduce the resolution, or maybe reuse sprites. We can reduce the number
of game levels. But we can't wish away real program code. The next step I took
was to investigate where exactly all this game code "lives". I wrote a script to
roughly measure the size of each of my source code files.

Roughly speaking, each line of code in Chip-8 is two bytes, give or take. So my
script just iterates over all files, throws out comments and empty lines and
does the remaining line count times two. It's by no means perfect, but it's a
good enough estimate for now.

These were the results:

```
Rough size estimation:
  218  ./src/key-input.8o
  56   ./src/main.8o
  130  ./src/map-management.8o
  372  ./src/map-triggers.8o
  136  ./src/mini-map.8o
  224  ./src/render-3d.8o
  16   ./src/shared-macros.8o
  348  ./src/transitions.8o
  252  ./src/viper-ai.8o
```

We can't lose the key input, the main file, the map management or the 3D
rendering code (unless we make this into a completely different game). We can
however simplify the map triggers, and choose to throw out the mini map and
either throw out or greatly simplify the vipers. Maybe the buttons or the coins
need to go, maybe the mini map, maybe the vipers, maybe just the viper
animations. Or maybe all of them.

So far I hadn't really thrown anything out that significantly changed the
gameplay. But any of these choices would definitely do that, and reduce the fun,
the interactivity, the stuff that makes the game worth playing.

### Back to the drawing board

So needless to say, I'm not a happy coder at this point 😂

Maybe I just need to go back to the start, and instead of trying to reduce a
complete game with all these bells and whistles, try to get the 3D rendering
stuff to run on Chip-8 first. And then see what we can add, if anything. That
may make it more of a "tech demo" than a game though. But I suppose that's fine
too.
