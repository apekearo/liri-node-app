var fs = require("fs");
var request = require("request");
var inquirer = require("inquirer");
var timestamp = require("time-stamp");

var keys= require("./keys.js");
var twitter = require("twitter");
var client = new twitter(keys.twitterKeys);

 
var spotify =require('node-spotify-api');
var spotifysong = new spotify({

	 id: "4ed558a81e37405ca8a39c93dc6f277d",
  secret: "55b621e8eb4242a98c5d08477f613257"

})

var selectMusic = "";
	var selectMovie = "";
	var randomMusic = "";
	var randomMovie = "";
	var randomChoiceArray = ["my-tweets", "spotify-this-song","movie-this"]
	var randomDoStuff = Math.floor(Math.random()*3) ;
	var randomChoice = randomChoiceArray[randomDoStuff];
	var randomIndex = Math.floor(Math.random()*20) ;

fs.readFile("randomMusic.txt", "utf8", function(err, data) {
	if (err) {
		return console.log(err);
	};
var randomArray = data.split(",");
randomMusic = randomArray[randomIndex];
});

fs.readFile("randomMovies.txt", "utf8", function (err, data) {
if (err) { return console.log (err)};
var randomArray = data.split(",");
randomMovie = randomArray[randomIndex];
});

inquirer.prompt([
{
type: "list",
message: "What chu talking about Willis?",
choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
name: "tweet"
},
{
	type: "input",
	message: "what song you feeling right now?",
	name: "music"
},
{
	type: "input",
	message: "Your Cinematic Motion Picture of Choice Sirr?",
	name: "movie"
}
])
     // would you explain .then a little to me?
.then(function(user) {
var inputResults = "+++++++++++++++++++++ Liri 2017 Search Request ++++++++++++++++++++" + "\r\n" +
"^^ Search Date: " + timestamp('YYYY/MM/DD HH:mm:ss') + "\r\n" +
"^^ Search Requests: " + "\r\n" +
"^^     Tweet: " + user.tweet + "\r\n" +
"^^     Music:  " + user.music + "\r\n" +
"^^     Movie:  " + user.movie + "\r\n" +
"^^ Random Choice: " + randomChoice + "\r\n" +
"^^ Random Music: " + randomMusic + "\r\n" +
"^^ Random Movie: " + randomMovie + "\r\n" +
"++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"+ "\r\n";
console.log(inputResults);
writeToLog(inputResults);

switch (user.tweet) {
	case "my-tweets" :
		myTweets();
		break;
	case "spotify-this-song" :
		if (user.music) {selectMusic = user.music}
		else {selectMusic = "The Sign"};
		spotifyThisSong();
		break;
	case "movie-this" :
		if (user.movie) {selectMovie = user.movie}
				else {selectMovie = "Mr. Nobody"};
			movieThis();
			break;
	case "do-what-it-says":
		doWhatitsays();
		break;
};
});

function myTweets() {
	client.get("statuses/user_timeline", function(error, tweets, response) {
		if (!error) {
			
			for(var i=0; i < tweets.length; i++) {
				var twitterResults = "@" + tweets[i].user.screen_name + ": "
				 + tweets[i].text + "\r\n" + tweets[i].created_at + "\r\n" + 
				 "+++++++++++++++++++" + i + "++++++++++++++++++++++" + "\r\n";
				 console.log(twitterResults);
				 writeToLog(twitterResults);
			}
		}
		else{
			console.log("There was an Error: " + error);
			writeToLog("There was an Error: " +error + '\n');

		}
	});
};

function spotifyThisSong() {
	// Where did you find this method to use ?   such as query, i couldn't find that one 
	spotifyLookup.search({ type:"track", query: selectMusic, limit:5}, function(err, data){
		if(err) {
			return console.log("there was an error: " + error+ '\n');
}			
			var items = data.tracks.items;
			// will you explain this code to me a little bit??
			for(var i = 0; i < items.length; i++) {
				var songArtists = "";
				for(var j = 0; j < items[i].artists.length; j++){
					songArtists = items[i].artists[j].name + "   ";
				};

				var songResults = "Song Title: " + items[i].name + "\r\n" +
						"Album: " + items[i].album.name + "\r\n" + 
						"Listen: " + items[i].external_urls.spotify + "\r\n" +
						"Artist: " + songArtists + "\r\n" +
					"++++++++++++++++++++++++++++" + i + "+++++++++++++++++++++" + "\r\n";
			console.log(songResults);
			writeToLog(songResults);
			}
		});
	};


	function movieThis(){
		var queryUrl = "http://www.omdbapi.com/?t=" + selectMovie + "&y=&plot=short&r=json&apikey=40e9cece";
		request(queryUrl, function(error, response, body){
			if(!error && response.statusCode == 200) {
				console.log(JSON.parse(body));
				var ratingDisplay = "";
				var rList = JSON.parse(body).Ratings
			if(rList.length > 1 ) {
				ratingDisplay = rList[1].Value
				}
			else {
				ratingDisplay = "Not Available"
			}

			var movieResults = "Title: " + JSON.parse(body).Title + "\r\n" +
					"Year: " + JSON.parse(body).Year + "\r\n" +
					"imdb Rating: " + JSON.parse(body).imdbRating + "\r\n" +
					"Country: " + JSON.parse(body).Country + "\r\n" +
					"Language: " + JSON.parse(body).Language + "\r\n" +
		 			"Plot: " + JSON.parse(body).Plot + "\r\n" +
		 			"Actors: " + JSON.parse(body).Actors + "\r\n" +
		 			"Rotten Tomatoes: " + ratingDisplay + "\r\n" +
		 			"+++++++++++++++++++++++" + "\r\n";

		 		console.log(movieResults);
		 		writeToLog(movieResults);
		 	}
		})

	};

	function doWhatitsays() {
		switch (randomChoice) {
			case "my-tweets" :
				myTweets();
				break;
			case "spotify-this-song" :
				selectMusic = randomMusic;
				spotifyThisSong();
				break;

			case "movie-this" :
				selectMovie = randomMovie;
				movieThis();
				break;
		};
	};

	function writeToLog(logStuff) {
		fs.appendFile('log.txt', logStuff, (err) => {
			if (err) throw err;
		});
	};