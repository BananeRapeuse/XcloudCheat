// ==UserScript==
// @name         XcloudCheat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A little userscript cheat for all games of Xcloud Gaming!
// @author       Ph0qu3_111
// @match        https://www.xbox.com/*/play*
// @match        https://www.xbox.com/*/auth/msa?*loggedIn*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Styles for the mod menu and utilities
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
        #modMenu.hidden {
            display: none;
        }
        #toggleMenuButton {
            position: fixed;
            top: 10px;
            right: 220px;
            background: #444;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 16px;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 10001;
        }
        #toggleMenuButton:hover {
            background: #555;
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

    // Add a toggle button to show/hide the menu
    const toggleButton = document.createElement('div');
    toggleButton.id = 'toggleMenuButton';
    toggleButton.innerText = '−';
    document.body.appendChild(toggleButton);

    // Toggle menu visibility
    toggleButton.onclick = () => {
        const isHidden = modMenu.classList.toggle('hidden');
        toggleButton.innerText = isHidden ? '+' : '−';
    };

    // Existing menu interaction logic...
})();
