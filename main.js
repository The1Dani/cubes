// TODO: Put input for max FPS and number of boxes 
class Vector2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x = x;
        this.y = y;
    }
    add(v2) {
        return new Vector2D(this.x + v2.x, this.y + v2.y);
    }
    mul(v) {
        if (v instanceof Vector2D) {
            return new Vector2D(this.x * v.x, this.y * v.y);
        }
        return new Vector2D(this.x * v, this.y * v);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
class Color {
    r;
    g;
    b;
    constructor(r, g, b) {
        this.r = r % 256;
        this.g = g % 256;
        this.b = b % 256;
    }
    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    static random() {
        return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
    }
}
function getDivElementByID(id) {
    const el = document.getElementById(id);
    if (!(el instanceof HTMLDivElement)) {
        throw new Error("There is no such element");
    }
    return el;
}
class Canvas {
    size;
    newCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.size = new Vector2D(width, height);
    }
    constructor() {
        this.newCanvas();
    }
}
class Box {
    parent;
    el;
    size;
    pos;
    id;
    constructor(id, settings) {
        this.el = document.createElement("div");
        this.size = settings.size || new Vector2D(100, 100);
        this.pos = settings.pos || new Vector2D(0, 0);
        this.parent = settings.parent || document.body;
        this.id = id;
        this.el.id = id;
        this.el.className = "box";
        this.el.style.width = this.size.x + "px";
        this.el.style.height = this.size.y + "px";
        this.el.style.left = this.pos.x + "px";
        this.el.style.top = this.pos.y + "px";
        this.el.style.backgroundColor = settings.color || "blue";
        this.parent.appendChild(this.el);
    }
    setColor(color) {
        this.el.style.backgroundColor = color;
    }
    kill() {
        this.el.parentNode.removeChild(this.el);
    }
}
class MovebleBox extends Box {
    canvas;
    vel;
    getSize() {
        return new Vector2D(parseFloat(window.getComputedStyle(this.el).width), parseFloat(window.getComputedStyle(this.el).height));
    }
    getPos() {
        const comp_style = window.getComputedStyle(this.el);
        return new Vector2D(parseFloat(comp_style.left), parseFloat(comp_style.top));
    }
    constructor(id, canvas, settings) {
        super(id, settings);
        this.el = getDivElementByID(id);
        this.size = this.getSize();
        this.vel = settings.vel || new Vector2D(1, 1);
        this.pos = this.getPos();
        this.canvas = canvas;
    }
    setPos(pos) {
        this.pos = pos;
        this.el.style.left = pos.x + "px";
        this.el.style.top = pos.y + "px";
    }
    right(pos) {
        return pos.add(this.size);
    }
    inWidthAtNextPos(pos) {
        return this.canvas.size.x >= this.right(pos).x && pos.x >= 0;
    }
    inHeightAtNextPos(pos) {
        return this.canvas.size.y >= this.right(pos).y && pos.y >= 0;
    }
    isInCanvasAtNextPos(pos) {
        return this.inWidthAtNextPos(pos) && this.inHeightAtNextPos(pos);
    }
    nextPos(vel) {
        return this.pos.add(vel);
    }
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const boxSett = {
    size: new Vector2D(100, 200),
    color: "blue",
    pos: new Vector2D(50, 50)
};
let lastTime = Date.now();
let deltaTime;
let drawBox = (box) => {
    box.canvas.newCanvas();
    const dx = box.vel.mul(deltaTime);
    const speedFactor = 1;
    const nextPos = box.nextPos(dx);
    if (box.isInCanvasAtNextPos(nextPos)) {
        box.setPos(nextPos);
    }
    else if (!box.inHeightAtNextPos(nextPos) && box.inWidthAtNextPos(nextPos)) {
        box.vel = box.vel.mul(new Vector2D(speedFactor, -speedFactor));
        let nf = nextPos.add(box.vel.mul(deltaTime));
        if (!box.isInCanvasAtNextPos(nf)) {
            box.setPos(new Vector2D(randNum(0, box.canvas.size.x - box.size.x), randNum(0, box.canvas.size.y - box.size.y)));
        }
    }
    else if (box.inHeightAtNextPos(nextPos) && !box.inWidthAtNextPos(nextPos)) {
        box.vel = box.vel.mul(new Vector2D(-speedFactor, speedFactor));
        let nf = nextPos.add(box.vel.mul(deltaTime));
        if (!box.isInCanvasAtNextPos(nf)) {
            box.setPos(new Vector2D(randNum(0, box.canvas.size.x - box.size.x), randNum(0, box.canvas.size.y - box.size.y)));
        }
    }
    else {
        box.vel = box.vel.mul(-speedFactor);
    }
};
function randNum(lower, upper) {
    let num = upper - lower;
    return Math.floor(Math.random() * num) + lower;
}
function getInput(id) {
    const num = Number(document.getElementById(id)
        .value);
    return num;
}
let main = () => {
    const frames = 65;
    let fps_tick = 0;
    const sett = boxSett;
    sett.size = new Vector2D(50, 50);
    const canvas = new Canvas;
    let num = 50;
    let newNum = num;
    const colorFreq = frames / 30;
    let speed = 5;
    let newSpeed = speed;
    sett.vel = new Vector2D(1, 1).mul(speed * 10);
    let boxArr = [];
    let newArr = (num) => {
        if (boxArr.length >= 0) {
            boxArr.forEach((v) => {
                v.kill();
            });
            boxArr.splice(0, boxArr.length);
        }
        let arr = [];
        for (let i = 0; i < num; i++) {
            sett.color = Color.random().toString();
            sett.pos = new Vector2D(randNum(0, canvas.size.x - sett.size.x), randNum(0, canvas.size.y - sett.size.y));
            arr.push(new MovebleBox(`box${i}`, canvas, sett));
        }
        return arr;
    };
    boxArr = newArr(num);
    let loop = () => {
        if (fps_tick % frames - 1 == 0)
            newNum = (newNum = getInput("amount")) <= 0 ? num : newNum;
        if (num != newNum) {
            boxArr = newArr(newNum);
            num = newNum;
        }
        if (fps_tick % frames - 1 == 0)
            newSpeed = (newSpeed = getInput("speed")) <= 0 ? speed : newSpeed;
        if (speed != newSpeed) {
            boxArr.forEach((v) => {
                v.vel = new Vector2D(1, 1).mul(newSpeed * 10);
            });
            speed = newSpeed;
            sett.vel = new Vector2D(1, 1).mul(newSpeed * 10);
        }
        fps_tick = (fps_tick + 1) % frames;
        const now = Date.now();
        deltaTime = (now - lastTime) / 1000;
        lastTime = now;
        if (fps_tick % 10 == 0) {
            document.getElementById("fps").innerHTML = "FPS: " + Math.floor(1 / deltaTime);
        }
        if (fps_tick % colorFreq == 0) {
            boxArr.forEach((x) => {
                x.setColor(Color.random().toString());
            });
        }
        boxArr.forEach((x) => {
            drawBox(x);
        });
        //drawBox(box2)
        fps_tick++;
        setTimeout(loop, 1000 / frames);
    };
    loop();
};
main();
