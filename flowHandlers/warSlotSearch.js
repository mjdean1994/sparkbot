const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")
const menuFactory = require('../lib/menuFactory')
const filter = require('../lib/filter')
const characters = require('../data/characters')

module.exports = (message) => {
    let query = message.content
    let metadataParts = message.author.flow.metadata.split(".")
    wars.get(metadataParts[0], (err, war) => {
        if (err) return logger.error(`Failed to get war: ${err}`)

        if (query.toLowerCase() == "cancel") {
            messenger.sendMenu(message.author, menuFactory.getWarSlotMenu(war, metadataParts[1], metadataParts[2], message.author))
            message.author.flow.setStateAndMetadata('idle', metadataParts[0])
            return
        }

        let characterList = war.detailedWaitlist
        characterList = characterList.filter(x => !war.rosterIncludes(x.id))
        try {
            characterList = filter.apply(characterList, query)
        } catch (ex) {
            messenger.send(message.author, "I couldn't quite understand that. Are you sure that query string is right?")
            return
        }

        let results = characterList.map(x => `${x.name} [${x.gearscore}] - ${x.primaryWeapon}/${x.secondaryWeapon} - ${x.weight} Armor`)
        if (results.length == 0) {
            message.author.send(`No results found for query.`)
        } else {
            message.author.send(`**Query Results:**\n${results.join('\n')}`)
        }
        messenger.sendMenu(message.author, menuFactory.getWarSlotMenu(war, metadataParts[1], metadataParts[2], message.author))
        message.author.flow.setStateAndMetadata('idle', metadataParts[0])
    })
}