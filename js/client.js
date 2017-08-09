import PlayState from './playstate';
import Connection from './connection';
import MenuState from './menustate';
import FadeAnimation from './menufadeanimation'

let profile = undefined;

window.onload = function() {

    console.log("------------ WELCOME TO SKRRT.IO ------------");

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let menuScale = 1;
    let menuWrapper = document.getElementById('menuWrapper');

    let stateManager = {
        state: null,
        animation: null,
        connection: null
    };
    stateManager.camera = {
        x: 0,
        y: 0,
    };
    stateManager.camera.swidth = () => { return canvas.width / stateManager.camera.scale; };
    stateManager.camera.sheight = () => { return canvas.height / stateManager.camera.scale; };

    stateManager.connect = (address) => {
        if(stateManager.connection) stateManager.connection.close();
        stateManager.connection = new Connection(address);
        stateManager.connection.start();
    };
    stateManager.switchState = (state) => {
        stateManager.state = state;
        updateCanvasSize();
    };
    stateManager.animation = new FadeAnimation(stateManager.camera, 1000, false);
    stateManager.animation.onFinished(() => stateManager.state = new MenuState(stateManager));

    function tick() {
        context.clearRect(0, 0, stateManager.camera.swidth(), stateManager.camera.sheight());
        if (stateManager.state) stateManager.state.update();
        if(stateManager.animation) {
            stateManager.animation.update();
            if(stateManager.animation.isFinished()) stateManager.animation = null;
        }
        window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);

    function updateCanvasSize() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
        context.imageSmoothingEnabled = false;

        stateManager.camera.scale = Math.max(window.innerWidth * window.devicePixelRatio / 1680, window.innerHeight * window.devicePixelRatio / 945);
        context.setTransform(stateManager.camera.scale, 0, 0, stateManager.camera.scale, 0, 0);

        //scale menu
        menuScale = Math.min(window.innerWidth / 940, window.innerHeight /782);
        scaleDiv(menuWrapper, menuScale);
    }

    function scaleDiv(d, scale) {
        let s = `translate(-50%, -0%) scale(${scale})`;
        d.style.transform = s;
        d.style['-o-transform'] = s;
        d.style['-webkit-transform'] = s;
        d.style['-moz-transform'] = s;
        d.style['-ms-transform'] = s;
    }

    updateCanvasSize();
    window.onresize = updateCanvasSize;
    window.addEventListener("orientationchange", updateCanvasSize);
};