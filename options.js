function save_options() {

  // loop through all instances of inputs and store all values that are not empty
  var last          = false;
  var setCount      = 0;
  var selector_id   = $('.addHostname *');
  var clicked_new   = false;
  var temp_storage  = {};

  if ($('.addHostname').length ) { var clicked_new = true; }
  if (!clicked_new && localStorage.length >= 1) { selector_id = $('.storage *'); }


  selector_id.filter('.cell').each(function(){
    var _id = $(this).attr('id');
    var _value = $(this).val();

    if (_value == "on" ) { _value = $(this).prop('checked');  last = true;}
    if (_value != "" || last) { 

      temp_storage[_id] = _value;
      setCount = setCount + 1; 

    }

    var fields = ($('.addHostname').length * 3);

    if (setCount >= fields) { 
      $.each( temp_storage, function( key, value ) { localStorage[key] = value; });
    } 

  });

    // Update status to let user know options were saved
    $("#status").html("Options Saved.");

    setTimeout(function() {
      $("#status").html("");
    }, 750);

    hostTable(false);
    $('.addHostname').hide();

    setTimeout(function() {
       location.reload();
    }, 750);
}

function clear_storage() {
  if (confirm("Are you sure you want to clear all sets?\nThis cannot be undone.")) {
    localStorage.clear();
    location.reload();
  } 
}

function reorder_storage(index) {
  var temp_storage  = {};
  var inc           = 0;
  var sets          = localStorage.length / 3;

    for (i=0; i < sets; i++){
      keyname = "hostname_" + i;
      hostname = localStorage.getItem(keyname);

      keyname = "label_" + i;
      label = localStorage.getItem(keyname);

      keyname = "tab_" + i;
      tab = localStorage.getItem(keyname);
      if (tab == "true") { tab = "checked"; } else { tab = ""; }

      if (i != index) {
        temp_storage[inc] = hostname;
        temp_storage[inc + 1] = label;
        temp_storage[inc + 2] = tab;

        inc = inc + 3;
      }

   };

  localStorage.clear();

  var set_length = inc / 3;
  inc = 0;

  for (i=0; i < set_length; i++) {
    localStorage["hostname_" + i] = temp_storage[inc];
    localStorage["label_" + i] = temp_storage[inc+1];
    localStorage["tab_" + i] = temp_storage[inc+2];

    inc = inc + 3;
  }; 

  location.reload();
}

function checkbox_toggle() {
  var is_checked = $("#tab").prop('checked');
  if (is_checked) { $("#tab").attr("checked", "checked"); } else { $("#tab").removeAttr("checked"); } 
}

function delete_set(button) {
  var host = button.id;
  var find = host.indexOf("_") + 1;
  var index = host.substring(find,host.length);

  if (confirm("Are you sure you want to delete this set?")) {
    reorder_storage(index);
  }
}

$(document).ready(function () {
  $('#addRow').click(function () {
    if($('.addHostname').length == 0) {
      $("#template").addClass('hidden'); 
      $('<div/>', {
      'class' : 'addHostname', html: GetHtml()
      }).hide().appendTo('#container').slideDown('slow'); 
    } 
  });

  hostTable(true);

  $('#save').bind('click', function() { save_options(); });
  $('#clear').bind('click', function() { clear_storage(); });
  $('#tab').bind('click', function() { checkbox_toggle(); });
  $("button[id^='delete']").bind('click', function() { delete_set(this); });

});

function GetHtml() {
  var len = (localStorage.length / 3) + $('.addHostname').length;
  var $html = $('.addHostnameTemplate').clone();

  $html.find('[id=hostname]')[0].id="hostname_" + len;
  $html.find('[id=label]')[0].id="label_" + len;
  $html.find('[id=tab]')[0].id="tab_" + len;
  return $html.html();    
}

function displayStorage(append) {
  if (!append) { $("#storagevars").html(""); }
  $.each( localStorage, function( key, value ) {
      $("#storagevars").append('<div>' + key + '</div>');
    });
}

function hostTable(append) {
  if (!append) { $(".storage").html(""); }
  var inc = 0;
  var sets = localStorage.length / 3;

  for (i=0; i<sets; i++){
      keyname = "hostname_" + i;
      value = localStorage.getItem(keyname);
      if (value == null) { value = "";}
      $(".storage").append('<input id="hostname_' + inc + '" class="cell header" type="text" name="hostname" value="' + value + '" style="margin-right: 10px;"/>');

      keyname = "label_" + i;
      value = localStorage.getItem(keyname);
      if (value == null) { value = "";}
      $(".storage").append('<input id="label_' + inc + '" class="cell header" type="text" name="label" value="' + value + '"/>');

      keyname = "tab_" + i;
      value = localStorage.getItem(keyname);
      if (value == "true") { value = "checked"; } else { value = ""; }
      $(".storage").append('<input id="tab_' + inc + '" class="cell header" type="checkbox" name="tab" ' + value + ' style="margin-left: 54px;"/>');

      $(".storage").append('<button id="delete_' + inc + '" class="remove ignore btn-set-width">Delete</button><br />');
      inc ++;
  }
}

