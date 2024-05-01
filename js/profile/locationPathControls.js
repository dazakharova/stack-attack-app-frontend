import rightContainer from './containerRenderHelpers.js';
import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";


const removeLastLocationIfSameParent = (lastLocation, triggeredLocationParentId) => {
    const lastLocationParentId = lastLocation.getAttribute("data-parentId");
    if (triggeredLocationParentId == lastLocationParentId) {
        // Remove the preceding arrow icon
        const previousElement = lastLocation.previousElementSibling;
        previousElement.remove();

        lastLocation.remove();
    }
}

const removeLocationsWithHigherParentId = (containerParentId, currentLocationPathDiv) => {
    if (currentLocationPathDiv.lastElementChild.getAttribute("id") !== 'room-name') {
        while (containerParentId < currentLocationPathDiv.lastElementChild.getAttribute("data-parentid")) {
            currentLocationPathDiv.lastElementChild.remove();
        }
    }
}

const handleContainerButtonClick = (containerButton, assetsBlocksDiv, assetsMap) => {
    let nextSibling = containerButton.nextElementSibling;
    while (nextSibling) {
        const toRemove = nextSibling;
        nextSibling = nextSibling.nextElementSibling;
        toRemove.remove();
    }

    const id = parseInt(containerButton.getAttribute("data-id"));
    const containerContents = assetsMap.get(id);
    if (containerContents) {
        assetsBlocksDiv.innerHTML = '';
        containerContents.forEach(c => {
            if (c instanceof Container) {
                rightContainer.renderContainer(assetsBlocksDiv, c, assetsMap);
            } else if (c instanceof Item) {
                rightContainer.renderItem(assetsBlocksDiv, c, assetsMap);
            }
        });
    }
}

const createContainerButton = (containerId, containerParentId, containerName, assetsBlocksDiv, assetsMap) => {
    const containerButton = document.createElement("button");
    containerButton.className = "container-name";
    const buttonId = `container-name${containerId}`;
    containerButton.setAttribute("id", buttonId);
    containerButton.setAttribute("data-id", containerId);
    containerButton.setAttribute("data-parentId", containerParentId);
    containerButton.innerText = containerName;

    containerButton.addEventListener("click", () => handleContainerButtonClick(containerButton, assetsBlocksDiv, assetsMap));

    return containerButton;
}

// Function to add container name to the upper location path block
const addContainerToPath = (containerId, containerName, containerParentId, currentLocationPathDiv, assetsMap) => {
    const lastLocation = currentLocationPathDiv.lastElementChild;

    removeLastLocationIfSameParent(lastLocation, containerParentId);
    removeLocationsWithHigherParentId(containerParentId, currentLocationPathDiv);

    if (document.getElementById(`container-name${containerId}`)) {
        return;
    }

    const assetsBlocksDiv = document.querySelector('.space-container'); // Make sure this selector matches your HTML
    const containerButton = createContainerButton(containerId, containerParentId, containerName, assetsBlocksDiv, assetsMap);
    const arrowIcon = document.createElement('i')
    arrowIcon.classList.add('bi', 'bi-arrow-right-short')

    currentLocationPathDiv.appendChild(arrowIcon)

    currentLocationPathDiv.appendChild(containerButton);
}


const clearElementInnerHTML = (element) => {
    if (element) {
        element.innerHTML = '';
    }
}

const renderRoomContent = (assetsBlocksDiv, content, assetsMap) => {
    content.forEach(c => {
        if (c instanceof Container) {
            rightContainer.renderContainer(assetsBlocksDiv, c, assetsMap);
        } else if (c instanceof Item) {
            rightContainer.renderItem(assetsBlocksDiv, c, assetsMap);
        }
    });
}

const handleRoomButtonClick = (event, button, assetsBlocksDiv, assetsMap) => {
    clearElementInnerHTML(assetsBlocksDiv);

    let nextSibling = event.target.nextElementSibling;
    while (nextSibling) {
        const toRemove = nextSibling;
        nextSibling = nextSibling.nextElementSibling;
        toRemove.remove();
    }

    const roomId = parseInt(button.getAttribute("data-id"));
    const roomContent = assetsMap.get(roomId);

    if (roomContent) {
        renderRoomContent(assetsBlocksDiv, roomContent, assetsMap);
    }
}

const createRoomButton = (roomName, roomId, assetsBlocksDiv, assetsMap) => {
    const roomButton = document.createElement("button");
    roomButton.setAttribute("id", "room-name");
    roomButton.setAttribute("data-id", roomId);
    roomButton.innerText = roomName;

    roomButton.addEventListener("click", (event) => handleRoomButtonClick(event, roomButton, assetsBlocksDiv, assetsMap));

    return roomButton;
}

// Function to add room name to the upper location path block
const addRoomToPath = (roomId, roomName, currentLocationPathDiv, assetsMap) => {
    clearElementInnerHTML(currentLocationPathDiv);
    if (document.getElementById("room-name")) {
        return;
    }

    const assetsBlocksDiv = document.querySelector('.space-container');
    const roomButton = createRoomButton(roomName, roomId, assetsBlocksDiv, assetsMap);
    currentLocationPathDiv.appendChild(roomButton);
}

export { addRoomToPath, addContainerToPath }
