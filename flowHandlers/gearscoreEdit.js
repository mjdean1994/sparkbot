const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const { MessageEmbed } = require('discord.js')
const logger = require('../lib/logger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let gearscoreInput = parseInt(message.content)

    let valid = true
    if (!Number.isInteger(gearscoreInput)) {
        valid = false
    } else if (gearscoreInput < 1 || gearscoreInput > 600) {
        valid = false
    }

    if (!valid) {
        logger.warn(`Rejected input "gearscore" attribute value "${gearscoreInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle("Your gearscore has to be an integer between 1 and 600, inclusive. Try again.")] })
        return;
    }

    characterData.setAttribute(message.author.id, 'gearscore', gearscoreInput)

    message.author.send({
        embeds: [new MessageEmbed().setTitle(`I've updated your gearscore to ${gearscoreInput}. What else can I update for you?`)],
        components: menuFactory.getManageCharacterMenu()
    })
    flowData.setFlowState(message.author.id, 'idle')
}