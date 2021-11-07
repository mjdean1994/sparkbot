const { MessageEmbed } = require('discord.js')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Oh, we don't do the whole "reset" thing anymore. Here's the new main menu.`)],
            components: menuFactory.getManageCharacterMenu()
        }
    )
}