const { MessageEmbed } = require('discord.js')
const client = require('../client')
const { logChannelId } = require('../config.json')

const send = (level, message, prefixEmoji) => {
    let now = new Date().toUTCString()
    let channel = client.channels.cache.get(logChannelId)
    let logMessage = `[${now}][${level}] ${message}`
    channel.send(`${prefixEmoji}\`${logMessage}\``)
    console.log(logMessage)
}

module.exports.info = (message) => {
    send('info', message, ":green_circle:")
}

module.exports.error = (message) => {
    send('error', message, ":red_circle:")
}

module.exports.warn = (message) => {
    send('warn', message, ":yellow_circle:")
}