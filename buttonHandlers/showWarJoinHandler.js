const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const wars = require('../data/wars')
const logger = require('../lib/logger')

module.exports = (interaction) => {
    wars.get(interaction.customId.split(".")[1], (err, war) => {
        if (err) {
            return logger.error(err)
        }
        war.addToWaitlist(interaction.user.id)
        messenger.sendEmbed(interaction.user, war.getEmbed(interaction.user), menuFactory.getWarMenu(war, interaction.user))
    })
}