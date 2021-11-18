const grants = require('../data/grants')

module.exports = class Flow {
    constructor(id, grants) {
        this.id = id
        this.grants = grants
    }

    grant(grantName) {
        this.grants[grantName] = true;
        grants.set(this.id, grantName, true)
    }

    revoke(grantName) {
        this.grants[grantName] = false;
        grants.set(this.id, grantName, false)
    }

    static fromJson(key, value) {
        return new Flow(key, value)
    }
}