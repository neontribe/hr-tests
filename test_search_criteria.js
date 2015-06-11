//Tests all menu blocks for expected behaviour.
var url = "https://neontabs.neontribe.org/latest/hr/"
var base_url = "https://neontabs.neontribe.org"
var link_count = 0;
var tests = 0;

var test_property = {
	reference: "151KIN",
	area: "norfolk-cottages"
};

casper.start(casper.cli.get("target"), function() {  }).run(function() {
	casper.test.begin("Search Criteria Testing", tests, function suite(test) {
		casper.start(casper.cli.get("target"), function checkReferenceSearch() {
			test.comment("Selecting 'Norfolk Cottages' option.");
			casper.thenClick("li.dropdown-norfolk a", function() {
				test.assertTrue(this.getCurrentUrl() == url + "norfolk-cottages", "Norfolk Cottages page Reached.");
				//Norfolk cottages page loaded;
				test.comment("Searching for property reference: " + test_property.reference);
				//Set ref field to reference;
				casper.sendKeys("input#schPropName", test_property.reference);
				casper.thenClick("form[action='/latest/hr/holiday-cottages/search/filtered'] input[type='submit']", function() {
					test.comment("Submitted reference search.");
					test.assertTrue(this.getCurrentUrl() == url + "holiday-cottages/search/filtered?name="+ test_property.reference +"&area=&accommodates=&fromDate=&nights=&orderBy=&rating=", "Correct search page reached");
				});
			});
		}).then(function() {
			//Check if one property returned and property reference matches;
			var properties_returned_length = casper.evaluate(function() {
				var properties_in_document = document.querySelectorAll(".rich-listing");
				return properties_in_document.length;
			});
			var properties_returned_names = casper.evaluate(function() {
				var properties_in_document = document.querySelectorAll(".rich-listing");
				return Array.prototype.map.call(properties_in_document, function(e) {
					return e.getElementsByClassName("ref")[0].innerText;
				});
			});
			test.assertTrue(properties_returned_length == 1, "Check one property is returned.");

			test.assertTrue(properties_returned_names[0].split("\n")[1] == test_property.reference, "Check returned property reference matches search criteria.");
		}).then(function() {
			//Apply 'internet search criteria', check for cottage not found message
			casper.thenClick("#schInternet", function() {
				casper.thenClick("form[action='/latest/hr/holiday-cottages/search/filtered'] input[type='submit']", function() {
					//this is a rather dubious way of getting a "no cottage" return message because it is possible that internet access could be added.
					//TODO: a better method should be devised
					test.comment("Submitted second reference search (check for no cottage found)");
					casper.sendKeys("input#schPropName", test_property.reference);
					test.assertTrue(this.getCurrentUrl() == url + "holiday-cottages/search/filtered?name="+ test_property.reference +"&area=&accommodates=&fromDate=&nights=&internet=Y&orderBy=&rating=", "Correct search page reached");
				}).then(function() {
					casper.capture("capt.png");
					test.assertTextExists("Sorry, we’ve no holiday cottages to match your exact search.", "Check that no properties are returned after 'no internet access checked'.")
				});
			});
		}).then(function() {
			//Search again using 'cromer and area'
			this.evaluate(function() {
				//set to cromer and area
        		document.querySelector('select#schArea').selectedIndex = 4;
        		return true;
			});
			casper.thenClick("form[action='/latest/hr/holiday-cottages/search/filtered'] input[type='submit']", function() {
					test.comment("Submitted reference search with `cromer and area` selected.");
					test.assertTrue(this.getCurrentUrl() == url + "holiday-cottages/search/filtered?name="+ test_property.reference +"&area=CROME&accommodates=&fromDate=&nights=&orderBy=&rating=", "Correct search page reached");
					var properties_returned_length = casper.evaluate(function() {
						var properties_in_document = document.querySelectorAll(".rich-listing");
						return properties_in_document.length;
					});
					test.assert(properties_returned_length >= 1, "Check if one or more property(s) returned.");
			});


		}).run(function() {
			test.done();
		}).viewport(1920, 1080);
	});
});