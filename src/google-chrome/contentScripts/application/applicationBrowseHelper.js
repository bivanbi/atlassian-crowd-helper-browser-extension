const applicationSearchInputElementName = 'name';

window.addEventListener('load', () => {
    console.debug("Crowd Application Browse Helper Content Script begin");
    focusSearchInputElement(applicationSearchInputElementName);
    console.debug("Crowd Application Browse Helper Content Script initialized on " + window.location.pathname);
});
