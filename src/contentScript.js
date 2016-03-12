/**
 * Contentscript
 *
 * Use jQuery to select all review micro formats from the DOM.
 *
 */

console.log("PageLoaded");
console.log(window.location.href);

function scrape() {
    console.log("scraping...");
    var review_divs = [];
    if (window.location.href.match(/^https:\/\/twitter\.com/)) {
        console.log('looking for tweets twitter');
        review_divs = document.querySelectorAll('p.tweet-text');

    } else {
        console.log('looking for micro-formats');
        review_divs = document.querySelectorAll(
	    '*[itemprop="reviews"] *[itemprop="reviewBody"]');
    }

    var num_chars = 0;

    var reviews = [];
    for (var i = 0; i < review_divs.length; i++) {
        var review_text = review_divs[i].textContent;
        var review = {content: review_text, lang:'en'};
        reviews.push(review);
        num_chars += review_text.length;
	// send 10K chars at most.
        if (num_chars >= 10000)
	    break;
    }

    if (reviews.length > 0) {
        console.log(reviews.length + " reviews found");
    } else {
        console.log("No Reviews Found");
    }

    if (reviews.length > 0) {

        var data = JSON.stringify({data: reviews});
        window.$.post('https://sentimentanalyzer.appspot.com/api/classify.json',
		 data,
		 function(res) {
		     console.log("Got results");
		     if ('data' in res) {
			 var reviews = res["data"];
			 var scores = [];
			 var num_pos = 0;
  		         for (i = 0; i < reviews.length; i++) {
			     var score = parseFloat(reviews[i].score);
			     var pred = 0;
			     if (score >= 0.5) {
				 pred = 1;
			     }
			     if (pred == 1) {
				 num_pos += 1;
			     }
			     scores.push(pred);
			 }
			 //console.log(scores);
			 console.log(num_pos + " positive reviews; ");
			 console.log((scores.length - num_pos) + " negative reviews; ");
			 chrome.extension.sendRequest({action:'showPageAction',
						       num_pos: num_pos,
						       num_reviews: scores.length},
						      function(response) {});
		     } else {
			 // got error
			 console.log("Error: " + res);
		     }
		 }, 'json');

    }

}

/**
 * Check if we're on twitter - if so wait for 5sec until tweets
 * are loaded and then run scraper, otherwise run scraper
 * immediately
 */
if (window.location.href.match(/^http:\/\/twitter\.com/)) {
    console.log('on twitter - lets wait some msec and then scrape');
    window.setTimeout(scrape, 5000);
} else {
    console.log('call scraper');
    scrape();
}
