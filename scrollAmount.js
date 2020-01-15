/*!
 * Run a callback after the user scrolls, calculating the distance and direction scrolled
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} callback The callback function to run
 * @param  {Integer}  refresh  How long to wait between scroll events [optional]
 */
 var scrollDistance = function (callback, refresh) {

 	// Make sure a valid callback was provided
 	if (!callback || typeof callback !== 'function') return;

	if (!window.startedScroll) {
		window.scrollStartTime = Date.now();
		window.startedScroll = true;
	}

 	var isScrolling, start, end, distance, timeTaken;

 	window.addEventListener('scroll', function (event) {

 		if (!start) {
 			start = window.pageYOffset;
 		}

 		window.clearTimeout(isScrolling);
 		isScrolling = setTimeout(function() {
 			end = window.pageYOffset;
 			distance = end - start;
			window.startedScroll = false;
			timeTaken = Date.now() - window.scrollStartTime;
 			callback(distance, timeTaken);

 			window.startedScroll = false;
 			window.scrollStartTime = Date.now();
 			start = null;
 			end = null;
 			distance = null;
 		}, refresh || 61);

 	}, false);

};

$(document).ready(function() {
	var BATCH_SIZE = 1000;
	var counter = 1;

	for (var i = 0 ; i < BATCH_SIZE ; i++) {
		$('#main-div').append("<p>" + i.toString() + "</p>");
		counter++;
	}

	scrollDistance(function (distance, timeTaken) {
		if (distance == 0) return;
		var randomId = parseInt(Math.random().toString(10) * 100000);
		var elementId = 'amount-div-' + randomId.toString();
		var divContent = parseInt(Math.abs(distance), 10) + 'px ' + (distance < 0 ? '&#8593;' : '&#8595;') + " @" + (distance * 1000 / timeTaken).toPrecision(4).toString() + 'px/s';
		$("#amount").append("<div id='" + elementId + "'>" + divContent + "</div>");
		setTimeout(function() {
			$("#" + elementId).remove();
		}, 10000);
	});

	$(window).scroll(function() {
		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			var currCounter = counter;
			for (var i = currCounter; i < currCounter + BATCH_SIZE ; i++) {
				$('body').append("<p>" + i.toString() + "</p>");
			}
			counter += BATCH_SIZE;
		}
	});
});



