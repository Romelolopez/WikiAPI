/**
 * STEPS:
 *
 * 1. Extract all selectors, create helper functions
 * 2. Read through the API's documentation and understand what needs to be included in the params of the request,
 *    create a generic params object
 * 3. Register event listeners, fetch the data per the user's input
 * 4. Output results to the UI (success and error)
 * 5. Adjust UI states accordingly
 */

const submitButton = document.querySelector("#submit")
const input = document.querySelector("#input")
const errorSpan = document.querySelector("#error")
const resultsContainer = document.querySelector("#results")
const endpoint = "https://en.wikipedia.org/w/api.php?"
const params = {
    origin: "*",
    action: "query",
    format: "json",
    prop: "extracts",
    exchars: "250",
    exintro: true,
    explaintext: true,
    generator: "search",
    gsrlimit: 20,
}

const disableUi = () => {
    input.disabled = true
    submitButton.disabled = true
}

const enabledUi = () => {
    input.disabled = false
    submitButton.disabled = false
}

const clearPreviousResults = () => {
    resultsContainer.innerHTML = ""
    errorSpan.innerHTML = ""
}


const isInputEmpty = (input) => {
    if (!input || input === ""){
        return true
    } else {
        return false
    }
}

const showError = error => {
    errorSpan.innerHTML = `${error}`
}

const showResults = results => {
    results.forEach(result => {
        resultsContainer.innerHTML += `
        <div class="results__item">
            <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                <h2 class="results__item__title">${result.title}</h2>
                <p class="results__item__intro">${result.intro}</p>
            </a>
        </div>
    `;
    });
};


const gatherData = pages => {
    //turn object to an array with object.values
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));
    //console.log(Object.values(pages))
    showResults(results);
};

const getData = async () => {
    const userInput = input.value
    if(isInputEmpty(userInput)) return;

    params.gsrsearch = userInput
    disableUi()
    try{
        //data is usually response but with this deconstructor we can go straight to data and skip a layer
        const { data } = await axios.get(endpoint, { params })
        console.log(data)
        //triggers catch blocks
        if (data.error) throw new Error(data.error.info)
        gatherData(data.query.pages)
    } catch (error) {
        showError(error)
    } finally {
        enabledUi()
    }
}

const handleKeyEvent = (e) => {
    if (e.key === "Enter") {
        getData()
    }
}
    

const registerEventHandlers = () => {
    input.addEventListener("keydown", handleKeyEvent)
    submitButton.addEventListener("click", getData)
}

registerEventHandlers()