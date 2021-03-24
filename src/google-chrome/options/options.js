let page = document.getElementById("buttonDiv");
let defaultCrowdContext = '/crowd';


function getContextInput() {
    return document.getElementById("crowdContext");
}

function getSettingsForm() {
    return document.getElementById("crowdHelperSettings");
}

console.log("onInstalled I am!");

// Reacts to a button click by marking marking the selected button and saving
// the selection
function handleSettingsFormSubmit(event) {
    event.stopPropagation();
    event.preventDefault();

    console.log("Save settings");
    //let color = event.target.dataset.color;
    saveData = {context: getContextInput().getAttribute("value"), namegvalami: 'ez'};
    console.log(saveData);
    chrome.storage.sync.set(saveData, function () {
        console.log('Settings are saved');
    });
}

// Add a button to the page for each supplied color
function constructOptions() {
    chrome.storage.sync.get(null, (data) => {
        console.log(data);
    });
    chrome.storage.sync.get("context", (data) => {
        let context = data.context;
        console.log(data);

        if (context === undefined) {
            context = defaultCrowdContext;
            console.log("No context set yet, applying default: " + context);
        }

        getContextInput().setAttribute("value", context);
        getSettingsForm().addEventListener("submit", handleSettingsFormSubmit);
    });
}

// Initialize the page by constructing the color options
constructOptions();
