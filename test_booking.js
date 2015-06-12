//Tests all menu blocks for expected behaviour.
var url = "https://neontabs.neontribe.org/latest/hr/"
var base_url = "https://neontabs.neontribe.org"
var link_count = 0;
var tests = 0;

var property_uri = "suffolk-cottages/suffolk-countryside-cottages/PLOUGH";


function getSevenDays(array_of_dates) {
	var tmp_array = [];
	for(var i = 0; i < array_of_dates.length - 1 ; i++) {
			
		var splitted = array_of_dates[i].split("-")
		var splitted1 = array_of_dates[i + 1].split("-");

		var new_date = new Date(splitted[2], splitted[1] - 1, splitted[0]);
		var new_date1 = new Date(splitted1[2], splitted1[1] - 1, splitted1[0]);


		var subbed = new_date1.getDate() - new_date.getDate();
		var is_a_seven = Math.abs(subbed);

		if(is_a_seven) {
			tmp_array.push([array_of_dates[i], array_of_dates[i+1]]);
		}
	}

	return tmp_array;
}



casper.start(casper.cli.get("target"), function(){


}).run(function(){
	casper.test.begin('Booking Behaviour', tests, function suite(test) {
		casper.start(casper.cli.get("target"), function checkBooking() {
			test.comment("going to booking test property page");
			casper.open(url + property_uri).then(function() {
				test.assertTrue(this.getCurrentUrl().split("#")[0] == (url + property_uri), "Check correct property page has been reached.");
				casper.click("a.price-and-availability");
			});
		}).then(function() {
			test.assertTrue(this.getCurrentUrl().split("#")[1] == "prices-and-availability", "Check check prices-and-availability section has been opened.");
			var date_list = casper.evaluate(function() {
				var dates = document.querySelectorAll("#calendar-group1 tr .available.changeover:not(.afterBooking):not(.beforeBooking)");

				//return dates.innerText;
				 return Array.prototype.map.call(dates, function(e) {
				 	return e.id;
				 });
			});
		 
			casper.then(function() {
				var valid_day_combos = getSevenDays(date_list);
					var top = casper.evaluate(function() {
						var to_return = [];
						for(var i = 0; i < valid_day_combos.length; i++) {
							to_return.push(document.getElementById(valid_day_combos[i][0]));
							to_return.push(document.getElementById(valid_day_combos[i][1]));
						}

						return Array.prototype.map.call(to_return, function(e) {
							return e;
						})
						
					});
					console.log(top);
					top[0].click();
					top[1].click();
					casper.capture("thing.png");

					var enbld = casper.evaluate(function() {
						return document.getElementsByClassName("book-now enabled");
					});
					console.log(enbld.textValue);
			});


		}).run(function() {
			test.done();
		}).viewport(1920, 1080);
	});
});
