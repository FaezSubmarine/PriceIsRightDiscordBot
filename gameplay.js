var itemImage;
var itemName;
var itemPrice;
var arrayIndex = 0;

var gameplayClient;
var gameplayMsgAttachment;

let gameplayUserList = [];
let userAlreadyFilled = new Map();
let numResultArray = [];

var gameplayUserHost;
//todo: do something like AskForSomething with where var stages are functions
module.exports = {
  //todo: continue with initgameplay
  initGameplay:function(Client,MessageAttachment){
    gameplayClient = Client;
    gameplayMsgAttachment = MessageAttachment;
  },
  receivingSomething:function(userList,userHost,author,msg,MessageAttachment){
    for(var i = 0;i<userList.length;++i){
      gameplayUserList[i] = [userList[i],0];
    }
    //userList.forEach(u=>{gameplayUserList.set(u,0)});
    gameplayUserHost = userHost;
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
          userHost.send('image.');
        });
      })

    })
  },
  _validGuess:function(str){
    return validGuess(str);
  },
  _stranded:function(str){
    var numResult = parseFloat(str);
    if(isNaN(numResult)){
      return false;
    }
    return true;
  }
}

function alreadyFilledIn(thisUser,testStr){
  if(userAlreadyFilled.has(thisUser)){
    return true;
  }
  userAlreadyFilled.set(thisUser,testStr);
  return false;
}
//str should already be sliced
function validGuess(str){
  let regex = /^\d+(\.?|\,)\d{2}$/;
  var numResult = parseFloat(str);
  if(isNaN(numResult)){
    return false;
  }
  if(!regex.test(numResult.toString())){
    return false;
  }
  return true;
}

function validGuess2(msg){
  let regex = /^\d+(\.?|\,)\d{2}$/;
  var numResult = parseFloat(str);
  if(isNaN(numResult)){
    return false;
  }
  if(!regex.test(numResult.toString())){
    return false;
  }
  return true;
}
function priceIsRightGuess(msg){
  var testStr;
  const filter4 = m=>{
    if(m.author.id == gameplayUserHost.id){
      msg.channel.send("Host must not put the price in!");
      return false;
    }
    console.log("checking if the author is a bot");
    if(m.author.bot){
      return false;
    }
    console.log("checking if the message is nan");

    console.log("checking if there is a !pir ");
    if(!m.content.startsWith("!pir ")){
      console.log("no !pir in this message")
      return false;
    }
    testStr = m.content.slice(5,m.content.length);
    console.log("teststr "+testStr);
    if(!validGuess(testStr)){
      msg.channel.send("User has placed in invalid money input");
      return false;
    }
    console.log("see if the author already filled in");
    if(alreadyFilledIn(m.author.id,m.content)){
      msg.channel.send("User has already state price!");
      return false;
    }
    
    console.log("before assigning");
    numResultArray[arrayIndex] = new Array(m.author.username, parseFloat(testStr));
    arrayIndex++;
    msg.channel.send(m.author.username+" has sucessfully submitted their answer");
    return true;
  };
  msg.channel.send("The host has successfully submitted their entry");
  msg.channel.send("what's the price of "+itemName,itemImage).then(()=>{
    msg.channel.awaitMessages(filter4,{max:gameplayUserList.length-1}).then(collected=>{
      //TODO: do a foreach and print out the result
      var finalString = "";
      var winner = [gameplayUserHost.username,-1];
      numResultArray.forEach((item)=>{
        var priceResult = (item[1]>itemPrice)?("Overpriced!"): ((itemPrice-item[1]));
        if(item[1]<itemPrice || priceResult<winner[1]){
          if(winner == gameplayUserHost.username){
            winner = new Array(item[0],priceResult);
          }
        }
        finalString.concat(item[0]+" "+item[1]+ " "+priceResult.toString()+"\n");
      });
      msg.channel.send("Everyone has submitted their answer.\n"+finalString +" The winner is "+winner[0]+" with the difference of "+winner[1]);
    }).catch(collected=>{
      console.log("bugged");
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
      author.dmChannel.send('bugged name.');

    });
  });
}

function receivingPrice(author,msg){
  const filter3 = m=>{
    return validGuess(m.content);
  };
  author.dmChannel.send("got the name!\n what's its price?").then(()=>{
    author.dmChannel.awaitMessages(filter3,{max:1})
    .then(collected =>{
      itemPrice = parseFloat(collected.values().next().value.content);
      priceIsRightGuess(msg);
    })
    .catch(collected =>{
      author.dmChannel.send('got this price.');
    });
  });
}
