import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";

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
    roomButton.classList.add('btn', 'btn-toggle', 'btn-room', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');
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
    ul.classList.add("containers-list", "btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small")

    // Append ul to the containers div
    containersDiv.appendChild(ul)

    // Append roomButton to the room div
    roomDiv.appendChild(roomButton)

    // Append container div to room div
    roomDiv.appendChild(containersDiv)

    // Append room div to room hierarchy div
    roomsHierarchy.appendChild(roomDiv)

    // Sub assets of current room (inside the data Map)
    const contents = data.get(roomId)

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
    containerButton.classList.add('btn', 'btn-toggle', 'btn-furniture', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');

    // Assign unique collapse target for container button, which will be used as id in inner list storing subassets of that container
    const collapseTarget = `#${containerName.replace(/\s+/g, '')}${containerId}-collapse`

    // Set attributes for the container button
    containerButton.setAttribute('data-bs-toggle', 'collapse');
    containerButton.setAttribute('data-bs-target', collapseTarget);
    containerButton.setAttribute('aria-expanded', 'false');

    // Set unique attributes for container button in order to be able to access them later
    containerButton.setAttribute("data-id", containerId)
    containerButton.setAttribute("data-parentId", containerParentId)

    // Set the containerButton's text content
    containerButton.textContent = containerName;

    // Create block for nested elements
    const childrenDiv = document.createElement("div")
    childrenDiv.className = "collapse"

    // Assigning collapse target from the container as an items block id
    childrenDiv.setAttribute("id", collapseTarget.substring(1))

    // Create a nested list of items block for holding each item
    const itemsUl = document.createElement("ul")
    itemsUl.className = "list-unstyled"

    // Append items list to the items div
    childrenDiv.appendChild(itemsUl)

    // Append the container button to the list item
    containerLi.appendChild(containerButton);

    // Append the items div to the container list item
    containerLi.appendChild(childrenDiv)

    // Append the container list item to the containersUl node, given as an argument
    parentNode.appendChild(containerLi)

    // Sub assets of current container (inside the data Map)
    const containerContents = data.get(containerId)

    // Create a nested list of containers block for holding each nested container (if so)
    const containersUl = document.createElement("ul")
    containersUl.classList.add("containers-list", "btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small")
    containersUl.setAttribute('data-bs-target', collapseTarget)
    childrenDiv.appendChild(containersUl)

    // If current container has any assets inside it, then render them
    if (containerContents) {
        console.log("There is boxes inside:", containerContents)

        containerContents.forEach(b => {
            if (b instanceof Container) {
                renderContainer(containersUl, b, data)
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

const controlRoomButton = (collapses, index) => {
    const currentCollapse = collapses[index];
    let isAnyOtherExpanded = false;

    // Hide other collapses if they are shown
    collapses.forEach((collapse, ci) => {
        if (ci !== index && collapse._element.classList.contains('show')) {
            collapse.hide();
            isAnyOtherExpanded = true;
        }
    });

    // Only toggle the current collapse if no other collapses are expanded
    if (!isAnyOtherExpanded) {
        currentCollapse.toggle();
    }
}

const leftContainer = {
    renderRoom, controlRoomButton
}

export default leftContainer