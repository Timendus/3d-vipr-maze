#!/usr/bin/env node

const MAX_RL_SIZE = 11;

const source = process.argv[2];
const target = process.argv[3];

if ( !source || !target )
  return console.error('Usage: ./compress.js <source file> <target file>');

console.log(`Compressing ${source} to ${target}...`);
console.log(`Max run length size:   ${MAX_RL_SIZE}`);

const fs = require('fs');
const byteExpr = /0x[0-9a-fA-F]{1,2}/g;
const linesSeen = [];
let compressed = 0;
let uncompressed = 0;
let numImgs = 0;
let avgRuns = 0;
let output = '';
let lastLabel;

const input = fs.readFileSync(source)
                .toString()
                .split("\n");

for(let line of input) {
  if ( line.match(byteExpr) ) {
    if ( linesSeen.includes(line) )
      console.log(`Duplicate data found at label '${lastLabel}'`);
    else
      linesSeen.push(line);
    uncompressed += countBytes(line);
    line = compress(line);
    compressed += countBytes(line);
  } else {
    lastLabel = line;
  }
  output += `${line}\n`;
}

fs.writeFileSync(target, output);

console.log(`Original size:         ${uncompressed} bytes`);
console.log(`Compressed size:       ${compressed} bytes`);
console.log(`Compression ratio:     ${Math.round((1-compressed/uncompressed)*1000)/10}%`);
console.log(`Number of images:      ${numImgs}`);
console.log(`Average RLs per image: ${avgRuns}`);

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
    // Runs of less than four make no sense because it costs three bytes to
    // interrupt a plain copy run, and each new run makes the decompression
    // slower. Add segments of less than 4 items to a plain copy.
    if ( segment[0] < 4 ) {
      if ( !runlengths[j] )
        runlengths[j] = [ 0 ];
      if ( runlengths[j].length > MAX_RL_SIZE - (segment[0]-1) )
        runlengths[++j] = [ 0 ];

      for(let i = segment[0]; i > 0; i--)
        runlengths[j].push(segment[1]);
    } else {
      // Longer runs will be encoded
      if ( runlengths[j] ) j++;
      let count = segment[0];
      while ( count > MAX_RL_SIZE ) {
        runlengths[j++] = [MAX_RL_SIZE, segment[1]];
        count -= MAX_RL_SIZE;
      }
      runlengths[j++] = [count, segment[1]];
    }
  }

  for ( let i = 0; i < runlengths.length; i++ ) {
    const length = runlengths[i][0] || (runlengths[i].length - 1);
    // Warn if we exceed the max run length (which should obviously never happen)
    if ( length > MAX_RL_SIZE )
      console.log(`ERROR: Found run that's longer than decompression can handle: ${length}`);
    // Replace zeros with the actual length and a one in the MSB
    if ( runlengths[i][0] == 0 )
      runlengths[i][0] = length | 0x80;
    // Convert run lengths to hex
    runlengths[i][0] = '0x' + runlengths[i][0].toString(16);
  }

  return runlengths;
}

function compress(line) {
  line = line.trim().split(' ');
  const sgmnts = segments(line);
  const rnlngts = runlengths(sgmnts);
  avgRuns = ( avgRuns * numImgs + rnlngts.length ) / ++numImgs;
  return '  ' + rnlngts.flat().join(' ');
}

function countBytes(line) {
  return (line.match(byteExpr) || []).length;
}
