const flowData = require('../data/flowData')
const logger = require('../lib/logger')

module.exports.handle = (message) => {
    flowData.getFlowState(message.author.id, (err, state) => {
        if (err) {
            message.author.send("Failed to get flowstate: " + err);
            return
        }

        if (!state) {
            state = 'new'
        }
        try {
            require(`./${state}`)(message)
        } catch (ex) {
            logger.error(`Could not find DM handler for state "${state}": ${ex}.`)
        }
    })
}