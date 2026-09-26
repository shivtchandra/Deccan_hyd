import test from 'node:test';
import assert from 'node:assert/strict';
import {ALL_ENCOUNTERS,SCENES,STORY,storyStage,resolveEncounter} from './neighbourhood.mjs';

test('all passages and encounters have valid destinations',()=>{
  for(const scene of SCENES){
    for(const p of scene.passages) assert.ok(SCENES.some(s=>s.id===p.to));
    for(const id of scene.encounters) assert.equal(ALL_ENCOUNTERS.find(e=>e.id===id)?.scene,scene.id);
  }
});
test('old memories survive without skipping the invitation story',()=>{
  assert.equal(storyStage(['chai','bangles','attar']),0);
  assert.equal(storyStage(['recipient']),0);
  assert.equal(resolveEncounter(ALL_ENCOUNTERS.find(e=>e.id==='recipient'),[]).locked,true);
});
test('the story progresses in order and can be replayed after completion',()=>{
  const memories=[];
  STORY.forEach((step,i)=>{
    assert.equal(storyStage(memories),i);
    assert.ok(!resolveEncounter(ALL_ENCOUNTERS.find(e=>e.id===step.id),memories).locked);
    memories.push(step.id);
  });
  assert.equal(storyStage(memories),5);
  assert.ok(!resolveEncounter(ALL_ENCOUNTERS.find(e=>e.id==='letter'),memories).locked);
});
