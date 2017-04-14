//Grab data from keys.js & set variables for npm packages.
var inquirer = require("inquirer");
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

//stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//for spotify use - attaches multiple word arguments
var x = "";

for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//tweets 20 of my most recent tweets.
function myTweets(){
  //display last 20 Tweets
  var screenName = {screen_name: '@Ryan_Rayhani'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@Ryan_Rayhani: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
      }
    }else{
      console.log('Error occurred');
    }
  });
}

//console.log the Artist name, song name, link and album name.
function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        console.log("Artist: " + songData.artists[0].name);
        console.log("Song: " + songData.name);
        console.log("Preview URL: " + songData.preview_url);
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

//access the random.txt file and Spotify the results.
function randomChoice(){
	fs.readFile("random.txt", 'utf8', function(error, data) {		    
		//in the case of experiencing any error, cosole.log out the error. 
	    if(error) {
	        return console.log(error);
	    }else{
	    	var dataArr = data.split(",");
	    	var userFirstInput = dataArr[0];
	    	var userSecondInput = dataArr[1];

	    	switch(userFirstInput){
	    		case "spotify-this-song":
	    			spotifySong(userSecondInput);
	    			break;
	    	}
	    }
	}); 		
}

//start function which provides the user a series of choices.
function start(){
	inquirer.prompt([
		{
			type: "list",
			name: "whatToPick",
			message: "Which one would you like to check out?",
			choices: ["My Twitter", "Spotify", "Random", "Exit"] 
		}
	]).then(function(user) {
		if (user.whatToPick == "My Twitter"){
			myTweets();
		}else if (user.whatToPick == "Spotify"){
			inquirer.prompt([
				{
					type: "input",
					name: "songChoice",
					message: "What song would you like to check out?",
				}
			]).then(function(userSpotInput){
				if (userSpotInput.songChoice == ""){
					spotifySong("One Dance")
				}else{
					spotifySong(userSpotInput.songChoice);	
				}
			})
		}else if (user.whatToPick == "Random"){
			randomChoice();		
		}else if (user.whatToPick == "Exit"){
			inquirer.prompt([
				{
					type: "confirm",
					name: "exitApp",
					message: "Are you sure you want to leave?",
				}
			]).then(function(leave){
				if (leave.exitApp == true){
					console.log("Bye!");
				}else{
					start();
				}

			})	
		}
	})
}

start();
