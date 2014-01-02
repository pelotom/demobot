var https = require('https'),
    express = require('express');

var app = express();

app.use(express.bodyParser());

app.post('/', function(req, res) {
	res.writeHead(200,{"content-type":"text/html;charset=UTF8;"});
	res.end("POST");
	//console.log(JSON.stringify(req.body, null, 4));
	var commit = req.body.head_commit;
	setStatus(commit.id, 'pending', 'Running automated checks...', function(res) {
	    //console.log('STATUS: ' + res.statusCode);
	    //console.log('HEADERS: ' + JSON.stringify(res.headers, null, 4));
	    //res.setEncoding('utf8');
	    //res.on('data', function (chunk) {
	    // 	    console.log('BODY: ' + JSON.stringify(JSON.parse(chunk), null, 4));
	    //	});
	    setTimeout(function() {
		    if (commit.message.toLowerCase().indexOf('fix') < 0)
			setStatus(commit.id, 'failure', 'ISS not back to waypoint -- waypoint primary: Saturn, predicted primary: Sun');
		    else
			setStatus(commit.id, 'success', 'No errors found');
		}, 30000);
	    });
});

function setStatus(commit, state, desc, callback) {
    var options = {
	hostname: 'api.github.com',
	path: '/repos/pelotom/github-api-fun/statuses/' + commit,
	method: 'POST',
	auth: '2bb993209338adfeead0d6810225bde8df0bb083:x-oauth-basic',
	headers: {
	    'User-Agent': 'TestBot/0.0'
	}
    };

    console.log('setting status for commit', commit, 'to', state);

    var req = https.request(options, callback);

    req.on('error', function(e) {
    	    console.log('problem with request: ' + JSON.stringify(e, null, 4));
	});

    req.write(JSON.stringify({
		state: state,
		target_url: 'http://google.com',
	        description: desc
    }));

    req.end();
}

app.listen(80);