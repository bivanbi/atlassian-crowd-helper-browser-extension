const groupRemoveFormClassName = 'aui',
    groupNameInputElementId = 'name',
    groupDirectoryInputElementId = 'directoryID',
    removeGroupFromAllDirectoriesElementId = 'removeGroupFromAllDirectoriesElementId';

let progressStatusElement = createProgressStatusElement(crowdHelperProgressContainerElementId),
    removeGroupProgress = new ProgressStatus(progressStatusElement, progressMessagePrepend);

window.addEventListener('load', () => {
    console.debug("Crowd Group Remove Helper Content Script begin");
    loadDirectoryList();
    augmentGroupRemoveForm();
    getGroupRemoveFormElement().addEventListener('submit', onGroupRemoveFormSubmit);
    console.log("Crowd Group Remove Helper Content Script initialized on " + window.location.pathname);
});

function augmentGroupRemoveForm() {
    let form = getGroupRemoveFormElement();
    let fieldSet = document.createElement(formGroupFieldSetElement);
    fieldSet.classList.add(formGroupFieldSetClass);

    let checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add(checkboxClass);

    checkboxContainer.appendChild(createRemoveGroupFromAllDirectoriesCheckboxElement());
    checkboxContainer.appendChild(createRemoveGroupFromAllDirectoriesLabelElement());
    fieldSet.appendChild(checkboxContainer);
    form.appendChild(fieldSet);
}

function createRemoveGroupFromAllDirectoriesCheckboxElement() {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", removeGroupFromAllDirectoriesElementId);
    checkbox.classList.add(checkboxClass);
    checkbox.setAttribute("name", removeGroupFromAllDirectoriesElementId);
    return checkbox;
}

function createRemoveGroupFromAllDirectoriesLabelElement() {
    let label = document.createElement("label");
    label.setAttribute("for", removeGroupFromAllDirectoriesElementId);
    label.innerText = "Remove group from all directories " + signatureToAugmentedElements;
    return label;
}

function getGroupRemoveFormElement() {
    return document.getElementsByClassName(groupRemoveFormClassName)[0];
}

function onGroupRemoveFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    console.debug("Group remove from submit");

    try {

        let formData = Object.fromEntries(new FormData(event.target).entries()),
            targetUrl = event.target.getAttribute("action");

        delete formData[removeGroupFromAllDirectoriesElementId];
        let directoryList = getDirectoryListForSubmission(formData);
        removeGroupProgress.initProgress(directoryList.length);
        event.target.appendChild(progressStatusElement);

        submitRemoveGroupFormToArrayOfDirectories(targetUrl, formData, directoryList)
            .then(function () {
                console.log('Finished removing group from ' + directoryList.length + ' directories');
            });

    } catch (e) {
        console.error(e);
        addGroupProgress.failProgressWithMessage('Failed: ' + e);
        event.target.form.appendChild(progressStatusElement);
    }
}

function getDirectoryListForSubmission(formData) {
    console.debug("Form data:");
    console.debug(formData);

    let selectedDirectoryId = getDirectoryIdFromGroupRemoveFormData(formData);
    return getSelectedDirectoryList(removeGroupFromAllDirectoriesElementId, selectedDirectoryId)
}

function getDirectoryIdFromGroupRemoveFormData(data) {
    return data[groupDirectoryInputElementId];
}

async function submitRemoveGroupFormToArrayOfDirectories(url, data, directories) {
    console.debug("Removing group from " + directories.length + " directories");
    removeGroupProgress.inProgress = directories.length;

    for (let i = 0; i < directories.length; i++) {
        let directory = directories[i],
            submitData = Object.assign({}, data);
        console.debug('Removing group ' + getGroupNameFromFormData(submitData) + ' from directory ' + directory[directoryDisplayNameKey]);
        submitData[groupDirectoryInputElementId] = directory.id;
        await submitRemoveGroupForm(url, submitData);
    }
}

function getGroupNameFromFormData(data) {
    return data[groupNameInputElementId];
}

function submitRemoveGroupForm(url, data) {
    return loadFormForAtlassianToken().then(function (token) {
        console.debug("loaded new token: " + token);
        data["atl_token"] = token;
        return sendPostForm(url, data);
    }).then(function (submittedData) {
        removeGroupProgress.succeeded++;
        console.log("Group '" + getGroupNameFromFormData(submittedData) + "' removed from directory " + getDirectoryNameFromGroupRemoveFormData(data));
    }).catch(function (reason) {
        removeGroupProgress.failed++;
        console.error("Group '" + getGroupNameFromFormData(data) + "' failed to remove from directory " + getDirectoryNameFromGroupRemoveFormData(data) + ': ' + reason);
    }).finally(function () {
        removeGroupProgress.inProgress--;
        removeGroupProgress.finished++;
        removeGroupProgress.updateStatusElement();
    });
}

function getDirectoryNameFromGroupRemoveFormData(data) {
    let directory = directoryMap[getDirectoryIdFromGroupRemoveFormData(data)];
    return directory[directoryDisplayNameKey];
}
