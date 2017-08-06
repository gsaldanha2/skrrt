/**
 * Created by Gregory on 6/24/17.
 */
import Connection from './connection';
import Game from './game';
import Renderer from './render';
import MenuState from './menustate';
import FadeAnimation from './menufadeanimation'

export default class PlayState {

    constructor(stateManager, playerName) {
        this.game = new Game();
        this.renderer = new Renderer(stateManager.camera);
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

        this._rejectConnection = () => {
            alert("This server has reached the max limit of players");
            this._onDeath();
        };

        this._handleRecieveMsg = (msg) => {
            let bytes = new Uint8Array(msg.data);
            let buf = new flatbuffers.ByteBuffer(bytes);
            let msgBuf = buffers.MessageBuffer.getRootAsMessageBuffer(buf);
            if (msgBuf.messageType() === buffers.MessageUnion.SnapshotBuffer) this.game.handleRecieveSnapshot(msgBuf);
            else if (msgBuf.messageType() === buffers.MessageUnion.DeathBuffer) this._onDeath(msgBuf.message(new buffers.DeathBuffer()));
            else if (msgBuf.messageType() === buffers.MessageUnion.InfoBuffer && msgBuf.message(new buffers.InfoBuffer()).msg() === 'reject') {
                this._rejectConnection();
            }
        };

        this._onDeath = (deathBuf) => {
            clearInterval(this._inputIntervalId);
            this.game.cleanup();

            stateManager.lastScore = deathBuf.score();
            stateManager.lastLevel = deathBuf.level();

            //clear callbacks
            stateManager.connection.setConnectionCallback(() => {});
            stateManager.connection.setMessageCallback(() => {});
            stateManager.connection.setDisconnectionCallback(() => {});

            stateManager.animation = new FadeAnimation(stateManager.camera, 2000, false);
            stateManager.animation.onFinished(() => stateManager.state = new MenuState(stateManager));
        };

        this._setup = () => {
            stateManager.connection.send(this._createJoinPacket(this._playerName));
            this._inputIntervalId = setInterval(() => { //start sending input packets
                stateManager.connection.send(this.game.serializedInputPacket());
                this.game.resetInputPacket();
            }, 1000/20);
            stateManager.connection.setDisconnectionCallback(() => alert('Uh oh! Disconnected from Server!'));
            stateManager.connection.setMessageCallback(this._handleRecieveMsg);
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