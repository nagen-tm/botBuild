# botBuild
Twitch Chat Bot [Tutorial](https://www.youtube.com/watch?v=7uSjKbAUHXg)

This bot uses npm package [tmi.js](https://tmijs.com/), documentation shows there will be changes coming in 2023.

To get auth token:
- [Dev Account](https://dev.twitch.tv/)
- input the information from the app into this url to get the token from the URL
https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=YOUR_HOST&response_type=token&scope=chat:read+chat:edit+channel:moderate

Current commands: 
- shout out command that pulls in social media from target user
- randomizer command that pulls different link in each time used with inspiration and insta
```
!commissions
!lurk
!inspiration
!insta
!kofi
!prints
!so
!socials
!tools
```

ToDo:
- create command to convert F to C

To Run:
 ```
 npm start
 ```

