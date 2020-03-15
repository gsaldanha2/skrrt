/**
 * Created by Gregory on 6/12/17.
 */
const LERP_MS = 100;

export default class Game {

    constructor() {

        this.entities = new Map();
        this.player = null;

        this._inputPacket = {
            laneChange: -1,
            slow: false
        };

        this._slowButton = $('#slowButton');

        this._setupInputForMobile = () => {
            $("#body").swipeleft(() => this._handleKeyPress(37))
                .swiperight(() => this._handleKeyPress(39))
                .swipeup(() => this._handleKeyPress(38))
                .swipedown(() => this._handleKeyPress(40));

            this._slowButton.bind('touchstart', () => this._slowButton.trigger('mousedown')).bind('touchend', () => this._slowButton.trigger('mouseup')); //mobile support

            this._slowButton.mousedown(() => {
                this._inputPacket.slow = true;
                return false;
            });
            $(document).mouseup(() => {
                this._inputPacket.slow = false;
                return false;
            });
        };

        this._setupInput = () => {
            window.onkeydown = (e) => {
                let key = e.keyCode ? e.keyCode : e.which;
                this._handleKeyPress(key);
            };
            window.onkeyup = (e) => {
                let key = e.keyCode ? e.keyCode : e.which;
                if (key === 32) this._inputPacket.slow = false;
            };
        };

        this._handleKeyPress = (key) => {
            if (this.player === null) return;
            switch (key) {
                case 38:
                    this._inputPacket.laneChange = 0;
                    break;
                case 37:
                    this._inputPacket.laneChange = 1;
                    break;
                case 40:
                    this._inputPacket.laneChange = 2;
                    break;
                case 39:
                    this._inputPacket.laneChange = 3;
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
            renderTime: undefined,
            clientTime: undefined
        };
        let lastTime = Date.now();
        let delta = 0;

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
                if(entity.id === this.player.id) {
                    entity.stats.gasLevelStart = entity.stats.gasLevel;
                    entity.stats.gasLevelDelta = endEntity.stats.gasLevel - entity.stats.gasLevel;
                }
            }
        };

        this._loadStartEndPackets = () => {
            this._interpData.renderTime = this._interpData.clientTime - LERP_MS;

            if (this._interpData.endUpdate !== null && this._interpData.renderTime > this._interpData.endUpdate.serverTimeMs) {
                this._interpData.startUpdate = this._interpData.endUpdate;
                this._interpData.endUpdate = null;
            }

            if(this._packetQueue.length > 0) {
                for (let i = this._packetQueue.length - 1; i >= 0; i--) {
                    if (this._packetQueue[i].serverTimeMs <= this._interpData.renderTime) {
                        this._interpData.startUpdate = this._packetQueue[i];
                        this._packetQueue = this._packetQueue.slice(i + 1);
                        break;
                    }
                }
            }
            if(this._interpData.startUpdate !== null && this._interpData.endUpdate === null && this._packetQueue.length > 0) {
                if (this._packetQueue[0].serverTimeMs >= this._interpData.renderTime) {
                    this._interpData.endUpdate = this._packetQueue.shift();
                    this._setupStartUpdateVelocities();
                    this.leaderboard = this._interpData.startUpdate.leaderboard;
                } else {
                    console.log(this._packetQueue[0].serverTimeMs);
                }
            }
        };

        this._interpolate = () => {
            if(this._packetQueue > 10) {
                this._preventPacketBackup();
            }
            let interpDuration = this._interpData.endUpdate.serverTimeMs - this._interpData.startUpdate.serverTimeMs;
            let ratio = (this._interpData.renderTime - this._interpData.startUpdate.serverTimeMs) / interpDuration;
            for (let entity of this.entities.values()) {
                if(isNaN(entity.dx) || isNaN(entity.dy)) continue; //doesnt exist in endupdate
                entity.x = entity.startx + entity.dx * ratio;
                entity.y = entity.starty + entity.dy * ratio;
                if(entity.id === this.player.id) {
                    entity.stats.gasLevel = entity.stats.gasLevelStart + entity.stats.gasLevelDelta * ratio;
                }
            }
        };

        this.updateEntities = () => {
            let currTime = Date.now();
            delta = currTime - lastTime;
            lastTime = currTime;
            if(this._interpData.clientTime === undefined) return;
            this._interpData.clientTime += delta;

            this._loadStartEndPackets();

            if (this._interpData.startUpdate === null) {
                return;
            }
            if (this._interpData.endUpdate === null) {
                // if(this._packetQueue.length > 0) {
                //     // console.log(this._interpData.renderTime, this._interpData.startUpdate.serverTimeMs);
                //     console.log('backup');
                //     // this._preventPacketBackup();
                // }
            } else {
                this._interpolate();
            }
        };

        this.cleanup = () => {
        };

        this.handleRecieveSnapshot = (msgBuf) => {
            this._packetQueue.push(this._createPacketFromSnapshotBuffer(msgBuf.message(new buffers.SnapshotBuffer())));
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
            packet.leaderboard = [];
            for(let i = 0; i < buffer.leaderboardLength(); i++) {
                packet.leaderboard.push(buffer.leaderboard(i));
            }
            packet.player.stats.gasLevel = buffer.gasLevel();
            packet.serverTimeMs = buffer.serverTimeMs().toFloat64();
            packet.myInfo = buffer.myInfo();
            if (this._interpData.clientTime === undefined) this._interpData.clientTime = packet.serverTimeMs;
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
                spawnProtected: entityBuffer.stats().spawnProtected()
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
            this._inputPacket.laneChange = -1;
            //dont reset slow down
        };

        //setup input
        this._setupInput();

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this._setupInputForMobile();
        }
    }

    get myInfo() {
        return this._interpData.startUpdate.myInfo;
    }
}