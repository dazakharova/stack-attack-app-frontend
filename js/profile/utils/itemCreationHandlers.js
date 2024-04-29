import { getBase64FromImageInput } from "./imageUtils.js";
import { showNotification } from "./notifications.js";
import { updateContentsInRightContainer } from "./uiDynamicUpdate.js";

const setupNewItemModal = (newItemModal, currentLocationPathDiv, assets, assetsBlocksDiv) => {
    // If no room selected, then show notification
    if (document.getElementById('location-info').innerHTML === '') {
        showNotification()
        return
    }

    newItemModal.style.display = 'block'

    // Initially disable the submit button
    const submitBtn = document.getElementById("submit-item-btn")
    submitBtn.disabled = false

    // Handle image upload, if any
    const itemImageInput = document.getElementById("item-image-input");
    itemImageInput.onchange = () => {
        return handleItemImageUpload(itemImageInput, submitBtn)
    }

    document.getElementById("new-item-form").onsubmit = event => handleNewItemFormSubmit(event, currentLocationPathDiv, itemImageInput, newItemModal, submitBtn, assets, assetsBlocksDiv);
}

const handleItemImageUpload = async (itemImageInput, submitBtn) => {
    if (itemImageInput.files.length > 0) {
        submitBtn.disabled = true; // Disable submit button only when a file is selected
        await getBase64FromImageInput(itemImageInput)
        submitBtn.disabled = false; // Enable submit button after processing the file
    }
}

const handleNewItemFormSubmit = async (event, currentLocationPathDiv, itemImageInput, newItemModal, submitBtn, assets, assetsBlocksDiv) => {
    event.preventDefault(); // Prevent the form from submitting to a server

    // Get id of container inside which a new item must be rendered
    const containerId = parseInt(currentLocationPathDiv.lastElementChild.getAttribute("data-id"))

    // Get given name and description for a new item
    const itemName = document.getElementById("item-name-input").value
    const itemDescription = document.getElementById("item-description-input").value

    const base64Image = await getBase64FromImageInput(itemImageInput).finally(() => {
        submitBtn.disabled = false // Re-enable submit button after loading the image, regardless of the outcome
    })

    // Returns just added new item id
    const newItem = await assets.addNewItem(itemName, itemDescription, containerId, base64Image)

    document.getElementById("new-item-form").reset(); // Reset the form fields
    newItemModal.style.display = 'none' // Hide the modal after handling the data
    submitBtn.disabled = false


    // Get current parent container contents and rerender them in both section
    const parentCurrentContainerContents = assets.getAssets().get(containerId)
    updateContentsInRightContainer(assetsBlocksDiv, parentCurrentContainerContents, assets.getAssets())
}

export  { setupNewItemModal }