import test from 'node:test';
import assert from 'node:assert/strict';
import {START,SPEED,DISTRICTS,ACTIVITIES,blankSave,restoreGame,beginAction,tickAction,serialise,phaseAt,walkable} from './game-world.mjs';
import {findPath,clearLine,directMove} from './navigation.mjs';
test('every district and activity is reachable without crossing a wall',()=>{
  for(const target of [...DISTRICTS,...Object.values(ACTIVITIES).map(a=>({x:a.point[0],y:a.point[1]}))]){
    const path=findPath(START,target);assert.ok(path.length);let previous=START;
    for(const next of path){assert.ok(clearLine(previous,next));previous=next;}
    assert.ok(Math.hypot(previous.x-target.x,previous.y-target.y)<35);
  }
});
test('side passages connect, blocked taps redirect, and direct movement collides',()=>{
  for(const p of [{x:2200,y:695},{x:3600,y:720},{x:4230,y:940},{x:-99,y:-99}]){
    const path=findPath(START,p);assert.ok(path.length);assert.ok(walkable(path.at(-1)));
    let prev=START;for(const n of path){assert.ok(clearLine(prev,n));prev=n;}
  }
  const p={x:1000,y:1000};for(let i=0;i<100;i++)directMove(p,0,-1,10);assert.ok(walkable(p));assert.ok(p.y>=965);
});
test('route length and evening timing match the planned pace',()=>{
  assert.ok((4500-START.x)/SPEED>100);assert.ok((4500-START.x)/SPEED<115);
  assert.deepEqual([0,300,720,900].map(phaseAt),['sunset','lamplight','closing','closing']);
});
test('activities require proximity; parcel completes only at the recipient',()=>{
  const s=blankSave();assert.equal(beginAction(s,'chai'),null);
  s.player={x:3270,y:1040};s.active=beginAction(s,'parcel');assert.ok(s.active);
  assert.equal(beginAction(s,'parcel'),null);assert.equal(tickAction(s,2),null);tickAction(s,2);
  assert.equal(s.parcel,'carrying');assert.equal(s.memories.parcel,undefined);
  s.player={x:3650,y:1010};s.active=beginAction(s,'radio');assert.equal(s.active.delivery,true);tickAction(s,8);
  assert.equal(s.parcel,'delivered');assert.ok(s.memories.parcel);
});
test('all six activities complete and choices survive reload',()=>{
  const s=blankSave();for(const [id,a]of Object.entries(ACTIVITIES)){s.player={x:a.point[0],y:a.point[1]};s.active=beginAction(s,id,'green');tickAction(s,a.duration);}
  // A delivered parcel takes precedence over music once, then the radio can be played.
  s.player={x:3650,y:1010};s.active=beginAction(s,'radio','courtyard');tickAction(s,8);
  const restored=restoreGame(serialise(s));assert.equal(Object.keys(restored.memories).length,6);assert.equal(restored.song,'courtyard');assert.equal(restored.memories.bangles.colour,'green');
});
test('old sketches migrate and malformed saves cannot spawn outside streets',()=>{
  assert.deepEqual(restoreGame('bad'),blankSave());
  assert.equal(restoreGame(null,'{"memories":{"chai":{},"bangles":{"colour":"green"}}}').memories.bangles.colour,'green');
  assert.deepEqual(restoreGame('{"version":2,"player":{"x":0,"y":0}}').player,START);
});
