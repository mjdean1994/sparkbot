const { MessageEmbed } = require('discord.js')
const flowData = require('../data/flowData')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`Alright, moving up in the world. What level are you now?`)]
        }
    )
    flowData.setFlowState(interaction.user.id, 'levelEdit')

}