# botBuild
To get auth token:
- [Dev Account](https://dev.twitch.tv/)
- [TMI Token](https://twitchapps.com/tmi/)

This repo is for messing around with creating things for streaming on Twitch.

## botBuild(python)
TwitchIO [Documentation](https://twitchio.dev/en/stable/quickstart.html)
CustomTkinter [Documentation](https://customtkinter.tomschimansky.com/)

tkinter download for mac:
- tkinter is needed for customtkinter, it may not be downloadable via pip
```
brew install python-tk
```

## botBuild(javascript)
Twitch Chat Bot [Tutorial](https://www.youtube.com/watch?v=7uSjKbAUHXg)

This bot uses npm package [tmi.js](https://tmijs.com/), documentation shows there will be changes coming in 2023.

Current commands: 
- fahrenheit to celcius conversion
- shout out command that pulls in social media from target user
- randomizer command that pulls different link in each time used with inspiration and insta
```
!commissions
!ftoc
!lurk
!inspiration
!insta
!kofi
!prints
!so
!socials
!tools
```

To Run:
 ```
 npm start
 ```