const flowData = require('../data/flowData')

const flowHandlers = {
    'namePrompt': require('./namePrompt'),
    'levelPrompt': require('./levelPrompt'),
    'gearscorePrompt': require('./gearscorePrompt'),
    'primaryWeaponPrompt': require('./primaryWeaponPrompt'),
    'secondaryWeaponPrompt': require('./secondaryWeaponPrompt'),
    'weightPrompt': require('./weightPrompt'),
    'idle': require('./idlePrompt'),
    'new': require('./newPrompt')
}

module.exports.handle = (message) => {
    flowData.getFlowState(message.author.id, (err, state) => {
        if (err) {
            message.author.send("Something went wrong: " + err);
            return
        }

        if (!state) {
            state = 'new'
        }

        if (!flowHandlers[state]) {
            return;
        }
        flowHandlers[state](message)
    })
}