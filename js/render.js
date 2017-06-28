/**
 * Created by Gregory on 6/12/17.
 */

import * as common from './common.js';

const SECTION_SIZE = 256;
const CHUNK_COUNT = 4;
const HP_BAR_LEN = 50;
const HP_BAR_HEIGHT = 12;

function negmod(n, x) {
    return ((n%x)+x)%x;
};

export default class Renderer {

    constructor() {

        this._canvas = document.getElementById('canvas');
        this._context = this._canvas.getContext('2d');
        this._context.imageSmoothingEnabled = false; //to properly scale pixel art

        this._imageStorage = {
            'player1': document.getElementById('player1Img'),
            'map': document.getElementById('mapImg'),
            'gascan': document.getElementById('gasCanImg'),
            'wreckage': document.getElementById('wreckageImg'),
            'launchpad': document.getElementById('launchpadImg'),
            'waterTile': document.getElementById('waterImg')
        };

        this._camera = {
            x: 0,
            y: 0
        };

        this._imageForEntity = (entity) => {
            switch(entity.type) {
                case buffers.EntityUnion.PlayerBuffer:
                    return this._imageStorage['player' + entity.stats.level];
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


        this._renderEntity = (entity) => {
            let img = this._imageForEntity(entity);
            this._context.save();
            this._context.translate(entity.x - this._camera.x, entity.y - this._camera.y);
            this._context.rotate(-entity.rotation * Math.PI / 180);
            this._context.drawImage(img, -16, -24);

            if(entity.type === buffers.EntityUnion.PlayerBuffer) {
                this._renderPlayerExtras(entity);
            }
            this._context.restore();
        };

        this._renderMapTile = (x, y, rotation) => {
            this._context.save();
            this._context.translate(x + SECTION_SIZE * 1.5, y + SECTION_SIZE * 1.5);
            this._context.rotate(rotation);
            this._context.drawImage(this._imageStorage['map'], -SECTION_SIZE * 1.5, -SECTION_SIZE * 1.5, SECTION_SIZE * 3, SECTION_SIZE * 3);
            this._context.restore();
        };

        this._renderHPBar = (playerEntity) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            let yoffset = playerEntity.rotation === 180 || playerEntity.rotation === 0 ? -24 - (HP_BAR_HEIGHT + 1) : -16 - (HP_BAR_HEIGHT + 1);
            this._context.fillRect(-HP_BAR_LEN / 2, yoffset, HP_BAR_LEN, HP_BAR_HEIGHT); //draw background bar
            this._context.fillStyle = 'rgb(75, 244, 66)'; //render health in green
            let filledLength = playerEntity.stats.health / common.maxHPForLevel(playerEntity.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * HP_BAR_LEN;
            this._context.fillRect(-HP_BAR_LEN / 2, yoffset, filledLength, HP_BAR_HEIGHT);
        };

        this._renderXPBar = (player) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.fillRect(this._canvas.width * 0.1, this._canvas.height - 32, this._canvas.width * 0.8, 16);
            this._context.fillStyle = 'rgb(66, 197, 244)'; //render xp in blue
            let filledLength = player.stats.xp / common.maxXPForLevel(player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * this._canvas.width * 0.8;
            this._context.fillRect(this._canvas.width * 0.1, this._canvas.height - 32, filledLength, 16);
        };

        this._drawOffmapTile = (x, y) => {
            for(let k = 0; k < 3; k++) {
                for(let p = 0; p < 3; p++) {
                    this._context.drawImage(this._imageStorage['waterTile'], x + SECTION_SIZE*p, y + SECTION_SIZE*k, SECTION_SIZE, SECTION_SIZE);
                }
            }
        };

        this._renderMap = (player) => {
            let startx = -negmod(this._camera.x, SECTION_SIZE * 3);
            let starty = -negmod(this._camera.y, SECTION_SIZE * 3);

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 4; j++) {
                    let x = Math.floor(startx + j * SECTION_SIZE * 3);
                    let y = Math.floor(starty + i * SECTION_SIZE * 3);
                    if(x + this._camera.x < -1 || y + this._camera.y < -1
                            ||(x + this._camera.x + this._canvas.width / 2) > SECTION_SIZE * 3 * CHUNK_COUNT
                            || (y + this._camera.y + this._canvas.height / 2) > SECTION_SIZE * 3 * CHUNK_COUNT) {
                        this._drawOffmapTile(x, y);
                        continue;
                    }
                    this._renderMapTile(x, y, -player.rotation * Math.PI / 180);
                }
            }
        };

        this._renderLargeHPBar = (player) => {
            this._context.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this._context.fillRect(this._canvas.width * 0.1, this._canvas.height - 52, this._canvas.width * 0.8, 16);
            this._context.fillStyle = 'rgb(75, 244, 66)'; //render hp in green
            let filledLength = player.stats.health / common.maxHPForLevel(player.stats.level);
            filledLength = Math.max(0, Math.min(filledLength, 1)) * this._canvas.width * 0.8;
            this._context.fillRect(this._canvas.width * 0.1, this._canvas.height - 52, filledLength, 16);
        };

        this._renderEntities = (entities) => {
            for (let entity of entities.values()) {
                this._renderEntity(entity);
            }
        };

        this.render = (entities, player) => {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height); //clear canvas
            this._renderMap(player);
            this._renderEntities(entities);
            this._renderXPBar(player);
            this._renderLargeHPBar(player);
        };

        this.centerCameraOnPlayer = (player) => {
            this._camera.x = player.x - this._canvas.width / 2;
            this._camera.y = player.y - this._canvas.height / 2;
        };
    }

}