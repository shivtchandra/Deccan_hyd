import test from 'node:test';
import assert from 'node:assert/strict';
import {walkPose,deformWalk} from './walk-pose.mjs';

test('gait stops completely and alternates support feet',()=>{
  const still=walkPose(6,false);
  assert.equal(still.stride,0);
  assert.equal(still.bob,0);
  const a=walkPose(0,true);
  assert.ok(a.leftLift>=0&&a.rightLift>=0);
  assert.ok(a.leftLift>0||a.rightLift>0);
  const b=walkPose(9,true);
  // Opposite phase should prefer the other foot
  assert.ok(Math.abs(a.leftLift-b.leftLift)+Math.abs(a.rightLift-b.rightLift)>0.5);
  assert.deepEqual(walkPose(6,true,true),walkPose(0,false));
});

test('walking leaves the head fixed and restores exact resting geometry',()=>{
  const rest=new Float32Array([26,5,18,67,34,67]),v=new Float32Array(rest);
  deformWalk(v,rest,52,70,walkPose(6,true));
  // Head near top stays nearly fixed horizontally (bob may shift y slightly)
  assert.ok(Math.abs(v[0]-rest[0])<1.5);
  assert.notEqual(v[2],rest[2]);
  deformWalk(v,rest,52,70,walkPose(0,false));
  assert.deepEqual([...v],[...rest]);
});

test('pace changes step frequency without breaking pose shape',()=>{
  const slow=walkPose(20,true,false,0.7);
  const fast=walkPose(20,true,false,1.3);
  assert.ok('bob' in slow&&'sway' in fast);
  assert.notEqual(slow.stride,fast.stride);
});
