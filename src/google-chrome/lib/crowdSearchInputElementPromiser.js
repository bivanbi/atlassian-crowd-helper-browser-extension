class CrowdSearchInputElementPromiser {

    reactContainerId = 'react-container';

    constructor(searchInputName = 'search') {
        this.searchInputName = searchInputName;
    }

    get() {
        const getGroupSearchInputElement = () => {
            let nodeList = document.getElementsByName(this.searchInputName);
            if (nodeList.length) {
                return nodeList.item(0);
            }
            return undefined;
        }

        const getSearchContainerElement = () => {
            return document.getElementById(this.reactContainerId);
        }
        return new MutableContainerElementPromiser(getSearchContainerElement, getGroupSearchInputElement).get()
    }
}
