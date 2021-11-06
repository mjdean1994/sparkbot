const { MessageEmbed } = require('discord.js')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Sure, we can change up your character. What would you like to update?`)],
            components: menuFactory.getManageCharacterMenu()
        }
    )
}