### Setup

Make a file called 'create_hook.json' with these contents:

```json
{
  "name": "web",
  "active": true,
  "events": ["push"],
  "config": {
    "url": "<url where the bot will be listening>",
    "content_type": "json"
  }
}
```

Then register the hook with this commandline:

    curl -i -u <user>\
      -d @create_hook.json\
      https://github.jpl.nasa.gov/api/v3/repos/:user/:repo/hooks

Get an [access token](https://github.com/settings/applications) and set that in `demobot.js`.