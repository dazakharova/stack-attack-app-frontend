import { getContainers, readJsonContainers, getItems, readJsonItems, addNewContainer, addToContainersMap, addNewItem } from './containerServices.js';
import { Container } from "./class/Container.js";
import { Item } from "./class/Item.js"
import { InventoryService } from "./class/InventoryService.js"

const backend_url = 'http://localhost:3001'


const assets = new InventoryService(backend_url)


const addRoomButton = document.getElementById("addRoomButton")
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
    const roomId = room.getId()
    const roomName = room.getName()
    const contents = data[roomId]
    if (contents) {
        renderContents(contents, data)
    }
}

const renderContents = (roomContent, data) => {
    roomContent.forEach(c => {
        if (c instanceof Container) {
            console.log('Container ', c)
            renderBox(c, data)
        } else if (c instanceof Item) {
            console.log('Item ', c)
            renderItem(c, data)
        }
    })
}

const renderBox = (box, data) => {
    console.log('Got box', box)
    const boxId = box.getId()
    const boxContents = data[boxId]
    if (boxContents) {
        console.log("There is more boxes inside")
        boxContents.forEach(b => {
            if (b instanceof Container) {
                renderBox(b, data)
            } else if (b instanceof Item) {
                renderItem(b, data)
            }
        })
    }
}

const renderItem = (item, data) => {
    console.log('Current item: ', item)
}

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