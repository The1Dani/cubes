var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// TODO: Put input for max FPS and number of boxes 
var Vector2D = /** @class */ (function () {
    function Vector2D(x, y) {
        this.x = x;
        this.y = y;
        this.x = x;
        this.y = y;
    }
    Vector2D.prototype.add = function (v2) {
        return new Vector2D(this.x + v2.x, this.y + v2.y);
    };
    Vector2D.prototype.mul = function (v) {
        if (v instanceof Vector2D) {
            return new Vector2D(this.x * v.x, this.y * v.y);
        }
        return new Vector2D(this.x * v, this.y * v);
    };
    Vector2D.prototype.toString = function () {
        return "(".concat(this.x, ", ").concat(this.y, ")");
    };
    return Vector2D;
}());
var Color = /** @class */ (function () {
    function Color(r, g, b) {
        this.r = r % 256;
        this.g = g % 256;
        this.b = b % 256;
    }
    Color.prototype.toString = function () {
        return "rgb(".concat(this.r, ", ").concat(this.g, ", ").concat(this.b, ")");
    };
    Color.random = function () {
        return new Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
    };
    return Color;
}());
function getDivElementByID(id) {
    var el = document.getElementById(id);
    if (!(el instanceof HTMLDivElement)) {
        throw new Error("There is no such element");
    }
    return el;
}
var Canvas = /** @class */ (function () {
    function Canvas() {
        this.newCanvas();
    }
    Canvas.prototype.newCanvas = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.size = new Vector2D(width, height);
    };
    return Canvas;
}());
var Box = /** @class */ (function () {
    function Box(id, settings) {
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
    Box.prototype.setColor = function (color) {
        this.el.style.backgroundColor = color;
    };
    Box.prototype.kill = function () {
        this.el.parentNode.removeChild(this.el);
    };
    return Box;
}());
var MovebleBox = /** @class */ (function (_super) {
    __extends(MovebleBox, _super);
    function MovebleBox(id, canvas, settings) {
        var _this = _super.call(this, id, settings) || this;
        _this.el = getDivElementByID(id);
        _this.size = _this.getSize();
        _this.vel = settings.vel || new Vector2D(1, 1);
        _this.pos = _this.getPos();
        _this.canvas = canvas;
        return _this;
    }
    MovebleBox.prototype.getSize = function () {
        return new Vector2D(parseFloat(window.getComputedStyle(this.el).width), parseFloat(window.getComputedStyle(this.el).height));
    };
    MovebleBox.prototype.getPos = function () {
        var comp_style = window.getComputedStyle(this.el);
        return new Vector2D(parseFloat(comp_style.left), parseFloat(comp_style.top));
    };
    MovebleBox.prototype.setPos = function (pos) {
        this.pos = pos;
        this.el.style.left = pos.x + "px";
        this.el.style.top = pos.y + "px";
    };
    MovebleBox.prototype.right = function (pos) {
        return pos.add(this.size);
    };
    MovebleBox.prototype.inWidthAtNextPos = function (pos) {
        return this.canvas.size.x >= this.right(pos).x && pos.x >= 0;
    };
    MovebleBox.prototype.inHeightAtNextPos = function (pos) {
        return this.canvas.size.y >= this.right(pos).y && pos.y >= 0;
    };
    MovebleBox.prototype.isInCanvasAtNextPos = function (pos) {
        return this.inWidthAtNextPos(pos) && this.inHeightAtNextPos(pos);
    };
    MovebleBox.prototype.nextPos = function (vel) {
        return this.pos.add(vel);
    };
    return MovebleBox;
}(Box));
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
        });
    });
}
var boxSett = {
    size: new Vector2D(100, 200),
    color: "blue",
    pos: new Vector2D(50, 50)
};
var lastTime = Date.now();
var deltaTime;
var drawBox = function (box) {
    box.canvas.newCanvas();
    var dx = box.vel.mul(deltaTime);
    var speedFactor = 1;
    var nextPos = box.nextPos(dx);
    if (box.isInCanvasAtNextPos(nextPos)) {
        box.setPos(nextPos);
    }
    else if (!box.inHeightAtNextPos(nextPos) && box.inWidthAtNextPos(nextPos)) {
        box.vel = box.vel.mul(new Vector2D(speedFactor, -speedFactor));
        var nf = nextPos.add(box.vel.mul(deltaTime));
        if (!box.isInCanvasAtNextPos(nf)) {
            box.setPos(new Vector2D(randNum(0, box.canvas.size.x - box.size.x), randNum(0, box.canvas.size.y - box.size.y)));
        }
    }
    else if (box.inHeightAtNextPos(nextPos) && !box.inWidthAtNextPos(nextPos)) {
        box.vel = box.vel.mul(new Vector2D(-speedFactor, speedFactor));
        var nf = nextPos.add(box.vel.mul(deltaTime));
        if (!box.isInCanvasAtNextPos(nf)) {
            box.setPos(new Vector2D(randNum(0, box.canvas.size.x - box.size.x), randNum(0, box.canvas.size.y - box.size.y)));
        }
    }
    else {
        box.vel = box.vel.mul(-speedFactor);
    }
};
function randNum(lower, upper) {
    var num = upper - lower;
    return Math.floor(Math.random() * num) + lower;
}
function getInput(id) {
    var num = Number(document.getElementById(id)
        .value);
    return num;
}
var main = function () {
    var frames = 65;
    var fps_tick = 0;
    var sett = boxSett;
    sett.size = new Vector2D(50, 50);
    var canvas = new Canvas;
    var num = 50;
    var newNum = num;
    var colorFreq = frames / 30;
    var speed = 5;
    var newSpeed = speed;
    sett.vel = new Vector2D(1, 1).mul(speed * 10);
    var boxArr = [];
    var newArr = function (num) {
        if (boxArr.length >= 0) {
            boxArr.forEach(function (v) {
                v.kill();
            });
            boxArr.splice(0, boxArr.length);
        }
        var arr = [];
        for (var i = 0; i < num; i++) {
            sett.color = Color.random().toString();
            sett.pos = new Vector2D(randNum(0, canvas.size.x - sett.size.x), randNum(0, canvas.size.y - sett.size.y));
            arr.push(new MovebleBox("box".concat(i), canvas, sett));
        }
        return arr;
    };
    boxArr = newArr(num);
    var loop = function () {
        if (fps_tick % frames - 1 == 0)
            newNum = (newNum = getInput("amount")) <= 0 ? num : newNum;
        if (num != newNum) {
            boxArr = newArr(newNum);
            num = newNum;
        }
        if (fps_tick % frames - 1 == 0)
            newSpeed = (newSpeed = getInput("speed")) <= 0 ? speed : newSpeed;
        if (speed != newSpeed) {
            boxArr.forEach(function (v) {
                v.vel = new Vector2D(1, 1).mul(newSpeed * 10);
            });
            speed = newSpeed;
            sett.vel = new Vector2D(1, 1).mul(newSpeed * 10);
        }
        fps_tick = (fps_tick + 1) % frames;
        var now = Date.now();
        deltaTime = (now - lastTime) / 1000;
        lastTime = now;
        if (fps_tick % 10 == 0) {
            document.getElementById("fps").innerHTML = "FPS: " + Math.floor(1 / deltaTime);
        }
        if (fps_tick % colorFreq == 0) {
            boxArr.forEach(function (x) {
                x.setColor(Color.random().toString());
            });
        }
        boxArr.forEach(function (x) {
            drawBox(x);
        });
        //drawBox(box2)
        fps_tick++;
        setTimeout(loop, 1000 / frames);
    };
    loop();
};
main();
