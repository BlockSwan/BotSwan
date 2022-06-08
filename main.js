const Discord = require('discord.js');
const { listenerCount } = require('events');
require('dotenv').config();

const prefix = process.env.PREFIX;

const fs = require('fs');

const memberCounter = require('./counters/member-counter')

const client = new Discord.Client({ 
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        ],
});





client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log('BotSwan is online!');
    memberCounter(client);

});



client.on('guildMemberAdd', guildMember =>{
        guildMember.guild.channels.cache.get('882988878666027050').send(`Hello <@${guildMember.user.id}>! We are now ${client.guilds.cache.get('882988878082998343').memberCount.toLocaleString()} hodlers inside BlockSwan Virtual Office. Welcome, hold tight, and enjoy the ride!`);
   
});

client.on('message', (message) => {
    if(!message.content.startsWith(prefix)|| message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    let targetChannel = message.content.substring(6,24);
    let msgToSend = message.content.substring(25);
    let message_id = message.content.substring(25,43);
    let newMsg = message.content.substring(44);

    if (command === 'blockswan'){
        client.commands.get('blockswan').execute(message,args);
    } else if (command == 'social'){
        client.commands.get('social').execute(message,args);
    } else if (command == 'echo'){
        client.channels.cache.get(targetChannel).send(msgToSend);
    } else if (command == 'edit'){
        client.channels.cache.get(targetChannel).messages.fetch(message_id).then(msg => msg.edit(newMsg));
    } 
  });







client.login(process.env.DISCORD_TOKEN);