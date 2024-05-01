import { renderContents } from "../collapseFunctionality.js";
import {addRoomToPath} from "../locationPathControls.js";
import { updateContentsInRightContainer, setupConfirmationModal } from './uiDynamicUpdate.js'
import {assets, toggleDeleteMode} from '../profile.js'

// Function to create the room button
const createRoomButton = (room, collapseTarget) => {
    const roomButton = document.createElement("button");
    roomButton.classList.add('btn', 'btn-toggle', 'btn-room', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');
    roomButton.setAttribute('data-bs-toggle', 'collapse');
    roomButton.setAttribute('data-bs-target', collapseTarget);
    roomButton.setAttribute('aria-expanded', 'false');
    roomButton.textContent = room.getName();
    roomButton.setAttribute("data-id", room.getId());
    return roomButton;
};

// Function to create delete button
const createDeleteButton = () => {
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-icon';
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    return deleteBtn;
};

// Function to create the containers div
const createContainersDiv = (collapseTarget) => {
    const containersDiv = document.createElement("div");
    containersDiv.className = "collapse";
    containersDiv.setAttribute("id", collapseTarget.substring(1));
    const containersUl = document.createElement("ul");
    containersUl.classList.add("containers-list", "btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small");
    containersDiv.appendChild(containersUl);
    return { containersDiv, containersUl };
};

// Function to handle room button click
const handleRoomButtonClick = (roomButton, room, data, currentLocationPathDiv, assetsBlocksDiv) => {
    roomButton.onclick = () => {
        addRoomToPath(room.getId(), room.getName(), currentLocationPathDiv, data);
        const roomContents = assets.getAssets().get(room.getId());
        updateContentsInRightContainer(assetsBlocksDiv, roomContents, data);
    };
};

// Function to handle delete button click
const handleDeleteButtonClick = (deleteBtn, parentNode, room, roomDiv) => {
    deleteBtn.onclick = (event) => {
        return handleRoomDeletion(event, parentNode, room.getId(), room.getName(), roomDiv);
    };
};

// Function to render room contents
const renderRoomContents = (roomContents, containersUl, data) => {
    if (roomContents) {
        renderContents(roomContents, containersUl, data);
    }
};

const handleRoomDeletion = async (event, parentNode, roomId, roomName,  roomDiv) => {
    // Setup the confirmation modal and pass the confirm logic as a callback function
    setupConfirmationModal(roomName, async () => {
        try {
            event.preventDefault()
            // Close the modal
            document.getElementById('confirmation-modal').style.display = 'none';

            const response = await assets.removeContainer(roomId);

            // Prevent the event from bubbling up to the room button click listener
            event.stopPropagation();

            // Remove the roomDiv from the parentNode
            parentNode.removeChild(roomDiv);

            // Reset location path div
            document.getElementById('location-info').innerHTML = ''
            document.querySelector('.space-container').innerHTML = ''

            // Exit delete mode
            toggleDeleteMode();
        } catch (error) {
            console.error(error);
        }
    })
}

export { createRoomButton, createDeleteButton, createContainersDiv, renderRoomContents, handleRoomButtonClick, handleDeleteButtonClick }


