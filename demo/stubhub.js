var secrets = require("./secrets.example");
var stubhub = require("../index").createClient(secrets.application_key);


var searchParams = {
	date: "2015-02-25",
	minAvailableTickets: 100,
	sort: "dateLocal asc"
};

stubhub.eventSearch(searchParams, function(error, data){
	console.log('ERROR:', error);
	console.log('DATA', data);
});

stubhub.getUserToken({
	consumer_key: secrets.consumer_key, 
  consumer_secret: secrets.consumer_secret,
  username: secrets.username,
  password: secrets.password	
});

stubhub.getMyListings(function(error, data){
	console.log('ERROR:', error);
	console.log('DATA:', data);
});