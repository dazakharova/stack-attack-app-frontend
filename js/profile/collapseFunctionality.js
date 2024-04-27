import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";
import {addContainerToPath, addRoomToPath} from "./locationPath.js";
import { updateContentsInRightContainer, setupConfirmationModal } from './utils/uiDynamicUpdate.js'
import { createRoomButton, createDeleteButton, createContainersDiv, renderRoomContents, handleRoomButtonClick, handleDeleteButtonClick } from './utils/roomComponents.js';
import { assets, toggleDeleteMode } from './profile.js'

const assetsBlocksDiv = document.querySelector(".space-container")
const currentLocationPathDiv = document.getElementById("location-info")

const renderRoom = (parentNode, room, data) => {
    console.log('Current room is ', room);

    const collapseTarget = `#${room.getName().replace(/\s+/g, '')}${room.getId()}-collapse`;

    const roomButton = createRoomButton(room, collapseTarget);
    const deleteBtn = createDeleteButton();
    const { containersDiv, containersUl } = createContainersDiv(collapseTarget);
    const roomDiv = document.createElement("div");

    handleRoomButtonClick(roomButton, room, data, currentLocationPathDiv, assetsBlocksDiv);
    handleDeleteButtonClick(deleteBtn, parentNode, room, roomDiv);

    roomDiv.className = "button-container";
    roomDiv.appendChild(roomButton);
    roomDiv.appendChild(deleteBtn);
    roomDiv.appendChild(containersDiv);

    parentNode.appendChild(roomDiv);

    const roomContents = data.get(room.getId());
    renderRoomContents(roomContents, containersUl, data);
};

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

export const renderContents = (contents, containersNode, data) => {
    contents.forEach(entity => {
        if (entity instanceof Container) {
            renderContainer(containersNode, entity, data)
        }
    })
}

const leftContainer = {
    renderRoom, controlRoomButton, renderContainer, renderContents
}

export default leftContainer

