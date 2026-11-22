import test from 'node:test';
import assert from 'node:assert/strict';
import {visualFiles,verify} from './check.mjs';
const good={changed:['app/src/board.jsx'],packages:[{dependencies:{react:'19','@vanya/ui':'github:VanDalkvist/vanya-ui#sha'},scripts:{'test:e2e':'playwright test'}}],policy:'https://github.com/VanDalkvist/vanya-ui',sources:'import {ScrollRegion} from "@vanya/ui";'};
test('accept valid React consumer',()=>assert.equal(verify(good).status,'pass'));
test('reject UI without runtime and browser tests',()=>{const x=verify({...good,packages:[{dependencies:{react:'19'}}]});assert.equal(x.status,'fail');assert.equal(x.problems.length,2);});
test('non UI changes do not require React',()=>assert.equal(verify({...good,changed:['server/main.ts']}).status,'skip'));
test('SVG reference follows canonical visual guide',()=>assert.equal(verify({...good,changed:['public/chart.svg'],packages:[],sources:''}).status,'pass'));
test('ignore generated and docs',()=>assert.deepEqual(visualFiles(['docs/a.svg','dist/app.js','app/src/board.jsx']),['app/src/board.jsx']));
