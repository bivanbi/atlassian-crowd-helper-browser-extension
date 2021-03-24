const emailInputElementId = 'email',
    usernameInputElementId = 'name',
    firstNameInputElementId = 'firstname',
    lastNameInputElementId = 'lastname',
    displayNameInputElementId = 'displayname',
    passwordInputElementId = 'password',
    passwordConfirmInputElementId = 'passwordConfirm';

let defaultEmailDomain = 'example.com';

window.addEventListener('load', () => {
    console.debug("Crowd User Add Helper Content Script begin");
    let usernameInputElement = document.getElementById(usernameInputElementId);
    usernameInputElement.addEventListener('click', mirrorUsernameToUserAddFormInputs);
    usernameInputElement.addEventListener('keyup', mirrorUsernameToUserAddFormInputs);
    usernameInputElement.addEventListener('mouseup', mirrorUsernameToUserAddFormInputs);
    usernameInputElement.addEventListener('paste', mirrorUsernameToUserAddFormInputs);
    console.log('Installed User Add Form Helper event listeners');

    let password = generateRandomString(29);
    document.getElementById(passwordInputElementId).value = password;
    document.getElementById(passwordConfirmInputElementId).value = password;
    document.getElementById(emailInputElementId).value = generateEmailAddress('');
    console.log("Crowd User Add Helper Content Script initialized on " + window.location.pathname);
});

function mirrorUsernameToUserAddFormInputs(event) {
    document.getElementById(emailInputElementId).value = generateEmailAddress(event.target.value);
    document.getElementById(firstNameInputElementId).value = event.target.value;
    document.getElementById(lastNameInputElementId).value = event.target.value;
    document.getElementById(displayNameInputElementId).value = event.target.value;
}

function generateEmailAddress(localPart) {
    return localPart + "@" + defaultEmailDomain;
}
