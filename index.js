//https://discord.js.org/#/docs/main/stable/general/welcome

const {Client,MessageAttachment} = require('discord.js');
const userList = require('./UserList');
const gameplay = require('./gameplay');
const client = new Client();

const keyword = '!pir ';
let commandList = new Map();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', msg => {
  switch(msg.content){
    case keyword+'join':
    userList.addNewUser(client,msg);
    break;
    case keyword+'leave':
    userList.removeUser(client,msg);
    break;
    case keyword+'help':
    msg.reply('!pir join to join the game of Price is Right.\n !pir leave to leave the game.\n !pir check to check which user has joined the game and ready for it.\n !pir ready to get ready for it');
    break;
    case keyword+'check':
    userList.checkUser(client,msg);
    break;
    case keyword+'ready':
    userList.userReady(client,msg);
    if(userList.getAllReady()){
      console.log("all ready");
      gameplay.receivingSomething(userList.getUserList(),userList.getUserHost(),userList.getUserHost(),msg,MessageAttachment);
    }
    else{
      console.log("not ready");
    }
    break;
    case keyword+'test':
    try{
      gameplay.receivingSomething(userList.getUserList(),userList.getUserHost(),msg,MessageAttachment);
    }catch(err){
      console.log("Im trying to catch");
      console.error(err);
    }
    break;
  }
  if (msg.channel.type == "dm") {

      return;
  }

});

//Remember to enter the ID here before continuing to work Desktop/DiscordClientCode.txt
//Remember to remove ID before committing
client.login('NjkwODE2MzI1OTc0NjIyMjA4.XnW61g.hGMOpk1awXiKxhG56oVc41-U0ps');
