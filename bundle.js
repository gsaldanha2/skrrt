/******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Gregory on 6/24/17.
 */

var FadeAnimation = function FadeAnimation(camera, duration, reversed) {
    var _this = this;

    _classCallCheck(this, FadeAnimation);

    this._canvas = document.getElementById('canvas');
    this._context = this._canvas.getContext('2d');
    this._duration = duration;
    this._elapsedTime = 0;
    this._tileSize = 100;
    this._tileImage = document.getElementById('tileImg');

    this._lastTime = Date.now();

    this.reset = function (reversed) {
        if (reversed) {
            _this._reversed = true;
            _this._elapsedTime = _this._duration;
        } else {
            _this._reversed = false;
            _this._elapsedTime = 0;
        }
    };

    this._updateTime = function () {
        var currTime = Date.now();
        if (_this._reversed === false) _this._elapsedTime += currTime - _this._lastTime;else _this._elapsedTime -= currTime - _this._lastTime;
        _this._lastTime = currTime;
    };

    this.update = function () {
        if (_this.isFinished()) return;
        _this._updateTime();
        if (_this.isFinished() && _this._callback) _this._callback();
        for (var row = 0; row < Math.floor(camera.swidth() / _this._tileSize) + 1; row++) {
            for (var col = 0; col < Math.floor(camera.sheight() / _this._tileSize) + 1; col++) {
                if (row % 2 === 0 && col % 2 === 0 || row % 2 === 1 && col % 2 === 1) {
                    _this._context.globalAlpha = Math.max(Math.min(_this._elapsedTime / _this._duration, 1), 0);
                } else {
                    _this._context.globalAlpha = Math.max(Math.min((_this._elapsedTime - _this._duration / 3) / (_this._duration / 3), 1), 0);
                }
                _this._context.drawImage(_this._tileImage, row * _this._tileSize, col * _this._tileSize, _this._tileSize + 1, _this._tileSize + 1);
            }
        }
        _this._context.globalAlpha = 1;
    };

    this.isFinished = function () {
        return !reversed && _this._elapsedTime >= _this._duration || reversed && _this._elapsedTime <= 0;
    };

    this.onFinished = function (callback) {
        _this._callback = callback;
    };

    this.reset(reversed);
};

exports.default = FadeAnimation;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _connection = __webpack_require__(2);

var _connection2 = _interopRequireDefault(_connection);

var _game = __webpack_require__(6);

var _game2 = _interopRequireDefault(_game);

var _render = __webpack_require__(7);

var _render2 = _interopRequireDefault(_render);

var _menustate = __webpack_require__(4);

var _menustate2 = _interopRequireDefault(_menustate);

var _menufadeanimation = __webpack_require__(0);

var _menufadeanimation2 = _interopRequireDefault(_menufadeanimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by Gregory on 6/24/17.
                                                                                                                                                           */


var PlayState = function PlayState(stateManager, playerName) {
    var _this = this;

    _classCallCheck(this, PlayState);

    this.game = new _game2.default();
    this.renderer = new _render2.default(stateManager.camera);
    this._playerName = playerName;

    this._createJoinPacket = function (name) {
        var builder = new flatbuffers.Builder(128);
        var nameOff = builder.createString(name);

        buffers.JoinDataBuffer.startJoinDataBuffer(builder);
        buffers.JoinDataBuffer.addName(builder, nameOff);
        var joinBuf = buffers.JoinDataBuffer.endJoinDataBuffer(builder);

        buffers.MessageBuffer.startMessageBuffer(builder);
        buffers.MessageBuffer.addMessageType(builder, buffers.MessageUnion.JoinDataBuffer);
        buffers.MessageBuffer.addMessage(builder, joinBuf);
        builder.finish(buffers.MessageBuffer.endMessageBuffer(builder));
        return builder.asUint8Array();
    };

    this._rejectConnection = function () {
        alert("This server has reached the max limit of players");
        _this._onDeath();
    };

    this._handleRecieveMsg = function (msg) {
        var bytes = new Uint8Array(msg.data);
        var buf = new flatbuffers.ByteBuffer(bytes);
        var msgBuf = buffers.MessageBuffer.getRootAsMessageBuffer(buf);
        if (msgBuf.messageType() === buffers.MessageUnion.SnapshotBuffer) _this.game.handleRecieveSnapshot(msgBuf);else if (msgBuf.messageType() === buffers.MessageUnion.DeathBuffer) _this._onDeath(msgBuf.message(new buffers.DeathBuffer()));else if (msgBuf.messageType() === buffers.MessageUnion.InfoBuffer && msgBuf.message(new buffers.InfoBuffer()).msg() === 'reject') {
            _this._rejectConnection();
        }
    };

    this._onDeath = function (deathBuf) {
        clearInterval(_this._inputIntervalId);
        _this.game.cleanup();

        stateManager.lastScore = deathBuf.score();
        stateManager.lastLevel = deathBuf.level();

        //clear callbacks
        stateManager.connection.setConnectionCallback(function () {});
        stateManager.connection.setMessageCallback(function () {});
        stateManager.connection.setDisconnectionCallback(function () {});

        stateManager.animation = new _menufadeanimation2.default(stateManager.camera, 2000, false);
        stateManager.animation.onFinished(function () {
            return stateManager.state = new _menustate2.default(stateManager);
        });
    };

    this._setup = function () {
        stateManager.connection.send(_this._createJoinPacket(_this._playerName));
        _this._inputIntervalId = setInterval(function () {
            //start sending input packets
            stateManager.connection.send(_this.game.serializedInputPacket());
            _this.game.resetInputPacket();
        }, 1000 / 20);
        stateManager.connection.setDisconnectionCallback(function () {
            return alert('Uh oh! Disconnected from Server!');
        });
        stateManager.connection.setMessageCallback(_this._handleRecieveMsg);
    };

    this.update = function () {
        _this.game.updateEntities();
        if (_this.game.player !== null) {
            _this.renderer.centerCameraOnPlayer(_this.game.player);
            _this.renderer.render(_this.game.entities, _this.game.leaderboard, _this.game.myInfo, _this.game.player);
        }
    };

    this._setup();
};

exports.default = PlayState;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Gregory on 6/12/17.
 */

var Connection = function () {
    function Connection(serverURL) {
        var _this = this;

        _classCallCheck(this, Connection);

        this._socket = null;
        this.alias = '';

        this.start = function () {
            _this._socket = new WebSocket(serverURL);
            _this._socket.binaryType = "arraybuffer";
        };

        this.setConnectionCallback = function (callback) {
            _this._socket.onopen = callback;
        };

        this.setMessageCallback = function (callback) {
            _this._socket.onmessage = callback;
        };

        this.setDisconnectionCallback = function (callback) {
            _this._socket.onclose = callback;
        };

        this.send = function (data) {
            // if(this._socket.readyState === this._socket.CLOSED) return;
            _this._socket.send(data);
        };

        this.close = function () {
            _this._socket.close();
        };
    }

    _createClass(Connection, [{
        key: "readyState",
        get: function get() {
            return this._socket.readyState;
        }
    }]);

    return Connection;
}();

exports.default = Connection;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (root) {
  'use strict';

  function NumberAbbreviate() {
    var units;
    if (!(this instanceof NumberAbbreviate)) {
      // function usage: abbrev(n, decPlaces, units)
      var n = arguments[0];
      var decPlaces = arguments[1];
      units = arguments[2];
      var ab = new NumberAbbreviate(units);
      return ab.abbreviate(n, decPlaces);
    }
    // class usage: new NumberAbbreviate(units)
    units = arguments[0];
    this.units = units == null ? ['k', 'm', 'b', 't'] : units;
  }

  NumberAbbreviate.prototype._abbreviate = function (number, decPlaces) {
    decPlaces = Math.pow(10, decPlaces);

    for (var i = this.units.length - 1; i >= 0; i--) {

      var size = Math.pow(10, (i + 1) * 3);

      if (size <= number) {
        number = Math.round(number * decPlaces / size) / decPlaces;

        if (number === 1000 && i < this.units.length - 1) {
          number = 1;
          i++;
        }

        number += this.units[i];

        break;
      }
    }

    return number;
  };

  NumberAbbreviate.prototype.abbreviate = function (number, decPlaces) {
    var isNegative = number < 0;
    var abbreviatedNumber = this._abbreviate(Math.abs(number), decPlaces || 0);

    return isNegative ? '-' + abbreviatedNumber : abbreviatedNumber;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberAbbreviate;
  } else {
    root.NumberAbbreviate = NumberAbbreviate;
  }
})(undefined);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _menufadeanimation = __webpack_require__(0);

var _menufadeanimation2 = _interopRequireDefault(_menufadeanimation);

var _playstate = __webpack_require__(1);

var _playstate2 = _interopRequireDefault(_playstate);

var _numberAbbreviate = __webpack_require__(3);

var _numberAbbreviate2 = _interopRequireDefault(_numberAbbreviate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var numAbbr = new _numberAbbreviate2.default();

var MenuState = function MenuState(stateManager) {
    var _this = this;

    _classCallCheck(this, MenuState);

    this._canvas = document.getElementById('canvas');
    this._context = this._canvas.getContext('2d');
    this._tileImage = document.getElementById('tileImg');
    this._tileSize = 100;
    this._playButton = $('#playButton');

    this._scoreLabel = $('#scoreLabel');
    this._serverSelect = $('#serverSelect');

    this._bgImg = document.getElementById('bg');

    this._nickInput = $('#nickInput');

    this._servers = {
        // 'US-CA': 'ws://104.197.76.2:8080',
        'US-CA': 'ws://localhost:8080'
    };

    $('#loginArea').slideDown(1000);
    $('#infoArea').slideDown(1000);
    $('#tutorialArea').slideDown(1000);
    $('#leaderboard').slideUp();
    $('#slowButton').slideUp();
    this._btnClicked = false;

    this._showLastScore = function () {
        if (stateManager.lastScore === undefined || stateManager.lastLevel === undefined) {
            _this._scoreLabel.hide();
            return;
        }
        _this._scoreLabel.text("You got to Level " + stateManager.lastLevel + " - " + stateManager.lastScore + "XP");
        _this._scoreLabel.show();
    };

    this._connectToSelected = function () {
        stateManager.connect(_this._servers[_this._serverSelect.val()]);
        stateManager.connection.alias = _this._serverSelect.val();
        console.log(stateManager.connection.alias);
    };

    this._serverSelect.change(this._connectToSelected);
    $('#refreshBtn').on('click', this._connectToSelected);
    if (!stateManager.connection) this._connectToSelected();

    setTimeout(function () {
        return _this._nickInput.focus();
    }, 1000); // to prevent that wierd backup problem with sliding jquery panels
    this._nickInput.on('keypress', function (e) {
        if (e.keyCode === 13) _this._playButton.click();
    });

    this._playButton.click(function () {
        if (_this._btnClicked === true) return;
        if (stateManager.connection.readyState !== 1) {
            alert('Hmmm... could not connect to server - try a different one.');
            return;
        }
        _this._btnClicked = true;

        $('#loginArea').slideUp();
        $('#infoArea').slideUp();
        $('#tutorialArea').slideUp();
        $('#leaderboard').slideDown();
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $('#slowButton').slideDown();
        }
        stateManager.animation = new _menufadeanimation2.default(stateManager.camera, 1000, true);
        stateManager.state = new _playstate2.default(stateManager, _this._nickInput.val());
    });

    this._handleRecieveMsg = function (msg) {
        var bytes = new Uint8Array(msg.data);
        var buf = new flatbuffers.ByteBuffer(bytes);
        var msgBuf = buffers.MessageBuffer.getRootAsMessageBuffer(buf);
        if (msgBuf.messageType() === buffers.MessageUnion.ServerDataBuffer) {
            var dataBuf = msgBuf.message(new buffers.ServerDataBuffer());
            _this._serverSelect.find('option[value="' + stateManager.connection.alias + '"]').text(stateManager.connection.alias + ' - ' + dataBuf.playerCount() + ' active');
        }
    };
    this.update = function () {
        for (var row = 0; row < Math.floor(stateManager.camera.swidth() / _this._tileSize) + 1; row++) {
            for (var col = 0; col < Math.floor(stateManager.camera.sheight() / _this._tileSize) + 1; col++) {
                _this._context.drawImage(_this._tileImage, row * _this._tileSize, col * _this._tileSize, _this._tileSize + 1, _this._tileSize + 1);
            }
        }
    };

    this._hasConnected = function () {
        var builder = new flatbuffers.Builder(128);

        buffers.ServerDataBuffer.startServerDataBuffer(builder);
        var buf = buffers.ServerDataBuffer.endServerDataBuffer(builder);

        buffers.MessageBuffer.startMessageBuffer(builder);
        buffers.MessageBuffer.addMessageType(builder, buffers.MessageUnion.ServerDataBuffer);
        buffers.MessageBuffer.addMessage(builder, buf);
        builder.finish(buffers.MessageBuffer.endMessageBuffer(builder));
        stateManager.connection.send(builder.asUint8Array());
    };

    if (stateManager.connection.readyState === 1) this._hasConnected();else stateManager.connection.setConnectionCallback(this._hasConnected);
    stateManager.connection.setMessageCallback(this._handleRecieveMsg);
    this._showLastScore();
};

exports.default = MenuState;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _playstate = __webpack_require__(1);

var _playstate2 = _interopRequireDefault(_playstate);

var _connection = __webpack_require__(2);

var _connection2 = _interopRequireDefault(_connection);

var _menustate = __webpack_require__(4);

var _menustate2 = _interopRequireDefault(_menustate);

var _menufadeanimation = __webpack_require__(0);

var _menufadeanimation2 = _interopRequireDefault(_menufadeanimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profile = undefined;

window.onload = function () {

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var menuScale = 1;
    var menuWrapper = document.getElementById('menuWrapper');

    var stateManager = {
        state: null,
        animation: null,
        connection: null
    };
    stateManager.camera = {
        x: 0,
        y: 0
    };
    stateManager.camera.swidth = function () {
        return canvas.width / stateManager.camera.scale;
    };
    stateManager.camera.sheight = function () {
        return canvas.height / stateManager.camera.scale;
    };

    stateManager.connect = function (address) {
        if (stateManager.connection) stateManager.connection.close();
        stateManager.connection = new _connection2.default(address);
        stateManager.connection.start();
    };
    stateManager.animation = new _menufadeanimation2.default(stateManager.camera, 1000, false);
    stateManager.animation.onFinished(function () {
        return stateManager.state = new _menustate2.default(stateManager);
    });

    function tick() {
        context.clearRect(0, 0, stateManager.camera.swidth(), stateManager.camera.sheight());
        if (stateManager.state) stateManager.state.update();
        if (stateManager.animation) {
            stateManager.animation.update();
            if (stateManager.animation.isFinished()) stateManager.animation = null;
        }
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

    function updateCanvasSize() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        context.imageSmoothingEnabled = false;

        stateManager.camera.scale = Math.max(window.innerWidth * window.devicePixelRatio / 1680, window.innerHeight * window.devicePixelRatio / 945);
        context.setTransform(stateManager.camera.scale, 0, 0, stateManager.camera.scale, 0, 0);

        //scale menu
        menuScale = Math.min(window.innerWidth / 940, window.innerHeight / 782);
        scaleDiv(menuWrapper, menuScale);
    }

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    function scaleDiv(d, scale) {
        var s = 'translate(-50%, -0%) scale(' + scale + ')';
        d.style.transform = s;
        d.style['-o-transform'] = s;
        d.style['-webkit-transform'] = s;
        d.style['-moz-transform'] = s;
        d.style['-ms-transform'] = s;
    }

    updateCanvasSize();
    window.onresize = updateCanvasSize;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Gregory on 6/12/17.
 */

var LERP_MS = 100;

var Game = function () {
    function Game() {
        var _this = this;

        _classCallCheck(this, Game);

        this.entities = new Map();
        this.player = null;

        this._inputPacket = {
            laneChange: 0,
            slow: false
        };

        this._hammer = new Hammer.Manager(window);
        this._hammer.add(new Hammer.Swipe());

        this._turnmap = {
            //key = player rotation, val = [keyToTurnLeft, keyToTurnRight]
            0: [37, 39],
            90: [40, 38],
            180: [39, 37],
            270: [38, 40]
        };
        this._slowButton = $('#slowButton');

        this._setupInputForMobile = function () {
            _this._hammer.on('swipeleft', function (e) {
                return _this._handleKeyPress(37);
            });
            _this._hammer.on('swiperight', function () {
                return _this._handleKeyPress(39);
            });
            _this._hammer.on('swipeup', function () {
                return _this._handleKeyPress(38);
            });
            _this._hammer.on('swipedown', function () {
                return _this._handleKeyPress(40);
            });

            _this._slowButton.bind('touchstart', function () {
                return _this._slowButton.trigger('mousedown');
            }).bind('touchend', function () {
                return _this._slowButton.trigger('mouseup');
            }); //mobile support

            _this._slowButton.mousedown(function () {
                _this._inputPacket.slow = true;
                return false;
            });
            $(document).mouseup(function () {
                _this._inputPacket.slow = false;
                return false;
            });
        };

        this._setupInput = function () {
            window.onkeydown = function (e) {
                var key = e.keyCode ? e.keyCode : e.which;
                _this._handleKeyPress(key);
            };
            window.onkeyup = function (e) {
                var key = e.keyCode ? e.keyCode : e.which;
                if (key == 32) _this._inputPacket.slow = false;
            };
        };

        this._handleKeyPress = function (key) {
            if (_this.player === null) return;
            switch (key) {
                case _this._turnmap[_this.player.rotation][0]:
                    _this._inputPacket.laneChange = -1;
                    break;

                case _this._turnmap[_this.player.rotation][1]:
                    _this._inputPacket.laneChange = 1;
                    break;

                case 32:
                    //spacebar
                    _this._inputPacket.slow = true;
                    break;
            }
        };

        this._packetQueue = [];
        this._interpData = {
            startUpdate: null,
            endUpdate: null,
            renderTime: Date.now() - LERP_MS
        };

        this._preventPacketBackup = function () {
            _this._interpData.endUpdate = null;
            _this._packetQueue = [];
            console.log('flush');
        };

        this._setupStartUpdateVelocities = function () {
            _this.entities.clear();
            _this.player = _this._interpData.startUpdate.player;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _this._interpData.startUpdate.entities[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var entity = _step.value;

                    _this.entities.set(entity.id, entity);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = _this._interpData.endUpdate.entities[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var endEntity = _step2.value;

                    var _entity = _this.entities.get(endEntity.id);
                    if (_entity === undefined) continue;
                    _entity.dx = endEntity.x - _entity.x;
                    _entity.dy = endEntity.y - _entity.y;
                    _entity.startx = _entity.x;
                    _entity.starty = _entity.y;
                    if (_entity.id === _this.player.id) {
                        _entity.stats.gasLevelStart = _entity.stats.gasLevel;
                        _entity.stats.gasLevelDelta = endEntity.stats.gasLevel - _entity.stats.gasLevel;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        };

        this._loadStartEndPackets = function () {
            _this._interpData.renderTime = Date.now() - LERP_MS;
            if (_this._interpData.startUpdate === null && _this._packetQueue.length > 0 && _this._packetQueue[0].clientTimeMs <= _this._interpData.renderTime) {
                _this._interpData.startUpdate = _this._packetQueue.shift();
            }
            if (_this._interpData.startUpdate !== null && _this._interpData.endUpdate === null && _this._packetQueue.length > 0) {
                _this._interpData.endUpdate = _this._packetQueue.shift();
                _this._setupStartUpdateVelocities();
                _this.leaderboard = _this._interpData.startUpdate.leaderboard;
            }
        };

        this._interpolate = function () {
            var interpDuration = _this._interpData.endUpdate.serverTimeMs - _this._interpData.startUpdate.serverTimeMs;
            var ratio = (_this._interpData.renderTime - _this._interpData.startUpdate.clientTimeMs) / interpDuration;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = _this.entities.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var entity = _step3.value;

                    if (isNaN(entity.dx) || isNaN(entity.dy)) continue; //doesnt exist in endupdate
                    entity.x = entity.startx + entity.dx * ratio;
                    entity.y = entity.starty + entity.dy * ratio;
                    if (entity.id === _this.player.id) {
                        entity.stats.gasLevel = entity.stats.gasLevelStart + entity.stats.gasLevelDelta * ratio;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            if (ratio >= 1) {
                _this._interpData.startUpdate = _this._interpData.endUpdate;
                _this._interpData.endUpdate = null;
            }
        };

        this.updateEntities = function () {
            var startTime = Date.now();
            _this._loadStartEndPackets();

            if (_this._interpData.startUpdate === null) {
                return;
            }
            if (_this._interpData.endUpdate === null) {
                if (_this._packetQueue.length > 0) _this._preventPacketBackup();
                // else {} //TODO extrapolate from startupdate
            } else {
                _this._interpolate();
            }
            if (Date.now() - startTime > 50) console.log(Date.now() - startTime);
        };

        this.cleanup = function () {
            _this._hammer.destroy();
        };

        this.handleRecieveSnapshot = function (msgBuf) {
            _this._packetQueue.push(_this._createPacketFromSnapshotBuffer(msgBuf.message(new buffers.SnapshotBuffer())));
        };

        this._createPacketFromSnapshotBuffer = function (buffer) {
            var packet = { entities: [] };
            var playerid = buffer.player().id();
            for (var i = 0; i < buffer.entitiesLength(); i++) {
                var entity = _this._createObjectFromBuffer(buffer.entities(i));
                if (entity === null) continue;
                if (entity.id === playerid) packet.player = entity;
                packet.entities.push(entity);
            }
            packet.leaderboard = [];
            for (var _i = 0; _i < buffer.leaderboardLength(); _i++) {
                packet.leaderboard.push(buffer.leaderboard(_i));
            }
            packet.player.stats.gasLevel = buffer.gasLevel();
            packet.clientTimeMs = Date.now();
            packet.serverTimeMs = buffer.serverTimeMs().toFloat64();
            packet.myInfo = buffer.myInfo();
            return packet;
        };

        this._createObjectFromBuffer = function (entityBuffer) {
            var entity = null;
            switch (entityBuffer.entityType()) {
                case buffers.EntityUnion.PlayerBuffer:
                    entity = _this._createPlayerFromBuffer(entityBuffer.entity(new buffers.PlayerBuffer()));
                    break;
                case buffers.EntityUnion.GasCanBuffer:
                    entity = _this._createEntityFromBuffer(entityBuffer.entity(new buffers.GasCanBuffer()), buffers.EntityUnion.GasCanBuffer);
                    break;
                case buffers.EntityUnion.WreckageBuffer:
                    entity = _this._createEntityFromBuffer(entityBuffer.entity(new buffers.WreckageBuffer()), buffers.EntityUnion.WreckageBuffer);
                    break;
                case buffers.EntityUnion.LaunchpadBuffer:
                    entity = _this._createEntityFromBuffer(entityBuffer.entity(new buffers.LaunchpadBuffer()), buffers.EntityUnion.LaunchpadBuffer);
                    break;
            }
            return entity;
        };

        this._createPlayerFromBuffer = function (entityBuffer) {
            var player = _this._createEntityFromBuffer(entityBuffer, buffers.EntityUnion.PlayerBuffer);
            player.stats = {
                xp: entityBuffer.stats().xp(),
                level: entityBuffer.stats().level(),
                health: entityBuffer.stats().health(),
                hurtFlag: entityBuffer.stats().hurtFlag(),
                spawnProtected: entityBuffer.stats().spawnProtected()
            };
            player.name = entityBuffer.name();
            return player;
        };

        this._createEntityFromBuffer = function (buffer, type) {
            return {
                x: buffer.position().x(),
                y: buffer.position().y(),
                rotation: buffer.position().rotation(),
                id: buffer.id(),
                type: type
            };
        };

        this.serializedInputPacket = function () {
            var builder = new flatbuffers.Builder(128);
            buffers.InputPacketBuffer.startInputPacketBuffer(builder);
            buffers.InputPacketBuffer.addLaneChange(builder, _this._inputPacket.laneChange);
            buffers.InputPacketBuffer.addSlow(builder, _this._inputPacket.slow);
            var packetOffset = buffers.InputPacketBuffer.endInputPacketBuffer(builder);
            buffers.MessageBuffer.startMessageBuffer(builder);
            buffers.MessageBuffer.addMessageType(builder, buffers.MessageUnion.InputPacketBuffer);
            buffers.MessageBuffer.addMessage(builder, packetOffset);
            builder.finish(buffers.MessageBuffer.endMessageBuffer(builder));
            return builder.asUint8Array();
        };

        this.resetInputPacket = function () {
            _this._inputPacket.laneChange = 0;
            //dont reset slow down
        };

        //setup input
        this._setupInput();

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this._setupInputForMobile();
        }
    }

    _createClass(Game, [{
        key: 'myInfo',
        get: function get() {
            return this._interpData.startUpdate.myInfo;
        }
    }]);

    return Game;
}();

exports.default = Game;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _common = __webpack_require__(8);

var common = _interopRequireWildcard(_common);

var _numberAbbreviate = __webpack_require__(3);

var _numberAbbreviate2 = _interopRequireDefault(_numberAbbreviate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by Gregory on 6/12/17.
                                                                                                                                                           */

var SECTION_SIZE = 360;
var CHUNK_COUNT = 10;
var HP_BAR_LEN = 50;
var SMALL_HP_BAR_HEIGHT = 12;
var LARGE_BAR_HEIGHT = 16;

var MINIMAP_SIZE = 150;
var MINIMAP_PLAYER_SIZE = 6;
var MINIMAP_CHUNK_SIZE = MINIMAP_SIZE / CHUNK_COUNT;

var numAbbr = new _numberAbbreviate2.default();

function negmod(n, x) {
    return (n % x + x) % x;
}

function radians(n) {
    return n * Math.PI / 180;
}

function rtog(val, max) {
    var r = Math.floor(200 * (max - val) / max);
    var g = Math.floor(200 * val / max);
    return 'rgb(' + r + ', ' + g + ', 0)';
}

var Renderer = function Renderer(camera) {
    var _this = this;

    _classCallCheck(this, Renderer);

    this._canvas = document.getElementById('canvas');
    this._context = this._canvas.getContext('2d');
    this._player = undefined;

    this._imageStorage = {
        'playerSpritesheet': document.getElementById('playerSpritesheet'),
        'gascan': document.getElementById('gasCanImg'),
        'wreckage': document.getElementById('wreckageImg'),
        'launchpad': document.getElementById('launchpadImg'),
        'waterTile': document.getElementById('waterImg'),
        'road': document.getElementById('road'),
        'grass': document.getElementById('grass'),
        'intersection': document.getElementById('intersection')
    };

    this._leaderboardList = {
        1: $("#1"),
        2: $("#2"),
        3: $("#3"),
        4: $("#4"),
        5: $("#5"),
        6: $("#6"),
        7: $("#7"),
        8: $("#8"),
        9: $("#9"),
        10: $("#10"),
        11: $("#11")
    };

    this._imageForEntity = function (entity) {
        switch (entity.type) {
            case buffers.EntityUnion.PlayerBuffer:
                return _this._imageStorage['playerSpritesheet'];
            case buffers.EntityUnion.GasCanBuffer:
                return _this._imageStorage['gascan'];
            case buffers.EntityUnion.WreckageBuffer:
                return _this._imageStorage['wreckage'];
            case buffers.EntityUnion.LaunchpadBuffer:
                return _this._imageStorage['launchpad'];
        }
    };

    this._renderPlayerName = function (playerEntity) {
        _this._context.font = '10px arial';
        _this._context.textAlign = 'center';
        _this._context.fillStyle = '#fff';
        var yoffset = playerEntity.rotation === 180 || playerEntity.rotation === 0 ? 24 + 10 : 16 + 10;
        _this._context.fillText(playerEntity.name, 0, yoffset);
    };

    this._renderPlayerTail = function (playerEntity) {
        var gradient = _this._context.createLinearGradient(0, 0, 100 * Math.cos(radians(90)), 100 * Math.sin(radians(90)));
        if (playerEntity.id === _this._player.id) {
            gradient.addColorStop(0.00, "rgba(245, 252, 45, 0.6)");
        } else if (playerEntity.stats.level > _this._player.stats.level) {
            gradient.addColorStop(0.00, "rgba(255, 0, 0, 0.6)");
        } else if (playerEntity.stats.level === _this._player.stats.level) {
            gradient.addColorStop(0.00, "rgba(0, 0, 255, 0.6)");
        } else {
            gradient.addColorStop(0.00, "rgba(0, 255, 0, 0.6)");
        }
        gradient.addColorStop(0.8, "transparent");

        _this._context.lineWidth = 24;
        _this._context.beginPath();
        _this._context.moveTo(0, 0);
        _this._context.lineTo(200 * Math.cos(radians(90)), 100 * Math.sin(radians(90)));
        _this._context.strokeStyle = gradient;
        _this._context.stroke();
    };

    this._renderPlayerExtras = function (playerEntity) {
        _this._context.fillStyle = 'rgba(0, 255, 0, 0.3)';
        if (playerEntity.stats.spawnProtected) _this._context.fillRect(-16, -24, 32, 48);
        _this._context.fillStyle = 'rgba(255, 0, 0, 0.3)';
        if (playerEntity.stats.hurtFlag) _this._context.fillRect(-16, -24, 32, 48);
        //reverse rotation
        _this._context.rotate(playerEntity.rotation * Math.PI / 180);
        //render name
        if (playerEntity.stats.hurtFlag) _this._renderHPBar(playerEntity);
        _this._renderPlayerName(playerEntity);
    };

    this._renderPlayerOnMinimap = function (player) {
        var x = player.x / (CHUNK_COUNT * SECTION_SIZE * 3) * MINIMAP_SIZE;
        var y = player.y / (CHUNK_COUNT * SECTION_SIZE * 3) * MINIMAP_SIZE;
        _this._context.fillRect(x - MINIMAP_PLAYER_SIZE / 2, y - MINIMAP_PLAYER_SIZE / 2, MINIMAP_PLAYER_SIZE, MINIMAP_PLAYER_SIZE);
    };

    this._renderMinimap = function (entities, player) {
        _this._context.save();
        _this._context.translate(8, 8);
        _this._context.fillStyle = 'rgba(0,0,0,0.5)';
        _this._context.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
        _this._context.fillStyle = '#555';
        for (var i = 0; i < CHUNK_COUNT; i++) {
            for (var j = 0; j < CHUNK_COUNT; j++) {
                var laneWidth = MINIMAP_CHUNK_SIZE * 0.25;
                _this._context.fillRect(Math.floor(MINIMAP_CHUNK_SIZE * (i + 0.5) - laneWidth / 2), MINIMAP_CHUNK_SIZE * j, laneWidth, MINIMAP_CHUNK_SIZE + 1);
                _this._context.fillRect(MINIMAP_CHUNK_SIZE * i, Math.floor(MINIMAP_CHUNK_SIZE * (j + 0.5) - laneWidth / 2), MINIMAP_CHUNK_SIZE + 1, laneWidth);
            }
        }
        _this._context.fillStyle = '#ef6767';
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = entities.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var entity = _step.value;

                if (entity.type === buffers.EntityUnion.PlayerBuffer) _this._renderPlayerOnMinimap(entity);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        _this._context.fillStyle = '#4e7ce8';
        _this._renderPlayerOnMinimap(player);
        _this._context.restore();
    };

    this._renderEntity = function (entity) {
        var img = _this._imageForEntity(entity);
        _this._context.save();
        _this._context.translate(Math.floor(entity.x - camera.x), Math.floor(entity.y - camera.y));
        _this._context.rotate(-entity.rotation * Math.PI / 180);

        if (entity.type === buffers.EntityUnion.PlayerBuffer) {
            _this._renderPlayerTail(entity);
            _this._context.drawImage(img, (entity.stats.level - 1) * 32, 0, 32, 48, -16, -24, 32, 48);
            _this._renderPlayerExtras(entity);
        } else {
            _this._context.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        }
        _this._context.restore();
    };

    this._renderMapChunk = function (x, y, rotation) {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                _this._context.save();
                if ((row === 0 || row === 2) && (col === 0 || col === 2)) _this._context.drawImage(_this._imageStorage['grass'], x + col * SECTION_SIZE, y + row * SECTION_SIZE, SECTION_SIZE + 1, SECTION_SIZE + 1);else if (row === 1 && col === 1) {
                    _this._context.translate(x + col * SECTION_SIZE + SECTION_SIZE / 2, y + row * SECTION_SIZE + SECTION_SIZE / 2);
                    _this._context.rotate(rotation);
                    _this._context.drawImage(_this._imageStorage['intersection'], -SECTION_SIZE / 2, -SECTION_SIZE / 2, SECTION_SIZE + 1, SECTION_SIZE + 1);
                } else {
                    _this._context.translate(x + col * SECTION_SIZE + SECTION_SIZE / 2, y + row * SECTION_SIZE + SECTION_SIZE / 2);
                    if (row === 1) _this._context.rotate(90 * Math.PI / 180);
                    _this._context.drawImage(_this._imageStorage['road'], -SECTION_SIZE / 2, -SECTION_SIZE / 2, SECTION_SIZE + 1, SECTION_SIZE + 1);
                }
                _this._context.restore();
            }
        }
    };

    this._renderGasLevel = function (gasLevel) {
        var height = camera.sheight() * 0.5;
        _this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        _this._context.save();
        _this._context.translate(12, camera.sheight() / 2);
        _this._context.fillRect(0, -height / 2, LARGE_BAR_HEIGHT, height);
        var filledLength = Math.max(0, Math.min(gasLevel / 100, 1)) * height;
        _this._context.fillStyle = rtog(gasLevel, 100);
        _this._context.fillRect(0, height / 2 - filledLength, LARGE_BAR_HEIGHT, filledLength);

        _this._setSmallFontProperties(14);
        _this._context.fillStyle = 'white';
        _this._context.fillText('Gas', LARGE_BAR_HEIGHT / 2, height / 2 + 12);
        _this._context.restore();
    };

    this._renderHPBar = function (playerEntity) {
        _this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        var yoffset = playerEntity.rotation === 180 || playerEntity.rotation === 0 ? -24 - (SMALL_HP_BAR_HEIGHT + 1) : -16 - (SMALL_HP_BAR_HEIGHT + 1);
        _this._context.fillRect(-HP_BAR_LEN / 2, yoffset, HP_BAR_LEN, SMALL_HP_BAR_HEIGHT); //draw background bar
        _this._context.fillStyle = rtog(playerEntity.stats.health, common.maxHPForLevel(playerEntity.stats.level));
        var filledLength = playerEntity.stats.health / common.maxHPForLevel(playerEntity.stats.level);
        filledLength = Math.max(0, Math.min(filledLength, 1)) * HP_BAR_LEN;
        _this._context.fillRect(-HP_BAR_LEN / 2, yoffset, filledLength, SMALL_HP_BAR_HEIGHT);
    };

    this._drawOffmapTile = function (x, y, rotation) {
        _this._renderMapChunk(x, y, rotation);
        _this._context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        _this._context.fillRect(x, y, SECTION_SIZE * 3, SECTION_SIZE * 3);
    };

    this._renderLeaderboard = function (myInfo, leaderboard) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = leaderboard[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var leader = _step2.value;

                _this._leaderboardList[leader.rank()].text(leader.rank() + ": " + leader.name() + " - " + numAbbr.abbreviate(leader.score(), 2));
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        _this._leaderboardList[11].text(myInfo.rank() + ": " + myInfo.name() + " - " + numAbbr.abbreviate(myInfo.score(), 2));
    };

    this._renderMap = function (player) {
        var startx = -negmod(Math.floor(camera.x), SECTION_SIZE * 3);
        var starty = -negmod(Math.floor(camera.y), SECTION_SIZE * 3);

        for (var i = 0; i < Math.ceil(camera.sheight() / (SECTION_SIZE * 3)) + 1; i++) {
            for (var j = 0; j < Math.ceil(camera.swidth() / (SECTION_SIZE * 3)) + 1; j++) {
                var x = startx + j * SECTION_SIZE * 3;
                var y = starty + i * SECTION_SIZE * 3;
                if (x + camera.x < -1 || y + camera.y < -1 || x + camera.x + camera.swidth() / 2 > SECTION_SIZE * 3 * CHUNK_COUNT || y + camera.y + camera.sheight() / 2 > SECTION_SIZE * 3 * CHUNK_COUNT) {
                    _this._drawOffmapTile(x, y, -player.rotation * Math.PI / 180);
                    continue;
                }
                _this._renderMapChunk(x, y, -player.rotation * Math.PI / 180);
            }
        }
    };

    this._setSmallFontProperties = function (size) {
        if (!size) size = 12;
        _this._context.font = size + "px HelveticaNeue-CondensedBold";
        _this._context.textAlign = 'center';
        _this._context.textBaseline = 'middle';
    };

    this._renderXPBar = function (player) {
        _this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        _this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 32, camera.swidth() * 0.8, LARGE_BAR_HEIGHT);
        _this._context.fillStyle = 'rgb(26, 157, 204)'; //render xp in blue
        var filledLength = player.stats.xp / common.maxXPForLevel(player.stats.level);
        filledLength = Math.max(0, Math.min(filledLength, 1)) * camera.swidth() * 0.8;
        _this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 32, filledLength, LARGE_BAR_HEIGHT);

        _this._context.fillStyle = 'white';
        _this._setSmallFontProperties();
        _this._context.fillText(player.stats.xp + ' / ' + common.maxXPForLevel(player.stats.level) + ' XP', camera.swidth() * 0.5, camera.sheight() - 32 + LARGE_BAR_HEIGHT / 2);
    };

    this._renderLargeHPBar = function (player) {
        _this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
        _this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 52, camera.swidth() * 0.8, LARGE_BAR_HEIGHT);
        _this._context.fillStyle = rtog(player.stats.health, common.maxHPForLevel(player.stats.level));
        var filledLength = player.stats.health / common.maxHPForLevel(player.stats.level);
        filledLength = Math.max(0, Math.min(filledLength, 1)) * camera.swidth() * 0.8;
        _this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 52, filledLength, LARGE_BAR_HEIGHT);

        _this._context.fillStyle = 'white';
        _this._setSmallFontProperties();
        _this._context.fillText(player.stats.health + ' / ' + common.maxHPForLevel(player.stats.level) + ' HP', camera.swidth() * 0.5, camera.sheight() - 52 + LARGE_BAR_HEIGHT / 2);
    };

    this._renderEntities = function (entities) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = entities.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var entity = _step3.value;

                if (entity.type === buffers.EntityUnion.PlayerBuffer) continue;
                _this._renderEntity(entity);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = entities.values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var _entity = _step4.value;

                if (_entity.type !== buffers.EntityUnion.PlayerBuffer) continue;
                _this._renderEntity(_entity);
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }
    };

    this._renderGasWarning = function () {
        if (_this._player.stats.gasLevel < 30) {
            _this._setSmallFontProperties(16);
            _this._context.fillStyle = '#cc0000';
            _this._context.fillText('Running low on gas!', camera.swidth() / 2, camera.sheight() / 2 - 60);
        }
    };

    this._renderOOBWarning = function () {
        if (_this._player.x > SECTION_SIZE * 3 * CHUNK_COUNT || _this._player.y > SECTION_SIZE * 3 * CHUNK_COUNT || _this._player.x < 0 || _this._player.y < 0) {
            _this._setSmallFontProperties(16);
            _this._context.fillStyle = '#cc0000';
            _this._context.fillText('Out of Bounds! Return before you run out of gas!', camera.swidth() / 2, camera.sheight() / 2 - 100);
        }
    };

    this.render = function (entities, leaderboard, myInfo, player) {
        // const startTime = Date.now();
        _this._player = player;
        _this._renderMap(player);
        _this._renderEntities(entities);
        _this._renderXPBar(player);
        _this._renderLargeHPBar(player);
        _this._renderLeaderboard(myInfo, leaderboard);
        _this._renderMinimap(entities, player);
        _this._renderGasLevel(player.stats.gasLevel);
        _this._renderOOBWarning();
        _this._renderGasWarning();
        // console.log(Date.now() - startTime);
    };

    this.centerCameraOnPlayer = function (player) {
        camera.x = player.x - camera.swidth() / 2;
        camera.y = player.y - camera.sheight() / 2;
    };
};

exports.default = Renderer;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.maxHPForLevel = maxHPForLevel;
exports.maxXPForLevel = maxXPForLevel;
/**
 * Created by Gregory on 6/19/17.
 */

function maxHPForLevel(lvl) {
    return 10 * lvl + 20;
}

function maxXPForLevel(lvl) {
    return (Math.pow(2, lvl) - Math.pow(2, lvl - 1)) * 200;
}

/***/ })
/******/ ]);