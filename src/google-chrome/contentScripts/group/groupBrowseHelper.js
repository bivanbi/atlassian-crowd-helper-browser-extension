const groupSearchInputElementName = 'search';

window.addEventListener('load', () => {
    console.debug("Crowd Group Browse Helper Content Script begin");
    focusSearchInputElement(groupSearchInputElementName);
    console.debug("Crowd Group Browse Helper Content Script initialized on " + window.location.pathname);
});
