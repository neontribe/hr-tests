//Tests all menu blocks for expected behaviour.
var url = casper.cli.get("target");
var base_url =  casper.cli.get("target").substr(0, url.length - 1);
var link_count = 0;
var tests = link_count + 10;

casper.start(casper.cli.get("target"), function(){
  	//Count links
	var menu_links = casper.evaluate(function() {
			var links = document.querySelectorAll('ul.main-menu > li > a');
			return Array.prototype.map.call(links, function(e) {
    		return e.getAttribute("href");
  		});
  	});

	var dropdown_links = casper.evaluate(function() {
		var links = document.querySelectorAll('li.dropdown a');
		return Array.prototype.map.call(links, function(e) {
			return e.getAttribute("href");
		})
	});	

  	link_count = menu_links.length + dropdown_links.length;


}).run(function(){
	casper.test.begin('Menu Behaviour', tests, function suite(test) {
	casper.start(casper.cli.get("target"), function checkTabs() {
		//Check if all expected menu tabs exist
		test.assertExists("li.dropdown-suffolk", "Check if Suffolk Cottages Tab Exists.");
		test.assertExists("li.dropdown-norfolk", "Check if Norfolk Cottages Tab Exists.");
		test.assertExists("li.dropdown-item.dropdown-coastal", "Check if Coastal Cottages Tab Exists.");

		var other_tabs = casper.evaluate(function(){
			return Array.prototype.map.call(document.querySelectorAll("ul.main-menu > li:not(.dropdown-item) a"), function(e){
 					return e.textContent;
			});
		});
		var expected = ["Special Offers", "What's On", "Holiday Guides", "Sign up for special offers via email"];
		for(var i = 0; i < expected.length; i++) {
			var text_content = other_tabs[i];
			test.assertTrue(text_content == expected[i],  "Check if menu item: " + expected[i] + " exists.");
		};
	}).then(function checkDropdowns() {

		casper.mouse.move("li.dropdown-suffolk");

		casper.waitUntilVisible("li.dropdown.suffolk").then(function() {
			test.assertVisible("li.dropdown.suffolk", "Check if suffolk dropdown visible.");
			casper.mouse.move("li.dropdown-norfolk");
		});
			
		casper.waitUntilVisible("li.dropdown.norfolk").then(function() {
			test.assertVisible("li.dropdown.norfolk", "Check if norfolk dropdown visible.");
			casper.mouse.move("li.dropdown-item.dropdown-coastal");
		});

		casper.waitUntilVisible("li.dropdown.coastal.dropdown").then(function() {
				test.assertVisible("li.dropdown.coastal.dropdown", "Check if coastal dropdown visible.");
		});
	}).then(function checkMainMenuLinks() {
		var menu_links = casper.evaluate(function() {
				var links = document.querySelectorAll('ul.main-menu > li > a');
				return Array.prototype.map.call(links, function(e) {
        		return e.getAttribute("href");
      		});
      	});
		test.comment("Checking main menu links...");
		//Check each of the main menu links
		casper.each(menu_links, function(self, link){
			self.thenClick("ul.main-menu > li > a[href='" + link + "']", function() {
				if(link == "javascript:void(0);") {
						
				} else {
					test.assertTrue(this.getCurrentUrl() == base_url + link, "Check if correct page loaded: " + base_url + link);
				}
			});
		});
	}).then(function() {
		var dropdown_links = casper.evaluate(function() {
			var links = document.querySelectorAll('li.dropdown a');
			return Array.prototype.map.call(links, function(e) {
				return e.getAttribute("href");
			})
		});		
		test.comment("Checking dropdown links...");
		//Check each of the dropdown links
		casper.each(dropdown_links, function(self, link) {
			self.thenClick("li.dropdown a[href='" + link + "']", function() {
				test.assertTrue(this.getCurrentUrl() == base_url + link, "Check if correct page loaded: " + base_url + link);
			});
		});
	}).run(function() {
		test.done();
	}).viewport(1920, 1080);

});
});
