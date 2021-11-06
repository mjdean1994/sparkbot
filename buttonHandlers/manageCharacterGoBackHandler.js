const { MessageEmbed } = require('discord.js')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Alright, anything else I can help you with?`)],
            components: menuFactory.getMainMenu()
        }
    )
}