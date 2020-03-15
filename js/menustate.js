import FadeAnimation from './menufadeanimation';
import PlayState from './playstate';
import NumAbbr from 'number-abbreviate';

const numAbbr = new NumAbbr();

export default class MenuState {

    constructor(stateManager) {

        this._bufferCanvas = document.getElementById('canvas');
        this._bufferCtx = this._bufferCanvas.getContext('2d');
        this._tileImage = document.getElementById('tileImg');
        this._tileSize = 100;
        this._playButton = $('#playButton');

        this._scoreLabel = $('#scoreLabel');
        this._serverSelect = $('#serverSelect');

        this._nickInput = $('#nickInput');

        this._servers = {
            // 'North America': 'ws://localhost:8005'
            'North America': 'ws://35.239.58.6:8005'
            // 'US-CA': 'ws://localhost:4000'
        };

        $('#loginArea').slideDown(1000);
        $('#infoArea').slideDown(1000);
        $('#infoArea2').slideDown(1000);
        $('#tutorialArea').slideDown(1000);
        $('#leaderboard').slideUp();
        $('#slowButton').slideUp();
        this._btnClicked = false;

        this._showLastScore = () => {
            if(stateManager.lastScore === undefined || stateManager.lastLevel === undefined) {
                this._scoreLabel.hide();
                return;
            }
            this._scoreLabel.text("You got to Level " + stateManager.lastLevel + " - " + stateManager.lastScore + "XP");
            this._scoreLabel.show();
        };

        this._connectToSelected = () => {
            stateManager.connect(this._servers[this._serverSelect.val()]);
            stateManager.connection.alias = this._serverSelect.val();
            console.log(this._servers[this._serverSelect.val()]);
        };

        this._serverSelect.change(this._connectToSelected);
        $('#refreshBtn').on('click', this._connectToSelected);
        if(!stateManager.connection) this._connectToSelected();

        setTimeout(() => this._nickInput.focus(), 1000); // to prevent that wierd backup problem with sliding jquery panels
        this._nickInput.on('keypress', (e) => { if(e.keyCode === 13) this._playButton.click(); });

        this._playButton.click(() => {
            if(this._btnClicked === true) return;
            if(stateManager.connection.readyState !== 1) {
                alert('Hmmm... could not connect to server - try a different one.');
                return;
            }
            this._btnClicked = true;
            this._nickInput.blur();

            ga('send', 'event', 'games', 'play', 'playing game');

            $('#loginArea').slideUp();
            $('#infoArea').slideUp();
            $('#infoArea2').slideUp();
            $('#tutorialArea').slideUp();
            $('#leaderboard').slideDown();
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $('#slowButton').slideDown();
            }
            stateManager.animation = new FadeAnimation(stateManager.camera, 1000, true);
            stateManager.switchState(new PlayState(stateManager, this._nickInput.val()));
        });

        this._handleRecieveMsg = (msg) => {
            let bytes = new Uint8Array(msg.data);
            let buf = new flatbuffers.ByteBuffer(bytes);
            let msgBuf = buffers.MessageBuffer.getRootAsMessageBuffer(buf);
            if(msgBuf.messageType() === buffers.MessageUnion.ServerDataBuffer) {
                let dataBuf = msgBuf.message(new buffers.ServerDataBuffer());
                this._serverSelect.find('option[value="' + stateManager.connection.alias + '"]').text(stateManager.connection.alias);
                if(this._lt !== undefined) $('#ping').text('Ping: ' + (Date.now() - this._lt));
            }
        };
        this.update = () => {};
        this.render = () => {
            for(let row = 0; row < Math.floor(stateManager.camera.swidth() / this._tileSize) + 1; row++) {
                for (let col = 0; col < Math.floor(stateManager.camera.sheight() / this._tileSize) + 1; col++) {
                    this._bufferCtx.drawImage(this._tileImage, row * this._tileSize, col * this._tileSize, this._tileSize+1, this._tileSize+1);
                }
            }
        };

        this._hasConnected = () => {
            let builder = new flatbuffers.Builder(128);

            buffers.ServerDataBuffer.startServerDataBuffer(builder);
            let buf = buffers.ServerDataBuffer.endServerDataBuffer(builder);

            buffers.MessageBuffer.startMessageBuffer(builder);
            buffers.MessageBuffer.addMessageType(builder, buffers.MessageUnion.ServerDataBuffer);
            buffers.MessageBuffer.addMessage(builder, buf);
            builder.finish(buffers.MessageBuffer.endMessageBuffer(builder));
            stateManager.connection.send(builder.asUint8Array());
            this._lt = Date.now();
        };

        if(stateManager.connection.readyState === 1) this._hasConnected();
        else stateManager.connection.setConnectionCallback(this._hasConnected);
        stateManager.connection.setMessageCallback(this._handleRecieveMsg);
        this._showLastScore();
    }

}