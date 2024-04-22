import { Item } from './Item.js';
import { Container } from './Container.js';
import { handleHttpResponseError, processNetworkError } from '../profile/httpUtils.js'

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
            if (response.ok) {
                const json = await response.json()
                this.#readJsonContainers(json)
                return this.#assets
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
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
            if (response.ok) {
                const json = await response.json()
                this.#readJsonItems(json)
                return this.#assets
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    searchItems(query) {
        const searchResults = [];
        for (const [key, assets] of this.#assets) {
            for (const asset of assets) {
                if (asset instanceof Item && asset.matchesQuery(query)) {
                    searchResults.push(asset);
                }
            }
        }
        return searchResults;
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
            if (response.ok) {
                const json = await response.json()
                return this.#addToContainersMap(json[0].id, json[0].name, json[0].parent_id, json[0].user_id)
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    getAssets = () => {
        return this.#assets
    }

    addNewItem = async(name, description, container_id, image) => {
        try {
            const url = `${this.#backendUrl}/items`
            const body = JSON.stringify({ name, description, container_id, image })
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            if (response.ok) {
                const json = await response.json()
                return this.#addItemToMap(json[0].id, json[0].name, json[0].description, json[0].container_id, json[0].user_id, json[0].image)
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    editContainerName = async (id, name) => {
        try {
            const url = `${this.#backendUrl}/containers/${id}`
            const body = JSON.stringify({ name: name })
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            if (response.ok) {
                const json = await response.json()
                return this.#editContainerNameInMap(json.id, json.name, json.parent_id)
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    removeContainer = async(id) => {
        try {
            const url = `${this.#backendUrl}/containers/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                const json = await response.json()
                this.#removeContainerFromMap(json.id, json.parent_id)
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    removeItem = async(id) => {
        try {
            const url = `${this.#backendUrl}/items/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                const json = await response.json()
                return this.#removeItemFromMap(json.id, json.container_id)
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    editItemName = async (id, name) => {
        try {
            const url = `${this.#backendUrl}/items/${id}`
            const body = JSON.stringify({ name: name })
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            if (response.ok) {
                const json = await response.json()
                return this.#editItemNameInMap(json.id, json.name, json.container_id)
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    editItemDescription = async (id, description) => {
        try {
            const url = `${this.#backendUrl}/items/${id}`
            const body = JSON.stringify({ description: description })
            const response = await fetch(url, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            if (response.ok) {
                const json = await response.json()
                return this.#editItemDescriptionInMap(json.id, json.description, json.container_id)
            } else {
                return handleHttpResponseError(response)
            }
        } catch (error) {
            processNetworkError(error)
        }
    }

    #removeItemFromMap = (id, container_id) => {
        const updatedContainerArray = this.#assets.get(container_id).filter(asset => !(asset instanceof Item && asset.getId() === id))
        this.#assets.set(container_id, updatedContainerArray)
    }

    #editItemDescriptionInMap = (id, description, container_id) => {
        this.#assets.get(container_id).forEach(asset => {
            if (asset instanceof Item && asset.getId() === id) {
                asset.setDescription(description)
            }
        })
    }

    #editItemNameInMap = (id, name, container_id) => {
        this.#assets.get(container_id).forEach(asset => {
            if (asset instanceof Item && asset.getId() === id) {
                asset.setName(name)
            }
        })
    }

    #editContainerNameInMap = (id, name, parent_id) => {
        this.#assets.get(parent_id).forEach(asset => {
            if (asset instanceof Container && asset.getId() === id) {
                asset.setName(name)
            }
        })

    }

    #removeContainerFromMap = (id, parentId) => {
        const updatedParentContainerArray = this.#assets.get(parentId).filter(asset => !(asset instanceof Container && asset.getId() === id))
        this.#assets.set(parentId, updatedParentContainerArray)
        this.#assets.delete(id)
        console.log(`deleted id: ${id}, new assets map`)
    }

    #addItemToMap = (id, name, description, container_id, user_id, image) => {
        const newItem = new Item(id, name, description, container_id, user_id, image)
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
            const item = new Item(i.id, i.name, i.description, i.container_id, i.user_id, i.image)
            if (!this.#assets.get(i.container_id)) {
                this.#assets.set(i.container_id, []);
            }
            this.#assets.get(i.container_id).push(item);
        })
    }
}

export { InventoryService }

