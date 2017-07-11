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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by Gregory on 6/24/17.
 */

class FadeAnimation {

    constructor(duration, reversed) {
        this._canvas = document.getElementById('canvas');
        this._context = this._canvas.getContext('2d');
        this._duration = duration;
        this._elapsedTime = 0;
        this._tileSize = 100;
        this._tileImage = document.getElementById('tileImg');

        this._lastTime = Date.now();

        this.reset = (reversed) => {
            if(reversed) {
                this._reversed = true;
                this._elapsedTime = this._duration;
            } else {
                this._reversed = false;
                this._elapsedTime = 0;
            }
        };

        this._updateTime = () => {
            let currTime = Date.now();
            if(this._reversed === false) this._elapsedTime += currTime - this._lastTime;
            else this._elapsedTime -= currTime - this._lastTime;
            this._lastTime = currTime;
        };

        this.update = () => {
            if(this.isFinished()) return;
            this._updateTime();
            if(this.isFinished() && this._callback) this._callback();
            for(let row = 0; row < Math.floor(this._canvas.width / this._tileSize) + 1; row++) {
                for (let col = 0; col < Math.floor(this._canvas.height / this._tileSize) + 1; col++) {
                    if((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
                        this._context.globalAlpha = Math.max(Math.min(this._elapsedTime / this._duration, 1), 0);
                    } else {
                        this._context.globalAlpha = Math.max(Math.min((this._elapsedTime - this._duration / 3) / (this._duration / 3), 1), 0);
                    }
                    this._context.drawImage(this._tileImage, row * this._tileSize, col * this._tileSize, this._tileSize, this._tileSize);
                }
            }
            this._context.globalAlpha = 1;
        };

        this.isFinished = () => {
            return this._elapsedTime >= this._duration;
        };

        this.onFinished = (callback) => {
            this._callback = callback;
        };

        this.reset(reversed);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = FadeAnimation;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__menufadeanimation__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__playstate__ = __webpack_require__(2);



class MenuState {

    constructor(stateManager) {

        this._canvas = document.getElementById('canvas');
        this._context = this._canvas.getContext('2d');
        this._tileImage = document.getElementById('tileImg');
        this._scale = 1;
        this._tileSize = 100;
        this._playButton = $('#playButton');

        $('#loginArea').slideDown(1000);
        $('#leaderboard').slideUp();
        this._btnClicked = false;

        this._playButton.click(() => {
            if(this._btnClicked === true) return;
            this._btnClicked = true;
            $('#loginArea').slideUp();
            $('#leaderboard').slideDown();
            stateManager.state = new __WEBPACK_IMPORTED_MODULE_1__playstate__["a" /* default */](stateManager, $('#nickInput').val()); //TODO wait for play state to connect before loading next state
            stateManager.animation = new __WEBPACK_IMPORTED_MODULE_0__menufadeanimation__["a" /* default */](1000, true);
        });

        this.update = () => {
            for(let row = 0; row < Math.floor(this._canvas.width / this._tileSize) + 1; row++) {
                for (let col = 0; col < Math.floor(this._canvas.height / this._tileSize) + 1; col++) {
                    this._context.drawImage(this._tileImage, row * this._tileSize, col * this._tileSize, this._tileSize, this._tileSize);
                }
            }
        };

    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuState;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__connection__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__game__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__render__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__menustate__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__menufadeanimation__ = __webpack_require__(0);
/**
 * Created by Gregory on 6/24/17.
 */






class PlayState {

    constructor(stateManager, playerName) {
        this.game = new __WEBPACK_IMPORTED_MODULE_1__game__["a" /* default */]();
        this.renderer = new __WEBPACK_IMPORTED_MODULE_2__render__["a" /* default */]();
        this.connection = new __WEBPACK_IMPORTED_MODULE_0__connection__["a" /* default */]('ws://localhost:4000');
        this._playerName = playerName;

        this._createJoinPacket = (name) => {
            let builder = new flatbuffers.Builder(128);
            let nameOff = builder.createString(name);
            buffers.JoinDataBuffer.startJoinDataBuffer(builder);
            buffers.JoinDataBuffer.addName(builder, nameOff);
            let joinBuf = buffers.JoinDataBuffer.endJoinDataBuffer(builder);

            buffers.MessageBuffer.startMessageBuffer(builder);
            buffers.MessageBuffer.addMessageType(builder, buffers.MessageUnion.JoinDataBuffer);
            buffers.MessageBuffer.addMessage(builder, joinBuf);
            builder.finish(buffers.MessageBuffer.endMessageBuffer(builder));
            return builder.asUint8Array();
        };

        this._hasConnected = () => {
            this.connection.send(this._createJoinPacket(this._playerName));
            this._inputIntervalId = setInterval(() => { //start sending input packets
                this.connection.send(this.game.serializedInputPacket());
                this.game.resetInputPacket();
            }, 1000/20);
            this.connection.setDisconnectionCallback(this._hasDisconnected);
        };

        this._hasDisconnected = () => {
            clearInterval(this._inputIntervalId);
            stateManager.animation = new __WEBPACK_IMPORTED_MODULE_4__menufadeanimation__["a" /* default */](1000, false);
            stateManager.animation.onFinished(() => stateManager.state = new __WEBPACK_IMPORTED_MODULE_3__menustate__["a" /* default */](stateManager));
        };

        this._setup = () => {
            this.connection.start();
            this.connection.setConnectionCallback(this._hasConnected);
            this.connection.setMessageCallback(this.game.handleRecieveMsg);
        };

        this.update = () => {
            this.game.updateEntities();
            if(this.game.player !== null) {
                this.renderer.centerCameraOnPlayer(this.game.player);
                this.renderer.render(this.game.entities, this.game.leaderboard, this.game.myInfo, this.game.player);
            }
        };

        this._setup();
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayState;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__playstate__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__menustate__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__menufadeanimation__ = __webpack_require__(0);




(function() {

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    let stateManager = {
        state: null,
        animation: null
    };
    stateManager.animation = new __WEBPACK_IMPORTED_MODULE_2__menufadeanimation__["a" /* default */](1000, false);
    stateManager.animation.onFinished(() => stateManager.state = new __WEBPACK_IMPORTED_MODULE_1__menustate__["a" /* default */](stateManager));

    function tick() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (stateManager.state) stateManager.state.update();
        if(stateManager.animation) {
            stateManager.animation.update();
            if(stateManager.animation.isFinished()) stateManager.animation = null;
        }
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

    function updateCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.onresize = updateCanvasSize;
})();

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = maxHPForLevel;
/* harmony export (immutable) */ __webpack_exports__["b"] = maxXPForLevel;
/**
 * Created by Gregory on 6/19/17.
 */

function maxHPForLevel(lvl) {
    return 30 * lvl;
}

function maxXPForLevel(lvl) {
    return (Math.pow(2, lvl) - Math.pow(2, lvl - 1)) * 150;
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by Gregory on 6/12/17.
 */

class Connection {

    constructor(serverURL) {

        this._socket = null;

        this.start = () => {
            this._socket = new WebSocket(serverURL);
            this._socket.binaryType = "arraybuffer";
        };

        this.setConnectionCallback = (callback) => {
            this._socket.onopen = callback;
        };

        this.setMessageCallback = (callback) => {
            this._socket.onmessage = callback;
        };

        this.setDisconnectionCallback = (callback) => {
            this._socket.onclose = callback;
        };

        this.send = (data) => {
            // if(this._socket.readyState === this._socket.CLOSED) return;
            this._socket.send(data);
        }

    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Connection;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Created by Gregory on 6/12/17.
 */

const LERP_MS = 100;

class Game {

    constructor() {

        this.entities = new Map();
        this.player = null;

        this._inputPacket = {
            laneChange: 0,
            slow: false
        };

        this._hammer = new Hammer.Manager(document.getElementById('canvas'));
        this._hammer.add(new Hammer.Swipe());

        this._hammer.on('swipeleft', () => this._handleKeyPress(37));
        this._hammer.on('swiperight', () => this._handleKeyPress(39));
        this._hammer.on('swipeup', () => this._handleKeyPress(38));
        this._hammer.on('swipedown', () => this._handleKeyPress(40));

        this._turnmap = {
            //key = player rotation, val = [keyToTurnLeft, keyToTurnRight]
            0: [37, 39],
            90: [40, 38],
            180: [39, 37],
            270: [38, 40]
        };

        this._setupInput = () => {
            window.onkeydown = (e) => {
                let key = e.keyCode ? e.keyCode : e.which;
                this._handleKeyPress(key);
            };
            window.onkeyup = (e) => {
                let key = e.keyCode ? e.keyCode : e.which;
                if (key == 32) this._inputPacket.slow = false;
            };
        };

        this._handleKeyPress = (key) => {
            if (this.player === null) return;
            switch (key) {
                case this._turnmap[this.player.rotation][0]:
                    this._inputPacket.laneChange = -1;
                    break;

                case this._turnmap[this.player.rotation][1]:
                    this._inputPacket.laneChange = 1;
                    break;

                case 32: //spacebar
                    this._inputPacket.slow = true;
                    break;
            }
        };

        this._packetQueue = [];
        this._interpData = {
            startUpdate: null,
            endUpdate: null,
            renderTime: Date.now() - LERP_MS
        };

        this._preventPacketBackup = () => {
            this._interpData.endUpdate = null;
            this._packetQueue = [];
        };

        this._setupStartUpdateVelocities = () => {
            this.entities.clear();
            this.player = this._interpData.startUpdate.player;
            for (let entity of this._interpData.startUpdate.entities) {
                this.entities.set(entity.id, entity);
            }
            for (let endEntity of this._interpData.endUpdate.entities) {
                let entity = this.entities.get(endEntity.id);
                if (entity === undefined) continue;
                entity.dx = endEntity.x - entity.x;
                entity.dy = endEntity.y - entity.y;
                entity.startx = entity.x;
                entity.starty = entity.y;
            }
        };

        this._loadStartEndPackets = () => {
            this._interpData.renderTime = Date.now() - LERP_MS;
            if(this._interpData.startUpdate === null && this._packetQueue.length > 0 && this._packetQueue[0].clientTimeMs <= this._interpData.renderTime) {
                this._interpData.startUpdate = this._packetQueue.shift();
                if(this._packetQueue[0].clientTimeMs <= this._interpData.renderTime) this._interpData.startUpdate = null; //maybe remove
            }
            if(this._interpData.startUpdate !== null && this._interpData.endUpdate === null && this._packetQueue.length > 0 && this._packetQueue[0].clientTimeMs >= this._interpData.renderTime) {
                this._interpData.endUpdate = this._packetQueue.shift();
                this._setupStartUpdateVelocities();
                this.leaderboard = this._interpData.startUpdate.leaderboard;
            }
        };

        this._interpolate = () => {
            let interpDuration = this._interpData.endUpdate.serverTimeMs - this._interpData.startUpdate.serverTimeMs;
            let ratio = (this._interpData.renderTime - this._interpData.startUpdate.clientTimeMs) / interpDuration;
            for (let entity of this.entities.values()) {
                if(isNaN(entity.dx) || isNaN(entity.dy)) continue; //doesnt exist in endupdate
                entity.x = entity.startx + entity.dx * ratio;
                entity.y = entity.starty + entity.dy * ratio;
            }
            if (ratio >= 1) {
                this._interpData.startUpdate = this._interpData.endUpdate;
                this._interpData.endUpdate = null;
            }
        };

        this.updateEntities = () => {
            this._loadStartEndPackets();

            if (this._interpData.startUpdate === null) {
                return;
            }
            if (this._interpData.endUpdate === null) {
                if(this._packetQueue.length > 0) this._preventPacketBackup();
                // else {} //TODO extrapolate from startupdate
            } else {
                this._interpolate();
            }
        };

        this.handleRecieveMsg = (msg) => {
            let bytes = new Uint8Array(msg.data);
            let buf = new flatbuffers.ByteBuffer(bytes);
            let msgBuf = buffers.MessageBuffer.getRootAsMessageBuffer(buf);
            if(msgBuf.messageType() === buffers.MessageUnion.SnapshotBuffer) this._packetQueue.push(this._createPacketFromSnapshotBuffer(msgBuf.message(new buffers.SnapshotBuffer())));
        };

        this._createPacketFromSnapshotBuffer = (buffer) => {
            let packet = {entities: []};
            let playerid = buffer.player().id();
            for (let i = 0; i < buffer.entitiesLength(); i++) {
                let entity = this._createObjectFromBuffer(buffer.entities(i));
                if(entity === null) continue;
                if(entity.id === playerid) packet.player = entity;
                packet.entities.push(entity);
            }
            packet.leaderboard = []
            for(let i = 0; i < buffer.leaderboardLength(); i++) {
                packet.leaderboard.push(buffer.leaderboard(i));
            }
            packet.clientTimeMs = Date.now();
            packet.serverTimeMs = buffer.serverTimeMs().toFloat64();
            packet.myInfo = buffer.myInfo();
            return packet;
        };

        this._createObjectFromBuffer = (entityBuffer) => {
            let entity = null;
            switch(entityBuffer.entityType()) {
                case buffers.EntityUnion.PlayerBuffer:
                    entity = this._createPlayerFromBuffer(entityBuffer.entity(new buffers.PlayerBuffer()));
                    break;
                case buffers.EntityUnion.GasCanBuffer:
                    entity = this._createEntityFromBuffer(entityBuffer.entity(new buffers.GasCanBuffer()), buffers.EntityUnion.GasCanBuffer);
                    break;
                case buffers.EntityUnion.WreckageBuffer:
                    entity = this._createEntityFromBuffer(entityBuffer.entity(new buffers.WreckageBuffer()), buffers.EntityUnion.WreckageBuffer);
                    break;
                case buffers.EntityUnion.LaunchpadBuffer:
                    entity = this._createEntityFromBuffer(entityBuffer.entity(new buffers.LaunchpadBuffer()), buffers.EntityUnion.LaunchpadBuffer);
                    break;
            }
            return entity;
        };

        this._createPlayerFromBuffer = (entityBuffer) => {
            let player = this._createEntityFromBuffer(entityBuffer, buffers.EntityUnion.PlayerBuffer);
            player.stats = {
                xp: entityBuffer.stats().xp(),
                level: entityBuffer.stats().level(),
                health: entityBuffer.stats().health(),
                hurtFlag: entityBuffer.stats().hurtFlag(),
            };
            player.name = entityBuffer.name();
            return player;
        };

        this._createEntityFromBuffer = (buffer, type) => {
            return {
                x: buffer.position().x(),
                y: buffer.position().y(),
                rotation: buffer.position().rotation(),
                id: buffer.id(),
                type: type
            };
        };

        this.serializedInputPacket = () => {
            let builder = new flatbuffers.Builder(128);
            buffers.InputPacketBuffer.startInputPacketBuffer(builder);
            buffers.InputPacketBuffer.addLaneChange(builder, this._inputPacket.laneChange);
            buffers.InputPacketBuffer.addSlow(builder, this._inputPacket.slow);
            let packetOffset = buffers.InputPacketBuffer.endInputPacketBuffer(builder);
            buffers.MessageBuffer.startMessageBuffer(builder);
            buffers.MessageBuffer.addMessageType(builder, buffers.MessageUnion.InputPacketBuffer);
            buffers.MessageBuffer.addMessage(builder, packetOffset);
            builder.finish(buffers.MessageBuffer.endMessageBuffer(builder));
            return builder.asUint8Array();
        };

        this.resetInputPacket = () => {
            this._inputPacket.laneChange = 0;
            //dont reset slow down
        };

        //setup input
        this._setupInput();
    }

    get myInfo() {
        return this._interpData.startUpdate.myInfo;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_js__ = __webpack_require__(4);
/**
 * Created by Gregory on 6/12/17.
 */



const SECTION_SIZE = 256;
const CHUNK_COUNT = 4;
const HP_BAR_LEN = 50;
const SMALL_HP_BAR_HEIGHT = 12;
const LARGE_BAR_HEIGHT = 16;

const MINIMAP_SIZE = 128;
const MINIMAP_PLAYER_SIZE = 4;
const MINIMAP_CHUNK_SIZE = MINIMAP_SIZE / CHUNK_COUNT;

const MAPSHEET_TILESIZE = 128;

function negmod(n, x) {
    return ((n%x)+x)%x;
}

class Renderer {

    constructor() {

        this._canvas = document.getElementById('canvas');
        this._context = this._canvas.getContext('2d');

        this._imageStorage = {
            'playerSpritesheet': document.getElementById('playerSpritesheet'),
            'mapSpritesheet': document.getElementById('mapSpritesheet'),
            'gascan': document.getElementById('gasCanImg'),
            'wreckage': document.getElementById('wreckageImg'),
            'launchpad': document.getElementById('launchpadImg'),
            'waterTile': document.getElementById('waterImg')
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

        this._camera = {
            x: 0,
            y: 0,
            scale: 1
        };
        this._camera.swidth = () => { return this._canvas.width / this._camera.scale; };
        this._camera.sheight = () => { return this._canvas.height / this._camera.scale; };

        this._imageForEntity = (entity) => {
            switch(entity.type) {
                case buffers.EntityUnion.PlayerBuffer:
                    return this._imageStorage['playerSpritesheet'];
                case buffers.EntityUnion.GasCanBuffer:
                    return this._imageStorage['gascan'];
                case buffers.EntityUnion.WreckageBuffer:
                    return this._imageStorage['wreckage'];
                case buffers.EntityUnion.LaunchpadBuffer:
                    return this._imageStorage['launchpad'];
            }
        };

        this._renderPlayerName = (playerEntity) => {
            this._context.font = '10px arial';
            this._context.textAlign = 'center';
            this._context.fillStyle = '#fff';
            let yoffset = playerEntity.rotation === 180 || playerEntity.rotation === 0 ? 24 + 10 : 16 + 10;
            this._context.fillText(playerEntity.name, 0, yoffset);
        };

        this._renderPlayerExtras = (playerEntity) => {
            this._context.fillStyle = 'rgba(255, 0, 0, 0.3)';
            if(playerEntity.stats.hurtFlag) this._context.fillRect(-16, -24, 32, 48);
            //reverse rotation
            this._context.rotate(playerEntity.rotation * Math.PI / 180);
            //render name
            if (playerEntity.stats.hurtFlag) this._renderHPBar(playerEntity);
            this._renderPlayerName(playerEntity);
        };

        this._renderPlayerOnMinimap = (player) => {
            let x = player.x / (CHUNK_COUNT * SECTION_SIZE * 3) * MINIMAP_SIZE;
            let y = player.y / (CHUNK_COUNT * SECTION_SIZE * 3) * MINIMAP_SIZE;
            this._context.fillRect(x - MINIMAP_PLAYER_SIZE / 2, y - MINIMAP_PLAYER_SIZE / 2, MINIMAP_PLAYER_SIZE, MINIMAP_PLAYER_SIZE);
        };

        this._renderMinimap = (entities, player) => {
            this._context.save();
            this._context.translate(8, 8);
            this._context.fillStyle = 'rgba(0,0,0,0.3)';
            this._context.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
            this._context.fillStyle = '#fff';
            for(let i = 0; i < CHUNK_COUNT; i++) {
                for(let j = 0; j < CHUNK_COUNT; j++) {
                    let laneWidth = MINIMAP_CHUNK_SIZE * 0.25;
                    this._context.fillRect(MINIMAP_CHUNK_SIZE * (i + 0.5) - laneWidth/2, MINIMAP_CHUNK_SIZE * j, laneWidth, MINIMAP_CHUNK_SIZE);
                    this._context.fillRect(MINIMAP_CHUNK_SIZE * i, MINIMAP_CHUNK_SIZE * (j + 0.5) - laneWidth/2, MINIMAP_CHUNK_SIZE, laneWidth);
                }
            }
            this._context.fillStyle = '#ef6767';
            for(let entity of entities.values()) {
                if(entity.type === buffers.EntityUnion.PlayerBuffer) this._renderPlayerOnMinimap(entity);
            }
            this._context.fillStyle = '#4e7ce8';
            this._renderPlayerOnMinimap(player);
            this._context.restore();
        };


        this._renderEntity = (entity) => {
            let img = this._imageForEntity(entity);
            this._context.save();
            this._context.translate(entity.x - this._camera.x, entity.y - this._camera.y);
            this._context.rotate(-entity.rotation * Math.PI / 180);

            if(entity.type === buffers.EntityUnion.PlayerBuffer) {
                this._context.drawImage(img,
                    (entity.stats.level - 1) * 32, 0, 32, 48,
                    -16, -24, 32, 48);
                this._renderPlayerExtras(entity);
            } else {
                this._context.drawImage(img, -img.naturalWidth/2, -img.naturalHeight/2);
            }
            this._context.restore();
        };

        this._renderMapChunk = (x, y, rotation) => {
            for(let row = 0; row < 3; row++) {
                for(let col = 0; col < 3; col++) {
                    this._context.save();
                    let img = this._imageStorage['mapSpritesheet'];
                    if((row === 0 || row === 2) && (col === 0 || col === 2)) this._context.drawImage(img, 0, 0, MAPSHEET_TILESIZE, MAPSHEET_TILESIZE, x + col * SECTION_SIZE, y + row * SECTION_SIZE, SECTION_SIZE, SECTION_SIZE);
                    else if(row === 1 && col === 1) {
                        this._context.translate(x + col * SECTION_SIZE + (SECTION_SIZE/2), y + row * SECTION_SIZE + (SECTION_SIZE/2));
                        this._context.rotate(rotation);
                        this._context.drawImage(img, MAPSHEET_TILESIZE * 2, 0, MAPSHEET_TILESIZE, MAPSHEET_TILESIZE, -SECTION_SIZE/2, -SECTION_SIZE/2, SECTION_SIZE, SECTION_SIZE);
                    } else {
                        this._context.translate(x + col * SECTION_SIZE + (SECTION_SIZE/2), y + row * SECTION_SIZE + (SECTION_SIZE/2));
                        if(row === 1) this._context.rotate(90 * Math.PI / 180);
                        this._context.drawImage(img, MAPSHEET_TILESIZE, 0, MAPSHEET_TILESIZE, MAPSHEET_TILESIZE, -SECTION_SIZE/2, -SECTION_SIZE/2, SECTION_SIZE, SECTION_SIZE);
                    }
                    this._context.restore();
                }
            }
        };

        this._renderHPBar = (playerEntity) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            let yoffset = playerEntity.rotation === 180 || playerEntity.rotation === 0 ? -24 - (SMALL_HP_BAR_HEIGHT + 1) : -16 - (SMALL_HP_BAR_HEIGHT + 1);
            this._context.fillRect(-HP_BAR_LEN / 2, yoffset, HP_BAR_LEN, SMALL_HP_BAR_HEIGHT); //draw background bar
            this._context.fillStyle = 'rgb(75, 244, 66)'; //render health in green
            let filledLength = playerEntity.stats.health / __WEBPACK_IMPORTED_MODULE_0__common_js__["a" /* maxHPForLevel */](playerEntity.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * HP_BAR_LEN;
            this._context.fillRect(-HP_BAR_LEN / 2, yoffset, filledLength, SMALL_HP_BAR_HEIGHT);
        };

        this._drawOffmapTile = (x, y) => {
            for(let k = 0; k < 3; k++) {
                for(let p = 0; p < 3; p++) {
                    this._context.drawImage(this._imageStorage['waterTile'], x + SECTION_SIZE*p, y + SECTION_SIZE*k, SECTION_SIZE, SECTION_SIZE);
                }
            }
        };

        this._renderLeaderboard = (myInfo, leaderboard) => {
            for(let leader of leaderboard) {
                this._leaderboardList[leader.rank()].text(leader.rank() + ": " + leader.name());
            }
            this._leaderboardList[11].text(myInfo.rank() + ": " + myInfo.name());
        };

        this._renderMap = (player) => {
            let startx = -negmod(this._camera.x, SECTION_SIZE * 3);
            let starty = -negmod(this._camera.y, SECTION_SIZE * 3);

            for (let i = 0; i < Math.ceil(this._camera.sheight() / (SECTION_SIZE * 3)) + 1; i++) {
                for (let j = 0; j < Math.ceil(this._camera.swidth() / (SECTION_SIZE * 3)) + 1; j++) {
                    let x = Math.floor(startx + j * SECTION_SIZE * 3);
                    let y = Math.floor(starty + i * SECTION_SIZE * 3);
                    if(x + this._camera.x < -1 || y + this._camera.y < -1
                            ||(x + this._camera.x + this._camera.swidth() / 2) > SECTION_SIZE * 3 * CHUNK_COUNT
                            || (y + this._camera.y + this._camera.sheight() / 2) > SECTION_SIZE * 3 * CHUNK_COUNT) {
                        this._drawOffmapTile(x, y);
                        continue;
                    }
                    this._renderMapChunk(x, y, -player.rotation * Math.PI / 180);
                }
            }
        };

        this._setSmallFontProperties = () => {
            this._context.font = "12px HelveticaNeue-CondensedBold";
            this._context.textAlign = 'center';
            this._context.textBaseline = 'middle';
        };

        this._renderXPBar = (player) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.fillRect(this._camera.swidth() * 0.1, this._camera.sheight() - 32, this._camera.swidth() * 0.8, LARGE_BAR_HEIGHT);
            this._context.fillStyle = 'rgb(26, 157, 204)'; //render xp in blue
            let filledLength = player.stats.xp / __WEBPACK_IMPORTED_MODULE_0__common_js__["b" /* maxXPForLevel */](player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * this._camera.swidth() * 0.8;
            this._context.fillRect(this._camera.swidth() * 0.1, this._camera.sheight() - 32, filledLength, LARGE_BAR_HEIGHT);

            this._context.fillStyle = 'white';
            this._setSmallFontProperties();
            this._context.fillText(player.stats.xp + ' / ' + __WEBPACK_IMPORTED_MODULE_0__common_js__["b" /* maxXPForLevel */](player.stats.level) + ' XP', this._camera.swidth() * 0.5, this._camera.sheight() - 32 + LARGE_BAR_HEIGHT/2);
        };

        this._renderLargeHPBar = (player) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.fillRect(this._camera.swidth() * 0.1, this._camera.sheight() - 52, this._camera.swidth() * 0.8, LARGE_BAR_HEIGHT);
            this._context.fillStyle = 'rgb(15, 174, 6)'; //render hp in green
            let filledLength = player.stats.health / __WEBPACK_IMPORTED_MODULE_0__common_js__["a" /* maxHPForLevel */](player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * this._camera.swidth() * 0.8;
            this._context.fillRect(this._camera.swidth() * 0.1, this._camera.sheight() - 52, filledLength, LARGE_BAR_HEIGHT);

            this._context.fillStyle = 'white';
            this._setSmallFontProperties();
            this._context.fillText(player.stats.health + ' / ' + __WEBPACK_IMPORTED_MODULE_0__common_js__["a" /* maxHPForLevel */](player.stats.level) + ' HP', this._camera.swidth() * 0.5, this._camera.sheight() - 52 + LARGE_BAR_HEIGHT/2);
        };

        this._renderEntities = (entities) => {
            for (let entity of entities.values()) {
                if(entity.type === buffers.EntityUnion.PlayerBuffer) continue;
                this._renderEntity(entity);
            }
            for (let entity of entities.values()) {
                if(entity.type !== buffers.EntityUnion.PlayerBuffer) continue;
                this._renderEntity(entity);
            }
        };

        this.render = (entities, leaderboard, myInfo, player) => {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height); //clear canvas
            this._renderMap(player);
            this._renderEntities(entities);
            this._renderXPBar(player);
            this._renderLargeHPBar(player);
            this._renderLeaderboard(myInfo, leaderboard);
            this._renderMinimap(entities, player);
        };

        this.centerCameraOnPlayer = (player) => {
            this._camera.x = player.x - this._camera.swidth() / 2;
            this._camera.y = player.y - this._camera.sheight() / 2;
        };

        this._updateCanvasSize = () => {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            let gameRatio = 900/1440;
            let windowRatio = window.innerHeight / window.innerWidth;
            if(windowRatio < gameRatio) { //fit to width
                this._camera.scale = window.innerWidth / 1440;
                this._context.setTransform(this._camera.scale, 0, 0, this._camera.scale, 0, 0);
            } else { //fit to height
                this._camera.scale = window.innerHeight / 900;
                this._context.setTransform(this._camera.scale, 0, 0, this._camera.scale, 0, 0);
            }
            this._context.imageSmoothingEnabled = false; //to properly scale pixel art
        };

        this._updateCanvasSize();
        window.onresize = this._updateCanvasSize;
        // window.addEventListener('resize', this._updateCanvasSize, false);
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Renderer;


/***/ })
/******/ ]);