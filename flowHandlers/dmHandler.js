const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const logger = require('../lib/logger')

module.exports.handle = (message) => {
    flowData.getFlowState(message.author.id, (err, state) => {
        if (err) {
            message.author.send("Failed to get flowstate: " + err);
            return
        }
        characterData.getByDiscordId(message.author.id, (err, character) => {
            if (err) {
                message.author.send("Failed to get character information during DM handling: " + err)
                return;
            }
            if (!state) {
                if (character) {
                    logger.warn(`Couldn't find a flow state for user ${message.author.id} but they have a character!`)
                    state = 'idle'
                } else {
                    state = 'new'
                }
            }
            try {
                require(`./${state}`)(message)
            } catch (ex) {
                logger.error(`Could not find DM handler for state "${state}": ${ex}.`)
            }
        })
    })
}