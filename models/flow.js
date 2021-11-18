const flows = require('../data/flows')

module.exports = class Flow {
    constructor(id, state, metadata) {
        this.id = id
        this._state = state
        this._metadata = metadata
    }

    get state() {
        return this._state
    }

    get metadata() {
        return this._metadata
    }

    set state(state) {
        this._state = state
        flows.setState(this.id, state)
    }

    set metadata(metadata) {
        flows.setMetadata(this.id, metadata)
        this._metadata = metadata
    }

    setStateAndMetadata(state, metadata) {
        this._state = state
        this._metadata = metadata
        flows.setStateAndMetadata(this.id, state, metadata)
    }

    static fromJson(key, value) {
        return new Flow(key, value.state, value.metadata)
    }
}