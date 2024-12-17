// ==UserScript==
// @name         XcloudCheat (ESP and Auto shoot dev)
// @namespace    http://tampermonkey.net/
// @version      dev1
// @description  ESP and Auto-shoot for Xcloud Gaming!
// @author       Ph0qu3_111
// @match        https://www.xbox.com/*/play*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@tensorflow/tfjs
// @require      https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd
// @run-at       document-end
// ==/UserScript==

(async function () {
    'use strict';

    // Load the TensorFlow model
    const model = await cocoSsd.load();

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

    // Function to perform object detection
    async function detectObjects() {
        const video = document.querySelector('video'); // Le flux vidéo du jeu
        if (video) {
            const predictions = await model.detect(video);

            // Clear previous drawings
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            predictions.forEach(prediction => {
                if (prediction.class === 'person') { // On cible uniquement les "personnes"
                    const [x, y, width, height] = prediction.bbox;

                    // Dessiner une box ESP autour de l'ennemi
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, width, height);

                    // Auto-shoot si l'ennemi est centré
                    if (isEnemyCentered(x, y, width, height)) {
                        autoShoot();
                    }
                }
            });
        }
        requestAnimationFrame(detectObjects); // Continue la détection
    }

    // Fonction pour vérifier si l'ennemi est centré dans la crosshair
    function isEnemyCentered(x, y, width, height) {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const crosshairX = window.innerWidth / 2;
        const crosshairY = window.innerHeight / 2;

        const tolerance = 30; // Tolérance pour le centrage
        return (
            Math.abs(centerX - crosshairX) < tolerance &&
            Math.abs(centerY - crosshairY) < tolerance
        );
    }

    // Fonction pour simuler un clic de souris
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
        console.log("Auto-shoot triggered!");
    }

    // Lancer la détection des objets
    detectObjects();
})();
