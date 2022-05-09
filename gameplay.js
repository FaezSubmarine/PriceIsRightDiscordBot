var itemImage;
var itemName;
var itemPrice;
var gameplayClient;
var gameplayMsgAttachment;

let gameplayUserList = new Map();
let userAlreadyFilled = new Map();
var gameplayUserHost;
//todo: do something like AskForSomething with where var stages are functions
module.exports = {
  //todo: continue with initgameplay
  initGameplay:function(Client,MessageAttachment){
    gameplayClient = Client;
    gameplayMsgAttachment = MessageAttachment;
  },
  receivingSomething:function(userList,userHost,author,msg,MessageAttachment){
    userList.forEach(u=>{gameplayUserList.set(u,0)});
    //gameplayUserList = userList;
    gameplayUserHost = userHost.id;
    const filter = m=>{
      if(m.author.bot){
        return false;
      }
      if(m.attachments.size != 1){
        userHost.send("give me an attachment image");
        return false;
      }
      var tempIT = m.attachments.values().next().value.url;
      if((tempIT.endsWith(".jpg") || tempIT.endsWith(".png") ||
      tempIT.endsWith(".jpeg") || tempIT.endsWith(".PNG"))){
        itemImage = new MessageAttachment(tempIT);
        return true;
      }
      userHost.send("just send me ONE image");
      return false;
    };

    userHost.createDM().then(() => {
      userHost.send('send me your image').then(()=>{
        userHost.dmChannel.awaitMessages(filter, { max: 1})
        .then(collected => {
          receivingName(userHost,msg);
        })
        .catch(collected => {
          userHost.send('fuck image.');
        });
      })

    })
  }
}
function alreadyFilledIn(thisUser,testStr){
  if(userAlreadyFilled.has(thisUser)){
    return true;
  }
  userAlreadyFilled.set(thisUser,testStr);
  return false;
}
//todo: either get more 'players' in or just continue on and check against answers
function priceIsRightGuess(msg){
  var testStr;
  const filter4 = m=>{
    console.log(m.author.id+" and "+ gameplayUserHost);
    if(!m.content.startsWith("!pir ")){
      return false;
    }
    if(m.author.id == gameplayUserHost){
      msg.channel.send("Host must not put the price in!");
      return false;
    }
    if(m.author.bot){
      return false;
    }
    testStr = m.content.slice(4,m.content.length-1);
    console.log("test str "+testStr);
    //return !isNaN(m.content);
    //TODO:test this next
    return !isNaN(testStr) && !alreadyFilledIn(m.author.id,testStr);
  };
  msg.channel.send("The host has successfully submitted their entry");
  msg.channel.send("what's the price of "+itemName,itemImage).then(()=>{
    msg.channel.awaitMessages(filter4,{max:gameplayUserList.size-1}).then(collected=>{
      //TODO: Get more accounts to test this with

      msg.channel.send("Everyone has submitted their answer. The winner is ");
    }).catch(collected=>{
      console.log("fucked");
    });
  });
}
function receivingName(author,msg){
  const filter2 = m=>{
    return m.content.size != '';
  };
  author.dmChannel.send("got the image!\n what's its name?").then(()=>{
    author.dmChannel.awaitMessages(filter2,{max: 1})
    .then(collected =>{
      itemName = collected.values().next().value.content;
      console.log(itemName);
      receivingPrice(author,msg);
    })
    .catch(collected=>{
      author.dmChannel.send('fuck name.');

    });
  });
}

function receivingPrice(author,msg){
  const filter3 = m=>{
    return !isNaN(m.content);
  };
  author.dmChannel.send("got the name!\n what's its price?").then(()=>{
    author.dmChannel.awaitMessages(filter3,{max:1})
    .then(collected =>{
      itemPrice = parseFloat(collected.values().next().value.content);
      priceIsRightGuess(msg);
    })
    .catch(collected =>{
      author.dmChannel.send('fuck price.');
    });
  });
}
