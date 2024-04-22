import {assets} from "./profile.js"
import {updateContentsInRightContainer} from "./uiDynamicUpdate.js";
import {Container} from "../class/Container.js";
import { addRoomToPath, addContainerToPath } from "./locationPath.js";

// Retrieve elements from the DOM
const searchingForm = document.getElementById("searching-form")
const searchingInput = document.getElementById("searching-input")
const resultsDropdown = document.getElementById("search-results-dropdown")

// Handles the search operation and displays results in a dropdown
const handleSearch = () => {
    // Retrieve the search query from the input field
    const searchedItem = searchingInput.value

    // Perform the search and retrieve matched items
    const foundItems = assets.searchItems(searchedItem)

    // Clear previous results
    resultsDropdown.innerHTML = ''

    // Check if any items were found
    if(foundItems.length > 0) {
        // Populate dropdown with new results
        foundItems.forEach(item => {
            renderResultLink(item, resultsDropdown)
        })

        // Display the dropdown with search results
        resultsDropdown.style.display = 'block'
    } else {
        // Display a message if no items are found
        renderResultsMessage(resultsDropdown)
    }
}

// Event listener for the search form submission
searchingForm.onsubmit = (event) => {
    event.preventDefault()

    handleSearch()
}

// Event listener for keyup to enable search on 'Enter' press
searchingInput.onkeyup = (event) => {
    if (event.key === 'Enter') {
        handleSearch()
    }
}

// Hide the dropdown and clear the search input when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('#searching-input') && !event.target.matches('#search-button')) {
        resultsDropdown.style.display = "none"
        searchingInput.value = ''
    }
}

// Creates a link for each search result and defines its onclick behavior
const renderResultLink = (item, resultsDropdown) => {
    // Create link for holding each search result
    const resultLink = document.createElement('a')
    resultLink.href = '#' // Set appropriate link or JavaScript action
    resultLink.setAttribute("data-id", item.getId())
    resultLink.setAttribute("data-containerId", item.getContainerId())
    resultLink.textContent = item.getName()

    // Once the link clicked, render it in the right section and specify the path to it in the location-info section
    resultLink.onclick = function() {
        // Clear search input and hide dropdown
        searchingInput.value = '' // Clear the search input when an item is selected
        resultsDropdown.style.display = "none"

        // Retrieve and display the contents of the container holding the selected item
        const containerContents = assets.getAssets().get(item.getContainerId())
        updateContentsInRightContainer(document.querySelector('.space-container'), containerContents, assets.getAssets())

        // Construct and display the path to the selected item
        const topLevelPath = assets.findPathToTopLevelContainer(item.getContainerId())
        constructPathToItem(topLevelPath, assets.getAssets())
    }

    // Append the constructed link to the dropdown
    resultsDropdown.appendChild(resultLink)
}

// Displays a message in the dropdown when no search results are found
const renderResultsMessage = (resultsDropdown) => {
    // Display a message when no items are found
    const noResultsMsg = document.createElement('div')
    noResultsMsg.textContent = 'No items found.'
    noResultsMsg.classList.add('no-results-message')
    resultsDropdown.appendChild(noResultsMsg)

    // Show the dropdown with the message
    resultsDropdown.style.display = 'block'
}

// Constructs the navigational path to the selected item and updates the UI accordingly
const constructPathToItem = (path, assetsMap) => {
    // Initialize the path with the top container and add it to the location path UI
    assetsMap.get(null).forEach(asset => {
        if (asset instanceof Container && asset.getId() === path[0]) {
            addRoomToPath(asset.getId(), asset.getName(), document.getElementById('location-info'), assetsMap)
        }
    })

    // Add each container in the path to the location path UI until reaching the selected item
    while (path.length > 0) {
        assetsMap.get(path.shift()).forEach(asset => {
            if (asset instanceof Container && asset.getId() === path[0]) {
                addContainerToPath(asset.getId(), asset.getName(), asset.getParentId(), document.getElementById('location-info'), assetsMap)
            }
        })
    }

}

