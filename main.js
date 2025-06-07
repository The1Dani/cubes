(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // main.ts
  var require_main = __commonJS({
    "main.ts"() {
      var buf = new ArrayBuffer(4);
      var f32 = new Float32Array(buf);
      var u32 = new Uint32Array(buf);
      var Vector2D = class _Vector2D {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.x = x;
          this.y = y;
        }
        add(v2) {
          return new _Vector2D(this.x + v2.x, this.y + v2.y);
        }
        mul(v) {
          if (v instanceof _Vector2D) {
            return new _Vector2D(this.x * v.x, this.y * v.y);
          }
          return new _Vector2D(this.x * v, this.y * v);
        }
        isq(x) {
          return 1 / Math.sqrt(x);
        }
        direction_v() {
          const ivel = this.isq(this.x ** 2 + this.y ** 2);
          return this.mul(ivel);
        }
        toString() {
          return `(${this.x}, ${this.y})`;
        }
        static unit = new _Vector2D(1, 1);
      };
      var Color = class _Color {
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
          return new _Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
        }
      };
      function getDivElementByID(id) {
        const el = document.getElementById(id);
        if (!(el instanceof HTMLDivElement)) {
          throw new Error("There is no such element");
        }
        return el;
      }
      var Canvas = class {
        size;
        newCanvas() {
          const width = window.innerWidth;
          const height = window.innerHeight;
          this.size = new Vector2D(width, height);
        }
        constructor() {
          this.newCanvas();
        }
      };
      var Box = class {
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
          this.el.parentNode.removeChild(
            this.el
          );
        }
      };
      var MovebleBox = class extends Box {
        canvas;
        vel;
        gravity;
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
          this.vel = settings.vel || Vector2D.unit;
          this.gravity = settings.gravity || new Vector2D(0, 0);
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
        nextPos(deltaTime2) {
          const dx = this.vel.mul(deltaTime2);
          return this.pos.add(dx);
        }
      };
      var boxSett = {
        size: new Vector2D(100, 200),
        color: "blue",
        pos: Vector2D.unit.mul(50),
        gravity: new Vector2D(0, 400),
        vel: new Vector2D(200, 0)
      };
      var lastTime = Date.now();
      var deltaTime;
      var drawBox = (box) => {
        box.canvas.newCanvas();
        const speedFactor = 0.9;
        box.vel = box.vel.add(box.gravity.mul(deltaTime));
        const nextPos = box.nextPos(deltaTime);
        const bunny = -50;
        if (box.isInCanvasAtNextPos(nextPos)) {
          box.setPos(nextPos);
        } else if (!box.inHeightAtNextPos(nextPos) && box.inWidthAtNextPos(nextPos)) {
          box.vel = box.vel.mul(new Vector2D(1, -speedFactor));
          if (nextPos.y - box.size.y < 0) {
            box.setPos(
              new Vector2D(box.pos.x, 0)
            );
          } else {
            box.vel = box.vel.add(new Vector2D(0, bunny));
            box.setPos(
              new Vector2D(box.pos.x, -box.size.y + box.canvas.size.y)
            );
          }
        } else if (box.inHeightAtNextPos(nextPos) && !box.inWidthAtNextPos(nextPos)) {
          box.vel = box.vel.mul(new Vector2D(-speedFactor, 1));
          if (nextPos.x < 0) {
            box.setPos(
              new Vector2D(0, box.pos.y)
            );
          } else {
            box.setPos(
              new Vector2D(-box.size.x + box.canvas.size.x, box.pos.y)
            );
          }
        } else {
          box.vel = box.vel.mul(-speedFactor);
        }
      };
      function randNum(lower, upper) {
        let num = upper - lower;
        return Math.floor(Math.random() * num) + lower;
      }
      function getInput(id) {
        const num = Number(
          document.getElementById(id).value
        );
        return num;
      }
      var main = () => {
        const frames = 65;
        let fps_tick = 0;
        const sett = boxSett;
        sett.size = new Vector2D(50, 50);
        const canvas = new Canvas();
        let num = 50;
        let newNum = num;
        const colorFreq = frames / 30;
        let speed = 5;
        let newSpeed = speed;
        let boxArr = [];
        let newArr = (num2) => {
          if (boxArr.length >= 0) {
            boxArr.forEach((v) => {
              v.kill();
            });
            boxArr.splice(0, boxArr.length);
          }
          let arr = [];
          for (let i = 0; i < num2; i++) {
            sett.color = Color.random().toString();
            sett.pos = new Vector2D(randNum(0, canvas.size.x - sett.size.x), randNum(0, canvas.size.y - sett.size.y));
            arr.push(new MovebleBox(`box${i}`, canvas, sett));
          }
          return arr;
        };
        boxArr = newArr(num);
        console.log(sett.vel.direction_v().toString());
        let loop = () => {
          if (fps_tick % frames - 1 == 0) newNum = (newNum = getInput("amount")) <= 0 ? num : newNum;
          if (num != newNum) {
            boxArr = newArr(newNum);
            num = newNum;
          }
          if (fps_tick % frames - 1 == 0) newSpeed = (newSpeed = getInput("speed")) <= 0 ? speed : newSpeed;
          if (speed != newSpeed) {
            const newSpeedVec = sett.vel.direction_v().mul(newSpeed * 10);
            boxArr.forEach((v) => {
              v.vel = newSpeedVec;
            });
            speed = newSpeed;
            sett.vel = newSpeedVec;
          }
          if (fps_tick % 2 == 1)
            document.getElementById("vel").innerHTML = "V: " + boxArr[0].vel.toString();
          fps_tick = (fps_tick + 1) % frames;
          const now = Date.now();
          deltaTime = (now - lastTime) / 1e3;
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
          fps_tick++;
          setTimeout(loop, 1e3 / frames);
        };
        loop();
      };
      main();
    }
  });
  require_main();
})();
