#!/usr/bin/env node

const source = process.argv[2];
const target = process.argv[3];

if ( !source || !target )
  return console.error('Usage: ./compress.js <source file> <target file>');

console.log(`Compressing ${source} to ${target}...`);

const fs = require('fs');
const byteExpr = /0x[0-9a-fA-F]{1,2}/g;
let compressed = 0;
let uncompressed = 0;
let output = '';

const input = fs.readFileSync(source)
                .toString()
                .split("\n");

for(let line of input) {
  if ( line.match(byteExpr) ) {
    uncompressed += countBytes(line);
    line = compress(line);
    compressed += countBytes(line);
  }
  output += `${line}\n`;
}

fs.writeFileSync(target, output);

console.log(`Original size:     ${uncompressed} bytes`);
console.log(`Compressed size:   ${compressed} bytes`);
console.log(`Compression ratio: ${Math.round((1-compressed/uncompressed)*1000)/10}%`);

function segments(bytes) {
  const segments = [];
  let repetitions = 1;

  for ( let i = 0; i < bytes.length; i++ ) {
    if ( bytes[i] == bytes[i+1] )
      repetitions++;
    else {
      segments.push([repetitions, bytes[i]]);
      repetitions = 1;
    }
  }

  return segments;
}

function runlengths(segments) {
  const runlengths = [];
  let j = 0;

  for ( const segment of segments ) {
    if ( segment[0] == 1 ) {
      // Combine single elements to an array
      if ( !runlengths[j] ) runlengths[j] = [ 0 ];
      runlengths[j].push(segment[1]);
    } else if ( segment[0] == 2 ) {
      // We don't separate pairs, because they are more likely to cost us space
      // than save it.
      if ( !runlengths[j] ) runlengths[j] = [ 0 ];
      runlengths[j].push(segment[1]);
      runlengths[j].push(segment[1]);
    } else {
      // Longer runs will be encoded
      if ( runlengths[j] ) j++;
      runlengths[j] = segment;
      j++;
    }
  }

  for ( let i = 0; i < runlengths.length; i++ ) {
    // Replace zeros with the actual length and a one in the first nibble
    if ( runlengths[i][0] == 0 )
      runlengths[i][0] = (runlengths[i].length - 1) | 0x10;
    // Convert run lengths to hex
    runlengths[i][0] = '0x' + runlengths[i][0].toString(16);
  }

  return runlengths;
}

function compress(line) {
  line = line.trim().split(' ');
  const sgmnts = segments(line);
  const rnlngts = runlengths(sgmnts);
  return '  ' + rnlngts.flat().join(' ');
}

function countBytes(line) {
  return (line.match(byteExpr) || []).length;
}