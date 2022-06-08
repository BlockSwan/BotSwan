module.exports = async (client) => {
    const guild = client.guilds.cache.get('882988878082998343');
    setInterval(()=>{
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('914741887515131934');
        channel.setName(`📊Total Hodlers: ${memberCount.toLocaleString()}`);
        console.log('Updating Member Count');
    },600000);
}