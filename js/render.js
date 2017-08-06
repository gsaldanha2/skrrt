/**
 * Created by Gregory on 6/12/17.
 */

import * as common from './common.js';
import NumAbbr from 'number-abbreviate';

const SECTION_SIZE = 360;
const CHUNK_COUNT = 10;
const HP_BAR_LEN = 50;
const SMALL_HP_BAR_HEIGHT = 12;
const LARGE_BAR_HEIGHT = 16;

const MINIMAP_SIZE = 150;
const MINIMAP_PLAYER_SIZE = 6;
const MINIMAP_CHUNK_SIZE = MINIMAP_SIZE / CHUNK_COUNT;

const numAbbr = new NumAbbr();

function negmod(n, x) {
    return ((n%x)+x)%x;
}

function radians(n) {
    return n * Math.PI / 180;
}

function rtog(val, max) {
    let r = Math.floor((200 * (max - val)) / max);
    let g = Math.floor((200 * val) / max);
    return 'rgb(' + r + ', ' + g + ', 0)';
}

export default class Renderer {

    constructor(camera) {

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
            'intersection': document.getElementById('intersection'),
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

        this._renderPlayerTail = (playerEntity) => {
            let gradient= this._context.createLinearGradient(0, 0, 100 * Math.cos(radians(90)), 100 * Math.sin(radians(90)));
            if(playerEntity.id === this._player.id) {
                gradient.addColorStop(0.00,"rgba(245, 252, 45, 0.6)");
            } else if(playerEntity.stats.level > this._player.stats.level) {
                gradient.addColorStop(0.00,"rgba(255, 0, 0, 0.6)");
            } else if(playerEntity.stats.level === this._player.stats.level) {
                gradient.addColorStop(0.00,"rgba(0, 0, 255, 0.6)");
            } else {
                gradient.addColorStop(0.00,"rgba(0, 255, 0, 0.6)");
            }
            gradient.addColorStop(0.8,"transparent");

            this._context.lineWidth=24;
            this._context.beginPath();
            this._context.moveTo(0, 0);
            this._context.lineTo(200 * Math.cos(radians(90)), 100 * Math.sin(radians(90)));
            this._context.strokeStyle=gradient;
            this._context.stroke();
        };

        this._renderPlayerExtras = (playerEntity) => {
            this._context.fillStyle = 'rgba(0, 255, 0, 0.3)';
            if(playerEntity.stats.spawnProtected) this._context.fillRect(-16, -24, 32, 48);
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
            this._context.fillStyle = 'rgba(0,0,0,0.5)';
            this._context.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
            this._context.fillStyle = '#555';
            for(let i = 0; i < CHUNK_COUNT; i++) {
                for(let j = 0; j < CHUNK_COUNT; j++) {
                    let laneWidth = MINIMAP_CHUNK_SIZE * 0.25;
                    this._context.fillRect(Math.floor(MINIMAP_CHUNK_SIZE * (i + 0.5) - laneWidth/2), MINIMAP_CHUNK_SIZE * j, laneWidth, MINIMAP_CHUNK_SIZE+1);
                    this._context.fillRect(MINIMAP_CHUNK_SIZE * i, Math.floor(MINIMAP_CHUNK_SIZE * (j + 0.5) - laneWidth/2), MINIMAP_CHUNK_SIZE+1, laneWidth);
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
            this._context.translate(Math.floor(entity.x - camera.x), Math.floor(entity.y - camera.y));
            this._context.rotate(-entity.rotation * Math.PI / 180);

            if(entity.type === buffers.EntityUnion.PlayerBuffer) {
                this._renderPlayerTail(entity);
                this._context.drawImage(img,
                    (entity.stats.level - 1) * 32, 0, 32, 48,
                    -16, -24, 32, 48);
                this._renderPlayerExtras(entity);
            } else {
                this._context.drawImage(img, -img.width/2, -img.height/2, img.width, img.height);
            }
            this._context.restore();
        };

        this._renderMapChunk = (x, y, rotation) => {
            for(let row = 0; row < 3; row++) {
                for(let col = 0; col < 3; col++) {
                    this._context.save();
                    if((row === 0 || row === 2) && (col === 0 || col === 2)) this._context.drawImage(this._imageStorage['grass'], x + col * SECTION_SIZE, y + row * SECTION_SIZE, SECTION_SIZE+1, SECTION_SIZE+1);
                    else if(row === 1 && col === 1) {
                        this._context.translate(x + col * SECTION_SIZE + (SECTION_SIZE/2), y + row * SECTION_SIZE + (SECTION_SIZE/2));
                        this._context.rotate(rotation);
                        this._context.drawImage(this._imageStorage['intersection'], -SECTION_SIZE/2, -SECTION_SIZE/2, SECTION_SIZE+1, SECTION_SIZE+1);
                    } else {
                        this._context.translate(x + col * SECTION_SIZE + (SECTION_SIZE/2), y + row * SECTION_SIZE + (SECTION_SIZE/2));
                        if(row === 1) this._context.rotate(90 * Math.PI / 180);
                        this._context.drawImage(this._imageStorage['road'], -SECTION_SIZE/2, -SECTION_SIZE/2, SECTION_SIZE+1, SECTION_SIZE+1);
                    }
                    this._context.restore();
                }
            }
        };

        this._renderGasLevel = (gasLevel) => {
            let height = camera.sheight() * 0.5;
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.save();
            this._context.translate(12, camera.sheight() / 2);
            this._context.fillRect(0, -height/2, LARGE_BAR_HEIGHT, height);
            let filledLength = Math.max(0, Math.min(gasLevel / 100, 1)) * height;
            this._context.fillStyle = rtog(gasLevel, 100);
            this._context.fillRect(0, height/2 - filledLength, LARGE_BAR_HEIGHT, filledLength);

            this._setSmallFontProperties(14);
            this._context.fillStyle = 'white';
            this._context.fillText('Gas', LARGE_BAR_HEIGHT / 2, height/2 + 12);
            this._context.restore();
        };

        this._renderHPBar = (playerEntity) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            let yoffset = playerEntity.rotation === 180 || playerEntity.rotation === 0 ? -24 - (SMALL_HP_BAR_HEIGHT + 1) : -16 - (SMALL_HP_BAR_HEIGHT + 1);
            this._context.fillRect(-HP_BAR_LEN / 2, yoffset, HP_BAR_LEN, SMALL_HP_BAR_HEIGHT); //draw background bar
            this._context.fillStyle = rtog(playerEntity.stats.health, common.maxHPForLevel(playerEntity.stats.level));
            let filledLength = playerEntity.stats.health / common.maxHPForLevel(playerEntity.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * HP_BAR_LEN;
            this._context.fillRect(-HP_BAR_LEN / 2, yoffset, filledLength, SMALL_HP_BAR_HEIGHT);
        };

        this._drawOffmapTile = (x, y, rotation) => {
            this._renderMapChunk(x, y, rotation);
            this._context.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this._context.fillRect(x, y, SECTION_SIZE * 3, SECTION_SIZE * 3);
        };

        this._renderLeaderboard = (myInfo, leaderboard) => {
            for(let leader of leaderboard) {
                this._leaderboardList[leader.rank()].text(leader.rank() + ": " + leader.name() + " - " + numAbbr.abbreviate(leader.score(), 2));
            }
            this._leaderboardList[11].text(myInfo.rank() + ": " + myInfo.name() + " - " + numAbbr.abbreviate(myInfo.score(), 2));
        };

        this._renderMap = (player) => {
            let startx = -negmod(Math.floor(camera.x), SECTION_SIZE * 3);
            let starty = -negmod(Math.floor(camera.y), SECTION_SIZE * 3);

            for (let i = 0; i < Math.ceil(camera.sheight() / (SECTION_SIZE * 3)) + 1; i++) {
                for (let j = 0; j < Math.ceil(camera.swidth() / (SECTION_SIZE * 3)) + 1; j++) {
                    let x = startx + j * SECTION_SIZE * 3;
                    let y = starty + i * SECTION_SIZE * 3;
                    if(x + camera.x < -1 || y + camera.y < -1
                            ||(x + camera.x + camera.swidth() / 2) > SECTION_SIZE * 3 * CHUNK_COUNT
                            || (y + camera.y + camera.sheight() / 2) > SECTION_SIZE * 3 * CHUNK_COUNT) {
                        this._drawOffmapTile(x, y, -player.rotation * Math.PI / 180);
                        continue;
                    }
                    this._renderMapChunk(x, y, -player.rotation * Math.PI / 180);
                }
            }
        };

        this._setSmallFontProperties = (size) => {
            if(!size) size = 12;
            this._context.font = size + "px HelveticaNeue-CondensedBold";
            this._context.textAlign = 'center';
            this._context.textBaseline = 'middle';
        };

        this._renderXPBar = (player) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 32, camera.swidth() * 0.8, LARGE_BAR_HEIGHT);
            this._context.fillStyle = 'rgb(26, 157, 204)'; //render xp in blue
            let filledLength = player.stats.xp / common.maxXPForLevel(player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * camera.swidth() * 0.8;
            this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 32, filledLength, LARGE_BAR_HEIGHT);

            this._context.fillStyle = 'white';
            this._setSmallFontProperties();
            this._context.fillText(player.stats.xp + ' / ' + common.maxXPForLevel(player.stats.level) + ' XP', camera.swidth() * 0.5, camera.sheight() - 32 + LARGE_BAR_HEIGHT/2);
        };

        this._renderLargeHPBar = (player) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 52, camera.swidth() * 0.8, LARGE_BAR_HEIGHT);
            this._context.fillStyle = rtog(player.stats.health,common.maxHPForLevel(player.stats.level));
            let filledLength = player.stats.health / common.maxHPForLevel(player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * camera.swidth() * 0.8;
            this._context.fillRect(camera.swidth() * 0.1, camera.sheight() - 52, filledLength, LARGE_BAR_HEIGHT);

            this._context.fillStyle = 'white';
            this._setSmallFontProperties();
            this._context.fillText(player.stats.health + ' / ' + common.maxHPForLevel(player.stats.level) + ' HP', camera.swidth() * 0.5, camera.sheight() - 52 + LARGE_BAR_HEIGHT/2);
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

        this._renderGasWarning = () => {
            if(this._player.stats.gasLevel < 30) {
                this._setSmallFontProperties(16);
                this._context.fillStyle = '#cc0000';
                this._context.fillText('Running low on gas!', camera.swidth() / 2, camera.sheight() / 2 - 60);
            }
        };

        this._renderOOBWarning = () => {
            if (this._player.x > SECTION_SIZE * 3 * CHUNK_COUNT || this._player.y > SECTION_SIZE * 3 * CHUNK_COUNT || this._player.x < 0 || this._player.y < 0){
                this._setSmallFontProperties(16);
                this._context.fillStyle = '#cc0000';
                this._context.fillText('Out of Bounds! Return before you run out of gas!', camera.swidth() / 2, camera.sheight() / 2 - 100);
            }
        };

        this.render = (entities, leaderboard, myInfo, player) => {
            // const startTime = Date.now();
            this._player = player;
            this._renderMap(player);
            this._renderEntities(entities);
            this._renderXPBar(player);
            this._renderLargeHPBar(player);
            this._renderLeaderboard(myInfo, leaderboard);
            this._renderMinimap(entities, player);
            this._renderGasLevel(player.stats.gasLevel);
            this._renderOOBWarning();
            this._renderGasWarning();
            // console.log(Date.now() - startTime);
        };

        this.centerCameraOnPlayer = (player) => {
            camera.x = player.x - camera.swidth() / 2;
            camera.y = player.y - camera.sheight() / 2;
        };
    }

}