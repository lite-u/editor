const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const watchDir = './src';       // Change to your folder
const scriptToRun = './docgen.cjs'; // The CJS file you want to run

let child = null;
let timer = null;

// Helper to debounce rapid file changes
function debounceRun() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        runScript();
    }, 200);
}

function runScript() {
    if (child) {
        child.kill();
    }

    console.log('\n[INFO] Running script...\n');
    child = spawn('node', [scriptToRun], { stdio: 'inherit' });
}

// Run initially
runScript();

fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;

    const ext = path.extname(filename);
    if (ext === '.ts' || ext === '.tsx') {
        console.log(`[INFO] Change detected: ${filename}`);
        debounceRun();
    }
});