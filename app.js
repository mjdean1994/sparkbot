const { token, command_prefix } = require('./config.json');
const dmHandler = require('./flowHandlers/dmHandler')
const characterData = require('./data/characterData')
const flowData = require('./data/flowData')
const { MessageEmbed } = require('discord.js')
const logger = require('./lib/logger')

const client = require("./client")

const commands = [
    { keyword: 'character', execute: require('./commands/character') }
]

client.once('ready', () => {
    client.user.setActivity("New World", { type: "PLAYING" })
    logger.info('SparkBot has started.')
})

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    console.log(message.channel.id)
    if (message.channel.type == 'DM') {
        dmHandler.handle(message)
        return
    }

    // Short circuit if we don't match a command
    if (!message.content.startsWith(command_prefix)) return;

    let command_keyword = message.content.split(' ')[0].substr(command_prefix.length)
    let command = commands.find(x => x.keyword == command_keyword)

    // If we don't know what the base command is, ignore it
    if (command == null) return;

    command.execute(message)
});

client.on("interactionCreate", (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId == 'resetBtn') {
        interaction.deferUpdate()
        characterData.reset(interaction.user.id, (err) => {
            interaction.user.send({ embeds: [new MessageEmbed().setTitle(`No worries about wanting a fresh start. Let's start from the top. What's your character's in-game name?`)] })
            flowData.setFlowState(interaction.user.id, 'namePrompt')
        })
    }
})

client.login(token);