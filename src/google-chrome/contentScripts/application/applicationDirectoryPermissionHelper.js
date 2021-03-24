const applicationDirectoryPermissionFormId = 'permissionForm',
    clearAllPermissionElementId = 'clearAllPermission',
    clearAllPermissionOnAllDirectoriesButtonElementId = 'clearAllPermissionOnAllDirectoriesButton',
    clearAllPermissionOnAllDirectoriesButtonText = 'Clear all permission on all directories',
    clearAllPermissionOnAllDirectoriesProgressContainerElementId = 'clearAllPermissionOnAllDirectoriesProgressContainer',
    clearAllPermissionOnAllDirectoriesResultConfirmMessage = 'This will remove permissions for this application from all linked directories. You can add them back later. Continue?',
    applicationIdInputName = 'ID',
    toggleAllPermissionElementId = 'toggleAllPermission',
    toggleButtonText = 'Toggle',
    clearButtonText = 'Clear',
    directoryIdInputName = 'directoryId';

function toggleAllPermissionCheckboxes(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Toggle all permissions");
    let checkboxes = event.target.form.querySelectorAll("input[type='checkbox']");
    for (let checkbox of checkboxes) {
        console.log(checkbox);
        checkbox.checked = !checkbox.checked;
    }
}

function clearAllPermissionCheckboxes(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log(event);
    let checkboxes = event.target.form.querySelectorAll("input[type='checkbox']");
    console.log("Clear all permissions");
    for (let checkbox of checkboxes) {
        console.log(checkbox);
        checkbox.checked = false;
    }
}

let progressStatusElement = createProgressStatusElement(clearAllPermissionOnAllDirectoriesProgressContainerElementId);
let clearAllPermissionsProgress = new ProgressStatus(progressStatusElement, progressMessagePrepend);

function getApplicationIdFromFormData(data) {
    return data[applicationIdInputName];
}

function getDirectoryIdFromData(data) {
    return data[directoryIdInputName];
}

function getDirectoryNameFromFormData(data) {
    let directory = directoryMap[getDirectoryIdFromData(data)];
    return directory[directoryDisplayNameKey];
}

function submitClearPermissionsForm(url, data) {
    return loadFormForAtlassianToken().then(function (token) {
        console.log("loaded new token: " + token);
        data["atl_token"] = token;
        return sendPostForm(url, data);
    }).then(function (submittedData) {
        clearAllPermissionsProgress.succeeded++;
        console.log('Application ' + getApplicationIdFromFormData(submittedData) + ' permissions cleared on directory ' + getDirectoryNameFromFormData(data));
    }).catch(function (reason) {
        clearAllPermissionsProgress.failed++;
        console.error('Application ' + getApplicationIdFromFormData(data) + ' failed to clear permissions on directory ' + getDirectoryNameFromFormData(data) + ': ' + reason);
    }).finally(function () {
        clearAllPermissionsProgress.inProgress--;
        clearAllPermissionsProgress.finished++;
        clearAllPermissionsProgress.updateStatusElement();
    });
}

function getApplicationIdFromEvent(event) {
    let applicationIdSelector = "input[name='" + applicationIdInputName + "']";
    return event.target.form.querySelector(applicationIdSelector).getAttribute("value");
}

function getApplicationDirectoryIdListFromEvent(event) {
    let directoryIdSelector = "select[name='" + directoryIdInputName + "']",
        selectElement = event.target.form.querySelector(directoryIdSelector),
        directoryIdList = [];

    console.log("getApplicationDirectoryIdListFromEvent");
    console.log(selectElement.options);
    for (let i = 0; i < selectElement.options.length; i++) {
        let value = selectElement.options[i].value;
        console.log(value);
        if (value) {
            directoryIdList.push(value);
        }
    }
    return directoryIdList;
}

async function submitClearAllPermissionsOnAllDirectories(event) {
    let form = event.target.form,
        applicationId = getApplicationIdFromEvent(event),
        formData = {},
        targetUrl = event.target.form.getAttribute("action"),
        directoryList = getApplicationDirectoryIdListFromEvent(event);

    clearAllPermissionsProgress.initProgress(directoryList.length);
    clearAllPermissionsProgress.updateStatusElement();
    form.appendChild(progressStatusElement);
    formData[applicationIdInputName] = applicationId;

    for (let i = 0; i < directoryList.length; i++) {
        let directory = directoryMap[directoryList[i]],
            submitData = Object.assign({}, formData);
        console.log('Clearing directory permissions, app ID: ' + submitData[applicationIdInputName] + ', directory directory ' + directory[directoryDisplayNameKey]);
        submitData[directoryIdInputName] = directory.id;
        await submitClearPermissionsForm(targetUrl, submitData);
    }
}

function clearAllPermissionOnAllDirectories(event) {
    event.stopPropagation();
    event.preventDefault();
    console.log(event);

    if (confirm(clearAllPermissionOnAllDirectoriesResultConfirmMessage)) {
        console.log("Confirmed removal of all permissions from all directories associated with this application.");
        submitClearAllPermissionsOnAllDirectories(event)
            .then(function () {
                console.log('Finished removing permissions on ' + directories.length + ' directories');
                clearAllPermissionCheckboxes(event);
            });

    } else {
        console.log("Rejected removal of all permissions from all directories associated with this application. Noop.");
    }
}

function createToggleAllPermissionButtonElement() {
    let button = createStandardButtonElement(toggleAllPermissionElementId, toggleButtonText);
    button.addEventListener('click', toggleAllPermissionCheckboxes);
    return button;
}

function createClearAllPermissionButtonElement() {
    let button = createStandardButtonElement(clearAllPermissionElementId, clearButtonText);
    button.addEventListener('click', clearAllPermissionCheckboxes);
    return button;
}

function createClearAllPermissionOnAllDirectoriesButtonElement() {
    let button = createPrimaryButtonElement(clearAllPermissionOnAllDirectoriesButtonElementId, clearAllPermissionOnAllDirectoriesButtonText);
    button.addEventListener('click', clearAllPermissionOnAllDirectories);
    return button;
}

function createButtonsContainer() {
    let buttonContainer = document.createElement("div");

    buttonContainer.classList.add(buttonContainerClass);
    return buttonContainer;
}

function createButtonsDiv() {
    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add(buttonDivClass);
    return buttonDiv;
}

function augmentApplicationDirectoryPermissionForm() {
    let form = document.getElementById(applicationDirectoryPermissionFormId);

    let buttonContainer = createButtonsContainer();
    let buttonDiv = createButtonsDiv();

    buttonDiv.appendChild(createToggleAllPermissionButtonElement());
    buttonDiv.appendChild(createClearAllPermissionButtonElement());
    buttonDiv.appendChild(createClearAllPermissionOnAllDirectoriesButtonElement());
    buttonContainer.appendChild(buttonDiv);
    form.appendChild(buttonContainer);
}

window.addEventListener('load', () => {
    console.log("Crowd Application Directory permission Helper Content Script begin");
    loadDirectoryList();
    augmentApplicationDirectoryPermissionForm();
    console.log("Crowd Group Add Helper Content Script initialized on " + window.location.pathname);
});
