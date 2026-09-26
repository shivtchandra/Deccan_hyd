import test from 'node:test';
import assert from 'node:assert/strict';
import {START,walkable,DISTRICTS} from './game-world.mjs';
import {findPath,clearLine,nearestWalkable} from './navigation.mjs';
import {FIND,tryFindPerson,restoreFind} from './find-one.mjs';
import {crowdPlan,walkResident} from './street-crowd.mjs';

test('neighbour spawn and districts are reachable both ways',()=>{
 const targets=[nearestWalkable(FIND.point),...DISTRICTS];
 for(const target of targets){
  assert.ok(walkable(target),(target.id||target.name||'neighbour')+' is on paving');
  for(const [start,end]of [[START,target],[target,START]]){
   const path=findPath(start,end);assert.ok(path.length,(target.id||target.name||'neighbour')+' has a route');
   let previous=start;for(const p of path){assert.ok(clearLine(previous,p));previous=p;}
   assert.ok(Math.hypot(previous.x-end.x,previous.y-end.y)<1);
  }
 }
});

test('dense crowd has grounded starts and collision-safe routines',()=>{
 const crowd=crowdPlan();
 assert.equal(crowd.length,220);
 assert.ok(crowd.every(a=>a.look!==FIND.look),'crowd does not wear Amina’s look');
 assert.ok(crowd.filter(a=>a.x>4800).length>=10);
 for(const a of crowd){assert.ok(walkable(a));let prev=a;for(const p of a.route){assert.ok(clearLine(prev,p));prev=p;}}
 for(let i=0;i<200;i++)for(const a of crowd)walkResident(a,.05,crowd);
 for(const a of crowd)assert.ok(walkable(a));
});

test('only the scrap neighbour completes the recognition',()=>{
 let state=restoreFind(null);
 const wrong=tryFindPerson(state,'resident-3');
 assert.equal(wrong.ok,false);
 assert.equal(wrong.state.found,false);
 const right=tryFindPerson(wrong.state,FIND.personId);
 assert.equal(right.ok,true);
 assert.equal(right.state.found,true);
});
