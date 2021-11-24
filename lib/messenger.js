const { MessageEmbed } = require('discord.js')
const client = require('../client')
const logger = require('../lib/logger')

const send = (user, message, components = []) => {
    let draft = {
        embeds: [new MessageEmbed().setTitle(message)],
        components: components
    }
    user.send(draft)
}

const sendMenu = (user, menu) => {
    user.send(menu)
}

const sendEmbed = (user, embed, components = []) => {
    let draft = {
        embeds: [embed],
        components: components
    }
    user.send(draft)
}

const sendDirectMessage = (userId, message, components = []) => {
    try {
        client.users.fetch(userId)
            .then((user) => {
                this.send(user, message, components)
            })
    } catch (ex) {
        logger.error(`Failed to send message to user ${userId}: ${ex}`)
    }
}

module.exports.send = send
module.exports.sendEmbed = sendEmbed
module.exports.sendMenu = sendMenu
module.exports.sendDirectMessage = sendDirectMessage