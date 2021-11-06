const { MessageEmbed } = require('discord.js')
const flowData = require('../data/flowData')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Oooo, need a new identity, huh? What's your new name?`)]
        }
    )
    flowData.setFlowState(interaction.user.id, 'nameEdit')

}