class Item {
    #id
    #name
    #description
    #containerId
    #userId

    constructor(id, name, description, containerId, userId) {
        this.#id = id
        this.#name = name
        this.#description = description
        this.#containerId = containerId
        this.#userId = userId
    }

    getId() {
        return this.#id
    }

    getName() {
        return this.#name
    }

    getDescription() {
        return this.#description
    }

    getContainerId() {
        return this.#containerId
    }

    getUserId() {
        return this.#userId
    }

    setName(newName) {
        this.#name = newName
    }

    setDescription(newDescription) {
        this.#description = newDescription
    }
}

export { Item }