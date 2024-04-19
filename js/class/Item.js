class Item {
    #id
    #name
    #description
    #containerId
    #userId
    #image

    constructor(id, name, description, containerId, userId, image) {
        this.#id = id
        this.#name = name
        this.#description = description
        this.#containerId = containerId
        this.#userId = userId
        this.#image = image
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

    getImage() {
        return this.#image
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

    setImage(newImage) {
        this.#image = newImage
    }
}

export { Item }