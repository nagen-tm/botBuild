/*
  api calls
  twitch:
    getSocials: uses the graphql endpoint and gets instagram or twitter links
*/

const axios = require('axios'); 

const getSocials = async (user) => {
  // message placeholder
  let message = {
    error: false,
    data: false
  };

  // function that grabs twitch client id
  const clientId = await _getClientID();

  if (clientId.error){
    message.error = clientId.error;
  } else {
    // create request for grabbing the socials
    const data = {
      "operationName":"ChannelRoot_AboutPanel",
      "variables": {
        "channelLogin": user,
        "skipSchedule": true
      },
      "extensions": {
        "persistedQuery": {
          "version":1,
          "sha256Hash":"6089531acef6c09ece01b440c41978f4c8dc60cb4fa0124c9a9d3f896709b6c6"
        }
      }
    }

    const config = {
      method: 'post',
      headers: {
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'Client-Id': clientId.data
      },
      url: 'https://gql.twitch.tv/gql',
      data: JSON.stringify(data)
    }
  
    let response = await axios(config).catch((error)=>{
      message.error = 'getSocials:', error;
    });
  
    // grabs only insta or twitter links
    if(!message.error){
      let urls =[]
      let sm = response.data?.data?.user?.channel?.socialMedias;
      if(sm){
        sm.forEach(element => {
          if(element.url.toLowerCase().includes('instagram') || element.url.toLowerCase().includes('twitter')){
            urls.push(element.url)
          }
        });
      }
      // checks for empty array
      if (!urls.length){
        message.info = 'No socials... sad.';
      } else {
        message.data = urls;
      }
    }
  }
  return message;
}

exports.getSocials = getSocials;

async function _getClientID() {
  // message placeholder
  let message = {
    error: false,
    data: false
  };

  // set API information
  const config = {
    method: 'get',
    headers: {
      'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
    },
    url: 'https://www.twitch.tv/'
  }

  // hit API
  let response = await axios(config).catch((error)=>{
    message.error = 'getSocials:getClientID', error;
  });

  // retrieve client ID from html
  if(!message.error){
    let client = response.data.match(/clientId="(?<id>.*)",commonOptions/)
    message.data = client.groups.id;
  }

  return message;
  
}


