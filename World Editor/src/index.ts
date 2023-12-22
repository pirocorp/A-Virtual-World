import { IGraphEditor } from "./GraphEditor/IGraphEditor";
import { GraphEditor } from "./GraphEditor/GraphEditor";
import { World } from "./World/World";

const canvasContainer = <HTMLElement>document.getElementById('canvas');
const controlsContainer = <HTMLElement>document.getElementById('controls');

const graphEditor: IGraphEditor = new GraphEditor(
    canvasContainer, 
    controlsContainer);

const world = new World(graphEditor.graph);

animate();

function animate(): void {
    graphEditor.display();

    world.generate();
    world.draw(graphEditor.context);

    requestAnimationFrame(animate);
}


// TODO: graph editor should expect canvas object in the constructor 