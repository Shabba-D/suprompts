const CURRENT_STORAGE_VERSION = 2;

/**
 * Returns the default storage structure.
 * @returns {Object} Default storage structure.
 */
function getDefaultStorage() {
    return {
        version: CURRENT_STORAGE_VERSION,
        lastSession: null,
        prompts: {},
        versions: {}
    };
}

/**
 * Migrates storage data from older versions to the current version.
 * @param {Object} data - The loaded data.
 * @returns {Object} Migrated data.
 */
function migrateStorage(data) {
    if (!data || typeof data !== 'object') {
        return getDefaultStorage();
    }

    let migrated = {
        ...data
    };
    const oldVersion = migrated.version || 1;

    if (oldVersion < 2) {
        migrated.version = 2;
        if (migrated.prompts) {
            Object.keys(migrated.prompts).forEach(key => {
                const prompt = migrated.prompts[key];
                if (prompt && !prompt.model) {
                    prompt.model = 'claude';
                }
                if (prompt && !prompt.technique) {
                    prompt.technique = 'standard';
                }
            });
        }
        console.info('[Storage] Migrated from v1 to v2');
    }

    return migrated;
}

/**
 * Loads data from local storage.
 * @param {string} key - The storage key.
 * @returns {Object} The loaded data or a default structure.
 */
function loadStorageData(key) {
    try {
        if (!window.localStorage) {
            return getDefaultStorage();
        }
        const raw = window.localStorage.getItem(key);
        if (!raw) {
            return getDefaultStorage();
        }
        const parsed = JSON.parse(raw);
        const migrated = migrateStorage(parsed);

        return {
            version: migrated.version || CURRENT_STORAGE_VERSION,
            lastSession: migrated.lastSession || null,
            prompts: migrated.prompts && typeof migrated.prompts === 'object' ? migrated.prompts : {},
            versions: migrated.versions && typeof migrated.versions === 'object' ? migrated.versions : {}
        };
    } catch (e) {
        console.error('Failed to load storage:', e);
        return getDefaultStorage();
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
        const safeData = {
            version: CURRENT_STORAGE_VERSION,
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