const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const wars = require('../data/wars')
const logger = require('../lib/logger')
const { MessageEmbed } = require('discord.js')

module.exports = (interaction) => {
    messenger.send(interaction.user, "Who would you like to put in this slot? You can also say \"none\" to clear it.")
    interaction.user.flow.setStateAndMetadata('warSlotSelect', interaction.customId.split(".").slice(1).join("."))
}