/**
 * Created by Gregory on 6/12/17.
 */

const LERP_MS = 100;

export default class Game {

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