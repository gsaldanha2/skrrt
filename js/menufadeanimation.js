/**
 * Created by Gregory on 6/24/17.
 */

export default class FadeAnimation {

    constructor(duration, reversed) {
        this._canvas = document.getElementById('canvas');
        this._context = this._canvas.getContext('2d');
        this._duration = duration;
        this._elapsedTime = 0;
        this._tileSize = 100;
        this._tileImage = document.getElementById('tileImg');

        this._lastTime = Date.now();

        this.reset = (reversed) => {
            if(reversed) {
                this._reversed = true;
                this._elapsedTime = this._duration;
            } else {
                this._reversed = false;
                this._elapsedTime = 0;
            }
        };

        this._updateTime = () => {
            let currTime = Date.now();
            if(this._reversed === false) this._elapsedTime += currTime - this._lastTime;
            else this._elapsedTime -= currTime - this._lastTime;
            this._lastTime = currTime;
        };

        this.update = () => {
            if(this.isFinished()) return;
            this._updateTime();
            if(this.isFinished() && this._callback) this._callback();
            for(let row = 0; row < Math.floor(this._canvas.width / this._tileSize) + 1; row++) {
                for (let col = 0; col < Math.floor(this._canvas.height / this._tileSize) + 1; col++) {
                    if((row % 2 === 0 && col % 2 === 0) || (row % 2 === 1 && col % 2 === 1)) {
                        this._context.globalAlpha = Math.max(Math.min(this._elapsedTime / this._duration, 1), 0);
                    } else {
                        this._context.globalAlpha = Math.max(Math.min((this._elapsedTime - this._duration / 3) / (this._duration / 3), 1), 0);
                    }
                    this._context.drawImage(this._tileImage, row * this._tileSize, col * this._tileSize, this._tileSize, this._tileSize);
                }
            }
            this._context.globalAlpha = 1;
        };

        this.isFinished = () => {
            return this._elapsedTime >= this._duration;
        };

        this.onFinished = (callback) => {
            this._callback = callback;
        };

        this.reset(reversed);
    }

}