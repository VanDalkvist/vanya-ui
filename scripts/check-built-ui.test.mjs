import test from 'node:test';
import assert from 'node:assert/strict';
import {assertBuiltUi} from './check-built-ui.mjs';
test('compiled CSS oracle requires both token domains and shared generated utility',()=>{
 const css=':root{--ground: white;--accent: red;--type-body-size: 1rem}.ui-size{}.ui-action-button{}.rounded-sm{}';
 assert.doesNotThrow(()=>assertBuiltUi(css));
 for(const literal of ['--ground:','--accent:','--type-body-size:','.ui-size','.ui-action-button','.rounded-sm'])assert.throws(()=>assertBuiltUi(css.replace(literal,'')),/Missing compiled UI CSS/);
});
