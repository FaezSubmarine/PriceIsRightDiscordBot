let userBase = new Map();
var userHost;
var allReady;
var userReady = []
//todo: get guild in so that I can get nickname
function loopAround(subject, min, max){
  if(subject<min){
    return max;
  }
  if(subject>max){
    return min;
  }
  return subject;
}
module.exports = {
  getAllReady: function(){
    return allReady;
  },
  getUserHost:function(){
    return userHost;
  },
  getUserList: function(){
    let keys =[ ...userBase.keys()];
    var actualArray = [];
    for(i = 0;i<keys.length;++i){
      actualArray.push(keys[i].id);
    }
    return actualArray;
  },
  addNewUser: function(client,msg){
    var username = msg.author.username;
    var iD = msg.author.id;

    //let findUser = userBase.find(function(p){return p.id == this.id;},msg.author);
    //if(userBase[userBase.length] == null && findUser == null)
    if(userBase.has(msg.author) == false)
    {
      userBase.set(msg.author,false);
      if(userBase.size == 1){
        userHost = msg.author;
        console.log(userHost);

      }
      msg.reply(username+ ' has joined. '+userHost.username+' is the host');
    }
    else{
      msg.reply(username+' has already joined');
    }
  },
  removeUser: function(client,msg){
    var username = msg.author.username;
    var iD = msg.author.id;
    //var findUser = userBase.findIndex(function(p){return p.id == this.id;},msg.author);
    //if(userBase.length>0 && findUser != -1)
    if(userBase.size>0 && userBase.has(msg.author) == true)
    {
      if(userBase.size === 1){
        userHost = null;
        userBase.clear();
        msg.reply(username+ ' has left. Game is now empty.');
      }
      else if(userHost === msg.author){
        var tempArray = Array.from(userBase.keys());
        var findUser = tempArray.findIndex(function(p){return p == this;},msg.author);
        userHost = tempArray[loopAround(findUser-1,0,userBase.length-1)];
      }
      msg.reply(username+ ' has left');
      //userBase.splice(findUser,1);
      userBase.delete(msg.author);
    }
    else{
      msg.reply("No one has joined yet.");
    }
  },
  checkUser: function(client,msg){
    if(userBase.size === 0){
      msg.reply("No one has joined yet.");
      return;
    }
    var index = 0;
    userBase.forEach(function(value,key,map){
      ++index;
      console.log(key.username+"\n"+ userHost);
      var hostMessage = key.id == userHost.id?"<<<host":"";
      msg.reply(index + ": " + key.username+" " + hostMessage+"\n");
    });

  },
  userReady: function(client,msg){
    var username = msg.author.username;
    if(userBase.size<=1){
      msg.reply("You do not have enough players");
      return;
    }
    if(userBase.has(msg.author)){
      userBase.set(msg.author,true);
      msg.reply(username+' is ready');
      allReady = true;
      userBase.forEach(function(value,key,map){
        if(value == false){
          allReady = false;
        }
      });
      //console.log("all ready "+allReady);
      if(allReady){
          msg.reply("everyone is ready! Let's start!");
      }
      else{
        msg.reply("theres still ppl not ready yet!");
      }
    }else{
      msg.reply("this user either does not exist or has not joined yet");
    }
  }
}
