/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/static/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Game = __webpack_require__(2);

	var _Game2 = _interopRequireDefault(_Game);

	var _constant = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var game = new _Game2.default();

	var addTowerBlock = document.getElementById('add-tower');
	addTowerBlock.addEventListener('click', function () {
	    game.mode = game.mode === 'ADD_TOWER' ? '' : 'ADD_TOWER';
	});

	var canvas = document.getElementById("drawing");

	// 在canvas上进行右键操作
	canvas.oncontextmenu = function (e) {
	    game.mode = '';
	    e.preventDefault();
	};

	document.onmousemove = function (e) {
	    if (game.mode === 'ADD_TOWER') {
	        game.cursorX = e.pageX;
	        game.cursorY = e.pageY;
	        var rect = canvas.getBoundingClientRect();
	        var x = e.clientX - rect.left;
	        var y = e.clientY - rect.top;
	        game.coordX = Math.floor(x / _constant.gridWidth);
	        game.coordY = Math.floor(y / _constant.gridHeight);
	    }
	};

	document.onclick = function (e) {
	    var rect = canvas.getBoundingClientRect();

	    var x = e.clientX - rect.left;
	    var y = e.clientY - rect.top;

	    var coordX = Math.floor(x / _constant.gridWidth);
	    var coordY = Math.floor(y / _constant.gridHeight);

	    /* 只在地图范围内进行操作 */
	    if (0 <= coordX && coordX < _constant.gridNumX && 0 <= coordY && coordY < _constant.gridNumY) {

	        if (game.map[coordX][coordY] === 'T') {
	            // 点击的格子内为塔
	            game.towers.map(function (tower, index) {
	                if (tower.coordX === coordX && tower.coordY === coordY) {
	                    console.log('You select ' + index + 'th tower');

	                    // 已经选中的塔再次点击则取消
	                    if (game.towerSelectIndex === index) {
	                        game.towerSelectIndex = -1;
	                        game.towerSelect = false;
	                    } else {
	                        game.towerSelectIndex = index;
	                        game.towerSelect = true;
	                    }
	                }
	            });
	        } else {
	            game.towerSelect = false;
	            game.towerSelectIndex = -1;
	        }

	        if (game.mode === 'ADD_TOWER') {
	            game.createNewTower(coordX, coordY);
	        }
	    }
	    // console.log(coordX, coordY);
	};

	var sellButton = document.getElementById('sell-tower');
	sellButton.onclick = function () {
	    if (game.towerSelect === true) {
	        console.log('you sell a tower');
	        game.sellTower();
	    } else {
	        // console.log('do nothing');
	    }
	};

	var vehicleCountNode = document.createElement("p");
	vehicleCountNode.setAttribute("id", "vehicleCount");
	var textnode = document.createTextNode('Vehicle Count: ' + game.vehicles.length);
	vehicleCountNode.appendChild(textnode);
	document.body.appendChild(vehicleCountNode);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _Path = __webpack_require__(5);

	var _Path2 = _interopRequireDefault(_Path);

	var _Vehicle = __webpack_require__(6);

	var _Vehicle2 = _interopRequireDefault(_Vehicle);

	var _SimpleTower = __webpack_require__(8);

	var _SimpleTower2 = _interopRequireDefault(_SimpleTower);

	var _utils = __webpack_require__(10);

	var _constant = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WIDTH = 800;
	var HEIGHT = 640;
	var canvas = document.getElementById("drawing");
	var ctx = canvas.getContext("2d");

	var Game = function () {
	    function Game() {
	        _classCallCheck(this, Game);

	        // Init
	        canvas.width = WIDTH;
	        canvas.height = HEIGHT;

	        // Create an instance of Path object
	        this.path = new _Path2.default(ctx);
	        // Set path radius
	        this.path.radius = _constant.gridWidth / 2;

	        this.vehicles = [];
	        this.bullets = [];
	        this.towers = [];

	        this.money = 2000;

	        this.coordX = 0;
	        this.coordY = 0;

	        this.vehicleCreatedCount = 0; // 目前已经创建的vehicle的总数
	        this.lastCreatedVehicleTime = new Date();

	        this.map = [];
	        for (var i = 0; i < _constant.gridNumX; i++) {
	            this.map[i] = [];
	        }

	        var newTowerCoord = [8, 8];
	        this.simpleTower = new _SimpleTower2.default(ctx, _constant.gridWidth / 2 + newTowerCoord[0] * _constant.gridWidth, _constant.gridHeight / 2 + newTowerCoord[1] * _constant.gridHeight, this.bullets);
	        this.map[newTowerCoord[0]][newTowerCoord[1]] = 'T';
	        this.towers.push(this.simpleTower);

	        this.mode = '';

	        this.pathCoord = [[0, 0], [18, 0], [18, 4], [10, 4], [10, 10], [16, 10], [16, 14], [-6, 14]];

	        this.score = 0;

	        // 当前是否选中塔
	        this.towerSelect = false;
	        this.towerSelectIndex = -1;

	        // Add points to the path
	        this.setPoints();

	        this.draw();
	    }

	    // Define path points


	    _createClass(Game, [{
	        key: 'setPoints',
	        value: function setPoints() {
	            // Set path offset
	            // const offset = HEIGHT / 10;

	            // this.path.addPoint(offset, offset);
	            // this.path.addPoint(offset * 3, offset);
	            // this.path.addPoint(offset * 3, offset * 6);
	            // this.path.addPoint(offset * 6, offset * 6);
	            // this.path.addPoint(offset * 6, offset);
	            // this.path.addPoint(WIDTH - offset, offset);
	            // this.path.addPoint(WIDTH - offset, offset * 5);
	            // this.path.addPoint(WIDTH - offset - 200, offset * 5);
	            // this.path.addPoint(WIDTH - offset - 200, offset * 7);
	            // this.path.addPoint(WIDTH - offset, offset * 7);
	            // this.path.addPoint(WIDTH - offset, HEIGHT - offset);
	            // this.path.addPoint(0, HEIGHT - offset);
	            // this.path.addPoint(-100, HEIGHT - offset);

	            for (var i = 0, len = this.pathCoord.length; i < len; i++) {
	                var coord = this.pathCoord[i];
	                this.path.addPoint(40 * coord[0] + 20, 40 * coord[1] + 20);
	            }
	            // this.path.addPoint(-100, HEIGHT - offset);
	        }

	        // Specify what to draw

	    }, {
	        key: 'draw',
	        value: function draw() {
	            var _this = this;

	            // Clear canvas

	            ctx.fillStyle = '#000';
	            ctx.fillRect(0, 0, WIDTH, HEIGHT);

	            // 
	            this.drawMap();

	            // Render the path
	            this.path.display();

	            // 总数小于50，且间隔1000ms以上
	            if (this.vehicleCreatedCount < 100 && new Date() - this.lastCreatedVehicleTime > 1000) {
	                var mass = Math.random() * 3 + 3;

	                var vehicle = new _Vehicle2.default(_vec2.default.fromValues(_constant.gridWidth / 2 + (Math.random() - 0.5) * 5, _constant.gridHeight / 2 + (Math.random() - 0.5) * 5), mass, ctx);

	                this.vehicles.push(vehicle);
	                this.vehicleCreatedCount++;
	                this.lastCreatedVehicleTime = new Date();
	            }

	            for (var i = 0; i < this.vehicles.length; i++) {
	                this.vehicles[i].applyBehaviors(this.vehicles, this.path);
	                this.vehicles[i].run();

	                if (this.vehicles[i].dead === true) {
	                    this.vehicles.remove(i);
	                    i--;
	                }
	            }

	            // Draw our tower
	            for (var _i = 0, len = this.towers.length; _i < len; _i++) {
	                this.towers[_i].draw(ctx);
	            }

	            // 检查bullet是否与vehicle相撞
	            this.detectImpact();

	            // 移除出界的bullet，画出剩下的bullet
	            for (var _i2 = 0; _i2 < this.bullets.length; _i2++) {
	                if (this.bullets[_i2].start[0] < 0 || this.bullets[_i2].start[1] < 0 || this.bullets[_i2].start[0] > WIDTH || this.bullets[_i2].start[1] > HEIGHT) {
	                    this.bullets.remove(_i2);
	                    _i2--;
	                } else {
	                    this.bullets[_i2].draw(ctx);
	                }
	            }

	            if (document.getElementById('vehicleCount')) {
	                document.getElementById('vehicleCount').innerHTML = 'Vehicle Count: ' + this.vehicles.length + ', Bullets: ' + this.bullets.length;
	            }

	            if (this.mode === 'ADD_TOWER') {
	                // 添加塔模式
	                if (0 <= this.coordX && this.coordX < _constant.gridNumX && 0 <= this.coordY && this.coordY < _constant.gridNumY) {
	                    if (this.map[this.coordX][this.coordY] !== 'T') {
	                        // 该位置没有塔
	                        this.drawGhostTower(ctx, this.coordX * _constant.gridWidth + _constant.gridWidth / 2, this.coordY * _constant.gridHeight + _constant.gridHeight / 2);
	                    }
	                }
	            }

	            // 画面右侧信息的显示
	            document.getElementById('score').innerHTML = 'Score: ' + this.score;
	            document.getElementById('money').innerHTML = 'Money: ' + this.money;

	            requestAnimationFrame(function () {
	                return _this.draw();
	            }, 100);

	            // setTimeout( () => {
	            //     requestAnimationFrame(() => this.draw());
	            // }, 1000 / 100);
	        }

	        // 循环检测bullet是否和vehicle碰撞

	    }, {
	        key: 'detectImpact',
	        value: function detectImpact() {
	            for (var i = 0; i < this.bullets.length; i++) {
	                var impact = false;
	                for (var j = 0; j < this.vehicles.length; j++) {

	                    // 求圆心至bullet的垂足
	                    var normal = _vec2.default.create();
	                    var bVec = this.bullets[i].directionVec;
	                    var aDotB = 1;

	                    var aVec = _vec2.default.fromValues(this.vehicles[j].location[0] - this.bullets[i].start[0], this.vehicles[j].location[1] - this.bullets[i].start[1]);
	                    _vec2.default.multiply(aDotB, aVec, bVec);
	                    _vec2.default.scale(bVec, bVec, aDotB);
	                    _vec2.default.add(normal, this.bullets[i].start, bVec);

	                    var distance = (0, _utils.calcuteDistance)(normal[0], normal[1], this.vehicles[j].location[0], this.vehicles[j].location[1]);

	                    if (distance <= this.vehicles[j].radius) {
	                        impact = true;
	                        this.vehicles.remove(j);j--;
	                        this.score += 100;
	                        break;
	                    }
	                }
	                if (impact) {
	                    this.bullets.remove(i);i--;
	                }
	            }
	        }

	        /**
	         * 创建一个新的tower
	         * @param {Number} coordX x轴的坐标  
	         * @param {Number} coordY y轴的坐标
	         */

	    }, {
	        key: 'createNewTower',
	        value: function createNewTower(coordX, coordY) {
	            console.log(coordX, coordY);

	            // 检查当前位置是否已有物体
	            if (this.map[coordX][coordY] === 'T') {
	                console.log('You can not place tower here!');
	                return -1;
	            }

	            var cost = _constant.towerCost.simpleTower;
	            // 检查是否有足够金钱
	            if (this.money - cost < 0) {
	                console.log('You do not have enough money.');
	                return -1;
	            }

	            var x = coordX * _constant.gridWidth + _constant.gridWidth / 2;
	            var y = coordY * _constant.gridWidth + _constant.gridWidth / 2;
	            var tower = new _SimpleTower2.default(ctx, x, y, this.bullets);
	            this.map[coordX][coordY] = 'T';
	            this.money -= cost;
	            this.towers.push(tower);
	        }
	    }, {
	        key: 'sellTower',
	        value: function sellTower() {
	            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.towerSelectIndex;

	            var coordX = this.towers[index].coordX;
	            var coordY = this.towers[index].coordY;
	            this.towers.remove(index);
	            this.map[coordX][coordY] = '';

	            this.money += 400;
	            this.towerSelect = false;
	            this.towerSelectIndex = -1;
	        }
	    }, {
	        key: 'drawGhostTower',
	        value: function drawGhostTower(ctx, x, y, towerType) {
	            var tower = new _SimpleTower2.default(ctx, x, y, this.bullets);
	            tower.draw(ctx);
	        }
	    }, {
	        key: 'drawMap',
	        value: function drawMap() {
	            ctx.save();
	            ctx.strokeStyle = '#fff';
	            ctx.fillStyle = '#010101';
	            ctx.lineWidth = 1;
	            ctx.fillRect(0, 0, WIDTH, HEIGHT);
	            // 横纵数目相等
	            var size = 20;

	            // ctx.clearRect(0, 0, canvas.width, canvas.height);

	            ctx.beginPath();
	            // Draw vertical lines
	            for (var i = 0; i < size + 1; i++) {
	                ctx.moveTo(i * _constant.gridWidth, 0);
	                ctx.lineTo(i * _constant.gridWidth, size * _constant.gridHeight);
	            }
	            ctx.stroke();

	            // Draw horizontal lines
	            for (i = 0; i < size + 1; i++) {
	                ctx.moveTo(0, i * _constant.gridWidth);
	                ctx.lineTo(size * _constant.gridWidth, i * _constant.gridWidth);
	            }
	            ctx.stroke();

	            // 当前选中的格子突出显示
	            if (this.towerSelect) {
	                var coordX = this.towers[this.towerSelectIndex].coordX;
	                var coordY = this.towers[this.towerSelectIndex].coordY;

	                fillGrid(coordX, coordY, 'red');
	            }

	            // 给一个格子上色
	            function fillGrid(x, y, color) {
	                ctx.fillStyle = color || "#666";
	                ctx.fillRect(x * _constant.gridWidth + 1, y * _constant.gridHeight + 1, _constant.gridWidth - 2, _constant.gridHeight - 2);
	            }

	            ctx.restore();
	        }
	    }]);

	    return Game;
	}();

	exports.default = Game;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	var glMatrix = __webpack_require__(4);

	/**
	 * @class 2 Dimensional Vector
	 * @name vec2
	 */
	var vec2 = {};

	/**
	 * Creates a new, empty vec2
	 *
	 * @returns {vec2} a new 2D vector
	 */
	vec2.create = function() {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = 0;
	    out[1] = 0;
	    return out;
	};

	/**
	 * Creates a new vec2 initialized with values from an existing vector
	 *
	 * @param {vec2} a vector to clone
	 * @returns {vec2} a new 2D vector
	 */
	vec2.clone = function(a) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};

	/**
	 * Creates a new vec2 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} a new 2D vector
	 */
	vec2.fromValues = function(x, y) {
	    var out = new glMatrix.ARRAY_TYPE(2);
	    out[0] = x;
	    out[1] = y;
	    return out;
	};

	/**
	 * Copy the values from one vec2 to another
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the source vector
	 * @returns {vec2} out
	 */
	vec2.copy = function(out, a) {
	    out[0] = a[0];
	    out[1] = a[1];
	    return out;
	};

	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */
	vec2.set = function(out, x, y) {
	    out[0] = x;
	    out[1] = y;
	    return out;
	};

	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.add = function(out, a, b) {
	    out[0] = a[0] + b[0];
	    out[1] = a[1] + b[1];
	    return out;
	};

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.subtract = function(out, a, b) {
	    out[0] = a[0] - b[0];
	    out[1] = a[1] - b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.subtract}
	 * @function
	 */
	vec2.sub = vec2.subtract;

	/**
	 * Multiplies two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.multiply = function(out, a, b) {
	    out[0] = a[0] * b[0];
	    out[1] = a[1] * b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.multiply}
	 * @function
	 */
	vec2.mul = vec2.multiply;

	/**
	 * Divides two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.divide = function(out, a, b) {
	    out[0] = a[0] / b[0];
	    out[1] = a[1] / b[1];
	    return out;
	};

	/**
	 * Alias for {@link vec2.divide}
	 * @function
	 */
	vec2.div = vec2.divide;

	/**
	 * Math.ceil the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to ceil
	 * @returns {vec2} out
	 */
	vec2.ceil = function (out, a) {
	    out[0] = Math.ceil(a[0]);
	    out[1] = Math.ceil(a[1]);
	    return out;
	};

	/**
	 * Math.floor the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to floor
	 * @returns {vec2} out
	 */
	vec2.floor = function (out, a) {
	    out[0] = Math.floor(a[0]);
	    out[1] = Math.floor(a[1]);
	    return out;
	};

	/**
	 * Returns the minimum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.min = function(out, a, b) {
	    out[0] = Math.min(a[0], b[0]);
	    out[1] = Math.min(a[1], b[1]);
	    return out;
	};

	/**
	 * Returns the maximum of two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	vec2.max = function(out, a, b) {
	    out[0] = Math.max(a[0], b[0]);
	    out[1] = Math.max(a[1], b[1]);
	    return out;
	};

	/**
	 * Math.round the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to round
	 * @returns {vec2} out
	 */
	vec2.round = function (out, a) {
	    out[0] = Math.round(a[0]);
	    out[1] = Math.round(a[1]);
	    return out;
	};

	/**
	 * Scales a vec2 by a scalar number
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec2} out
	 */
	vec2.scale = function(out, a, b) {
	    out[0] = a[0] * b;
	    out[1] = a[1] * b;
	    return out;
	};

	/**
	 * Adds two vec2's after scaling the second operand by a scalar value
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec2} out
	 */
	vec2.scaleAndAdd = function(out, a, b, scale) {
	    out[0] = a[0] + (b[0] * scale);
	    out[1] = a[1] + (b[1] * scale);
	    return out;
	};

	/**
	 * Calculates the euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} distance between a and b
	 */
	vec2.distance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return Math.sqrt(x*x + y*y);
	};

	/**
	 * Alias for {@link vec2.distance}
	 * @function
	 */
	vec2.dist = vec2.distance;

	/**
	 * Calculates the squared euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	vec2.squaredDistance = function(a, b) {
	    var x = b[0] - a[0],
	        y = b[1] - a[1];
	    return x*x + y*y;
	};

	/**
	 * Alias for {@link vec2.squaredDistance}
	 * @function
	 */
	vec2.sqrDist = vec2.squaredDistance;

	/**
	 * Calculates the length of a vec2
	 *
	 * @param {vec2} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	vec2.length = function (a) {
	    var x = a[0],
	        y = a[1];
	    return Math.sqrt(x*x + y*y);
	};

	/**
	 * Alias for {@link vec2.length}
	 * @function
	 */
	vec2.len = vec2.length;

	/**
	 * Calculates the squared length of a vec2
	 *
	 * @param {vec2} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	vec2.squaredLength = function (a) {
	    var x = a[0],
	        y = a[1];
	    return x*x + y*y;
	};

	/**
	 * Alias for {@link vec2.squaredLength}
	 * @function
	 */
	vec2.sqrLen = vec2.squaredLength;

	/**
	 * Negates the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to negate
	 * @returns {vec2} out
	 */
	vec2.negate = function(out, a) {
	    out[0] = -a[0];
	    out[1] = -a[1];
	    return out;
	};

	/**
	 * Returns the inverse of the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to invert
	 * @returns {vec2} out
	 */
	vec2.inverse = function(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  return out;
	};

	/**
	 * Normalize a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to normalize
	 * @returns {vec2} out
	 */
	vec2.normalize = function(out, a) {
	    var x = a[0],
	        y = a[1];
	    var len = x*x + y*y;
	    if (len > 0) {
	        //TODO: evaluate use of glm_invsqrt here?
	        len = 1 / Math.sqrt(len);
	        out[0] = a[0] * len;
	        out[1] = a[1] * len;
	    }
	    return out;
	};

	/**
	 * Calculates the dot product of two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	vec2.dot = function (a, b) {
	    return a[0] * b[0] + a[1] * b[1];
	};

	/**
	 * Computes the cross product of two vec2's
	 * Note that the cross product must by definition produce a 3D vector
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec3} out
	 */
	vec2.cross = function(out, a, b) {
	    var z = a[0] * b[1] - a[1] * b[0];
	    out[0] = out[1] = 0;
	    out[2] = z;
	    return out;
	};

	/**
	 * Performs a linear interpolation between two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec2} out
	 */
	vec2.lerp = function (out, a, b, t) {
	    var ax = a[0],
	        ay = a[1];
	    out[0] = ax + t * (b[0] - ax);
	    out[1] = ay + t * (b[1] - ay);
	    return out;
	};

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec2} out
	 */
	vec2.random = function (out, scale) {
	    scale = scale || 1.0;
	    var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	    out[0] = Math.cos(r) * scale;
	    out[1] = Math.sin(r) * scale;
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2 = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y;
	    out[1] = m[1] * x + m[3] * y;
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat2d
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat2d} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat2d = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[2] * y + m[4];
	    out[1] = m[1] * x + m[3] * y + m[5];
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat3
	 * 3rd vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat3} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat3 = function(out, a, m) {
	    var x = a[0],
	        y = a[1];
	    out[0] = m[0] * x + m[3] * y + m[6];
	    out[1] = m[1] * x + m[4] * y + m[7];
	    return out;
	};

	/**
	 * Transforms the vec2 with a mat4
	 * 3rd vector component is implicitly '0'
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec2} out
	 */
	vec2.transformMat4 = function(out, a, m) {
	    var x = a[0], 
	        y = a[1];
	    out[0] = m[0] * x + m[4] * y + m[12];
	    out[1] = m[1] * x + m[5] * y + m[13];
	    return out;
	};

	/**
	 * Perform some operation over an array of vec2s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	vec2.forEach = (function() {
	    var vec = vec2.create();

	    return function(a, stride, offset, count, fn, arg) {
	        var i, l;
	        if(!stride) {
	            stride = 2;
	        }

	        if(!offset) {
	            offset = 0;
	        }
	        
	        if(count) {
	            l = Math.min((count * stride) + offset, a.length);
	        } else {
	            l = a.length;
	        }

	        for(i = offset; i < l; i += stride) {
	            vec[0] = a[i]; vec[1] = a[i+1];
	            fn(vec, vec, arg);
	            a[i] = vec[0]; a[i+1] = vec[1];
	        }
	        
	        return a;
	    };
	})();

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec2} vec vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	vec2.str = function (a) {
	    return 'vec2(' + a[0] + ', ' + a[1] + ')';
	};

	/**
	 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec2.exactEquals = function (a, b) {
	    return a[0] === b[0] && a[1] === b[1];
	};

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	vec2.equals = function (a, b) {
	    var a0 = a[0], a1 = a[1];
	    var b0 = b[0], b1 = b[1];
	    return (Math.abs(a0 - b0) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
	            Math.abs(a1 - b1) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
	};

	module.exports = vec2;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE. */

	/**
	 * @class Common utilities
	 * @name glMatrix
	 */
	var glMatrix = {};

	// Configuration Constants
	glMatrix.EPSILON = 0.000001;
	glMatrix.ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
	glMatrix.RANDOM = Math.random;
	glMatrix.ENABLE_SIMD = false;

	// Capability detection
	glMatrix.SIMD_AVAILABLE = (glMatrix.ARRAY_TYPE === Float32Array) && ('SIMD' in this);
	glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE;

	/**
	 * Sets the type of array used when creating new vectors and matrices
	 *
	 * @param {Type} type Array type, such as Float32Array or Array
	 */
	glMatrix.setMatrixArrayType = function(type) {
	    glMatrix.ARRAY_TYPE = type;
	}

	var degree = Math.PI / 180;

	/**
	* Convert Degree To Radian
	*
	* @param {Number} Angle in Degrees
	*/
	glMatrix.toRadian = function(a){
	     return a * degree;
	}

	/**
	 * Tests whether or not the arguments have approximately the same value, within an absolute
	 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less 
	 * than or equal to 1.0, and a relative tolerance is used for larger values)
	 * 
	 * @param {Number} a The first number to test.
	 * @param {Number} b The second number to test.
	 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
	 */
	glMatrix.equals = function(a, b) {
		return Math.abs(a - b) <= glMatrix.EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
	}

	module.exports = glMatrix;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Path = function Path(ctx) {
	    'use strict';

	    this.points = [];
	    this.radius = 0;

	    /**
	     * Add a point to path
	     */
	    this.addPoint = function (x, y) {
	        var point = _vec2.default.fromValues(x, y);
	        this.points.push(point);
	    };

	    /**
	     * Render path
	     */
	    this.display = function () {
	        ctx.lineJoin = 'round';
	        ctx.strokeStyle = '#151515';
	        ctx.lineWidth = this.radius * 2;
	        ctx.fillStyle = "red";
	        ctx.shadowBlur = 0;
	        ctx.beginPath();
	        for (var i = 0; i < this.points.length; i++) {
	            ctx.lineTo(this.points[i][0], this.points[i][1]);
	        }

	        // ctx.closePath();
	        ctx.stroke();

	        ctx.beginPath();
	        ctx.lineWidth = 1;
	        ctx.fillStyle = '#151515';
	        ctx.arc(this.points[0][0], this.points[0][1], this.radius, 0.5 * Math.PI, 1.5 * Math.PI, false);
	        ctx.fill();

	        // Draw a line in the middle of the path
	        ctx.strokeStyle = '#233333';
	        ctx.lineWidth = 1;
	        ctx.beginPath();
	        for (i = 0; i < this.points.length; i++) {
	            ctx.lineTo(this.points[i][0], this.points[i][1]);
	        }
	        // ctx.closePath();
	        ctx.stroke();
	    };
	};

	exports.default = Path;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _config = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// The "Vehicle" class
	function Vehicle(location, mass, ctx) {
	    'use strict';

	    var predict = _vec2.default.create();
	    var dir = _vec2.default.create();
	    var a = _vec2.default.create();
	    var b = _vec2.default.create();
	    var ap = _vec2.default.create();
	    var ab = _vec2.default.create();
	    var clonea = _vec2.default.create();
	    var predictLoc = _vec2.default.create();
	    var accelerationVec = _vec2.default.fromValues(0, 0);
	    var steerVec = _vec2.default.create();
	    var diffVec = _vec2.default.create();

	    this.location = location;
	    this.mass = mass;
	    this.maxspeed = 5 / this.mass;
	    this.maxforce = 1 / 5;
	    this.radius = this.mass * 1.5;
	    this.acceleration = _vec2.default.create();
	    this.velocity = _vec2.default.fromValues(this.maxspeed, 0);

	    this.hue = Math.random() * 360;

	    this.dead = false;

	    this.applyBehaviors = function (vehicles, path) {
	        var f = this.follow(path);
	        var s = this.separate(vehicles);

	        // Scale up forces to produce stronger impact
	        _vec2.default.scale(f, f, 2); // f = f * 2
	        _vec2.default.scale(s, s, 4); // s = s * 4

	        // Calculate the average force
	        var forces = _vec2.default.add(_vec2.default.create(), f, s);
	        _vec2.default.scale(forces, forces, 1 / this.mass); // divide force by its mass

	        // Apply force
	        this.applyForce(forces);
	    };

	    /**
	     * Apply force on the vehicle
	     */
	    this.applyForce = function (force) {
	        _vec2.default.add(this.acceleration, this.acceleration, force);
	    };

	    /**
	     * Run Vehicle loop
	     */
	    this.run = function () {
	        this.update();
	        this.borders();
	        this.render();
	    };

	    /**
	     * Implement Craig Reynolds' path following algorithm
	     */
	    this.follow = function (path) {

	        // Predict future location
	        predict.set(this.velocity);

	        _vec2.default.normalize(predict, predict);
	        _vec2.default.scale(predict, predict, 25);

	        predictLoc.set([0, 0]);
	        _vec2.default.add(predictLoc, predict, this.location);

	        // Define things
	        var target = null;
	        // Will be updated with shortest distance to path. Start with a very high value.
	        var worldRecord = 1000000;

	        // Loop through each point of the path
	        for (var i = 0, len = path.points.length; i < len; i++) {

	            // Get current and next point of the path
	            a.set(path.points[i]);
	            b.set(path.points[(i + 1) % path.points.length]);

	            // Calculate a normal point
	            var normalPoint = this.getNormalPoint(predictLoc, a, b);

	            // Calculate direction towards the next point
	            dir.set(b);
	            _vec2.default.sub(dir, dir, a);

	            // Set a normal point to the end of the current path segment and recalculate direction if the vehicle is not within it
	            if (normalPoint[0] < Math.min(a[0], b[0]) || normalPoint[0] > Math.max(a[0], b[0]) || normalPoint[1] < Math.min(a[1], b[1]) || normalPoint[1] > Math.max(a[1], b[1])) {

	                normalPoint.set(b);
	                a.set(path.points[(i + 1) % path.points.length]);
	                b.set(path.points[(i + 2) % path.points.length]);

	                dir.set(b);
	                _vec2.default.sub(dir, dir, a);
	            }

	            // Get a distance between future location and normal point
	            var d = _vec2.default.dist(predictLoc, normalPoint);

	            // Calculate steering target for current path segment if the vehicle is going in segment direction
	            if (d < worldRecord) {
	                worldRecord = d;
	                target = normalPoint;

	                _vec2.default.normalize(dir, dir);
	                _vec2.default.scale(dir, dir, 25);
	                _vec2.default.add(target, target, dir);
	            }
	        }

	        // Steer if the vehicle is out of the 1/5 of the path's radius
	        if (worldRecord > path.radius / 5) {
	            return this.seek(target);
	        } else {
	            return _vec2.default.fromValues(0, 0);
	        }
	    };

	    // Find normal point of the future location on current path segment
	    this.getNormalPoint = function (p, a, b) {
	        ap.set(p);
	        _vec2.default.sub(ap, ap, a);
	        ab.set(b);
	        _vec2.default.sub(ab, ab, a);

	        _vec2.default.normalize(ab, ab);
	        _vec2.default.scale(ab, ab, _vec2.default.dot(ap, ab));

	        clonea.set(a);

	        return _vec2.default.add(_vec2.default.create(), clonea, ab);
	    };

	    // Update vehicle's location
	    this.update = function () {
	        // New location = current location + (velocity + acceleration) limited by maximum speed
	        // Reset acceleration to avoid permanent increasing
	        _vec2.default.add(this.velocity, this.velocity, this.acceleration);
	        _vec2.default.limit(this.velocity, this.velocity, this.maxspeed);
	        _vec2.default.add(this.location, this.location, this.velocity);

	        accelerationVec.set([0, 0]);
	        this.acceleration = accelerationVec;
	    };

	    // Produce path following behavior
	    // @param {Array} target Point on the Path where vehicle is steering to
	    this.seek = function (target) {
	        _vec2.default.sub(target, target, this.location);
	        var steer;

	        _vec2.default.normalize(target, target);
	        _vec2.default.scale(target, target, this.maxspeed);

	        steer = target;

	        _vec2.default.sub(steer, steer, this.velocity);
	        _vec2.default.limit(steer, steer, this.maxforce);

	        return steer;
	    };

	    this.separate = function (boids) {
	        var desiredSepartion = this.radius * 2 + 2,
	            count = 0,
	            steer;

	        steerVec.set([0, 0]);
	        steer = steerVec;

	        // Loop through each vehicle
	        for (var i = 0, len = boids.length; i < len; i++) {
	            var other = boids[i],
	                d = this.location;

	            // Get distance between current and other vehicle
	            d = _vec2.default.dist(d, other.location);

	            if (d > 0 && d < desiredSepartion) {

	                // Point away from the vehicle
	                _vec2.default.sub(diffVec, this.location, other.location);

	                _vec2.default.normalize(diffVec, diffVec);

	                // The closer the other vehicle is, the more current one will flee
	                _vec2.default.scale(diffVec, diffVec, 1 / d);

	                _vec2.default.add(steer, steer, diffVec);

	                count++;
	            }
	        }

	        if (count > 0) {
	            _vec2.default.scale(steer, steer, 1 / count);
	        }
	        return steer;
	    };

	    this.borders = function () {
	        if (this.location[0] < -50) {
	            this.dead = true;
	        }
	    };

	    this.render = function () {
	        if (_config.config.renderShadow) {
	            ctx.shadowBlur = this.radius;
	            ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
	        }
	        // ctx.fillStyle = 'hsl(' + this.hue + ',100%,60%';
	        ctx.strokeStyle = 'hsl(' + this.hue + ',100%,80%';
	        ctx.lineWidth = Math.max(3, this.radius / 8);

	        ctx.beginPath();
	        ctx.arc(this.location[0], this.location[1], this.radius, 0, 2 * Math.PI);
	        ctx.closePath();
	        // ctx.fill();
	        ctx.stroke();
	    };
	}

	exports.default = Vehicle;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var config = exports.config = {
	    renderShadow: false
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Bullet = __webpack_require__(9);

	var _Bullet2 = _interopRequireDefault(_Bullet);

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _utils = __webpack_require__(10);

	var _config = __webpack_require__(7);

	var _constant = __webpack_require__(11);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SimpleTower = function () {
	    function SimpleTower(ctx, x, y, bullets) {
	        _classCallCheck(this, SimpleTower);

	        this.x = x;
	        this.y = y;
	        this.coordX = Math.floor((x - _constant.gridWidth / 2) / _constant.gridWidth);
	        this.coordY = Math.floor((y - _constant.gridHeight / 2) / _constant.gridHeight);
	        this.radius = 12;
	        this.hue = 200;
	        this.bullets = bullets;
	        this.cost = _constant.towerCost.simpleTower;
	        this.lastShootTime = new Date();
	        this.direction = 180; // 用度数表示的tower指向
	        this.bulletStartPosVec = _vec2.default.fromValues(0, 0);
	        this.directionVec = _vec2.default.create();
	    }

	    _createClass(SimpleTower, [{
	        key: 'draw',
	        value: function draw(ctx) {
	            // 将方向向量归一化
	            this.directionVec = _vec2.default.fromValues(Math.cos((0, _utils.toRadians)(this.direction)), Math.sin((0, _utils.toRadians)(this.direction)));
	            _vec2.default.normalize(this.directionVec, this.directionVec);

	            // bullet 出射位置

	            _vec2.default.scale(this.bulletStartPosVec, this.directionVec, 30);

	            ctx.save();
	            if (_config.config.renderShadow) {
	                ctx.shadowBlur = this.radius;
	                ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
	            }

	            ctx.strokeStyle = 'hsl(' + this.hue + ',100%,80%';
	            ctx.fillStyle = 'hsl(' + this.hue + ',100%,80%';
	            ctx.lineWidth = Math.max(3, this.radius / 8);

	            ctx.beginPath();
	            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	            ctx.closePath();
	            ctx.stroke();
	            ctx.fill();

	            ctx.beginPath();
	            ctx.moveTo(this.x, this.y);
	            ctx.lineTo(this.x + this.bulletStartPosVec[0], this.y + this.bulletStartPosVec[1]);
	            ctx.stroke();
	            ctx.closePath();

	            if (new Date() - this.lastShootTime >= 400) {
	                this.shoot(ctx);
	                this.lastShootTime = new Date();
	            }

	            this.direction = (this.direction + 0.2) % 360;

	            ctx.restore();
	        }
	    }, {
	        key: 'shoot',


	        // 发射子弹
	        value: function shoot(ctx) {
	            this.bullets.push(new _Bullet2.default(ctx, this.x + this.bulletStartPosVec[0], this.y + this.bulletStartPosVec[1], this.directionVec));
	        }
	    }]);

	    return SimpleTower;
	}();

	exports.default = SimpleTower;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	        value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _utils = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Bullet = function () {
	        function Bullet(ctx, x, y, directionVec) {
	                _classCallCheck(this, Bullet);

	                this.x = x;
	                this.y = y;
	                this.directionVec = directionVec;

	                // {vec2} this.start 表示起点位置的向量
	                this.start = _vec2.default.fromValues(x, y);

	                this.hue = 200;

	                // {vec2} this.velocity 表示bullet速度的向量
	                // 将表示方向的单位向量乘以速率，得到速度向量
	                this.velocity = _vec2.default.create();
	                _vec2.default.scale(this.velocity, directionVec, 2);

	                // bullet的长度
	                this.length = 10;
	                // 从bullet的起点指向终点的向量
	                this.bulletVec = _vec2.default.create();
	                _vec2.default.scale(this.bulletVec, directionVec, this.length);

	                // {vec2} this.end 表示终点位置的向量
	                this.end = _vec2.default.create();
	                this.end = _vec2.default.add(this.end, this.start, this.bulletVec);
	        }

	        _createClass(Bullet, [{
	                key: 'draw',
	                value: function draw(ctx) {
	                        // bullet运动后的起点和终点位置
	                        _vec2.default.add(this.start, this.start, this.velocity);
	                        _vec2.default.add(this.end, this.end, this.velocity);

	                        // 绘图开始
	                        ctx.save();
	                        ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 80%)';
	                        ctx.beginPath();
	                        ctx.moveTo(this.start[0], this.start[1]);
	                        ctx.lineTo(this.end[0], this.end[1]);
	                        ctx.stroke();
	                        ctx.restore();
	                }
	        }]);

	        return Bullet;
	}();

	exports.default = Bullet;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.toRadians = toRadians;
	exports.calcuteDistance = calcuteDistance;

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function toRadians(angle) {
	    return angle * (Math.PI / 180);
	}

	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function (from, to) {
	    var rest = this.slice((to || from) + 1 || this.length);
	    this.length = from < 0 ? this.length + from : from;
	    return this.push.apply(this, rest);
	};

	function calcuteDistance(x1, y1, x2, y2) {
	    var result = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	    return result;
	}

	// Make sure v is smaller than high
	_vec2.default.limit = function (out, v, high) {
	    'use strict';

	    var x = v[0],
	        y = v[1];

	    var len = x * x + y * y;

	    if (len > high * high && len > 0) {
	        out[0] = x;
	        out[1] = y;
	        _vec2.default.normalize(out, out);
	        _vec2.default.scale(out, out, high);
	    }
	    return out;
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var gridWidth = exports.gridWidth = 40;
	var gridHeight = exports.gridHeight = gridWidth;
	var gridNumX = exports.gridNumX = 20; // x轴方向上的格子数目
	var gridNumY = exports.gridNumY = 16; // y轴方向上的格子数目

	var towerCost = exports.towerCost = {
	    'simpleTower': 200
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map