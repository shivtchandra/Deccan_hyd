/**
 * Distance-driven gait for MeshPlane people.
 * Neater cycle: stride + foot lift + body bob + slight sway.
 */

export function walkPose(distance, moving, reduced = false, pace = 1) {
  if (!moving || reduced) {
    return { stride: 0, leftLift: 0, rightLift: 0, bob: 0, sway: 0 };
  }
  // ~one full step every ~18 world units (tuned for SPEED ~40)
  const cycle = 18 / Math.max(0.65, pace);
  const phase = (distance / cycle) * Math.PI * 2;
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  // Softer lifts (raised cosine) so feet don't snap
  const leftLift = Math.pow(Math.max(0, c), 1.35) * 3.1;
  const rightLift = Math.pow(Math.max(0, -c), 1.35) * 3.1;
  // Subtle vertical bob twice per stride
  const bob = Math.abs(s) * 1.15;
  // Tiny torso sway
  const sway = s * 1.4;
  return {
    stride: s * 5.2,
    leftLift,
    rightLift,
    bob,
    sway,
  };
}

export function deformWalk(vertices, rest, width, height, pose) {
  const sx = width / 52;
  const sy = height / 70;
  for (let i = 0; i < rest.length; i += 2) {
    const u = rest[i] / width;
    const v = rest[i + 1] / height;
    // Legs from mid-thigh down
    const leg = Math.max(0, Math.min(1, (v - 0.55) / 0.38));
    const legEase = leg * leg * (3 - 2 * leg);
    // Arms / shoulders (upper body horizontal sway)
    const arm = Math.max(0, Math.min(1, (0.52 - v) / 0.28));
    const armEase = arm * arm * (3 - 2 * arm);
    const side = Math.max(-1, Math.min(1, (u - 0.5) * 14));

    let x = rest[i];
    let y = rest[i + 1];

    // Leg swing + lift
    x += side * pose.stride * sx * legEase;
    y -= (side < 0 ? pose.leftLift : pose.rightLift) * sy * legEase;

    // Opposite arm swing (subtle)
    x += -side * pose.stride * 0.35 * sx * armEase;

    // Whole-body bob (all verts) + slight sway at torso
    const torso = Math.max(0, Math.min(1, 1 - Math.abs(v - 0.4) / 0.35));
    x += pose.sway * sx * torso * 0.55;
    y -= pose.bob * sy;

    vertices[i] = x;
    vertices[i + 1] = y;
  }
}
