import PlayState from './playstate';
import MenuState from './menustate';
import FadeAnimation from './menufadeanimation'

(function() {

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    let stateManager = {
        state: null,
        animation: null
    };
    stateManager.animation = new FadeAnimation(1000, false);
    stateManager.animation.onFinished(() => stateManager.state = new MenuState(stateManager));

    function tick() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (stateManager.state) stateManager.state.update();
        if(stateManager.animation) {
            stateManager.animation.update();
            if(stateManager.animation.isFinished()) stateManager.animation = null;
        }
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

    function updateCanvasSize () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', updateCanvasSize, false);
    updateCanvasSize();

})();