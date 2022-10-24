// documentation: https://tmijs.com/
const tmi = require('tmi.js');

// set options for log in
const options = {
	options: { debug: true },
	identity: {
		username: 'botBuild',
		password: process.env.TWITCH_AUTH
	},
	channels: [ 'nagen_tm' ]
}

// login and connect with new tmi instance
const client = new tmi.Client(options);
client.connect().catch(console.error);

// logic for commands
client.on('message', (channel, userstate, message, self) => {
	if(self) return;
	if(message.toLowerCase() === '!hello') {
		client.say(channel, `@${userstate.username}, heya!`);
	}
});

client.on('raided', (channel, username) => {
  client.say(channel,
    `Thank you @${username} for the raid!`
  )
});


const getSocials = async(user) =>{
  let x = document.querySelectorAll("a");
  let links = []
  for (var i=0; i<x.length; i++){
    var cleanlink = x[i].href;
    if(cleanlink.contains('instagram')){
      links.push([cleanlink]);
    }
  };
}