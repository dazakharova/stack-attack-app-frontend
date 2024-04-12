import { Container } from "../class/Container.js";
import { Item } from "../class/Item.js"
import { InventoryService } from "../class/InventoryService.js"
import rightContainer from './containerRenderHelpers.js';
import { addRoomToPath, addContainerToPath } from "./locationPath.js";
import {controlRoomButton, renderRoom} from "./collapseFunctionality.js";

const backend_url = 'http://localhost:3001'

// Create new storage container (Map) for all data of the user which will be received from the server
const assets = new InventoryService(backend_url)

// Access div for holding rooms hierarchy on the left page container
const roomsHierarchy = document.getElementById("roomsHierarchy")

const processRooms = (data) => {
    // Extract only parent containers from the given data (which have 'null' as a parent_id):
    const roomsArray = data.get(null)
    console.log("Rooms array", roomsArray)
    roomsArray.forEach(room => {
        renderRoom(room, data)
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
            addRoomToPath(b, currentLocationPathDiv, assetsBlocksDiv)
        })
    })

    // Add click listener for each container button followed by room button, once it's clicked - it gets added to the location path
    const containerButtons = document.querySelectorAll(".containers-list > li > button")
    containerButtons.forEach(b => {
        b.addEventListener("click", () => {
            addContainerToPath(b, currentLocationPathDiv)
        })
    })


    const roomToggleButtons = Array.from(document.querySelectorAll('.button-container > .btn-toggle'));
    const collapses = roomToggleButtons.map(button => new bootstrap.Collapse(button.nextElementSibling, {toggle: false}));

    // Add event listener which prevent room buttons to be showed before the previous showed one is closed
    roomToggleButtons.forEach((button, index) => {
        button.addEventListener('click', function(event) {
            // Prevent default if manually handling collapse
            event.preventDefault();

            controlRoomButton(collapses, index)
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

            // If there content inside room, display it in the assets block
            if (roomContent) {
                roomContent.forEach(c => {
                    if (c instanceof Container) {
                        rightContainer.renderContainer(assetsBlocksDiv, c, assetsMap)
                    } else if (c instanceof Item) {
                        rightContainer.renderItem(assetsBlocksDiv, c, assetsMap)
                    }
                })
            }
        })
    })
}

const currentLocationPathDiv = document.getElementById("location-info")

const assetsBlocksDiv = document.querySelector(".space-container")



