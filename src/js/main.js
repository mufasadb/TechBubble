import * as PIXI from 'pixi.js'
import Bubble from './bubble'
import data from '../assets/data.json'
import Overview from './overview'

const learnings =

    console.log(data);

const width = 1680;
const height = 720;

const app = new PIXI.Application({
    width: width,
    height: height,
    backgroundColor: 0x36454f,
    view: document.querySelector('#scene')
});


const bubbles = []
const learningBubbles = []
const toolBubbles = []

const liveContainer = new PIXI.Container();
liveContainer.sortableChildren = true;
app.stage.addChild(liveContainer)

data.sort((a, b) => (Math.random() > 0.5) ? - 1 : 1)
for (let item of data) {
    let bubble = new Bubble({ app }, bubbles, width, height, item)
    liveContainer.addChild(bubble.bubble)
    liveContainer.addChild(bubble.text)
    bubbles.push(bubble)
    if (item.Type == "Learning") { learningBubbles.push(bubble) }
    else { toolBubbles.push(bubble) }
}


const checkHome = true

let selected;
let overview;

function updateSelected(newSelection) {
    if (selected) {

        if (selected != newSelection) { selected.deSelected() }
    }
    selected = newSelection
    if (overview) { app.stage.removeChild(overview) }
    overview = new Overview({ app }, selected.item)
    overview.view
    app.stage.addChild(overview);
}


app.ticker.add((delta) => {
    for (let i in bubbles) {
        let bubble = bubbles[i]
        if (bubble.update(delta, width, height, updateSelected)) {
            updateSelected(bubble)
        }
    }

    for (let bubble of toolBubbles) {
        let lines = bubble.doLines(learningBubbles, liveContainer)
        for (let line of lines) {
            liveContainer.addChild(line);
        }
    }
    // liveContainer.sortChildren()

});
