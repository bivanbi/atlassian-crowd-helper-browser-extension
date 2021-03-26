const STATUS_OK = 'OK',
    STATUS_FAILED = 'FAILED',
    HTML_CLASS_ALERT_DANGER = 'alert-danger',
    HTML_CLASS_ALERT_SUCCESS = 'alert-success',
    HTML_CLASS_INVISIBLE = 'invisible';

let options = new Options();

function constructOptions() {
    options.load().then(() => {
        getEmailDomainInput().value = options.emailDomain || '';
        getOptionsForm().addEventListener("submit", handleOptionsFormSubmit);
        getClearStoredDataButton().addEventListener("click", handleClearStoredDataButtonClick);
    })
}

function getEmailDomainInput() {
    return document.getElementById("systemWideDefaultEmailDomain");
}

function getOptionsForm() {
    return document.getElementById("crowdHelperOptions");
}

function getClearStoredDataButton() {
    return document.getElementById("clearStoredData")
}

function handleOptionsFormSubmit(event) {
    event.stopPropagation();
    event.preventDefault();

    console.log("Save options");
    console.log(getEmailDomainInput().value);
    options.emailDomain = getEmailDomainInput().value;
    options.save().then(() => {
        console.log('Options are saved');
        updateStatus(STATUS_OK, "Saved")
    }).catch((message) => {
        console.log('Failed to save options: ' + message);
        updateStatus(STATUS_FAILED, "Failed: " + message)
    })
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

function handleClearStoredDataButtonClick(event) {
    event.stopPropagation()
    event.preventDefault()
    if (!confirm("Are you sure you want to clear all stored data?")) {
        console.log("Clear stored data cancelled");
        return
    }

    console.log("Clear stored data confirmed");
    let storage = new StorageProvider();
    storage.clear().then(() => {
        console.log("Data cleared, reloading");
        location.reload();
    });
}

constructOptions();
