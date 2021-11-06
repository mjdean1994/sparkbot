const characterData = require("../data/characterData")
const flowData = require("../data/flowData")

const { MessageEmbed } = require('discord.js')

module.exports = (interaction) => {
    characterData.reset(interaction.user.id, (err) => {
        interaction.user.send({ embeds: [new MessageEmbed().setTitle(`No worries about wanting a fresh start. Let's start from the top. What's your character's in-game name?`)] })
        flowData.setFlowState(interaction.user.id, 'namePrompt')
    })
}