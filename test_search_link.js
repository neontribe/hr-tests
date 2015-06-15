//Tests all menu blocks for expected behaviour.
var url = casper.cli.get("home");
var base_url = casper.cli.get("baseurl");//"https://neontabs.neontribe.org"
var link_count = 0;
var tests = 0;

casper.start(casper.cli.get("target"), function(){  }).run(function() {
	casper.test.begin("Search Link Testing", tests, function suite(test) {
		casper.start(casper.cli.get("target"), function checkPets() {
			test.comment("Clicking 'Pet friendly cottages' link.");		
			casper.thenClick("div .pet-friendly-cottages h3 > a", function() {
				test.assertTrue(this.getCurrentUrl() == url + "per-friendly-cottages", "Check if 'pet friendly cottages' button points to correct page.");
				test.comment("Going back to hompage using back button.");
			});
			//Back using back button
			casper.back().then(function() {
				//If for some reason this doesn't work manually place us back at the homepage.
				if(this.getCurrentUrl() != url) {
					casper.open(url).then(function() {
						console.log("returned to homepage");
					});
				}
			});
		}).then(function() {
			test.comment("Clicking 'let your property' link.");
			casper.thenClick("div .let-your-property h3 > a", function() {
				test.assertTrue(this.getCurrentUrl() == url + "letyourproperty.html", "Check if 'let your property' button points to correct page.");
			});
			casper.thenClick("header[role='banner'] h1 > a[href='/latest/hr/']", function() {
					test.comment("Going back to homepage using Heritage Hideaways logo.");		
			}).then(function() {
				//If for some reason this doesn't work manually place us back at the homepage.
				if(this.getCurrentUrl() != url) {
					casper.open(url).then(function() {
						console.log("returned to homepage");
					});
				}
			});
		}).then(function() {
			test.comment("Clicking 'What our guests say...' link.")
			casper.thenClick("div .what-our-customers-say h3 > a", function() {
				test.assertTrue(this.getCurrentUrl() == url + "holiday-cottages/testimonials", "Check if 'What our customers say' button points to correct page.");
			});
			casper.thenClick("body > nav > div > div:nth-child(1) li.first", function() {
				//If for some reason this doesn't work manually place us back at the homepage.
				if(this.getCurrentUrl() != url) {
					casper.open(url).then(function() {
						console.log("returned to homepage");
					});
				}
			});
		}).then(function() {
			test.comment("Clicking 'view all events'.");
			casper.thenClick("a.view-all", function() {
				test.assertTrue(this.getCurrentUrl() == url + "news/events.html", "Check if 'view all news' link points to corect page.");
			});
			casper.back().then(function() {
				//If for some reason this doesn't work manually place us back at the homepage.
				if(this.getCurrentUrl() != url) {
					casper.open(url).then(function() {
						console.log("returned to homepage");
					});
				}
			});
		}).run(function() {
			test.done();
		}).viewport(1920, 1080);
	});
});
