const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const wars = require('../data/wars')
const logger = require('../lib/logger')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction) => {
    let parts = interaction.customId.split(".")
    wars.get(parts[1], (err, war) => {
        if (err) {
            return logger.error(err)
        }
        war.setSlot(parts[2] - 1, parts[3] - 1, null)
        messenger.sendMenu(interaction.user, menuFactory.getWarSlotMenu(war, parts[2], parts[3], interaction.user))
    })
}