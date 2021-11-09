const { MessageEmbed } = require('discord.js')

const send = (user, message, components = []) => {
    let draft = {
        embeds: [new MessageEmbed().setTitle(message)],
        components: components
    }
    user.send(draft)
}

const sendEmbed = (user, embed, components = []) => {
    let draft = {
        embeds: [embed],
        components: components
    }
    user.send(draft)
}

module.exports.send = send
module.exports.sendEmbed = sendEmbed