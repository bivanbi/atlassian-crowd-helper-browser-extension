class StorageProvider {
    get(key, defaultValue = {}) {
        return new Promise((resolve) => {
            console.debug("chrome.storage: getting value for key " + key);
            chrome.storage.sync.get(key, (data) => {
                console.debug("chrome.storage: " + key);
                console.debug(data);
                resolve(data[key] || defaultValue);
            });
        });
    }

    set(key, value) {
        return new Promise((resolve, reject) => {
            console.debug("chrome.storage: setting value for key " + key + ", value:");
            console.debug(value);

            let data = {}
            data[key] = value;

            chrome.storage.sync.set(data, () => {
                if (chrome.runtime.lastError) {
                    console.error("chrome.storage: failed to save data: " + chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                }
                console.debug("chrome.storage: key " + key + ": value saved.");
                resolve();
            });
        });
    }

    clear() {
        return new Promise((resolve) => {
            console.debug("chrome.storage: clear");
            chrome.storage.sync.clear(() => {
                console.log("Data cleared");
                resolve();
            });
        })
    }
}