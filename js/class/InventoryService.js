import { Item } from './Item.js';
import { Container } from './Container.js';

class InventoryService {
    #containers = new Map();
    #backendUrl = ''

    constructor(url) {
        this.#containers = new Map()
        this.#backendUrl = url
    }

    getContainers = async () => {
        try {
            const url = this.#backendUrl + '/containers'
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Ensure credentials are included with cross-site requests
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            this.#readJsonContainers(json)
            return this.#containers
        } catch (error) {
            return error
        }
    }

    getItems = async () => {
        try {
            const url = this.#backendUrl + '/items'
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include', // Ensure credentials are included with cross-site requests
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            this.#readJsonItems(json)
            return this.#containers
        } catch (error) {
            return error
        }
    }

    addNewContainer = async(name, parent_id) => {
        try {
            const url = `${this.#backendUrl}/containers`
            const body = JSON.stringify({ name, parent_id })
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            const json = await response.json()
            return this.#addToContainersMap(json.id, json.name, json.parent_id, json.user_id)
        } catch (error) {
            return error
        }
    }

    addNewItem = async(name, parent_id) => {
        try {
            const url = `${this.#backendUrl}/items`
            const body = JSON.stringify({ name, parent_id })
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            const json = await response.json()

        } catch (error) {
            return error
        }
    }

    #addToContainersMap = (id, name, parent_id, user_id) => {
        const newContainer = new Container(id, name, parent_id, user_id)
        this.#containers.set(newContainer.getParentId(), newContainer)
        return newContainer
    }

    #readJsonContainers = containersAsJson => {
        console.log(containersAsJson)
        containersAsJson.forEach(c => {
            const container = new Container(c.id, c.name, c.parent_id, c.user_id)
            if (!this.#containers[c.parent_id]) this.#containers[c.parent_id] = [];
            this.#containers[c.parent_id].push(container);
            // const container = new Container(c.id, c.name, c.parent_id, c.user_id);
            // this.#containers.set(container.getParentId(), container)
        })
    }

    #readJsonItems = (itemsAsJson) => {
        console.log(itemsAsJson)
        itemsAsJson.forEach(i => {
            const item = new Item(i.id, i.name, i.description, i.container_id, i.user_id)
            if (!this.#containers[i.container_id]) this.#containers[i.container_id] = [];
            this.#containers[i.container_id].push(item);
            // const item = new Item(i.id, i.name, i.description, i.container_id, i.user_id)
            // this.#containers.set(item.getContainerId(), item)
        })
    }
}

export { InventoryService }