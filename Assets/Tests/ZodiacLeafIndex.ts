import { scenariosIndex } from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator";
import { ScenarioMetadata } from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata";
import { ZodiacSelectionScenario } from "./ZodiacSelectionScenario";

@component
export class ZodiacLeafIndex extends BaseScriptComponent {
    @scenariosIndex
    static scenariosIndex: ScenarioMetadata[] = [{
        id: "zodiac-selection",
        typename: ZodiacSelectionScenario.getTypeName(),
    }];
}
