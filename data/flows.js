const Flow = require('../models/flow')
const lockfile = require('proper-lockfile')
const fs = require('fs')
const logger = require('../lib/logger')

const file = "./data/flowData.json"
let cache = null

const getOrAdd = (id, next) => {
    let newFlow = { state: "new", metadata: null }

    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get flows: ${err}`, null);
                }
                if (obj[id]) {
                    release()
                    if (typeof obj[id] === 'string') {
                        obj[id] = { state: obj[id], metadata: "" }
                    }
                    next(null, Flow.fromJson(id, obj[id]))
                    return
                }
                obj[id] = newFlow
                _set(obj, (err) => {
                    release()
                    if (err) return next(err, null);
                    logger.info(`Created new flow for user ${id}.`)
                    next(null, Flow.fromJson(id, newFlow))
                })
            })
        })
        .catch((err) => {
            return next(`Failed to acquire lock for file ${file}: ${err}`, null)
        })
}

const setState = (id, state, next = () => { }) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get flows: ${err}`, null);
                }
                if (typeof obj[id] == 'string') {
                    let oldState = obj[id]
                    obj[id] = { state: oldState }
                }
                obj[id].state = state
                _set(obj, (err) => {
                    release()
                    logger.info(`Set flow state to "${state}" for user ${id}.`)
                    next(err, Flow.fromJson(id, obj[id]))
                })
            })
        })
}

const setMetadata = (id, metadata, next = () => { }) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get flows: ${err}`, null);
                }
                if (typeof obj[id] == 'string') {
                    let oldState = obj[id]
                    obj[id] = { state: oldState, metadata: "" }
                }
                obj[id].metadata = metadata
                _set(obj, (err) => {
                    release()
                    logger.info(`Set flow metadata to "${metadata}" for user ${id}.`)
                    next(err, Flow.fromJson(id, obj[id]))
                })
            })
        })
}

const setStateAndMetadata = (id, state, metadata, next = () => { }) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get flows: ${err}`, null);
                }
                if (typeof obj[id] == 'string') {
                    let oldState = obj[id]
                    obj[id] = { state: oldState, metadata: "" }
                }
                obj[id].state = state
                obj[id].metadata = metadata
                _set(obj, (err) => {
                    release()
                    logger.info(`Set flow metadata to "${metadata}" for user ${id}.`)
                    next(err, Flow.fromJson(id, obj[id]))
                })
            })
        })
}

const _get = (next) => {
    if (cache) return next(null, cache)
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            logger.error(`Failed to read ${file}: ${err}`)
            return next(err, null);
        }
        next(null, JSON.parse(data))
    })
}

const _set = (obj, next) => {
    fs.writeFile(file, JSON.stringify(obj), (err) => {
        if (err) logger.error(`Failed to write to ${file}: ${err}`)
        else cache = obj;
        next(err)
    })
}

module.exports.getOrAdd = getOrAdd
module.exports.setState = setState
module.exports.setMetadata = setMetadata
module.exports.setStateAndMetadata = setStateAndMetadata