import * as PIXI from "pixi.js"
const Vector = require('victor');

export default class Bubble {
    constructor({ app }, width, height) {
        text = "poo";
        this.size = Math.floor(Math.random() * 100);
        this.colour = 0xaaaaa;
        // const bubbleWidth = (60)
        this.bubble = new PIXI.Graphics();
        // this.bubble.position.set(Math.random() * width, Math.random() * height);
        this.bubble.position.set(width / 2, height / 2);
        this.bubble.beginFill(this.colour, 0.5);
        // this.bubble.lineStyle(4, 0xaaaaaa);
        this.bubble.drawCircle(0, 0, this.size);
        this.bubble.endFill();
        app.stage.addChild(this.bubble);
        this.velocity = new Vector(1, 1);
        this.acceleration = new Vector(0, 0);
        this.text = new PIXI.Text(text, { fontFamily: 'Arial', fontSize: size * 0.5, fill: this.colour, align: 'centre' });
        app.stage.addChild(this.text);

    }
    update(delta, width, height) {
        this.velocity.x = this.velocity.x + this.acceleration.x;
        this.velocity.y = this.velocity.y + this.acceleration.y;
        this.acceleration.x = 0;
        this.acceleration.y = 0;

        if (this.velocity.magnitude() > 3) {
            this.velocity.multiplyScalar(0.8);
        }


        if (this.bubble.position._x + this.bubbleWidth > width) { this.acceleration.x = -0.5 }
        if (this.bubble.position._x - this.bubbleWidth < 0) { this.acceleration.x = 0.5 }
        if (this.bubble.position._y + this.bubbleWidth > height) { this.acceleration.y = -0.5 }
        if (this.bubble.position._y - this.bubbleWidth < 0) { this.acceleration.y = 0.5 }

        this.bubble.position.set(this.bubble.position.x + this.velocity.x * delta,
            this.bubble.position.y + this.velocity.y * delta)
        this.text.position.set(this.bubble.position._x, this.bubble.position._y + this.size + 1)
    }

}