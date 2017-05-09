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

	var _constant = __webpack_require__(10);

	var _BaseTower = __webpack_require__(6);

	var _BaseTower2 = _interopRequireDefault(_BaseTower);

	var _BulletTower = __webpack_require__(12);

	var _BulletTower2 = _interopRequireDefault(_BulletTower);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var game = new _Game2.default();

	// 添加塔的按钮，画出图形
	// Base tower
	var towerCanvas1 = document.getElementById('tower1');
	towerCanvas1.width = 50;
	towerCanvas1.height = 50;
	var ctx = towerCanvas1.getContext("2d");
	var showTower1 = new _BaseTower2.default({ ctx: ctx, x: 25, y: 25 });
	showTower1.draw();
	towerCanvas1.addEventListener('click', function () {
	    if (game.mode === 'ADD_TOWER') {
	        if (game.addTowerType !== 'BASE') {
	            game.addTowerType = 'BASE';
	        } else {
	            game.mode = '';
	            game.addTowerType = '';
	        }
	    } else {
	        game.mode = 'ADD_TOWER';
	        game.addTowerType = 'BASE';
	    }
	});
	// console.log(towerCanvas1.toDataURL());

	var tower1DataURL = towerCanvas1.toDataURL();

	// BULLET tower
	var towerCanvas2 = document.getElementById('tower2');
	towerCanvas2.width = 50;
	towerCanvas2.height = 50;
	var ctx2 = towerCanvas2.getContext("2d");
	towerCanvas2.addEventListener('click', function () {
	    if (game.mode === 'ADD_TOWER' && game.addTowerType === 'BULLET') {
	        game.mode = '';
	        game.addTowerType = '';
	    } else {
	        game.mode = 'ADD_TOWER';
	        game.addTowerType = 'BULLET';
	    }
	});
	var img2 = new Image();
	img2.src = _constant.towerDataURL.bullet;
	img2.onload = function () {
	    ctx2.drawImage(img2, 0, 0);
	};

	var tipText = document.getElementById('tip-text');
	towerCanvas2.onmouseover = function (e) {
	    tipText.innerHTML = '<p>This is tip text.</p>';

	    var left = e.clientX + "px";
	    var top = e.clientY + "px";
	    tipText.style.display = 'block';
	    tipText.style.left = left - 200;
	    tipText.style.top = top + 1200;
	};
	towerCanvas2.onmouseout = function (e) {
	    tipText.innerHTML = '';
	    tipText.style.display = 'none';
	};

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

	// 暂停功能
	var pauseButton = document.getElementById('pause');
	pauseButton.onclick = function () {
	    game.status = game.status === 'running' ? 'pause' : 'running';
	    if (game.status === 'running') {
	        game.draw();
	    }
	};

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

	var _BaseTower = __webpack_require__(6);

	var _BaseTower2 = _interopRequireDefault(_BaseTower);

	var _BulletTower = __webpack_require__(12);

	var _BulletTower2 = _interopRequireDefault(_BulletTower);

	var _Enemy = __webpack_require__(14);

	var _Enemy2 = _interopRequireDefault(_Enemy);

	var _Map = __webpack_require__(15);

	var _Map2 = _interopRequireDefault(_Map);

	var _utils = __webpack_require__(8);

	var _constant = __webpack_require__(10);

	var _id = __webpack_require__(11);

	var _id2 = _interopRequireDefault(_id);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WIDTH = 800;
	var HEIGHT = 640;
	var canvas = document.getElementById("drawing");
	var ctx = canvas.getContext("2d");

	var gameOverEle = document.getElementById('game-over');

	var Game = function () {
	    function Game() {
	        _classCallCheck(this, Game);

	        // Init
	        canvas.width = WIDTH;
	        canvas.height = HEIGHT;

	        this.genId = 0;

	        this.bullets = [];
	        this.towers = [];
	        this.enemies = [];

	        this.ctx = ctx;
	        this.money = 2000;
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
	        this.score = 0;

	        // 当前是否选中塔
	        this.towerSelect = false;
	        this.towerSelectIndex = -1;
	        this.towerSelectId = -1;

	        this.status = 'running';

	        this.draw();
	    }

	    // Specify what to draw


	    _createClass(Game, [{
	        key: 'draw',
	        value: function draw() {
	            var _this = this;

	            if (this.status === 'gameOver') {
	                gameOverEle.style.display = 'block';
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

	            // 生成enemy
	            // 总数小于50，且间隔 x ms以上
	            if (this.enemyCreatedCount < 50 && new Date() - this.lastCreatedEnemyTime > 500) {
	                var enemy = new _Enemy2.default({
	                    id: _id2.default.genId(),
	                    x: _constant.gridWidth / 2 + (Math.random() - 0.5) * 10,
	                    y: _constant.gridHeight / 2 + (Math.random() - 0.5) * 10,
	                    ctx: ctx
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

	            // 确定 bullet tower 的目标
	            for (var i = 0, len = this.towers.length; i < len; i++) {
	                var tower = this.towers[i];
	                tower.findTarget(this.enemies);
	                if (tower.target !== null) {
	                    var target = tower.target;
	                    // 调整其朝向
	                    tower.directionVec = _vec2.default.fromValues(target.x - tower.x, target.y - tower.y);

	                    tower.direction = Math.atan2(target.y - tower.y, target.x - tower.x) * (180 / Math.PI);
	                }
	            }

	            // 检查bullet是否与enemy相撞
	            this.detectImpact();

	            // 移除出界的bullet，画出剩下的bullet
	            for (var _i = 0; _i < this.bullets.length; _i++) {
	                var bullet = this.bullets[_i];
	                if (bullet.type === 'line') {
	                    // 直线子弹
	                    if (bullet.start[0] < 0 || bullet.start[1] < 0 || bullet.start[0] > WIDTH || bullet.start[1] > HEIGHT) {
	                        this.bullets.remove(_i);
	                        _i--;
	                    } else {
	                        bullet.draw(ctx, this.enemies);
	                    }
	                } else if (bullet.type === 'circle') {
	                    if (bullet.x < 0 || bullet.y < 0 || bullet.x > WIDTH || bullet.y > HEIGHT) {
	                        this.bullets.remove(_i);
	                        _i--;
	                    } else {
	                        bullet.draw(ctx, this.enemies);
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
	                        var normal = _vec2.default.create();
	                        var bVec = this.bullets[i].directionVec;
	                        var aDotB = 1;

	                        var aVec = _vec2.default.fromValues(this.enemies[j].x - this.bullets[i].start[0], this.enemies[j].y - this.bullets[i].start[1]);
	                        _vec2.default.multiply(aDotB, aVec, bVec);
	                        _vec2.default.scale(bVec, bVec, aDotB);
	                        _vec2.default.add(normal, this.bullets[i].start, bVec);

	                        distance = (0, _utils.calcuteDistance)(normal[0], normal[1], this.enemies[j].x, this.enemies[j].y);
	                    } else {
	                        distance = (0, _utils.calcuteDistance)(this.bullets[i].x, this.bullets[i].y, this.enemies[j].x, this.enemies[j].y);
	                    }

	                    if (distance <= this.enemies[j].radius + 2) {
	                        impact = true;
	                        this.enemies[j].health -= this.bullets[i].damage;
	                        if (this.enemies[j].health <= 0) {
	                            this.enemies.remove(j);j--;
	                            this.score += 100;
	                        }
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

	            var tower = null;
	            switch (towerType) {
	                case 'BASE':
	                    tower = new _BaseTower2.default({ ctx: ctx, x: x, y: y, bullets: this.bullets });
	                    break;
	                case 'BULLET':
	                    tower = new _BulletTower2.default({ ctx: ctx, x: x, y: y, bullets: this.bullets });
	                    break;
	                default:
	                    tower = new _BulletTower2.default({ ctx: ctx, x: x, y: y, bullets: this.bullets });
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
	            if (towerType === 'BASE') {
	                tower = new _BaseTower2.default({ ctx: ctx, x: x, y: y, bullets: this.bullets, selected: true });
	            } else if (towerType === 'BULLET') {
	                tower = new _BulletTower2.default({ ctx: ctx, x: x, y: y, bullets: this.bullets, selected: true });
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

	            document.getElementById('score').innerHTML = 'Score: ' + this.score;
	            document.getElementById('money').innerHTML = 'Money: ' + this.money;
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
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 用于发射圆形子弹的塔
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _CircleBullet = __webpack_require__(7);

	var _CircleBullet2 = _interopRequireDefault(_CircleBullet);

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _utils = __webpack_require__(8);

	var _config = __webpack_require__(9);

	var _constant = __webpack_require__(10);

	var _id = __webpack_require__(11);

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
	            damage = _ref.damage;

	        _classCallCheck(this, BaseTower);

	        this.x = x;
	        this.y = y;
	        this.ctx = ctx;
	        this.coordX = Math.floor((x - _constant.gridWidth / 2) / _constant.gridWidth);
	        this.coordY = Math.floor((y - _constant.gridHeight / 2) / _constant.gridHeight);
	        this.radius = 12;
	        this.hue = 200;
	        this.bullets = bullets;
	        this.cost = _constant.towerCost.baseTower;
	        this.lastShootTime = new Date();
	        this.shootInterval = 500; // 发射间隔，单位ms
	        this.direction = 180; // 用度数表示的tower指向
	        this.bulletStartPosVec = _vec2.default.fromValues(0, 0);
	        this.directionVec = _vec2.default.create();
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
	            this.directionVec = _vec2.default.fromValues(Math.cos((0, _utils.toRadians)(this.direction)), Math.sin((0, _utils.toRadians)(this.direction)));
	            _vec2.default.normalize(this.directionVec, this.directionVec);

	            // bullet 出射位置
	            _vec2.default.scale(this.bulletStartPosVec, this.directionVec, 30);

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
	                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
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
	                        if (this.target) this.target.color = 0;
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
	                    this.directionVec = _vec2.default.fromValues(target.x - this.x, target.y - this.y);
	                    this.direction = Math.atan2(target.y - this.y, target.x - this.x) * (180 / Math.PI);

	                    target.color = 'red';
	                }
	                return target;
	            }
	        }
	    }]);

	    return BaseTower;
	}();

	exports.default = BaseTower;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _utils = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Bullet1 = function () {
	    function Bullet1(_ref) {
	        var ctx = _ref.ctx,
	            x = _ref.x,
	            y = _ref.y,
	            target = _ref.target,
	            range = _ref.range,
	            damage = _ref.damage;

	        _classCallCheck(this, Bullet1);

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

	    _createClass(Bullet1, [{
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

	    return Bullet1;
	}();

	exports.default = Bullet1;

/***/ },
/* 8 */
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
/* 9 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var config = exports.config = {
	    renderShadow: false
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

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
	    'bulletTower': 200
	};

	var towerDataURL = exports.towerDataURL = {
	    'base': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACmUlEQVRoQ+2XP2gTcRTHPy+pfwd1K9gugmAmJfWyuLhpB6GCCMVB1Em3Ts0FpdUhTSKCoy4KHXRRwU7azVHJRRQHKS4KUl11UIN4T661GqFJ7/dyp6XcTYG87/e97/d79/sjbJBHNogOMiHrLckskSyRlBzIXq2UjDXTZomYrUsJmCWSkrFm2uQTaTT3oTKKcgS0gMjgr+k+oiygzDOQf8Rk8Y156lWAyQlpvBwm/F4BPYfI1p5Dqn5DuIVsrlM+8D4JQckImWkdQ8I7iOxwGkr1M8Jp/NKcEy7xRFSFejCNyBSYT9IKTFE+WEUk+m16+kuk1jyByH1T506QEgLjVLx7Vi67kGprP/nwKcg2a/O/cfqV3MAhJosvLHx2IfXgITBmadoDM4fvHbdw2oRUXw2Sb3/o47voNqvygyEuehG302MTUgvOI9xw6hS3WLlAxbsZt3ylziik+QSRw67NYtbP43ujMWt/lwm15mVXECI+sMUZFw/wCd/bFa/0T1W0D5jXbtdmMevb+F7vk8EqROtRiDERy6sFE4jsjOmwY5ku4JcKjiDjsSKdPWRldtNeYlu1Gq0JVK+7uhar/p8uvzNBgRyvYw3mWqT5PVSKb11htkSiLvXgMXDUteEa9abXKuK0C1lOJTrgJbWftJFNe60XLbuQyIZG6yyqtxNJRThD2Zu1cvUnJOoaLd8i09YBlnCqV6iU3E8YHU37F7L0vTTHULmLsN1JkPIF0VP//6rbOXXj+W7C8BrC+JrfXnQjFJ1F8pcojyw6ie9SnEwineRXgxFCToKWgGFUhpb/1kVE3gHPyOUfWG+C3UQnLyQJew0cmRCDaalCskRStddAniViMC1VSJZIqvYayLNEDKalCskSSdVeA/lPe7ybM8uL3icAAAAASUVORK5CYII=',
	    'bullet': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACdElEQVRoQ+2YUU7jMBCG/8kJepPlBlskklfYEwAvm3KKLacofaLcILy2D7Q34CbLM6DMynFM02ylxGMPQsh+aSN5nPnmn7HHIXyTQd+EAwnkqymZFEmKKEUgpZZSYMXLJkXEoVMyVFHkie8nb3j7QagnAJ1Y3/mZkb0U9HunwRIVZM2LK0J2DuBiwNmKgOqMyodYUFFANryYAvQHoCnA4NY7szi3XZD9b57o4xfgLcC3Od1sQ4GCQVoV7tv0AUa2bwbWvZxRXxd0swqBCQJZ83JFwGVTAW20fZyxNmY0Kq0Kml372HfnikEOlZC+3tlZfUKUEYHYmsieQt3f23f1rE8lNSMCWfNyS8BPk1Bja2IY+mMr2OY0Ox2efzjDG2SfUjEhwlPMG2TDdxVA5qxQGW21POY0GzqLDt7vBWJO7He8/o2bUv14WJScSi/fvCa7ItdIqv/l9St62vByPj5H+EQzrXrnwq8zKquxvhkQ11GMtVGd19mIb3MqRwf5y4F0ouQNMpoa+IzUshVIgF9q+eTJ/kTXLHe3tmex+4CYufo19QnbrwW5qxh07rVve0Wr2Xt0D0Tzhrhd7/HDUNIFiwJrmka0TWNTlhHG/vaIXUHl1HdJkRfx2/iu235F7ixFIFopJkmpYBAL4666Iduxux3ioaDyyjelooD0lRl/bz8ED1EiGojdkhdTRja3t0Y3+i2c/SBkhv0o1DztCPVccrXtKyeukWMpYLdmuhjukPmRwVXoJ6CuD1FBugsblQjZhIHmkykBz4z6JUb0jwVRDURatFK7BCKNnJZdUkQrstJ1kyLSyGnZJUW0IitdNykijZyW3T96vecztfd3vwAAAABJRU5ErkJggg=='
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _BaseTower2 = __webpack_require__(6);

	var _BaseTower3 = _interopRequireDefault(_BaseTower2);

	var _Bullet = __webpack_require__(13);

	var _Bullet2 = _interopRequireDefault(_Bullet);

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _utils = __webpack_require__(8);

	var _config = __webpack_require__(9);

	var _constant = __webpack_require__(10);

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

	        _this.direction = 0; // 用度数表示的tower指向
	        _this.bulletStartPosVec = _vec2.default.fromValues(0, 0);
	        _this.directionVec = _vec2.default.create();
	        return _this;
	    }

	    _createClass(BulletTower, [{
	        key: 'draw',
	        value: function draw() {
	            var ctx = this.ctx;

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

	            // 在选中的情况下，画出其射程范围
	            if (this.selected) {
	                ctx.beginPath();
	                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
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

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	        value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _vec = __webpack_require__(3);

	var _vec2 = _interopRequireDefault(_vec);

	var _utils = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Bullet = function () {
	        function Bullet(_ref) {
	                var ctx = _ref.ctx,
	                    x = _ref.x,
	                    y = _ref.y,
	                    directionVec = _ref.directionVec;

	                _classCallCheck(this, Bullet);

	                this.type = 'line';
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constant = __webpack_require__(10);

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

	        this.speed = 2;

	        // 当前位置到目标点的距离
	        this.dx = 0;
	        this.dy = 0;
	        this.dist = 0;

	        // 需要绘制的半径大小
	        this.radius = 10;

	        // 标记是否需要转弯
	        this.angleFlag = 1;

	        this.color = 0;
	        this.health = 20;
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
	        }
	    }]);

	    return Enemy;
	}();

	exports.default = Enemy;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	        value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _constant = __webpack_require__(10);

	var _Path = __webpack_require__(5);

	var _Path2 = _interopRequireDefault(_Path);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Map = function () {
	        function Map(opt) {
	                _classCallCheck(this, Map);

	                this.ctx = opt.ctx;
	                this.newTowerCoord = opt.newTowerCoord || null;
	                this.pathCoord = opt.pathCoord;
	                this.WIDTH = opt.WIDTH, this.HEIGHT = opt.HEIGHT, this.coord = [];

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
	                                ctx.fillStyle = color || "#666";
	                                ctx.fillRect(x * _constant.gridWidth + 1, y * _constant.gridHeight + 1, _constant.gridWidth - 2, _constant.gridHeight - 2);
	                        }

	                        ctx.restore();

	                        this.path.draw();
	                }
	        }]);

	        return Map;
	}();

	exports.default = Map;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map