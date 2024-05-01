import { InventoryService } from "../class/InventoryService.js";
import leftContainer from "./collapseFunctionality.js";
const backend_url = 'https://stack-attack-backend.onrender.com';
import { isAuthenticated } from './utils/auth.js';
import { displayNotificationMessageAndRedirect } from './utils/httpUtils.js';
import { setupNewItemModal } from './utils/itemCreationHandlers.js';
import { setupNewPlaceModal } from  './utils/placeCreationHandlers.js';
import { setupNewRoomButton, setupOutsideClickHandler, handleNewRoomFormSubmit } from './utils/roomCreationHandlers.js'

// Check if the user is logged in before rendering the page
// If not, display the message and redirect to the homepage
isAuthenticated().then(isAuthenticated => {
    if (!isAuthenticated) {
        displayNotificationMessageAndRedirect('You must be signed in to view this page. Please log in to continue.')
    } else {
        // If user is logged in, fetch all the data and render tha page
        getAllData().then(() => {
            attachEventListenersToDynamicContent();
        })
    }
})


// Create new storage container (Map) for all data of the user which will be received from the server
export const assets = new InventoryService(backend_url)

// Parent node of location path section
const currentLocationPathDiv = document.getElementById("location-info")

// Parent node of places and items block rendered in the rigth section
const assetsBlocksDiv = document.querySelector(".space-container")

// Access div for holding rooms hierarchy on the left page container
const roomsHierarchy = document.getElementById("roomsHierarchy")

// Fetch all data (parent containers (rooms), containers and items from the browser
const getAllData = async() => {
    try {
        const intermediateResult = await assets.getContainers()
        const result = await assets.getItems()
        processRooms(result)
    } catch (error) {
        console.error(error)
    }
}

const attachEventListenersToDynamicContent = () => {
    const roomToggleButtons = Array.from(document.querySelectorAll('.button-container > .btn-toggle'));
    const collapses = roomToggleButtons.map(button => new bootstrap.Collapse(button.nextElementSibling.nextElementSibling, {toggle: false}));

    // Add event listener which prevent room buttons to be showed before the previous showed one is closed
    roomToggleButtons.forEach((button, index) => {
        button.addEventListener('click', function(event) {
            // Prevent default if manually handling collapse
            event.preventDefault()

            leftContainer.controlRoomButton(collapses, index)
        });
    })

    const newRoomButton = document.getElementById("new-room-btn")
    const newRoomFormDiv = document.getElementById("new-room-form")
    const newRoomNameInput = document.getElementById("room-name-input")
    const createRoomBtn = document.getElementById("create-room")

    newRoomButton.onclick = () => {
        setupNewRoomButton(newRoomButton, newRoomFormDiv)
        setupOutsideClickHandler(newRoomButton, newRoomFormDiv)
    }

    createRoomBtn.onclick = event => handleNewRoomFormSubmit(event, newRoomNameInput, roomsHierarchy, newRoomButton, newRoomFormDiv)

    // Get the modal
    const newItemModal = document.getElementById('new-item-modal');

    // Add event listener for add-new-item button
    document.getElementById("new-item-btn").onclick = (event) => setupNewItemModal(event, newItemModal, currentLocationPathDiv, assets, assetsBlocksDiv);


    // Get new place form modal window
    const newPlaceModal = document.getElementById('new-place-modal')

    // Add event listener for add-new-place button
    document.getElementById("new-place-btn").onclick = (event) => setupNewPlaceModal(event, newPlaceModal, currentLocationPathDiv, assetsBlocksDiv)

    // Get delete mode button
    const toggleDeleteBtn = document.getElementById('toggle-delete-mode-btn');

    // Event listener for deleting room
    toggleDeleteBtn.onclick = toggleDeleteMode;

}

const processRooms = (data) => {
    // Exclude first 3 elements of left container (heading and 2 buttons) from removing before rendering all rooms
    while (roomsHierarchy.children.length > 4) {
        roomsHierarchy.removeChild(roomsHierarchy.lastChild);
    }
    // Extract only parent containers from the given data (which have 'null' as a parent_id):
    const roomsArray = data.get(null)
    console.log("Rooms array", roomsArray)
    // If current user has rooms, render them
    if (roomsArray) {
        roomsArray.forEach(room => {
            leftContainer.renderRoom(roomsHierarchy, room, data)
        })
    }
}

export function toggleDeleteMode() {
    document.getElementById('roomsHierarchy').classList.toggle('delete-mode');

    // Check if 'delete-mode' is now active and update button text
    if (roomsHierarchy.classList.contains('delete-mode')) {
        document.getElementById('toggle-delete-mode-btn').textContent = 'Cancel Delete';
    } else {
        document.getElementById('toggle-delete-mode-btn').textContent = 'Delete Room';
    }
}