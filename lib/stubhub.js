var querystring = require('querystring');
var https = require('https');

var Client = function(application_token){
	this.access_token;
	this.refresh_token;
	this.username;
	this.application_token = application_token;
}

Client.prototype.eventSearch = function(searchParams, callback){
	
	var searchBody = querystring.stringify(searchParams);
	
	var searchOptions = {
		hostname: 'api.stubhub.com',
		path:'/search/catalog/events/v2',
		method: 'GET',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': 'Bearer ' + this.application_token,
		  'Content-Length': searchBody.length
		}
	}

	var responseBody = '';
	var request = https.request(searchOptions, function(response) {
	  response.on('data', function(chunk) {
	    responseBody += chunk;
	  });
	  response.on('end', function() {
	    if (response.statusCode == 200){
	    	responseBody = JSON.parse(responseBody);
	      callback(null, responseBody);
	    }
	    else {
	      callback(responseBody);
	    }
	  });
	});

	request.on('error', function(e) {
	    callback(e)
	})
	request.write(searchBody);
	request.end()
}

Client.prototype.getUserToken = function(auth_params){
	
	var authBody = querystring.stringify({
	  grant_type: 'password',
	  username: auth_params.username,
	  password: auth_params.password,
	  scope: 'PRODUCTION'
	});

	var authOptions = {
		hostname: 'api.stubhub.com',
		path:'/login',
		method: 'POST',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': 'Basic ' + new Buffer(auth_params.consumer_key + ':' + auth_params.consumer_secret).toString('base64'),
		  'Content-Length': authBody.length
		}
	};

	var responseBody = '';
	var request = https.request(authOptions, function(response) {
	  response.on('data', function(chunk) {
	    responseBody += chunk;
	  });
	  response.on('end', function() {
	    if (response.statusCode == 200){
	    	responseBody = JSON.parse(responseBody);
	    	console.log(responseBody);
	      this.access_token = responseBody["access_token"];
	      this.refresh_token = responseBody["refresh_token"];
	    }
	    else {
	      console.log(responseBody);
	    }
	  });
	});

	request.on('error', function(e) {
	    console.log(e);
	})
	request.write(authBody);
	request.end()
}

Client.prototype.getMyListings = function(callback){
	var getListingBody = querystring.stringify({
	  userId: 'cdepman'
	});

	var getListingOptions = {
		hostname: 'api.stubhub.com',
		path:'/accountmanagement/listings/v1/seller/' + 'cdepman',
		method: 'GET',
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': 'Bearer ' + this.access_token,
		  'Content-Length': getListingBody.length
		}
	};

	var responseBody = '';
	var request = https.request(getListingOptions, function(response) {
	  response.on('data', function(chunk) {
	    responseBody += chunk;
	  });
	  response.on('end', function() {
	    if (response.statusCode == 200){
	    	responseBody = JSON.parse(responseBody);
	    	callback(null, responseBody);
	    }
	    else {
	      callback(responseBody);
	    }
	  });
	});

	request.on('error', function(e) {
	    console.log(e);
	})
	request.write(getListingBody);
	request.end()
}

module.exports.createClient = function(auth_params) {
	return new Client(auth_params);
}