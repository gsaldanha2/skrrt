/**
 * Created by Gregory on 6/12/17.
 */

import * as common from './common.js';

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

export default class Renderer {

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
            let filledLength = playerEntity.stats.health / common.maxHPForLevel(playerEntity.stats.level);
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
            let filledLength = player.stats.xp / common.maxXPForLevel(player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * this._camera.swidth() * 0.8;
            this._context.fillRect(this._camera.swidth() * 0.1, this._camera.sheight() - 32, filledLength, LARGE_BAR_HEIGHT);

            this._context.fillStyle = 'white';
            this._setSmallFontProperties();
            this._context.fillText(player.stats.xp + ' / ' + common.maxXPForLevel(player.stats.level) + ' XP', this._camera.swidth() * 0.5, this._camera.sheight() - 32 + LARGE_BAR_HEIGHT/2);
        };

        this._renderLargeHPBar = (player) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.fillRect(this._camera.swidth() * 0.1, this._camera.sheight() - 52, this._camera.swidth() * 0.8, LARGE_BAR_HEIGHT);
            this._context.fillStyle = 'rgb(15, 174, 6)'; //render hp in green
            let filledLength = player.stats.health / common.maxHPForLevel(player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * this._camera.swidth() * 0.8;
            this._context.fillRect(this._camera.swidth() * 0.1, this._camera.sheight() - 52, filledLength, LARGE_BAR_HEIGHT);

            this._context.fillStyle = 'white';
            this._setSmallFontProperties();
            this._context.fillText(player.stats.health + ' / ' + common.maxHPForLevel(player.stats.level) + ' HP', this._camera.swidth() * 0.5, this._camera.sheight() - 52 + LARGE_BAR_HEIGHT/2);
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