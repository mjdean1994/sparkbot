const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")

module.exports = (message) => {
    let name = message.content
    wars.get(message.author.flow.metadata, (err, war) => {
        if (err) return logger.error(`Failed to get war: ${err}`)
        try {
            war.name = name
        } catch (ex) {
            messenger.send(message.author, ex)
            return
        }

        messenger.send(message.author, `It shall be a glorious fight! What time is this war taking place? Enter it in format \`MM/DD/YYYY hh:mm\` with a 24-hour time in EST.`)

        message.author.flow.state = 'warTimeNew'
    })
}