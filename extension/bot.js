const tmi = require('tmi.js');

const CreateCommandText = (runData) => {
    var runnerText = ""
    var commText = ""
    runData.teams.forEach((team)=>{
        if(team.name == "Commentary"){
            team.players.forEach((player)=>{
                commText += `https://twitch.tv/${player.social.twitch} `
            })
        }else{
            team.players.forEach((player)=>{
                runnerText += `https://twitch.tv/${player.social.twitch} `
            })
        }
    })
    if(commText == ""){
        commText = "There is no commentary, this might be a mistake..."
    }
    console.log(`runner: ${runnerText}`)
    console.log(`commentary: ${commText}`)
    return [runnerText, commText]
}

const ChatBot = (nodecg) => {

    const runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
    var [runnerText, commText] = CreateCommandText(nodecg.readReplicant('runDataActiveRun', 'nodecg-speedcontrol'));
    runDataActiveRun.on('change', (newVal, oldVal) => {
        [runnerText, commText] = CreateCommandText(newVal)
    });

    const client = new tmi.Client({
        options: { debug: true },
        connection: {
            secure: true,
            reconnect: true
        },
        identity: {
            username: 'accord_bot',
            password: nodecg.bundleConfig.TWITCH_OAUTH_TOKEN
        },
        channels: ['accord_bot', 'reallyreallylongathon']
    });

    client.connect();

    client.on('message', (channel, tags, message, self) => {
        // Ignore echoed messages.
        if (self) return;

        if (message.toLowerCase() === '!hello') {
            client.say(channel, `@${tags.username}, Yo what's up`);
        }

        if (message.toLowerCase() === '!runner') {
            client.say(channel, runnerText);
        }

        if (message.toLowerCase() === '!commentary') {
            client.say(channel, commText);
        }

        if (message.toLowerCase() === '!coolness') {
            console.log(tags.username)
            if(tags.username === 'rodg1400'){
                client.say(channel, `@${tags.username} is certifiably cool 😎`);
            }else{
                client.say(channel, `@${tags.username} isn't cool 🥴`);

            }
        }

    });

}

module.exports = ChatBot