const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const { MessageEmbed } = require('discord.js')
const logger = require('../lib/logger')

module.exports = (message) => {
    let levelInput = parseInt(message.content)

    let valid = true
    if (!Number.isInteger(levelInput)) {
        valid = false
    } else if (levelInput < 1 || levelInput > 60) {
        valid = false
    }

    if (!valid) {
        logger.warn(`Rejected input "level" attribute value "${levelInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle("Your level has to be an integer between 1 and 60, inclusive. Try again.")] })
        return;
    }

    characterData.setAttribute(message.author.id, 'level', levelInput)

    message.author.send({ embeds: [new MessageEmbed().setTitle(`Okay, so you're level ${levelInput}. What is your character\'s current gearscore?`)] })
    flowData.setFlowState(message.author.id, 'gearscorePrompt')
}