class Options {
    static optionsStorageKey = 'options';
    static emailDomainOptionKey = 'emailDomain';

    emailDomain = 'example.com';
    optionsLoaded = false;

    constructor() {
        this.storage = new StorageProvider();
    }

    load() {
        return new Promise((resolve) => {
            console.debug("Calling storage.get for key " + Options.optionsStorageKey);
            this.storage.get(Options.optionsStorageKey).then((options) => {
                console.debug("Stored options:");
                console.debug(options);
                console.log(options[Options.emailDomainOptionKey]);
                this.emailDomain = options[Options.emailDomainOptionKey] || this.emailDomain;
                this.optionsLoaded = true;
                resolve();
            });
        });
    }

    save() {
        console.debug("Calling storage.set for key " + Options.optionsStorageKey);
        let data = {};
        data[Options.emailDomainOptionKey] = this.emailDomain;
        return this.storage.set(Options.optionsStorageKey, data);
    }
}
