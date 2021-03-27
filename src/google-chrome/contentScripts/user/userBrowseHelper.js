const userSearchInputElementName = 'search';

window.addEventListener('load', () => {
    console.debug("Crowd User Browse Helper Content Script begin");
    focusSearchInputElement(userSearchInputElementName);
    console.debug("Crowd User Browse Helper Content Script initialized on " + window.location.pathname);
});
