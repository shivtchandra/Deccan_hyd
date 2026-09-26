# Old Charminar — experience review and plan

Planning review, 22 September 2026. No application code changed.

## Recommendation

Create **An Evening at Charminar**: an illustrated neighbourhood that rewards lingering, listening and discovering everyday life. Keep the monument as the visual anchor, but make the people the emotional centre. Start with one convincing street corner before expanding the whole bazaar.

The era is pending the user's preference. Working recommendation: remembered Old City around the 1980s–90s. This is a proposed art direction, not a verified historical reconstruction. The alternatives are late Nizam-era life or an explicitly timeless interpretation. Date-sensitive architecture, transport, clothing, shop names and sounds must follow the selected period.

## Evidence reviewed

- Reference: https://whereismrkim.com/ — opened the entry screen and entered the illustrated market. Observed a target portrait, one clear search objective, a five-minute timer, large readable figures, richly drawn stalls and very little interface. The page offers dragging, arrow-key movement, scroll/pinch zoom and tapping the target. This review does not claim a complete playthrough or knowledge of its rendering implementation.
- Current working tree: opened the Charminar experience at localhost:3001/?diorama=charminar and visually inspected the initial composition. Port 3000 belongs to another app.
- Read focused sections of IsometricDiorama.jsx, IsometricCityEngine.js and charminarCityData.js. Existing uncommitted edits and deleted legacy files were left intact.
- Scope is the Charminar experience, not a redesign of the surrounding heritage map.

## Why the existing scene falls short

| Finding | Evidence | Consequence / proposed change |
|---|---|---|
| Architecture dominates the experience | Initial viewport centres a large, detailed Charminar; people are small and visually softer | Compose an opening view around a readable human encounter with Charminar behind it; retain an overview |
| People look composited | Backdrop and character assets have different apparent sharpness, contrast and scale | One art specification for line weight, light direction, palette, perspective and output resolution; judge all assets together |
| Walking is mechanically repetitive | Up to 330 walkers reuse 16 character assets; walkerAt uses straight ping-pong paths; renderer moves a static pose with a sine bob | Fewer, more varied inhabitants with destinations, pauses, conversations and actual walk frames |
| Depth is limited | Background renders in a single pass, followed by y-sorted people and relic sprites | Split foreground counters, awnings, walls and arches into occlusion layers; people must disappear behind the right objects |
| Interaction starts as collection | Initial HUD asks for biscuits and shows 0/6 | Offer free wandering; optional clues lead to people doing things, with collecting a secondary reward |
| Audio cues are synthetic stand-ins | Chai sound is an oscillator pitch sweep; other events use simple tones | Record or license recognisable pours, glass, footsteps and human ambience; implement one shared audio mixer |
| Time of day is largely a grade | Golden hour overlays a gradient; night darkens the scene and adds light pools | Finish one coherent evening first. Later lighting changes should alter lamps, shadows, shop activity and sound |
| Historical framing is unresolved | Current data includes both early historical landmarks and a cafe labelled established in 1993; visible art has autos and satellite dishes | Choose a period before producing assets. Verify named places and dates; label any composite geography or invented characters |

The current art has strengths: a recognisable central landmark, warm materials, rich shops and a useful explorable composition. Reuse the navigation, discovery model and progress storage where they fit. More particles or more walkers alone will not solve the coherence problem.

## Proposed first minute

1. **Arrival:** Charminar is visible beyond an awning and a readable shopfront. Title: “An Evening at Charminar.” One action: “Enter the bazaar.” Sound is an explicit choice; the scene works silently.
2. **First encounter:** A bangle maker works at a counter. Someone waits, another customer chooses a colour. A small gesture or light catch invites a tap.
3. **Response:** The maker completes a short action. A brief line of locally reviewed dialogue or caption explains the moment. The scene stays visible; longer history is optional.
4. **Invitation:** A natural clue points toward the next lane. Visitors can follow it, pan freely, or simply watch.
5. **Memory:** Discoveries enter a small memory book. No compulsory countdown. The feeling to test is “I want to stay here,” alongside “I want to find the next thing.”

These are proposed scenes, not historical testimony. Scripts, language and period details need local review.

## Art direction

- **Audience:** Hyderabad residents, diaspora, curious visitors and families.
- **Tone:** intimate, lively, nostalgic.
- **Direction:** richly illustrated Old City street life with readable silhouettes, textured stone, worn paint and luminous shop interiors.
- **Layout:** full-screen world, one compact clue, sound control, memory book and exit. Details use a modest side panel or mobile sheet. No marketing sections or dashboard over the scene.
- **Provisional tokens:** limestone #D9BE8D, shadow ink #302B26, faded teal #3F6B67, lac red #9A3936, brass #BC8A40, evening blue #465361. Derive final values from the approved scene art.
- **Type:** Hind for readable interface text, restrained Noto Serif for chapter titles; locally reviewed Telugu/Urdu signage with appropriate script fonts. Never use generated illegible lettering as historical signage.
- **UI surfaces:** charcoal underlays where needed, small radii, 8px spacing rhythm, 44px minimum controls. A restrained inset-press primary action; no ornamental pill collections.
- **Catalog review:** design-director searches returned the Apple museum-like presentation system; borrow its receding interface, not its blue/white branding. A custom scene-derived palette is warranted here. Effect 105, image curtain reveal, can inform a short entrance transition; effect 107, before/after slider, is reserved for a later historical-photo view.
- **Motion families:** camera movement, character/environment activity, brief discovery acknowledgement. No scroll hijacking or decorative cursor effects. Reduced motion removes camera travel and ambient loops while preserving discoveries.
- **Imagery plan:** one approved corner composition and character scale sheet first; layered environment assets follow. No new artwork was generated during this planning pass.
- **Atmosphere continuity:** dusty gold light, cool shaded lanes, saturated textiles and worn surfaces must be shared by environment, characters, overlays and memory illustrations.

## Asset and scene contract

Use one fixed illustrated camera angle. Keep a common ground plane and foot anchors. Separate ground, rear architecture, actors, occluding foreground architecture, local light and effects. Author depth metadata and walkable zones from the same scene coordinates as the art.

Prototype with 8–12 distinct people, three readable encounters and two nearby shops. Add directional walk cycles, idle gestures, seated poses and task actions. Use contact shadows and consistent edge treatment. People should queue, browse, carry something and stop to speak; crowd density should vary by place. Thin crowds before sacrificing individual legibility on phones.

Proposed encounters: bangle making, a chai pour, and a customer examining a small craft object. Expand to textiles, perfume, pearls or other trades only after period and local review. Do not mechanically attach a sound or trivia paragraph to every passer-by.

Record or license short audio layers; store provenance. Ambient sound follows camera proximity, speech is occasional and captioned, mute persists, and nothing autoplays before a user gesture. No source or historical claims have been independently verified in this design review.

## Implementation sequence and gates

1. **Period and references:** select the era; assemble a small set of archival/street references with sources, dates and rights. Review architecture, street layout, dress, transport, trades and language. Gate: a coherent scene brief without conflicting periods.
2. **Art proof:** finish one corner and a character sheet at desktop and phone scale. Gate: people belong in the same painting, Charminar remains identifiable, details invite looking closer.
3. **Playable slice:** build that corner with three interactions, actual walk cycles, occlusion, camera controls, captions and sound opt-in. Gate: a visitor can enter, find an encounter and recover their position without explanation.
4. **Experience test:** observe a handful of Hyderabad locals and unfamiliar visitors. Ask what place/period it evokes, what feels wrong and whether they want to keep exploring. Revise the corner before enlarging it.
5. **Expand:** extend to a small connected bazaar, optional clues and the memory book; retain a stable entrance from the heritage map. Gate: new assets maintain the approved visual and cultural standard.
6. **Ship checks:** real phone testing, pinch and tap behaviour, keyboard access, equivalent DOM encounter list, captions, reduced motion, muted mode, load failures and saved-progress versioning. Performance targets: responsive drag on a midrange phone, sustained 30fps minimum there and 60fps desktop where feasible; measure before claiming success.

## Engineering boundaries

- Keep Next.js and React. The present renderer is Canvas 2D despite Pixi being installed. Begin with a layered Canvas slice; use measured performance or asset requirements to justify a Pixi migration. Do not assume full 3D is necessary.
- Separate scene coordinates/content from rendering, UI and audio as needed for this work; avoid unrelated map refactors.
- Share one coordinate contract for camera, hit targets, depth, navigation masks and accessible encounter controls. Re-audit old hotspot coordinates against replacement artwork.
- Load the opening corner first, defer distant high-resolution assets, use atlases if profiling supports them, cull off-screen actors, pause hidden-tab rendering and cap device pixel ratio appropriately.
- Preserve existing working changes. Build the new experience in an isolated route/module, then integrate after the slice passes its gates.
- Defer multiple eras, full day/night simulation, a large crowd, multiplayer and new map features.

## Next concrete deliverable

A period-specific art brief and one street-corner composition, followed by a playable 30–60 second slice. The full bazaar should wait until that slice establishes the feeling.
