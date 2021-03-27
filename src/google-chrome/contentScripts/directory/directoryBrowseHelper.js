const directorySearchInputElementName = 'search';

window.addEventListener('load', () => {
    console.debug("Crowd Directory Browse Helper Content Script begin");
    focusSearchInputElement(directorySearchInputElementName);
    console.debug("Crowd Directory Browse Helper Content Script initialized on " + window.location.pathname);
});
