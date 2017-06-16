#!/usr/bin/env node

'use strict';

let index = require('./../lib/index');
let process = require('process');

let inputParam = process.argv.find((el) => el.includes('input'));
let outputParam = process.argv.find((el) => el.includes('output'));
let input, output;

if (inputParam) {
    input = inputParam.split('=')[1];
}
if (outputParam) {
    output = outputParam.split('=')[1];
}

index.upgradeComponent(input, output);