const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")

module.exports = (message) => {
    let time = message.content
    wars.get(message.author.flow.metadata, (err, war) => {
        if (err) return logger.error(`Failed to get war: ${err}`)
        try {
            war.time = time
        } catch (ex) {
            messenger.send(message.author, ex)
            return
        }

        messenger.send(message.author, `Alright, I've got the war as taking place at ${new Date(time).toLocaleString("en-US", { timeZone: "America/New_York" })}. Next, can you upload the roster configuration for this war?`)

        message.author.flow.state = 'warConfigNew'
    })
}