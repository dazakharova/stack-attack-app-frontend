import { assets } from "../profile.js";
import { setupConfirmationModal, renderContainerContents, updateContentsInLeftMenu, updateContentsInRightContainer } from "./uiDynamicUpdate.js";
import {displayNotificationMessage} from "./notifications.js";


function createContainerDiv() {
    const div = document.createElement('div');
    div.className = 'box';
    return div;
}

// Initialize Container Footer
function createContainerFooter() {
    const footer = document.createElement('div');
    footer.className = 'box-footer';
    return footer;
}

// Initialize Title Span
function createTitleSpan(containerId, containerParentId, containerName) {
    const span = document.createElement('span');
    span.className = 'title';
    span.setAttribute('data-id', containerId);
    span.setAttribute('data-parentId', containerParentId);
    span.innerText = containerName;
    return span;
}

// Event Handler for container click
function handleContainerClick(containerDiv, parentNode, containerContents, containerId, containerName, containerParentId, data) {
    containerDiv.onclick = (event) => {
        renderContainerContents(event, parentNode, containerContents, containerId, containerName, containerParentId, data);
    };
}

// Handle name editing
function setupNameEdit(editBtn, containerSpan, containerDivFooter) {
    editBtn.onclick = () => replaceTitleWithEditableInput(containerDivFooter, containerSpan);
}

// Handle container name saving
function setupNameSave(okNameBtn, containerSpan, containerId, containerParentId, data) {
    okNameBtn.onclick = () => {
        return updateContainerNameAndRefreshUI(containerSpan, containerId, containerParentId, data);
    }
}

// Handle container deletion
function setupDelete(deleteBtn, containerName, containerId, containerDiv, parentNode, containerParentId, data) {
    deleteBtn.onclick = (event) => handleContainerDeletion(event, containerName, containerId, containerDiv, parentNode, containerParentId, data);
}

// Show input for editing name
const replaceTitleWithEditableInput = (containerDivFooter, containerSpan) => {
    containerSpan.style.display = 'none'

    // Show input new container name
    const newContainerNameDiv = document.querySelector('.new-container-name-div')
    // newContainerNameDiv.style.display = 'block'
    newContainerNameDiv.classList.remove('hidden')
    newContainerNameDiv.classList.add('active')


    // Put the value of the container name into the input field
    const newContainerNameInput = document.querySelector('.title-input')
    newContainerNameInput.value = containerSpan.textContent

    // Focus on the input and select its content
    newContainerNameInput.focus()
    newContainerNameInput.select()
}

// Update container name
const updateContainerNameAndRefreshUI = async (containerSpan, containerId, containerParentId, data) => {

    const newContainerNameDiv = document.querySelector('.new-container-name-div')

    const newContainerNameInput = document.querySelector('.title-input')

    try {
        // Update container name in UI
        containerSpan.textContent = newContainerNameInput.value
        newContainerNameDiv.classList.remove('active')
        newContainerNameDiv.classList.add('hidden')

        containerSpan.style.display = 'block'

        // Apply container name changes in local Map and send them to the server
        const response = await assets.editContainerName(containerId, newContainerNameInput.value)

        updateContentsInLeftMenu(containerParentId, data)
    } catch (error) {
        displayNotificationMessage('Something went wrong. Please, try again later.')
        console.error(error)
    }
}

const handleContainerDeletion = async (event, containerName, containerId, containerDiv, parentNode, containerParentId, data) => {
    // Setup the confirmation modal and pass the confirm logic as a callback function
    setupConfirmationModal(containerName, async () => {
        try {
            // Close the modal
            document.getElementById('confirmation-modal').style.display = 'none'

            // API call to remove the container
            const response = await assets.removeContainer(containerId)

            // Prevent the event from bubbling
            event.stopPropagation()

            // Update the UI
            const containerParentContents = data.get(parseInt(containerParentId))
            updateContentsInRightContainer(parentNode, containerParentContents, assets.getAssets())
            updateContentsInLeftMenu(containerParentId, assets.getAssets())
        } catch (error) {
            displayNotificationMessage('Something went wrong. Please, try again later.')
            console.error(error)
        }
    })
}


export { createContainerDiv, createContainerFooter, createTitleSpan, handleContainerClick, setupNameEdit, setupNameSave, setupDelete }

