# Inside the Zodiac

**Tagline**

Step inside a life-size zodiac chart and explore planetary relationships by looking around and pinching.

**Inspiration**

A flat astrology chart shows everything at once. I wanted to see what happens when that chart becomes a place you can stand inside. With SPECS, the chart can surround the wearer and stay in the room as they turn their head.

**What it does**

Inside the Zodiac places the viewer at the center of a three-meter-wide spherical chart. Look around to find the twelve zodiac signs and look up to see the star grid curve overhead. Aim at one of six celestial bodies and pinch to reveal its sign, degree, and color-coded aspects to other bodies. Pinch another marker to change the selection, or pinch the selected marker again to clear it.

The Lens is for people curious about how to read a zodiac chart. It uses one example chart with illustrative positions. Select the Sun to see it at 10° Aries, with a sextile to the Moon, a square to Mars, a trine to Venus, and an opposition to Jupiter.

**How it was built**

The project was planned with the Devpost Learn skill pack and built in Lens Studio with CLAD and Lens Studio MCP. It started from Snap's SPECS Base Template. TypeScript generates the spherical grid, zodiac sectors, markers, and aspect lines. The chart is centered on the viewer's starting position and stays fixed in world space. The Spectacles Interaction Kit handles selection.

**What I learned**

Turning your head changes what is readable. The zodiac band stays near eye level for navigation, while the upper grid rewards looking up. Showing only the selected body's aspects keeps the space legible, and placing the details beside its marker keeps the explanation tied to the chart.

**What I tested**

The SPECS 27 Interactive Preview shows the same chart as the view turns and looks up. The LEAF scenario `zodiac-selection` passed in preview. It checks the Sun's sign and aspects, switches to Mercury, then clears the selection. Hardware comfort and hand tracking have yet to be evaluated on glasses.

**How to try it**

Open `SPECS-Starter.esproj` in Lens Studio 5.24.1, select SPECS 27 and Interactive Preview, then reset the preview. Right-drag to look around. Click the Sun marker to simulate a pinch, then try Mercury and click it again to clear.
