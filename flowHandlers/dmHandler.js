const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const logger = require('../lib/logger')

module.exports.handle = (message) => {
    try {
        require(`./${message.author.flow.state}`)(message)
    } catch (ex) {
        return logger.error(`Failed to process flow state "${message.author.flow.state}": ${ex}`)
    }
}