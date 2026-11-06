# Inside the Zodiac

Inside the Zodiac is a SPECS Lens created for Learn AR with SPECS. It places you at the center of an open, three-meter-wide astrology chart. The chart stays fixed in the room as you look around. Select a celestial body to see its place in the zodiac and its aspects to other bodies.

## Run in Lens Studio

1. Open [SPECS-Starter.esproj](SPECS-Starter.esproj) in Lens Studio 5.24.1.
2. In the Preview panel, choose SPECS 27 and Interactive Preview. Use the Plane environment and reset the preview.
3. Right-drag to look around. Look up to see the spherical grid above you.
4. Click the Sun marker to simulate a pinch. The detail card should show Aries 10° and four aspects. Select Mercury to switch, then select Mercury again to clear.

The prototype uses one example chart with six illustrative positions. It requires no birth data or external service.

## Project files

- [Lens script](Assets/InsideTheZodiac.ts) generates the chart and handles selection.
- [Design brief](devpost/design-brief.md) records the spatial design.
- [LEAF scenario](Assets/Tests/ZodiacSelectionScenario.ts) checks selecting the Sun, switching to Mercury, and clearing. It passed in SPECS 27 Preview with LEAF 2.0.2.

Built from Snap's SPECS Base Template using CLAD and Lens Studio MCP. The project includes the template assets and Lens Studio packages required to open it. Those assets and packages retain their respective terms.
