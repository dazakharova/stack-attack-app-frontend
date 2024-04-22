import {assets} from "./profile.js"

const searchingForm = document.getElementById("searching-form")
const searchingInput = document.getElementById("searching-input")
const resultsDropdown = document.getElementById("search-results-dropdown")

searchingForm.onsubmit = (event) => {
    event.preventDefault()

    const searchedItem = searchingInput.value

    const foundItems = assets.searchItems(searchedItem)

    // Clear previous results
    resultsDropdown.innerHTML = '';

    // Populate dropdown with new results
    foundItems.forEach(item => {
        renderResultLink(item, resultsDropdown)
    })

    // Show the dropdown
    if(foundItems.length > 0) {
        resultsDropdown.style.display = 'block';
    } else {
        resultsDropdown.style.display = 'none';
    }

    // search value in the map
    // display found values
    // when value is selected -> render path to it and contents of the last container the searched item is in
}

// Optional: Hide dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('#searching-input')) {
        resultsDropdown.style.display = "none";
    }
}

const renderResultLink = (item, resultsDropdown) => {
    const resultLink = document.createElement('a')
    resultLink.href = '#' // Set appropriate link or JavaScript action
    resultLink.setAttribute("data-id", item.getId())
    resultLink.setAttribute("data-containerId", item.getContainerId())
    resultLink.textContent = item.getName() // Assuming your items have a 'name' property
    resultLink.onclick = function() {
        console.log('Item clicked:', item)
        // Handle click, possibly navigate or display item details
    }

    resultsDropdown.appendChild(resultLink)
}
