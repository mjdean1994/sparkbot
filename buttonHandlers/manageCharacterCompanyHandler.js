const { MessageEmbed } = require('discord.js')
const flowData = require('../data/flowData')

module.exports = (interaction) => {
    interaction.user.send(
        {
            embeds: [new MessageEmbed().setTitle(`New friends, new experiences, I hope! What's your company's name? You can also say "none" if you're not in one at the moment.`)]
        }
    )
    flowData.setFlowState(interaction.user.id, 'companyEdit')

}