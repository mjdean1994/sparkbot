const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")
const menuFactory = require('../lib/menuFactory')
const filter = require('../lib/filter')
const characters = require('../data/characters')

module.exports = (message) => {
    let name = message.content.toLowerCase()
    let metadataParts = message.author.flow.metadata.split(".")
    wars.get(metadataParts[0], (err, war) => {
        if (err) return logger.error(`Failed to get war: ${err}`)
        let characterList = war.detailedWaitlist
        characterList = characterList.filter(x => !war.rosterIncludes(x.id))

        if (name == "none") {
            war.setSlot(metadataParts[1] - 1, metadataParts[2] - 1, null)
        } else {
            let filtered = characterList.filter(x => x.name.toLowerCase() == name)

            if (filtered.length == 0) {
                messenger.send(message.author, "Nobody with that name is on the waitlist. Try again, or say \"none\" to clear the slot.")
                return
            }

            war.setSlot(metadataParts[1] - 1, metadataParts[2] - 1, filtered[0])
        }
        messenger.sendMenu(message.author, menuFactory.getWarSlotMenu(war, metadataParts[1], metadataParts[2], message.author))
        message.author.flow.setStateAndMetadata('idle', metadataParts[0])
    })
}