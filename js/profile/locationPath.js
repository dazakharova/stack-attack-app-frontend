const addRoomToPath = (button, currentLocationPathDiv, assetsBlocksDiv) => {
    if (currentLocationPathDiv) {
        currentLocationPathDiv.innerHTML = ''
    }
    if (document.getElementById("room-name")) {
        return
    }

    const roomButton = document.createElement("button")
    roomButton.setAttribute("id", "room-name")
    const dataId = button.getAttribute("data-id")
    roomButton.setAttribute("data-id", dataId)
    roomButton.innerText = button.innerText

    roomButton.addEventListener("click", (event) => {
        // Clean the assets block
        assetsBlocksDiv.innerHTML = ''
        // Select all the nested containers inside the chosen room
        const roomId = button.getAttribute("data-id")
        console.log(roomId)
    })

    currentLocationPathDiv.appendChild(roomButton)
}

const addContainerToPath = (button, currentLocationPathDiv) => {
    // Select last location span added to the path
    const lastLocation = currentLocationPathDiv.lastElementChild;
    // Check last location parent id
    const lastLocationParentId = lastLocation.getAttribute("data-parentId")
    // Check parent id of the clicked container button
    const triggeredLocationParentId = button.getAttribute("data-parentId")

    // If parent_id of the last location and clicked container button is the same, then replace the last added location with the just clicked
    if (triggeredLocationParentId === lastLocationParentId) {
        lastLocation.remove()
    }

    // If this container button is already added to path, then ignore
    if (document.getElementById(`container-name${button.getAttribute("data-id")}`)) {
        return
    }

    // const containerSpan = document.createElement("span")
    const containerButton = document.createElement("buttons")
    const buttonId = `container-name${button.getAttribute("data-id")}`
    containerButton.setAttribute("id", buttonId)
    containerButton.setAttribute("data-id", button.getAttribute("data-id"))
    containerButton.setAttribute("data-parentId", button.getAttribute("data-parentId"))
    containerButton.innerText = " > " + button.innerText
    currentLocationPathDiv.appendChild(containerButton)
}

export { addRoomToPath, addContainerToPath }
