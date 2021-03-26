const emailInputElementId = 'email',
    usernameInputElementId = 'name',
    firstNameInputElementId = 'firstname',
    lastNameInputElementId = 'lastname',
    displayNameInputElementId = 'displayname',
    passwordInputElementId = 'password',
    passwordConfirmInputElementId = 'passwordConfirm';

let options = new Options(),
    emailDomain = 'example.com';

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
    options.load().then(() => {
        emailDomain = options.emailDomain;
        updateEmailInputElementValue(generateEmailAddress(''));
    })
    console.log("Crowd User Add Helper Content Script initialized on " + window.location.pathname);
});

function mirrorUsernameToUserAddFormInputs(event) {
    updateEmailInputElementValue(generateEmailAddress(event.target.value));
    document.getElementById(firstNameInputElementId).value = event.target.value;
    document.getElementById(lastNameInputElementId).value = event.target.value;
    document.getElementById(displayNameInputElementId).value = event.target.value;
}

function generateEmailAddress(localPart) {
    return localPart + "@" + emailDomain;
}

function updateEmailInputElementValue(email) {
    getEmailInputElement().value = email;
}

function getEmailInputElement() {
    return document.getElementById(emailInputElementId);
}
