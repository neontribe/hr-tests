//Tests header and footer links for expected behaviour.
var url = casper.cli.get("home");
var base_url = casper.cli.get("baseurl");
var link_count = 0;
var tests = link_count;

casper.start(casper.cli.get("target"), function(){  
	var links_footer_length = casper.evaluate(function() {
		var links_in_footer = document.querySelectorAll("footer a");
		return links_in_footer.length;
	});

	var links_header_length = casper.evaluate(function() {
		var links_in_header = document.querySelectorAll("body > nav a");
		return links_in_header.length;
	})

	link_count = (links_footer_length + links_header_length) - 3 // -3 because we're not including _blank pages;
	tests = link_count;
}).run(function() {
	
	casper.test.begin("Header Footer Link Testing", tests, function suite(test) {
		casper.start(casper.cli.get("target"), function checkHeader() {
			test.comment("Checking links in top menu bar.");
			//Grab all links in top menu bar
			var links = casper.evaluate(function() {
				var links_in_header = document.querySelectorAll("body > nav a");
					return Array.prototype.map.call(links_in_header, function(element) {
					return element.getAttribute("href");
				});
			});
			//Check each link in header (target=_blank links don't seem to work correctly so omitting these from test.)
			casper.each(links, function(s, l) {
				s.thenClick("body > nav a[href='"+l+"']", function(){
						var splitted = (l.split(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i));
						if(splitted[0]) {
							test.assertTrue(this.getCurrentUrl() == base_url + l, "Check if correct page loaded from header: " + base_url + l);	
						} else {
							casper.log("Can't check _blank external links for some reason", "info");							
						}
				});
			});
		}).then(function() {
			test.comment("Checking links in footer.");
			//Grab all links in footer menu bar
			var links = casper.evaluate(function() {
				var links_in_header = document.querySelectorAll("footer a");
				return Array.prototype.map.call(links_in_header, function(element) {
					return element.getAttribute("href");
				});
			});
			//Check each link in footer "we have holiday cottages..." and "other links..."
			casper.each(links, function(s, l) {
				s.thenClick("footer a[href='"+l+"']", function(response){
					//test.assertTrue(this.getCurrentUrl() == base_url + l, "Check if correct page loaded from footer: " + base_url + l);	
					test.assert((this.getCurrentUrl() == base_url + l), "Check if correct page loaded from footer: " + base_url + l);

				});
			});
		}).run(function() {
			test.done();
		}).viewport(1920, 1080);
	});
});