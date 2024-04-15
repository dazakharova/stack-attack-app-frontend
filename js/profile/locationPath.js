import rightContainer from './containerRenderHelpers.js';
import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";

const assetsBlocksDiv = document.querySelector(".space-container")

const addRoomToPath = (button, currentLocationPathDiv, assetsMap) => {
    if (currentLocationPathDiv) {
        currentLocationPathDiv.innerHTML = ''
    }
    if (document.getElementById("room-name")) {
        return
    }

    const roomButton = document.createElement("button")
    roomButton.setAttribute("id", "room-name")
    const dataId = button.getAttribute("data-id")
    roomButton.setAttribute("data-id", dataId)
    roomButton.innerText = button.innerText

    roomButton.addEventListener("click", (event) => {
        // Clean the assets block
        assetsBlocksDiv.innerHTML = ''

        let nextSibling = roomButton.nextElementSibling;

        // Loop through all next siblings and remove them
        while (nextSibling) {
            const toRemove = nextSibling;
            nextSibling = nextSibling.nextElementSibling;
            toRemove.remove();
        }

        // Select all the nested containers inside the chosen room
        const roomId = parseInt(button.getAttribute("data-id"))

        // Get room content if exist
        const roomContent = assetsMap.get(roomId)

        // If there content inside room, display it in the assets block
        if (roomContent) {
            roomContent.forEach(c => {
                if (c instanceof Container) {
                    rightContainer.renderContainer(assetsBlocksDiv, c, assetsMap)
                } else if (c instanceof Item) {
                    rightContainer.renderItem(assetsBlocksDiv, c, assetsMap)
                }
            })
        }

    })

    // Append room button to location info block
    currentLocationPathDiv.appendChild(roomButton)
}

const addContainerToPath = (button, currentLocationPathDiv, assetsMap) => {

    // Select last location span added to the path
    const lastLocation = currentLocationPathDiv.lastElementChild;
    // Check last location parent id
    const lastLocationParentId = lastLocation.getAttribute("data-parentId")
    // Check parent id of the clicked container button
    const triggeredLocationParentId = button.getAttribute("data-parentId")

    if (lastLocation.getAttribute("id") != 'room-name') {
        while (button.getAttribute("data-id") < currentLocationPathDiv.lastElementChild.getAttribute("data-id")) {
            currentLocationPathDiv.lastElementChild.remove()
        }
    }

    // If parent_id of the last location and clicked container button is the same, then replace the last added location with the just clicked
    if (triggeredLocationParentId === lastLocationParentId) {
        lastLocation.remove()
    }

    // If this container button is already added to path, then ignore
    if (document.getElementById(`container-name${button.getAttribute("data-id")}`)) {
        return
    }

    // const containerSpan = document.createElement("span")
    const containerButton = document.createElement("button")
    containerButton.className = "container-name"
    const buttonId = `container-name${button.getAttribute("data-id")}`
    containerButton.setAttribute("id", buttonId)
    containerButton.setAttribute("data-id", button.getAttribute("data-id"))
    containerButton.setAttribute("data-parentId", button.getAttribute("data-parentId"))
    containerButton.innerText = " > " + button.innerText

    containerButton.addEventListener("click", () => {
        // Get the next sibling of the clicked button
        let nextSibling = containerButton.nextElementSibling;

        // Loop through all next siblings and remove them
        while (nextSibling) {
            const toRemove = nextSibling;
            nextSibling = nextSibling.nextElementSibling;
            toRemove.remove();
        }

        // (parentNode, container, data)
        const id = parseInt(containerButton.getAttribute("data-id"))
        const containerContents = assetsMap.get(id)

        if (containerContents) {
            assetsBlocksDiv.innerHTML = ''
            containerContents.forEach(c => {
                if (c instanceof Container) {
                    rightContainer.renderContainer(assetsBlocksDiv, c, assetsMap)
                } else if (c instanceof Item) {
                    rightContainer.renderItem(assetsBlocksDiv, c, assetsMap)
                }
            })
        }

        // rightContainer.renderContainer(assetsBlocksDiv, container, assetsMap)
    })

    // Append container button to location info block
    currentLocationPathDiv.appendChild(containerButton)
}

export { addRoomToPath, addContainerToPath }
