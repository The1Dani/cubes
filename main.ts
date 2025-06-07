
// TODO: Add Bunny support!


var buf = new ArrayBuffer(4),
  f32 = new Float32Array(buf),
  u32 = new Uint32Array(buf);


function sign(n: number) {
  return n < 0 ? -1 : 1
}

class Vector2D {
  constructor(public x: number, public y: number) {
    this.x = x;
    this.y = y;
  }

  add(v2: Vector2D) {
    return new Vector2D(this.x + v2.x, this.y + v2.y)
  }

  mul(v: Vector2D): Vector2D;
  mul(v: number): Vector2D;

  mul(v: Vector2D | number): Vector2D {

    if (v instanceof Vector2D) {
      return new Vector2D(this.x * v.x, this.y * v.y)
    }

    return new Vector2D(this.x * v, this.y * v)

  }

  private isq(x: number) {

    return 1 / Math.sqrt(x)
  }

  direction_v() {
    const ivel = this.isq(this.x ** 2 + this.y ** 2)
    return this.mul(ivel)
  }


  toString() {
    return `(${this.x}, ${this.y})`
  }

  static unit = new Vector2D(1, 1)
}

class Color {
  r: number
  g: number
  b: number
  constructor(r: number, g: number, b: number) {
    this.r = r % 256
    this.g = g % 256
    this.b = b % 256
  }

  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }

  static random() {
    return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
  }

}

function getDivElementByID(id: string): HTMLDivElement {
  const el: HTMLElement | null = document.getElementById(id)

  if (!(el instanceof HTMLDivElement)) {
    throw new Error("There is no such element")
  }

  return el
}

class Canvas {
  size: Vector2D

  newCanvas() {
    const width = window.innerWidth
    const height = window.innerHeight

    this.size = new Vector2D(width, height)
  }

  constructor() {
    this.newCanvas()
  }
}

type BoxSettings = {
  parent?: HTMLElement;
  size?: Vector2D;
  pos?: Vector2D;
  color?: string;
  vel?: Vector2D;
  gravity?: Vector2D;
};


class Box {

  protected parent: HTMLElement;
  protected el: HTMLDivElement;
  size: Vector2D;
  pos: Vector2D;
  id: string;

  constructor(id: string, settings?: BoxSettings) {
    this.el = document.createElement("div")
    this.size = settings.size || new Vector2D(100, 100)
    this.pos = settings.pos || new Vector2D(0, 0)
    this.parent = settings.parent || document.body
    this.id = id

    this.el.id = id;
    this.el.className = "box"
    this.el.style.width = this.size.x + "px"
    this.el.style.height = this.size.y + "px"
    this.el.style.left = this.pos.x + "px"
    this.el.style.top = this.pos.y + "px"
    this.el.style.backgroundColor = settings.color || "blue"

    this.parent.appendChild(this.el)
  }

  setColor(color: string) {
    this.el.style.backgroundColor = color;
  }

  kill() {
    this.el.parentNode.removeChild(
      this.el)
  }

}

class MovebleBox extends Box {

  canvas: Canvas;
  vel: Vector2D;
  gravity: Vector2D;

  getSize(): Vector2D {
    return new Vector2D(parseFloat(window.getComputedStyle(this.el).width), parseFloat(window.getComputedStyle(this.el).height))
  }

  getPos(): Vector2D {
    const comp_style = window.getComputedStyle(this.el)
    return new Vector2D(parseFloat(comp_style.left), parseFloat(comp_style.top))
  }

  constructor(id: string, canvas: Canvas, settings?: BoxSettings) {
    super(id, settings)
    this.el = getDivElementByID(id)
    this.size = this.getSize()
    this.vel = settings.vel || Vector2D.unit
    this.gravity = settings.gravity || new Vector2D(0, 0)
    this.pos = this.getPos()
    this.canvas = canvas
  }

  setPos(pos: Vector2D) {
    this.pos = pos
    this.el.style.left = pos.x + "px";
    this.el.style.top = pos.y + "px";
  }

  private right(pos: Vector2D): Vector2D {
    return pos.add(this.size)
  }

  inWidthAtNextPos(pos: Vector2D) {
    return this.canvas.size.x >= this.right(pos).x && pos.x >= 0;
  }

  inHeightAtNextPos(pos: Vector2D) {
    return this.canvas.size.y >= this.right(pos).y && pos.y >= 0;
  }

  isInCanvasAtNextPos(pos: Vector2D) {
    return this.inWidthAtNextPos(pos) && this.inHeightAtNextPos(pos)
  }

  nextPos(deltaTime: number): Vector2D {
    const dx = this.vel.mul(deltaTime)
    return this.pos.add(dx)
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


const boxSett: BoxSettings = {
  size: new Vector2D(100, 200),
  color: "blue",
  pos: Vector2D.unit.mul(50),
  gravity: new Vector2D(0, 400),
  vel: new Vector2D(200, 0)
};

let lastTime: number = Date.now()
let deltaTime: number

let drawBox = (box: MovebleBox) => {

  box.canvas.newCanvas()

  const speedFactor = .9
  box.vel = box.vel.add(box.gravity.mul(deltaTime))
  const nextPos = box.nextPos(deltaTime)

  const bunny: number = -50

  if (box.isInCanvasAtNextPos(nextPos)) {
    box.setPos(nextPos)

  } else if (!box.inHeightAtNextPos(nextPos) && box.inWidthAtNextPos(nextPos)) {
    box.vel = box.vel.mul(new Vector2D(1, -speedFactor))
    if (nextPos.y - box.size.y < 0) {
      box.setPos(
        new Vector2D(box.pos.x, 0)
      )
    } else {
      box.vel = box.vel.add(new Vector2D(0, bunny))
      box.setPos(
        new Vector2D(box.pos.x, -box.size.y + box.canvas.size.y)
      )
    }
  } else if (box.inHeightAtNextPos(nextPos) && !box.inWidthAtNextPos(nextPos)) {
    box.vel = box.vel.mul(new Vector2D(-speedFactor, 1))
    if (nextPos.x < 0) {
      box.setPos(
        new Vector2D(0, box.pos.y)
      )
    } else {
      box.setPos(
        new Vector2D(-box.size.x + box.canvas.size.x, box.pos.y)
      )
    }
  } else {
    box.vel = box.vel.mul(-speedFactor)
  }

}

function randNum(lower: number, upper: number): number {
  let num = upper - lower
  return Math.floor(Math.random() * num) + lower
}

function getInput(id: string) {
  const num: number = Number(
    (document.getElementById(id) as HTMLInputElement)
      .value
  )

  return num
}



let main = () => {

  const frames = 65
  let fps_tick = 0
  const sett = boxSett
  sett.size = new Vector2D(50, 50)
  const canvas = new Canvas
  let num = 50
  let newNum = num
  const colorFreq = frames / 30
  let speed = 5
  let newSpeed = speed

  let boxArr: MovebleBox[] = []

  let newArr = (num: number): MovebleBox[] => {

    if (boxArr.length >= 0) {
      boxArr.forEach((v: MovebleBox) => {
        v.kill()
      })
      boxArr.splice(0, boxArr.length)
    }


    let arr: MovebleBox[] = []

    for (let i = 0; i < num; i++) {
      sett.color = Color.random().toString()
      sett.pos = new Vector2D(randNum(0, canvas.size.x - sett.size.x), randNum(0, canvas.size.y - sett.size.y))
      arr.push(new MovebleBox(`box${i}`, canvas, sett))
    }
    return arr
  }

  boxArr = newArr(num)

  console.log(sett.vel.direction_v().toString())

  let loop = () => {

    if (fps_tick % frames - 1 == 0) newNum = (newNum = getInput("amount")) <= 0 ? num : newNum
    if (num != newNum) {
      boxArr = newArr(newNum)
      num = newNum
    }

    if (fps_tick % frames - 1 == 0) newSpeed = (newSpeed = getInput("speed")) <= 0 ? speed : newSpeed
    if (speed != newSpeed) {
      const newSpeedVec = sett.vel.direction_v().mul(newSpeed * 10)
      boxArr.forEach((v: MovebleBox) => {
        v.vel = newSpeedVec
      })
      speed = newSpeed
      sett.vel = newSpeedVec
    }

    if (fps_tick % 2 == 1)
      document.getElementById("vel").innerHTML = "V: " + boxArr[0].vel.toString()

    fps_tick = (fps_tick + 1) % frames;
    const now = Date.now()
    deltaTime = (now - lastTime) / 1000
    lastTime = now

    if (fps_tick % 10 == 0) {
      document.getElementById("fps").innerHTML = "FPS: " + Math.floor(1 / deltaTime)
    }

    if (fps_tick % colorFreq == 0) {
      boxArr.forEach((x: MovebleBox) => {
        x.setColor(Color.random().toString())
      })
    }


    boxArr.forEach((x: MovebleBox) => {
      drawBox(x)
    })
    //drawBox(box2)

    fps_tick++
    setTimeout(loop, 1000 / frames)

  }

  loop()

}

main()
