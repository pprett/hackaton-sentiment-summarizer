/**
 * On load of popup.html: access background page and retrieve
 * the stats. Display stats using Google image API.
 */
function loader(){
  console.log("Loader is loaded");
  chrome.tabs.getSelected(null, function(tab) {
    console.log("Drawing a chart...");
    var tab_id = tab.id;
    var bg = chrome.extension.getBackgroundPage();
    console.log("tab_id:" + tab_id);
      console.log(bg);
      console.log(bg)
    var num_reviews = bg.num_reviews[tab_id];
    var num_pos = bg.num_pos[tab_id];
    bg.console.log("Draw chart with: " + num_pos + " - " + num_reviews);
    var num_reviews_str = num_reviews + ',' + num_reviews;
    var pos_neg_str = num_pos + ',' + (num_reviews - num_pos);
    window.$("div#chart_div").html('<img src="https://chart.googleapis.com/chart?cht=p3&chs=250x100&chco=00EE00,FF0000&chd=t:' + num_pos + ',' + (num_reviews - num_pos) + '&chl=positive|negative" />');
    window.$("div#stats_div").html('<span>' + num_reviews + ' reviews extracted.</span>');

  });

}

window.onload = loader;