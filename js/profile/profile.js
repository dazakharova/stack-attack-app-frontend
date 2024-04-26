import { InventoryService } from "../class/InventoryService.js"
import leftContainer from "./collapseFunctionality.js";
import { updateContentsInLeftMenu, updateContentsInRightContainer, handleImageUploading } from './uiDynamicUpdate.js'
const backend_url = 'http://localhost:3001'
import { isAuthenticated } from './redirectToHomePage.js'
import { displayNotificationMessageAndRedirect } from './httpUtils.js'
import { setupConfirmationModal } from './uiDynamicUpdate.js'

// Check if the user is logged in before rendering the page
// If not, display the message and redirect to the homepage
isAuthenticated().then(isAuthenticated => {
    if (!isAuthenticated) {
        displayNotificationMessageAndRedirect('Your session has expired. Please log in again to continue.')
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

        newRoomButton.style.display = "none" // Hide the button

        newRoomFormDiv.style.display = "block" // Show new room input form

        let triggerCount = 0 // Initialize a counter for the click event

        // Detect click outside form to cancel
        const clickHandler = function(e) {
            console.log(e.target);
            if (!newRoomFormDiv.contains(e.target) && e.target !== newRoomButton) {
                newRoomFormDiv.style.display = "none" // Hide the new room form
                newRoomButton.style.display = "block" // Show new room button
            }
            triggerCount++; // Increment the counter each time the event is triggered
            if (triggerCount >= 2) {
                // If the event has been triggered twice, remove the event listener
                document.removeEventListener('click', clickHandler);
            }
        }

        document.addEventListener('click', clickHandler);
    }

    createRoomBtn.onclick = async(event) => {

        // Get new room name from the input field that was submitted
        const newRoomName = newRoomNameInput.value

        event.preventDefault()

        // Hide the new room form and show add new room button again
        newRoomFormDiv.style.display = "none"
        newRoomButton.style.display = "block"

        // If submitted value in the input field is not empty, update data in the local map and in the server side
        if (newRoomName !== "") {
            const result = await assets.addNewContainer(newRoomName)
            // Rerender left menu with updated data
            leftContainer.renderRoom(roomsHierarchy, result, assets.getAssets())
        }
    }

    // Get the modal
    const newItemModal = document.getElementById('new-item-modal');

    // Add event listener for add-new-item button
    document.getElementById("new-item-btn").onclick = () => {
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
        itemImageInput.onchange = async () => {
            if (itemImageInput.files.length > 0) {
                submitBtn.disabled = true; // Disable submit button only when a file is selected
                await getBase64FromImageInput(itemImageInput)
                submitBtn.disabled = false; // Enable submit button after processing the file
            }
        }

        document.getElementById("new-item-form").onsubmit = async function(event) {
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

            this.reset(); // Resets the form fields
            newItemModal.style.display = 'none' // Hide the modal after handling the data
            submitBtn.disabled = false


            // Get current parent container contents and rerender them in both section
            const parentCurrentContainerContents = assets.getAssets().get(containerId)
            updateContentsInLeftMenu(containerId, assets.getAssets())
            updateContentsInRightContainer(assetsBlocksDiv, parentCurrentContainerContents, assets.getAssets())

        };
    };


    // Get new place form modal window
    const newPlaceModal = document.getElementById('new-place-modal')

    // Add event listener for add-new-place button
    document.getElementById("new-place-btn").onclick = () => {
        // If no room selected, then show notification
        if (document.getElementById('location-info').innerHTML === '') {
            showNotification()
            return
        }

        // Display the modal
        newPlaceModal.style.display = 'block'
    }

    document.getElementById("new-place-form").onsubmit = async function(event) {
        event.preventDefault(); // Prevent the form from submitting to a server

        // Get id of parent container inside which a new place must be rendered
        const parentId = parseInt(currentLocationPathDiv.lastElementChild.getAttribute("data-id"))

        // Get given name for a new place
        const placeName = document.getElementById("place-name-input").value

        // Returns just added new item id
        const newContainer = await assets.addNewContainer(placeName, parentId)

        // Get current parent container contents and rerender them in both sections
        const parentCurrentContainerContents = assets.getAssets().get(parentId)
        updateContentsInLeftMenu(parentId, assets.getAssets())
        updateContentsInRightContainer(assetsBlocksDiv, parentCurrentContainerContents, assets.getAssets())

        // Hide the modal after handling the data
        newPlaceModal.style.display = 'none';
    }

    // Get delete mode button
    const toggleDeleteBtn = document.getElementById('toggle-delete-mode-btn');

    // Event listener for deleting room
    toggleDeleteBtn.onclick = () => {
        roomsHierarchy.classList.toggle('delete-mode');

        // Check if 'delete-mode' is now active and update button text
        if (roomsHierarchy.classList.contains('delete-mode')) {
            toggleDeleteBtn.textContent = 'Cancel Delete';
        } else {
            toggleDeleteBtn.textContent = 'Delete Room';
        }
    }
}

// Encode image for storing it on the client and in the database
export function getBase64FromImageInput(inputElement) {
    return new Promise((resolve, reject) => {
        if (inputElement.files.length === 0) {
            resolve(''); // No file was selected
        } else {
            const file = inputElement.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64String = event.target.result.replace("data:", "").replace(/^.+,/, "")
                resolve(base64String); // Resolve the promise with the base64 string
            };
            reader.onerror = function(error) {
                reject(error)
            };
            reader.readAsDataURL(file)
        }
    });
}

function showNotification() {
    const notification = document.createElement('p')
    notification.textContent = 'No room selected. Please select a room to proceed.'

    // Get the div where the message will be displayed
    const  locationInfoDiv = document.getElementById('location-info');

    // Append the message to the div
    locationInfoDiv.appendChild(notification);
}