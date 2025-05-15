import { createWith } from '../../lib/lib.js';
const CURSORS = {
    // selector: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z"></path></svg>`,
    // rectangle: `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23,1v22H1V1h22M24,0H0v24h24V0h0Z"/></svg>`,
    // grab: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"></path><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"></path><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>`,
    // grabbing: `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4"></path><path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"></path><path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5"></path><path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2"></path><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"></path></svg>`,
    rotate: `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.99 18.93"><path d="M15.57,16.04c.48-.57,1-1.1,1.5-1.65.35-.38.54-.85,1.15-.82.72.04,1.01.78.55,1.34-1.07,1.3-2.37,2.5-3.44,3.82-.69.48-1.09,0-1.56-.48-.91-.95-1.92-2.07-2.78-3.07-.3-.35-.58-.72-.33-1.19.39-.73,1.08-.39,1.53.07.52.55,1.01,1.17,1.51,1.74.07.08.17.19.26.22,0-.81.02-1.64-.08-2.44-.51-4.07-3.48-7.36-7.47-8.32-1.12-.27-2.22-.25-3.37-.24.15.2.34.39.52.56.51.47,1.2.95,1.66,1.44.69.73-.3,1.84-1.1,1.19-.91-.74-1.83-1.68-2.7-2.48-.38-.35-1.06-.81-1.29-1.26-.21-.4-.1-.54.14-.89C1.59,2.57,2.79,1.18,4.11.18c.76-.58,1.72.38,1.13,1.14l-2.3,2.09c.76.04,1.52-.01,2.28.06,5.2.47,9.42,4.43,10.22,9.59.15.99.1,1.98.14,2.98Z"/></svg>`,
};
class Cursor {
    domRef;
    editor;
    EC;
    constructor(editor) {
        this.EC = new AbortController();
        this.editor = editor;
        this.domRef = createWith('div', 'cursor', editor.id, {
            pointerEvents: 'none',
            width: '20px',
            height: '20px',
            position: 'fixed',
            top: '0',
            left: '0',
        });
        const { signal } = this.EC;
        editor.container.appendChild(this.domRef);
        editor.container.addEventListener('mouseenter', () => { this.show(); }, { signal });
        editor.container.addEventListener('mouseout', () => { this.hide(); }, { signal });
        editor.container.addEventListener('mousemove', e => { this.move(e); }, { signal });
    }
    set(name) {
        // console.log('set cursor', cursor)
        this.domRef.setAttribute('date-current-cursor', name);
        if (name === 'rotate') {
            this.domRef.style.display = 'block';
            this.editor.container.style.cursor = 'none';
            this.domRef.innerHTML = CURSORS[name];
        }
        else {
            this.domRef.style.display = 'none';
            this.editor.container.style.cursor = name;
        }
    }
    move(p, rotation) {
        // console.log('set cursor', p)
        // this.domRef.style.left = `${p.x}px`
        // this.domRef.style.top = `${p.y}px`
        this.domRef.style.translate = `${p.x}px ${p.y}px`;
    }
    rotate(rotation) {
        // const size = 24
        // const offset = size / 2
        // const {x, y} = position as Point
        // for svg icon direction
        rotation += 45;
        // cursor.style.display = 'block'
        this.domRef.style.transformOrigin = 'center center';
        this.domRef.style.rotate = `${rotation}deg`;
    }
    show() {
        this.domRef.style.display = 'block';
    }
    hide() {
        this.domRef.style.display = 'none';
    }
    destroy() {
        this.EC.abort();
        this.EC = null;
        this.domRef.remove();
        this.domRef = null;
    }
}
export default Cursor;
