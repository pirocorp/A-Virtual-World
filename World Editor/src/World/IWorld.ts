export interface IWorld {
    generate(): void;

    draw(ctx: CanvasRenderingContext2D): void
}