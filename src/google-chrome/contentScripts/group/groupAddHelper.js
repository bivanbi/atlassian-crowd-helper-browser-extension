const groupAddFormElementId = 'addGroupForm',
    groupNameInputElementId = 'name',
    groupDirectoryInputElementId = 'directoryID',
    addGroupToAllDirectoriesElementId = 'addGroupToAllDirectories';

let progressStatusElement = createProgressStatusElement(crowdHelperProgressContainerElementId),
    addGroupProgress = new ProgressStatus(progressStatusElement, progressMessagePrepend);

window.addEventListener('load', () => {
    console.debug("Crowd Group Add Helper Content Script begin");
    loadDirectoryList();
    augmentGroupAddForm();
    makeGroupNameInputRequired();
    document.getElementById(groupAddFormElementId).addEventListener('submit', onGroupAddFormSubmit);
    console.debug("Crowd Group Add Helper Content Script initialized on " + window.location.pathname);
});

function augmentGroupAddForm() {
    let form = document.getElementById(groupAddFormElementId);
    let fieldSet = document.createElement(formGroupFieldSetElement);
    fieldSet.classList.add(formGroupFieldSetClass);

    let checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add(checkboxClass);

    checkboxContainer.appendChild(createAddGroupToAllDirectoriesCheckboxElement());
    checkboxContainer.appendChild(createAddGroupToAllDirectoriesLabelElement());
    fieldSet.appendChild(checkboxContainer);
    form.appendChild(fieldSet);
}

function createAddGroupToAllDirectoriesCheckboxElement() {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("id", addGroupToAllDirectoriesElementId);
    checkbox.classList.add(checkboxClass);
    checkbox.setAttribute("name", addGroupToAllDirectoriesElementId);
    return checkbox;
}

function createAddGroupToAllDirectoriesLabelElement() {
    let label = document.createElement("label");
    label.setAttribute("for", addGroupToAllDirectoriesElementId);
    label.innerText = "Add group to all directories " + signatureToAugmentedElements;
    return label;
}

function makeGroupNameInputRequired() {
    document.getElementById(groupNameInputElementId).setAttribute("required", "");
}

function onGroupAddFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    console.debug("Group add from submit");
    try {
        let formData = Object.fromEntries(new FormData(event.target).entries()),
            targetUrl = event.target.getAttribute("action");

        delete formData[addGroupToAllDirectoriesElementId];

        let directoryList = getDirectoryListForSubmission(formData);
        addGroupProgress.initProgress(directoryList.length);
        event.target.appendChild(progressStatusElement);

        submitAddGroupFormToArrayOfDirectories(targetUrl, formData, directoryList)
            .then(function () {
                console.log('Finished adding group to ' + directoryList.length + ' directories');
            });

    } catch (e) {
        console.error(e)
        addGroupProgress.failProgressWithMessage('Failed: ' + e)
        event.target.appendChild(progressStatusElement);
    }
}

function getDirectoryListForSubmission(formData) {
    let selectedDirectoryId = getDirectoryIdFromFormData(formData);
    return getSelectedDirectoryList(addGroupToAllDirectoriesElementId, selectedDirectoryId)
}

function getDirectoryIdFromFormData(data) {
    return data[groupDirectoryInputElementId];
}

function getGroupNameFromFormData(data) {
    return data[groupNameInputElementId];
}

async function submitAddGroupFormToArrayOfDirectories(url, data, directories) {
    console.log("Adding group to " + directories.length + " directories");
    console.debug(directories);
    for (let i = 0; i < directories.length; i++) {
        let directory = directories[i],
            submitData = Object.assign({}, data);
        console.debug(submitData);
        console.debug(directory);
        console.debug('Adding group ' + getGroupNameFromFormData(submitData) + ' to directory ' + directory[directoryDisplayNameKey]);
        submitData[groupDirectoryInputElementId] = directory.id;
        await submitAddGroupForm(url, submitData);
    }
}

function submitAddGroupForm(url, data) {
    return loadFormForAtlassianToken().then(function (token) {
        console.debug("loaded new token: " + token);
        data["atl_token"] = token;
        return sendPostForm(url, data);
    }).then(function (submittedData) {
        addGroupProgress.succeeded++;
        console.log("Group '" + getGroupNameFromFormData(submittedData) + "' added to directory " + getDirectoryNameFromFormData(data));
    }).catch(function (reason) {
        addGroupProgress.failed++;
        console.error("Group '" + getGroupNameFromFormData(data) + "' failed to add to directory " + getDirectoryNameFromFormData(data) + ': ' + reason);
    }).finally(function () {
        addGroupProgress.inProgress--;
        addGroupProgress.finished++;
        addGroupProgress.updateStatusElement();
    });
}

function getDirectoryNameFromFormData(data) {
    let directory = directoryMap[getDirectoryIdFromFormData(data)];
    return directory[directoryDisplayNameKey];
}
