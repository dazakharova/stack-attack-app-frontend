import { Container } from "../class/Container.js";
import { Item } from "../class/Item.js"
import { InventoryService } from "../class/InventoryService.js"
import rightContainer from './containerRenderHelpers.js';
import { addRoomToPath, addContainerToPath } from "./locationPath.js";
import leftContainer from "./collapseFunctionality.js";

const backend_url = 'http://localhost:3001'

// Create new storage container (Map) for all data of the user which will be received from the server
const assets = new InventoryService(backend_url)

// Access div for holding rooms hierarchy on the left page container
const roomsHierarchy = document.getElementById("roomsHierarchy")

const processRooms = (data) => {
    while (roomsHierarchy.children.length > 2) {
        roomsHierarchy.removeChild(roomsHierarchy.lastChild);
    }
    // Extract only parent containers from the given data (which have 'null' as a parent_id):
    const roomsArray = data.get(null)
    console.log("Rooms array", roomsArray)
    roomsArray.forEach(room => {
        leftContainer.renderRoom(room, data)
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
    // Select all room buttons
    const roomMenuButtons = document.querySelectorAll(".button-container > button")

    // Add click listener for each room button, once it's clicked - location path on the right container changes accordingly
    roomMenuButtons.forEach(b => {
        b.addEventListener("click", () => {
            addRoomToPath(b, currentLocationPathDiv, assets.getAssets())
        })
    })

    // Add click listener for each container button followed by room button, once it's clicked - it gets added to the location path
    const containerButtons = document.querySelectorAll(".containers-list > li > button")
    containerButtons.forEach(b => {
        b.addEventListener("click", () => {
            addContainerToPath(b, currentLocationPathDiv, assets.getAssets())

            const id = parseInt(b.getAttribute("data-id"))
            const containerContents = assets.getAssets().get(id)

            if (containerContents) {
                assetsBlocksDiv.innerHTML = ''
                containerContents.forEach(c => {
                    if (c instanceof Container) {
                        rightContainer.renderContainer(assetsBlocksDiv, c, assets.getAssets())
                    } else if (c instanceof Item) {
                        rightContainer.renderItem(assetsBlocksDiv, c, assets.getAssets())
                    }
                })
            }
        })
    })


    const roomToggleButtons = Array.from(document.querySelectorAll('.button-container > .btn-toggle'));
    const collapses = roomToggleButtons.map(button => new bootstrap.Collapse(button.nextElementSibling, {toggle: false}));

    // Add event listener which prevent room buttons to be showed before the previous showed one is closed
    roomToggleButtons.forEach((button, index) => {
        button.addEventListener('click', function(event) {
            // Prevent default if manually handling collapse
            event.preventDefault();

            leftContainer.controlRoomButton(collapses, index)
        });
    })

    const roomButtons = document.querySelectorAll('.btn-room')
    roomButtons.forEach(b => {
        b.addEventListener('click', (event) => {
            // Clean the assets block
            assetsBlocksDiv.innerHTML = ''

            // Select all the nested containers inside the chosen room
            const roomId = parseInt(b.getAttribute("data-id"))
            const assetsMap = assets.getAssets()

            // Get room content if exist
            const roomContent = assetsMap.get(roomId)
            console.log(roomContent)

            // If there is content inside room, display it in the assets block
            if (roomContent) {
                roomContent.forEach(c => {
                    if (c instanceof Container) {
                        rightContainer.renderContainer(assetsBlocksDiv, c, assets.getAssets())
                    } else if (c instanceof Item) {
                        rightContainer.renderItem(assetsBlocksDiv, c, assetsMap)
                    }
                })
            }
        })
    })

    const newRoomButton = document.getElementById("new-room-btn")
    newRoomButton.addEventListener("click", () => {
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
            leftContainer.renderRoom(result, assets.getAssets())

        })

        // Detect click outside form to cancel
        document.addEventListener('click', function(e) {
            console.log(e.target)
            if (!newRoomDiv.contains(e.target) && e.target !== newRoomButton) {
                newRoomDiv.remove();
                newRoomButton.style.display = "block"
            }
        })
    })

    // Get the modal
    const newItemModal = document.getElementById('new-item-modal');

    // Add event listener for add-new-item button
    document.getElementById("new-item-btn").addEventListener("click", () => {
        newItemModal.style.display = 'block';

        // Close the modal
        document.getElementsByClassName('close')[1].addEventListener("click", () => {
            newItemModal.style.display = 'none';
        })

        document.getElementById("new-item-form").addEventListener("submit", async function(event) {
            event.preventDefault(); // Prevent the form from submitting to a server

            const containerId = parseInt(currentLocationPathDiv.lastElementChild.getAttribute("data-id"))
            console.log(containerId)

            const itemName = document.getElementById("item-name-input").value;
            const itemDescription = document.getElementById("item-description-input").value;

            // Returns just added new item id
            const newItem = await assets.addNewItem(itemName, itemDescription, containerId)

            newItemModal.style.display = 'none';

            rightContainer.renderItem(assetsBlocksDiv, newItem, assets.getAssets())

        });
    })

    // Add event listener for add-new-place button
    // document.getElementById("new-place-btn").addEventListener("click", () => {
    //
    // })

}

const currentLocationPathDiv = document.getElementById("location-info")

const assetsBlocksDiv = document.querySelector(".space-container")



