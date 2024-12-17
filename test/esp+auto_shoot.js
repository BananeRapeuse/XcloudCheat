// ==UserScript==
// @name         XcloudCheat (ESP and Auto shoot optimized with visual logs)
// @namespace    http://tampermonkey.net/
// @version      dev3
// @description  ESP and Auto-shoot for Xcloud Gaming optimized with visual logs!
// @author       Ph0qu3_111
// @match        https://www.xbox.com/*/play*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs
// @require      https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet
// @run-at       document-end
// ==/UserScript==

(async function () {
    'use strict';

    // Load the MobileNet model (lighter alternative to Coco-SSD)
    const model = await mobilenet.load();
    console.log('MobileNet model loaded successfully!');

    // Add a canvas overlay to draw ESP boxes
    const canvas = document.createElement('canvas');
    canvas.id = 'espCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10000';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Resize the canvas dynamically
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Add a div for visual logs
    const logDiv = document.createElement('div');
    logDiv.style.position = 'fixed';
    logDiv.style.top = '10px';
    logDiv.style.left = '10px';
    logDiv.style.color = 'white';
    logDiv.style.fontSize = '16px';
    logDiv.style.zIndex = '10001';
    logDiv.style.maxWidth = '300px';
    logDiv.style.whiteSpace = 'pre-wrap'; // To allow line breaks
    logDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    logDiv.style.padding = '10px';
    document.body.appendChild(logDiv);

    let logs = ""; // To accumulate log messages

    // Function to add logs to the visual log div
    function addLog(message) {
        logs += message + '\n';
        logDiv.textContent = logs;
    }

    // Function to perform object detection
    let lastDetectionTime = 0;  // To limit the frequency of detection
    async function detectObjects() {
        const video = document.querySelector('video'); // The game video stream
        if (video) {
            const now = Date.now();
            if (now - lastDetectionTime < 1000) { // Limit detection to every 1 second
                requestAnimationFrame(detectObjects);
                return;
            }
            lastDetectionTime = now;

            // Rescale the video before passing it to the model
            const scale = 0.5;  // Scale down the video to improve performance
            const canvasVideo = document.createElement('canvas');
            const ctxVideo = canvasVideo.getContext('2d');
            canvasVideo.width = video.videoWidth * scale;
            canvasVideo.height = video.videoHeight * scale;
            ctxVideo.drawImage(video, 0, 0, canvasVideo.width, canvasVideo.height);

            // Run object detection with MobileNet
            const predictions = await model.classify(canvasVideo);

            // Log predictions for debugging
            addLog('Predictions:');

            // Clear previous drawings
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            predictions.forEach(prediction => {
                addLog(`Detected: ${prediction.className} with probability ${prediction.probability.toFixed(2)}`);

                if (prediction.className === 'person') { // Target only "person"
                    // Log the bounding box coordinates
                    addLog(`Bounding Box: ${prediction.bbox.join(', ')}`);

                    const [x, y, width, height] = prediction.bbox;

                    // Draw ESP box around the enemy
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, width, height);

                    // Auto-shoot if the enemy is centered
                    if (isEnemyCentered(x, y, width, height)) {
                        autoShoot();
                    }
                }
            });
        }
        requestAnimationFrame(detectObjects); // Continue the detection loop
    }

    // Function to check if the enemy is centered in the crosshair
    function isEnemyCentered(x, y, width, height) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const crosshairX = window.innerWidth / 2;
        const crosshairY = window.innerHeight / 2;

        const tolerance = 30; // Tolerance for centering
        const isCentered = Math.abs(centerX - crosshairX) < tolerance && Math.abs(centerY - crosshairY) < tolerance;

        if (isCentered) {
            addLog('Enemy is centered in crosshair');
        }
        return isCentered;
    }

    // Function to simulate a mouse click (auto-shoot)
    function autoShoot() {
        const event = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(event);

        const eventUp = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(eventUp);
        addLog("Auto-shoot triggered!");
    }

    // Start the object detection
    detectObjects();
})();