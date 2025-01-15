let isExtensionActive = false;
let cdnLink = '';

function updateRedirectRules(isActive) {
    if (chrome.declarativeNetRequest) {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [1001, 1002],
            addRules: isActive ? [
                {
                    'id': 1001,
                    'priority': 1,
                    'action': {
                        'type': 'redirect',
                        'redirect': { url: cdnLink }
                    },
                    'condition': { urlFilter: 'https://static.twitchcdn.net/assets/amazon-ivs-wasmworker.min-*.js' }
                },
                {
                    'id': 1002,
                    'priority': 1,
                    'action': {
                        'type': 'redirect',
                        'redirect': { url: cdnLink }
                    },
                    'condition': { urlFilter: 'https://assets.twitch.tv/assets/amazon-ivs-wasmworker.min-*.js' }
                }
            ] : []
        });
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({keyVerified: false, extensionActive: false});
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({keyVerified: false, extensionActive: false});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "enable") {
        chrome.storage.local.get(['keyVerified'], function(result) {
            if (result.keyVerified) {
                isExtensionActive = true;
                updateRedirectRules(true);
                updateCdnLink();
            }
        });
    } else if (request.action === "disable") {
        isExtensionActive = false;
        updateRedirectRules(false);
    }
});

async function updateCdnLink() {
    try {
        const response = await fetch("https://api.github.com/repos/besuper/TwitchNoSub/commits");
        const content = await response.json();
        const latestCommit = content[0].sha;
        cdnLink = `https://cdn.jsdelivr.net/gh/besuper/TwitchNoSub@${latestCommit}/src/amazon-ivs-worker.min.js`;
    } catch (e) {
        console.error("Erreur lors de la récupération du dernier commit:", e);
        cdnLink = `https://cdn.jsdelivr.net/gh/besuper/TwitchNoSub/src/amazon-ivs-worker.min.js`;
    }
    console.log("CDN link mis à jour:", cdnLink);
    if (isExtensionActive) {
        updateRedirectRules(true);
    }
}

if (!chrome.declarativeNetRequest) {
    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (isExtensionActive && cdnLink) {
                return { redirectUrl: cdnLink };
            }
        },
        {
            urls: [
                "https://static.twitchcdn.net/assets/amazon-ivs-wasmworker.min-*.js",
                "https://assets.twitch.tv/assets/amazon-ivs-wasmworker.min-*.js"
            ],
            types: ["script"]
        },
        ["blocking"]
    );
}
