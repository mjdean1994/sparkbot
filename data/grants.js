const Grant = require('../models/grant')
const lockfile = require('proper-lockfile')
const fs = require('fs')
const logger = require('../lib/logger')

const file = "./data/grantData.json"
let cache = null

const getOrAdd = (id, next) => {
    let newGrant = {}

    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get grants: ${err}`, null);
                }
                if (obj[id]) {
                    release()
                    next(null, Grant.fromJson(id, obj[id]))
                    return
                }
                obj[id] = newGrant
                _set(obj, (err) => {
                    release()
                    if (err) return next(err, null);
                    logger.info(`Created new grants for user ${id}.`)
                    next(null, Grant.fromJson(id, newGrant))
                })
            })
        })
        .catch((err) => {
            return next(`Failed to acquire lock for file ${file}: ${err}`, null)
        })
}

const set = (id, name, value, next = () => { }) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get grants: ${err}`, null);
                }
                if (!obj[id]) {
                    obj[id] = {}
                }
                obj[id][name] = value
                _set(obj, (err) => {
                    release()
                    logger.info(`Set grant "${name}" to "${value}" for user ${id}.`)
                    next(err, Grant.fromJson(id, obj[id]))
                })
            })
        })
}

const _get = (next) => {
    if (cache) return next(null, cache);
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
module.exports.set = set