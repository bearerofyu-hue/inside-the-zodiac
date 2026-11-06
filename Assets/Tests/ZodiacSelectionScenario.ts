import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import { findInteractableByName } from "Leaf.lspkg/Interactors/InteractableUtils";
import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { findSceneObjectByName, sleep } from "Leaf.lspkg/Utils/common/Utils";

@component
export class ZodiacSelectionScenario extends Scenario {
    async run(): Promise<void> {
        await sleep(750);
        const details = findSceneObjectByName("Selected Planet Details");
        const aspectPaths = findSceneObjectByName("Aspect Paths");
        const sun = findInteractableByName("Sun");
        const mercury = findInteractableByName("Mercury");
        if (!details || !aspectPaths || !sun || !mercury) {
            throw new Error("The zodiac chart or one of the test targets did not load.");
        }

        const text = details.getComponent("Component.Text");
        const hand = new DefaultLeafInteractor();
        if (details.enabled && text.text.startsWith("SUN")) {
            await hand.trigger(sun);
            await sleep(150);
        }

        await hand.trigger(sun);
        await sleep(200);
        expect(details.enabled).toBe(true);
        expect(text.text.includes("Aries 10°")).toBe(true);
        for (const pair of ["Sextile  ·  Moon", "Trine  ·  Venus",
            "Square  ·  Mars", "Opposition  ·  Jupiter"]) {
            expect(text.text.includes(pair)).toBe(true);
        }
        expect(aspectPaths.getChildrenCount()).toBe(1);

        await hand.trigger(mercury);
        await sleep(200);
        expect(details.enabled).toBe(true);
        expect(text.text.includes("MERCURY  ·  Aries 25°")).toBe(true);
        expect(aspectPaths.getChildrenCount()).toBe(0);

        await hand.trigger(mercury);
        await sleep(200);
        expect(details.enabled).toBe(false);
        expect(aspectPaths.getChildrenCount()).toBe(0);
    }
}
