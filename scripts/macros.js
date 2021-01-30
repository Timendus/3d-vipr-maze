#!/usr/bin/env node
// This script can understand #if <option> / #else / #end in an input file and
// output only the right bits.
// Usage:
// $ ./macros.js <input file> <ouput file> <option 1> <option 2> ...

const fs      = require('fs');
const input   = process.argv[2];
const output  = process.argv[3];
const options = process.argv.slice(4, process.argv.length);

let lines = fs.readFileSync(input)
              .toString()
              .split('\n');

let outputting = true;
lines = lines.filter(line => {
  let matches;
  if ( matches = line.match(/^\s*#if (.*)\s*$/) ) {
    outputting = options.includes(matches[1]);
    return false;
  }
  if ( line.match(/^\s*#else\s*$/) ) {
    outputting = !outputting;
    return false;
  }
  if ( line.match(/^\s*#end\s*$/) ) {
    outputting = true;
    return false;
  }
  return outputting;
});

fs.writeFileSync(output, lines.join('\n'));
