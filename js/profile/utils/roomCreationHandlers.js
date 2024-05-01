import { assets } from "../profile.js";
import leftContainer from "../collapseFunctionality.js";
import {displayNotificationMessage} from "./notifications";

function setupNewRoomButton(newRoomButton, newRoomFormDiv) {
    toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, true);
    setupOutsideClickHandler(newRoomButton, newRoomFormDiv);
}

function toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, isVisible) {
    newRoomButton.style.display = isVisible ? "none" : "block";
    newRoomFormDiv.style.display = isVisible ? "block" : "none";
}

function setupOutsideClickHandler(newRoomButton, newRoomFormDiv) {
    document.onclick = (event) => {
        if (!newRoomFormDiv.contains(event.target) && event.target !== newRoomButton) {
            toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, false);
        }
    }
}

const handleNewRoomFormSubmit = async (event, newRoomNameInput, roomsHierarchy, newRoomButton, newRoomFormDiv) => {
    event.preventDefault();
    const newRoomName = newRoomNameInput.value;
    if (newRoomName !== "") {
        try {
            const result = await assets.addNewContainer(newRoomName);
            leftContainer.renderRoom(roomsHierarchy, result, assets.getAssets());
        } catch (error) {
            displayNotificationMessage('Something went wrong. Please, try again later.')
            console.error(error)
        }
    }
    toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, false);
}

export { setupNewRoomButton, setupOutsideClickHandler, handleNewRoomFormSubmit }