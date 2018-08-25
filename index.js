const DiscordRPC = require("discord-rpc")
const osa = require("applescript")
const config = require("./config.json")
var rpc = new DiscordRPC.Client({ transport: 'ipc' });
function runOSA(script) {
    return new Promise(function(a,r) {
        osa.execString(script, (err, rtn) => {
            if (err) {
                r(err)
            }
            a(rtn)
        });
    })
}

async function thing() {
    var url = await runOSA('tell application "Google Chrome Canary" to return URL of active tab of window 1')
    var title = await runOSA('tell application "Google Chrome Canary" to return title of active tab of window 1')
    
    var icon = config.defaultKey
    var earl = new URL(url)
    var domain = earl.origin.replace(earl.protocol + "//","")
    var doomain = domain.replace(".","dot")
    if (config.keys.includes(doomain)) {
        icon = doomain
    }
    var fullUrl = url
    if (!config.showWholeURL) {
        fullUrl = "(hidden)"
    }
    if (!config.showTitle) {
        title = "Surfin' the World Wide Web!"
    }
    
    rpc.setActivity({
        details: `Surfin' ${domain}`,
        state: title,
        largeImageKey: 'chrome',
        largeImageText: fullUrl,
        smallImageKey: icon,
        smallImageText: 'ChromeCord by theLMGN',
        instance: false,
    });
}

rpc.on('ready', thing)
rpc.login(config.discordID).catch(console.error);
setInterval(() => {
    thing();
}, 15000);

