import * as PIXI from "pixi.js"
const Vector = require('victor');

const dampening = 0.9
let placeX = 0;
let placeY = 50;

export default class Bubble {
    constructor({ app }, bubbles, width, height, item, updateSelected) {
        this.width = width;
        this.height = height;
        this.item = item
        this.item.Name = this.item.Name.trim();
        this.item.Connections = this.item.Connections.split(",");
        this.connections = []
        this.updateFunc = updateSelected

        for (let item of this.item.Connections) {
            this.connections.push(item.trim())
        }
        this.lines = []

        this.colour = 0xffffff;
        if (item.Type == "Learning") {
            this.size = 50
            this.colour = 0xFFFFFF * Math.random()
        } else { this.size = Math.sqrt(item.Connections.length) * 15  + 10}
        let text = item.Name
        const p = new PIXI.Graphics();
        p.beginFill(0xFFFFFF, 1);
        p.lineStyle(1);
        p.drawCircle(0, 0, this.size)
        p.endFill();
        const t = app.renderer.generateTexture(p)

        this.bubble = new PIXI.Sprite(t);
        this.bubble.tint = this.colour
        this.bubble.anchor.set(0.5)
        this.setPosition()
        this.bubble.zIndex = 2
        this.bubble.selected = false


        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.hasHome = true;
        this.home = new Vector(this.bubble.position._x, this.bubble.position._y);

        this.text = new PIXI.Text(text, { align: 'centre', fontSize: this.size * 0.5, fill: 0xFFFFFF, wordWrap: true, wordWrapWidth: this.size * 4 });
        this.text.anchor.set(0.5, 1);
        this.text.x = this.bubble.position._x
        this.text.y = this.bubble.position._y
        this.text.zIndex = 3
        this.setupMovement();

    }
    setPosition() {
        if (placeX > this.width * 0.65 - this.size * 2) {
            placeX = this.size;
            placeY = placeY + this.height / 3
        }
        let x = placeX + this.size * 4
        let y = placeY + this.size * 3
        placeX = placeX + this.size * 3 + this.size * Math.random()
        placeY = placeY + this.size * Math.random() - this.size * Math.random()
        this.bubble.position.set(x, y)

    }
    setupMovement() {
        this.bubble.interactive = true;
        this.bubble.buttonMode = true;

        this.bubble
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove)
    }
    update(delta, width, height) {
        this.goHome()
        this.velocity.x = this.velocity.x + this.acceleration.x;
        this.velocity.y = this.velocity.y + this.acceleration.y;
        this.velocity.multiplyScalar(dampening)

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        if (this.velocity.magnitude() > 3) {
            this.velocity.multiplyScalar(0.8);
        }

        this.bubble.position.set(this.bubble.position.x + this.velocity.x * delta,
            this.bubble.position.y + this.velocity.y * delta)
        this.text.position.set(this.bubble.position._x, this.bubble.position._y - this.size)


        // if (this.bubble.position._x + this.size > width) { this.acceleration.x = -5}
        // if (this.bubble.position._x < this.size) { this.acceleration.x = 5}
        // if (this.bubble.position._y + this.size > height) { this.acceleration.y = -5}
        // if (this.bubble.position._y - this.size * 2 < 0) { this.acceleration.y = 5}
        return (this.bubble.selected)
    }

    deSelected() {
        this.bubble.selected = false;
        this.bubble.tint = this.colour
    }
    goHome() {
        let homeX = this.home.x - this.bubble.position._x
        let homeY = this.home.y - this.bubble.position._y
        let homeVector = new Vector(homeX, homeY)
        this.acceleration.add(homeVector.multiplyScalar(0.02).multiplyScalar(this.connections.length > 0 ? this.connections.length : 10))
    }
    onDragStart(event) {
        console.log(this.selected)
        if (!this.selected) {
            this.selected = true
            this.tint = 0xFF00FF
        }
        if (this.selected) {
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        }
    }

    onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
    }

    onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }
    doLines(bubbles, container) {
        for (let line of this.lines) { container.removeChild(line) }
        this.lines = []
        let set = []
        for (let bubble of bubbles) {
            if (this.connections.includes(bubble.item.Name)) {
                let graphics = new PIXI.Graphics();
                graphics.beginFill(0xFF3300);
                graphics.lineStyle(4, 0x000000, 0.1);
                graphics.moveTo(this.bubble.position._x, this.bubble.position._y);
                graphics.lineTo(bubble.bubble.position._x, bubble.bubble.position._y)
                graphics.closePath();
                graphics.endFill();
                graphics.zIndex = 1
                set.push(graphics);
            }
        }
        this.lines = set
        return set
    }
}


function getDistance(pointAX, pointAY, pointBX, pointBY) {
    let xDiff = Math.abs(pointAX - pointBX);
    let yDiff = Math.abs(pointAY - pointBY);
    let totalDiff = Math.sqrt(xDiff * xDiff + yDiff + yDiff);
    return totalDiff
}

