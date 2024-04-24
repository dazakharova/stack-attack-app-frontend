import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";
import {addContainerToPath, addRoomToPath} from "./locationPath.js";
import { updateContentsInRightContainer } from './uiDynamicUpdate.js'

import { assets } from './profile.js'

const assetsBlocksDiv = document.querySelector(".space-container")
const currentLocationPathDiv = document.getElementById("location-info")

const renderRoom = (parentNode, room, data) => {
    console.log('Current room is ', room)

    // Getting data of the room
    const roomId = room.getId()
    const roomName = room.getName()

    // Create block for room button
    const roomDiv = document.createElement("div")
    roomDiv.className = "button-container"

    // Create room button
    const roomButton = document.createElement("button")

    // Assign unique collapse target for room button, which will be used as id in inner list storing subassets
    const collapseTarget = `#${roomName.replace(/\s+/g, '')}${roomId}-collapse`

    // Create delete button
    const deleteBtn = document.createElement('span')
    deleteBtn.className = 'delete-icon'
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'

    // Assign rooms attributes
    roomButton.classList.add('btn', 'btn-toggle', 'btn-room', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');
    roomButton.setAttribute('data-bs-toggle', 'collapse');
    roomButton.setAttribute('data-bs-target', collapseTarget);
    roomButton.setAttribute('aria-expanded', 'false');
    roomButton.setAttribute("data-id", roomId)
    roomButton.textContent = roomName;

    // Sub assets of current room (inside the data Map)
    let roomContents = data.get(roomId)

    roomButton.onclick = () => {
        // Add room to the path section
        addRoomToPath(roomId, roomName, currentLocationPathDiv, data)

        roomContents = assets.getAssets().get(roomId)
        // Draw room content in the right container
        updateContentsInRightContainer(assetsBlocksDiv, roomContents, data)
    }

    // Create div element for all inner elements stored inside the room
    const containersDiv = document.createElement("div")
    containersDiv.className = "collapse"
    containersDiv.setAttribute("id", collapseTarget.substring(1))

    // Create list element inside the containers div
    const containersUl = document.createElement("ul")
    containersUl.classList.add("containers-list", "btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small")

    // Append ul to the containers div
    containersDiv.appendChild(containersUl)

    // Append roomButton to the room div
    roomDiv.appendChild(roomButton)

    // Append delete button to the room div
    roomDiv.appendChild(deleteBtn)

    // Append container div to room div
    roomDiv.appendChild(containersDiv)

    // Append room div to room hierarchy div
    parentNode.appendChild(roomDiv)

    // Once delete button is clicked it removes selected room from the layout
    deleteBtn.onclick = (event) => {
        return handleRoomDeletion(event, parentNode, roomId, roomName,  roomDiv)
    }

    // If current room has other assets inside it, render them
    if (roomContents) {
        renderContents(roomContents, containersUl, data)
    }
}

const renderContainer = (parentNode, container, data) => {
    console.log('Got box', container)

    // Get data of the container
    const containerId = container.getId()
    const containerName = container.getName()
    const containerParentId = container.getParentId()

    // Sub assets of current container (inside the data Map)
    const containerContents = data.get(containerId)

    // Create the list item (li) element for holding one container
    let containerLi = document.createElement('li');

    // Create the button element for container
    let containerButton = document.createElement('button');

    // Add classes to the container button
    containerButton.classList.add('btn', 'btn-toggle', 'btn-furniture', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');

    // Assign unique collapse target for container button, which will be used as id in inner list storing subassets of that container
    const collapseTarget = `#${containerName.replace(/\s+/g, '')}${containerId}-collapse`

    // Set attributes for the container button
    containerButton.setAttribute('data-bs-toggle', 'collapse');
    containerButton.setAttribute('data-bs-target', collapseTarget);
    containerButton.setAttribute('aria-expanded', 'false');

    // Set unique attributes for container button in order to be able to access them later
    containerButton.setAttribute("data-id", containerId)
    containerButton.setAttribute("data-parentId", containerParentId)

    // Set the containerButton's text content
    containerButton.textContent = containerName;

    containerButton.onclick = () => {
        // Add container to path section
        addContainerToPath(containerId, containerName, containerParentId, currentLocationPathDiv, data)

        const containerContents = assets.getAssets().get(containerId)
        // Load container contents in the right section
        updateContentsInRightContainer(assetsBlocksDiv, containerContents, assets.getAssets())
    }

    // Create block for nested elements
    const childrenDiv = document.createElement("div")
    childrenDiv.className = "collapse"

    // Assigning collapse target from the container as an items block id
    childrenDiv.setAttribute("id", collapseTarget.substring(1))

    // Append the container button to the list item
    containerLi.appendChild(containerButton);

    // Append the items div to the container list item
    containerLi.appendChild(childrenDiv)

    // Append the container list item to the containersUl node, given as an argument
    parentNode.appendChild(containerLi)

    // Create a nested list of containers block for holding each nested container (if so)
    const containersUl = document.createElement("ul")
    containersUl.classList.add("containers-list", "btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small")
    containersUl.setAttribute('data-bs-target', collapseTarget)

    childrenDiv.appendChild(containersUl)

    // If current container has any assets inside it, then render them
    if (containerContents) {
        renderContents(containerContents, containersUl, data)
    }
}

const controlRoomButton = (collapses, index) => {
    const currentCollapse = collapses[index];
    let isAnyOtherExpanded = false;

    // Hide other collapses if they are shown
    collapses.forEach((collapse, ci) => {
        if (ci !== index && collapse._element.classList.contains('show')) {
            collapse.hide();
            isAnyOtherExpanded = true;
        }
    });

    // Only toggle the current collapse if no other collapses are expanded
    if (!isAnyOtherExpanded) {
        currentCollapse.toggle();
    }
}

const renderContents = (contents, containersNode, data) => {
    contents.forEach(entity => {
        if (entity instanceof Container) {
            renderContainer(containersNode, entity, data)
        }
    })
}

const handleRoomDeletion = async (event, parentNode, roomId, roomName,  roomDiv) => {
    const isConfirmed = confirm(`Are you sure you want to delete room "${roomName}"?`);

    if (isConfirmed) {
        try {
            const response = await assets.removeContainer(roomId)

            // Prevent the event from bubbling up to the room button click listener
            event.stopPropagation();

            // Remove the roomDiv from the parentNode
            parentNode.removeChild(roomDiv)
        } catch (error) {
            console.error(error)
        }
    }
}

const leftContainer = {
    renderRoom, controlRoomButton, renderContainer, renderContents
}

export default leftContainer

