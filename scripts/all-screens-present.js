#!/usr/bin/env node
const fs = require('fs');

const binTree = fs.readFileSync('data/binary-tree.8o')
                  .toString()
                  .split('\n')
                  .filter(l => l.match(/^\s+pointer/i))
                  .map(l => l.trim().split(' ')[1]);

const screens = fs.readFileSync('screens/compressed-screens.txt')
                  .toString()
                  .split('\n')
                  .filter(l => l.match(/^: /i))
                  .map(l => l.trim().split(' ')[1]);

screens.forEach(screen => {
  if ( !binTree.includes(screen) )
    console.log(`Screen ${screen} is not in the binary tree`);
});

binTree.forEach(leaf => {
  if ( !screens.includes(leaf) )
    console.log(`Leaf ${leaf} is not in the screens file`);
});
