import * as PIXI from "pixi.js"


export default class overview extends PIXI.Container {
    constructor({ app }, item) {
        super()
        this._width = app.view.width * 0.2;
        this._height = app.view.height * 0.9;
        let headerMulti = 0.15

        this.main = createBoxSprite(app.view.width * 0.78, app.view.height * 0.05, this._width, this._height, app)
        this.addChild(this.main);
        this.header = createBoxSprite(app.view.width * 0.78, app.view.height * 0.05, this._width, this._height * headerMulti, app)
        this.header.tint = 0x000000
        this.addChild(this.header);
        this.headerText = new PIXI.Text(item.Name, { fontSize: 20, wordWrapWidth: app.view.width * 0.18, fill: 0xFFFFFF, wordWrap: true, align: "center" })
        this.headerText.position.set(this.width / 2, this.height * headerMulti / 2)
        this.headerText.anchor.set(0.5, 0.5)

        this.normalText = new PIXI.Text(item.Description, { fontSize: 16, wordWrapWidth: app.view.width * 0.18, fill: 0x000000, wordWrap: true })
        this.normalText.position.set(this._width * 0.01, this._height * headerMulti * 1.01)
        // this.normalText.filters = [new PIXI.filters.VoidFilter()]
        // this.normaltText.filterArea = new PIXI.Rectangle(app.view.width * 0.78, app.view.height * 0.05, this._width, this._height) //<-- its SCREEN coords,you have to  calculate the part of screen that must be drawn.
        this.addChild(this.normalText)
        this.addChild(this.headerText)
        this.position.set(app.view.width * .78, app.view.height * 0.05)
    }
}

function createBoxSprite(startPosX, startPosY, width, height, app) {
    const p = new PIXI.Graphics();
    p.beginFill(0xFFFFFF, 1);
    p.lineStyle(1);
    p.drawRect(0, 0, width, height)
    p.endFill();
    const t = app.renderer.generateTexture(p)


    let box = new PIXI.Sprite(t);

    return box
}