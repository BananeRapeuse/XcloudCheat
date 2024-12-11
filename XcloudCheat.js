// ==UserScript==
// @name         XcloudCheat
// @namespace    http://tampermonkey.net/
// @version      alpha0.1
// @description  A little userscript cheat for all games of Xcloud Gaming!
// @author       Ph0qu3_111
// @match        https://www.xbox.com/*/play*
// @match        https://www.xbox.com/*/auth/msa?*loggedIn*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // Styles for the mod menu
    const styles = `
        #modMenu {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 10px;
            border-radius: 8px;
            z-index: 10000;
            width: 200px;
        }
        #modMenu h2 {
            margin: 0;
            font-size: 18px;
            text-align: center;
        }
        #modMenu small {
            display: block;
            text-align: center;
            font-size: 10px;
            color: gray;
        }
        #modMenu button {
            width: 100%;
            margin: 5px 0;
            padding: 5px;
            background: #444;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }
        #modMenu button:hover {
            background: #555;
        }
        #subMenu {
            margin-top: 10px;
        }
        .hidden {
            display: none;
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create the mod menu
    const modMenu = document.createElement('div');
    modMenu.id = 'modMenu';
    modMenu.innerHTML = `
        <h2>XcloudCheat</h2>
        <small>by Ph0qu3_111</small>
        <button id="menuCheats">Cheats</button>
        <button id="menuOptions">Cheat Options</button>
        <button id="menuAbout">About</button>
        <div id="subMenu" class="hidden">
            <div id="menu1a" class="hidden">
                <label><input type="checkbox" id="crosshairToggle"> Crosshair</label><br>
                <label><input type="checkbox" id="fpsToggle"> Show FPS</label><br>
                <label><input type="checkbox" id="pingToggle"> Show Ping</label>
            </div>
            <div id="menu1b" class="hidden">
                <label for="crosshairColor">Crosshair Color:</label>
                <select id="crosshairColor">
                    <option value="red" selected>Red</option>
                    <option value="black">Black</option>
                    <option value="white">White</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="rgb">RGB</option>
                </select><br>
                <label for="crosshairSize">Crosshair Size:</label>
                <select id="crosshairSize">
                    <option value="50">Small</option>
                    <option value="100" selected>Medium</option>
                    <option value="210">Large</option>
                </select>
            </div>
            <div id="menu1c" class="hidden">
                <p>XcloudCheat, A little userscript cheat for all games of Xcloud Gaming!</p>
                <p>Coded in JavaScript <🖥️> by Ph0qu3_111</p>
            </div>
            <button id="backButton">Back</button>
        </div>
    `;
    document.body.appendChild(modMenu);

    // Variables for utilities
    let crosshairEnabled = false;
    let fpsEnabled = false;
    let pingEnabled = false;

    // Show/hide menus
    const subMenu = document.getElementById('subMenu');
    const menu1a = document.getElementById('menu1a');
    const menu1b = document.getElementById('menu1b');
    const menu1c = document.getElementById('menu1c');

    document.getElementById('menuCheats').onclick = () => {
        subMenu.classList.remove('hidden');
        menu1a.classList.remove('hidden');
        menu1b.classList.add('hidden');
        menu1c.classList.add('hidden');
    };

    document.getElementById('menuOptions').onclick = () => {
        subMenu.classList.remove('hidden');
        menu1a.classList.add('hidden');
        menu1b.classList.remove('hidden');
        menu1c.classList.add('hidden');
    };

    document.getElementById('menuAbout').onclick = () => {
        subMenu.classList.remove('hidden');
        menu1a.classList.add('hidden');
        menu1b.classList.add('hidden');
        menu1c.classList.remove('hidden');
    };

    document.getElementById('backButton').onclick = () => {
        subMenu.classList.add('hidden');
    };

    // Event listeners for utilities
    document.getElementById('crosshairToggle').onchange = (e) => {
        crosshairEnabled = e.target.checked;
        toggleCrosshair(crosshairEnabled);
    };

    document.getElementById('fpsToggle').onchange = (e) => {
        fpsEnabled = e.target.checked;
        toggleFPS(fpsEnabled);
    };

    document.getElementById('pingToggle').onchange = (e) => {
        pingEnabled = e.target.checked;
        togglePing(pingEnabled);
    };

    // Crosshair function
    const toggleCrosshair = (enabled) => {
        let crosshair = document.getElementById('crosshair');
        if (enabled) {
            if (!crosshair) {
                crosshair = document.createElement('div');
                crosshair.id = 'crosshair';
                crosshair.style.position = 'fixed';
                crosshair.style.top = '50%';
                crosshair.style.left = '50%';
                crosshair.style.width = '100px';
                crosshair.style.height = '100px';
                crosshair.style.backgroundColor = 'red';
                crosshair.style.borderRadius = '50%';
                crosshair.style.transform = 'translate(-50%, -50%)';
                crosshair.style.zIndex = '10000';
                document.body.appendChild(crosshair);
            }
        } else if (crosshair) {
            crosshair.remove();
        }
    };

    // FPS and Ping functions (to implement)
    const toggleFPS = (enabled) => {
        console.log(`FPS display ${enabled ? 'enabled' : 'disabled'}`);
    };

    const togglePing = (enabled) => {
        console.log(`Ping display ${enabled ? 'enabled' : 'disabled'}`);
    };
})();
