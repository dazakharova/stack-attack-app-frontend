import {Containers} from "./class/Containers.js";

const addRoomButton = document.getElementById("addRoomButton")
const roomsHierarchy = document.getElementById("roomsHierarchy")

const containers = new Containers('http://localhost:3001')

addRoomButton.addEventListener("click", (event) => {
    event.preventDefault()
    // Create popup input field for name of the new room
    const input= document.createElement("input")
    input.type = "text"
    input.className = "dynamic-input"

    // Popup button for submitting name of the new room
    const createButton = document.createElement("button")
    createButton.textContent = "Create"
    createButton.type = "submit"
    createButton.className = "dynamic-button"


    // Once button is clicked, data is sent to the server and the new room is rendered on the screen
    createButton.addEventListener("click", (event) => {
        event.preventDefault()
        const newRoomName = input.value

        try {
            containers.addNewContainer(newRoomName).then(returnedContainer => {
                renderRoom(returnedContainer)
            })
        } catch (error) {
            console.error(error)
        }
    })

    addRoomButton.after(input)
    input.after(createButton)

    addRoomButton.style.display = "none"

    input.focus();
    // const newRoom = document.createElement("div")
    // newRoom.className = "button-container"
})

const renderRoom = container => {
    const newRoom = document.createElement("div")
    newRoom.className = "button-container"
    newRoom.setAttribute("data-id", container.getId())

    const targetCollapse = "collapse" + container.getId().toString()
    const button = document.createElement('button');
    button.className = 'btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed';
    button.dataset.bsToggle = 'collapse';
    button.dataset.bsTarget = targetCollapse;
    button.setAttribute('aria-expanded', 'false');
    button.textContent = container.getName()

    newRoom.appendChild(button)

    roomsHierarchy.appendChild(newRoom)
}