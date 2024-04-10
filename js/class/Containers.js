import { Item } from './Item.js';
import { Container } from './Container.js';

class Containers {
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

    #readJsonContainers = containersAsJson => {
        containersAsJson.forEach(c => {
            const container = new Container(c.id, c.name, c.parent_id, c.user_id);
            this.#containers.set(container.getParentId(), container)
        })
    }

    #readJsonItems = (itemsAsJson) => {
        itemsAsJson.forEach(i => {
            const item = new Item(i.id, i.name, i.description, i.container_id, i.user_id)
            this.#containers.set(item.getContainerId(), item)
        })
    }
}

export { Containers }