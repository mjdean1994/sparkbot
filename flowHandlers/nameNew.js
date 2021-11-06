const { MessageEmbed } = require('discord.js')
const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const logger = require('../lib/logger')

module.exports = (message) => {
    let nameInput = message.content

    if (nameInput.length > 256) {
        logger.warn(`Rejected input "name" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`Whoa, that name is way too long. Try something shorter. Again, it should be your character's in-game name.`)] })
        return;
    }

    if (!nameInput.match(/^[a-zA-Z0-9 .,]*$/g)) {
        logger.warn(`Rejected input "name" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`That name doesn't look like a valid New World name to me. Again, it should be your character's in-game name.`)] })
        return;
    }

    characterData.setAttribute(message.author.id, 'name', nameInput)

    message.author.send({ embeds: [new MessageEmbed().setTitle(`Nice to meet you, ${nameInput}. What company are you in? You can also say "none" if you aren't in one.`)] })
    flowData.setFlowState(message.author.id, 'companyNew')
}