const atlassianTokenInputElementId = 'atl_token',
    signatureToAugmentedElements = '(CrowdHelper)',
    auiMessageBaseClass = 'aui-message',
    directoryGetURI = '/rest/admin/latest/directory/detailed',
    auiSeverityMap = {
        'info': 'aui-message-info',
        'warning': 'aui-message-warning',
        'error': 'aui-message-error',
        'success': 'aui-message-success',
    },
    directoryJsonValuesKey = 'values',
    progressMessagePrepend = 'Progress: ',
    buttonBaseClass = 'aui-button',
    standardButtonClass = '',
    primaryButtonClass = 'aui-button-primary',
    buttonContainerClass = 'buttons-container',
    buttonDivClass = 'buttons',
    formGroupFieldSetElement = 'fieldset',
    formGroupFieldSetClass = 'group',
    checkboxClass = 'checkbox',
    crowdHelperProgressContainerElementId = 'crowdHelperProgressContainer';


function generateRandomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getHTML(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject(status + ' '  + xhr.statusText);
            }
        };
        xhr.onerror = function () {
            reject(this.status + ' ' + xhr.statusText);
        };
        xhr.send();
    });
}

function getJSON(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}

function sendPostForm(url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest(),
            returnData = Object.assign({}, data);
        let postParameters = new URLSearchParams(data).toString();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            let status = xhr.status;
            if (status === 200) {
                console.debug("sendPostForm success: " + this.status + ' ' + xhr.statusText);
                resolve(returnData);
            } else {
                console.debug("sendPostForm status >= 300: " + this.status + ' ' + xhr.statusText);
                reject(status + ' ' + xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.debug("sendPostForm onerror: " + this.status + ' ' + xhr.statusText);
            reject(this.status + ' ' + xhr.statusText);
        };
        xhr.send(postParameters);
    });
}

function loadFormForAtlassianToken() {
    return getHTML(document.location.href).then(function (html) {
        let doc = document.implementation.createHTMLDocument("");
        doc.documentElement.innerHTML = html;
        return doc.getElementById(atlassianTokenInputElementId).value;
    });
}

let directories = [];
let directoryMap = {};
let directoryDisplayNameKey = 'displayName';

function makeDirectoryMap() {
    directories.forEach((directory) => {
        directoryMap[directory.id] = directory;
    });
}

function loadDirectoryList() {
    let url = window.location.origin + directoryGetURI;
    console.debug('loading directory list from ' + url);
    getJSON(url,
        function (err, data) {
            if (err !== null) {
                alert('Failed to load directory list, Crowd Helper Plugin will not function as expected! ' + err);
                console.error('Failed to load directory list: ' + err);
            } else if (directoryJsonValuesKey in data) {
                console.debug('Loaded directories');
                directories = data[directoryJsonValuesKey];
                makeDirectoryMap();
                console.debug(directoryMap);
            } else {
                console.debug('Loaded directories:');
                console.debug(data);
            }
        });
}

function ProgressStatus(statusElement, messagePrepend) {
    this.statusElement = statusElement;
    this.messagePrepend = messagePrepend;
    this.inProgress = 0;
    this.finished = 0;
    this.failed = 0;
    this.succeeded = 0;

    this.progressFailedMessage = '';

    this.updateStatusElement = () => {
        updateProgressStatusElement(this);
    };

    this.initProgress = (elementCount) => {
        this.inProgress = elementCount;
        this.finished = this.succeeded = this.failed = 0;
        this.progressFailedMessage = '';
        this.updateStatusElement();
    };

    this.failProgressWithMessage = (message) => {
        this.progressFailedMessage = message;
        this.updateStatusElement();
    };
}

function createProgressStatusElement(id) {
    let div = document.createElement("div");
    div.setAttribute("id", id);
    div.classList.add(auiMessageBaseClass);
    return div;
}

function getAuiSeverity(severity) {
    if (severity in auiSeverityMap) {
        return auiSeverityMap[severity];
    }
    return auiSeverityMap['error'];
}

function updateProgressStatusElement(progressStatus) {
    for (const auiSeverity in auiSeverityMap) {
        progressStatus.statusElement.classList.remove(auiSeverityMap[auiSeverity]);
    }

    if (progressStatus.progressFailedMessage) {
        progressStatus.statusElement.innerText = progressStatus.progressFailedMessage;
        progressStatus.statusElement.classList.add(getAuiSeverity('error'));
        return;
    }

    let message = progressStatus.messagePrepend,
        severity;

    if (progressStatus.inProgress === 0) {
        if (progressStatus.finished) {
            severity = 'success';
            message += 'finished';
        } else {
            severity = 'info';
            message += 'idle';
        }
    } else {
        severity = 'warning';
        message += 'in progress: ' + progressStatus.inProgress;
    }

    if (progressStatus.failed) {
        severity = 'error';
    }

    message += ', Success: ' + progressStatus.succeeded + ', failed: ' + progressStatus.failed;

    progressStatus.statusElement.innerText = message;
    progressStatus.statusElement.classList.add(getAuiSeverity(severity));
}

function createButtonElement(id, htmlClass, text) {
    let button = document.createElement("button");
    button.setAttribute("id", id);
    button.setAttribute("name", id);
    button.classList.add(buttonBaseClass);
    if (htmlClass) {
        button.classList.add(htmlClass);
    }
    button.innerText = text;
    return button;
}

function createStandardButtonElement(id, text) {
    return createButtonElement(id, standardButtonClass, text);
}

function createPrimaryButtonElement(id, text) {
    return createButtonElement(id, primaryButtonClass, text);
}

function getSelectedDirectoryList(allDirectoriesSelectedCheckboxElementId, singleSelectedDirectoryId) {
    console.debug("Get selected directory list: all direcrories selected checkbox element id: "
        + allDirectoriesSelectedCheckboxElementId + ", single selected directory ID: " + singleSelectedDirectoryId)
    let allDirectoriesSelectedCheckboxElement = document.getElementById(allDirectoriesSelectedCheckboxElementId);
    let directoryList;
    if (allDirectoriesSelectedCheckboxElement.checked) {
        directoryList = directories;
    } else {
        if (singleSelectedDirectoryId < 1) {
            throw new Error("Directory ID less than one (is valid directory selected?)");
        }
        directoryList = [directoryMap[singleSelectedDirectoryId]];
    }

    if (directoryList.length < 1) {
        throw new Error("CrowdHelper: unexpected error: directory list is empty");
    }

    return directoryList;
}

function focusSearchInputElement(searchInputElementName) {
    new CrowdSearchInputElementPromiser(searchInputElementName).get()
        .then((element) => {
            console.log("Focusing search input");
            element.focus();
        });
}
