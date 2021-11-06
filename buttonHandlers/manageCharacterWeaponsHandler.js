const { MessageEmbed } = require('discord.js')
const flowData = require('../data/flowData')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`I can definitely update your weapons. What's the first weapon you're using now?`)]
        }
    )
    flowData.setFlowState(interaction.user.id, 'weapon1Edit')

}