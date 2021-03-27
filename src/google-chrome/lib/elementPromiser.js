class MutableContainerElementPromiser {
    containerObserverConfig = {attributes: true, childList: true};

    constructor(mutableContainerGetter, elementGetter) {
        this.containerGetter = mutableContainerGetter;
        this.elementGetter = elementGetter;
    }

    get() {
        let element = this.elementGetter();
        if (element) {
            console.debug("Requested element is already in DOM.")
            return new Promise((resolve) => {
                resolve(element);
            });
        }
        console.debug("Requested element is not yet in DOM, let's observe mutations of container");

        return new Promise((resolve) => {
            const hasChildListMutated = (mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        return true;
                    }
                }
                return false;
            }

            const observer = new MutationObserver((mutationsList) => {
                if (hasChildListMutated(mutationsList)) {
                    console.debug("Child list mutated.");
                    element = this.elementGetter();
                    if (element !== undefined) {
                        console.debug("Got requested element after child list mutation.");
                        observer.disconnect();
                        resolve(element);
                    }
                }
            });
            observer.observe(this.containerGetter(), this.containerObserverConfig);
        });
    }
}