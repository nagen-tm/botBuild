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

// message commands in alphabetical order
client.on('message', (channel, userstate, message, self) => {
	if(self) return;

  // commissions
	if(message.includes('!commissions')) {
    client.say(channel, 'Never.');
	}

  // lurk
	if(message.includes('!lurk')) {
    client.say(channel,
      `@${username} disapeared into the shadows. No one knows when they'll be back.`
    )
	}

  // inspiration randomizer
  if(message.includes('!inspiration')) {
    _getInspiration(channel)
	}

  // insta randomizer
  if(message.includes('!insta')) {
    _getInsta(channel)
  }

  // shoutouts with social media if available
	if(message.includes('!so')) {
    _getSocials(channel, message)
	}

  // tools
  if(message.includes('!tools')) {
    client.say(channel, 
      'I use a Wacom Intuos Pro Medium with Clip Studio Paint for my digital art. For traditional I use panpastel and charcoal.'
    );
	}

});

// raid command
client.on('raided', (channel, username) => {
  client.say(channel,
    `Thank you @${username} for the raid!`
  )
});

// functions 
function onDisconnectedHandler(reason) {
  console.log(`Disconnected: ${reason}`)
}

// message functions:
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

function _getInspiration(channel) {
  // array of instas
  const inspo =[
    'https://www.instagram.com/loisvb/', 
    'https://www.instagram.com/cnotbusch/', 
    'https://www.instagram.com/vitkovskaya_art/', 
    'https://www.instagram.com/robreyart/', 
    'https://www.instagram.com/fdasuarez/', 
    'https://www.instagram.com/valentinepasche/', 
    'https://www.instagram.com/chrissabug/', 
    'https://www.instagram.com/f3lc4t/', 
    'https://www.instagram.com/valentinaremenar/'
  ]

  let link = inspo[Math.floor(Math.random() * inspo.length)]
  client.say(channel, `I find this artist to be super inspirational! ${link}` );
}

function _getInsta(channel, message) {
  const list = [
    'https://www.instagram.com/artbysmashley/', 
    'https://www.instagram.com/anabel.kay/', 
    'https://www.instagram.com/beateasel/', 
    'https://www.instagram.com/margosimoneart/', 
    'https://www.instagram.com/babe_rosss_art/', 
    'https://www.instagram.com/abluskittle.art/', 
    'https://www.instagram.com/sernuffalo/', 
    'https://www.instagram.com/sitriedraws/',
    'https://www.instagram.com/sylessae/'
  ]

  // randomly grab link
  let link = list[Math.floor(Math.random() * list.length)]
  client.say(channel, `Check out this insta: ${link}` );
}

