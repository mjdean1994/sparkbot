const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")
const axios = require('axios')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    if (message.attachments.length == 0) {
        messenger.send(message.author, `I don't see any files attached to your message. Try again.`)
        return
    }

    let attachment = message.attachments.first()
    let config
    axios.get(attachment.attachment)
        .then((response) => {
            console.log(response)
            wars.get(message.author.flow.metadata, (err, war) => {
                if (err) return logger.error(`Failed to get war: ${err}`)
                try {
                    war.config = response.data
                } catch (ex) {
                    messenger.send(message.author, "" + ex)
                    return
                }

                messenger.send(message.author, `Alright, that's all I need for now. When you're ready, you can generate a roster from the "Manage Wars" menu.`, menuFactory.getMainMenu(message.author))
                message.author.flow.state = 'idle'
            })
        })
        .catch((err) => {
            logger.error(`Failed to read from attached file: ${err}`)
            messenger.send(message.author, `I wasn't able to read that file. Try again.`)
            return
        })
}