import { createContainerDiv, createContainerFooter, createTitleSpan, handleContainerClick, setupNameEdit, setupNameSave, setupDelete } from './utils/rightContainerRenderer.js';
import { getItemData, createItemDiv, createItemImage, createItemSpan, displayModalWindow } from "./utils/rightItemRenderer.js";

function renderContainer(parentNode, container, data) {
    const containerId = container.getId();
    const containerParentId = container.getParentId();
    const containerName = container.getName();

    const containerDiv = createContainerDiv();
    const containerFooter = createContainerFooter();
    const containerSpan = createTitleSpan(containerId, containerParentId, containerName);

    const { okNameBtn } = buildNewContainerNameInput(containerFooter);

    handleContainerClick(containerDiv, parentNode, data.get(container.getId()), containerId, containerName, containerParentId, data);
    const { editContainerNameBtn, deleteContainerBtn } = buildContainerDropdown(containerDiv);
    setupNameEdit(editContainerNameBtn, containerSpan, containerFooter);
    setupNameSave(okNameBtn, containerSpan, containerId, containerParentId, data);
    setupDelete(deleteContainerBtn, containerName, containerId, containerDiv, parentNode, containerParentId, data);

    containerFooter.appendChild(containerSpan);
    containerDiv.appendChild(containerFooter);
    parentNode.appendChild(containerDiv);
}

const renderItem = (parentNode, item, data) => {
    const { itemId, itemName, itemDescription, itemParentId, itemImageStr } = getItemData(item)
    const itemDiv = createItemDiv()

    itemDiv.onclick = () => {
        displayModalWindow(itemId, itemParentId, itemName, itemDescription, itemImageStr, parentNode, data)
    }

    createItemImage(itemImageStr, itemDiv)
    createItemSpan(itemId, itemName, itemParentId, itemDiv)

    // Append item div to parent node given as an argument
    parentNode.appendChild(itemDiv)
}

const buildNewContainerNameInput = (containerDivFooter) => {
    const newContainerNameDiv = document.createElement('div')
    newContainerNameDiv.classList.add('new-container-name-div', 'hidden')

    const newContainerNameInput = document.createElement('input')
    newContainerNameInput.type = 'text'
    newContainerNameInput.classList.add('title-input')

    const okButton = document.createElement('button')
    okButton.textContent = 'OK'
    okButton.classList.add('ok-button')

    newContainerNameDiv.appendChild(newContainerNameInput)
    newContainerNameDiv.appendChild(okButton)

    containerDivFooter.appendChild(newContainerNameDiv)
    return { okNameBtn: okButton }
}

function buildContainerDropdown(containerDiv) {
    // Create the dropdown container div
    const dropdownDiv = document.createElement('div');
    dropdownDiv.setAttribute('id', 'box-dropdown')
    dropdownDiv.className = 'dropdown';

    // Create the icon that toggles the dropdown
    const icon = document.createElement('i');
    icon.setAttribute('data-bs-toggle', 'dropdown');
    icon.setAttribute('aria-expanded', 'false');
    icon.id = 'box-more-btn';
    icon.className = 'bi bi-three-dots';
    icon.style.cursor = 'pointer';
    dropdownDiv.appendChild(icon);

    // Create the dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = 'box-menu';
    dropdownMenu.className = 'dropdown-menu text-small shadow';
    dropdownMenu.setAttribute('aria-labelledby', 'box-more-btn');
    dropdownDiv.appendChild(dropdownMenu);

    // Create "Change Name" link
    const changeNameLink = document.createElement('a');
    changeNameLink.className = 'dropdown-item';
    changeNameLink.href = '#';
    changeNameLink.id = 'change-name';
    changeNameLink.textContent = 'Change Name';
    dropdownMenu.appendChild(changeNameLink);

    // Create "Delete Place" link
    const deletePlaceLink = document.createElement('a');
    deletePlaceLink.className = 'dropdown-item';
    deletePlaceLink.href = '#';
    deletePlaceLink.id = 'delete-place';
    deletePlaceLink.textContent = 'Delete Place';
    dropdownMenu.appendChild(deletePlaceLink);

    containerDiv.appendChild(dropdownDiv)

    // Return the anchor tags
    return {
        editContainerNameBtn: changeNameLink,
        deleteContainerBtn: deletePlaceLink,
    };
}

const rightContainer = {
    renderContainer,
    renderItem
}

export default rightContainer