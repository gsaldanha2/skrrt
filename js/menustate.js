import FadeAnimation from './menufadeanimation';
import PlayState from './playstate';

export default class MenuState {

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
            stateManager.state = new PlayState(stateManager, $('#nickInput').val()); //TODO wait for play state to connect before loading next state
            stateManager.animation = new FadeAnimation(1000, true);
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