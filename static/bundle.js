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
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _Game = __webpack_require__(2);

	var _Game2 = _interopRequireDefault(_Game);

	var _GameControl = __webpack_require__(17);

	var _GameControl2 = _interopRequireDefault(_GameControl);

	var _constant = __webpack_require__(9);

	var _BaseTower = __webpack_require__(5);

	var _BaseTower2 = _interopRequireDefault(_BaseTower);

	var _BulletTower = __webpack_require__(11);

	var _BulletTower2 = _interopRequireDefault(_BulletTower);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var game = new _Game2.default({
	    element: document.getElementById('drawing')
	});

	var gameControlEle = document.getElementById('game-control-canvas');
	var gameControl = new _GameControl2.default({
	    element: gameControlEle,
	    game: game
	});
	gameControl.draw();

	var canvas = document.getElementById('drawing');

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
	        if (game.map.coord[coordX][coordY] === 'T') {
	            // 点击的格子内为塔
	            game.towers.map(function (tower, index) {
	                if (tower.coordX === coordX && tower.coordY === coordY) {
	                    console.log('You select ' + index + 'th tower');

	                    // 已经选中的塔再次点击则取消
	                    if (game.towerSelectIndex === index) {
	                        game.towerSelectIndex = -1;
	                        game.towerSelectId = -1;
	                        game.towerSelect = false;
	                    } else {
	                        game.towerSelectIndex = index;
	                        game.towerSelectId = tower.id;
	                        game.towerSelect = true;
	                    }
	                }
	            });
	        } else {
	            game.towerSelect = false;
	            game.towerSelectId = -1;
	            game.towerSelectIndex = -1;
	        }

	        if (game.mode === 'ADD_TOWER') {
	            game.createNewTower(coordX, coordY, game.addTowerType);
	        }
	    }
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _glMatrix = __webpack_require__(3);

	var _Path = __webpack_require__(4);

	var _Path2 = _interopRequireDefault(_Path);

	var _BaseTower = __webpack_require__(5);

	var _BaseTower2 = _interopRequireDefault(_BaseTower);

	var _BulletTower = __webpack_require__(11);

	var _BulletTower2 = _interopRequireDefault(_BulletTower);

	var _LaserTower = __webpack_require__(13);

	var _LaserTower2 = _interopRequireDefault(_LaserTower);

	var _Enemy = __webpack_require__(14);

	var _Enemy2 = _interopRequireDefault(_Enemy);

	var _Map = __webpack_require__(15);

	var _Map2 = _interopRequireDefault(_Map);

	var _Wave = __webpack_require__(16);

	var _Wave2 = _interopRequireDefault(_Wave);

	var _utils = __webpack_require__(7);

	var _constant = __webpack_require__(9);

	var _id = __webpack_require__(10);

	var _id2 = _interopRequireDefault(_id);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WIDTH = 800;
	var HEIGHT = 640;
	var canvas = document.getElementById('drawing');
	var ctx = canvas.getContext('2d');

	var gameOverEle = document.getElementById('game-over');

	var Game = function () {
	    function Game(opt) {
	        _classCallCheck(this, Game);

	        // Init
	        canvas.width = WIDTH;
	        canvas.height = HEIGHT;
	        this.element = opt.element;

	        this.genId = 0;

	        this.bullets = [];
	        this.towers = [];
	        this.enemies = [];

	        this.ctx = ctx;
	        this.money = 5000;
	        this.coordX = 0;
	        this.coordY = 0;
	        this.enemyCreatedCount = 0; // 目前已经创建的enemy的总数
	        this.lastCreatedEnemyTime = new Date();

	        this.pathCoord = [[0, 0], [18, 0], [18, 4], [10, 4], [10, 10], [16, 10], [16, 14], [-1, 14]];

	        var newTowerCoord = [8, 3];
	        this.map = new _Map2.default({
	            ctx: ctx,
	            WIDTH: WIDTH,
	            HEIGHT: HEIGHT,
	            newTowerCoord: newTowerCoord,
	            pathCoord: this.pathCoord
	        });

	        // 放置一个初始状态下的塔
	        var tower = new _BaseTower2.default({
	            ctx: ctx,
	            x: _constant.gridWidth / 2 + newTowerCoord[0] * _constant.gridWidth,
	            y: _constant.gridHeight / 2 + newTowerCoord[1] * _constant.gridHeight,
	            bullets: this.bullets
	        });
	        this.towers.push(tower);

	        this.mode = '';
	        this.addTowerType = 'BASE';
	        this.status = 'running';
	        this.score = 0;
	        this.life = 100;

	        // 当前是否选中塔
	        this.towerSelect = false;
	        this.towerSelectIndex = -1;
	        this.towerSelectId = -1;

	        this.wave = -1; // 当前第几波
	        this.waves = [];

	        this.draw();
	        this.bindEvent();
	    }

	    // Specify what to draw


	    _createClass(Game, [{
	        key: 'draw',
	        value: function draw() {
	            var _this = this;

	            if (this.status === 'gameOver') {
	                // gameOverEle.style.display = 'block';
	                return;
	            }

	            if (this.status === 'pause') {
	                return;
	            }

	            this.map.draw({
	                towers: this.towers,
	                towerSelect: this.towerSelect,
	                towerSelectIndex: this.towerSelectIndex
	            });

	            if (this.shouldGenerateWave()) {
	                this.generateWave();
	                // this.waves[0].waveFinish();
	            }

	            // 生成enemy
	            // 总数小于50，且间隔 x ms以上
	            if (shouldGenerateEnemy()) {
	                var cfg = this.waves[this.wave].generateEnemy();
	                var enemy = new _Enemy2.default({
	                    id: _id2.default.genId(),
	                    ctx: ctx,
	                    x: _constant.gridWidth / 2 + (Math.random() - 0.5) * 10,
	                    y: _constant.gridHeight / 2 + (Math.random() - 0.5) * 10,
	                    color: cfg.color,
	                    radius: cfg.radius,
	                    speed: cfg.speed,
	                    health: cfg.health * (1 + this.wave / 10)
	                });

	                this.enemies.push(enemy);
	                this.enemyCreatedCount++;
	                this.lastCreatedEnemyTime = new Date();
	            }

	            // 对每一个enemy进行step操作，并绘制
	            this.enemies.forEach(function (enemy, index) {
	                enemy.step({ path: _this.pathCoord });
	                enemy.draw();

	                if (enemy.dead) {
	                    if (enemy.reachDest) {
	                        _this.life -= enemy.damage;
	                    }
	                    _this.enemies.remove(index);
	                }
	            });

	            // Draw our tower
	            this.towers.forEach(function (tower, index) {
	                if (_this.towerSelect && _this.towerSelectIndex === index) {
	                    // 选中的塔需画出其范围
	                    tower.selected = true;
	                } else {
	                    tower.selected = false;
	                }
	                tower.draw(ctx);
	            });

	            // 如何确定游戏结束?
	            if (this.enemyCreatedCount > 0 && this.enemies.length === 0) {
	                setTimeout(function () {
	                    _this.status = 'gameOver';
	                }, 1000);
	            }

	            // 确定 tower 的目标
	            for (var i = 0, len = this.towers.length; i < len; i++) {
	                var tower = this.towers[i];
	                tower.findTarget(this.enemies);
	                if (tower.target !== null) {
	                    var target = tower.target;
	                    // 调整其朝向
	                    tower.directionVec = _glMatrix.vec2.fromValues(target.x - tower.x, target.y - tower.y);

	                    tower.direction = Math.atan2(target.y - tower.y, target.x - tower.x) * (180 / Math.PI);
	                }
	            }

	            // 检查bullet是否与enemy相撞
	            this.detectImpact();

	            // 移除出界的bullet，画出剩下的bullet
	            for (var _i = 0; _i < this.bullets.length; _i++) {
	                var bullet = this.bullets[_i];

	                switch (bullet.type) {
	                    case 'line':
	                        {
	                            // 直线子弹
	                            if (bullet.start[0] < 0 || bullet.start[1] < 0 || bullet.start[0] > WIDTH || bullet.start[1] > HEIGHT) {
	                                this.bullets.remove(_i);
	                                _i--;
	                            } else {
	                                bullet.draw(ctx, this.enemies);
	                            }
	                            break;
	                        }
	                    case 'circle':
	                        {
	                            if (bullet.x < 0 || bullet.y < 0 || bullet.x > WIDTH || bullet.y > HEIGHT) {
	                                this.bullets.remove(_i);
	                                _i--;
	                            } else {
	                                bullet.draw(ctx, this.enemies);
	                            }
	                            break;
	                        }
	                    case 'laser':
	                        {
	                            // TODO: 何时结束
	                            console.log(bullet.parent.target, _i);
	                            if (bullet.parent.targetIndex !== _i) {
	                                this.bullets.remove(_i);
	                                bullet.parent.shooting = false;
	                                _i--;
	                            } else {
	                                bullet.draw(ctx, this.enemies);
	                            }
	                            break;
	                        }
	                }
	            }

	            if (this.mode === 'ADD_TOWER') {
	                // 添加塔模式
	                if (0 <= this.coordX && this.coordX < _constant.gridNumX && 0 <= this.coordY && this.coordY < _constant.gridNumY) {
	                    if (this.map.coord[this.coordX][this.coordY] !== 'T') {
	                        // 该位置没有塔
	                        this.drawGhostTower(ctx, this.coordX * _constant.gridWidth + _constant.gridWidth / 2, this.coordY * _constant.gridHeight + _constant.gridHeight / 2, this.addTowerType);
	                    }
	                }
	            }

	            this.displayInfo();

	            requestAnimationFrame(function () {
	                return _this.draw();
	            }, 100);
	        }

	        // 循环检测bullet是否和vehicle碰撞

	    }, {
	        key: 'detectImpact',
	        value: function detectImpact() {
	            for (var i = 0; i < this.bullets.length; i++) {
	                var impact = false;
	                var distance = 0;

	                for (var j = 0; j < this.enemies.length; j++) {

	                    if (this.bullets[i].type === 'line') {
	                        // 求圆心至bullet的垂足
	                        var normal = _glMatrix.vec2.create();
	                        var bVec = this.bullets[i].directionVec;
	                        var aDotB = 1;

	                        var aVec = _glMatrix.vec2.fromValues(this.enemies[j].x - this.bullets[i].start[0], this.enemies[j].y - this.bullets[i].start[1]);
	                        _glMatrix.vec2.multiply(aDotB, aVec, bVec);
	                        _glMatrix.vec2.scale(bVec, bVec, aDotB);
	                        _glMatrix.vec2.add(normal, this.bullets[i].start, bVec);

	                        distance = (0, _utils.calcuteDistance)(normal[0], normal[1], this.enemies[j].x, this.enemies[j].y);
	                    } else {
	                        distance = (0, _utils.calcuteDistance)(this.bullets[i].x, this.bullets[i].y, this.enemies[j].x, this.enemies[j].y);
	                    }

	                    if (distance <= this.enemies[j].radius + 2) {
	                        impact = true;
	                        this.enemies[j].health -= this.bullets[i].damage;
	                        if (this.enemies[j].health <= 0) {
	                            this.money += this.enemies[j].value;
	                            this.enemies.remove(j);j--;
	                            this.score += 100;
	                        }
	                        break;
	                    }
	                }
	                if (this.bullets[i].type === 'laser') {
	                    impact === false;
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
	        value: function createNewTower(coordX, coordY, towerType) {

	            // 检查当前位置是否已有物体
	            if (this.map.coord[coordX][coordY] === 'T') {
	                console.log('You can not place tower here!');
	                return -1;
	            }

	            var cost = _constant.towerCost.baseTower;
	            // 检查是否有足够金钱
	            if (this.money - cost < 0) {
	                console.log('You do not have enough money.');
	                return -1;
	            }

	            var x = coordX * _constant.gridWidth + _constant.gridWidth / 2;
	            var y = coordY * _constant.gridWidth + _constant.gridWidth / 2;

	            var config = { ctx: ctx, x: x, y: y, bullets: this.bullets };

	            var tower = null;
	            switch (towerType) {
	                case 'BASE':
	                    tower = new _BaseTower2.default(config);
	                    break;
	                case 'BULLET':
	                    tower = new _BulletTower2.default(config);
	                    break;
	                case 'LASER':
	                    tower = new _LaserTower2.default(config);
	                    break;
	                default:
	                    tower = new _BulletTower2.default(config);
	            }

	            this.map.coord[coordX][coordY] = 'T';
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
	            console.log(index);
	            this.map.coord[coordX][coordY] = '';

	            this.money += 400;
	            this.towerSelect = false;
	            this.towerSelectIndex = -1;
	        }

	        // 准备放置塔时，在鼠标所在位置画一个虚拟的塔

	    }, {
	        key: 'drawGhostTower',
	        value: function drawGhostTower(ctx, x, y, towerType) {
	            var tower = null;
	            var config = { ctx: ctx, x: x, y: y, bullets: this.bullets, selected: true };

	            switch (towerType) {
	                case 'BASE':
	                    tower = new _BaseTower2.default(config);
	                    break;
	                case 'BULLET':
	                    tower = new _BulletTower2.default(config);
	                    break;
	                case 'LASER':
	                    tower = new _LaserTower2.default(config);
	                    break;

	                default:
	                    tower = null;
	            }
	            tower.draw(ctx);
	        }
	    }, {
	        key: 'displayInfo',
	        value: function displayInfo() {
	            // 画面信息的显示
	            if (document.getElementById('enemyCount')) {
	                document.getElementById('enemyCount').innerHTML = 'Enemy Count: ' + this.enemies.length + ', Bullets: ' + this.bullets.length;
	            }
	        }
	    }, {
	        key: 'bindEvent',
	        value: function bindEvent() {
	            var element = this.element;
	            // console.log(element);
	        }
	    }, {
	        key: 'shouldGenerateEnemy',
	        value: function shouldGenerateEnemy() {
	            return this.wave < 100 && new Date() - this.lastCreatedEnemyTime > 500;
	        }
	    }, {
	        key: 'shouldGenerateWave',
	        value: function shouldGenerateWave() {
	            return this.waves.length === 0 || this.waves[this.wave].waveFinish();
	        }
	    }, {
	        key: 'generateWave',
	        value: function generateWave() {
	            this.waves.push(new _Wave2.default());
	            this.wave++;
	        }
	    }]);

	    return Game;
	}();

	exports.default = Game;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview gl-matrix - High performance matrix and vector operations
	 * @author Brandon Jones
	 * @author Colin MacKenzie IV
	 * @version 2.4.0
	 */

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

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else {
			var a = factory();
			for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
		}
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId]) {
	/******/ 			return installedModules[moduleId].exports;
	/******/ 		}
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			i: moduleId,
	/******/ 			l: false,
	/******/ 			exports: {}
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.l = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// define getter function for harmony exports
	/******/ 	__webpack_require__.d = function(exports, name, getter) {
	/******/ 		if(!__webpack_require__.o(exports, name)) {
	/******/ 			Object.defineProperty(exports, name, {
	/******/ 				configurable: false,
	/******/ 				enumerable: true,
	/******/ 				get: getter
	/******/ 			});
	/******/ 		}
	/******/ 	};
	/******/
	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__webpack_require__.n = function(module) {
	/******/ 		var getter = module && module.__esModule ?
	/******/ 			function getDefault() { return module['default']; } :
	/******/ 			function getModuleExports() { return module; };
	/******/ 		__webpack_require__.d(getter, 'a', getter);
	/******/ 		return getter;
	/******/ 	};
	/******/
	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = 4);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setMatrixArrayType = setMatrixArrayType;
	exports.toRadian = toRadian;
	exports.equals = equals;
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
	 * Common utilities
	 * @module glMatrix
	 */

	// Configuration Constants
	var EPSILON = exports.EPSILON = 0.000001;
	var ARRAY_TYPE = exports.ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
	var RANDOM = exports.RANDOM = Math.random;

	/**
	 * Sets the type of array used when creating new vectors and matrices
	 *
	 * @param {Type} type Array type, such as Float32Array or Array
	 */
	function setMatrixArrayType(type) {
	  exports.ARRAY_TYPE = ARRAY_TYPE = type;
	}

	var degree = Math.PI / 180;

	/**
	 * Convert Degree To Radian
	 *
	 * @param {Number} a Angle in Degrees
	 */
	function toRadian(a) {
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
	function equals(a, b) {
	  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
	}

	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sub = exports.mul = undefined;
	exports.create = create;
	exports.fromMat4 = fromMat4;
	exports.clone = clone;
	exports.copy = copy;
	exports.fromValues = fromValues;
	exports.set = set;
	exports.identity = identity;
	exports.transpose = transpose;
	exports.invert = invert;
	exports.adjoint = adjoint;
	exports.determinant = determinant;
	exports.multiply = multiply;
	exports.translate = translate;
	exports.rotate = rotate;
	exports.scale = scale;
	exports.fromTranslation = fromTranslation;
	exports.fromRotation = fromRotation;
	exports.fromScaling = fromScaling;
	exports.fromMat2d = fromMat2d;
	exports.fromQuat = fromQuat;
	exports.normalFromMat4 = normalFromMat4;
	exports.projection = projection;
	exports.str = str;
	exports.frob = frob;
	exports.add = add;
	exports.subtract = subtract;
	exports.multiplyScalar = multiplyScalar;
	exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
	exports.exactEquals = exactEquals;
	exports.equals = equals;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * 3x3 Matrix
	 * @module mat3
	 */

	/**
	 * Creates a new identity mat3
	 *
	 * @returns {mat3} a new 3x3 matrix
	 */
	function create() {
	  var out = new glMatrix.ARRAY_TYPE(9);
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 1;
	  out[5] = 0;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Copies the upper-left 3x3 values into the given mat3.
	 *
	 * @param {mat3} out the receiving 3x3 matrix
	 * @param {mat4} a   the source 4x4 matrix
	 * @returns {mat3} out
	 */
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

	function fromMat4(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[4];
	  out[4] = a[5];
	  out[5] = a[6];
	  out[6] = a[8];
	  out[7] = a[9];
	  out[8] = a[10];
	  return out;
	}

	/**
	 * Creates a new mat3 initialized with values from an existing matrix
	 *
	 * @param {mat3} a matrix to clone
	 * @returns {mat3} a new 3x3 matrix
	 */
	function clone(a) {
	  var out = new glMatrix.ARRAY_TYPE(9);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}

	/**
	 * Copy the values from one mat3 to another
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}

	/**
	 * Create a new mat3 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m10 Component in column 1, row 0 position (index 3)
	 * @param {Number} m11 Component in column 1, row 1 position (index 4)
	 * @param {Number} m12 Component in column 1, row 2 position (index 5)
	 * @param {Number} m20 Component in column 2, row 0 position (index 6)
	 * @param {Number} m21 Component in column 2, row 1 position (index 7)
	 * @param {Number} m22 Component in column 2, row 2 position (index 8)
	 * @returns {mat3} A new mat3
	 */
	function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	  var out = new glMatrix.ARRAY_TYPE(9);
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m10;
	  out[4] = m11;
	  out[5] = m12;
	  out[6] = m20;
	  out[7] = m21;
	  out[8] = m22;
	  return out;
	}

	/**
	 * Set the components of a mat3 to the given values
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m10 Component in column 1, row 0 position (index 3)
	 * @param {Number} m11 Component in column 1, row 1 position (index 4)
	 * @param {Number} m12 Component in column 1, row 2 position (index 5)
	 * @param {Number} m20 Component in column 2, row 0 position (index 6)
	 * @param {Number} m21 Component in column 2, row 1 position (index 7)
	 * @param {Number} m22 Component in column 2, row 2 position (index 8)
	 * @returns {mat3} out
	 */
	function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m10;
	  out[4] = m11;
	  out[5] = m12;
	  out[6] = m20;
	  out[7] = m21;
	  out[8] = m22;
	  return out;
	}

	/**
	 * Set a mat3 to the identity matrix
	 *
	 * @param {mat3} out the receiving matrix
	 * @returns {mat3} out
	 */
	function identity(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 1;
	  out[5] = 0;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Transpose the values of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function transpose(out, a) {
	  // If we are transposing ourselves we can skip a few steps but have to cache some values
	  if (out === a) {
	    var a01 = a[1],
	        a02 = a[2],
	        a12 = a[5];
	    out[1] = a[3];
	    out[2] = a[6];
	    out[3] = a01;
	    out[5] = a[7];
	    out[6] = a02;
	    out[7] = a12;
	  } else {
	    out[0] = a[0];
	    out[1] = a[3];
	    out[2] = a[6];
	    out[3] = a[1];
	    out[4] = a[4];
	    out[5] = a[7];
	    out[6] = a[2];
	    out[7] = a[5];
	    out[8] = a[8];
	  }

	  return out;
	}

	/**
	 * Inverts a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function invert(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  var b01 = a22 * a11 - a12 * a21;
	  var b11 = -a22 * a10 + a12 * a20;
	  var b21 = a21 * a10 - a11 * a20;

	  // Calculate the determinant
	  var det = a00 * b01 + a01 * b11 + a02 * b21;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = b01 * det;
	  out[1] = (-a22 * a01 + a02 * a21) * det;
	  out[2] = (a12 * a01 - a02 * a11) * det;
	  out[3] = b11 * det;
	  out[4] = (a22 * a00 - a02 * a20) * det;
	  out[5] = (-a12 * a00 + a02 * a10) * det;
	  out[6] = b21 * det;
	  out[7] = (-a21 * a00 + a01 * a20) * det;
	  out[8] = (a11 * a00 - a01 * a10) * det;
	  return out;
	}

	/**
	 * Calculates the adjugate of a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the source matrix
	 * @returns {mat3} out
	 */
	function adjoint(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  out[0] = a11 * a22 - a12 * a21;
	  out[1] = a02 * a21 - a01 * a22;
	  out[2] = a01 * a12 - a02 * a11;
	  out[3] = a12 * a20 - a10 * a22;
	  out[4] = a00 * a22 - a02 * a20;
	  out[5] = a02 * a10 - a00 * a12;
	  out[6] = a10 * a21 - a11 * a20;
	  out[7] = a01 * a20 - a00 * a21;
	  out[8] = a00 * a11 - a01 * a10;
	  return out;
	}

	/**
	 * Calculates the determinant of a mat3
	 *
	 * @param {mat3} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
	}

	/**
	 * Multiplies two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	function multiply(out, a, b) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2];
	  var a10 = a[3],
	      a11 = a[4],
	      a12 = a[5];
	  var a20 = a[6],
	      a21 = a[7],
	      a22 = a[8];

	  var b00 = b[0],
	      b01 = b[1],
	      b02 = b[2];
	  var b10 = b[3],
	      b11 = b[4],
	      b12 = b[5];
	  var b20 = b[6],
	      b21 = b[7],
	      b22 = b[8];

	  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
	  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
	  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

	  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
	  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
	  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

	  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
	  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
	  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
	  return out;
	}

	/**
	 * Translate a mat3 by the given vector
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to translate
	 * @param {vec2} v vector to translate by
	 * @returns {mat3} out
	 */
	function translate(out, a, v) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a10 = a[3],
	      a11 = a[4],
	      a12 = a[5],
	      a20 = a[6],
	      a21 = a[7],
	      a22 = a[8],
	      x = v[0],
	      y = v[1];

	  out[0] = a00;
	  out[1] = a01;
	  out[2] = a02;

	  out[3] = a10;
	  out[4] = a11;
	  out[5] = a12;

	  out[6] = x * a00 + y * a10 + a20;
	  out[7] = x * a01 + y * a11 + a21;
	  out[8] = x * a02 + y * a12 + a22;
	  return out;
	}

	/**
	 * Rotates a mat3 by the given angle
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	function rotate(out, a, rad) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a10 = a[3],
	      a11 = a[4],
	      a12 = a[5],
	      a20 = a[6],
	      a21 = a[7],
	      a22 = a[8],
	      s = Math.sin(rad),
	      c = Math.cos(rad);

	  out[0] = c * a00 + s * a10;
	  out[1] = c * a01 + s * a11;
	  out[2] = c * a02 + s * a12;

	  out[3] = c * a10 - s * a00;
	  out[4] = c * a11 - s * a01;
	  out[5] = c * a12 - s * a02;

	  out[6] = a20;
	  out[7] = a21;
	  out[8] = a22;
	  return out;
	};

	/**
	 * Scales the mat3 by the dimensions in the given vec2
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat3} out
	 **/
	function scale(out, a, v) {
	  var x = v[0],
	      y = v[1];

	  out[0] = x * a[0];
	  out[1] = x * a[1];
	  out[2] = x * a[2];

	  out[3] = y * a[3];
	  out[4] = y * a[4];
	  out[5] = y * a[5];

	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  return out;
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.translate(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat3} out
	 */
	function fromTranslation(out, v) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 1;
	  out[5] = 0;
	  out[6] = v[0];
	  out[7] = v[1];
	  out[8] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.rotate(dest, dest, rad);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat3} out
	 */
	function fromRotation(out, rad) {
	  var s = Math.sin(rad),
	      c = Math.cos(rad);

	  out[0] = c;
	  out[1] = s;
	  out[2] = 0;

	  out[3] = -s;
	  out[4] = c;
	  out[5] = 0;

	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat3.identity(dest);
	 *     mat3.scale(dest, dest, vec);
	 *
	 * @param {mat3} out mat3 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat3} out
	 */
	function fromScaling(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;

	  out[3] = 0;
	  out[4] = v[1];
	  out[5] = 0;

	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Copies the values from a mat2d into a mat3
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat2d} a the matrix to copy
	 * @returns {mat3} out
	 **/
	function fromMat2d(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = 0;

	  out[3] = a[2];
	  out[4] = a[3];
	  out[5] = 0;

	  out[6] = a[4];
	  out[7] = a[5];
	  out[8] = 1;
	  return out;
	}

	/**
	* Calculates a 3x3 matrix from the given quaternion
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {quat} q Quaternion to create matrix from
	*
	* @returns {mat3} out
	*/
	function fromQuat(out, q) {
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var yx = y * x2;
	  var yy = y * y2;
	  var zx = z * x2;
	  var zy = z * y2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  out[0] = 1 - yy - zz;
	  out[3] = yx - wz;
	  out[6] = zx + wy;

	  out[1] = yx + wz;
	  out[4] = 1 - xx - zz;
	  out[7] = zy - wx;

	  out[2] = zx - wy;
	  out[5] = zy + wx;
	  out[8] = 1 - xx - yy;

	  return out;
	}

	/**
	* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
	*
	* @param {mat3} out mat3 receiving operation result
	* @param {mat4} a Mat4 to derive the normal matrix from
	*
	* @returns {mat3} out
	*/
	function normalFromMat4(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  var b00 = a00 * a11 - a01 * a10;
	  var b01 = a00 * a12 - a02 * a10;
	  var b02 = a00 * a13 - a03 * a10;
	  var b03 = a01 * a12 - a02 * a11;
	  var b04 = a01 * a13 - a03 * a11;
	  var b05 = a02 * a13 - a03 * a12;
	  var b06 = a20 * a31 - a21 * a30;
	  var b07 = a20 * a32 - a22 * a30;
	  var b08 = a20 * a33 - a23 * a30;
	  var b09 = a21 * a32 - a22 * a31;
	  var b10 = a21 * a33 - a23 * a31;
	  var b11 = a22 * a33 - a23 * a32;

	  // Calculate the determinant
	  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

	  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

	  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

	  return out;
	}

	/**
	 * Generates a 2D projection matrix with the given bounds
	 *
	 * @param {mat3} out mat3 frustum matrix will be written into
	 * @param {number} width Width of your gl context
	 * @param {number} height Height of gl context
	 * @returns {mat3} out
	 */
	function projection(out, width, height) {
	  out[0] = 2 / width;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = -2 / height;
	  out[5] = 0;
	  out[6] = -1;
	  out[7] = 1;
	  out[8] = 1;
	  return out;
	}

	/**
	 * Returns a string representation of a mat3
	 *
	 * @param {mat3} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str(a) {
	  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat3
	 *
	 * @param {mat3} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2));
	}

	/**
	 * Adds two mat3's
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  out[4] = a[4] + b[4];
	  out[5] = a[5] + b[5];
	  out[6] = a[6] + b[6];
	  out[7] = a[7] + b[7];
	  out[8] = a[8] + b[8];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @returns {mat3} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  out[4] = a[4] - b[4];
	  out[5] = a[5] - b[5];
	  out[6] = a[6] - b[6];
	  out[7] = a[7] - b[7];
	  out[8] = a[8] - b[8];
	  return out;
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat3} out the receiving matrix
	 * @param {mat3} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat3} out
	 */
	function multiplyScalar(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  out[4] = a[4] * b;
	  out[5] = a[5] * b;
	  out[6] = a[6] * b;
	  out[7] = a[7] * b;
	  out[8] = a[8] * b;
	  return out;
	}

	/**
	 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat3} out the receiving vector
	 * @param {mat3} a the first operand
	 * @param {mat3} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat3} out
	 */
	function multiplyScalarAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  out[4] = a[4] + b[4] * scale;
	  out[5] = a[5] + b[5] * scale;
	  out[6] = a[6] + b[6] * scale;
	  out[7] = a[7] + b[7] * scale;
	  out[8] = a[8] + b[8] * scale;
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat3} a The first matrix.
	 * @param {mat3} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat3} a The first matrix.
	 * @param {mat3} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5],
	      a6 = a[6],
	      a7 = a[7],
	      a8 = a[8];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3],
	      b4 = b[4],
	      b5 = b[5],
	      b6 = b[6],
	      b7 = b[7],
	      b8 = b[8];
	  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
	}

	/**
	 * Alias for {@link mat3.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Alias for {@link mat3.subtract}
	 * @function
	 */
	var sub = exports.sub = subtract;

	/***/ }),
	/* 2 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = undefined;
	exports.create = create;
	exports.clone = clone;
	exports.length = length;
	exports.fromValues = fromValues;
	exports.copy = copy;
	exports.set = set;
	exports.add = add;
	exports.subtract = subtract;
	exports.multiply = multiply;
	exports.divide = divide;
	exports.ceil = ceil;
	exports.floor = floor;
	exports.min = min;
	exports.max = max;
	exports.round = round;
	exports.scale = scale;
	exports.scaleAndAdd = scaleAndAdd;
	exports.distance = distance;
	exports.squaredDistance = squaredDistance;
	exports.squaredLength = squaredLength;
	exports.negate = negate;
	exports.inverse = inverse;
	exports.normalize = normalize;
	exports.dot = dot;
	exports.cross = cross;
	exports.lerp = lerp;
	exports.hermite = hermite;
	exports.bezier = bezier;
	exports.random = random;
	exports.transformMat4 = transformMat4;
	exports.transformMat3 = transformMat3;
	exports.transformQuat = transformQuat;
	exports.rotateX = rotateX;
	exports.rotateY = rotateY;
	exports.rotateZ = rotateZ;
	exports.angle = angle;
	exports.str = str;
	exports.exactEquals = exactEquals;
	exports.equals = equals;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * 3 Dimensional Vector
	 * @module vec3
	 */

	/**
	 * Creates a new, empty vec3
	 *
	 * @returns {vec3} a new 3D vector
	 */
	function create() {
	  var out = new glMatrix.ARRAY_TYPE(3);
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  return out;
	}

	/**
	 * Creates a new vec3 initialized with values from an existing vector
	 *
	 * @param {vec3} a vector to clone
	 * @returns {vec3} a new 3D vector
	 */
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

	function clone(a) {
	  var out = new glMatrix.ARRAY_TYPE(3);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  return out;
	}

	/**
	 * Calculates the length of a vec3
	 *
	 * @param {vec3} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  return Math.sqrt(x * x + y * y + z * z);
	}

	/**
	 * Creates a new vec3 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} a new 3D vector
	 */
	function fromValues(x, y, z) {
	  var out = new glMatrix.ARRAY_TYPE(3);
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  return out;
	}

	/**
	 * Copy the values from one vec3 to another
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the source vector
	 * @returns {vec3} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  return out;
	}

	/**
	 * Set the components of a vec3 to the given values
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @returns {vec3} out
	 */
	function set(out, x, y, z) {
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  return out;
	}

	/**
	 * Adds two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  return out;
	}

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  return out;
	}

	/**
	 * Multiplies two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function multiply(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  out[2] = a[2] * b[2];
	  return out;
	}

	/**
	 * Divides two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function divide(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  out[2] = a[2] / b[2];
	  return out;
	}

	/**
	 * Math.ceil the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to ceil
	 * @returns {vec3} out
	 */
	function ceil(out, a) {
	  out[0] = Math.ceil(a[0]);
	  out[1] = Math.ceil(a[1]);
	  out[2] = Math.ceil(a[2]);
	  return out;
	}

	/**
	 * Math.floor the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to floor
	 * @returns {vec3} out
	 */
	function floor(out, a) {
	  out[0] = Math.floor(a[0]);
	  out[1] = Math.floor(a[1]);
	  out[2] = Math.floor(a[2]);
	  return out;
	}

	/**
	 * Returns the minimum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function min(out, a, b) {
	  out[0] = Math.min(a[0], b[0]);
	  out[1] = Math.min(a[1], b[1]);
	  out[2] = Math.min(a[2], b[2]);
	  return out;
	}

	/**
	 * Returns the maximum of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function max(out, a, b) {
	  out[0] = Math.max(a[0], b[0]);
	  out[1] = Math.max(a[1], b[1]);
	  out[2] = Math.max(a[2], b[2]);
	  return out;
	}

	/**
	 * Math.round the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to round
	 * @returns {vec3} out
	 */
	function round(out, a) {
	  out[0] = Math.round(a[0]);
	  out[1] = Math.round(a[1]);
	  out[2] = Math.round(a[2]);
	  return out;
	}

	/**
	 * Scales a vec3 by a scalar number
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec3} out
	 */
	function scale(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  return out;
	}

	/**
	 * Adds two vec3's after scaling the second operand by a scalar value
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec3} out
	 */
	function scaleAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  return out;
	}

	/**
	 * Calculates the euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} distance between a and b
	 */
	function distance(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  return Math.sqrt(x * x + y * y + z * z);
	}

	/**
	 * Calculates the squared euclidian distance between two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	function squaredDistance(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  return x * x + y * y + z * z;
	}

	/**
	 * Calculates the squared length of a vec3
	 *
	 * @param {vec3} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	function squaredLength(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  return x * x + y * y + z * z;
	}

	/**
	 * Negates the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to negate
	 * @returns {vec3} out
	 */
	function negate(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  return out;
	}

	/**
	 * Returns the inverse of the components of a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to invert
	 * @returns {vec3} out
	 */
	function inverse(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  return out;
	}

	/**
	 * Normalize a vec3
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a vector to normalize
	 * @returns {vec3} out
	 */
	function normalize(out, a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var len = x * x + y * y + z * z;
	  if (len > 0) {
	    //TODO: evaluate use of glm_invsqrt here?
	    len = 1 / Math.sqrt(len);
	    out[0] = a[0] * len;
	    out[1] = a[1] * len;
	    out[2] = a[2] * len;
	  }
	  return out;
	}

	/**
	 * Calculates the dot product of two vec3's
	 *
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	/**
	 * Computes the cross product of two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @returns {vec3} out
	 */
	function cross(out, a, b) {
	  var ax = a[0],
	      ay = a[1],
	      az = a[2];
	  var bx = b[0],
	      by = b[1],
	      bz = b[2];

	  out[0] = ay * bz - az * by;
	  out[1] = az * bx - ax * bz;
	  out[2] = ax * by - ay * bx;
	  return out;
	}

	/**
	 * Performs a linear interpolation between two vec3's
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	function lerp(out, a, b, t) {
	  var ax = a[0];
	  var ay = a[1];
	  var az = a[2];
	  out[0] = ax + t * (b[0] - ax);
	  out[1] = ay + t * (b[1] - ay);
	  out[2] = az + t * (b[2] - az);
	  return out;
	}

	/**
	 * Performs a hermite interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	function hermite(out, a, b, c, d, t) {
	  var factorTimes2 = t * t;
	  var factor1 = factorTimes2 * (2 * t - 3) + 1;
	  var factor2 = factorTimes2 * (t - 2) + t;
	  var factor3 = factorTimes2 * (t - 1);
	  var factor4 = factorTimes2 * (3 - 2 * t);

	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

	  return out;
	}

	/**
	 * Performs a bezier interpolation with two control points
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the first operand
	 * @param {vec3} b the second operand
	 * @param {vec3} c the third operand
	 * @param {vec3} d the fourth operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec3} out
	 */
	function bezier(out, a, b, c, d, t) {
	  var inverseFactor = 1 - t;
	  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
	  var factorTimes2 = t * t;
	  var factor1 = inverseFactorTimesTwo * inverseFactor;
	  var factor2 = 3 * t * inverseFactorTimesTwo;
	  var factor3 = 3 * factorTimes2 * inverseFactor;
	  var factor4 = factorTimes2 * t;

	  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
	  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
	  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

	  return out;
	}

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec3} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec3} out
	 */
	function random(out, scale) {
	  scale = scale || 1.0;

	  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
	  var z = glMatrix.RANDOM() * 2.0 - 1.0;
	  var zScale = Math.sqrt(1.0 - z * z) * scale;

	  out[0] = Math.cos(r) * zScale;
	  out[1] = Math.sin(r) * zScale;
	  out[2] = z * scale;
	  return out;
	}

	/**
	 * Transforms the vec3 with a mat4.
	 * 4th vector component is implicitly '1'
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec3} out
	 */
	function transformMat4(out, a, m) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
	  w = w || 1.0;
	  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
	  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
	  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
	  return out;
	}

	/**
	 * Transforms the vec3 with a mat3.
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {mat3} m the 3x3 matrix to transform with
	 * @returns {vec3} out
	 */
	function transformMat3(out, a, m) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  out[0] = x * m[0] + y * m[3] + z * m[6];
	  out[1] = x * m[1] + y * m[4] + z * m[7];
	  out[2] = x * m[2] + y * m[5] + z * m[8];
	  return out;
	}

	/**
	 * Transforms the vec3 with a quat
	 *
	 * @param {vec3} out the receiving vector
	 * @param {vec3} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec3} out
	 */
	function transformQuat(out, a, q) {
	  // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  var qx = q[0],
	      qy = q[1],
	      qz = q[2],
	      qw = q[3];

	  // calculate quat * vec
	  var ix = qw * x + qy * z - qz * y;
	  var iy = qw * y + qz * x - qx * z;
	  var iz = qw * z + qx * y - qy * x;
	  var iw = -qx * x - qy * y - qz * z;

	  // calculate result * inverse quat
	  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	  return out;
	}

	/**
	 * Rotate a 3D vector around the x-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateX(out, a, b, c) {
	  var p = [],
	      r = [];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
	  p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0];
	  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
	  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

	  return out;
	}

	/**
	 * Rotate a 3D vector around the y-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateY(out, a, b, c) {
	  var p = [],
	      r = [];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
	  p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
	  r[1] = p[1];
	  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c);

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

	  return out;
	}

	/**
	 * Rotate a 3D vector around the z-axis
	 * @param {vec3} out The receiving vec3
	 * @param {vec3} a The vec3 point to rotate
	 * @param {vec3} b The origin of the rotation
	 * @param {Number} c The angle of rotation
	 * @returns {vec3} out
	 */
	function rotateZ(out, a, b, c) {
	  var p = [],
	      r = [];
	  //Translate point to the origin
	  p[0] = a[0] - b[0];
	  p[1] = a[1] - b[1];
	  p[2] = a[2] - b[2];

	  //perform rotation
	  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
	  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
	  r[2] = p[2];

	  //translate to correct position
	  out[0] = r[0] + b[0];
	  out[1] = r[1] + b[1];
	  out[2] = r[2] + b[2];

	  return out;
	}

	/**
	 * Get the angle between two 3D vectors
	 * @param {vec3} a The first operand
	 * @param {vec3} b The second operand
	 * @returns {Number} The angle in radians
	 */
	function angle(a, b) {
	  var tempA = fromValues(a[0], a[1], a[2]);
	  var tempB = fromValues(b[0], b[1], b[2]);

	  normalize(tempA, tempA);
	  normalize(tempB, tempB);

	  var cosine = dot(tempA, tempB);

	  if (cosine > 1.0) {
	    return 0;
	  } else if (cosine < -1.0) {
	    return Math.PI;
	  } else {
	    return Math.acos(cosine);
	  }
	}

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec3} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str(a) {
	  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
	}

	/**
	 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {vec3} a The first vector.
	 * @param {vec3} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
	}

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec3} a The first vector.
	 * @param {vec3} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2];
	  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
	}

	/**
	 * Alias for {@link vec3.subtract}
	 * @function
	 */
	var sub = exports.sub = subtract;

	/**
	 * Alias for {@link vec3.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Alias for {@link vec3.divide}
	 * @function
	 */
	var div = exports.div = divide;

	/**
	 * Alias for {@link vec3.distance}
	 * @function
	 */
	var dist = exports.dist = distance;

	/**
	 * Alias for {@link vec3.squaredDistance}
	 * @function
	 */
	var sqrDist = exports.sqrDist = squaredDistance;

	/**
	 * Alias for {@link vec3.length}
	 * @function
	 */
	var len = exports.len = length;

	/**
	 * Alias for {@link vec3.squaredLength}
	 * @function
	 */
	var sqrLen = exports.sqrLen = squaredLength;

	/**
	 * Perform some operation over an array of vec3s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	var forEach = exports.forEach = function () {
	  var vec = create();

	  return function (a, stride, offset, count, fn, arg) {
	    var i = void 0,
	        l = void 0;
	    if (!stride) {
	      stride = 3;
	    }

	    if (!offset) {
	      offset = 0;
	    }

	    if (count) {
	      l = Math.min(count * stride + offset, a.length);
	    } else {
	      l = a.length;
	    }

	    for (i = offset; i < l; i += stride) {
	      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];
	      fn(vec, vec, arg);
	      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];
	    }

	    return a;
	  };
	}();

	/***/ }),
	/* 3 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = undefined;
	exports.create = create;
	exports.clone = clone;
	exports.fromValues = fromValues;
	exports.copy = copy;
	exports.set = set;
	exports.add = add;
	exports.subtract = subtract;
	exports.multiply = multiply;
	exports.divide = divide;
	exports.ceil = ceil;
	exports.floor = floor;
	exports.min = min;
	exports.max = max;
	exports.round = round;
	exports.scale = scale;
	exports.scaleAndAdd = scaleAndAdd;
	exports.distance = distance;
	exports.squaredDistance = squaredDistance;
	exports.length = length;
	exports.squaredLength = squaredLength;
	exports.negate = negate;
	exports.inverse = inverse;
	exports.normalize = normalize;
	exports.dot = dot;
	exports.lerp = lerp;
	exports.random = random;
	exports.transformMat4 = transformMat4;
	exports.transformQuat = transformQuat;
	exports.str = str;
	exports.exactEquals = exactEquals;
	exports.equals = equals;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * 4 Dimensional Vector
	 * @module vec4
	 */

	/**
	 * Creates a new, empty vec4
	 *
	 * @returns {vec4} a new 4D vector
	 */
	function create() {
	  var out = new glMatrix.ARRAY_TYPE(4);
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  return out;
	}

	/**
	 * Creates a new vec4 initialized with values from an existing vector
	 *
	 * @param {vec4} a vector to clone
	 * @returns {vec4} a new 4D vector
	 */
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

	function clone(a) {
	  var out = new glMatrix.ARRAY_TYPE(4);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Creates a new vec4 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} a new 4D vector
	 */
	function fromValues(x, y, z, w) {
	  var out = new glMatrix.ARRAY_TYPE(4);
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = w;
	  return out;
	}

	/**
	 * Copy the values from one vec4 to another
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the source vector
	 * @returns {vec4} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Set the components of a vec4 to the given values
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {vec4} out
	 */
	function set(out, x, y, z, w) {
	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = w;
	  return out;
	}

	/**
	 * Adds two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  return out;
	}

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  return out;
	}

	/**
	 * Multiplies two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function multiply(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  out[2] = a[2] * b[2];
	  out[3] = a[3] * b[3];
	  return out;
	}

	/**
	 * Divides two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function divide(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  out[2] = a[2] / b[2];
	  out[3] = a[3] / b[3];
	  return out;
	}

	/**
	 * Math.ceil the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to ceil
	 * @returns {vec4} out
	 */
	function ceil(out, a) {
	  out[0] = Math.ceil(a[0]);
	  out[1] = Math.ceil(a[1]);
	  out[2] = Math.ceil(a[2]);
	  out[3] = Math.ceil(a[3]);
	  return out;
	}

	/**
	 * Math.floor the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to floor
	 * @returns {vec4} out
	 */
	function floor(out, a) {
	  out[0] = Math.floor(a[0]);
	  out[1] = Math.floor(a[1]);
	  out[2] = Math.floor(a[2]);
	  out[3] = Math.floor(a[3]);
	  return out;
	}

	/**
	 * Returns the minimum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function min(out, a, b) {
	  out[0] = Math.min(a[0], b[0]);
	  out[1] = Math.min(a[1], b[1]);
	  out[2] = Math.min(a[2], b[2]);
	  out[3] = Math.min(a[3], b[3]);
	  return out;
	}

	/**
	 * Returns the maximum of two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {vec4} out
	 */
	function max(out, a, b) {
	  out[0] = Math.max(a[0], b[0]);
	  out[1] = Math.max(a[1], b[1]);
	  out[2] = Math.max(a[2], b[2]);
	  out[3] = Math.max(a[3], b[3]);
	  return out;
	}

	/**
	 * Math.round the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to round
	 * @returns {vec4} out
	 */
	function round(out, a) {
	  out[0] = Math.round(a[0]);
	  out[1] = Math.round(a[1]);
	  out[2] = Math.round(a[2]);
	  out[3] = Math.round(a[3]);
	  return out;
	}

	/**
	 * Scales a vec4 by a scalar number
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {vec4} out
	 */
	function scale(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  return out;
	}

	/**
	 * Adds two vec4's after scaling the second operand by a scalar value
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} scale the amount to scale b by before adding
	 * @returns {vec4} out
	 */
	function scaleAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  return out;
	}

	/**
	 * Calculates the euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} distance between a and b
	 */
	function distance(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  var w = b[3] - a[3];
	  return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	/**
	 * Calculates the squared euclidian distance between two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	function squaredDistance(a, b) {
	  var x = b[0] - a[0];
	  var y = b[1] - a[1];
	  var z = b[2] - a[2];
	  var w = b[3] - a[3];
	  return x * x + y * y + z * z + w * w;
	}

	/**
	 * Calculates the length of a vec4
	 *
	 * @param {vec4} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var w = a[3];
	  return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	/**
	 * Calculates the squared length of a vec4
	 *
	 * @param {vec4} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	function squaredLength(a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var w = a[3];
	  return x * x + y * y + z * z + w * w;
	}

	/**
	 * Negates the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to negate
	 * @returns {vec4} out
	 */
	function negate(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = -a[3];
	  return out;
	}

	/**
	 * Returns the inverse of the components of a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to invert
	 * @returns {vec4} out
	 */
	function inverse(out, a) {
	  out[0] = 1.0 / a[0];
	  out[1] = 1.0 / a[1];
	  out[2] = 1.0 / a[2];
	  out[3] = 1.0 / a[3];
	  return out;
	}

	/**
	 * Normalize a vec4
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a vector to normalize
	 * @returns {vec4} out
	 */
	function normalize(out, a) {
	  var x = a[0];
	  var y = a[1];
	  var z = a[2];
	  var w = a[3];
	  var len = x * x + y * y + z * z + w * w;
	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	    out[0] = x * len;
	    out[1] = y * len;
	    out[2] = z * len;
	    out[3] = w * len;
	  }
	  return out;
	}

	/**
	 * Calculates the dot product of two vec4's
	 *
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @returns {Number} dot product of a and b
	 */
	function dot(a, b) {
	  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
	}

	/**
	 * Performs a linear interpolation between two vec4's
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the first operand
	 * @param {vec4} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {vec4} out
	 */
	function lerp(out, a, b, t) {
	  var ax = a[0];
	  var ay = a[1];
	  var az = a[2];
	  var aw = a[3];
	  out[0] = ax + t * (b[0] - ax);
	  out[1] = ay + t * (b[1] - ay);
	  out[2] = az + t * (b[2] - az);
	  out[3] = aw + t * (b[3] - aw);
	  return out;
	}

	/**
	 * Generates a random vector with the given scale
	 *
	 * @param {vec4} out the receiving vector
	 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
	 * @returns {vec4} out
	 */
	function random(out, vectorScale) {
	  vectorScale = vectorScale || 1.0;

	  //TODO: This is a pretty awful way of doing this. Find something better.
	  out[0] = glMatrix.RANDOM();
	  out[1] = glMatrix.RANDOM();
	  out[2] = glMatrix.RANDOM();
	  out[3] = glMatrix.RANDOM();
	  normalize(out, out);
	  scale(out, out, vectorScale);
	  return out;
	}

	/**
	 * Transforms the vec4 with a mat4.
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {mat4} m matrix to transform with
	 * @returns {vec4} out
	 */
	function transformMat4(out, a, m) {
	  var x = a[0],
	      y = a[1],
	      z = a[2],
	      w = a[3];
	  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
	  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
	  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
	  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
	  return out;
	}

	/**
	 * Transforms the vec4 with a quat
	 *
	 * @param {vec4} out the receiving vector
	 * @param {vec4} a the vector to transform
	 * @param {quat} q quaternion to transform with
	 * @returns {vec4} out
	 */
	function transformQuat(out, a, q) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];
	  var qx = q[0],
	      qy = q[1],
	      qz = q[2],
	      qw = q[3];

	  // calculate quat * vec
	  var ix = qw * x + qy * z - qz * y;
	  var iy = qw * y + qz * x - qx * z;
	  var iz = qw * z + qx * y - qy * x;
	  var iw = -qx * x - qy * y - qz * z;

	  // calculate result * inverse quat
	  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec4} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str(a) {
	  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	}

	/**
	 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {vec4} a The first vector.
	 * @param {vec4} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
	}

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec4} a The first vector.
	 * @param {vec4} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
	}

	/**
	 * Alias for {@link vec4.subtract}
	 * @function
	 */
	var sub = exports.sub = subtract;

	/**
	 * Alias for {@link vec4.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Alias for {@link vec4.divide}
	 * @function
	 */
	var div = exports.div = divide;

	/**
	 * Alias for {@link vec4.distance}
	 * @function
	 */
	var dist = exports.dist = distance;

	/**
	 * Alias for {@link vec4.squaredDistance}
	 * @function
	 */
	var sqrDist = exports.sqrDist = squaredDistance;

	/**
	 * Alias for {@link vec4.length}
	 * @function
	 */
	var len = exports.len = length;

	/**
	 * Alias for {@link vec4.squaredLength}
	 * @function
	 */
	var sqrLen = exports.sqrLen = squaredLength;

	/**
	 * Perform some operation over an array of vec4s.
	 *
	 * @param {Array} a the array of vectors to iterate over
	 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
	 * @param {Number} offset Number of elements to skip at the beginning of the array
	 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
	 * @param {Function} fn Function to call for each vector in the array
	 * @param {Object} [arg] additional argument to pass to fn
	 * @returns {Array} a
	 * @function
	 */
	var forEach = exports.forEach = function () {
	  var vec = create();

	  return function (a, stride, offset, count, fn, arg) {
	    var i = void 0,
	        l = void 0;
	    if (!stride) {
	      stride = 4;
	    }

	    if (!offset) {
	      offset = 0;
	    }

	    if (count) {
	      l = Math.min(count * stride + offset, a.length);
	    } else {
	      l = a.length;
	    }

	    for (i = offset; i < l; i += stride) {
	      vec[0] = a[i];vec[1] = a[i + 1];vec[2] = a[i + 2];vec[3] = a[i + 3];
	      fn(vec, vec, arg);
	      a[i] = vec[0];a[i + 1] = vec[1];a[i + 2] = vec[2];a[i + 3] = vec[3];
	    }

	    return a;
	  };
	}();

	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.vec4 = exports.vec3 = exports.vec2 = exports.quat = exports.mat4 = exports.mat3 = exports.mat2d = exports.mat2 = exports.glMatrix = undefined;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	var _mat = __webpack_require__(5);

	var mat2 = _interopRequireWildcard(_mat);

	var _mat2d = __webpack_require__(6);

	var mat2d = _interopRequireWildcard(_mat2d);

	var _mat2 = __webpack_require__(1);

	var mat3 = _interopRequireWildcard(_mat2);

	var _mat3 = __webpack_require__(7);

	var mat4 = _interopRequireWildcard(_mat3);

	var _quat = __webpack_require__(8);

	var quat = _interopRequireWildcard(_quat);

	var _vec = __webpack_require__(9);

	var vec2 = _interopRequireWildcard(_vec);

	var _vec2 = __webpack_require__(2);

	var vec3 = _interopRequireWildcard(_vec2);

	var _vec3 = __webpack_require__(3);

	var vec4 = _interopRequireWildcard(_vec3);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.glMatrix = glMatrix;
	exports.mat2 = mat2;
	exports.mat2d = mat2d;
	exports.mat3 = mat3;
	exports.mat4 = mat4;
	exports.quat = quat;
	exports.vec2 = vec2;
	exports.vec3 = vec3;
	exports.vec4 = vec4; /**
	                      * @fileoverview gl-matrix - High performance matrix and vector operations
	                      * @author Brandon Jones
	                      * @author Colin MacKenzie IV
	                      * @version 2.4.0
	                      */

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
	// END HEADER

	/***/ }),
	/* 5 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sub = exports.mul = undefined;
	exports.create = create;
	exports.clone = clone;
	exports.copy = copy;
	exports.identity = identity;
	exports.fromValues = fromValues;
	exports.set = set;
	exports.transpose = transpose;
	exports.invert = invert;
	exports.adjoint = adjoint;
	exports.determinant = determinant;
	exports.multiply = multiply;
	exports.rotate = rotate;
	exports.scale = scale;
	exports.fromRotation = fromRotation;
	exports.fromScaling = fromScaling;
	exports.str = str;
	exports.frob = frob;
	exports.LDU = LDU;
	exports.add = add;
	exports.subtract = subtract;
	exports.exactEquals = exactEquals;
	exports.equals = equals;
	exports.multiplyScalar = multiplyScalar;
	exports.multiplyScalarAndAdd = multiplyScalarAndAdd;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * 2x2 Matrix
	 * @module mat2
	 */

	/**
	 * Creates a new identity mat2
	 *
	 * @returns {mat2} a new 2x2 matrix
	 */
	function create() {
	  var out = new glMatrix.ARRAY_TYPE(4);
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Creates a new mat2 initialized with values from an existing matrix
	 *
	 * @param {mat2} a matrix to clone
	 * @returns {mat2} a new 2x2 matrix
	 */
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

	function clone(a) {
	  var out = new glMatrix.ARRAY_TYPE(4);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Copy the values from one mat2 to another
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Set a mat2 to the identity matrix
	 *
	 * @param {mat2} out the receiving matrix
	 * @returns {mat2} out
	 */
	function identity(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Create a new mat2 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m10 Component in column 1, row 0 position (index 2)
	 * @param {Number} m11 Component in column 1, row 1 position (index 3)
	 * @returns {mat2} out A new 2x2 matrix
	 */
	function fromValues(m00, m01, m10, m11) {
	  var out = new glMatrix.ARRAY_TYPE(4);
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m10;
	  out[3] = m11;
	  return out;
	}

	/**
	 * Set the components of a mat2 to the given values
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m10 Component in column 1, row 0 position (index 2)
	 * @param {Number} m11 Component in column 1, row 1 position (index 3)
	 * @returns {mat2} out
	 */
	function set(out, m00, m01, m10, m11) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m10;
	  out[3] = m11;
	  return out;
	}

	/**
	 * Transpose the values of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function transpose(out, a) {
	  // If we are transposing ourselves we can skip a few steps but have to cache
	  // some values
	  if (out === a) {
	    var a1 = a[1];
	    out[1] = a[2];
	    out[2] = a1;
	  } else {
	    out[0] = a[0];
	    out[1] = a[2];
	    out[2] = a[1];
	    out[3] = a[3];
	  }

	  return out;
	}

	/**
	 * Inverts a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function invert(out, a) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];

	  // Calculate the determinant
	  var det = a0 * a3 - a2 * a1;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = a3 * det;
	  out[1] = -a1 * det;
	  out[2] = -a2 * det;
	  out[3] = a0 * det;

	  return out;
	}

	/**
	 * Calculates the adjugate of a mat2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the source matrix
	 * @returns {mat2} out
	 */
	function adjoint(out, a) {
	  // Caching this value is nessecary if out == a
	  var a0 = a[0];
	  out[0] = a[3];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = a0;

	  return out;
	}

	/**
	 * Calculates the determinant of a mat2
	 *
	 * @param {mat2} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	  return a[0] * a[3] - a[2] * a[1];
	}

	/**
	 * Multiplies two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	function multiply(out, a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  out[0] = a0 * b0 + a2 * b1;
	  out[1] = a1 * b0 + a3 * b1;
	  out[2] = a0 * b2 + a2 * b3;
	  out[3] = a1 * b2 + a3 * b3;
	  return out;
	}

	/**
	 * Rotates a mat2 by the given angle
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	function rotate(out, a, rad) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  out[0] = a0 * c + a2 * s;
	  out[1] = a1 * c + a3 * s;
	  out[2] = a0 * -s + a2 * c;
	  out[3] = a1 * -s + a3 * c;
	  return out;
	}

	/**
	 * Scales the mat2 by the dimensions in the given vec2
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to rotate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2} out
	 **/
	function scale(out, a, v) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var v0 = v[0],
	      v1 = v[1];
	  out[0] = a0 * v0;
	  out[1] = a1 * v0;
	  out[2] = a2 * v1;
	  out[3] = a3 * v1;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.rotate(dest, dest, rad);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2} out
	 */
	function fromRotation(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  out[0] = c;
	  out[1] = s;
	  out[2] = -s;
	  out[3] = c;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2.identity(dest);
	 *     mat2.scale(dest, dest, vec);
	 *
	 * @param {mat2} out mat2 receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2} out
	 */
	function fromScaling(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = v[1];
	  return out;
	}

	/**
	 * Returns a string representation of a mat2
	 *
	 * @param {mat2} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str(a) {
	  return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat2
	 *
	 * @param {mat2} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2));
	}

	/**
	 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
	 * @param {mat2} L the lower triangular matrix
	 * @param {mat2} D the diagonal matrix
	 * @param {mat2} U the upper triangular matrix
	 * @param {mat2} a the input matrix to factorize
	 */

	function LDU(L, D, U, a) {
	  L[2] = a[2] / a[0];
	  U[0] = a[0];
	  U[1] = a[1];
	  U[3] = a[3] - L[2] * U[1];
	  return [L, D, U];
	}

	/**
	 * Adds two mat2's
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @returns {mat2} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat2} a The first matrix.
	 * @param {mat2} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat2} a The first matrix.
	 * @param {mat2} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat2} out the receiving matrix
	 * @param {mat2} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat2} out
	 */
	function multiplyScalar(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  return out;
	}

	/**
	 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat2} out the receiving vector
	 * @param {mat2} a the first operand
	 * @param {mat2} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat2} out
	 */
	function multiplyScalarAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  return out;
	}

	/**
	 * Alias for {@link mat2.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Alias for {@link mat2.subtract}
	 * @function
	 */
	var sub = exports.sub = subtract;

	/***/ }),
	/* 6 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sub = exports.mul = undefined;
	exports.create = create;
	exports.clone = clone;
	exports.copy = copy;
	exports.identity = identity;
	exports.fromValues = fromValues;
	exports.set = set;
	exports.invert = invert;
	exports.determinant = determinant;
	exports.multiply = multiply;
	exports.rotate = rotate;
	exports.scale = scale;
	exports.translate = translate;
	exports.fromRotation = fromRotation;
	exports.fromScaling = fromScaling;
	exports.fromTranslation = fromTranslation;
	exports.str = str;
	exports.frob = frob;
	exports.add = add;
	exports.subtract = subtract;
	exports.multiplyScalar = multiplyScalar;
	exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
	exports.exactEquals = exactEquals;
	exports.equals = equals;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * 2x3 Matrix
	 * @module mat2d
	 *
	 * @description
	 * A mat2d contains six elements defined as:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty]
	 * </pre>
	 * This is a short form for the 3x3 matrix:
	 * <pre>
	 * [a, c, tx,
	 *  b, d, ty,
	 *  0, 0, 1]
	 * </pre>
	 * The last row is ignored so the array is shorter and operations are faster.
	 */

	/**
	 * Creates a new identity mat2d
	 *
	 * @returns {mat2d} a new 2x3 matrix
	 */
	function create() {
	  var out = new glMatrix.ARRAY_TYPE(6);
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  out[4] = 0;
	  out[5] = 0;
	  return out;
	}

	/**
	 * Creates a new mat2d initialized with values from an existing matrix
	 *
	 * @param {mat2d} a matrix to clone
	 * @returns {mat2d} a new 2x3 matrix
	 */
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

	function clone(a) {
	  var out = new glMatrix.ARRAY_TYPE(6);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  return out;
	}

	/**
	 * Copy the values from one mat2d to another
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  return out;
	}

	/**
	 * Set a mat2d to the identity matrix
	 *
	 * @param {mat2d} out the receiving matrix
	 * @returns {mat2d} out
	 */
	function identity(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  out[4] = 0;
	  out[5] = 0;
	  return out;
	}

	/**
	 * Create a new mat2d with the given values
	 *
	 * @param {Number} a Component A (index 0)
	 * @param {Number} b Component B (index 1)
	 * @param {Number} c Component C (index 2)
	 * @param {Number} d Component D (index 3)
	 * @param {Number} tx Component TX (index 4)
	 * @param {Number} ty Component TY (index 5)
	 * @returns {mat2d} A new mat2d
	 */
	function fromValues(a, b, c, d, tx, ty) {
	  var out = new glMatrix.ARRAY_TYPE(6);
	  out[0] = a;
	  out[1] = b;
	  out[2] = c;
	  out[3] = d;
	  out[4] = tx;
	  out[5] = ty;
	  return out;
	}

	/**
	 * Set the components of a mat2d to the given values
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {Number} a Component A (index 0)
	 * @param {Number} b Component B (index 1)
	 * @param {Number} c Component C (index 2)
	 * @param {Number} d Component D (index 3)
	 * @param {Number} tx Component TX (index 4)
	 * @param {Number} ty Component TY (index 5)
	 * @returns {mat2d} out
	 */
	function set(out, a, b, c, d, tx, ty) {
	  out[0] = a;
	  out[1] = b;
	  out[2] = c;
	  out[3] = d;
	  out[4] = tx;
	  out[5] = ty;
	  return out;
	}

	/**
	 * Inverts a mat2d
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the source matrix
	 * @returns {mat2d} out
	 */
	function invert(out, a) {
	  var aa = a[0],
	      ab = a[1],
	      ac = a[2],
	      ad = a[3];
	  var atx = a[4],
	      aty = a[5];

	  var det = aa * ad - ab * ac;
	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = ad * det;
	  out[1] = -ab * det;
	  out[2] = -ac * det;
	  out[3] = aa * det;
	  out[4] = (ac * aty - ad * atx) * det;
	  out[5] = (ab * atx - aa * aty) * det;
	  return out;
	}

	/**
	 * Calculates the determinant of a mat2d
	 *
	 * @param {mat2d} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	  return a[0] * a[3] - a[1] * a[2];
	}

	/**
	 * Multiplies two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	function multiply(out, a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3],
	      b4 = b[4],
	      b5 = b[5];
	  out[0] = a0 * b0 + a2 * b1;
	  out[1] = a1 * b0 + a3 * b1;
	  out[2] = a0 * b2 + a2 * b3;
	  out[3] = a1 * b2 + a3 * b3;
	  out[4] = a0 * b4 + a2 * b5 + a4;
	  out[5] = a1 * b4 + a3 * b5 + a5;
	  return out;
	}

	/**
	 * Rotates a mat2d by the given angle
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	function rotate(out, a, rad) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  out[0] = a0 * c + a2 * s;
	  out[1] = a1 * c + a3 * s;
	  out[2] = a0 * -s + a2 * c;
	  out[3] = a1 * -s + a3 * c;
	  out[4] = a4;
	  out[5] = a5;
	  return out;
	}

	/**
	 * Scales the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to scale the matrix by
	 * @returns {mat2d} out
	 **/
	function scale(out, a, v) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var v0 = v[0],
	      v1 = v[1];
	  out[0] = a0 * v0;
	  out[1] = a1 * v0;
	  out[2] = a2 * v1;
	  out[3] = a3 * v1;
	  out[4] = a4;
	  out[5] = a5;
	  return out;
	}

	/**
	 * Translates the mat2d by the dimensions in the given vec2
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to translate
	 * @param {vec2} v the vec2 to translate the matrix by
	 * @returns {mat2d} out
	 **/
	function translate(out, a, v) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var v0 = v[0],
	      v1 = v[1];
	  out[0] = a0;
	  out[1] = a1;
	  out[2] = a2;
	  out[3] = a3;
	  out[4] = a0 * v0 + a2 * v1 + a4;
	  out[5] = a1 * v0 + a3 * v1 + a5;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.rotate(dest, dest, rad);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat2d} out
	 */
	function fromRotation(out, rad) {
	  var s = Math.sin(rad),
	      c = Math.cos(rad);
	  out[0] = c;
	  out[1] = s;
	  out[2] = -s;
	  out[3] = c;
	  out[4] = 0;
	  out[5] = 0;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.scale(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Scaling vector
	 * @returns {mat2d} out
	 */
	function fromScaling(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = v[1];
	  out[4] = 0;
	  out[5] = 0;
	  return out;
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat2d.identity(dest);
	 *     mat2d.translate(dest, dest, vec);
	 *
	 * @param {mat2d} out mat2d receiving operation result
	 * @param {vec2} v Translation vector
	 * @returns {mat2d} out
	 */
	function fromTranslation(out, v) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  out[4] = v[0];
	  out[5] = v[1];
	  return out;
	}

	/**
	 * Returns a string representation of a mat2d
	 *
	 * @param {mat2d} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str(a) {
	  return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat2d
	 *
	 * @param {mat2d} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1);
	}

	/**
	 * Adds two mat2d's
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  out[4] = a[4] + b[4];
	  out[5] = a[5] + b[5];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @returns {mat2d} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  out[4] = a[4] - b[4];
	  out[5] = a[5] - b[5];
	  return out;
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat2d} out the receiving matrix
	 * @param {mat2d} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat2d} out
	 */
	function multiplyScalar(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  out[4] = a[4] * b;
	  out[5] = a[5] * b;
	  return out;
	}

	/**
	 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat2d} out the receiving vector
	 * @param {mat2d} a the first operand
	 * @param {mat2d} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat2d} out
	 */
	function multiplyScalarAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  out[4] = a[4] + b[4] * scale;
	  out[5] = a[5] + b[5] * scale;
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat2d} a The first matrix.
	 * @param {mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat2d} a The first matrix.
	 * @param {mat2d} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3],
	      a4 = a[4],
	      a5 = a[5];
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3],
	      b4 = b[4],
	      b5 = b[5];
	  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5));
	}

	/**
	 * Alias for {@link mat2d.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Alias for {@link mat2d.subtract}
	 * @function
	 */
	var sub = exports.sub = subtract;

	/***/ }),
	/* 7 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sub = exports.mul = undefined;
	exports.create = create;
	exports.clone = clone;
	exports.copy = copy;
	exports.fromValues = fromValues;
	exports.set = set;
	exports.identity = identity;
	exports.transpose = transpose;
	exports.invert = invert;
	exports.adjoint = adjoint;
	exports.determinant = determinant;
	exports.multiply = multiply;
	exports.translate = translate;
	exports.scale = scale;
	exports.rotate = rotate;
	exports.rotateX = rotateX;
	exports.rotateY = rotateY;
	exports.rotateZ = rotateZ;
	exports.fromTranslation = fromTranslation;
	exports.fromScaling = fromScaling;
	exports.fromRotation = fromRotation;
	exports.fromXRotation = fromXRotation;
	exports.fromYRotation = fromYRotation;
	exports.fromZRotation = fromZRotation;
	exports.fromRotationTranslation = fromRotationTranslation;
	exports.getTranslation = getTranslation;
	exports.getScaling = getScaling;
	exports.getRotation = getRotation;
	exports.fromRotationTranslationScale = fromRotationTranslationScale;
	exports.fromRotationTranslationScaleOrigin = fromRotationTranslationScaleOrigin;
	exports.fromQuat = fromQuat;
	exports.frustum = frustum;
	exports.perspective = perspective;
	exports.perspectiveFromFieldOfView = perspectiveFromFieldOfView;
	exports.ortho = ortho;
	exports.lookAt = lookAt;
	exports.targetTo = targetTo;
	exports.str = str;
	exports.frob = frob;
	exports.add = add;
	exports.subtract = subtract;
	exports.multiplyScalar = multiplyScalar;
	exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
	exports.exactEquals = exactEquals;
	exports.equals = equals;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * 4x4 Matrix
	 * @module mat4
	 */

	/**
	 * Creates a new identity mat4
	 *
	 * @returns {mat4} a new 4x4 matrix
	 */
	function create() {
	  var out = new glMatrix.ARRAY_TYPE(16);
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a new mat4 initialized with values from an existing matrix
	 *
	 * @param {mat4} a matrix to clone
	 * @returns {mat4} a new 4x4 matrix
	 */
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

	function clone(a) {
	  var out = new glMatrix.ARRAY_TYPE(16);
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  out[9] = a[9];
	  out[10] = a[10];
	  out[11] = a[11];
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}

	/**
	 * Copy the values from one mat4 to another
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  out[2] = a[2];
	  out[3] = a[3];
	  out[4] = a[4];
	  out[5] = a[5];
	  out[6] = a[6];
	  out[7] = a[7];
	  out[8] = a[8];
	  out[9] = a[9];
	  out[10] = a[10];
	  out[11] = a[11];
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}

	/**
	 * Create a new mat4 with the given values
	 *
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m03 Component in column 0, row 3 position (index 3)
	 * @param {Number} m10 Component in column 1, row 0 position (index 4)
	 * @param {Number} m11 Component in column 1, row 1 position (index 5)
	 * @param {Number} m12 Component in column 1, row 2 position (index 6)
	 * @param {Number} m13 Component in column 1, row 3 position (index 7)
	 * @param {Number} m20 Component in column 2, row 0 position (index 8)
	 * @param {Number} m21 Component in column 2, row 1 position (index 9)
	 * @param {Number} m22 Component in column 2, row 2 position (index 10)
	 * @param {Number} m23 Component in column 2, row 3 position (index 11)
	 * @param {Number} m30 Component in column 3, row 0 position (index 12)
	 * @param {Number} m31 Component in column 3, row 1 position (index 13)
	 * @param {Number} m32 Component in column 3, row 2 position (index 14)
	 * @param {Number} m33 Component in column 3, row 3 position (index 15)
	 * @returns {mat4} A new mat4
	 */
	function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	  var out = new glMatrix.ARRAY_TYPE(16);
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m03;
	  out[4] = m10;
	  out[5] = m11;
	  out[6] = m12;
	  out[7] = m13;
	  out[8] = m20;
	  out[9] = m21;
	  out[10] = m22;
	  out[11] = m23;
	  out[12] = m30;
	  out[13] = m31;
	  out[14] = m32;
	  out[15] = m33;
	  return out;
	}

	/**
	 * Set the components of a mat4 to the given values
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {Number} m00 Component in column 0, row 0 position (index 0)
	 * @param {Number} m01 Component in column 0, row 1 position (index 1)
	 * @param {Number} m02 Component in column 0, row 2 position (index 2)
	 * @param {Number} m03 Component in column 0, row 3 position (index 3)
	 * @param {Number} m10 Component in column 1, row 0 position (index 4)
	 * @param {Number} m11 Component in column 1, row 1 position (index 5)
	 * @param {Number} m12 Component in column 1, row 2 position (index 6)
	 * @param {Number} m13 Component in column 1, row 3 position (index 7)
	 * @param {Number} m20 Component in column 2, row 0 position (index 8)
	 * @param {Number} m21 Component in column 2, row 1 position (index 9)
	 * @param {Number} m22 Component in column 2, row 2 position (index 10)
	 * @param {Number} m23 Component in column 2, row 3 position (index 11)
	 * @param {Number} m30 Component in column 3, row 0 position (index 12)
	 * @param {Number} m31 Component in column 3, row 1 position (index 13)
	 * @param {Number} m32 Component in column 3, row 2 position (index 14)
	 * @param {Number} m33 Component in column 3, row 3 position (index 15)
	 * @returns {mat4} out
	 */
	function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
	  out[0] = m00;
	  out[1] = m01;
	  out[2] = m02;
	  out[3] = m03;
	  out[4] = m10;
	  out[5] = m11;
	  out[6] = m12;
	  out[7] = m13;
	  out[8] = m20;
	  out[9] = m21;
	  out[10] = m22;
	  out[11] = m23;
	  out[12] = m30;
	  out[13] = m31;
	  out[14] = m32;
	  out[15] = m33;
	  return out;
	}

	/**
	 * Set a mat4 to the identity matrix
	 *
	 * @param {mat4} out the receiving matrix
	 * @returns {mat4} out
	 */
	function identity(out) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Transpose the values of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function transpose(out, a) {
	  // If we are transposing ourselves we can skip a few steps but have to cache some values
	  if (out === a) {
	    var a01 = a[1],
	        a02 = a[2],
	        a03 = a[3];
	    var a12 = a[6],
	        a13 = a[7];
	    var a23 = a[11];

	    out[1] = a[4];
	    out[2] = a[8];
	    out[3] = a[12];
	    out[4] = a01;
	    out[6] = a[9];
	    out[7] = a[13];
	    out[8] = a02;
	    out[9] = a12;
	    out[11] = a[14];
	    out[12] = a03;
	    out[13] = a13;
	    out[14] = a23;
	  } else {
	    out[0] = a[0];
	    out[1] = a[4];
	    out[2] = a[8];
	    out[3] = a[12];
	    out[4] = a[1];
	    out[5] = a[5];
	    out[6] = a[9];
	    out[7] = a[13];
	    out[8] = a[2];
	    out[9] = a[6];
	    out[10] = a[10];
	    out[11] = a[14];
	    out[12] = a[3];
	    out[13] = a[7];
	    out[14] = a[11];
	    out[15] = a[15];
	  }

	  return out;
	}

	/**
	 * Inverts a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function invert(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  var b00 = a00 * a11 - a01 * a10;
	  var b01 = a00 * a12 - a02 * a10;
	  var b02 = a00 * a13 - a03 * a10;
	  var b03 = a01 * a12 - a02 * a11;
	  var b04 = a01 * a13 - a03 * a11;
	  var b05 = a02 * a13 - a03 * a12;
	  var b06 = a20 * a31 - a21 * a30;
	  var b07 = a20 * a32 - a22 * a30;
	  var b08 = a20 * a33 - a23 * a30;
	  var b09 = a21 * a32 - a22 * a31;
	  var b10 = a21 * a33 - a23 * a31;
	  var b11 = a22 * a33 - a23 * a32;

	  // Calculate the determinant
	  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

	  if (!det) {
	    return null;
	  }
	  det = 1.0 / det;

	  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
	  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
	  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
	  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
	  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
	  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
	  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
	  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
	  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
	  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
	  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
	  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
	  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
	  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
	  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
	  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

	  return out;
	}

	/**
	 * Calculates the adjugate of a mat4
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the source matrix
	 * @returns {mat4} out
	 */
	function adjoint(out, a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
	  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
	  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
	  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
	  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
	  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
	  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
	  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
	  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
	  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
	  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
	  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
	  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
	  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
	  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
	  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
	  return out;
	}

	/**
	 * Calculates the determinant of a mat4
	 *
	 * @param {mat4} a the source matrix
	 * @returns {Number} determinant of a
	 */
	function determinant(a) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  var b00 = a00 * a11 - a01 * a10;
	  var b01 = a00 * a12 - a02 * a10;
	  var b02 = a00 * a13 - a03 * a10;
	  var b03 = a01 * a12 - a02 * a11;
	  var b04 = a01 * a13 - a03 * a11;
	  var b05 = a02 * a13 - a03 * a12;
	  var b06 = a20 * a31 - a21 * a30;
	  var b07 = a20 * a32 - a22 * a30;
	  var b08 = a20 * a33 - a23 * a30;
	  var b09 = a21 * a32 - a22 * a31;
	  var b10 = a21 * a33 - a23 * a31;
	  var b11 = a22 * a33 - a23 * a32;

	  // Calculate the determinant
	  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	}

	/**
	 * Multiplies two mat4s
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function multiply(out, a, b) {
	  var a00 = a[0],
	      a01 = a[1],
	      a02 = a[2],
	      a03 = a[3];
	  var a10 = a[4],
	      a11 = a[5],
	      a12 = a[6],
	      a13 = a[7];
	  var a20 = a[8],
	      a21 = a[9],
	      a22 = a[10],
	      a23 = a[11];
	  var a30 = a[12],
	      a31 = a[13],
	      a32 = a[14],
	      a33 = a[15];

	  // Cache only the current line of the second matrix
	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	  b0 = b[4];b1 = b[5];b2 = b[6];b3 = b[7];
	  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	  b0 = b[8];b1 = b[9];b2 = b[10];b3 = b[11];
	  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

	  b0 = b[12];b1 = b[13];b2 = b[14];b3 = b[15];
	  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
	  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
	  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
	  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
	  return out;
	}

	/**
	 * Translate a mat4 by the given vector
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to translate
	 * @param {vec3} v vector to translate by
	 * @returns {mat4} out
	 */
	function translate(out, a, v) {
	  var x = v[0],
	      y = v[1],
	      z = v[2];
	  var a00 = void 0,
	      a01 = void 0,
	      a02 = void 0,
	      a03 = void 0;
	  var a10 = void 0,
	      a11 = void 0,
	      a12 = void 0,
	      a13 = void 0;
	  var a20 = void 0,
	      a21 = void 0,
	      a22 = void 0,
	      a23 = void 0;

	  if (a === out) {
	    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
	    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
	    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
	    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
	  } else {
	    a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
	    a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
	    a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

	    out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
	    out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
	    out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

	    out[12] = a00 * x + a10 * y + a20 * z + a[12];
	    out[13] = a01 * x + a11 * y + a21 * z + a[13];
	    out[14] = a02 * x + a12 * y + a22 * z + a[14];
	    out[15] = a03 * x + a13 * y + a23 * z + a[15];
	  }

	  return out;
	}

	/**
	 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {vec3} v the vec3 to scale the matrix by
	 * @returns {mat4} out
	 **/
	function scale(out, a, v) {
	  var x = v[0],
	      y = v[1],
	      z = v[2];

	  out[0] = a[0] * x;
	  out[1] = a[1] * x;
	  out[2] = a[2] * x;
	  out[3] = a[3] * x;
	  out[4] = a[4] * y;
	  out[5] = a[5] * y;
	  out[6] = a[6] * y;
	  out[7] = a[7] * y;
	  out[8] = a[8] * z;
	  out[9] = a[9] * z;
	  out[10] = a[10] * z;
	  out[11] = a[11] * z;
	  out[12] = a[12];
	  out[13] = a[13];
	  out[14] = a[14];
	  out[15] = a[15];
	  return out;
	}

	/**
	 * Rotates a mat4 by the given angle around the given axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	function rotate(out, a, rad, axis) {
	  var x = axis[0],
	      y = axis[1],
	      z = axis[2];
	  var len = Math.sqrt(x * x + y * y + z * z);
	  var s = void 0,
	      c = void 0,
	      t = void 0;
	  var a00 = void 0,
	      a01 = void 0,
	      a02 = void 0,
	      a03 = void 0;
	  var a10 = void 0,
	      a11 = void 0,
	      a12 = void 0,
	      a13 = void 0;
	  var a20 = void 0,
	      a21 = void 0,
	      a22 = void 0,
	      a23 = void 0;
	  var b00 = void 0,
	      b01 = void 0,
	      b02 = void 0;
	  var b10 = void 0,
	      b11 = void 0,
	      b12 = void 0;
	  var b20 = void 0,
	      b21 = void 0,
	      b22 = void 0;

	  if (Math.abs(len) < glMatrix.EPSILON) {
	    return null;
	  }

	  len = 1 / len;
	  x *= len;
	  y *= len;
	  z *= len;

	  s = Math.sin(rad);
	  c = Math.cos(rad);
	  t = 1 - c;

	  a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
	  a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
	  a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

	  // Construct the elements of the rotation matrix
	  b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
	  b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
	  b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;

	  // Perform rotation-specific matrix multiplication
	  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
	  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
	  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
	  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
	  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
	  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
	  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
	  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
	  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
	  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
	  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
	  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged last row
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }
	  return out;
	}

	/**
	 * Rotates a matrix by the given angle around the X axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateX(out, a, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  var a10 = a[4];
	  var a11 = a[5];
	  var a12 = a[6];
	  var a13 = a[7];
	  var a20 = a[8];
	  var a21 = a[9];
	  var a22 = a[10];
	  var a23 = a[11];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged rows
	    out[0] = a[0];
	    out[1] = a[1];
	    out[2] = a[2];
	    out[3] = a[3];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }

	  // Perform axis-specific matrix multiplication
	  out[4] = a10 * c + a20 * s;
	  out[5] = a11 * c + a21 * s;
	  out[6] = a12 * c + a22 * s;
	  out[7] = a13 * c + a23 * s;
	  out[8] = a20 * c - a10 * s;
	  out[9] = a21 * c - a11 * s;
	  out[10] = a22 * c - a12 * s;
	  out[11] = a23 * c - a13 * s;
	  return out;
	}

	/**
	 * Rotates a matrix by the given angle around the Y axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateY(out, a, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  var a00 = a[0];
	  var a01 = a[1];
	  var a02 = a[2];
	  var a03 = a[3];
	  var a20 = a[8];
	  var a21 = a[9];
	  var a22 = a[10];
	  var a23 = a[11];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged rows
	    out[4] = a[4];
	    out[5] = a[5];
	    out[6] = a[6];
	    out[7] = a[7];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }

	  // Perform axis-specific matrix multiplication
	  out[0] = a00 * c - a20 * s;
	  out[1] = a01 * c - a21 * s;
	  out[2] = a02 * c - a22 * s;
	  out[3] = a03 * c - a23 * s;
	  out[8] = a00 * s + a20 * c;
	  out[9] = a01 * s + a21 * c;
	  out[10] = a02 * s + a22 * c;
	  out[11] = a03 * s + a23 * c;
	  return out;
	}

	/**
	 * Rotates a matrix by the given angle around the Z axis
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to rotate
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function rotateZ(out, a, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);
	  var a00 = a[0];
	  var a01 = a[1];
	  var a02 = a[2];
	  var a03 = a[3];
	  var a10 = a[4];
	  var a11 = a[5];
	  var a12 = a[6];
	  var a13 = a[7];

	  if (a !== out) {
	    // If the source and destination differ, copy the unchanged last row
	    out[8] = a[8];
	    out[9] = a[9];
	    out[10] = a[10];
	    out[11] = a[11];
	    out[12] = a[12];
	    out[13] = a[13];
	    out[14] = a[14];
	    out[15] = a[15];
	  }

	  // Perform axis-specific matrix multiplication
	  out[0] = a00 * c + a10 * s;
	  out[1] = a01 * c + a11 * s;
	  out[2] = a02 * c + a12 * s;
	  out[3] = a03 * c + a13 * s;
	  out[4] = a10 * c - a00 * s;
	  out[5] = a11 * c - a01 * s;
	  out[6] = a12 * c - a02 * s;
	  out[7] = a13 * c - a03 * s;
	  return out;
	}

	/**
	 * Creates a matrix from a vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	function fromTranslation(out, v) {
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = v[0];
	  out[13] = v[1];
	  out[14] = v[2];
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a vector scaling
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.scale(dest, dest, vec);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {vec3} v Scaling vector
	 * @returns {mat4} out
	 */
	function fromScaling(out, v) {
	  out[0] = v[0];
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = v[1];
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = v[2];
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a given angle around a given axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotate(dest, dest, rad, axis);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @param {vec3} axis the axis to rotate around
	 * @returns {mat4} out
	 */
	function fromRotation(out, rad, axis) {
	  var x = axis[0],
	      y = axis[1],
	      z = axis[2];
	  var len = Math.sqrt(x * x + y * y + z * z);
	  var s = void 0,
	      c = void 0,
	      t = void 0;

	  if (Math.abs(len) < glMatrix.EPSILON) {
	    return null;
	  }

	  len = 1 / len;
	  x *= len;
	  y *= len;
	  z *= len;

	  s = Math.sin(rad);
	  c = Math.cos(rad);
	  t = 1 - c;

	  // Perform rotation-specific matrix multiplication
	  out[0] = x * x * t + c;
	  out[1] = y * x * t + z * s;
	  out[2] = z * x * t - y * s;
	  out[3] = 0;
	  out[4] = x * y * t - z * s;
	  out[5] = y * y * t + c;
	  out[6] = z * y * t + x * s;
	  out[7] = 0;
	  out[8] = x * z * t + y * s;
	  out[9] = y * z * t - x * s;
	  out[10] = z * z * t + c;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from the given angle around the X axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateX(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function fromXRotation(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);

	  // Perform axis-specific matrix multiplication
	  out[0] = 1;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = c;
	  out[6] = s;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = -s;
	  out[10] = c;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from the given angle around the Y axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateY(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function fromYRotation(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);

	  // Perform axis-specific matrix multiplication
	  out[0] = c;
	  out[1] = 0;
	  out[2] = -s;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = 1;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = s;
	  out[9] = 0;
	  out[10] = c;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from the given angle around the Z axis
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.rotateZ(dest, dest, rad);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {Number} rad the angle to rotate the matrix by
	 * @returns {mat4} out
	 */
	function fromZRotation(out, rad) {
	  var s = Math.sin(rad);
	  var c = Math.cos(rad);

	  // Perform axis-specific matrix multiplication
	  out[0] = c;
	  out[1] = s;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = -s;
	  out[5] = c;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 1;
	  out[11] = 0;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Creates a matrix from a quaternion rotation and vector translation
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @returns {mat4} out
	 */
	function fromRotationTranslation(out, q, v) {
	  // Quaternion math
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var xy = x * y2;
	  var xz = x * z2;
	  var yy = y * y2;
	  var yz = y * z2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  out[0] = 1 - (yy + zz);
	  out[1] = xy + wz;
	  out[2] = xz - wy;
	  out[3] = 0;
	  out[4] = xy - wz;
	  out[5] = 1 - (xx + zz);
	  out[6] = yz + wx;
	  out[7] = 0;
	  out[8] = xz + wy;
	  out[9] = yz - wx;
	  out[10] = 1 - (xx + yy);
	  out[11] = 0;
	  out[12] = v[0];
	  out[13] = v[1];
	  out[14] = v[2];
	  out[15] = 1;

	  return out;
	}

	/**
	 * Returns the translation vector component of a transformation
	 *  matrix. If a matrix is built with fromRotationTranslation,
	 *  the returned vector will be the same as the translation vector
	 *  originally supplied.
	 * @param  {vec3} out Vector to receive translation component
	 * @param  {mat4} mat Matrix to be decomposed (input)
	 * @return {vec3} out
	 */
	function getTranslation(out, mat) {
	  out[0] = mat[12];
	  out[1] = mat[13];
	  out[2] = mat[14];

	  return out;
	}

	/**
	 * Returns the scaling factor component of a transformation
	 *  matrix. If a matrix is built with fromRotationTranslationScale
	 *  with a normalized Quaternion paramter, the returned vector will be
	 *  the same as the scaling vector
	 *  originally supplied.
	 * @param  {vec3} out Vector to receive scaling factor component
	 * @param  {mat4} mat Matrix to be decomposed (input)
	 * @return {vec3} out
	 */
	function getScaling(out, mat) {
	  var m11 = mat[0];
	  var m12 = mat[1];
	  var m13 = mat[2];
	  var m21 = mat[4];
	  var m22 = mat[5];
	  var m23 = mat[6];
	  var m31 = mat[8];
	  var m32 = mat[9];
	  var m33 = mat[10];

	  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
	  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
	  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

	  return out;
	}

	/**
	 * Returns a quaternion representing the rotational component
	 *  of a transformation matrix. If a matrix is built with
	 *  fromRotationTranslation, the returned quaternion will be the
	 *  same as the quaternion originally supplied.
	 * @param {quat} out Quaternion to receive the rotation component
	 * @param {mat4} mat Matrix to be decomposed (input)
	 * @return {quat} out
	 */
	function getRotation(out, mat) {
	  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
	  var trace = mat[0] + mat[5] + mat[10];
	  var S = 0;

	  if (trace > 0) {
	    S = Math.sqrt(trace + 1.0) * 2;
	    out[3] = 0.25 * S;
	    out[0] = (mat[6] - mat[9]) / S;
	    out[1] = (mat[8] - mat[2]) / S;
	    out[2] = (mat[1] - mat[4]) / S;
	  } else if (mat[0] > mat[5] & mat[0] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
	    out[3] = (mat[6] - mat[9]) / S;
	    out[0] = 0.25 * S;
	    out[1] = (mat[1] + mat[4]) / S;
	    out[2] = (mat[8] + mat[2]) / S;
	  } else if (mat[5] > mat[10]) {
	    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
	    out[3] = (mat[8] - mat[2]) / S;
	    out[0] = (mat[1] + mat[4]) / S;
	    out[1] = 0.25 * S;
	    out[2] = (mat[6] + mat[9]) / S;
	  } else {
	    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
	    out[3] = (mat[1] - mat[4]) / S;
	    out[0] = (mat[8] + mat[2]) / S;
	    out[1] = (mat[6] + mat[9]) / S;
	    out[2] = 0.25 * S;
	  }

	  return out;
	}

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @returns {mat4} out
	 */
	function fromRotationTranslationScale(out, q, v, s) {
	  // Quaternion math
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var xy = x * y2;
	  var xz = x * z2;
	  var yy = y * y2;
	  var yz = y * z2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;
	  var sx = s[0];
	  var sy = s[1];
	  var sz = s[2];

	  out[0] = (1 - (yy + zz)) * sx;
	  out[1] = (xy + wz) * sx;
	  out[2] = (xz - wy) * sx;
	  out[3] = 0;
	  out[4] = (xy - wz) * sy;
	  out[5] = (1 - (xx + zz)) * sy;
	  out[6] = (yz + wx) * sy;
	  out[7] = 0;
	  out[8] = (xz + wy) * sz;
	  out[9] = (yz - wx) * sz;
	  out[10] = (1 - (xx + yy)) * sz;
	  out[11] = 0;
	  out[12] = v[0];
	  out[13] = v[1];
	  out[14] = v[2];
	  out[15] = 1;

	  return out;
	}

	/**
	 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
	 * This is equivalent to (but much faster than):
	 *
	 *     mat4.identity(dest);
	 *     mat4.translate(dest, vec);
	 *     mat4.translate(dest, origin);
	 *     let quatMat = mat4.create();
	 *     quat4.toMat4(quat, quatMat);
	 *     mat4.multiply(dest, quatMat);
	 *     mat4.scale(dest, scale)
	 *     mat4.translate(dest, negativeOrigin);
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat4} q Rotation quaternion
	 * @param {vec3} v Translation vector
	 * @param {vec3} s Scaling vector
	 * @param {vec3} o The origin vector around which to scale and rotate
	 * @returns {mat4} out
	 */
	function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
	  // Quaternion math
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var xy = x * y2;
	  var xz = x * z2;
	  var yy = y * y2;
	  var yz = y * z2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  var sx = s[0];
	  var sy = s[1];
	  var sz = s[2];

	  var ox = o[0];
	  var oy = o[1];
	  var oz = o[2];

	  out[0] = (1 - (yy + zz)) * sx;
	  out[1] = (xy + wz) * sx;
	  out[2] = (xz - wy) * sx;
	  out[3] = 0;
	  out[4] = (xy - wz) * sy;
	  out[5] = (1 - (xx + zz)) * sy;
	  out[6] = (yz + wx) * sy;
	  out[7] = 0;
	  out[8] = (xz + wy) * sz;
	  out[9] = (yz - wx) * sz;
	  out[10] = (1 - (xx + yy)) * sz;
	  out[11] = 0;
	  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
	  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
	  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
	  out[15] = 1;

	  return out;
	}

	/**
	 * Calculates a 4x4 matrix from the given quaternion
	 *
	 * @param {mat4} out mat4 receiving operation result
	 * @param {quat} q Quaternion to create matrix from
	 *
	 * @returns {mat4} out
	 */
	function fromQuat(out, q) {
	  var x = q[0],
	      y = q[1],
	      z = q[2],
	      w = q[3];
	  var x2 = x + x;
	  var y2 = y + y;
	  var z2 = z + z;

	  var xx = x * x2;
	  var yx = y * x2;
	  var yy = y * y2;
	  var zx = z * x2;
	  var zy = z * y2;
	  var zz = z * z2;
	  var wx = w * x2;
	  var wy = w * y2;
	  var wz = w * z2;

	  out[0] = 1 - yy - zz;
	  out[1] = yx + wz;
	  out[2] = zx - wy;
	  out[3] = 0;

	  out[4] = yx - wz;
	  out[5] = 1 - xx - zz;
	  out[6] = zy + wx;
	  out[7] = 0;

	  out[8] = zx + wy;
	  out[9] = zy - wx;
	  out[10] = 1 - xx - yy;
	  out[11] = 0;

	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 0;
	  out[15] = 1;

	  return out;
	}

	/**
	 * Generates a frustum matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Number} left Left bound of the frustum
	 * @param {Number} right Right bound of the frustum
	 * @param {Number} bottom Bottom bound of the frustum
	 * @param {Number} top Top bound of the frustum
	 * @param {Number} near Near bound of the frustum
	 * @param {Number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function frustum(out, left, right, bottom, top, near, far) {
	  var rl = 1 / (right - left);
	  var tb = 1 / (top - bottom);
	  var nf = 1 / (near - far);
	  out[0] = near * 2 * rl;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = near * 2 * tb;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = (right + left) * rl;
	  out[9] = (top + bottom) * tb;
	  out[10] = (far + near) * nf;
	  out[11] = -1;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = far * near * 2 * nf;
	  out[15] = 0;
	  return out;
	}

	/**
	 * Generates a perspective projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} fovy Vertical field of view in radians
	 * @param {number} aspect Aspect ratio. typically viewport width/height
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function perspective(out, fovy, aspect, near, far) {
	  var f = 1.0 / Math.tan(fovy / 2);
	  var nf = 1 / (near - far);
	  out[0] = f / aspect;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = f;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = (far + near) * nf;
	  out[11] = -1;
	  out[12] = 0;
	  out[13] = 0;
	  out[14] = 2 * far * near * nf;
	  out[15] = 0;
	  return out;
	}

	/**
	 * Generates a perspective projection matrix with the given field of view.
	 * This is primarily useful for generating projection matrices to be used
	 * with the still experiemental WebVR API.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function perspectiveFromFieldOfView(out, fov, near, far) {
	  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
	  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
	  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
	  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
	  var xScale = 2.0 / (leftTan + rightTan);
	  var yScale = 2.0 / (upTan + downTan);

	  out[0] = xScale;
	  out[1] = 0.0;
	  out[2] = 0.0;
	  out[3] = 0.0;
	  out[4] = 0.0;
	  out[5] = yScale;
	  out[6] = 0.0;
	  out[7] = 0.0;
	  out[8] = -((leftTan - rightTan) * xScale * 0.5);
	  out[9] = (upTan - downTan) * yScale * 0.5;
	  out[10] = far / (near - far);
	  out[11] = -1.0;
	  out[12] = 0.0;
	  out[13] = 0.0;
	  out[14] = far * near / (near - far);
	  out[15] = 0.0;
	  return out;
	}

	/**
	 * Generates a orthogonal projection matrix with the given bounds
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {number} left Left bound of the frustum
	 * @param {number} right Right bound of the frustum
	 * @param {number} bottom Bottom bound of the frustum
	 * @param {number} top Top bound of the frustum
	 * @param {number} near Near bound of the frustum
	 * @param {number} far Far bound of the frustum
	 * @returns {mat4} out
	 */
	function ortho(out, left, right, bottom, top, near, far) {
	  var lr = 1 / (left - right);
	  var bt = 1 / (bottom - top);
	  var nf = 1 / (near - far);
	  out[0] = -2 * lr;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 0;
	  out[4] = 0;
	  out[5] = -2 * bt;
	  out[6] = 0;
	  out[7] = 0;
	  out[8] = 0;
	  out[9] = 0;
	  out[10] = 2 * nf;
	  out[11] = 0;
	  out[12] = (left + right) * lr;
	  out[13] = (top + bottom) * bt;
	  out[14] = (far + near) * nf;
	  out[15] = 1;
	  return out;
	}

	/**
	 * Generates a look-at matrix with the given eye position, focal point, and up axis
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	function lookAt(out, eye, center, up) {
	  var x0 = void 0,
	      x1 = void 0,
	      x2 = void 0,
	      y0 = void 0,
	      y1 = void 0,
	      y2 = void 0,
	      z0 = void 0,
	      z1 = void 0,
	      z2 = void 0,
	      len = void 0;
	  var eyex = eye[0];
	  var eyey = eye[1];
	  var eyez = eye[2];
	  var upx = up[0];
	  var upy = up[1];
	  var upz = up[2];
	  var centerx = center[0];
	  var centery = center[1];
	  var centerz = center[2];

	  if (Math.abs(eyex - centerx) < glMatrix.EPSILON && Math.abs(eyey - centery) < glMatrix.EPSILON && Math.abs(eyez - centerz) < glMatrix.EPSILON) {
	    return mat4.identity(out);
	  }

	  z0 = eyex - centerx;
	  z1 = eyey - centery;
	  z2 = eyez - centerz;

	  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
	  z0 *= len;
	  z1 *= len;
	  z2 *= len;

	  x0 = upy * z2 - upz * z1;
	  x1 = upz * z0 - upx * z2;
	  x2 = upx * z1 - upy * z0;
	  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
	  if (!len) {
	    x0 = 0;
	    x1 = 0;
	    x2 = 0;
	  } else {
	    len = 1 / len;
	    x0 *= len;
	    x1 *= len;
	    x2 *= len;
	  }

	  y0 = z1 * x2 - z2 * x1;
	  y1 = z2 * x0 - z0 * x2;
	  y2 = z0 * x1 - z1 * x0;

	  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
	  if (!len) {
	    y0 = 0;
	    y1 = 0;
	    y2 = 0;
	  } else {
	    len = 1 / len;
	    y0 *= len;
	    y1 *= len;
	    y2 *= len;
	  }

	  out[0] = x0;
	  out[1] = y0;
	  out[2] = z0;
	  out[3] = 0;
	  out[4] = x1;
	  out[5] = y1;
	  out[6] = z1;
	  out[7] = 0;
	  out[8] = x2;
	  out[9] = y2;
	  out[10] = z2;
	  out[11] = 0;
	  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
	  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
	  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
	  out[15] = 1;

	  return out;
	}

	/**
	 * Generates a matrix that makes something look at something else.
	 *
	 * @param {mat4} out mat4 frustum matrix will be written into
	 * @param {vec3} eye Position of the viewer
	 * @param {vec3} center Point the viewer is looking at
	 * @param {vec3} up vec3 pointing up
	 * @returns {mat4} out
	 */
	function targetTo(out, eye, target, up) {
	  var eyex = eye[0],
	      eyey = eye[1],
	      eyez = eye[2],
	      upx = up[0],
	      upy = up[1],
	      upz = up[2];

	  var z0 = eyex - target[0],
	      z1 = eyey - target[1],
	      z2 = eyez - target[2];

	  var len = z0 * z0 + z1 * z1 + z2 * z2;
	  if (len > 0) {
	    len = 1 / Math.sqrt(len);
	    z0 *= len;
	    z1 *= len;
	    z2 *= len;
	  }

	  var x0 = upy * z2 - upz * z1,
	      x1 = upz * z0 - upx * z2,
	      x2 = upx * z1 - upy * z0;

	  out[0] = x0;
	  out[1] = x1;
	  out[2] = x2;
	  out[3] = 0;
	  out[4] = z1 * x2 - z2 * x1;
	  out[5] = z2 * x0 - z0 * x2;
	  out[6] = z0 * x1 - z1 * x0;
	  out[7] = 0;
	  out[8] = z0;
	  out[9] = z1;
	  out[10] = z2;
	  out[11] = 0;
	  out[12] = eyex;
	  out[13] = eyey;
	  out[14] = eyez;
	  out[15] = 1;
	  return out;
	};

	/**
	 * Returns a string representation of a mat4
	 *
	 * @param {mat4} a matrix to represent as a string
	 * @returns {String} string representation of the matrix
	 */
	function str(a) {
	  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' + a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
	}

	/**
	 * Returns Frobenius norm of a mat4
	 *
	 * @param {mat4} a the matrix to calculate Frobenius norm of
	 * @returns {Number} Frobenius norm
	 */
	function frob(a) {
	  return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2));
	}

	/**
	 * Adds two mat4's
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  out[2] = a[2] + b[2];
	  out[3] = a[3] + b[3];
	  out[4] = a[4] + b[4];
	  out[5] = a[5] + b[5];
	  out[6] = a[6] + b[6];
	  out[7] = a[7] + b[7];
	  out[8] = a[8] + b[8];
	  out[9] = a[9] + b[9];
	  out[10] = a[10] + b[10];
	  out[11] = a[11] + b[11];
	  out[12] = a[12] + b[12];
	  out[13] = a[13] + b[13];
	  out[14] = a[14] + b[14];
	  out[15] = a[15] + b[15];
	  return out;
	}

	/**
	 * Subtracts matrix b from matrix a
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @returns {mat4} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  out[2] = a[2] - b[2];
	  out[3] = a[3] - b[3];
	  out[4] = a[4] - b[4];
	  out[5] = a[5] - b[5];
	  out[6] = a[6] - b[6];
	  out[7] = a[7] - b[7];
	  out[8] = a[8] - b[8];
	  out[9] = a[9] - b[9];
	  out[10] = a[10] - b[10];
	  out[11] = a[11] - b[11];
	  out[12] = a[12] - b[12];
	  out[13] = a[13] - b[13];
	  out[14] = a[14] - b[14];
	  out[15] = a[15] - b[15];
	  return out;
	}

	/**
	 * Multiply each element of the matrix by a scalar.
	 *
	 * @param {mat4} out the receiving matrix
	 * @param {mat4} a the matrix to scale
	 * @param {Number} b amount to scale the matrix's elements by
	 * @returns {mat4} out
	 */
	function multiplyScalar(out, a, b) {
	  out[0] = a[0] * b;
	  out[1] = a[1] * b;
	  out[2] = a[2] * b;
	  out[3] = a[3] * b;
	  out[4] = a[4] * b;
	  out[5] = a[5] * b;
	  out[6] = a[6] * b;
	  out[7] = a[7] * b;
	  out[8] = a[8] * b;
	  out[9] = a[9] * b;
	  out[10] = a[10] * b;
	  out[11] = a[11] * b;
	  out[12] = a[12] * b;
	  out[13] = a[13] * b;
	  out[14] = a[14] * b;
	  out[15] = a[15] * b;
	  return out;
	}

	/**
	 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
	 *
	 * @param {mat4} out the receiving vector
	 * @param {mat4} a the first operand
	 * @param {mat4} b the second operand
	 * @param {Number} scale the amount to scale b's elements by before adding
	 * @returns {mat4} out
	 */
	function multiplyScalarAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  out[2] = a[2] + b[2] * scale;
	  out[3] = a[3] + b[3] * scale;
	  out[4] = a[4] + b[4] * scale;
	  out[5] = a[5] + b[5] * scale;
	  out[6] = a[6] + b[6] * scale;
	  out[7] = a[7] + b[7] * scale;
	  out[8] = a[8] + b[8] * scale;
	  out[9] = a[9] + b[9] * scale;
	  out[10] = a[10] + b[10] * scale;
	  out[11] = a[11] + b[11] * scale;
	  out[12] = a[12] + b[12] * scale;
	  out[13] = a[13] + b[13] * scale;
	  out[14] = a[14] + b[14] * scale;
	  out[15] = a[15] + b[15] * scale;
	  return out;
	}

	/**
	 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {mat4} a The first matrix.
	 * @param {mat4} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
	}

	/**
	 * Returns whether or not the matrices have approximately the same elements in the same position.
	 *
	 * @param {mat4} a The first matrix.
	 * @param {mat4} b The second matrix.
	 * @returns {Boolean} True if the matrices are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var a4 = a[4],
	      a5 = a[5],
	      a6 = a[6],
	      a7 = a[7];
	  var a8 = a[8],
	      a9 = a[9],
	      a10 = a[10],
	      a11 = a[11];
	  var a12 = a[12],
	      a13 = a[13],
	      a14 = a[14],
	      a15 = a[15];

	  var b0 = b[0],
	      b1 = b[1],
	      b2 = b[2],
	      b3 = b[3];
	  var b4 = b[4],
	      b5 = b[5],
	      b6 = b[6],
	      b7 = b[7];
	  var b8 = b[8],
	      b9 = b[9],
	      b10 = b[10],
	      b11 = b[11];
	  var b12 = b[12],
	      b13 = b[13],
	      b14 = b[14],
	      b15 = b[15];

	  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15));
	}

	/**
	 * Alias for {@link mat4.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Alias for {@link mat4.subtract}
	 * @function
	 */
	var sub = exports.sub = subtract;

	/***/ }),
	/* 8 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setAxes = exports.sqlerp = exports.rotationTo = exports.equals = exports.exactEquals = exports.normalize = exports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.lerp = exports.dot = exports.scale = exports.mul = exports.add = exports.set = exports.copy = exports.fromValues = exports.clone = undefined;
	exports.create = create;
	exports.identity = identity;
	exports.setAxisAngle = setAxisAngle;
	exports.getAxisAngle = getAxisAngle;
	exports.multiply = multiply;
	exports.rotateX = rotateX;
	exports.rotateY = rotateY;
	exports.rotateZ = rotateZ;
	exports.calculateW = calculateW;
	exports.slerp = slerp;
	exports.invert = invert;
	exports.conjugate = conjugate;
	exports.fromMat3 = fromMat3;
	exports.fromEuler = fromEuler;
	exports.str = str;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	var _mat = __webpack_require__(1);

	var mat3 = _interopRequireWildcard(_mat);

	var _vec = __webpack_require__(2);

	var vec3 = _interopRequireWildcard(_vec);

	var _vec2 = __webpack_require__(3);

	var vec4 = _interopRequireWildcard(_vec2);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * Quaternion
	 * @module quat
	 */

	/**
	 * Creates a new identity quat
	 *
	 * @returns {quat} a new quaternion
	 */
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

	function create() {
	  var out = new glMatrix.ARRAY_TYPE(4);
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Set a quat to the identity quaternion
	 *
	 * @param {quat} out the receiving quaternion
	 * @returns {quat} out
	 */
	function identity(out) {
	  out[0] = 0;
	  out[1] = 0;
	  out[2] = 0;
	  out[3] = 1;
	  return out;
	}

	/**
	 * Sets a quat from the given angle and rotation axis,
	 * then returns it.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {vec3} axis the axis around which to rotate
	 * @param {Number} rad the angle in radians
	 * @returns {quat} out
	 **/
	function setAxisAngle(out, axis, rad) {
	  rad = rad * 0.5;
	  var s = Math.sin(rad);
	  out[0] = s * axis[0];
	  out[1] = s * axis[1];
	  out[2] = s * axis[2];
	  out[3] = Math.cos(rad);
	  return out;
	}

	/**
	 * Gets the rotation axis and angle for a given
	 *  quaternion. If a quaternion is created with
	 *  setAxisAngle, this method will return the same
	 *  values as providied in the original parameter list
	 *  OR functionally equivalent values.
	 * Example: The quaternion formed by axis [0, 0, 1] and
	 *  angle -90 is the same as the quaternion formed by
	 *  [0, 0, 1] and 270. This method favors the latter.
	 * @param  {vec3} out_axis  Vector receiving the axis of rotation
	 * @param  {quat} q     Quaternion to be decomposed
	 * @return {Number}     Angle, in radians, of the rotation
	 */
	function getAxisAngle(out_axis, q) {
	  var rad = Math.acos(q[3]) * 2.0;
	  var s = Math.sin(rad / 2.0);
	  if (s != 0.0) {
	    out_axis[0] = q[0] / s;
	    out_axis[1] = q[1] / s;
	    out_axis[2] = q[2] / s;
	  } else {
	    // If s is zero, return any axis (no rotation - axis does not matter)
	    out_axis[0] = 1;
	    out_axis[1] = 0;
	    out_axis[2] = 0;
	  }
	  return rad;
	}

	/**
	 * Multiplies two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 */
	function multiply(out, a, b) {
	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bx = b[0],
	      by = b[1],
	      bz = b[2],
	      bw = b[3];

	  out[0] = ax * bw + aw * bx + ay * bz - az * by;
	  out[1] = ay * bw + aw * by + az * bx - ax * bz;
	  out[2] = az * bw + aw * bz + ax * by - ay * bx;
	  out[3] = aw * bw - ax * bx - ay * by - az * bz;
	  return out;
	}

	/**
	 * Rotates a quaternion by the given angle about the X axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	function rotateX(out, a, rad) {
	  rad *= 0.5;

	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bx = Math.sin(rad),
	      bw = Math.cos(rad);

	  out[0] = ax * bw + aw * bx;
	  out[1] = ay * bw + az * bx;
	  out[2] = az * bw - ay * bx;
	  out[3] = aw * bw - ax * bx;
	  return out;
	}

	/**
	 * Rotates a quaternion by the given angle about the Y axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	function rotateY(out, a, rad) {
	  rad *= 0.5;

	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var by = Math.sin(rad),
	      bw = Math.cos(rad);

	  out[0] = ax * bw - az * by;
	  out[1] = ay * bw + aw * by;
	  out[2] = az * bw + ax * by;
	  out[3] = aw * bw - ay * by;
	  return out;
	}

	/**
	 * Rotates a quaternion by the given angle about the Z axis
	 *
	 * @param {quat} out quat receiving operation result
	 * @param {quat} a quat to rotate
	 * @param {number} rad angle (in radians) to rotate
	 * @returns {quat} out
	 */
	function rotateZ(out, a, rad) {
	  rad *= 0.5;

	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bz = Math.sin(rad),
	      bw = Math.cos(rad);

	  out[0] = ax * bw + ay * bz;
	  out[1] = ay * bw - ax * bz;
	  out[2] = az * bw + aw * bz;
	  out[3] = aw * bw - az * bz;
	  return out;
	}

	/**
	 * Calculates the W component of a quat from the X, Y, and Z components.
	 * Assumes that quaternion is 1 unit in length.
	 * Any existing W component will be ignored.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate W component of
	 * @returns {quat} out
	 */
	function calculateW(out, a) {
	  var x = a[0],
	      y = a[1],
	      z = a[2];

	  out[0] = x;
	  out[1] = y;
	  out[2] = z;
	  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
	  return out;
	}

	/**
	 * Performs a spherical linear interpolation between two quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 */
	function slerp(out, a, b, t) {
	  // benchmarks:
	  //    http://jsperf.com/quaternion-slerp-implementations
	  var ax = a[0],
	      ay = a[1],
	      az = a[2],
	      aw = a[3];
	  var bx = b[0],
	      by = b[1],
	      bz = b[2],
	      bw = b[3];

	  var omega = void 0,
	      cosom = void 0,
	      sinom = void 0,
	      scale0 = void 0,
	      scale1 = void 0;

	  // calc cosine
	  cosom = ax * bx + ay * by + az * bz + aw * bw;
	  // adjust signs (if necessary)
	  if (cosom < 0.0) {
	    cosom = -cosom;
	    bx = -bx;
	    by = -by;
	    bz = -bz;
	    bw = -bw;
	  }
	  // calculate coefficients
	  if (1.0 - cosom > 0.000001) {
	    // standard case (slerp)
	    omega = Math.acos(cosom);
	    sinom = Math.sin(omega);
	    scale0 = Math.sin((1.0 - t) * omega) / sinom;
	    scale1 = Math.sin(t * omega) / sinom;
	  } else {
	    // "from" and "to" quaternions are very close
	    //  ... so we can do a linear interpolation
	    scale0 = 1.0 - t;
	    scale1 = t;
	  }
	  // calculate final values
	  out[0] = scale0 * ax + scale1 * bx;
	  out[1] = scale0 * ay + scale1 * by;
	  out[2] = scale0 * az + scale1 * bz;
	  out[3] = scale0 * aw + scale1 * bw;

	  return out;
	}

	/**
	 * Calculates the inverse of a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate inverse of
	 * @returns {quat} out
	 */
	function invert(out, a) {
	  var a0 = a[0],
	      a1 = a[1],
	      a2 = a[2],
	      a3 = a[3];
	  var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
	  var invDot = dot ? 1.0 / dot : 0;

	  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

	  out[0] = -a0 * invDot;
	  out[1] = -a1 * invDot;
	  out[2] = -a2 * invDot;
	  out[3] = a3 * invDot;
	  return out;
	}

	/**
	 * Calculates the conjugate of a quat
	 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quat to calculate conjugate of
	 * @returns {quat} out
	 */
	function conjugate(out, a) {
	  out[0] = -a[0];
	  out[1] = -a[1];
	  out[2] = -a[2];
	  out[3] = a[3];
	  return out;
	}

	/**
	 * Creates a quaternion from the given 3x3 rotation matrix.
	 *
	 * NOTE: The resultant quaternion is not normalized, so you should be sure
	 * to renormalize the quaternion yourself where necessary.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {mat3} m rotation matrix
	 * @returns {quat} out
	 * @function
	 */
	function fromMat3(out, m) {
	  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
	  // article "Quaternion Calculus and Fast Animation".
	  var fTrace = m[0] + m[4] + m[8];
	  var fRoot = void 0;

	  if (fTrace > 0.0) {
	    // |w| > 1/2, may as well choose w > 1/2
	    fRoot = Math.sqrt(fTrace + 1.0); // 2w
	    out[3] = 0.5 * fRoot;
	    fRoot = 0.5 / fRoot; // 1/(4w)
	    out[0] = (m[5] - m[7]) * fRoot;
	    out[1] = (m[6] - m[2]) * fRoot;
	    out[2] = (m[1] - m[3]) * fRoot;
	  } else {
	    // |w| <= 1/2
	    var i = 0;
	    if (m[4] > m[0]) i = 1;
	    if (m[8] > m[i * 3 + i]) i = 2;
	    var j = (i + 1) % 3;
	    var k = (i + 2) % 3;

	    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
	    out[i] = 0.5 * fRoot;
	    fRoot = 0.5 / fRoot;
	    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
	    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
	    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
	  }

	  return out;
	}

	/**
	 * Creates a quaternion from the given euler angle x, y, z.
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {x} Angle to rotate around X axis in degrees.
	 * @param {y} Angle to rotate around Y axis in degrees.
	 * @param {z} Angle to rotate around Z axis in degrees.
	 * @returns {quat} out
	 * @function
	 */
	function fromEuler(out, x, y, z) {
	  var halfToRad = 0.5 * Math.PI / 180.0;
	  x *= halfToRad;
	  y *= halfToRad;
	  z *= halfToRad;

	  var sx = Math.sin(x);
	  var cx = Math.cos(x);
	  var sy = Math.sin(y);
	  var cy = Math.cos(y);
	  var sz = Math.sin(z);
	  var cz = Math.cos(z);

	  out[0] = sx * cy * cz - cx * sy * sz;
	  out[1] = cx * sy * cz + sx * cy * sz;
	  out[2] = cx * cy * sz - sx * sy * cz;
	  out[3] = cx * cy * cz + sx * sy * sz;

	  return out;
	}

	/**
	 * Returns a string representation of a quatenion
	 *
	 * @param {quat} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str(a) {
	  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
	}

	/**
	 * Creates a new quat initialized with values from an existing quaternion
	 *
	 * @param {quat} a quaternion to clone
	 * @returns {quat} a new quaternion
	 * @function
	 */
	var clone = exports.clone = vec4.clone;

	/**
	 * Creates a new quat initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} a new quaternion
	 * @function
	 */
	var fromValues = exports.fromValues = vec4.fromValues;

	/**
	 * Copy the values from one quat to another
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the source quaternion
	 * @returns {quat} out
	 * @function
	 */
	var copy = exports.copy = vec4.copy;

	/**
	 * Set the components of a quat to the given values
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @param {Number} z Z component
	 * @param {Number} w W component
	 * @returns {quat} out
	 * @function
	 */
	var set = exports.set = vec4.set;

	/**
	 * Adds two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {quat} out
	 * @function
	 */
	var add = exports.add = vec4.add;

	/**
	 * Alias for {@link quat.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Scales a quat by a scalar number
	 *
	 * @param {quat} out the receiving vector
	 * @param {quat} a the vector to scale
	 * @param {Number} b amount to scale the vector by
	 * @returns {quat} out
	 * @function
	 */
	var scale = exports.scale = vec4.scale;

	/**
	 * Calculates the dot product of two quat's
	 *
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @returns {Number} dot product of a and b
	 * @function
	 */
	var dot = exports.dot = vec4.dot;

	/**
	 * Performs a linear interpolation between two quat's
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {Number} t interpolation amount between the two inputs
	 * @returns {quat} out
	 * @function
	 */
	var lerp = exports.lerp = vec4.lerp;

	/**
	 * Calculates the length of a quat
	 *
	 * @param {quat} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	var length = exports.length = vec4.length;

	/**
	 * Alias for {@link quat.length}
	 * @function
	 */
	var len = exports.len = length;

	/**
	 * Calculates the squared length of a quat
	 *
	 * @param {quat} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 * @function
	 */
	var squaredLength = exports.squaredLength = vec4.squaredLength;

	/**
	 * Alias for {@link quat.squaredLength}
	 * @function
	 */
	var sqrLen = exports.sqrLen = squaredLength;

	/**
	 * Normalize a quat
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a quaternion to normalize
	 * @returns {quat} out
	 * @function
	 */
	var normalize = exports.normalize = vec4.normalize;

	/**
	 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
	 *
	 * @param {quat} a The first quaternion.
	 * @param {quat} b The second quaternion.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	var exactEquals = exports.exactEquals = vec4.exactEquals;

	/**
	 * Returns whether or not the quaternions have approximately the same elements in the same position.
	 *
	 * @param {quat} a The first vector.
	 * @param {quat} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	var equals = exports.equals = vec4.equals;

	/**
	 * Sets a quaternion to represent the shortest rotation from one
	 * vector to another.
	 *
	 * Both vectors are assumed to be unit length.
	 *
	 * @param {quat} out the receiving quaternion.
	 * @param {vec3} a the initial vector
	 * @param {vec3} b the destination vector
	 * @returns {quat} out
	 */
	var rotationTo = exports.rotationTo = function () {
	  var tmpvec3 = vec3.create();
	  var xUnitVec3 = vec3.fromValues(1, 0, 0);
	  var yUnitVec3 = vec3.fromValues(0, 1, 0);

	  return function (out, a, b) {
	    var dot = vec3.dot(a, b);
	    if (dot < -0.999999) {
	      vec3.cross(tmpvec3, xUnitVec3, a);
	      if (vec3.len(tmpvec3) < 0.000001) vec3.cross(tmpvec3, yUnitVec3, a);
	      vec3.normalize(tmpvec3, tmpvec3);
	      setAxisAngle(out, tmpvec3, Math.PI);
	      return out;
	    } else if (dot > 0.999999) {
	      out[0] = 0;
	      out[1] = 0;
	      out[2] = 0;
	      out[3] = 1;
	      return out;
	    } else {
	      vec3.cross(tmpvec3, a, b);
	      out[0] = tmpvec3[0];
	      out[1] = tmpvec3[1];
	      out[2] = tmpvec3[2];
	      out[3] = 1 + dot;
	      return normalize(out, out);
	    }
	  };
	}();

	/**
	 * Performs a spherical linear interpolation with two control points
	 *
	 * @param {quat} out the receiving quaternion
	 * @param {quat} a the first operand
	 * @param {quat} b the second operand
	 * @param {quat} c the third operand
	 * @param {quat} d the fourth operand
	 * @param {Number} t interpolation amount
	 * @returns {quat} out
	 */
	var sqlerp = exports.sqlerp = function () {
	  var temp1 = create();
	  var temp2 = create();

	  return function (out, a, b, c, d, t) {
	    slerp(temp1, a, d, t);
	    slerp(temp2, b, c, t);
	    slerp(out, temp1, temp2, 2 * t * (1 - t));

	    return out;
	  };
	}();

	/**
	 * Sets the specified quaternion with values corresponding to the given
	 * axes. Each axis is a vec3 and is expected to be unit length and
	 * perpendicular to all other specified axes.
	 *
	 * @param {vec3} view  the vector representing the viewing direction
	 * @param {vec3} right the vector representing the local "right" direction
	 * @param {vec3} up    the vector representing the local "up" direction
	 * @returns {quat} out
	 */
	var setAxes = exports.setAxes = function () {
	  var matr = mat3.create();

	  return function (out, view, right, up) {
	    matr[0] = right[0];
	    matr[3] = right[1];
	    matr[6] = right[2];

	    matr[1] = up[0];
	    matr[4] = up[1];
	    matr[7] = up[2];

	    matr[2] = -view[0];
	    matr[5] = -view[1];
	    matr[8] = -view[2];

	    return normalize(out, fromMat3(out, matr));
	  };
	}();

	/***/ }),
	/* 9 */
	/***/ (function(module, exports, __webpack_require__) {

	"use strict";


	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.forEach = exports.sqrLen = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = exports.len = undefined;
	exports.create = create;
	exports.clone = clone;
	exports.fromValues = fromValues;
	exports.copy = copy;
	exports.set = set;
	exports.add = add;
	exports.subtract = subtract;
	exports.multiply = multiply;
	exports.divide = divide;
	exports.ceil = ceil;
	exports.floor = floor;
	exports.min = min;
	exports.max = max;
	exports.round = round;
	exports.scale = scale;
	exports.scaleAndAdd = scaleAndAdd;
	exports.distance = distance;
	exports.squaredDistance = squaredDistance;
	exports.length = length;
	exports.squaredLength = squaredLength;
	exports.negate = negate;
	exports.inverse = inverse;
	exports.normalize = normalize;
	exports.dot = dot;
	exports.cross = cross;
	exports.lerp = lerp;
	exports.random = random;
	exports.transformMat2 = transformMat2;
	exports.transformMat2d = transformMat2d;
	exports.transformMat3 = transformMat3;
	exports.transformMat4 = transformMat4;
	exports.str = str;
	exports.exactEquals = exactEquals;
	exports.equals = equals;

	var _common = __webpack_require__(0);

	var glMatrix = _interopRequireWildcard(_common);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	/**
	 * 2 Dimensional Vector
	 * @module vec2
	 */

	/**
	 * Creates a new, empty vec2
	 *
	 * @returns {vec2} a new 2D vector
	 */
	function create() {
	  var out = new glMatrix.ARRAY_TYPE(2);
	  out[0] = 0;
	  out[1] = 0;
	  return out;
	}

	/**
	 * Creates a new vec2 initialized with values from an existing vector
	 *
	 * @param {vec2} a vector to clone
	 * @returns {vec2} a new 2D vector
	 */
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

	function clone(a) {
	  var out = new glMatrix.ARRAY_TYPE(2);
	  out[0] = a[0];
	  out[1] = a[1];
	  return out;
	}

	/**
	 * Creates a new vec2 initialized with the given values
	 *
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} a new 2D vector
	 */
	function fromValues(x, y) {
	  var out = new glMatrix.ARRAY_TYPE(2);
	  out[0] = x;
	  out[1] = y;
	  return out;
	}

	/**
	 * Copy the values from one vec2 to another
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the source vector
	 * @returns {vec2} out
	 */
	function copy(out, a) {
	  out[0] = a[0];
	  out[1] = a[1];
	  return out;
	}

	/**
	 * Set the components of a vec2 to the given values
	 *
	 * @param {vec2} out the receiving vector
	 * @param {Number} x X component
	 * @param {Number} y Y component
	 * @returns {vec2} out
	 */
	function set(out, x, y) {
	  out[0] = x;
	  out[1] = y;
	  return out;
	}

	/**
	 * Adds two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function add(out, a, b) {
	  out[0] = a[0] + b[0];
	  out[1] = a[1] + b[1];
	  return out;
	}

	/**
	 * Subtracts vector b from vector a
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function subtract(out, a, b) {
	  out[0] = a[0] - b[0];
	  out[1] = a[1] - b[1];
	  return out;
	}

	/**
	 * Multiplies two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function multiply(out, a, b) {
	  out[0] = a[0] * b[0];
	  out[1] = a[1] * b[1];
	  return out;
	};

	/**
	 * Divides two vec2's
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {vec2} out
	 */
	function divide(out, a, b) {
	  out[0] = a[0] / b[0];
	  out[1] = a[1] / b[1];
	  return out;
	};

	/**
	 * Math.ceil the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to ceil
	 * @returns {vec2} out
	 */
	function ceil(out, a) {
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
	function floor(out, a) {
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
	function min(out, a, b) {
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
	function max(out, a, b) {
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
	function round(out, a) {
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
	function scale(out, a, b) {
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
	function scaleAndAdd(out, a, b, scale) {
	  out[0] = a[0] + b[0] * scale;
	  out[1] = a[1] + b[1] * scale;
	  return out;
	};

	/**
	 * Calculates the euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} distance between a and b
	 */
	function distance(a, b) {
	  var x = b[0] - a[0],
	      y = b[1] - a[1];
	  return Math.sqrt(x * x + y * y);
	};

	/**
	 * Calculates the squared euclidian distance between two vec2's
	 *
	 * @param {vec2} a the first operand
	 * @param {vec2} b the second operand
	 * @returns {Number} squared distance between a and b
	 */
	function squaredDistance(a, b) {
	  var x = b[0] - a[0],
	      y = b[1] - a[1];
	  return x * x + y * y;
	};

	/**
	 * Calculates the length of a vec2
	 *
	 * @param {vec2} a vector to calculate length of
	 * @returns {Number} length of a
	 */
	function length(a) {
	  var x = a[0],
	      y = a[1];
	  return Math.sqrt(x * x + y * y);
	};

	/**
	 * Calculates the squared length of a vec2
	 *
	 * @param {vec2} a vector to calculate squared length of
	 * @returns {Number} squared length of a
	 */
	function squaredLength(a) {
	  var x = a[0],
	      y = a[1];
	  return x * x + y * y;
	};

	/**
	 * Negates the components of a vec2
	 *
	 * @param {vec2} out the receiving vector
	 * @param {vec2} a vector to negate
	 * @returns {vec2} out
	 */
	function negate(out, a) {
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
	function inverse(out, a) {
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
	function normalize(out, a) {
	  var x = a[0],
	      y = a[1];
	  var len = x * x + y * y;
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
	function dot(a, b) {
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
	function cross(out, a, b) {
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
	function lerp(out, a, b, t) {
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
	function random(out, scale) {
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
	function transformMat2(out, a, m) {
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
	function transformMat2d(out, a, m) {
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
	function transformMat3(out, a, m) {
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
	function transformMat4(out, a, m) {
	  var x = a[0];
	  var y = a[1];
	  out[0] = m[0] * x + m[4] * y + m[12];
	  out[1] = m[1] * x + m[5] * y + m[13];
	  return out;
	}

	/**
	 * Returns a string representation of a vector
	 *
	 * @param {vec2} a vector to represent as a string
	 * @returns {String} string representation of the vector
	 */
	function str(a) {
	  return 'vec2(' + a[0] + ', ' + a[1] + ')';
	}

	/**
	 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function exactEquals(a, b) {
	  return a[0] === b[0] && a[1] === b[1];
	}

	/**
	 * Returns whether or not the vectors have approximately the same elements in the same position.
	 *
	 * @param {vec2} a The first vector.
	 * @param {vec2} b The second vector.
	 * @returns {Boolean} True if the vectors are equal, false otherwise.
	 */
	function equals(a, b) {
	  var a0 = a[0],
	      a1 = a[1];
	  var b0 = b[0],
	      b1 = b[1];
	  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1));
	}

	/**
	 * Alias for {@link vec2.length}
	 * @function
	 */
	var len = exports.len = length;

	/**
	 * Alias for {@link vec2.subtract}
	 * @function
	 */
	var sub = exports.sub = subtract;

	/**
	 * Alias for {@link vec2.multiply}
	 * @function
	 */
	var mul = exports.mul = multiply;

	/**
	 * Alias for {@link vec2.divide}
	 * @function
	 */
	var div = exports.div = divide;

	/**
	 * Alias for {@link vec2.distance}
	 * @function
	 */
	var dist = exports.dist = distance;

	/**
	 * Alias for {@link vec2.squaredDistance}
	 * @function
	 */
	var sqrDist = exports.sqrDist = squaredDistance;

	/**
	 * Alias for {@link vec2.squaredLength}
	 * @function
	 */
	var sqrLen = exports.sqrLen = squaredLength;

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
	var forEach = exports.forEach = function () {
	  var vec = create();

	  return function (a, stride, offset, count, fn, arg) {
	    var i = void 0,
	        l = void 0;
	    if (!stride) {
	      stride = 2;
	    }

	    if (!offset) {
	      offset = 0;
	    }

	    if (count) {
	      l = Math.min(count * stride + offset, a.length);
	    } else {
	      l = a.length;
	    }

	    for (i = offset; i < l; i += stride) {
	      vec[0] = a[i];vec[1] = a[i + 1];
	      fn(vec, vec, arg);
	      a[i] = vec[0];a[i + 1] = vec[1];
	    }

	    return a;
	  };
	}();

	/***/ })
	/******/ ]);
	});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Path = function () {
	    function Path(opt) {
	        _classCallCheck(this, Path);

	        this.ctx = opt.ctx;
	        this.radius = opt.radius;
	        this.pathCoord = opt.pathCoord;
	        this.points = [];

	        /**
	         * Add a point to path
	         */
	        this.addPoint = function (x, y) {
	            this.points.push([x, y]);
	        };

	        // Define path points
	        this.setPoints = function () {
	            for (var i = 0, len = this.pathCoord.length; i < len; i++) {
	                var coord = this.pathCoord[i];
	                this.addPoint(40 * coord[0] + 20, 40 * coord[1] + 20);
	            }
	        };
	    }

	    /**
	     * Render path
	     */


	    _createClass(Path, [{
	        key: 'draw',
	        value: function draw() {
	            var ctx = this.ctx;
	            ctx.save();

	            ctx.beginPath();
	            ctx.lineJoin = 'round';
	            ctx.strokeStyle = '#333';
	            ctx.lineWidth = this.radius * 2;
	            ctx.shadowBlur = 0;

	            for (var i = 0; i < this.points.length; i++) {
	                ctx.lineTo(this.points[i][0], this.points[i][1]);
	            }
	            ctx.stroke();

	            ctx.beginPath();
	            ctx.lineWidth = 1;
	            ctx.fillStyle = '#555';
	            ctx.arc(this.points[0][0], this.points[0][1], this.radius, 0.5 * Math.PI, 1.5 * Math.PI, false);
	            ctx.fill();

	            // Draw a line in the middle of the path
	            ctx.strokeStyle = '#111';
	            ctx.lineWidth = 1;
	            ctx.beginPath();
	            for (var _i = 0; _i < this.points.length; _i++) {
	                ctx.lineTo(this.points[_i][0], this.points[_i][1]);
	            }
	            // ctx.closePath();
	            ctx.stroke();

	            ctx.restore();
	        }
	    }]);

	    return Path;
	}();

	;

	exports.default = Path;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 用于发射圆形子弹的塔
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _CircleBullet = __webpack_require__(6);

	var _CircleBullet2 = _interopRequireDefault(_CircleBullet);

	var _glMatrix = __webpack_require__(3);

	var _utils = __webpack_require__(7);

	var _config = __webpack_require__(8);

	var _constant = __webpack_require__(9);

	var _id = __webpack_require__(10);

	var _id2 = _interopRequireDefault(_id);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BaseTower = function () {
	    function BaseTower(_ref) {
	        var ctx = _ref.ctx,
	            x = _ref.x,
	            y = _ref.y,
	            bullets = _ref.bullets,
	            selected = _ref.selected,
	            damage = _ref.damage,
	            radius = _ref.radius;

	        _classCallCheck(this, BaseTower);

	        this.x = x;
	        this.y = y;
	        this.ctx = ctx;
	        this.coordX = Math.floor((x - _constant.gridWidth / 2) / _constant.gridWidth);
	        this.coordY = Math.floor((y - _constant.gridHeight / 2) / _constant.gridHeight);
	        this.radius = radius || 12;
	        this.hue = 200;
	        this.bullets = bullets;
	        this.cost = _constant.towerCost.baseTower;
	        this.lastShootTime = new Date();
	        this.shootInterval = 500; // 发射间隔，单位ms
	        this.direction = 180; // 用度数表示的tower指向
	        this.bulletStartPosVec = _glMatrix.vec2.fromValues(0, 0);
	        this.directionVec = _glMatrix.vec2.create();
	        this.targetIndex = -1;
	        this.target = null;
	        this.targetId = -1;
	        this.range = 4 * _constant.gridWidth;
	        this.selected = selected || false;
	        this.damage = damage || 5;
	    }

	    _createClass(BaseTower, [{
	        key: 'step',
	        value: function step() {
	            // 将方向向量归一化
	            this.directionVec = _glMatrix.vec2.fromValues(Math.cos((0, _utils.toRadians)(this.direction)), Math.sin((0, _utils.toRadians)(this.direction)));
	            _glMatrix.vec2.normalize(this.directionVec, this.directionVec);

	            // bullet 出射位置
	            _glMatrix.vec2.scale(this.bulletStartPosVec, this.directionVec, this.radius * 2.5);

	            if (new Date() - this.lastShootTime >= this.shootInterval) {
	                this.shoot();
	                this.lastShootTime = new Date();
	            }
	        }
	    }, {
	        key: 'draw',
	        value: function draw() {
	            this.step();
	            var ctx = this.ctx;

	            ctx.save();
	            if (_config.config.renderShadow) {
	                ctx.shadowBlur = this.radius;
	                ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
	            }

	            // 在选中的情况下，画出其射程范围
	            if (this.selected) {
	                ctx.beginPath();
	                ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
	                ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
	                ctx.fill();
	            }

	            ctx.strokeStyle = 'hsl(' + this.hue + ',100%, 40%';
	            ctx.fillStyle = 'hsl(' + this.hue + ',100%, 40%';
	            ctx.lineWidth = Math.max(3, this.radius / 8);

	            ctx.beginPath();
	            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	            ctx.closePath();
	            // ctx.stroke();
	            ctx.fill();

	            ctx.beginPath();
	            ctx.moveTo(this.x, this.y);
	            ctx.lineTo(this.x + this.bulletStartPosVec[0], this.y + this.bulletStartPosVec[1]);
	            ctx.stroke();
	            ctx.closePath();

	            // this.direction = (this.direction + 0.6) % 360;

	            ctx.restore();
	        }
	    }, {
	        key: 'shoot',


	        // 发射子弹
	        value: function shoot() {
	            if (this.target) {
	                this.bullets.push(new _CircleBullet2.default({
	                    id: _id2.default.genId(),
	                    target: this.target,
	                    ctx: this.ctx,
	                    x: this.x + this.bulletStartPosVec[0],
	                    y: this.y + this.bulletStartPosVec[1],
	                    range: this.range,
	                    damage: this.damage
	                }));
	            }
	        }
	    }, {
	        key: 'findTarget',
	        value: function findTarget(enemies) {
	            // 先判断原有的target是否仍在范围内
	            if (this.target !== null) {
	                var prevTgt = enemies.getEle(this.target);
	                if (prevTgt) {
	                    if ((0, _utils.calcuteDistance)(prevTgt.x, prevTgt.y, this.x, this.y) < this.range) {
	                        return;
	                    }
	                }
	            }

	            // 去寻找一个新的target
	            this.targetIndex = -1;
	            this.targetId = -1;
	            this.target = null;

	            for (var i = 0, len = enemies.length; i < len; i++) {
	                var enemy = enemies[i];
	                if (Math.abs(enemy.x - this.x) + Math.abs(enemy.y - this.y) > this.range) {
	                    // 简化计算
	                    continue;
	                } else {
	                    if ((0, _utils.calcuteDistance)(enemy.x, enemy.y, this.x, this.y) < this.range) {
	                        if (this.target) {
	                            this.target.color = 0;
	                        }
	                        this.targetIndex = i;
	                        this.target = enemies[i];
	                        this.targetId = enemies[i].id;
	                        break;
	                    }
	                }
	            }

	            if (this.targetIndex !== -1) {
	                var target = enemies.getEleById(this.targetId);
	                if (target) {
	                    this.directionVec = _glMatrix.vec2.fromValues(target.x - this.x, target.y - this.y);
	                    this.direction = Math.atan2(target.y - this.y, target.x - this.x) * (180 / Math.PI);

	                    // target.color = 'red';
	                }
	                return target;
	            }
	        }
	    }]);

	    return BaseTower;
	}();

	exports.default = BaseTower;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _glMatrix = __webpack_require__(3);

	var _utils = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CircleBullet = function () {
	    function CircleBullet(_ref) {
	        var ctx = _ref.ctx,
	            x = _ref.x,
	            y = _ref.y,
	            target = _ref.target,
	            range = _ref.range,
	            damage = _ref.damage;

	        _classCallCheck(this, CircleBullet);

	        this.type = 'circle';
	        this.x = x;
	        this.y = y;
	        this.ctx = ctx;
	        this.target = target;
	        this.radius = 3;
	        this.speed = 8;
	        this.vx = 0;
	        this.vy = 0;
	        this.angle = 0;
	        this.hue = 200;
	        this.range = range;
	        this.damage = damage || 5;
	    }

	    _createClass(CircleBullet, [{
	        key: 'step',
	        value: function step(enemies) {
	            // 计算新位置

	            if (this.target) {
	                var target = enemies.getEleById(this.target.id);
	                if (target) {
	                    var curDis = (0, _utils.calcuteDistance)(target.x, target.y, this.x, this.y);
	                    if (curDis < this.range) {
	                        var dx = target.x - this.x;
	                        var dy = target.y - this.y;
	                        this.angle = Math.atan2(dy, dx);
	                    }
	                }
	            }
	            this.vx = Math.cos(this.angle) * this.speed;
	            this.vy = Math.sin(this.angle) * this.speed;

	            this.x += this.vx;
	            this.y += this.vy;
	        }
	    }, {
	        key: 'draw',
	        value: function draw(ctx, enemies) {
	            this.step(enemies);

	            // 绘图开始
	            ctx.save();
	            ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, 40%)';
	            ctx.beginPath();
	            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	            ctx.stroke();
	            ctx.restore();
	        }
	    }]);

	    return CircleBullet;
	}();

	exports.default = CircleBullet;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.toRadians = toRadians;
	exports.calcuteDistance = calcuteDistance;
	exports.isInside = isInside;

	var _glMatrix = __webpack_require__(3);

	function toRadians(angle) {
	    return angle * (Math.PI / 180);
	}

	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function (from, to) {
	    var rest = this.slice((to || from) + 1 || this.length);
	    this.length = from < 0 ? this.length + from : from;
	    return this.push.apply(this, rest);
	};

	// 根据id删除元素
	Array.prototype.removeById = function (id) {};

	Array.prototype.getEleById = function (id) {
	    var result = null;
	    this.forEach(function (ele, i) {
	        if (ele.id === id) {
	            result = ele;
	        }
	    });
	    return result;
	};

	Array.prototype.getEle = function (ele) {
	    for (var i = 0; i < this.length; i++) {
	        if (this[i] === ele) {
	            return ele;
	        }
	    }
	    return null;
	};

	function calcuteDistance(x1, y1, x2, y2) {
	    var result = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	    return result;
	}

	// Make sure v is smaller than high
	_glMatrix.vec2.limit = function (out, v, high) {
	    'use strict';

	    var x = v[0],
	        y = v[1];

	    var len = x * x + y * y;

	    if (len > high * high && len > 0) {
	        out[0] = x;
	        out[1] = y;
	        _glMatrix.vec2.normalize(out, out);
	        _glMatrix.vec2.scale(out, out, high);
	    }
	    return out;
	};

	function isInside(pos, rect) {
	    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
	}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var config = exports.config = {
	    renderShadow: false
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var gridWidth = exports.gridWidth = 40;
	var gridHeight = exports.gridHeight = gridWidth;
	var gridSize = exports.gridSize = 40;
	var gridNumX = exports.gridNumX = 20; // x轴方向上的格子数目
	var gridNumY = exports.gridNumY = 16; // y轴方向上的格子数目

	var towerCost = exports.towerCost = {
	    'baseTower': 200,
	    'bulletTower': 200,
	    'laserTower': 200
	};

	var towerDataURL = exports.towerDataURL = {
	    'base': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACmUlEQVRoQ+2XP2gTcRTHPy+pfwd1K9gugmAmJfWyuLhpB6GCCMVB1Em3Ts0FpdUhTSKCoy4KHXRRwU7azVHJRRQHKS4KUl11UIN4T661GqFJ7/dyp6XcTYG87/e97/d79/sjbJBHNogOMiHrLckskSyRlBzIXq2UjDXTZomYrUsJmCWSkrFm2uQTaTT3oTKKcgS0gMjgr+k+oiygzDOQf8Rk8Y156lWAyQlpvBwm/F4BPYfI1p5Dqn5DuIVsrlM+8D4JQckImWkdQ8I7iOxwGkr1M8Jp/NKcEy7xRFSFejCNyBSYT9IKTFE+WEUk+m16+kuk1jyByH1T506QEgLjVLx7Vi67kGprP/nwKcg2a/O/cfqV3MAhJosvLHx2IfXgITBmadoDM4fvHbdw2oRUXw2Sb3/o47voNqvygyEuehG302MTUgvOI9xw6hS3WLlAxbsZt3ylziik+QSRw67NYtbP43ujMWt/lwm15mVXECI+sMUZFw/wCd/bFa/0T1W0D5jXbtdmMevb+F7vk8EqROtRiDERy6sFE4jsjOmwY5ku4JcKjiDjsSKdPWRldtNeYlu1Gq0JVK+7uhar/p8uvzNBgRyvYw3mWqT5PVSKb11htkSiLvXgMXDUteEa9abXKuK0C1lOJTrgJbWftJFNe60XLbuQyIZG6yyqtxNJRThD2Zu1cvUnJOoaLd8i09YBlnCqV6iU3E8YHU37F7L0vTTHULmLsN1JkPIF0VP//6rbOXXj+W7C8BrC+JrfXnQjFJ1F8pcojyw6ie9SnEwineRXgxFCToKWgGFUhpb/1kVE3gHPyOUfWG+C3UQnLyQJew0cmRCDaalCskRStddAniViMC1VSJZIqvYayLNEDKalCskSSdVeA/lPe7ybM8uL3icAAAAASUVORK5CYII=',
	    'bullet': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACdElEQVRoQ+2YUU7jMBCG/8kJepPlBlskklfYEwAvm3KKLacofaLcILy2D7Q34CbLM6DMynFM02ylxGMPQsh+aSN5nPnmn7HHIXyTQd+EAwnkqymZFEmKKEUgpZZSYMXLJkXEoVMyVFHkie8nb3j7QagnAJ1Y3/mZkb0U9HunwRIVZM2LK0J2DuBiwNmKgOqMyodYUFFANryYAvQHoCnA4NY7szi3XZD9b57o4xfgLcC3Od1sQ4GCQVoV7tv0AUa2bwbWvZxRXxd0swqBCQJZ83JFwGVTAW20fZyxNmY0Kq0Kml372HfnikEOlZC+3tlZfUKUEYHYmsieQt3f23f1rE8lNSMCWfNyS8BPk1Bja2IY+mMr2OY0Ox2efzjDG2SfUjEhwlPMG2TDdxVA5qxQGW21POY0GzqLDt7vBWJO7He8/o2bUv14WJScSi/fvCa7ItdIqv/l9St62vByPj5H+EQzrXrnwq8zKquxvhkQ11GMtVGd19mIb3MqRwf5y4F0ouQNMpoa+IzUshVIgF9q+eTJ/kTXLHe3tmex+4CYufo19QnbrwW5qxh07rVve0Wr2Xt0D0Tzhrhd7/HDUNIFiwJrmka0TWNTlhHG/vaIXUHl1HdJkRfx2/iu235F7ixFIFopJkmpYBAL4666Iduxux3ioaDyyjelooD0lRl/bz8ED1EiGojdkhdTRja3t0Y3+i2c/SBkhv0o1DztCPVccrXtKyeukWMpYLdmuhjukPmRwVXoJ6CuD1FBugsblQjZhIHmkykBz4z6JUb0jwVRDURatFK7BCKNnJZdUkQrstJ1kyLSyGnZJUW0IitdNykijZyW3T96vecztfd3vwAAAABJRU5ErkJggg=='
	};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var globalId = function () {
	    function globalId() {
	        _classCallCheck(this, globalId);

	        this.value = [];
	    }

	    _createClass(globalId, [{
	        key: "genId",
	        value: function genId() {
	            if (this.getLength() === 0) {
	                this.value.push(0);
	                return 0;
	            } else {
	                var id = this.value[this.getLength() - 1] + 1;
	                this.value.push(id);
	                return id;
	            }
	        }
	    }, {
	        key: "getLength",
	        value: function getLength() {
	            return this.value.length;
	        }
	    }]);

	    return globalId;
	}();

	exports.default = new globalId();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _BaseTower2 = __webpack_require__(5);

	var _BaseTower3 = _interopRequireDefault(_BaseTower2);

	var _Bullet = __webpack_require__(12);

	var _Bullet2 = _interopRequireDefault(_Bullet);

	var _glMatrix = __webpack_require__(3);

	var _utils = __webpack_require__(7);

	var _config = __webpack_require__(8);

	var _constant = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BulletTower = function (_BaseTower) {
	    _inherits(BulletTower, _BaseTower);

	    function BulletTower(opt) {
	        _classCallCheck(this, BulletTower);

	        var ctx = opt.ctx,
	            x = opt.x,
	            y = opt.y,
	            bullets = opt.bullets,
	            selected = opt.selected,
	            damage = opt.damage;

	        var _this = _possibleConstructorReturn(this, (BulletTower.__proto__ || Object.getPrototypeOf(BulletTower)).call(this, opt));

	        _this.hue = 100;
	        _this.cost = _constant.towerCost.bulletTower;
	        _this.range = 3 * _constant.gridWidth;

	        _this.direction = opt.direction || 0; // 用度数表示的tower指向
	        _this.bulletStartPosVec = _glMatrix.vec2.fromValues(0, 0);
	        _this.directionVec = _glMatrix.vec2.create();
	        return _this;
	    }

	    _createClass(BulletTower, [{
	        key: 'draw',
	        value: function draw() {
	            var ctx = this.ctx;

	            // 将方向向量归一化
	            this.directionVec = _glMatrix.vec2.fromValues(Math.cos((0, _utils.toRadians)(this.direction)), Math.sin((0, _utils.toRadians)(this.direction)));
	            _glMatrix.vec2.normalize(this.directionVec, this.directionVec);

	            // bullet 出射位置

	            _glMatrix.vec2.scale(this.bulletStartPosVec, this.directionVec, 30);

	            ctx.save();
	            if (_config.config.renderShadow) {
	                ctx.shadowBlur = this.radius;
	                ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
	            }

	            // 在选中的情况下，画出其射程范围
	            if (this.selected) {
	                ctx.beginPath();
	                ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
	                ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
	                ctx.fill();
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

	            if (this.targetIndex !== -1 && new Date() - this.lastShootTime >= 500) {
	                this.shoot(ctx);
	                this.lastShootTime = new Date();
	            }

	            ctx.restore();
	        }
	    }, {
	        key: 'shoot',


	        // 发射子弹
	        value: function shoot(ctx) {
	            this.bullets.push(new _Bullet2.default({
	                ctx: ctx,
	                x: this.x + this.bulletStartPosVec[0],
	                y: this.y + this.bulletStartPosVec[1],
	                directionVec: this.directionVec
	            }));
	        }
	    }, {
	        key: 'findTarget',
	        value: function findTarget(enemies) {
	            _get(BulletTower.prototype.__proto__ || Object.getPrototypeOf(BulletTower.prototype), 'findTarget', this).call(this, enemies);
	        }
	    }]);

	    return BulletTower;
	}(_BaseTower3.default);

	exports.default = BulletTower;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _glMatrix = __webpack_require__(3);

	var _utils = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Bullet = function () {
	    function Bullet(_ref) {
	        var ctx = _ref.ctx,
	            x = _ref.x,
	            y = _ref.y,
	            directionVec = _ref.directionVec,
	            damage = _ref.damage;

	        _classCallCheck(this, Bullet);

	        this.type = 'line';
	        this.x = x;
	        this.y = y;
	        this.directionVec = directionVec;

	        // {vec2} this.start 表示起点位置的向量
	        this.start = _glMatrix.vec2.fromValues(x, y);

	        this.hue = 200;

	        // {vec2} this.velocity 表示bullet速度的向量
	        // 将表示方向的单位向量乘以速率，得到速度向量
	        this.velocity = _glMatrix.vec2.create();
	        _glMatrix.vec2.scale(this.velocity, directionVec, 2);

	        // bullet的长度
	        this.length = 10;
	        // 从bullet的起点指向终点的向量
	        this.bulletVec = _glMatrix.vec2.create();
	        _glMatrix.vec2.scale(this.bulletVec, directionVec, this.length);

	        // {vec2} this.end 表示终点位置的向量
	        this.end = _glMatrix.vec2.create();
	        this.end = _glMatrix.vec2.add(this.end, this.start, this.bulletVec);

	        this.damage = damage || 5;
	    }

	    _createClass(Bullet, [{
	        key: 'draw',
	        value: function draw(ctx) {
	            // bullet运动后的起点和终点位置
	            _glMatrix.vec2.add(this.start, this.start, this.velocity);
	            _glMatrix.vec2.add(this.end, this.end, this.velocity);

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

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseTower2 = __webpack_require__(5);

	var _BaseTower3 = _interopRequireDefault(_BaseTower2);

	var _Bullet = __webpack_require__(12);

	var _Bullet2 = _interopRequireDefault(_Bullet);

	var _glMatrix = __webpack_require__(3);

	var _utils = __webpack_require__(7);

	var _config = __webpack_require__(8);

	var _constant = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LaserTower = function (_BaseTower) {
	    _inherits(LaserTower, _BaseTower);

	    function LaserTower(opt) {
	        _classCallCheck(this, LaserTower);

	        var ctx = opt.ctx,
	            x = opt.x,
	            y = opt.y,
	            bullets = opt.bullets,
	            selected = opt.selected,
	            damage = opt.damage;

	        var _this = _possibleConstructorReturn(this, (LaserTower.__proto__ || Object.getPrototypeOf(LaserTower)).call(this, opt));

	        _this.hue = 250;
	        _this.cost = _constant.towerCost.laserTower;
	        _this.range = 4 * _constant.gridWidth;

	        _this.direction = opt.direction || 0; // 用度数表示的tower指向
	        _this.bulletStartPosVec = _glMatrix.vec2.fromValues(0, 0);
	        _this.directionVec = _glMatrix.vec2.create();
	        return _this;
	    }

	    _createClass(LaserTower, [{
	        key: 'draw',
	        value: function draw() {
	            this.step();
	            var ctx = this.ctx;

	            ctx.save();

	            if (_config.config.renderShadow) {
	                ctx.shadowBlur = this.radius;
	                ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
	            }

	            // 在选中的情况下，画出其射程范围
	            if (this.selected) {
	                ctx.beginPath();
	                ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
	                ctx.arc(this.x, this.y, this.range, 0, 2 * Math.PI);
	                ctx.fill();
	            }

	            ctx.strokeStyle = 'hsl(' + this.hue + ',100%, 80%';
	            ctx.fillStyle = 'hsl(' + this.hue + ',100%, 80%';
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

	            ctx.restore();
	        }
	    }]);

	    return LaserTower;
	}(_BaseTower3.default);

	exports.default = LaserTower;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constant = __webpack_require__(9);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Enemy = function () {
	    function Enemy(opt) {
	        _classCallCheck(this, Enemy);

	        this.id = opt.id;
	        this.ctx = opt.ctx;

	        // 用像素表示的当前位置
	        this.x = opt.x;
	        this.y = opt.y;

	        // 当前目标点waypoint的index
	        this.wp = 1;

	        // 速度在两个方向上的分量
	        this.vx = 0;
	        this.vy = 0;

	        this.speed = opt.speed || 2;

	        // 当前位置到目标点的距离
	        this.dx = 0;
	        this.dy = 0;
	        this.dist = 0;

	        // 需要绘制的半径大小
	        this.radius = opt.radius || 10;

	        // 标记是否需要转弯
	        this.angleFlag = 1;

	        this.color = opt.color || 0;
	        this.maxHealth = opt.health || 20;
	        this.health = this.maxHealth;

	        this.value = opt.value || 50;
	        this.damage = opt.damage || 5;
	    }

	    _createClass(Enemy, [{
	        key: 'step',
	        value: function step(_ref) {
	            var path = _ref.path;

	            var speed = this.speed;
	            var wp = path[this.wp];
	            this.dx = wp[0] * _constant.gridSize + _constant.gridSize * 0.5 - this.x;
	            this.dy = wp[1] * _constant.gridSize + _constant.gridSize * 0.5 - this.y;
	            this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

	            if (this.angleFlag) {
	                this.angle = Math.atan2(this.dy, this.dx);
	                this.angleFlag = 0;
	            }
	            this.vx = Math.cos(this.angle) * speed;
	            this.vy = Math.sin(this.angle) * speed;

	            if (Math.abs(this.dist) > speed) {
	                this.x += this.vx;
	                this.y += this.vy;
	            } else {
	                this.x = (wp[0] + 0.5) * _constant.gridSize;
	                this.y = (wp[1] + 0.5) * _constant.gridSize;
	                if (this.wp + 1 >= path.length) {
	                    // 到达终点
	                    console.log('reach destination');
	                    this.dead = true;
	                    this.reachDest = true;
	                } else {
	                    this.wp++;
	                    this.angleFlag = 1;
	                }
	            }
	        }
	    }, {
	        key: 'draw',
	        value: function draw() {
	            var ctx = this.ctx;
	            ctx.strokeStyle = this.color || '#eee';
	            ctx.lineWidth = 2;
	            ctx.beginPath();
	            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	            ctx.closePath();
	            ctx.stroke();

	            this.drawHealth();
	        }
	    }, {
	        key: 'drawHealth',
	        value: function drawHealth() {
	            var ctx = this.ctx;
	            ctx.beginPath();
	            ctx.moveTo(this.x - this.radius, this.y);
	            ctx.lineTo(this.x - this.radius + this.health / this.maxHealth * this.radius * 2, this.y);
	            ctx.stroke();
	        }
	    }]);

	    return Enemy;
	}();

	exports.default = Enemy;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constant = __webpack_require__(9);

	var _Path = __webpack_require__(4);

	var _Path2 = _interopRequireDefault(_Path);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Map = function () {
	    function Map(opt) {
	        _classCallCheck(this, Map);

	        this.ctx = opt.ctx;
	        this.newTowerCoord = opt.newTowerCoord || null;
	        this.pathCoord = opt.pathCoord;
	        this.WIDTH = opt.WIDTH;
	        this.HEIGHT = opt.HEIGHT;

	        this.coord = [];

	        for (var i = 0; i < _constant.gridNumX; i++) {
	            this.coord[i] = [];
	        }

	        // 初始状态下的塔
	        if (this.newTowerCoord) {
	            this.coord[this.newTowerCoord[0]][this.newTowerCoord[1]] = 'T';
	        }

	        // Create an instance of Path object
	        this.path = new _Path2.default({
	            ctx: this.ctx,
	            radius: _constant.gridWidth / 2,
	            pathCoord: this.pathCoord
	        });

	        // Add points to the path
	        this.path.setPoints();
	    }

	    _createClass(Map, [{
	        key: 'draw',
	        value: function draw(_ref) {
	            var towers = _ref.towers,
	                towerSelect = _ref.towerSelect,
	                towerSelectIndex = _ref.towerSelectIndex;

	            var ctx = this.ctx;
	            var WIDTH = this.WIDTH;
	            var HEIGHT = this.HEIGHT;

	            ctx.save();

	            // Clear canvas
	            ctx.fillStyle = '#fff';
	            ctx.fillRect(0, 0, WIDTH, HEIGHT);

	            ctx.strokeStyle = '#eee';
	            ctx.fillStyle = '#fff';
	            ctx.lineWidth = 1;
	            ctx.fillRect(0, 0, WIDTH, HEIGHT);
	            // 横纵数目相等
	            var size = 20;

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
	            // TODO: 这一部分移入game.js中
	            if (towerSelect) {
	                var coordX = towers[towerSelectIndex].coordX;
	                var coordY = towers[towerSelectIndex].coordY;
	                fillGrid(coordX, coordY, 'pink');
	            }

	            // 给一个格子上色
	            function fillGrid(x, y, color) {
	                ctx.fillStyle = color || '#666';
	                ctx.fillRect(x * _constant.gridWidth + 1, y * _constant.gridHeight + 1, _constant.gridWidth - 2, _constant.gridHeight - 2);
	            }

	            ctx.restore();

	            this.path.draw();
	        }
	    }]);

	    return Map;
	}();

	exports.default = Map;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Wave = function () {
	    function Wave() {
	        var _this = this;

	        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        _classCallCheck(this, Wave);

	        //
	        this.enemyInitCnt = opt.enemyInitCnt || {
	            a: 10,
	            b: 5,
	            c: 10
	        };

	        this.enemyCnt = {};
	        Object.keys(this.enemyInitCnt).forEach(function (key) {
	            _this.enemyCnt[key] = _this.enemyInitCnt[key];
	        });

	        this.enemyCfg = {
	            a: {
	                radius: 10,
	                speed: 2,
	                color: '#FFDDA0',
	                health: 20
	            },
	            b: {
	                radius: 8,
	                speed: 3,
	                color: '#0280B2',
	                health: 16
	            },
	            c: {
	                radius: 6,
	                speed: 4,
	                color: '#FFD387',
	                health: 12
	            }
	        };
	    }

	    _createClass(Wave, [{
	        key: 'waveFinish',
	        value: function waveFinish() {
	            var _this2 = this;

	            var keys = Object.keys(this.enemyCnt);
	            return keys.every(function (key) {
	                return _this2.enemyCnt[key] <= 0;
	            });
	        }
	    }, {
	        key: 'generateEnemy',
	        value: function generateEnemy() {
	            if (this.waveFinish()) {
	                return -1;
	            } else {
	                var keys = Object.keys(this.enemyCnt);
	                for (var i = 0; i < keys.length; i++) {
	                    var key = keys[i];
	                    if (this.enemyCnt[key] > 0) {
	                        this.enemyCnt[key]--;
	                        return this.enemyCfg[key];
	                    }
	                }
	            }
	        }
	    }]);

	    return Wave;
	}();

	exports.default = Wave;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseTower = __webpack_require__(5);

	var _BaseTower2 = _interopRequireDefault(_BaseTower);

	var _BulletTower = __webpack_require__(11);

	var _BulletTower2 = _interopRequireDefault(_BulletTower);

	var _LaserTower = __webpack_require__(13);

	var _LaserTower2 = _interopRequireDefault(_LaserTower);

	var _utils = __webpack_require__(7);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GRID_WIDTH = 60;
	var GRID_HEIGHT = 60;
	var GRID_NUM_X = 3;
	var GRID_NUM_Y = 2;
	var WIDTH = 230;
	var HEIGHT = 640;

	var GameControl = function () {
	    function GameControl(opt) {
	        _classCallCheck(this, GameControl);

	        this.option = Object.assign({
	            offsetX: 25,
	            offsetY: 25
	        }, opt);

	        var element = this.option.element;
	        this.game = opt.game;

	        element.width = WIDTH;
	        element.height = HEIGHT;

	        this.ctx = element.getContext('2d');
	        this.offsetX = this.option.offsetX;
	        this.offsetY = this.option.offsetY;

	        this.towerAreaRect = {
	            x: this.offsetX,
	            y: this.offsetY,
	            width: GRID_NUM_X * GRID_WIDTH,
	            height: GRID_NUM_Y * GRID_HEIGHT
	        };

	        this.pauseBtn = {
	            x: this.offsetX,
	            y: 400,
	            width: 100,
	            height: 40,
	            text: 'Pause',
	            status: ''
	        };

	        this.sellBtn = {
	            x: this.offsetX,
	            y: 470,
	            width: 100,
	            height: 40,
	            text: 'Sell',
	            status: ''
	        };

	        this.towerArea = new TowerArea({
	            ctx: this.ctx,
	            x: this.offsetX,
	            y: this.offsetY
	        });

	        this.bindEvent();
	    }

	    _createClass(GameControl, [{
	        key: 'draw',
	        value: function draw() {
	            var _this = this;

	            var ctx = this.ctx;
	            ctx.fillStyle = '#eee';
	            ctx.fillRect(0, 0, WIDTH, HEIGHT);
	            this.drawGrid();

	            if (this.game.mode !== 'ADD_TOWER') {
	                this.towerArea.selected = -1;
	            }
	            this.towerArea.draw();
	            this.drawText();
	            this.drawButton();

	            requestAnimationFrame(function () {
	                return _this.draw();
	            }, 100);
	        }
	    }, {
	        key: 'drawGrid',
	        value: function drawGrid() {
	            var ctx = this.ctx;
	            ctx.strokeStyle = '#000';
	            ctx.lineWidth = 3;
	            ctx.beginPath();
	            ctx.moveTo(0, 0);
	            ctx.lineTo(WIDTH, 0);
	            ctx.lineTo(WIDTH, HEIGHT);
	            ctx.lineTo(0, HEIGHT);
	            ctx.closePath();
	            ctx.stroke();
	        }
	    }, {
	        key: 'drawText',
	        value: function drawText() {
	            var ctx = this.ctx;
	            var game = this.game;
	            ctx.fillStyle = '#000';
	            ctx.font = '20px Arial';
	            ctx.fillText('\u7B2C' + (game.wave + 1) + '\u6CE2', this.offsetX, 200);
	            ctx.fillText('Life:' + game.life, this.offsetX, 250);
	            ctx.fillText('Score:' + game.score, this.offsetX, 300);
	            ctx.fillText('Money:' + game.money, this.offsetX, 350);
	        }
	    }, {
	        key: 'drawButton',
	        value: function drawButton() {
	            var ctx = this.ctx;

	            [this.pauseBtn, this.sellBtn].forEach(function (btn) {
	                if (btn.status === 'hover') {
	                    ctx.strokeStyle = 'red';
	                    ctx.fillStyle = 'red';
	                } else {
	                    ctx.strokeStyle = '#000';
	                    ctx.fillStyle = '#000';
	                }
	                ctx.strokeRect(btn.x, btn.y, btn.width, btn.height);
	                ctx.fillText(btn.text, btn.x + btn.width / 5, btn.y + btn.height / 1.6);
	            });
	        }

	        // 在游戏的控制区域绑定事件
	        // TODO: 简化判断事件对应元素的逻辑

	    }, {
	        key: 'bindEvent',
	        value: function bindEvent() {
	            var _this2 = this;

	            var $element = $(this.option.element);
	            var game = this.game;
	            var x = 0;
	            var y = 0;

	            $element.click(function (e) {
	                var $canvas = $(e.target);
	                var game = _this2.game;
	                var offset = $canvas.offset();
	                x = e.clientX - offset.left;
	                y = e.clientY - offset.top;

	                // 检查点击位置是否在 tower area 内
	                if ((0, _utils.isInside)({ x: x, y: y }, _this2.towerAreaRect)) {
	                    var xIdx = Math.floor((x - _this2.offsetX) / GRID_WIDTH);
	                    var yIdx = Math.floor((y - _this2.offsetY) / GRID_HEIGHT);

	                    // 点击了 BaseTower
	                    if (xIdx === 0 && yIdx === 0) {
	                        if (game.mode === 'ADD_TOWER') {
	                            if (game.addTowerType !== 'BASE') {
	                                game.addTowerType = 'BASE';
	                                _this2.towerArea.selected = [0, 0];
	                            } else {
	                                game.mode = '';
	                                game.addTowerType = '';
	                            }
	                        } else {
	                            game.mode = 'ADD_TOWER';
	                            game.addTowerType = 'BASE';
	                            _this2.towerArea.selected = [0, 0]; // 突出显示
	                        }
	                    } else if (xIdx === 1 && yIdx === 0) {
	                        // 点击了 BulletTower
	                        if (game.mode === 'ADD_TOWER' && game.addTowerType === 'BULLET') {
	                            game.mode = '';
	                            game.addTowerType = '';
	                        } else {
	                            game.mode = 'ADD_TOWER';
	                            game.addTowerType = 'BULLET';
	                            _this2.towerArea.selected = [1, 0];
	                        }
	                    } else if (xIdx === 2 && yIdx === 0) {
	                        // 点击了 LaserTower
	                        if (game.mode === 'ADD_TOWER' && game.addTowerType === 'LASER') {
	                            game.mode = '';
	                            game.addTowerType = '';
	                        } else {
	                            game.mode = 'ADD_TOWER';
	                            game.addTowerType = 'LASER';
	                            _this2.towerArea.selected = [2, 0];
	                        }
	                    } else {
	                        _this2.towerArea.selected = -1;
	                    }
	                } else {
	                    console.log('out');
	                }

	                if ((0, _utils.isInside)({ x: x, y: y }, _this2.pauseBtn)) {
	                    game.status = game.status === 'running' ? 'pause' : 'running';
	                    if (game.status === 'running') {
	                        game.draw();
	                    }
	                }

	                if ((0, _utils.isInside)({ x: x, y: y }, _this2.sellBtn)) {
	                    if (game.towerSelect === true) {
	                        console.log('you sell a tower');
	                        game.sellTower();
	                    } else {
	                        // console.log('do nothing');
	                    }
	                }
	            });

	            $element.mousemove(function (e) {
	                // e.stopPropagation()
	                var pauseBtn = _this2.pauseBtn;
	                var sellBtn = _this2.sellBtn;
	                var game = _this2.game;

	                var $canvas = $(e.target);
	                var offset = $canvas.offset();
	                x = e.clientX - offset.left;
	                y = e.clientY - offset.top;

	                // 鼠标hover在暂停按钮上
	                if ((0, _utils.isInside)({ x: x, y: y }, pauseBtn)) {
	                    pauseBtn.status = 'hover';
	                } else {
	                    pauseBtn.status = '';
	                }

	                if ((0, _utils.isInside)({ x: x, y: y }, sellBtn)) {
	                    sellBtn.status = 'hover';
	                } else {
	                    sellBtn.status = '';
	                }
	            });
	        }
	    }]);

	    return GameControl;
	}();

	exports.default = GameControl;

	var TowerArea = function () {
	    function TowerArea(opt) {
	        _classCallCheck(this, TowerArea);

	        this.ctx = opt.ctx;
	        this.selected = -1;
	        this.offsetX = opt.x;
	        this.offsetY = opt.y;

	        this.baseTower = new _BaseTower2.default({
	            x: this.offsetX + GRID_WIDTH / 2 + 10,
	            y: this.offsetY + GRID_HEIGHT / 2,
	            ctx: this.ctx,
	            radius: 12
	        });

	        this.bulletTower = new _BulletTower2.default({
	            x: this.offsetX + GRID_WIDTH * 1.5 + 10,
	            y: this.offsetY + GRID_HEIGHT / 2,
	            ctx: this.ctx,
	            direction: 180,
	            radius: 12
	        });

	        this.laserTower = new _LaserTower2.default({
	            x: this.offsetX + GRID_WIDTH * 2.5 + 10,
	            y: this.offsetY + GRID_HEIGHT / 2,
	            ctx: this.ctx,
	            direction: 90,
	            radius: 8
	        });
	    }

	    _createClass(TowerArea, [{
	        key: 'draw',
	        value: function draw() {
	            var ctx = this.ctx;
	            ctx.strokeStyle = '#000';
	            ctx.lineWidth = 1;
	            // 横线
	            ctx.beginPath();
	            for (var i = 0; i < GRID_NUM_Y + 1; i++) {
	                ctx.moveTo(this.offsetX, i * GRID_WIDTH + this.offsetY);
	                ctx.lineTo(this.offsetX + GRID_NUM_X * GRID_WIDTH, i * GRID_WIDTH + this.offsetY);
	            }
	            ctx.stroke();

	            // 纵线
	            ctx.beginPath();
	            for (var _i = 0; _i < GRID_NUM_X + 1; _i++) {
	                ctx.moveTo(_i * GRID_WIDTH + this.offsetX, this.offsetY);
	                ctx.lineTo(_i * GRID_WIDTH + this.offsetX, this.offsetY + GRID_NUM_Y * GRID_HEIGHT);
	            }
	            ctx.stroke();

	            if (this.selected !== -1) {
	                this.highlightTower(this.selected[0], this.selected[1]);
	            }
	            this.baseTower.draw(ctx);
	            this.bulletTower.draw(ctx);
	            this.laserTower.draw(ctx);
	        }

	        // 选中的tower突出显示

	    }, {
	        key: 'highlightTower',
	        value: function highlightTower(x, y) {
	            var ctx = this.ctx;
	            ctx.strokeStyle = 'pink';
	            ctx.lineWidth = 3;
	            ctx.beginPath();
	            ctx.moveTo(x * GRID_WIDTH + this.offsetX + 3, y * GRID_HEIGHT + this.offsetY + 3);
	            ctx.lineTo((x + 0.35) * GRID_WIDTH + this.offsetX + 3, y * GRID_HEIGHT + this.offsetY + 3);

	            ctx.moveTo((x + 0.65) * GRID_WIDTH + this.offsetX, y * GRID_HEIGHT + this.offsetY + 3);
	            ctx.lineTo((x + 1) * GRID_WIDTH + this.offsetX - 3, y * GRID_HEIGHT + this.offsetY + 3);
	            ctx.lineTo((x + 1) * GRID_WIDTH + this.offsetX - 3, (y + 0.35) * GRID_HEIGHT + this.offsetY);

	            ctx.moveTo((x + 1) * GRID_WIDTH + this.offsetX - 3, (y + 0.65) * GRID_HEIGHT + this.offsetY - 3);
	            ctx.lineTo((x + 1) * GRID_WIDTH + this.offsetX - 3, (y + 1) * GRID_HEIGHT + this.offsetY - 3);
	            ctx.lineTo((x + 0.65) * GRID_WIDTH + this.offsetX, (y + 1) * GRID_HEIGHT + this.offsetY - 3);

	            ctx.moveTo((x + 0.35) * GRID_WIDTH + this.offsetX, (y + 1) * GRID_HEIGHT + this.offsetY - 3);
	            ctx.lineTo(x * GRID_WIDTH + this.offsetX + 3, (y + 1) * GRID_HEIGHT + this.offsetY - 3);
	            ctx.lineTo(x * GRID_WIDTH + this.offsetX + 3, (y + 0.65) * GRID_HEIGHT + this.offsetY - 3);

	            ctx.moveTo(x * GRID_WIDTH + this.offsetX + 3, (y + 0.35) * GRID_HEIGHT + this.offsetY);
	            ctx.lineTo(x * GRID_WIDTH + this.offsetX + 3, y * GRID_HEIGHT + this.offsetY + 3);

	            ctx.closePath();
	            ctx.stroke();
	        }
	    }]);

	    return TowerArea;
	}();

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map