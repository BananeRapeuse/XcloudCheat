// ==UserScript==
// @name         XcloudCheat (FOV Adjuster)
// @namespace    http://tampermonkey.net/
// @version      dev1
// @description  Adjust FOV by stretching the game screen
// @author       Ph0qu3_111
// @match        https://www.xbox.com/*/play*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Select the video element (game stream)
    const video = document.querySelector('video');

    // Check if video is loaded
    if (!video) {
        console.error('Video element not found!');
        return;
    }

    // Create a canvas to manipulate the video
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10000';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Resize the canvas to match the screen
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Stretching factor for FOV adjustment
    let horizontalStretch = 1.5; // Increase for wider FOV
    let verticalStretch = 1.0; // Keep it 1.0 to maintain vertical proportions

    // Add controls to adjust FOV
    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.bottom = '10px';
    controlPanel.style.left = '10px';
    controlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    controlPanel.style.color = 'white';
    controlPanel.style.padding = '10px';
    controlPanel.style.borderRadius = '5px';
    controlPanel.style.zIndex = '10001';

    controlPanel.innerHTML = `
        <label>Horizontal Stretch: <input type="range" id="hStretch" min="1" max="3" step="0.1" value="${horizontalStretch}" /></label><br>
        <label>Vertical Stretch: <input type="range" id="vStretch" min="0.5" max="2" step="0.1" value="${verticalStretch}" /></label>
    `;
    document.body.appendChild(controlPanel);

    // Update stretch values when sliders change
    document.getElementById('hStretch').addEventListener('input', (e) => {
        horizontalStretch = parseFloat(e.target.value);
    });
    document.getElementById('vStretch').addEventListener('input', (e) => {
        verticalStretch = parseFloat(e.target.value);
    });

    // Render loop to apply the FOV effect
    const render = () => {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the video with the FOV adjustment
        ctx.drawImage(
            video,
            0, 0, video.videoWidth, video.videoHeight, // Source dimensions
            -((horizontalStretch - 1) * canvas.width) / 2, // Adjust horizontal stretch
            -((verticalStretch - 1) * canvas.height) / 2, // Adjust vertical stretch
            canvas.width * horizontalStretch, // New width
            canvas.height * verticalStretch   // New height
        );

        requestAnimationFrame(render);
    };

    render();
})();
