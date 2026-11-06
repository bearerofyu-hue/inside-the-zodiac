---
status: draft
---

# Design brief: Inside the Zodiac

## The one spatial moment

The viewer begins at the center of a large, open spherical astrology chart that wraps around them. They turn to find a planet on the zodiac band, then pinch its marker to see which sign it occupies and how it relates to the other planets. Turning the head reveals new sections of the chart in the same space.

## Why it belongs on glasses

- Uses: draws in the world and leaves the body free.
- The viewer explores the chart at life scale by looking around. The chart stays in the room as the viewer turns, so a sign they just passed is still in the same direction when they look back.

## Product or overlay

- Type: a self-contained virtual chart.
- Sensing: standard hand input and head tracking (default).
- Preview data: one illustrative chart with hand-authored positions (default). The scene identifies it as an example chart.

## Where things live

- Center the sphere on the viewer's starting eye position and keep that center fixed in the room throughout the session (default).
- Draw a 150 cm radius open wireframe sphere with sparse meridians and star points above, beside, and below eye level (default). Keep the main zodiac band near eye height, split into twelve labeled 30-degree sectors.
- Put the initial Sun marker near the middle of the starting view with a short nearby prompt (default).
- Use six illustrative planet markers at distinct positions along the band (default). For reproducibility, use chart longitudes Sun 10°, Moon 70°, Mercury 25°, Venus 130°, Mars 100°, Jupiter 190°. Place the markers at their chart angles. Offset individual labels locally if they overlap.
- Put the details beside the selected marker. Face the details toward the viewer and keep their edges clear of the marker (default).

## Hands and input

- Aim at a planet to highlight its marker. Pinch to select it. Pinch another marker to switch or pinch the same marker again to close (default).
- Use forgiving ray targets and keep nearby targets distinct.
- Use the mouse to look around and simulate a pinch in Interactive Preview.

## When things show

- The shell, zodiac band, and planet markers are present at entry. The start prompt disappears after the first selection (default).
- Show the selected planet's name, sign, and degree within the sign. Show only the aspect lines connected to that selection (default). Highlight conjunction, sextile, square, trine, and opposition using the shortest circular longitude separation with a 5° tolerance (default).
- Draw aspect lines inside the sphere and keep the first part of each line visible near its source. The observer can follow the line by turning. A short label at the selected end gives the other planet and the aspect name (default).

## Done criteria

1. Start the preview at the center. Turning the view at least 90 degrees reveals another part of the same world-fixed sphere. Looking up reveals the upper shell.
2. Aim at and pinch the Sun. The details show Aries 10° and the chart highlights the Sun–Moon sextile, Sun–Mars square, Sun–Venus trine, and Sun–Jupiter opposition.
3. Pinch a different visible planet. The detail card and aspect lines switch to the new selection. Pinch it again to clear the selection.

## Out of scope

- Birth data entry, ephemeris calculation, and personalized interpretations.

## Risks and open questions

- Test the view from the actual startup pose so the opening prompt and Sun marker are visible together. Check line and label readability against the preview background.
- Real-device comfort and target acquisition remain to be checked on glasses.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
