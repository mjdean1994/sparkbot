const { MessageEmbed } = require('discord.js')
const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const logger = require('../lib/logger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let nameInput = message.content

    if (nameInput.length > 256) {
        logger.warn(`Rejected input "notes" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`Yikes, talking as much as my ex-wife! Can you summarize all that for me? Try to keep it under 256 characters, please.`)] })
        return;
    }

    if (nameInput.startsWith("=")) {
        logger.warn(`Rejected input "notes" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`Uhhh, are you trying to do some injection there or something? Maybe try something that doesn't start with an equal sign.`)] })
        return;
    }

    if (nameInput.toLowerCase() == "none") {
        nameInput = ""
    }

    characterData.setAttribute(message.author.id, 'notes', nameInput)

    message.author.send({
        embeds: [new MessageEmbed().setTitle(`Okay, I'll jot all that down for you. Want to update anything else while we're at it?`)],
        components: menuFactory.getManageCharacterMenu()
    })
    flowData.setFlowState(message.author.id, 'idle')
}