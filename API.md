## BZP API

If you have any questions about the API, feel free to open an issue or contact me via the BZFlag forums.

### Listing Plugins
Call `/list-plugins` to get a JSON object that looks like this:
```json
[
	{
		"author": "Plugin Author",
		"category": "flags",
		"description": "Lorem Ipsum Delorum.",
		"id": "6w10i0oswh496bl",
		"approved": true,
		"name": "Flag Name"
	},
	{
		"author": "Unsuspicious Scammer",
		"category": "server",
		"description": "Please install this great plugin which will not compromise your server.",
		"id": "6w10i0oswh496bl",
		"approved": false,
		"name": "Coolest Plugin Ever"
	},
	{
		"author": "Another Author",
		"category": "game-mode",
		"description": "Adds a super awesome game mode.",
		"id": "6w10i0oswh496bl",
		"approved": true,
		"name": "Yay For Game Modes"
	}
]
```
The `approved` field determines how it displays to the user in the official client. You do not need to check it, but bear in mind that unapproved plugins may link to malicious software.  

### Single Plugin Data
Call `/get-plugin?id=[id]` to get the data for a single plugin. This will return a JSON object that looks like this:
```json
{
    "license": "MIT",
    "category": "flags",
    "description": "Lorem Ipsum Delorum.",
    "name": "Flag Name",
    "website": "https://github.com/Loremson/FlagName",
    "approved": true,
    "author": "Plugin Author",
    "bzfs_version": "2.4.0",
    "direct_download_link": "https://bzp.sandybees.com/plugin/download?id=l1kv9qaf780nrp1"
}
```
The `approved` field determines how it displays to the user. You do not need to check it, but bear in mind that unapproved plugins may link to malicious software.  
Field order is not guaranteed.  
The recommended way to get a plugin's ID is by listing all plugins and searching in the response.

### Adding A Plugin
Call `/add-plugin` with a FormData object. If it works, you will get a JSON response with the message "Plugin created successfully!" If not, you will receive a 500 error that may or may not give the reason why addition failed. I recommend you perform the same validations that the frontend does when adding a plugin before making API requests.  
If a file is provided without a downloadLink, the download link will be set to `https://bzp.sandybees.com/plugin/download?id=[id]`.
If you are using curl, the command for adding a plugin would look like this:
```bash
curl -X POST https://bzp.sandybees.com/add-plugin \
        -F "name=superUser" \
        -F "author=official" \
        -F "website=https://github.com/BZFlag-Dev/bzflag/tree/2.4/plugins/superUser" \
        -F "license=LGPL or MPL" \
        -F "file=@/path/to/superUser.zip" \
        -F "downloadLink=" \
        -F "description=Lets a server owner grant permissions to globally authenticated users based on BZID." \
        -F "category=server" \
        -F "bzfsVersion=2.4.0"
```
Or, if you are not uploading a file, but have a direct download link (e.g. to a GitHub repository's download button):
```bash
curl -X POST https://bzp.sandybees.com/add-plugin \
        -F "name=mapchange" \
        -F "author=allejo" \
        -F "website=https://github.com/allejo/mapchange" \
        -F "license=LGPL" \
        -F "downloadLink=https://github.com/allejo/mapchange/archive/refs/heads/master.zip" \
        -F "description=Allows players to change the map with the /mapchange command. Requires external scripts to restart the map." \
        -F "category=server" \
        -F "bzfsVersion=2.4.0"
```
Valid categories: `flags`, `game-mode`, `zones`, `administration`, `server`, `chat`, `game-mode-mechanics`, `commands`, `mechanics`, `samples`, `flag-mechanics`, `out-of-date`  
Note that newly added plugins will not show up on the official BZP site until approved. They will still appear in the `/list-plugins` result with `approved` set to false.  

### Other API Endpoints
All other API endpoints relate to authenticating or are only actions that can be taken by authenticated users. As a result, external tools will not need to call them.  
