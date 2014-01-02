var https = require('https'),
    express = require('express');

var app = express();

app.use(express.bodyParser());

app.post('/', function(req, res) {
  res.writeHead(200,{"content-type":"text/html;charset=UTF8;"});
  res.end("POST");
  var commit = req.body.head_commit;
  setStatus(commit.id, 'pending', 'Running automated checks...', function(res) {
    setTimeout(function() {
      // If the commit message contained the word 'fix', say the build was successful; otherwise it's a failure
      if (commit.message.toLowerCase().indexOf('fix') < 0)
        setStatus(commit.id, 'failure', 'ISS not back to waypoint -- waypoint primary: Saturn, predicted primary: Sun');
      else
        setStatus(commit.id, 'success', 'No errors found');
    }, 30000);
  });
});

var accessToken = ???;

function setStatus(commit, state, desc, callback) {
    var options = {
      hostname: 'api.github.com',
      path: '/repos/pelotom/github-api-fun/statuses/' + commit,
      method: 'POST',
      auth: accessToken + ':x-oauth-basic',
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