import { assets } from "../profile.js";
import leftContainer from "../collapseFunctionality.js";

function setupNewRoomButton(newRoomButton, newRoomFormDiv) {
        toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, true);
        setupOutsideClickHandler(newRoomButton, newRoomFormDiv);
}

function toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, isVisible) {
    newRoomButton.style.display = isVisible ? "none" : "block";
    newRoomFormDiv.style.display = isVisible ? "block" : "none";
}

function setupOutsideClickHandler(newRoomButton, newRoomFormDiv) {
    let triggerCount = 0;
    const clickHandler = function(e) {
        console.log(e.target);
        if (!newRoomFormDiv.contains(e.target) && e.target !== newRoomButton) {
            toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, false);
        }
        triggerCount++;
        if (triggerCount >= 2) {
            document.removeEventListener('click', clickHandler);
        }
    };
    document.addEventListener('click', clickHandler);
}

const handleNewRoomFormSubmit = async (event, newRoomNameInput, roomsHierarchy, newRoomButton, newRoomFormDiv) => {
    event.preventDefault();
    const newRoomName = newRoomNameInput.value;
    if (newRoomName !== "") {
        const result = await assets.addNewContainer(newRoomName);
        leftContainer.renderRoom(roomsHierarchy, result, assets.getAssets());
    }
    toggleRoomFormVisibility(newRoomButton, newRoomFormDiv, false);
}

export { setupNewRoomButton, setupOutsideClickHandler, handleNewRoomFormSubmit }