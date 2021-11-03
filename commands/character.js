const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const { MessageEmbed } = require('discord.js')

module.exports = (message) => {
    message.delete()
    characterData.getByDiscordId(message.author.id, (err, character) => {
        if (!character) {
            characterData.create(message.author.id, (err) => {
                message.author.send({ embeds: [new MessageEmbed().setTitle(`Hey! I don't think we've spoken before. What's your character's in-game name?`)] })
                flowData.setFlowState(message.author.id, 'namePrompt')
            })
        }
    });
};