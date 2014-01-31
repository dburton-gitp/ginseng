// Ginseng: Google Chrome Extension
// Author: David Burton
// http://www.builtbyburton.com
// About: This extension will switch between hostnames while maintaining the relative path.

function switch_host(host, newtab) {
	chrome.tabs.getSelected(null,function(tab) { 

		var url = tab.url;
		var rel_url = parseUri(url).relative;
		var new_url = host + rel_url;

		if (newtab == "true") {
			chrome.tabs.create({url: new_url});
		}else{
			chrome.tabs.update({url: new_url});	
		}
	});
}

function open_options() {
	var tabs = [];
	var options_exist = chrome.tabs.query({title: "Ginseng Options"}, function(tabs) {

		if (tabs.length > 0) {
			var id = tabs[0].id;
			chrome.tabs.update(id, {active: true, selected: true});
		} else {
			chrome.tabs.create({url: "options.html"});
		}

	});
}

function clearStorage () {
	localStorage.clear();
}

$(document).ready(function() {
	$("#options").on("click", function() { open_options(); });
	$("#clear-storage").on("click", function() { clearStorage(); });

	var inc = 0;
	var sets = localStorage.length / 3;

	for (i=0; i<sets; i++){
	  _hostname = localStorage.getItem("hostname_" + i);
	  _label 	= localStorage.getItem("label_" + i);
	  _tab 		= localStorage.getItem("tab_" + i);

	  $(".btn-container").append('<div class="button" id="local" data="' + _hostname + '" newtab="' + _tab + '" >' + _label + '</div>');
	  inc ++;
	}

	$(".button").on("click", function() {
		
		var host 	= $(this).attr('data');
		var newtab 	= $(this).attr('newtab');

		switch_host(host, newtab);
	});

});
