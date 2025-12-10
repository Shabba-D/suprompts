/**
 * Loads data from local storage.
 * @param {string} key - The storage key.
 * @returns {Object} The loaded data or a default structure.
 */
function loadStorageData(key) {
    try {
        if (!window.localStorage) {
            return {
                lastSession: null,
                prompts: {},
                versions: {}
            };
        }
        const raw = window.localStorage.getItem(key);
        if (!raw) {
            return {
                lastSession: null,
                prompts: {},
                versions: {}
            };
        }
        const parsed = JSON.parse(raw);
        return {
            lastSession: parsed && parsed.lastSession ? parsed.lastSession : null,
            prompts: parsed && parsed.prompts && typeof parsed.prompts === 'object' ? parsed.prompts : {},
            versions: parsed && parsed.versions && typeof parsed.versions === 'object' ? parsed.versions : {}
        };
    } catch (e) {
        console.error('Failed to load storage:', e);
        return {
            lastSession: null,
            prompts: {},
            versions: {}
        };
    }
}

/**
 * Saves data to local storage.
 * @param {string} key - The storage key.
 * @param {Object} data - The data to save.
 */
function saveStorageData(key, data) {
    try {
        if (!window.localStorage) {
            return;
        }
        // Ensure structure
        const safeData = {
            lastSession: data.lastSession || null,
            prompts: data.prompts || {},
            versions: data.versions || {}
        };
        window.localStorage.setItem(key, JSON.stringify(safeData));
    } catch (e) {
        console.error('Failed to save storage:', e);
    }
}

export {
    loadStorageData,
    saveStorageData
};
