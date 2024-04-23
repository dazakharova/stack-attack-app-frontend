import { addContainerToPath } from "./locationPath.js";
import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";
import leftContainer from "./collapseFunctionality.js";
import {assets} from "./profile.js";

const renderContainer = (parentNode, container, data) => {
    // Get all data about container
    const containerId = container.getId()
    const containerParentId = container.getParentId()
    const containerName = container.getName()

    // Create block for container
    const containerDiv = document.createElement('div')
    containerDiv.className = 'box'

    // Get container content (nested elements)
    const containerContents = data.get(container.getId())

    // Create container footer
    const containerDivFooter = document.createElement('div')
    containerDivFooter.className = 'box-footer'

    // Create container dropdown menu and retrieve edit name and delete buttons
   const { editContainerNameBtn, deleteContainerBtn } = buildContainerDropdown(containerDiv)

    // Create span for container with its title inside
    const containerSpan = document.createElement('span')
    containerSpan.className = 'title'

    // Set attributes holding its unique information in order to be able to access them later
    containerSpan.setAttribute('data-id', containerId)
    containerSpan.setAttribute('data-parentId', containerParentId)
    containerSpan.innerText = containerName

    // Create new container name form which is invisible by default
    buildNewContainerNameInput(containerDivFooter)

    // Render container contents while clicking on container div
    containerDiv.onclick = (event) => {
        renderContainerContents(event, parentNode, containerContents, containerId, containerName, containerParentId, data)
    }

    editContainerNameBtn.onclick = () => {
        // Initiate container rename
        replaceTitleWithEditableInput(containerDivFooter, containerSpan)

        // Get ok button for submitting container name changes
        const okButton = document.querySelector('.ok-button');

        okButton.onclick = () => {
            return updateContainerNameAndRefreshUI(containerSpan, containerId, containerParentId, data)
        }
    }

    deleteContainerBtn.onclick = (event) => {
       return handleContainerDeletion(event, containerName, containerId, containerDiv, parentNode, containerParentId, data)
    }

    // Append elements to container div footer
    containerDivFooter.appendChild(containerSpan)

    // Append footer to div
    containerDiv.appendChild(containerDivFooter)

    // Append div to parent node given as an argument
    parentNode.appendChild(containerDiv)
}


const renderItem = (parentNode, item, data) => {
    const itemId = item.getId()
    const itemName = item.getName()
    const itemParentId = item.getContainerId()
    const itemImageStr = item.getImage()
    // Create div for item
    const itemDiv = document.createElement('div')
    itemDiv.className = 'item'

    // Add event listener to item div, once it's clicked - popup window with detailed info about the item shows up
    itemDiv.onclick = () => {
        // Get the modal window
        const itemModal = document.getElementById("item-modal")

        // Get the elements of the modal window after opening it
        const modalImage = document.getElementById("modal-image");
        const modalTitle = document.getElementById("modal-title");
        const modalDescription = document.getElementById("modal-description");

        // Set the data in the modal window
        modalTitle.textContent = item.getName();
        if (itemImageStr) {
            modalImage.src = `data:image/jpeg;base64,${itemImageStr}`
        }
        modalDescription.textContent = item.getDescription();


        // Display the modal window
        itemModal.style.display = "block";

        // Edit item name button
        const editItemNameBtn = document.getElementById('edit-item-name')

        // Get newItemNameDiv with input and submit button
        const newItemNameDiv = document.querySelector('.new-item-name-div')
        const newItemNameInput = document.querySelector('.new-item-name-div .item-title-input')
        const okButton = document.querySelector('.new-item-name-div .ok-button')

        // When edit button is clicked, inout for new item name show up
        editItemNameBtn.onclick = () => {
            replaceItemNameWithEditableInput(newItemNameDiv, newItemNameInput, modalTitle)
        }

        // When submit button is clicked, name gets updated and left menu and right container on the page update their contents
        okButton.onclick = () => {
            return updateItemNameAndRefreshUI(modalTitle, newItemNameInput, newItemNameDiv, itemId)
        }

        const editDescriptionBtn = document.getElementById('edit-item-description')

        // Get new item description div with input and submit button
        const newDescriptionDiv = document.getElementById('new-description-div')
        const descriptionInput = document.querySelector('.item-description-input')
        const okDescriptionBtn = document.querySelector('.item-description-ok')

        // When edit button is clicked, inout for new item name show up
        editDescriptionBtn.onclick = () => {
            replaceItemDescriptionWithEditableInput(modalDescription, newDescriptionDiv, descriptionInput)
        }

        // When submit button is clicked, description gets updated and left menu and right container on the page update their contents
        okDescriptionBtn.onclick = () => {
            return updateItemDescriptionAndRefreshUI(modalDescription, newDescriptionDiv, descriptionInput, itemId)
        }

        // Delete item button
        const deleteItemBtn = document.getElementById('delete-item')

        // When delete item button is clicked, the user gets confirmation window, if confirmed
        // item window gets closed and left menu and right container on the page update their contents
        deleteItemBtn.onclick = (event) => {
            return handleItemDeletion(event, itemName, itemId, itemParentId, itemModal, parentNode, data)
        }

        // Close the modal window when the close button is clicked
        let closeButton = document.querySelector("#close-item");
        if (closeButton) {
            closeButton.onclick = function () {
                handleClosingItemModalWindow(newItemNameDiv, modalTitle, itemModal, parentNode, data, itemParentId)
            }
        }
    }



    // Create img for item
    const itemImg = document.createElement('img')
    itemImg.className = "item-image"

    if (itemImageStr) {
        itemImg.src = `data:image/jpeg;base64,${itemImageStr}`
    }



    // Create span for item with its title
    const itemSpan = document.createElement('span')
    itemSpan.className = 'title'
    itemSpan.innerText = item.getName()

    // Set attributes holding unique information about an item in order to be able to access them later
    itemSpan.setAttribute('data-id', item.getId())
    itemSpan.setAttribute('data-containerId', item.getContainerId())

    // Append item image and span to the item div
    itemDiv.appendChild(itemImg)
    itemDiv.appendChild(itemSpan)

    // Append item div to parent node given as an argument
    parentNode.appendChild(itemDiv)
}

const rightContainer = {
    renderContainer,
    renderItem
}



export default rightContainer

const updateContentsInLeftMenu = (entityParentId, data) => {
    // Get name of parent name (which is used in its children tags id)
    const parentName = document.getElementById('location-info').lastElementChild.innerText

    // Get parent node for items and containers in left menu
    const parentContainersNode= document.querySelector(`#${parentName.replace(/\s/g, '')}${entityParentId}-collapse > .containers-list`)
    const parentItemsNode = document.querySelector(`#${parentName.replace(/\s/g, '')}${entityParentId}-collapse > .left-items-list`)

    // Clean areas in parent containers and items node to draw it with updated data
    parentContainersNode.innerHTML = ''
    parentItemsNode.innerHTML = ''

    // Rerender each entity inside the parent container of the current item
    if (data.get(parseInt(entityParentId))) {
        data.get(parseInt(entityParentId)).forEach(entity => {
            if (entity instanceof Container) {
                leftContainer.renderContainer(parentContainersNode, entity, data)
            } else if (entity instanceof Item) {
                leftContainer.renderItem(parentItemsNode, entity, data)
            }
        })
    }
}

const updateContentsInRightContainer = (parentNode, contents, data) => {
    parentNode.innerHTML = ''
    if (contents) {
        contents.forEach(c => {
            if (c instanceof Container) {
                renderContainer(parentNode, c, data)
            } else if (c instanceof Item) {
                renderItem(parentNode, c, data)
            }
        })
    }
}

const renderContainerContents = (event, parentNode, containerContents, containerId, containerName, containerParentId, data) => {
        if (!event.target.matches('#box-dropdown *, .ok-button, .title-input')) {
            console.log('clicked', event.target)
            addContainerToPath(containerId, containerName, containerParentId, document.getElementById('location-info'), data)
            updateContentsInRightContainer(parentNode, containerContents, data)
        }
}

const buildNewContainerNameInput = (containerDivFooter, containerSpan) => {
    const newContainerNameDiv = document.createElement('div')
    newContainerNameDiv.className = 'new-container-name-div'

    const newContainerNameInput = document.createElement('input')
    newContainerNameInput.type = 'text'
    newContainerNameInput.classList.add('title-input')

    const okButton = document.createElement('button')
    okButton.textContent = 'OK'
    okButton.classList.add('ok-button')

    newContainerNameDiv.appendChild(newContainerNameInput)
    newContainerNameDiv.appendChild(okButton)

    containerDivFooter.appendChild(newContainerNameDiv)
}

const replaceTitleWithEditableInput = (containerDivFooter, containerSpan) => {
    containerSpan.style.display = 'none'

    // Show input new container name
    const newContainerNameDiv = document.querySelector('.new-container-name-div')
    newContainerNameDiv.style.display = 'block'

    // Put the value of the container name into the input field
    const newContainerNameInput = document.querySelector('.title-input')
    newContainerNameInput.value = containerSpan.textContent

    // Focus on the input and select its content
    newContainerNameInput.focus()
    newContainerNameInput.select()
}

// updateContainerNameAndRefreshUI(containerSpan, containerId, containerParentId, data)
const updateContainerNameAndRefreshUI = async (containerSpan, containerId, containerParentId, data) => {
    // Get parent name from the location path
    const parentName = document.getElementById('location-info').lastElementChild.innerText

    const newContainerNameDiv = document.querySelector('.new-container-name-div')

    const newContainerNameInput = document.querySelector('.title-input')

    try {
        // Update container name in UI
        containerSpan.textContent = newContainerNameInput.value
        newContainerNameDiv.style.display = 'none'

        containerSpan.style.display = 'block'

        // Apply container name changes in local Map and send them to the server
        const response = await assets.editContainerName(containerId, newContainerNameInput.value)

        updateContentsInLeftMenu(containerParentId, data)
    } catch (error) {
        console.error(error)
    }
}

const handleContainerDeletion = async (event, containerName, containerId, containerDiv, parentNode, containerParentId, data) => {
    const isConfirmed = confirm(`Are you sure you want to delete "${containerName}"?`);

    if (isConfirmed) {
        try {
            const response = await assets.removeContainer(containerId)

            // Prevent the event from bubbling up to the room button click listener
            event.stopPropagation();

            // parentNode.removeChild(containerDiv)

            const containerParentContents = data.get(parseInt(containerParentId))
            // Re-render all the contents of the current container
            updateContentsInRightContainer(parentNode, containerParentContents, assets.getAssets())

            updateContentsInLeftMenu(containerParentId, assets.getAssets())
        } catch (error) {
            console.error(error)
        }
    }
}

const replaceItemNameWithEditableInput = (newItemNameDiv, newItemNameInput, modalTitle) => {
    // Replace item title with new div for editing
    newItemNameDiv.style.display = 'block'

    newItemNameInput.value = modalTitle.innerText

    modalTitle.style.display = 'none'

    // Focus on the input and select its content
    newItemNameInput.focus();
    newItemNameInput.select();
}

const updateItemNameAndRefreshUI = async (modalTitle, newItemNameInput, newItemNameDiv, itemId) => {
    try {
        modalTitle.textContent = newItemNameInput.value;
        newItemNameDiv.style.display = 'none'
        modalTitle.style.display = 'block'


        const response = await assets.editItemName(itemId, modalTitle.textContent)

    } catch (error) {
        console.error(error)
    }
}

const replaceItemDescriptionWithEditableInput = (modalDescription, newDescriptionDiv, descriptionInput) => {
    modalDescription.style.display = 'none'
    newDescriptionDiv.classList.add('new-item-description-div')
    newDescriptionDiv.classList.remove('hidden')

    descriptionInput.value = modalDescription.textContent

    // Focus on the input and select its content
    descriptionInput.focus();
    descriptionInput.select();
}

const updateItemDescriptionAndRefreshUI = async (modalDescription, newDescriptionDiv, descriptionInput, itemId) => {
    try {
        modalDescription.textContent = descriptionInput.value;
        newDescriptionDiv.classList.remove('new-item-description-div')
        newDescriptionDiv.classList.add('hidden')
        modalDescription.style.display = 'block'

        const response = await assets.editItemDescription(itemId, modalDescription.textContent)

    } catch (error) {
        console.error(error)
    }
}

const handleItemDeletion = async (event, itemName, itemId, itemParentId, itemModal, parentNode, data) => {
    const isConfirmed = confirm(`Are you sure you want to delete "${itemName}"?`);

    if (isConfirmed) {
        try {
            const response = await assets.removeItem(itemId)

            // Prevent the event from bubbling up to the room button click listener
            event.stopPropagation();

            // Remove item modal window
            itemModal.style.display = "none";

            // Rerender left menu container with updated contents
            updateContentsInLeftMenu(itemParentId, data)

            const itemParentContents = data.get(parseInt(itemParentId))
            // Re-render all the contents of the current container
            updateContentsInRightContainer(parentNode, itemParentContents, data)
        } catch (error) {
            console.error(error)
        }
    }
}

const handleClosingItemModalWindow = (newItemNameDiv, modalTitle, itemModal, parentNode, data, itemParentId) => {
        newItemNameDiv.style.display = 'none'
        modalTitle.style.display = 'block'

        itemModal.style.display = "none";

        const itemParentContents = data.get(parseInt(itemParentId))

        // Re-render all the contents of the current container
        updateContentsInLeftMenu(itemParentId, data)
        updateContentsInRightContainer(parentNode, itemParentContents, data)
}
<<<<<<< Updated upstream
=======

const displayImageUploadInput = (id, modalImage) => {
    const newItemImageInput = document.getElementById('new-item-image-input')
    newItemImageInput.style.display = 'block'

    newItemImageInput.onchange = () => handleImageInputChange(newItemImageInput, id, modalImage)
}

const handleImageInputChange = async (newItemImageInput, id, modalImage) => {
        if (newItemImageInput.files.length > 0) {
            const base64Image = await getBase64FromImageInput(newItemImageInput)
            await assets.editItemImage(id, base64Image)
            modalImage.src = `data:image/jpeg;base64,${base64Image}`

            // Reset the file input after the image has been processed
            newItemImageInput.value = '';

            // Hide the file input
            newItemImageInput.style.display = 'none';
        }
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


>>>>>>> Stashed changes
