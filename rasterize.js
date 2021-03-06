var page = require('webpage').create(),
	system = require('system'),
	takeshotnow = false,
	address, output, size;

page.onConsoleMessage = function(msg) {
  console.log('eval.console: ' + msg);
};

page.onLoadFinished = function(){
	console.log("-=-=-=-= onLoadFinished: "+page.url);
	if (takeshotnow) {
		takeshotnow = false;
		console.log("TAKING SCREENSHOT");
		rasterizePage();
	} else {
		console.log("NO SCREENSHOT");
	}

}

var send = function(info) {
    info.page.evaluate(function(info){
      $(info.csssel).val(info.str.slice(0, info.str.length -1)).focus();
    }, info);
    info.page.sendEvent('keypress', info.str.slice(info.str.length-1, info.str.length));
}

var rasterizePage = function() {
	console.log('---- start rasterizePage ');
	page = require('webpage').create();
	page.settings.userName = system.env["BASICUSER"];
	page.settings.password = system.env["BASICPASS"];
	page.onLoadFinished = function(){
		console.log("---onLoadFinished: "+page.url);
	};
	page.onResourceRequested = function(requestData, networkRequest){
	console.log("--------------------------------- request "+requestData.url);
	if (
		(requestData.url.indexOf("bam.nr-data.net") !== -1) ||
		(requestData.url.indexOf("www.google-analytics.com") !== -1) ||
		(requestData.url.indexOf("mktoresp.com") !== -1) ||
		(requestData.url.indexOf("pi.pardot.com") !== -1) ||
		(requestData.url.indexOf("mixpanel.com") !== -1) ||
		false
	) {
		networkRequest.abort();
		console.log("	   ABORTED  "+requestData.url);
	}
	};
	address = system.args[1];
	console.log('rasterizePage '+address);
	output = system.args[2];
	page.viewportSize = { width: 600, height: 600 };

	if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
		size = system.args[3].split('*');
		page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
										   : { format: system.args[3], orientation: 'portrait', margin: '1cm' };
	} else if (system.args.length > 3 && system.args[3].substr(-2) === "px") {
		size = system.args[3].split('*');
		if (size.length === 2) {
			pageWidth = parseInt(size[0], 10);
			pageHeight = parseInt(size[1], 10);
			page.viewportSize = { width: pageWidth, height: pageHeight };
			page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
		} else {
			console.log("size:", system.args[3]);
			pageWidth = parseInt(system.args[3], 10);
			pageHeight = parseInt(pageWidth * 3/4, 10); // it's as good an assumption as any
			console.log ("pageHeight:",pageHeight);
			page.viewportSize = { width: pageWidth, height: pageHeight };
		}
	}
	if (system.args.length > 4) {
		page.zoomFactor = system.args[4];
	}
			page.open(address, function (status) {
					if (status !== 'success') {
					console.log('Unable to load the address! status:'+status);
					phantom.exit(1);
				} else {
					console.log('about to render to image');
					window.setTimeout(function () {
						console.log('rendering to image');
						page.render(output);
						console.log('post rendering to '+output);
						phantom.exit();
					}, 200);
				}
		});
};

console.log('Starting');


if (system.args.length < 3 || system.args.length > 5) {
	console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
	console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
	console.log('  image (png/jpg output) examples: "1920px" entire page, window width 1920px');
	console.log('								   "800px*600px" window, clipped to 800x600');
	phantom.exit(1);
} else {
	page.settings.userName = system.env["BASICUSER"];
	page.settings.password = system.env["BASICPASS"];
	if (system.env["LOGINURL"] === undefined) {
		rasterizePage();
	} else {
		//page.iamloggingin = true;
		page.open(system.env["LOGINURL"], function (status) {
			var auth = {
					user: system.env["USER"],
					pass: system.env["PASS"],
					url: system.env["LOGINURL"],
					form: system.env["LOGINFORM"],
					// Assume that if the form input names are not set, that we're going in order
					userinput: system.env["USERINPUT"],
					passinput: system.env["PASSINPUT"],
					submitinput: system.env["SUBMIT"] || "input[type='submit']",
				};

			console.log('open '+status);
			if (status !== 'success') {
				console.log('Unable to load the login page!');
				phantom.exit(1);
			}
			takeshotnow = true;


			page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js", function() 			{
				console.log("asfdASDF");
				send({page:page, csssel:auth.form+" "+auth.userinput, str:auth.user})
				send({page:page, csssel:auth.form+" "+auth.passinput, str:auth.pass})

				page.evaluate(function(auth) {
					$(auth.form+" "+auth.submitinput).click();
					$(auth.form).submit();
				}, auth);
	//			phantom.exit();
			});

			console.log('loggedin');
			setTimeout(function() {
					// Looks like some react.js apps play single page app and thus don't give us an onPageLoaded event
					console.log("TIMEOUT TAKING SCREENSHOT");
					//rasterizePage();
				}, 20000);
		});
	}
}
