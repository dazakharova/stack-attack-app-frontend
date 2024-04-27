import {Container} from "../class/Container.js";
import { createRoomButton, createDeleteButton, createContainersDiv, renderRoomContents, handleRoomButtonClick, handleDeleteButtonClick } from './utils/roomComponents.js';
import { generateCollapseTarget, createContainerListItem, createContainerButton, handleContainerClick, createChildrenDiv, appendElements, createNestedContainersList } from './utils/containerComponents.js';

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
    console.log('Got box', container);

    const containerId = container.getId();
    const containerName = container.getName();
    const containerParentId = container.getParentId();
    const containerContents = data.get(containerId);
    const collapseTarget = generateCollapseTarget(containerName, containerId);

    const containerLi = createContainerListItem();
    const containerButton = createContainerButton(containerId, containerParentId, containerName, collapseTarget);

    containerButton.onclick = () => handleContainerClick(containerId, containerName, containerParentId, data);

    const childrenDiv = createChildrenDiv(collapseTarget);

    appendElements(containerLi, containerButton, childrenDiv);
    parentNode.appendChild(containerLi);

    const containersUl = createNestedContainersList(collapseTarget);
    childrenDiv.appendChild(containersUl);

    if (containerContents) {
        renderContents(containerContents, containersUl, data);
    }
};

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

