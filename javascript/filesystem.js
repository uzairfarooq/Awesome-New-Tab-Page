/**
 * When a file is being dragged into the browser
 */
$("body").bind({
  "dragover": function(e) {
    if ( $(".ui-2#editor").attr("active-edit-type") === "shortcut" ) {
      $(".ui-2#editor .iframe-mask").addClass("filesystem-drop-area");
    }

    e.stopPropagation();
    e.preventDefault();
    return false;
  },
  "dragleave": function(e) {
    $(".ui-2#editor .iframe-mask").removeClass("filesystem-drop-area");

    e.stopPropagation();
    e.preventDefault();
    return false;
  },
  "drop": function(e) {
    $(".ui-2#editor .iframe-mask").removeClass("filesystem-drop-area");

    e.preventDefault();
    return false;
  }
});

/**
 * When a file is dropped on the tile editor
 */
$(".ui-2#editor").bind({
  "drop": function(e) {
    var error;
    $(".ui-2#editor .iframe-mask").removeClass("filesystem-drop-area");

    // jQuery wraps the originalEvent
    e = e.originalEvent || e;

    var files = (e.files || e.dataTransfer.files);

    if ( files
      && files[0]
      && files[0].type ) {
      var file = files[0];

      if ( $(".ui-2#editor").attr("active-edit-type") !== "shortcut" ) {
        error = "This tile is not a shortcut.";
        $.jGrowl(error, { header: "Filesystem Error" });
        console.error("filesystem:", error);
        return false;
      }
      if ( validateImageFile(file, 150, "KB") == false ) {
        return false;
      }

      readFile(file, function (dataURI) {
        var fileExt = extractExtension(file.name);
        saveImage(dataURI, fileExt, "shortcut");
      });
    } else {
      error = "No file to upload.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
    }

    e.preventDefault();
    return false;
  }
});

// when icon browse button clicked
$("#filesystem_icon_ui").click(function() {
  $("#filesystem_icon_input").click();
});
// when icon file is selected
$("#filesystem_icon_input").change(function() {
  var error;
  var files = $("#filesystem_icon_input")[0].files;
    if ( files
      && files[0]
      && files[0].type ) {
        var file = files[0];

        if ( $(".ui-2#editor").attr("active-edit-type") !== "shortcut" ) {
          error = "This tile is not a shortcut.";
          $.jGrowl(error, { header: "Filesystem Error" });
          console.error("filesystem:", error);
          return false;
        }
        if (validateImageFile(file, 150, "KB") == false) {
            return false;
        }

        readFile(file, function (dataURI) {
          var fileExt = extractExtension(file.name);
          saveImage(dataURI, fileExt, "shortcut");
        });
    } else {
      error = "No file selected to upload.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
    }
});

// upon click on Use Screenshot button
$("#filesystem_icon_screenshot_bt").click(function () {
  var shortcutURL = $("#shortcut_url").val();
  chrome.tabs.create({ url: shortcutURL }, function (tab) {
    chrome.tabs.onUpdated.addListener(function (tabid, tabInfo, tabToCapture) {   // wait until page is completely loaded
      if (tabid == tab.id && tabInfo.status == "complete") {
        if (tabToCapture.active) {
          chrome.tabs.captureVisibleTab(function (dataUrl) {
            chrome.tabs.remove(tab.id, function() {
              chrome.tabs.getCurrent(function(tab){
                chrome.tabs.update(tab.id, {active: true});
              });
            });
            saveImage(dataUrl, "jpeg", "shortcut");
          });
        }
        else {
          // if user switched to some other tab, activate the tab again to take screenshot
          chrome.tabs.update(tab.id, { active: true }, function (tab) { 
            var handler = setInterval(function () {    // wait 400ms before taking screenshot for page to render completely, otherwise blank page appears
              chrome.tabs.get(tab.id, function (tab){
                if (tab.active)
                {
                  clearInterval(handler);
                  chrome.tabs.captureVisibleTab(function (dataUrl) {
                    chrome.tabs.remove(tab.id, function() {
                      chrome.tabs.getCurrent(function(tab){
                        chrome.tabs.update(tab.id, {active: true});
                      });
                    });
                    saveImage(dataUrl, "jpeg", "shortcut");
                  });
                }
                else{
                  chrome.tabs.update(tab.id, { active: true });   // if tab is switched again, activate tab again
                }
              });
            }, 400);
          });
        }
      }
    });
  });
});

/**
 * When a file is dropped on the options window
 */
$(".ui-2#config").bind({
  "drop": function(e) {
    var error;
    $(".ui-2#editor .iframe-mask").removeClass("filesystem-drop-area");

    // jQuery wraps the originalEvent
    e = e.originalEvent || e;

    var files = (e.files || e.dataTransfer.files);

    if ( files
      && files[0]
      && files[0].type ) {
      var file = files[0];

      if ( validateImageFile(file, 5, "MB") == false ) {
        return false;
      }

      readFile(file, function (dataURI) {
        var fileExt = extractExtension(file.name);
        saveImage(dataURI, fileExt, "background");
      });
    } else {
      error = "No file to upload.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
    }

    e.preventDefault();
    return false;
  }
});

// when background browse button clicked
$("#filesystem_bg_ui").click(function() {
  $("#filesystem_bg_input").click();
});
// when background file is selected
$("#filesystem_bg_input").change(function() {
  var error;
  var files = $("#filesystem_bg_input")[0].files;
    if ( files
      && files[0]
      && files[0].type ) {
        var file = files[0];
        if (validateImageFile(file, 5, "MB") == false) {
          return false;
        }

        readFile(file, function (dataURI) {
          var fileExt = extractExtension(file.name);
          saveImage(dataURI, fileExt, "background");
        });
    } else {
      error = "No file selected to upload.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
    }
});


// checks if file is an image file and size is less than 150kb
function validateImageFile(file, sizeLimit, sizeUnit) {
    var originalLimit = sizeLimit;
    var error;
    if ((file.type).match("image/") === null) {
        error = "Not an image.<br /> Type: " + file.type;
        $.jGrowl(error, { header: "Filesystem Error" });
        console.error("filesystem:", error);
        return false;
    }

    var fileSize = file.size / 1024;
    sizeLimit *= 1024;
    if (sizeUnit == "MB") {
        sizeLimit = sizeLimit * 1024;
        fileSize /= 1024;
    }
    if (file.size > sizeLimit) {
        error = "File size too great: Size: " + (fileSize).toFixed(2) + " " + sizeUnit + ".<br /> Please limit to " + originalLimit + " " + sizeUnit + ".";
        $.jGrowl(error, { header: "Filesystem Error" });
        console.error("filesystem:", error);
        return false;
    }
    return true;
}

function readFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
        callback(event.target.result);
    };
    reader.readAsDataURL(file);
}

function extractExtension(filename) {
    var extension = filename;
    extension = extension.split(".");
    extension = extension.pop();
    return extension;
}

function saveImage(dataURI, fileExtension, saveTo) {
  var error,
    file_name;

  if ( saveTo === "shortcut" ) {
    destination = shortcuts;
    file_name = $(".ui-2#editor").attr("active-edit-id") + "." + fileExtension;
  } else if (saveTo === "background") {
    destination = fs.root;
    file_name = "background." + fileExtension;
  } else {
    error = "Not shortcut or background.";
    $.jGrowl(error, { header: "Filesystem Error" });
    console.error("filesystem:", error);
    return false;
  }

  destination.getFile(file_name, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(fileWriter) {
      fileWriter.onwriteend = function(e) {
        if (saveTo === "shortcut") {
          $("#img_url").val(fileEntry.toURL())
            .change();
          } else if (saveTo === "background") {
          $("#bg-img-css").val( "url("+fileEntry.toURL()+")" )
            .change();
        }
      };
      fileWriter.write(dataURItoBlob(dataURI));
    }, errorHandler);
  }, errorHandler);
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var bb = new window.WebKitBlobBuilder();
  bb.append(ab);
  return bb.getBlob(mimeString);
}

function errorHandler(e) {
  var msg = "";

  switch ( e.code ) {
    case FileError.QUOTA_EXCEEDED_ERR:
    msg = "QUOTA_EXCEEDED_ERR";
    break;
    case FileError.NOT_FOUND_ERR:
    msg = "NOT_FOUND_ERR";
    break;
    case FileError.SECURITY_ERR:
    msg = "SECURITY_ERR";
    break;
    case FileError.INVALID_MODIFICATION_ERR:
    msg = "INVALID_MODIFICATION_ERR";
    break;
    case FileError.INVALID_STATE_ERR:
    msg = "INVALID_STATE_ERR";
    break;
    default:
    msg = "Unknown Error";
    break;
  }

  // Only show errors when relevant windows are open
  if ( $(".ui-2#editor,.ui-2#config").is(":visible") === true ) {
    $.jGrowl(msg, { header: "Filesystem Error" });
  }

  console.error("filesystem: " + msg);
}

var fs, shortcuts;
function initFS() {
  window.webkitRequestFileSystem(window.PERSISTENT, 50 * 1024 * 1024, function(filesystem) {
    fs = filesystem;
    fs.root.getDirectory("/shortcut", { create: true }, function(dirEntry){
      shortcuts = dirEntry;
    });
  }, errorHandler);

}
if (window.webkitRequestFileSystem) {
  initFS();
}

function deleteShortcut(filename) {
  shortcuts.getFile(filename, {}, function(fileEntry) {
    fileEntry.remove(function() {}, errorHandler);
  }, errorHandler);
}

function deleteShortcuts() {
  var entries = [],
  reader = shortcuts.createReader(),

  readEntries = function() {
    reader.readEntries(function(results) {
      if (!results.length) {
        entries = entries.sort();
        $.each(entries, function(index, fileEntry) {
          fileEntry.remove(function() {}, errorHandler);
        });
      } else {
        entries = entries.concat(util.toArray(results));
        readEntries();
      }
    }, errorHandler);
  };

  readEntries();
}

function deleteRoot() {
  var entries = [],
  reader = fs.root.createReader(),

  readEntries = function() {
    reader.readEntries(function(results) {
      if (!results.length) {
        entries = entries.sort();
        $.each(entries, function(index, entry) {
          entry.remove(function() {}, errorHandler);
        });
      } else {
        entries = entries.concat(util.toArray(results));
        readEntries();
      }
    }, errorHandler);
  };

  readEntries();
}