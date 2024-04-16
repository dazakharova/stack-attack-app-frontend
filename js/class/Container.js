class Container {
    #id
    #name
    #parentId
    #userId

    constructor(id, name, parentId, userId, items) {
        this.#id = id
        this.#name = name
        this.#parentId = parentId
        this.#userId = userId
    }

    getId() {
        return this.#id
    }

    getName() {
        return this.#name
    }

    getParentId() {
        return this.#parentId
    }

    getUserId() {
        return this.#userId
    }

    setName(newName) {
        this.#name = newName
    }

}

export { Container }