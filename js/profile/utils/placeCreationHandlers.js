import {displayNotificationMessage, showNotification} from "./notifications.js";
import {updateContentsInLeftMenu, updateContentsInRightContainer} from "./uiDynamicUpdate.js";
import {assets} from "../profile.js";

const setupNewPlaceModal = (event, newPlaceModal, currentLocationPathDiv, assetsBlocksDiv) => {
    event.preventDefault()

    if (document.querySelector('#location-info button') === null) {
        showNotification();
        return;
    }
    newPlaceModal.style.display = 'block';

    document.getElementById("new-place-form").onsubmit = event => handleNewPlaceFormSubmit(event, newPlaceModal, currentLocationPathDiv, assetsBlocksDiv);
}

const handleNewPlaceFormSubmit = async (event, newPlaceModal, currentLocationPathDiv, assetsBlocksDiv) => {
    try {
        event.preventDefault(); // Prevent the form from submitting to a server

        // Get id of parent container inside which a new place must be rendered
        const parentId = parseInt(currentLocationPathDiv.lastElementChild.getAttribute("data-id"))

        // Get given name for a new place
        const placeName = document.getElementById("place-name-input").value

        // Returns just added new item id
        const newContainer = await assets.addNewContainer(placeName, parentId)

        // Get current parent container contents and rerender them in both sections
        const parentCurrentContainerContents = assets.getAssets().get(parentId)
        updateContentsInLeftMenu(parentId, assets.getAssets())
        updateContentsInRightContainer(assetsBlocksDiv, parentCurrentContainerContents, assets.getAssets())

        // Reset input field
        document.getElementById("place-name-input").value = ''

        // Hide the modal after handling the data
        newPlaceModal.style.display = 'none';
    } catch (error) {
        displayNotificationMessage('Something went wrong. Please, try again later.')
        console.error(error)
    }

}

export { setupNewPlaceModal }