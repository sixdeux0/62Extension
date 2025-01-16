document.addEventListener('DOMContentLoaded', function() {
    const validKeys = [
        "lifetime62-free0", // Remplacez par vos clés autorisées
        "lifetime62-yyyyy",
        "lifetime62-zzzzz"
    ];

    const toggleButton = document.getElementById('toggleExtension');
    const statusText = document.getElementById('status');
    const keyForm = document.getElementById('keyForm');

    chrome.storage.local.get(['keyVerified', 'extensionActive'], function(result) {
        if (!result.keyVerified) {
            keyForm.style.display = 'block';
            toggleButton.style.display = 'none';
            statusText.style.display = 'none';
        } else {
            updateButtonAndStatus(result.extensionActive);
        }
    });

    document.getElementById('submitKey').addEventListener('click', verifyKey);

    toggleButton.addEventListener('click', function() {
        chrome.storage.local.get(['extensionActive'], function(result) {
            let isExtensionActive = !result.extensionActive;
            chrome.storage.local.set({extensionActive: isExtensionActive}, function() {
                updateButtonAndStatus(isExtensionActive);
                chrome.runtime.sendMessage({action: isExtensionActive ? "enable" : "disable"});
            });
        });
    });

    function updateButtonAndStatus(isActive) {
        toggleButton.textContent = isActive ? "Désactiver" : "Activer";
        toggleButton.className = isActive ? "button active" : "button inactive";
        statusText.textContent = isActive ? "Extension activée" : "Extension désactivée";
        statusText.className = isActive ? "status active" : "status inactive";
    }

    function verifyKey() {
        const key = document.getElementById('accessKey').value.trim();
        
        // Vérifiez si la clé est valide
        if (validKeys.includes(key)) {
            chrome.storage.local.set({keyVerified: true, extensionActive: true}, function() {
                keyForm.style.display = 'none';
                toggleButton.style.display = 'block';
                statusText.style.display = 'block';
                updateButtonAndStatus(true);
                chrome.runtime.sendMessage({action: "enable"});
            });
        } else {
            alert('Clé d\'accès invalide');
        }
    }
});
