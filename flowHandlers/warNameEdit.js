const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")
const menuFactory = require('../lib/menuFactory')

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

        messenger.send(message.author, `I've updated the war name to ${name}.`)
        messenger.sendEmbed(message.author, war.getEmbed(message.author), menuFactory.getWarMenu(war, message.author))

        message.author.flow.state = 'idle'
    })
}