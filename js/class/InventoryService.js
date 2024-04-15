import { Item } from './Item.js';
import { Container } from './Container.js';

class InventoryService {
    #assets = new Map();
    #backendUrl = ''

    constructor(url) {
        this.#assets = new Map()
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
            return this.#assets
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
            return this.#assets
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
            return this.#addToContainersMap(json[0].id, json[0].name, json[0].parent_id, json[0].user_id)
        } catch (error) {
            return error
        }
    }

    getAssets = () => {
        return this.#assets
    }

    addNewItem = async(name, description, container_id) => {
        try {
            const url = `${this.#backendUrl}/items`
            const body = JSON.stringify({ name, description, container_id })
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            const json = await response.json()
            return this.#addItemToMap(json[0].id, json[0].name, json[0].description, json[0].container_id, json[0].user_id)
        } catch (error) {
            return error
        }
    }

    #addItemToMap = (id, name, description, container_id, user_id) => {
        const newItem = new Item(id, name, description, container_id, user_id)
        if (!this.#assets.get(newItem.getContainerId())) {
            this.#assets.set(newItem.getContainerId(), [])
        }
        this.#assets.get(newItem.getContainerId()).push(newItem)

        return newItem
    }

    #addToContainersMap = (id, name, parent_id, user_id) => {
        const newContainer = new Container(id, name, parent_id, user_id)
        console.log('Add to map new: ', newContainer)
        if (!this.#assets.get(newContainer.getParentId())) {
            this.#assets.set(newContainer.getParentId(), []);
        }
        this.#assets.get(newContainer.getParentId()).push(newContainer);
        return newContainer
    }

    #readJsonContainers = containersAsJson => {
        console.log('Containers as JSON', containersAsJson)
        containersAsJson.forEach(c => {
            const container = new Container(c.id, c.name, c.parent_id, c.user_id)
            if (!this.#assets.get(c.parent_id)) {
                this.#assets.set(c.parent_id, []);
            }

            this.#assets.get(c.parent_id).push(container);
        })
    }

    #readJsonItems = (itemsAsJson) => {
        console.log('Items as JSON', itemsAsJson)
        itemsAsJson.forEach(i => {
            const item = new Item(i.id, i.name, i.description, i.container_id, i.user_id)
            if (!this.#assets.get(i.container_id)) {
                this.#assets.set(i.container_id, []);
            }

            this.#assets.get(i.container_id).push(item);
        })
    }
}

export { InventoryService }