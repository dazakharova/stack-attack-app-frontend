import { InventoryService } from "../class/InventoryService.js"
import rightContainer from './containerRenderHelpers.js';
import leftContainer from "./collapseFunctionality.js";
import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";


const backend_url = 'http://localhost:3001'

// Create new storage container (Map) for all data of the user which will be received from the server
export const assets = new InventoryService(backend_url)

// Access div for holding rooms hierarchy on the left page container
const roomsHierarchy = document.getElementById("roomsHierarchy")

const processRooms = (data) => {
    // Exclude first 3 elements of left container (heading and 2 buttons) from removing before rendering all rooms
    /*while (roomsHierarchy.children.length > 3) {
        roomsHierarchy.removeChild(roomsHierarchy.lastChild);
    }*/
    // Extract only parent containers from the given data (which have 'null' as a parent_id):
    const roomsArray = data.get(null)
    console.log("Rooms array", roomsArray)
    roomsArray.forEach(room => {
        leftContainer.renderRoom(roomsHierarchy, room, data)
    })
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

getAllData().then(() => {
    attachEventListenersToDynamicContent();
});

const attachEventListenersToDynamicContent = () => {
    const roomToggleButtons = Array.from(document.querySelectorAll('.button-container > .btn-toggle'));
    const collapses = roomToggleButtons.map(button => new bootstrap.Collapse(button.nextElementSibling.nextElementSibling, {toggle: false}));

    // Add event listener which prevent room buttons to be showed before the previous showed one is closed
    roomToggleButtons.forEach((button, index) => {
        button.addEventListener('click', function(event) {
            // Prevent default if manually handling collapse
            event.preventDefault();

            leftContainer.controlRoomButton(collapses, index)
        });
    })

    const newRoomButton = document.getElementById("new-room-btn")
    newRoomButton.onclick = () => {
        console.log(newRoomButton.classList)
        newRoomButton.style.display = "none" // Hide the button

        const newRoomDiv = document.createElement("div")
        newRoomDiv.setAttribute("id", "new-room-form")

        const input = document.createElement("input")
        input.setAttribute("id", "room-name-input")

        const button = document.createElement("button")
        button.setAttribute("id", "create-room")
        button.setAttribute("type", "submit")
        button.innerText = "Create room"

        newRoomDiv.appendChild(input)
        newRoomDiv.appendChild(button)

        const heading = document.querySelector("#roomsHierarchy > h2")

        // Instead of roomsHierarchy.appendChild(form);
        roomsHierarchy.insertBefore(newRoomDiv, heading.nextSibling);

        button.addEventListener("click", async(event) => {
            event.preventDefault()

            newRoomDiv.remove()
            newRoomButton.style.display = "block"

            const newRoomName = input.value
            if (newRoomName === "") {
                newRoomDiv.remove();
                newRoomButton.style.display = "block"
                return
            }
            const result = await assets.addNewContainer(newRoomName)
            leftContainer.renderRoom(roomsHierarchy, result, assets.getAssets())

        })

        let triggerCount = 0; // Initialize a counter for the click event

        // Detect click outside form to cancel
        const clickHandler = function(e) {
            console.log(e.target);
            if (!newRoomDiv.contains(e.target) && e.target !== newRoomButton) {
                newRoomDiv.remove();
                newRoomButton.style.display = "block";
            }
            triggerCount++; // Increment the counter each time the event is triggered
            if (triggerCount >= 2) {
                // If the event has been triggered twice, remove the event listener
                document.removeEventListener('click', clickHandler);
            }
        };

        document.addEventListener('click', clickHandler);
    }

    // Get the modal
    const newItemModal = document.getElementById('new-item-modal');

    // Add event listener for add-new-item button
    document.getElementById("new-item-btn").onclick = () => {
        newItemModal.style.display = 'block'

        document.getElementById("new-item-form").onsubmit = async function(event) {
            event.preventDefault(); // Prevent the form from submitting to a server

            // Get id of container inside which a new item must be rendered
            const containerId = parseInt(currentLocationPathDiv.lastElementChild.getAttribute("data-id"))
            const containerName = currentLocationPathDiv.lastElementChild.innerText

            // Get given name and description for a new item
            const itemName = document.getElementById("item-name-input").value;
            const itemDescription = document.getElementById("item-description-input").value;

            // Returns just added new item id
            const newItem = await assets.addNewItem(itemName, itemDescription, containerId)

            // Hide the modal after handling the data
            newItemModal.style.display = 'none'

            const parentContainersNode = document.querySelector(`#${containerName.replace(/\s+/g, '')}${containerId}-collapse > .containers-list`)
            const parentItemsNode = document.querySelector(`#${containerName.replace(/\s+/g, '')}${containerId}-collapse > .list-unstyled`)

            // Update contents of the current container, the user is in
            assetsBlocksDiv.innerHTML = ''
            parentItemsNode.innerHTML = ''
            parentContainersNode.innerHTML = ''

            console.log('parent of item is: ', assets.getAssets().get(containerId))
            assets.getAssets().get(containerId).forEach(c => {
                if (c instanceof Container) {
                    rightContainer.renderContainer(assetsBlocksDiv, c, assets.getAssets())
                    leftContainer.renderContainer(parentContainersNode, c, assets.getAssets())
                } else if (c instanceof Item) {
                    rightContainer.renderItem(assetsBlocksDiv, c, assets.getAssets())
                    leftContainer.renderItem(parentItemsNode, c, assets.getAssets())
                }
            })
        }
    }

    // Add event listener for add-new-place button
    document.getElementById("new-place-btn").onclick = () => {
        // Display the modal
        const newPlaceModal = document.getElementById('new-place-modal')
        newPlaceModal.style.display = 'block'

        document.getElementById("new-place-form").onsubmit = async function(event) {
            event.preventDefault(); // Prevent the form from submitting to a server
            console.log("submitted")
            // Get id of parent container inside which a new place must be rendered
            const parentId = parseInt(currentLocationPathDiv.lastElementChild.getAttribute("data-id"))
            const parentName = currentLocationPathDiv.lastElementChild.innerText
            console.log("parent id:", parentId)

            // Get given name for a new place
            const placeName = document.getElementById("place-name-input").value

            // Returns just added new item id
            const newContainer = await assets.addNewContainer(placeName, parentId)

            console.log("Parent container", parentName)

            const parentNode = document.querySelector(`#${parentName.replace(/\s/g, '')}${parentId}-collapse > ul`)
            console.log("new place parent", parentNode)

            // Update contents of the current container, the user is in
            rightContainer.renderContainer(assetsBlocksDiv, newContainer, assets.getAssets())
            leftContainer.renderContainer(parentNode, newContainer, assets.getAssets())

            // Hide the modal after handling the data
            newPlaceModal.style.display = 'none';
        }
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

const currentLocationPathDiv = document.getElementById("location-info")

const assetsBlocksDiv = document.querySelector(".space-container")



