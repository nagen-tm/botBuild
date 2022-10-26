// documentation: https://tmijs.com/

// import any libs we need
const tmi = require('tmi.js');
const { getSocials } = require("./api")

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

// disconnection issues
client.on('disconnected', (reason) => {
  onDisconnectedHandler(reason)
})

// message commands
client.on('message', (channel, userstate, message, self) => {
	if(self) return;

	if(message.includes('!so')) {
    _getSocials(channel, message)
	}


});

// raid command
client.on('raided', (channel, username) => {
  client.say(channel,
    `Thank you @${username} for the raid!`
  )
});

// functions 
async function _getSocials(channel, message) {
  let mes = message.split(' ');
  let user = mes[1];
  const getSM = await getSocials(user);
  if(getSM.error){
    client.say(channel, 'Did you type the name correctly ya dingus.' );
  } else if (getSM.info) {
    client.say(channel, `Follow this amazing person! https://www.twitch.tv/${user}`);
  } else {
    client.say(channel, `Follow this amazing person! https://www.twitch.tv/${user}`);
    getSM.data.forEach(element => {
      client.say(channel, ` And here: ${element}` );
    })
  }
}

function onDisconnectedHandler(reason) {
  console.log(`Disconnected: ${reason}`)
}