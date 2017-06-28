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
        this.renderer = new Renderer();
        this.connection = new Connection('ws://localhost:4000');
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
            console.log(playerName);
            this.connection.send(this._createJoinPacket(this._playerName));
            this._inputIntervalId = setInterval(() => { //start sending input packets
                this.connection.send(this.game.serializedInputPacket());
                this.game.resetInputPacket();
            }, 1000/20);
            this.connection.setDisconnectionCallback(this._hasDisconnected);
        };

        this._hasDisconnected = () => {
            console.log('disconnected');
            clearInterval(this._inputIntervalId);
            stateManager.animation = new FadeAnimation(1000, false);
            stateManager.animation.onFinished(() => stateManager.state = new MenuState(stateManager));
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
                this.renderer.render(this.game.entities, this.game.player);
            }
        };

        this._setup();
    }

}