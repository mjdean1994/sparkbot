const { MessageEmbed } = require('discord.js')
const logger = require('../lib/logger')
const menuFactory = require('../lib/menuFactory')
const characterData = require('../data/characterData')

module.exports = (interaction) => {
    characterData.getEmbed(interaction.user.id, (err, embed) => {
        if (err) {
            return logger.error(`Failed to get character embed: ${err}`)
        }
        interaction.user.send(
            {
                embeds: [embed],
                components: menuFactory.getMainMenu()
            }
        )
    })
}