import { isNegativeZero } from '../../../core/utils.js';
function handleWheel(event) {
    console.log('wheel');
    // Prevent page zoom
    if (event.target !== this.editor.container)
        return;
    // console.log(this.state)
    event.preventDefault();
    event.stopPropagation();
    if (this.editor.interaction.state !== 'static')
        return;
    const { trackpad, zooming, panning, scrolling, zoomFactor, translateX, translateY } = detectGestures(event);
    console.log(trackpad);
    // console.log(`${zooming ? 'zooming' : ''} ${panning ? 'panning' : ''} ${scrolling ? 'scrolling' : ''} `)
    // this.editor.interaction.zooming = zooming
    if (zooming) {
        // console.log(zoomFactor)
        this.editor.action.dispatch('world-zoom', {
            zoomBy: true,
            zoomFactor,
            physicalPoint: this.editor.interaction.mouseCurrent,
        });
    }
    else if (panning || scrolling) {
        this.editor.action.dispatch('world-shift', {
            x: translateX,
            y: translateY,
        });
        // this.translateViewport(translateX, translateY)
    }
    this.editor.world.updateWorldRect();
}
const detectGestures = (() => {
    let _timer;
    const DELAY = 200;
    // let shiftX: number = 0
    // let shiftY: number = 0
    const ACTION_THRESHOLD = 3;
    const EVENT_BUFFER = [];
    let zooming = false;
    let panning = false;
    let scrolling = false;
    let zoomFactor = 0;
    let translateX = 0;
    let translateY = 0;
    let gestureLock = false;
    const zoomSpeedA = 0.01;
    const zoomSpeedB = 0.1;
    let trackpad = false;
    return (event) => {
        const { deltaX, deltaY, altKey } = event;
        if (_timer) {
            clearTimeout(_timer);
        }
        if (gestureLock) {
            EVENT_BUFFER.length = 0;
        }
        else {
            EVENT_BUFFER.push(event);
        }
        translateX = 0;
        translateY = 0;
        zooming = false;
        scrolling = false;
        panning = false;
        console.log(deltaX, deltaY);
        if (altKey) {
            zooming = true;
            // zoomFactor = ~~deltaY < 0 ? -.1 : .1
        }
        if (EVENT_BUFFER.length >= ACTION_THRESHOLD) {
            // detect zooming
            const allXAreMinusZero = EVENT_BUFFER.every((e) => isNegativeZero(e.deltaX));
            const allYAreFloat = EVENT_BUFFER.every((e) => isFloat(e.deltaY));
            const absBiggerThan4 = EVENT_BUFFER.every((e) => Math.abs(e.deltaY) > 4);
            // console.log('detect zooming')
            if (allXAreMinusZero && allYAreFloat && !absBiggerThan4) {
                gestureLock = true;
                trackpad = true;
                console.log('touchpadZoomingLock');
                // console.log([...EVENT_BUFFER])
                // zoomFactor = deltaY > 0 ? -.1 : .1
                // zooming = true
            }
        }
        /**
         * Wheel deltaX deltaY
         * 1. touchpad
         *  panning
         *    x: UInt
         *    y: UInt
         *  zoom
         *    x === -0
         *    y: Float
         * 2. mouse scroll
         *    2.1 vertical scroll
         *      x === -0
         *      y: Float, abs(value) > 4, and increasing
         *    2.2 horizontal scroll
         *      x: UInt, increasing and abs(v) > 40
         *      y === -0
         */
        if (gestureLock) {
            // console.log('hit')
            zoomFactor = deltaY > 0 ? -zoomSpeedA : zoomSpeedA;
            zooming = true;
        }
        else if (Math.abs(deltaX) >= 40 && isNegativeZero(deltaY)) {
            // Mouse horizontal scrolling
            // console.log('hor scroll', deltaX)
            if (altKey) {
                zoomFactor = deltaX < 0 ? zoomSpeedB : -zoomSpeedB;
            }
            else {
                scrolling = true;
                translateX = -deltaX;
            }
        }
        else if (isNegativeZero(deltaX) &&
            isFloat(deltaY) &&
            Math.abs(deltaY) > 4) {
            // Vertical scrolling
            // console.log('ver scrolling', deltaX)
            if (altKey) {
                zoomFactor = deltaY < 0 ? zoomSpeedA : -zoomSpeedA;
            }
            else {
                scrolling = true;
                translateY = -deltaY;
            }
        }
        else if (isUInt(deltaX) && isUInt(deltaY)) {
            // panning
            if (altKey) {
                const max = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
                zoomFactor = max < 0 ? zoomSpeedA : -zoomSpeedA;
            }
            else {
                // console.log('panning')
                panning = true;
                translateX = -deltaX;
                translateY = -deltaY;
            }
        }
        if (zooming && altKey) {
            zoomFactor = zoomFactor < 0 ? -zoomSpeedB : zoomSpeedB;
        }
        _timer = setTimeout(() => {
            gestureLock = false;
            zooming = false;
            panning = false;
            scrolling = false;
            zoomFactor = 0;
            translateX = 0;
            translateY = 0;
            EVENT_BUFFER.length = 0;
        }, DELAY);
        return {
            trackpad,
            zooming,
            panning,
            scrolling,
            zoomFactor,
            translateX,
            translateY,
        };
    };
})();
function isUInt(v) {
    return !isFloat(v);
}
function isFloat(v) {
    return Math.abs(v) % 1 !== 0;
}
export default handleWheel;
