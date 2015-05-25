var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

page.onConsoleMessage = function(msg) {
  console.log('eval.console: ' + msg);
};

page.onLoadFinished = function(){
	console.log("-=-=-=-= onLoadFinished: "+page.url);
	if (page.url === "https://hub.docker.com/") {
		rasterizePage();
	}
}

var rasterizePage = function() {
    console.log('---- start rasterizePage ');
    page = require('webpage').create();
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
		console.log("       ABORTED  "+requestData.url);
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
                    console.log('Unable to load the address!');
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
    console.log('                                   "800px*600px" window, clipped to 800x600');
    phantom.exit(1);
} else {
    page.open('https://hub.docker.com/account/login', function (status) {
	var auth = { hubuser: system.env["HUBUSER"], hubpass: system.env["HUBPASS"] };

        console.log('open '+status);
        if (status !== 'success') {
            console.log('Unable to load the login page!');
            phantom.exit(1);
        }
        page.evaluate(function(auth) {
  	    var frm = document.getElementById("form-login");
            if (frm === null) {
		console.log('no login form found')
		console.log(page.content)
		phantom.exit(1)
	    }
            frm.elements["id_username"].value = auth.hubuser;
            frm.elements["id_password"].value = auth.hubpass;
            console.log('pre-submit loggedin');
            frm.submit();
        }, auth);

        console.log('loggedin');
    });
}
