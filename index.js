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
	var url = await runOSA(`tell application "${config.appName}" to return URL of active tab of window 1`)
	var title = await runOSA(`tell application "${config.appName}" to return title of active tab of window 1`)
	
	var icon = config.defaultKey
	var earl = new URL(url)
	var domain = earl.origin.replace(earl.protocol + "//","").replace("www.","")
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

	var show = true
	
	if (config.whitelistEnabled && !config.whitelist.includes(domain)) {
		show = false
	}
	if (config.blacklist.includes(domain)) {
		show = false
	}
	console.log(`Updating! 
	URL: ${url}.
	Title: ${title}
	Whitelist enabled: ${config.whitelistEnabled},
	   ${domain} in whitelist: ${config.whitelist.includes(domain)},
	${domain} in blacklist ${config.blacklist.includes(domain)}

	Showing: ${show}`)
	

	if (show) {
		rpc.setActivity({
			details: `Surfin' ${domain}`,
			state: title,
			largeImageKey: 'chrome',
			largeImageText: fullUrl,
			smallImageKey: icon,
			smallImageText: 'ChromeCord by theLMGN',
			instance: false,
		});
	} else {
		rpc.setActivity({
			details: "Surfin' the World Wide Web!",
			state: "Surfin' the World Wide Web!",
			largeImageKey: 'chrome',
			largeImageText: "(hidden)",
			smallImageKey: config.defaultKey,
			smallImageText: 'ChromeCord by theLMGN',
			instance: false,
		});
	}
}

rpc.on('ready', thing)
rpc.login(config.discordID).catch(console.error);
setInterval(() => {
	thing();
}, 15000);

