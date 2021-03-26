const STATUS_OK = 'OK',
    STATUS_FAILED = 'FAILED',
    HTML_CLASS_ALERT_DANGER = 'alert-danger',
    HTML_CLASS_ALERT_SUCCESS = 'alert-success',
    HTML_CLASS_INVISIBLE = 'invisible';

function constructOptions() {
    chrome.storage.sync.get("options", (data) => {
        options = data.options || {};
        console.debug("Stored options:");
        console.debug(options);
        getEmailDomainInput().value = options.emailDomain || '';
        getOptionsForm().addEventListener("submit", handleOptionsFormSubmit);
        getResetSettingsButton().addEventListener("click", handleResetSettingsButtonClick);
    });
}

function getEmailDomainInput() {
    return document.getElementById("systemWideDefaultEmailDomain");
}

function getOptionsForm() {
    return document.getElementById("crowdHelperOptions");
}

function getResetSettingsButton() {
    return document.getElementById("resetSettings")
}

function handleOptionsFormSubmit(event) {
    event.stopPropagation();
    event.preventDefault();

    console.log("Save options");
    console.log(getEmailDomainInput().value);
    let options = {emailDomain: getEmailDomainInput().value},
        saveData = {options: options};
    chrome.storage.sync.set(saveData, function () {
        console.log('Options are saved');
        updateStatus(STATUS_OK, "Saved")
    });
}

function updateStatus(status, message) {
    let statusElement = getSubmitStatusElement()
    resetStatusElement()
    if (status === STATUS_OK) {
        statusElement.classList.add(HTML_CLASS_ALERT_SUCCESS)
    } else {
        statusElement.classList.add(HTML_CLASS_ALERT_DANGER)
    }
    statusElement.innerText = message
}

function resetStatusElement()
{
    getSubmitStatusElement().classList.remove(HTML_CLASS_INVISIBLE, HTML_CLASS_ALERT_DANGER, HTML_CLASS_ALERT_SUCCESS)
}
function getSubmitStatusElement() {
    return document.getElementById("submitStatus")
}

function handleResetSettingsButtonClick(event) {
    event.stopPropagation()
    event.preventDefault()
    if (!confirm("Are you sure you want to erase all stored settings?")) {
        return
    }

    console.debug("Reset settings requested");
    chrome.storage.sync.clear(() => {
        console.debug("Reloading");
        location.reload();
    });
}

constructOptions();
