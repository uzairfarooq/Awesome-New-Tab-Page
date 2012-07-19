$(document).ready(function($) {

  function restyle() {
    var width  = $(window).width() ,
        height = $(window).height();

    $("body").css({
      "width" : width,
      "height": height
    });

    $(".tab-link").css({
      "width" : width - 75
    });
  }

  // Handles when the widget is resized
  restyle();
  $(window).bind("resize", function() {
    restyle();
  });

  $(window).bind('storage', function (e) {
    if ( typeof(e.originalEvent) === "object"
    && typeof(e.originalEvent.key) === "string"
    && e.originalEvent.key === "open_tabs" ) {
      searchTabs();
    }
  });

  $(".tab-link").live("click", function () {
    localStorage.setItem("switch_to_tab", $(this).attr("id"));
  });

  $(".close").live("click", function () {
    localStorage.setItem("close_tab", $(this).attr("id"));
  });

  $(".pin,.unpin").live("click", function () {
    localStorage.setItem("pin_toggle", $(this).attr("id"));
  });

  $('img').live('dragstart', function(event) { event.preventDefault(); });

  $("input#query").live("keyup", searchTabs);

  function searchTabs() {
    var
    open_tabs_html = [];
    query     = $("input#query").val(),
    open_tabs = JSON.parse(localStorage.getItem("open_tabs")),
    tab_names = $.map(open_tabs, function (tab) {
      return {
        "title" : tab.title,
        "id"    : tab.id
      }
    }),
    filtered  = $.map(tab_names, function (tab) {
      var score = (tab.title).score(query);
      if ( score > 0 ) {
        return {
          "title" : tab.title,
          "id"    : tab.id ,
          "score" : score
        }
      }
    });

    if ( typeof(query) === "string"
    &&   query !== "" ) {
      filtered.sort(function(a, b) {
        return b.score - a.score
      });
    }

    $.each(open_tabs, function(id, tab) {
      if ( typeof(query) === "string"
      &&   query !== ""
      &&   filtered.filter(function (_tab) { return _tab.id === tab.id }).length !== 1) {
        return;
      }

      if ( tab.incognito === false ) {
        var pin,
          open_temp  = $("<div></div>").addClass("tab-item");
        $("<img></img>").appendTo(open_temp).addClass("tab-icon")
          .attr({
            "src"   : "chrome://favicon/" + tab.url,
            "height": 16,
            "width" : 16
          });

        if ( typeof(query) === "string"
        &&   query !== "" ) {
          tab.title = (tab.title).replace(new RegExp(escape(query), "gi"), "<b>$&</b>");
        }

        $("<div></div>").appendTo(open_temp).addClass("tab-link")
          .attr({
            "id"    : tab.id   ,
            "title" : tab.title
          })
          .html( tab.title );
        pin = $("<span></span>").attr("id", tab.id).addClass("button");
        if (tab.pinned === false) {
          pin.appendTo(open_temp).html( "<img src='pin.png' title='Pin'>" ).addClass("pin");
        } else {
          pin.appendTo(open_temp).html( "<img src='unpin.png' title='Unpin'>" ).addClass("unpin");
        }
        $("<span></span>").appendTo(open_temp).html( "<img src='close.png' title='Close'>" )
          .attr("id", tab.id).addClass("close button");

        open_tabs_html.push( open_temp );
      }
    });

    $("#tabs").empty();
    $.each(open_tabs_html, function(i, e) {
      $(e).appendTo("#tabs");
    });

    restyle();
  }

  searchTabs(); //initialize tabs
});