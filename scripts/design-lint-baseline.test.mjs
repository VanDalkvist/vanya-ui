import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeWarning,compareBaseline} from './design-lint-baseline.mjs';
const rule='value-type-custom-property-required-list';
const text='Expected "13px" to be a custom property, as of type "<length>"';
const w={rule,text:text+' ('+rule+')',line:2};
const entry={file:'src/x.css',rule,message:text,source:'.x { font-size:13px; }'};
test('normalize Stylelint JSON line and exact rule suffix for CRLF and LF',()=>{
 for(const nl of ['\n','\r\n'])assert.deepEqual(normalizeWarning('src/x.css',w,'/* comment */'+nl+'  '+entry.source),entry);
});
test('missing source cannot pass',()=>assert.throws(()=>normalizeWarning('src/x.css',w,'')));
test('existing debt matches once, duplicate new violation fails',()=>{
 assert.deepEqual(compareBaseline([entry],[entry]),{newFindings:[],resolved:[]});
 assert.deepEqual(compareBaseline([entry,entry],[entry]),{newFindings:[entry],resolved:[]});
});
test('changed source, changed rule or new file fails, removal resolves',()=>{
 for(const changed of [{...entry,source:'.x { font-size:14px; }'},{...entry,file:'src/y.css'},{...entry,rule:'another'}])assert.deepEqual(compareBaseline([changed],[entry]),{newFindings:[changed],resolved:[entry]});
 assert.deepEqual(compareBaseline([],[entry]),{newFindings:[],resolved:[entry]});
});
