import {Container} from "../../class/Container.js";
import leftContainer from "../collapseFunctionality.js";
import {Item} from "../../class/Item.js";
import {addContainerToPath} from "../locationPath.js";
import {assets} from "../profile.js";
import rightContainer from "../containerRenderHelpers.js";

const updateContentsInLeftMenu = (entityParentId, data) => {
    // Get name of parent name (which is used in its children tags id)
    const parentName = document.getElementById('location-info').lastElementChild.innerText

    // Get parent node for containers in left menu
    const parentNode= document.querySelector(`#${parentName.replace(/\s/g, '')}${entityParentId}-collapse > .containers-list`)

    console.log('parentContainersNode', parentNode)
    // Clean areas in parent containers and items node to draw it with updated data
    parentNode.innerHTML = ''

    const parentContainerContents = data.get(parseInt(entityParentId))

    // Rerender each entity inside the parent container of the current item
    if (parentContainerContents) {
        leftContainer.renderContents(parentContainerContents, parentNode, data)
    }
}

const updateContentsInRightContainer = (parentNode, contents, data) => {
    console.log('parent node before', parentNode)
    console.log('got contents', contents)
    parentNode.innerHTML = ''
    if (contents) {
        contents.forEach(c => {
            if (c instanceof Container) {
                rightContainer.renderContainer(parentNode, c, data)
            } else if (c instanceof Item) {
                rightContainer.renderItem(parentNode, c, data)
            }
        })
    }
}

const renderContainerContents = (event, parentNode, containerContents, containerId, containerName, containerParentId, data) => {
    if (!event.target.matches('#box-dropdown *, .edit-box-icon, .delete-box-icon, .edit-box-icon *, .delete-box-icon *, .ok-button, .title-input')) {
        if (containerContents) {
            // Clean the assets block
            parentNode.innerHTML = ''
            addContainerToPath(containerId, containerName, containerParentId, document.getElementById('location-info'), data)

            containerContents.forEach(c => {
                if (c instanceof Container) {
                    rightContainer.renderContainer(parentNode, c, data)
                } else if (c instanceof Item) {
                    rightContainer.renderItem(parentNode, c, data)
                }
            })
        } else {
            parentNode.innerHTML = ''
            addContainerToPath(containerId, containerName, containerParentId, document.getElementById('location-info'), data)
        }
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

const replaceTitleWithEditableInput = (containerDivFooter, containerSpan, editIcon) => {
    containerSpan.style.display = 'none'
    editIcon.style.display = 'none'

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

const updateContainerNameAndRefreshUI = async (editIcon, containerSpan, containerId, containerParentId, data) => {
    // Get parent name from the location path
    const parentName = document.getElementById('location-info').lastElementChild.innerText

    const newContainerNameDiv = document.querySelector('.new-container-name-div')

    const newContainerNameInput = document.querySelector('.title-input')

    try {
        // Update container name in UI
        containerSpan.textContent = newContainerNameInput.value
        newContainerNameDiv.style.display = 'none'

        containerSpan.style.display = 'block'
        editIcon.style.display = 'block'


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

            parentNode.removeChild(containerDiv)

            updateContentsInLeftMenu(containerParentId, data)
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
    newDescriptionDiv.classList.remove('hidden')
    newDescriptionDiv.classList.add('new-item-description-div')

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

            // Get item parent container contents
            const itemParentContainerContents = data.get(parseInt(itemParentId))

            // Re-render all the contents of the current container
            updateContentsInRightContainer(parentNode, itemParentContainerContents, data)
        } catch (error) {
            console.error(error)
        }
    }
}

const handleClosingItemModalWindow = (newItemNameDiv, modalTitle, itemModal, parentNode, data, itemParentId) => {
    newItemNameDiv.style.display = 'none'
    modalTitle.style.display = 'block'

    itemModal.style.display = "none";

    const itemParentContainerContents = data.get(parseInt(itemParentId))

    // Re-render all the contents of the current container
    updateContentsInLeftMenu(itemParentId, data)
    updateContentsInRightContainer(parentNode, itemParentContainerContents, data)
}

const handleImageUploading = () => {
    const reader = new FileReader();
    reader.onload = convertImageToBase64;
    reader.readAsDataURL(this.files[0]);

}

function convertImageToBase64(event) {
    const base64String = event.target.result.replace("data:", "").replace(/^.+,/, "");
    // Save the base64String to your local Map or state here
}

// Function to set up the confirmation modal
function setupConfirmationModal(entityName, confirmCallback) {
    const confirmationModal = document.getElementById('confirmation-modal');
    confirmationModal.style.display = 'block';

    const deleteConfirmationText = document.querySelector('#confirmation-modal .modal-content p');
    deleteConfirmationText.textContent = `Are you sure you want to delete "${entityName}"?`;

    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.onclick = () => {
        confirmationModal.style.display = 'none';
    };

    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = confirmCallback;
    return confirmBtn;  // Return the confirm button if needed outside this function
}

export { updateContentsInLeftMenu, updateContentsInRightContainer, renderContainerContents, buildNewContainerNameInput, replaceTitleWithEditableInput, replaceItemNameWithEditableInput, updateItemNameAndRefreshUI, replaceItemDescriptionWithEditableInput, updateItemDescriptionAndRefreshUI, handleItemDeletion, handleClosingItemModalWindow, handleImageUploading, setupConfirmationModal }