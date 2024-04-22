import {assets} from "./profile.js"

const searchingForm = document.getElementById("searching-form")
const searchingInput = document.getElementById("searching-input")
const resultsDropdown = document.getElementById("search-results-dropdown")

const handleSearch = () => {
    const searchedItem = searchingInput.value

    const foundItems = assets.searchItems(searchedItem)

    // Clear previous results
    resultsDropdown.innerHTML = ''

    if(foundItems.length > 0) {
        // Populate dropdown with new results
        foundItems.forEach(item => {
            renderResultLink(item, resultsDropdown)
        })

        // Show the dropdown
        resultsDropdown.style.display = 'block'
    } else {
        renderResultsMessage(resultsDropdown)
    }

    // search value in the map
    // display found values
    // when value is selected -> render path to it and contents of the last container the searched item is in
}

searchingForm.onsubmit = (event) => {
    event.preventDefault()

    handleSearch()
}

searchingInput.onkeyup = (event) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
}

// Optional: Hide dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('#searching-input') && !event.target.matches('#search-button')) {
        resultsDropdown.style.display = "none"
        searchingInput.value = ''
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

        searchingInput.value = '' // Clear the search input when an item is selected
        resultsDropdown.style.display = "none"

        // Handle click, possibly navigate or display item details
    }

    resultsDropdown.appendChild(resultLink)
}

const renderResultsMessage = (resultsDropdown) => {
    // Display a message when no items are found
    const noResultsMsg = document.createElement('div')
    noResultsMsg.textContent = 'No items found.'
    noResultsMsg.classList.add('no-results-message')
    resultsDropdown.appendChild(noResultsMsg)

    // Show the dropdown with the message
    resultsDropdown.style.display = 'block'
}
