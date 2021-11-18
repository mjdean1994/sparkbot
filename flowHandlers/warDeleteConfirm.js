const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let input = message.content
    wars.get(message.author.flow.metadata, (err, war) => {
        if (err) return logger.error(`Failed to get war: ${err}`)
        if (input == "DELETE") {
            war.delete((err) => {
                if (err) {
                    messenger.send(message.author, "Uh oh. I wasn't able to delete that for you.")
                    return
                }
                messenger.send(message.author, `BOOM! That war's been blasted to bits.`, menuFactory.getMainMenu(message.author))
            })
        } else {
            messenger.send(message.author, `Phew, okay. I won't delete the war, then.`)
            messenger.sendEmbed(message.author, war.getEmbed(message.author), menuFactory.getWarMenu(war, message.author))
        }

        message.author.flow.state = 'idle'
    })
}