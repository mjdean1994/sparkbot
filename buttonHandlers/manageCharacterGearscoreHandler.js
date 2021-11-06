const { MessageEmbed } = require('discord.js')
const flowData = require('../data/flowData')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Nothing quite like some new loot. What is your gearscore, now?`)]
        }
    )
    flowData.setFlowState(interaction.user.id, 'gearscoreEdit')

}