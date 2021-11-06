const { MessageEmbed } = require('discord.js')
const flowData = require('../data/flowData')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Get tired of the same old dodge animation?. What's your weight class now? Your options are "light", "medium", or "heavy".`)]
        }
    )
    flowData.setFlowState(interaction.user.id, 'weightEdit')

}