const { Client, Intents } = require('discord.js');

module.exports = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });