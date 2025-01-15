// ==UserScript==
// @name         62Extension
// @namespace    https://discord.gg/62shop
// @version      1.0.2
// @description  Regarder les reddifs gratuitement
// @author       besuper
// @match        *://*.twitch.tv/videos/*
// @match        *://*.twitch.tv/*/video/*
// @updateURL    https://raw.githubusercontent.com/besuper/TwitchNoSub/master/userscript/twitchnosub.user.js
// @downloadURL  https://raw.githubusercontent.com/besuper/TwitchNoSub/master/userscript/twitchnosub.user.js
// @icon         https://raw.githubusercontent.com/besuper/TwitchNoSub/master/assets/icons/icon.png
// @run-at       document-start
// @inject-into  page
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var isVariantA = false;
    const originalAppendChild = document.head.appendChild;

    document.head.appendChild = function (element) {
        if (element.tagName === "SCRIPT") {
            if (element.src.includes("player-core-variant-a")) {
                isVariantA = true;
            }
        }

        return originalAppendChild.call(this, element);
    };

    const oldWorker = window.Worker;

    window.Worker = class Worker extends oldWorker {
        constructor() {
            super(URL.createObjectURL(new Blob(["importScripts('https://cdn.jsdelivr.net/gh/besuper/TwitchNoSub/src/patch_amazonworker.js', 'https://cdn.jsdelivr.net/npm/amazon-ivs-player/dist/assets/amazon-ivs-worker.min.js');"])));

            if (!isVariantA) {
                this.addEventListener("message", (event) => {
                    const data = event.data;

                    if (data.id == 1 && data.type == 1) {
                        const newData = event.data;

                        newData.arg = [data.arg];

                        this.postMessage(newData);
                    }
                });
            }
        }
    }
})();


(function () {
    'use strict';

    // Créer un bouton
    const button = document.createElement('button');
    button.innerText = 'Mon Bouton';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';

    // Ajouter une action au bouton
    button.addEventListener('click', () => {
        alert('Bouton cliqué !');
    });

    // Ajouter le bouton à la page
    document.body.appendChild(button);
})();
