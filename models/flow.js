const flows = require('../data/flows')

module.exports = class Flow {
    constructor(id, state, metadata = null) {
        this.id = id
        this._state = state
        this._metdata = metadata
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

    static fromJson(key, value) {
        if (typeof value == 'string') {
            return new Flow(key, value)
        } else {
            return new Flow(key, value.state, value.metadata)
        }
    }
}