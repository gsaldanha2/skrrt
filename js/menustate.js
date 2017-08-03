import FadeAnimation from './menufadeanimation';
import PlayState from './playstate';
import NumAbbr from 'number-abbreviate';

const numAbbr = new NumAbbr();

export default class MenuState {

    constructor(stateManager) {

        this._canvas = document.getElementById('canvas');
        this._context = this._canvas.getContext('2d');
        this._tileImage = document.getElementById('tileImg');
        this._tileSize = 100;
        this._playButton = $('#playButton');
        this._serverSelect = $('#serverSelect');

        this._nickInput = $('#nickInput');

        this._servers = {
            'US-CA': 'wss://skrrtio-server.herokuapp.com/',
        };

        this._leaderboardList = {
            1: $("#1p"),
            2: $("#2p"),
            3: $("#3p"),
            4: $("#4p"),
            5: $("#5p"),
            6: $("#6p"),
            7: $("#7p"),
            8: $("#8p"),
            9: $("#9p"),
            10: $("#10p"),
        };

        $('#loginArea').slideDown(1000);
        $('#infoArea').slideDown(1000);
        $('#leaderboard').slideUp();
        $('#slowButton').slideUp();
        this._btnClicked = false;

        this._connectToSelected = () => {
            stateManager.connect(this._servers[this._serverSelect.val()]);
            stateManager.connection.alias = this._serverSelect.val();
            console.log(stateManager.connection.alias);
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

            $('#loginArea').slideUp();
            $('#infoArea').slideUp();
            $('#leaderboard').slideDown();
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $('#slowButton').slideDown();
            }
            stateManager.state = new PlayState(stateManager, this._nickInput.val());
            stateManager.animation = new FadeAnimation(stateManager.camera, 1000, true);
        });

        this._handleRecieveMsg = (msg) => {
            let bytes = new Uint8Array(msg.data);
            let buf = new flatbuffers.ByteBuffer(bytes);
            let msgBuf = buffers.MessageBuffer.getRootAsMessageBuffer(buf);
            if(msgBuf.messageType() === buffers.MessageUnion.ServerDataBuffer) {
                let dataBuf = msgBuf.message(new buffers.ServerDataBuffer());
                this._updateLeaderboard(dataBuf);
                this._serverSelect.find('option[value="' + stateManager.connection.alias + '"]').text(stateManager.connection.alias + ' - ' + dataBuf.playerCount() + ' active');
            }
        };

        this._updateLeaderboard = (dataBuf) => {
            for(let i = 0; i < 10; i++) {
                let p = dataBuf.players(i);
                if(p === null || p.name() === "") {
                    this._leaderboardList[i+1].text(i+1 + ": ");
                    continue;
                }
                this._leaderboardList[p.rank()+1].text(p.rank()+1 + ": " + p.name() + " - " + numAbbr.abbreviate(p.score(), 2));
            }
        };

        this.update = () => {
            for(let row = 0; row < Math.floor(stateManager.camera.swidth() / this._tileSize) + 1; row++) {
                for (let col = 0; col < Math.floor(stateManager.camera.sheight() / this._tileSize) + 1; col++) {
                    this._context.drawImage(this._tileImage, row * this._tileSize, col * this._tileSize, this._tileSize+1, this._tileSize+1);
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
        };

        if(stateManager.connection.readyState === 1) this._hasConnected();
        else stateManager.connection.setConnectionCallback(this._hasConnected);
        stateManager.connection.setMessageCallback(this._handleRecieveMsg);
    }

}