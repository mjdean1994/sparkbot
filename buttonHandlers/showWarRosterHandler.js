const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const wars = require('../data/wars')
const logger = require('../lib/logger')

module.exports = (interaction) => {
    wars.get(interaction.customId.split(".")[1], (err, war) => {
        if (err) {
            return logger.error(err)
        }
        let rosterMessage = ""
        for (let i = 0; i < war.config.length; i++) {
            let groupConfig = war.config[i]
            let groupRoster = war.roster[i]
            rosterMessage += `**${groupConfig.name} - ${groupConfig.description}\n**`
            for (let j = 0; j < groupRoster.length; j++) {
                rosterMessage += `${j + 1}. ${groupRoster[j].name}\n`
            }
            rosterMessage += "\n"
        }

        interaction.user.send(rosterMessage)
        messenger.sendEmbed(interaction.user, war.getEmbed(interaction.user), menuFactory.getWarMenu(war, interaction.user))
    })
}