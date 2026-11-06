import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";

type Color = [number, number, number, number];
type Planet = { name: string; degrees: number; color: Color };
type Aspect = { degrees: number; name: string; color: Color };

const RADIUS = 150;
const STARTING_LONGITUDE = 12;
const GOLD: Color = [1, 0.76, 0.38, 1];
const IVORY: Color = [0.94, 0.97, 1, 1];
const BLUE: Color = [0.35, 0.66, 0.94, 1];
const GRID: Color = [0.16, 0.33, 0.58, 1];
const ZODIAC = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const PLANETS: Planet[] = [
    { name: "Sun", degrees: 10, color: GOLD },
    { name: "Moon", degrees: 70, color: [0.68, 0.88, 1, 1] },
    { name: "Mercury", degrees: 25, color: [0.69, 1, 0.87, 1] },
    { name: "Venus", degrees: 130, color: [1, 0.62, 0.8, 1] },
    { name: "Mars", degrees: 100, color: [1, 0.53, 0.45, 1] },
    { name: "Jupiter", degrees: 190, color: [0.83, 0.72, 1, 1] },
];
const ASPECTS: Aspect[] = [
    { degrees: 0, name: "Conjunction", color: GOLD },
    { degrees: 60, name: "Sextile", color: [0.32, 0.94, 1, 1] },
    { degrees: 90, name: "Square", color: [1, 0.55, 0.45, 1] },
    { degrees: 120, name: "Trine", color: [0.54, 1, 0.72, 1] },
    { degrees: 180, name: "Opposition", color: [0.83, 0.61, 1, 1] },
];

function point(longitude: number, latitude: number, radius = RADIUS): vec3 {
    const azimuth = (longitude - STARTING_LONGITUDE) * Math.PI / 180;
    const elevation = latitude * Math.PI / 180;
    const horizontal = Math.cos(elevation) * radius;
    return new vec3(Math.sin(azimuth) * horizontal, Math.sin(elevation) * radius,
        -Math.cos(azimuth) * horizontal);
}

function child(parent: SceneObject, name: string): SceneObject {
    const node = global.scene.createSceneObject(name);
    node.setParent(parent);
    node.layer = parent.layer;
    return node;
}

function group(parent: SceneObject, name: string): SceneObject {
    for (let index = 0; index < parent.getChildrenCount(); index++) {
        const node = parent.getChild(index);
        if (node.name === name) return node;
    }
    return child(parent, name);
}

function faceCenter(node: SceneObject, position: vec3): void {
    const transform = node.getTransform();
    transform.setLocalPosition(position);
    transform.setLocalRotation(quat.lookAt(
        new vec3(-position.x, 0, -position.z).normalize(), new vec3(0, 1, 0)
    ));
}

function writeLabel(node: SceneObject, value: string, size: number, color: Color): Text {
    const label = node.createComponent("Component.Text");
    label.text = value;
    label.size = size;
    label.horizontalAlignment = HorizontalAlignment.Center;
    label.verticalAlignment = VerticalAlignment.Center;
    label.horizontalOverflow = HorizontalOverflow.Overflow;
    label.depthTest = true;
    label.textFill.color = new vec4(color[0], color[1], color[2], color[3]);
    return label;
}

class Strokes {
    private vertices: number[] = [];
    private indices: number[] = [];

    segment(a: vec3, b: vec3, radius: number, color: Color): void {
        const axis = b.sub(a).normalize();
        const reference = Math.abs(axis.y) > 0.9 ? new vec3(1, 0, 0) : new vec3(0, 1, 0);
        const u = axis.cross(reference).normalize().uniformScale(radius);
        const v = axis.cross(u).normalize().uniformScale(radius);
        const ring = [u, v, u.uniformScale(-1), v.uniformScale(-1)];
        const base = this.vertices.length / 7;
        for (const end of [a, b]) {
            for (const offset of ring) {
                const vertex = end.add(offset);
                this.vertices.push(vertex.x, vertex.y, vertex.z, ...color);
            }
        }
        for (let i = 0; i < 4; i++) {
            const next = (i + 1) % 4;
            this.indices.push(base + i, base + next, base + 4 + i,
                base + next, base + 4 + next, base + 4 + i);
        }
    }

    path(points: vec3[], radius: number, color: Color): void {
        for (let i = 1; i < points.length; i++) this.segment(points[i - 1], points[i], radius, color);
    }

    attach(node: SceneObject, material: Material): void {
        if (this.indices.length === 0) return;
        const builder = new MeshBuilder([
            { name: "position", components: 3 },
            { name: "color", components: 4 },
        ]);
        builder.topology = MeshTopology.Triangles;
        builder.indexType = MeshIndexType.UInt16;
        builder.appendVerticesInterleaved(this.vertices);
        builder.appendIndices(this.indices);
        const visual = node.createComponent("Component.RenderMeshVisual");
        visual.mesh = builder.getMesh();
        visual.mainMaterial = material;
        builder.updateMesh();
    }
}

@component
export class InsideTheZodiac extends BaseScriptComponent {
    @input chartCamera!: SceneObject;
    @input shellMaterial!: Material;

    private selected: Planet | null = null;
    private prompt!: SceneObject;
    private detail!: SceneObject;
    private detailText!: Text;
    private linesRoot!: SceneObject;
    private lines: SceneObject | null = null;
    private halos: { planet: Planet; node: SceneObject; hovered: boolean }[] = [];

    onAwake(): void {
        this.createEvent("OnStartEvent").bind(() => this.build());
    }

    private build(): void {
        if (!this.chartCamera || !this.shellMaterial) return;
        const root = this.sceneObject;
        const camera = this.chartCamera.getTransform();
        const forward = camera.getWorldRotation().multiplyVec3(new vec3(0, 0, 1));
        root.getTransform().setWorldPosition(camera.getWorldPosition());
        root.getTransform().setWorldRotation(quat.lookAt(
            new vec3(forward.x, 0, forward.z).normalize(), new vec3(0, 1, 0)
        ));

        this.buildShell(group(root, "Celestial Sphere"));
        this.buildBand(group(root, "Zodiac Band"));
        const markers = group(root, "Planet Markers");
        for (const planet of PLANETS) this.makeMarker(markers, planet);

        const details = group(root, "Selection and Aspects");
        this.linesRoot = group(details, "Aspect Paths");
        this.detail = child(details, "Selected Planet Details");
        this.detailText = writeLabel(this.detail, "", 124, IVORY);
        this.detail.enabled = false;
        this.prompt = child(details, "Opening Prompt");
        faceCenter(this.prompt, point(STARTING_LONGITUDE, -12, 132));
        writeLabel(this.prompt, "INSIDE THE ZODIAC\nEXAMPLE CHART  ·  PINCH A PLANET", 116, IVORY);
        print("[Inside the Zodiac] Sphere ready with " + PLANETS.length + " planet targets.");
    }

    private buildShell(parent: SceneObject): void {
        const strokes = new Strokes();
        for (const latitude of [-63, -38, -21, 21, 38, 63]) {
            const arc = Array.from({ length: 97 }, (_, i) => point(i * 360 / 96, latitude));
            strokes.path(arc, 0.18, GRID);
        }
        for (let longitude = 0; longitude < 360; longitude += 30) {
            const arc = Array.from({ length: 43 }, (_, i) => point(longitude, -84 + i * 4));
            strokes.path(arc, 0.11, GRID);
        }
        for (let index = 0; index < 190; index++) {
            const latitude = Math.asin(2 * (index + 0.5) / 190 - 1) * 180 / Math.PI;
            const center = point(index * 137.50776, latitude, RADIUS - 0.6);
            const width = index % 11 === 0 ? 0.75 : 0.28;
            const arm = new vec3(0, width, 0);
            strokes.segment(center.sub(arm), center.add(arm), width * 0.34, index % 11 === 0 ? IVORY : BLUE);
        }
        strokes.attach(parent, this.shellMaterial);
    }

    private buildBand(parent: SceneObject): void {
        const strokes = new Strokes();
        for (const latitude of [-5, 5]) {
            strokes.path(Array.from({ length: 121 }, (_, i) => point(i * 3, latitude)), 0.24, GOLD);
        }
        for (let index = 0; index < ZODIAC.length; index++) {
            const longitude = index * 30;
            strokes.segment(point(longitude, -5), point(longitude, 5), 0.30, GOLD);
            for (let step = 1; step < 6; step++) {
                const tick = longitude + step * 5;
                strokes.segment(point(tick, -5), point(tick, -3.8), 0.15, GOLD);
            }
            const name = child(parent, ZODIAC[index]);
            faceCenter(name, point(longitude + 15, 9.5, RADIUS - 2));
            writeLabel(name, ZODIAC[index].toUpperCase(), 144, GOLD);
        }
        strokes.attach(parent, this.shellMaterial);
    }

    private makeMarker(parent: SceneObject, planet: Planet): void {
        const marker = child(parent, planet.name);
        faceCenter(marker, point(planet.degrees, 0, RADIUS - 4));
        const strokes = new Strokes();
        strokes.path(this.markerCircle(3.3), 0.33, planet.color);
        strokes.segment(new vec3(-1.6, 0, 0), new vec3(1.6, 0, 0), 0.45, planet.color);
        strokes.segment(new vec3(0, -1.6, 0), new vec3(0, 1.6, 0), 0.45, planet.color);
        strokes.attach(marker, this.shellMaterial);
        const label = child(marker, "Planet name");
        label.getTransform().setLocalPosition(new vec3(0, -6.4, 0.5));
        writeLabel(label, planet.name.toUpperCase(), 112, planet.color);

        const halo = child(marker, "Hover and selection halo");
        const accent = new Strokes();
        accent.path(this.markerCircle(5.1), 0.30, IVORY);
        accent.attach(halo, this.shellMaterial);
        halo.enabled = false;
        const state = { planet, node: halo, hovered: false };
        this.halos.push(state);

        const collider = marker.createComponent("Physics.ColliderComponent");
        const shape = Shape.createSphereShape();
        shape.radius = 6;
        collider.shape = shape;
        const interactable = marker.createComponent(Interactable.getTypeName()) as Interactable;
        interactable.colliders = [collider];
        interactable.targetingMode = 2;
        interactable.onHoverEnter.add(() => { state.hovered = true; this.updateHalos(); });
        interactable.onHoverExit.add(() => { state.hovered = false; this.updateHalos(); });
        interactable.onTriggerEnd.add(() => this.select(planet));
    }

    private markerCircle(radius: number): vec3[] {
        return Array.from({ length: 29 }, (_, index) => {
            const angle = index * Math.PI / 14;
            return new vec3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        });
    }

    private updateHalos(): void {
        for (const halo of this.halos) halo.node.enabled = halo.hovered || halo.planet === this.selected;
    }

    private select(planet: Planet): void {
        this.selected = this.selected === planet ? null : planet;
        this.prompt.enabled = false;
        this.detail.enabled = this.selected !== null;
        if (this.lines) {
            this.lines.destroy();
            this.lines = null;
        }
        this.updateHalos();
        if (!this.selected) {
            print("[Inside the Zodiac] Selection cleared.");
            return;
        }

        const start = point(planet.degrees, 0, RADIUS - 4);
        const strokes = new Strokes();
        const matches: string[] = [];
        for (const other of PLANETS) {
            if (other === planet) continue;
            const raw = Math.abs(planet.degrees - other.degrees);
            const separation = Math.min(raw, 360 - raw);
            const aspect = ASPECTS.find(entry => Math.abs(separation - entry.degrees) <= 5);
            if (!aspect) continue;
            const end = point(other.degrees, 0, RADIUS - 4);
            const control = start.add(end).uniformScale(0.39).add(new vec3(0, -64, 0));
            const path = Array.from({ length: 33 }, (_, i) => {
                const t = i / 32;
                return start.uniformScale((1 - t) ** 2)
                    .add(control.uniformScale(2 * t * (1 - t)))
                    .add(end.uniformScale(t ** 2));
            });
            strokes.path(path, 0.42, aspect.color);
            matches.push(aspect.name + "  ·  " + other.name);
        }
        if (matches.length) {
            this.lines = child(this.linesRoot, planet.name + " aspect paths");
            strokes.attach(this.lines, this.shellMaterial);
        }

        faceCenter(this.detail, point(planet.degrees - 8, -15.5, 124));
        const sign = ZODIAC[Math.floor(planet.degrees / 30)];
        this.detailText.text = [planet.name.toUpperCase() + "  ·  " + sign + " " + planet.degrees % 30 + "°",
            ...matches].join("\n");
        print("[Inside the Zodiac] Selected " + planet.name + " | " + sign + " " +
            planet.degrees % 30 + "° | " + matches.join(", "));
    }
}
