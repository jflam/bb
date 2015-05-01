#MLB Scoreboard app

This is a non-commercial ReactJS app that uses the MLB Gameday APIs as the
source of its data. It uses an express server to broker requests to the Gameday
API server, since the Gameday API server does not allow Cross-Origin-Requests.
The app itself is a Single Page App that uses react-router to handle client side
navigation. 

I'm building this app mostly to teach myself ReactJS. A goal of this project is
to turn this into a Hosted Web App for Windows 10 so that I can take advantage
of additional functionality in WinRT (e.g., notifications, Cortana integration).

For more information about the MLB Gamday API, see [1].
For more information about setting up webpack, and webpack-dev-server, see [2].

##Pre-requisities:

1. Download and install node.js (tested on 0.12.1) from [nodejs.org](http://nodejs.org)
2. git command-line tools. Easiest way to get them is to setup [Chocolatey](https://chocolatey.org) and then run `cinst git` from an elevated command prompt.

##Install and run:

1. After cloning the repository, navigate to the directory where `package.json` lives and run: `npm install`
2. Open another command prompt window and start the webpack build server using: `npm run dev`
3. Open another command prompt window and start the web server using: `npm start`
4. Navigate to the app via: http://localhost:3000 

[1] http://brianmpalma.com/post/94406169057/what-i-learned-deconstructing-the-mlb-gameday-api
[2] http://christianalfoni.github.io/javascript/2014/12/13/did-you-know-webpack-and-react-is-awesome.html 
