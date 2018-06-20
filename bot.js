var HTTPS = require('https');

var botID = process.env.BOT_ID;
var apiKey = process.env.API_KEY;

function respond() {
 
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/LeBron$/, gifRegex = /^\/gif$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage("LeBron is the GOAT!");
    this.res.end();
  } else if (request.text && gifRegex.test(request.text)) {
      this.res.writeHead(200);
      postMessage("https://media.giphy.com/media/xTiTnDAP0RiCo9k85W/giphy.gif");
      this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function searchGif() {

     var options = {
	host: 'api.giphy.com',
	path: '/v1/gifs/search?api_key=DHkSrIUyV35KMHtRpn4wFT9kqKDY0JTG&q=LeBron&limit=25&offset=0&rating=G&lang=en'
    };

    var callback = function(response) {
	var str = '';

	response.on('data', function(chunck){
		str += chunck;
	    });

	response.on('end', function() {
		if (!(str && JSON.parse(str).data[0])) {
		    postMessage('Couldn\'t find a gif');
		} else {
		    var url  = JSON.parse(str).data[0].embed_url;
		    postMessage(url);
		}
	    });
    };

    HTTP.request(options, callback).end();   
}


function postMessage(message) {
  var botResponse, options, body, botReq;

  botResponse = message;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;