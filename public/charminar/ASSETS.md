# Charminar evening assets

Generated with the built-in image generation tool on 22 September 2026 for this project. These are fictional illustrated scenes, not archival photographs. The existing Charminar assets were preserved.

## evening-bazaar.png

Source: `exec-71e12d39-0c41-482d-bfa6-23738bc620e9.png` in the task's generated-images directory. Saved at `public/charminar/evening-bazaar.png`.

Final generation prompt:

> Use case: illustration-story. Asset type: panoramic environment artwork for an interactive illustrated Old Hyderabad experience, landscape 1536x1024 or wider. Create a gorgeous meticulously hand-drawn ink and gouache illustration of one intimate bazaar square around Charminar, Hyderabad, at blue-and-gold dusk, imaginatively evoking the 1980s–90s. Elevated oblique 3/4 view, closer and more human than a city map. Recognisable Charminar with its FOUR slender minarets, four great arches, ornate stucco galleries, in the upper middle distance, occupying about the middle 30 percent of the image. A winding open cobbled lane leads toward it. Three legible foreground encounter areas: left at x22% y65% a small chai stall with large brass kettle, cups and seated customers under a faded teal awning; centre lower at x51% y82% a bangle maker's wooden counter with lac-red and green bangle trays and two women customers; right at x80% y62% a perfumer's warmly glowing tiny shop with amber glass bottles and a seated shopkeeper. 12-16 beautifully drawn Indian people of different ages in varied period appropriate everyday clothing, each with expressive readable gestures, all integrated naturally into the scene. Many fine intimate details: a leaning bicycle, stacked cups, a sleepy cat, flowers, cloth awnings, timber shutters, warm lamps, weathered limestone, red oxide steps. Rich composition with occluding foreground awnings at edges, cool muted indigo shadows, glowing amber shop windows, dusty rose and teal fabric. Visible delicate pen linework, controlled print-like flat gouache pigments, editorial illustrated storybook sophistication, coherent scale and light. The people must be drawn with the same confident sharp outlines as architecture, not blurry cutouts. Lively and affectionate, authentic Deccan atmosphere, not fantasy palace or Mughal tourist collage. No text, no logos, no labels, no UI, no border, no typography, no satellite dishes, no cars, no modern towers. Full bleed detailed finished artwork, NOT a website screenshot. Leave the lane navigable and visually clear; no dense crowd.

## walker.png

New four-pose sprite sheet generated using the scene above as a style reference. Equal horizontal cells, displayed with a stepped animation.

Generation prompt:

> Create a NEW game sprite sheet matching the delicate warm ink-and-gouache illustration style of the reference Old Hyderabad scene. Only one adult Indian male pedestrian wearing a faded dusty-blue long shirt and cream trousers, dark sandals, viewed from behind and slightly from his left side, walking away down the lane. Four sequential walk-cycle poses of THE SAME character, side by side in exactly FOUR EQUAL WIDTH CELLS across a single horizontal row, 1536x1024 landscape image, each full-body character centred in his own quarter, exact same head height and soles baseline in all four cells, entire body visible and large with ample transparent margins. Pose 1 left foot forward, pose 2 passing feet, pose 3 right foot forward, pose 4 passing feet. Same clothing, figure size, lighting and identity. Genuine transparent alpha background everywhere except the four characters; NO scenery, NO ground plane, NO shadow, NO text, NO frame, NO grid lines. These are individual animation frames; do not draw a scene. Draw character full height from y=150 to y=900 in every cell. Detailed hand-painted figure, soft golden light from right.

A background-extraction refinement was attempted but not used. The original sprite was verified to already have a transparent alpha channel and is the shipped `walker.png`. Attempted refinement prompt:

> Use case: background-extraction. Remove ONLY the entire dark brown/black/golden studio background and all glow surrounding the FOUR characters. Output genuine transparent RGBA alpha channel in every background pixel. Preserve the four characters, their exact positions, poses, clothing, colours, scale, canvas dimensions and cell spacing. Do not draw any new background, checkerboard pattern or shadow. This must be a usable transparent game sprite sheet: opaque painted humans with clean antialiased edges surrounded by actual zero-alpha transparency. Keep every hand and foot intact. No other changes.

## Sound

Web Audio generated ambience and short illustrative effects. No third-party recordings or historical voice claims. Audio is opt-in; no source audio assets are bundled.
