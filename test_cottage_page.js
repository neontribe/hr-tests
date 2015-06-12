//Travels to a supplied cottage page and runs a suite of tests

var url = "https://neontabs.neontribe.org/latest/hr/";
var base_url = "https://neontabs.neontribe.org";
var link_count = 0;
var tests = 0;

var area_heading = {
	label: "Suffolk Cottages",
	selector: "li.dropdown-item.dropdown-suffolk",
	child_selector: 'li.dropdown.suffolk'
};

var area = {
	label: "New Suffolk Cottages",
	selector: "li.dropdown.suffolk a[href='/latest/hr/new-holiday-cottages?reference=ASTON,SWALLO,SHORE,GRACE,LAMP,TEAL,THATCH,MILLC,MANOR,RUTLAN,DRIFT,BROOKE,PETREL']",
}

var tmp_cottage_to_check = null;

/*
* Utils
**/
function pickRandomFromArray(arr) {
	var max = arr.length;
	var min = 0;
	return arr[~~( Math.random() * (max - min) + min)];
}
//--//

casper.start(casper.cli.get("target"), function() {}).run(function() {
	casper.test.begin("Property Page Testing", tests, function suite(test) {
		casper.start(casper.cli.get("target"), function checkPropertyPage() {
			test.comment("Travelling to supplied area");
			casper.mouse.move(area_heading.selector);
			casper.waitUntilVisible(area_heading.child_selector, function success() {
				casper.clickLabel(area.label, "a")
			});
		}).then(function() {
			//Check intro content
			var intro_content_suffolk = this.fetchText("div[role='note'] > div");
			test.assertTrue(intro_content_suffolk.length > 1, "Check if introduction article contains text.")
			//Pick a random cottage
			var names = [];
			//Grab a list of all cottages displayed on the current page.
			var properties_returned_names = casper.evaluate(function() {
				var properties_in_document = document.querySelectorAll(".rich-listing");
				return Array.prototype.map.call(properties_in_document, function(e) {
					return e.getElementsByClassName("title-and-review")[0].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].innerText;
				});
			});
			tmp_cottage_to_check = pickRandomFromArray(properties_returned_names);
			test.comment("Chosen a random property: " + tmp_cottage_to_check);
			casper.clickLabel(tmp_cottage_to_check, "a");
			casper.then(function() {
				test.comment("Travelled to property page.");
				var page_title = casper.evaluate(function() {
					return property_page_title = document.getElementsByClassName("property-data")[0].getElementsByTagName("h1")[0].innerText.split("\n")[0];
				});
				test.assertTrue(page_title == tmp_cottage_to_check, "Check that we have travelled to correct property page: " + page_title);
			});
		}).then(function() {
			//Check introduction content
			var intro_content = this.fetchText(".details figcaption p");
			test.assertTrue(intro_content.length > 1, "Check if introduction article contains text.");
			//Verify that the 'read more' button works correctly
			var tmp_height = casper.evaluate(function() {
				return parseInt(document.getElementsByClassName("fulldescription")[0].style.height.split("px")[0], 10);
			});
			test.comment("Expanding read more.")
			casper.clickLabel("Read more", "a");
			
			casper.then(function() {
				//wait for dropdown of read more content
				casper.wait(1000, function() {
					var new_height = casper.evaluate(function() {
						return parseInt(document.getElementsByClassName("fulldescription")[0].style.height.split("px")[0], 10);
					});
					test.assertTrue(new_height > tmp_height, "Check that read more button expands the info section.");	
					casper.clickLabel("Read more", "a");
				}).then(function() {
					test.comment("Collapsing read more.")
					new_height = casper.evaluate(function() {
								return parseInt(document.getElementsByClassName("fulldescription")[0].style.height.split("px")[0], 10);
					});
					test.assertTrue(tmp_height < new_height  , "Check that the read more button 'un-expands' the description");
				});
			});
		}).then(function() {
			//Verify that content tabs work;
			//Reviews content tab;
			test.comment("Click reviews tab.");
			casper.click("a[href='#reviews']");
			casper.then(function() {
					var state = this.evaluate(function() {
						return document.getElementById("reviews").className;
					});
					test.assertTrue(state.indexOf("showing") > -1, "Check that the reviews panel has class 'showing'.");
					test.assertVisible("#reviews", "Check that the reviews panel is visible.");
					test.comment("Click Prices and availability tab");
					casper.click("a[href='#prices-and-availability']");
				}).then(function() {
					var state = this.evaluate(function() {
						return document.getElementById("prices-and-availability").className;
					});
					test.assertTrue(state.indexOf("showing") > -1, "Check that the prices and availability panel has class 'showing'.");
					test.assertVisible("#prices-and-availability", "Check that the prices-and-availability panel is visible.");
					test.comment("Click town-village-guide tab");
					casper.click("a[href='#town-village-guide']");
				}).then(function() {
					var state = this.evaluate(function() {
						return document.getElementById("town-village-guide").className;
					});
					test.assertTrue(state.indexOf("showing") > -1, "Check that the town and village guide tab has class 'showing'.");
					test.assertVisible("#town-village-guide", "Check that the town-village-guide is visible.");
					test.comment("Click property-overview tab");
					casper.click("a[href='#property-overview']");
				}).then(function() {
					var state = this.evaluate(function() {
						return document.getElementById("property-overview").className;
					});
					test.assertTrue(state.indexOf("showing") > -1, "Check that the property-overview tab has class 'showing'.");
					test.assertVisible("#property-overview", "Check that the property-overview panel is visible.");
				});
		}).then(function() {
			//Check shortlist functionality.
			test.comment("Clicking add to shortlist button.");
			casper.click("a.add-to-shortlist");
			casper.waitForSelectorTextChange("a.add-to-shortlist", function(e) {
				var btn = casper.evaluate(function() {
					return document.getElementsByClassName("add-to-shortlist")[0].innerText.replace(" ", "");
				});
				test.assertTrue(btn == "Remove", "Check shortlist button text has changed to 'remove'.")
			});
		}).then(function() {
			test.comment("Ascertaining whether property is on shortlist page.");
			casper.clickLabel("Your shortlist");
			casper.then(function() {
				test.assertTrue(this.getCurrentUrl() == url + "shortlist/", "Check that shortlist page has loaded correctly.");
				test.comment("Grabbing properties on page.");
				var properties_returned_names = casper.evaluate(function() {
					var properties_in_document = document.querySelectorAll(".rich-listing");
					return Array.prototype.map.call(properties_in_document, function(e) {
						return e.getElementsByClassName("title-and-review")[0].getElementsByTagName("h3")[0].getElementsByTagName("a")[0].innerText;
					});
				});

				test.comment("Checking if there is a matching property.");
				test.assert(properties_returned_names.indexOf(tmp_cottage_to_check) > -1, "Check that shortlist properties includes test property.");
			});
		}).run(function() {
			test.done();
		}).viewport(1920, 1080);
	});
});