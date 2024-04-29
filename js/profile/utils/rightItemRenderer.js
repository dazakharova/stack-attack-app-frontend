import { assets } from "../profile.js";
import { getBase64FromImageInput } from'./imageUtils.js';
import { setupConfirmationModal, updateContentsInLeftMenu, updateContentsInRightContainer } from "./uiDynamicUpdate.js";

function getItemData(item) {
    const itemId = item.getId()
    const itemName = item.getName()
    const itemDescription = item.getDescription()
    const itemParentId = item.getContainerId()
    const itemImageStr = item.getImage()

    return {itemId: itemId, itemName: itemName, itemDescription: itemDescription, itemParentId: itemParentId, itemImageStr: itemImageStr }
}

function createItemDiv() {
    const itemDiv = document.createElement('div')
    itemDiv.className = 'item'
    return itemDiv
}

function createItemImage(itemImageStr, itemDiv) {
    // Create img for item
    const itemImg = document.createElement('img')
    itemImg.className = "item-image"

    if (itemImageStr) {
        itemImg.src = `data:image/jpeg;base64,${itemImageStr}`
    }

    // Append item image to item div
    itemDiv.appendChild(itemImg)
}

function createItemSpan(itemId, itemName, itemParentId, itemDiv) {
    // Create span for item with its title
    const itemSpan = document.createElement('span')
    itemSpan.className = 'title'
    itemSpan.innerText = itemName

    // Set attributes holding unique information about an item in order to be able to access them later
    itemSpan.setAttribute('data-id', itemId)
    itemSpan.setAttribute('data-containerId', itemParentId)

    // Append item span to item div
    itemDiv.appendChild(itemSpan)
}

// Display modal window for item
function displayModalWindow(itemId, itemParentId, itemName, itemDescription, itemImageStr, parentNode, data) {
    const itemModal = document.getElementById("item-modal")

    // Get the elements of the modal window after opening it
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");

    // Set the data in the modal window
    modalTitle.textContent = itemName;
    modalDescription.textContent = itemDescription;

    if (itemImageStr) {
        modalImage.src = `data:image/jpeg;base64,${itemImageStr}`
    }

    setupEditEvents(modalTitle, modalDescription, modalImage, itemId)
    setupDeleteItem(itemName, itemId, itemParentId, itemModal, parentNode, data)
    handleCloseModal(modalTitle, itemModal, parentNode, data, itemParentId)

    // Display the modal window
    itemModal.style.display = "block";
}

function handleItemDivClick(itemId, itemParentId, itemName, itemDescription, itemImageStr, parentNode, data) {
    displayModalWindow(itemId, itemParentId, itemName, itemDescription, itemImageStr, parentNode, data)
}

// Setup events for editing item properties
function setupEditEvents(modalTitle, modalDescription, modalImage, itemId) {
    document.getElementById('edit-item-name').onclick = () => {
        // Get newItemNameDiv with input and submit button
        const newItemNameDiv = document.querySelector('.new-item-name-div')
        const newItemNameInput = document.querySelector('.new-item-name-div .item-title-input')
        const okButton = document.querySelector('.new-item-name-div .ok-button')

        replaceItemNameWithEditableInput(newItemNameDiv, newItemNameInput, modalTitle)

        okButton.onclick = () => {
            return updateItemNameAndRefreshUI(modalTitle, newItemNameInput, newItemNameDiv, itemId)
        }
    };

    document.getElementById('edit-item-description').onclick = () => {
        // Get new item description div with input and submit button
        const newDescriptionDiv = document.getElementById('new-description-div')
        const descriptionInput = document.querySelector('.item-description-input')
        const okDescriptionBtn = document.querySelector('.item-description-ok')

        replaceItemDescriptionWithEditableInput(modalDescription, newDescriptionDiv, descriptionInput)

        okDescriptionBtn.onclick = () => {
            return updateItemDescriptionAndRefreshUI(modalDescription, newDescriptionDiv, descriptionInput, itemId)
        }
    };

    document.getElementById('edit-item-photo').onclick = () => {
        displayImageUploadInput(itemId, modalImage);
    };
}

function setupDeleteItem(itemName, itemId, itemParentId, itemModal, parentNode, data) {
    document.getElementById('delete-item').onclick = (event) => {
        return handleItemDeletion(event, itemName, itemId, itemParentId, itemModal, parentNode, data);
    };
}

function handleCloseModal(newItemNameDiv, modalTitle, itemModal, parentNode, data, itemParentId) {
    let closeButton = document.querySelector("#close-item");
    if (closeButton) {
        closeButton.onclick = function () {
            handleClosingItemModalWindow(newItemNameDiv, modalTitle, itemModal, parentNode, data, itemParentId)
        }
    }
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

const displayImageUploadInput = (id, modalImage) => {
    const newItemImageInput = document.getElementById('new-item-image-input')
    newItemImageInput.style.display = 'block'

    newItemImageInput.onchange = () => handleImageInputChange(newItemImageInput, id, modalImage)
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
    // Setup the confirmation modal and pass the confirm logic as a callback function
    setupConfirmationModal(itemName, async () => {
        try {
            // Close the modal
            document.getElementById('confirmation-modal').style.display = 'none'

            // API call to remove the item
            const response = await assets.removeItem(itemId)

            // Prevent the event from bubbling
            event.stopPropagation()

            // Remove item modal window
            itemModal.style.display = "none";

            // Rerender left menu container with updated contents
            updateContentsInLeftMenu(itemParentId, data)

            const itemParentContents = data.get(parseInt(itemParentId))
            // Re-render all the contents of the current container
            updateContentsInRightContainer(parentNode, itemParentContents, assets.getAssets())
        } catch (error) {
            console.error(error)
        }
    })
}

const handleClosingItemModalWindow = (modalTitle, itemModal, parentNode, data, itemParentId) => {
    itemModal.style.display = "none";

    const itemParentContents = data.get(parseInt(itemParentId))
    updateContentsInRightContainer(parentNode, itemParentContents, data)
}

export { getItemData, createItemDiv, createItemImage, createItemSpan, handleItemDivClick }