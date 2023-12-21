import { IGraphEditor } from "./Canvas/GraphEditor/IGraphEditor";
import { GraphEditor } from "./Canvas/GraphEditor/GraphEditor";
import { IGraph } from "./Canvas/Graph/IGraph";

const canvasContainer = <HTMLElement>document.getElementById('canvas');
const controlsContainer = <HTMLElement>document.getElementById('controls');

const graphEditor: IGraphEditor = new GraphEditor(
    canvasContainer, 
    controlsContainer);

animate();

function animate(): void {
    graphEditor.display();

    requestAnimationFrame(animate);
}
