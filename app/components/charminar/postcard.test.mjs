import test from 'node:test';import assert from 'node:assert/strict';import {readTrail,canInspect,CLUES} from './postcard.mjs';
test('postcard discovery requires proximity and stops after final clue',()=>{assert.equal(canInspect(0,{x:0,y:0}),false);for(let i=0;i<3;i++)assert.equal(canInspect(i,{x:CLUES[i].x,y:CLUES[i].y}),true);assert.equal(canInspect(3,{x:4340,y:1060}),false);});
test('corrupt progress resets without skipping clues',()=>{for(const value of ['bad','-1','4','null','"2"'])assert.equal(readTrail(value),0);assert.equal(readTrail('2'),2);});
