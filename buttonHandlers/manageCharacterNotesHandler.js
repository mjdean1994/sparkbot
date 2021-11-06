const { MessageEmbed } = require('discord.js')
const flowData = require('../data/flowData')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Okay, yeah. We can update your notes. What do you want the people to know? You can also say "none" to clear your notes.`)]
        }
    )
    flowData.setFlowState(interaction.user.id, 'noteEdit')

}