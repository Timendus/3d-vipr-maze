#!/usr/bin/env node
const fs = require('fs');

const input = `
pointer hall-0+16+1     # leaf 0
pointer hall-3+16+1     # leaf 1
pointer hall-4+16+1     # leaf 2
pointer wall-1+16+1     # leaf 3
pointer wall-2+16+1     # leaf 4
pointer wall-3+16+1     # leaf 5
pointer wall-3-3+16+1   # leaf 6
pointer wall-3-4+16+1   # leaf 7
pointer wall-3-5+16+1   # leaf 8
pointer wall-3-6+16+1   # leaf 9
pointer wall-4+16+1     # leaf 10
pointer wall-4-3+16+1   # leaf 11
pointer wall-4-4+16+1   # leaf 12
pointer wall-4-5+16+1   # leaf 13
pointer wall-4-6+16+1   # leaf 14
`;

const labels = input.split('\n')
                    .map(i => i.split(' ')[1])
                    .filter(i => i);

console.log('Comparing:');
console.log(labels);

const linesSeen = {};

labels.forEach(label => {
  const file = `./screens/${label.split('+')[0]}.txt`;
  const lines = fs.readFileSync(file).toString().split('\n');
  const line = lines[lines.indexOf(`: ${label}`) + 1];
  if ( Object.keys(linesSeen).includes(line) )
    console.log(`'${label}' is a duplicate of '${linesSeen[line]}'`);
  else
    linesSeen[line] = label;
});
