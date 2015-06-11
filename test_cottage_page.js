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
			casper.clickLabel(tmp_cottage_to_check, "a");

			casper.then(function() {
				test.comment("Travelled to property page.");
				var page_title = casper.evaluate(function() {
					return property_page_title = document.getElementsByClassName("property-data")[0].getElementsByTagName("h1")[0].innerText.split("\n")[0];
				});
				test.assertTrue(page_title == tmp_cottage_to_check, "Check that we have travelled to correct property page.");
			});
		}).then(function() {
			//Check introduction content
			var intro_content = this.fetchText(".details figcaption p");
			test.assertTrue(intro_content.length > 1, "Check if introduction article contains text.");



		}).run(function() {
			test.done();
		}).viewport(1920, 1080);
	});
});