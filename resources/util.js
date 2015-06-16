/**
 * Copyright (c) 2015 Neontribe
 * see LICENSE.txt for details
 *
 * NeonTABS Functional Test
 * Runs in CasperJS.
 */

casper.test.on("fail", function(failure) {
	if (casper.cli.get("reportfails")) {
		console.log(casper.getCurrentUrl());
	}
	if (casper.cli.get("screencapfails")) {
		screenshot();
	}
});

casper.test.on("wait.timeout", function(failure){
	if (casper.cli.get("reportfails")) {
		console.log(casper.getCurrentUrl());
	}
	if (casper.cli.get("screencapfails")) {
		screenshot();
	}
});

screenshot = function() {
	var date = new Date();
	var year = date.getFullYear();
	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	var day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	var title = year + month + day + '_' + date.getUTCHours() + date.getUTCMinutes() + date.getSeconds();
	console.log("capture saved as " + title);
	casper.capture(title, undefined, {
		format: 'jpeg',
		quality: 75
	});
}