# Spoticord
[![Discord Server](https://discordapp.com/api/guilds/204352669731520512/embed.png)](https://dim.codes/discord)

*Inspired by [nations/spoticord](https://github.com/nations/spoticord)*
## Before Installing
**Disclaimer:** This installation guide is for windows, but you can make it work for other systems if you've used NodeJS before.

0) Make sure you have [NodeJS > 9.0.0](https://nodejs.org), [Git](https://git-scm.com/download/), [Python 2.7.14](https://www.python.org/downloads/) and [VS Code](https://code.visualstudio.com) or some other text editor installed
1) Download this repository by going to the top, click *Clone or download* and then click *Download ZIP*
2) Once downloaded, extract the only folder, `spoticord-master`, to somewhere you'll remember
3) If you're on windows, you can just go to the folder, hit `shit+right click` anywhere on the blank space and it'll say *Open command window here*. If you're not on windows and don't know how to cd into a directory, search it up for your operating system, and once you're in the directory, you can proceed
4) Now, to install the the dependencies, we need to type `npm i` into the command line and hit enter, you may recieve *NPM WARN*s at the end. Do not worry about those
5) Depending on if you want the album cover to show up, go to the [Advanced Installation Guide](#advanced-installation-guide), otherwise go to the [Basic Installation Guide](#basic-installation-guide)

## Basic Installation Guide
#### How it should look like by the end
![](https://i.imgur.com/PF2CjUV.png)

6) Just type `node .` into the command line and hit enter

**OPTIONAL**
[Change certain aspects of the presence](#configuration)

## Advanced Installation Guide
#### How it should look like by the end
![](https://i.imgur.com/EZ0NmTk.png)

6) Go [to here](https://discordapp.com/developers/applications/me/create)
7) Fill in the *APP NAME* box and click *Create App*

**NOTE:** For some reason, if the apps name is "Spotify", it won't work for other people, but you can name your app "𝖲𝗉𝗈𝗍𝗂𝖿𝗒" (copy paste) and it will work. Or, you can just name it something else

8) Where it says *Client ID*, copy that big number and open up the `config.js` file located in the `src` folder
9) In the config, you should see a big number of equal length in there, just replace that number with yours **and keep the quotes**
10) Go back to the page
11) Scroll down to the *Rich Presence* section and click *Enable Rich Presence*
12) Scroll down to the *RICH PRESENCE ASSETS* section
13) If you haven't noticed already, there is an images folder, you're going to need to upload these images
14) Select *Large* and click the blue square to upload an image
15) First you're going to want to upload `logo.png`
16) Set the name to `logo` (case sensitive)
17) Click *Upload Asset*
18) Repeat steps 14-17, but make sure the *TYPE* is *Large*, and the name of the asset corresponds to the file name, so `pause.png` would be `pause` etc.
19) Once all this is done, scroll to the bottom and hit *Save changes* (just to be sure)
20) Now, you want to hit `ctrl+shift+i` or `cmd+option+i` on that application page and it should open your developer tools which you might refer to as *Inspect Element*
21) Go to the *Application* tab, open up *Local Storage*, and select *https://discordapp.com*
22) Now, find the row where it says *token* and copy the big line of text next to it, it should look like the image below (blurred for privacy)

**DO NOT SHARE THIS TOKEN WITH ANYONE ELSE**

![](https://i.imgur.com/fKzoR08.png)

23) Now, go back to the `config.js` file and where it says `discord: ''`, inside of those two quotes, put your token that you copied
23.5) (Save the file (duh))
24) After this, type `node .` into your command line and hit enter

## Configuration
In the `config.js` file, you have a section that looks like the code below
```js
enabled: {
	largeAlbumCovers: true,
	smallAlbumCovers: true,

	largeImage: true,
	largeImageText: true,
	
	smallImage: true,
	smallImageText: true,

	timeLeft: true,
}
```
The values after the quotes can either be `true` or `false`, and its pretty obvious what `true` and `false` means.

If you want to hide the time left, make `timeLeft: true` `timeLeft: false`

If you want to hide the big image, make `bigImage: true` `bigImage: false`

If you want to hide the text when you hover over the big image, make `bigImageText: true` `bigImageText: false`

If you want to hide the small image, make `smallImage: true` `smallImage: false`

If you want to hide the text when you hover over the small image, make `smallImageText: true` `smallImageText: false`

Thats about it, I hope I was able to help you get your rich presence set up, if you got an issue, talk to me about it on my [Discord server](https://dim.codes/discord), my name is `Dim#4464`
