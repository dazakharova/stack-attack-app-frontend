import { Container } from "./class/Container.js";
import { Item } from "./class/Item.js"
import { InventoryService } from "./class/InventoryService.js"

const backend_url = 'http://localhost:3001'

// Create new storage container (Map) for all data of the user which will be received from the server
const assets = new InventoryService(backend_url)

// Access div for holding rooms hierarchy on the left page container
const roomsHierarchy = document.getElementById("roomsHierarchy")

const processRooms = (data) => {
    // Extract only parent containers from the given data (which have 'null' as a parent_id):
    const roomsArray = data[null]
    roomsArray.forEach(room => {
        renderRoom(room, data)
    })
}

const renderRoom = (room, data) => {
    console.log('Current room is ', room)

    // Getting data of the room
    const roomId = room.getId()
    const roomName = room.getName()

    // Create block for room button
    const roomDiv = document.createElement("div")
    roomDiv.className = "button-container"

    // Create room button
    const roomButton = document.createElement("button")

    // Assign unique collapse target for room button, which will be used as id in inner list storing subassets
    const collapseTarget = `#${roomName}${roomId}-collapse`

    // Assign rooms attributes
    roomButton.classList.add('btn', 'btn-toggle', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');
    roomButton.setAttribute('data-bs-toggle', 'collapse');
    roomButton.setAttribute('data-bs-target', collapseTarget);
    roomButton.setAttribute('aria-expanded', 'false');
    roomButton.setAttribute("data-id", roomId)
    roomButton.textContent = roomName;

    // Create div element for all inner elements stored inside the room
    const containersDiv = document.createElement("div")
    containersDiv.className = "collapse"
    containersDiv.setAttribute("id", collapseTarget.substring(1))

    // Create list element inside the containers div
    const ul = document.createElement("ul")
    ul.classList.add("btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small")

    // Append ul to the containers div
    containersDiv.appendChild(ul)

    // Append roomButton to the room div
    roomDiv.appendChild(roomButton)

    // Append container div to room div
    roomDiv.appendChild(containersDiv)

    // Append room div to room hierarchy div
    roomsHierarchy.appendChild(roomDiv)

    // Sub assets of current room (inside the data Map)
    const contents = data[roomId]

    // If current room has other assets inside it, render them
    if (contents) {
        console.log("There is something inside:", contents)

        contents.forEach(b => {
            if (b instanceof Container) {
                renderContainer(ul, b, data)
            } else if (b instanceof Item) {
                renderItem(ul, b, data)
            }
        })
    }
}

const renderContainer = (parentNode, container, data) => {
    console.log('Got box', container)

    // Get data of the container
    const containerId = container.getId()
    const containerName = container.getName()
    const containerParentId = container.getParentId()

    // Create the list item (li) element for holding one container
    let containerLi = document.createElement('li');

    // Create the button element for container
    let containerButton = document.createElement('button');

    // Add classes to the container button
    containerButton.classList.add('btn', 'btn-toggle', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');

    // Assign unique collapse target for container button, which will be used as id in inner list storing subassets of that container
    const collapseTarget = `#${containerName}${containerId}-collapse`

    // Set attributes for the container button
    containerButton.setAttribute('data-bs-toggle', 'collapse');
    containerButton.setAttribute('data-bs-target', collapseTarget);
    containerButton.setAttribute('aria-expanded', 'false');

    // Set unique attributes for container button in order to be able to access them later
    containerButton.setAttribute("data-id", containerId)
    containerButton.setAttribute("data-parentId", containerParentId)
    
    // Set the containerButton's text content
    containerButton.textContent = containerName;

    // Create block for items elements
    const itemsDiv = document.createElement("div")
    itemsDiv.className = "collapse"

    // Assigning collapse target from the container as an items block id
    itemsDiv.setAttribute("id", collapseTarget.substring(1))

    // Create an inner list of items block for holding each item
    const itemsUl = document.createElement("ul")
    itemsUl.className = "list-unstyled"

    // Append items list to the items div
    itemsDiv.appendChild(itemsUl)

    // Append the container button to the list item
    containerLi.appendChild(containerButton);

    // Append the items div to the container list item
    containerLi.appendChild(itemsDiv)

    // Append the container list item to the ul node, given as an argument
    parentNode.appendChild(containerLi)

    // Sub assets of current container (inside the data Map)
    const boxContents = data[containerId]

    // If current container has any assets inside it, then render them
    if (boxContents) {
        console.log("There is boxes inside:", boxContents)

        boxContents.forEach(b => {
            if (b instanceof Container) {
                renderContainer(parentNode, b, data)
            } else if (b instanceof Item) {
                renderItem(itemsUl, b, data)
            }
        })
    }
}

const renderItem = (parentNode, item, data) => {
    // Get data of the item
    const itemId = item.getId()
    const itemName = item.getName()
    const itemContainerId = item.getContainerId()

    // Create item list element for holding item link
    const itemElement = document.createElement("li")

    // Create item link
    const a = document.createElement("a")
    a.className = "link-item"
    a.setAttribute("href", "#")
    a.innerText = itemName

    // Set unique attributes to item link in order to be able to access it later
    a. setAttribute("data-id", itemId)
    a.setAttribute("data-containerId", itemContainerId)

    // Append item link to item list element
    itemElement.appendChild(a)

    // Append item list element to the given ul element as an argument
    parentNode.appendChild(itemElement)
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

getAllData();