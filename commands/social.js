const blockswan = require("./blockswan");

module.exports = {
    name: 'social',
    description: "Network Social medias List:",
    execute(message,args){
        message.channel.send('**BlockSwan online presence:**\n\n**:earth_asia: Website:**\n<https://blockswan.finance>\n**:bird: Twitter:**\n<https://twitter.com/BlockSwanHQ>\n**:camera: Instagram:**\n<https://www.instagram.com/blockswanhq>\n**:blue_book: Faceboook:**\n<https://www.facebook.com/blockswanhq>\n**:sagittarius: Github:**\n<https://github.com/BlockSwan>\n**:post_office: Linkedin:**\n<https://www.linkedin.com/company/blockswan-dao/>');
        
    }

}