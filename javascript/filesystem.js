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
      if ( file.size >  150 * 1024 ) {
        error = "File size too great: Size: "+ ((file.size)/1024).toFixed(2) + " KB.<br /> Please limit to 150 KB";
        $.jGrowl(error, { header: "Filesystem Error" });
        console.error("filesystem:", error);
        return false;
      }

      saveImage(file, "shortcut");
    } else {
      error = "No file to upload.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
    }

    e.preventDefault();
    return false;
  }
});

$("#filesystem_icon_ui").click(function() {
  $("#filesystem_icon_input").click();
});

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
        if ( file.size >  150 * 1024 ) {
          error = "File size too great: Size: "+ ((file.size)/1024).toFixed(2) + " KB.<br /> Please limit to 150 KB.";
          $.jGrowl(error, { header: "Filesystem Error" });
          console.error("filesystem:", error);
          return false;
        }

      saveImage(file, "shortcut");
    } else {
      error = "No file selected to upload.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
    }
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

      if ( file.size >  5 * 1024 * 1024 ) {
        error = "File size too great: Size: "+ ((file.size)/1024/1024).toFixed(2) + " MB.<br /> Please limit to 5 MB.";
        $.jGrowl(error, { header: "Filesystem Error" });
        console.error("filesystem:", error);
        return false;
      }

      saveImage(file, "background");
    } else {
      error = "No file to upload.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
    }

    e.preventDefault();
    return false;
  }
});

$("#filesystem_bg_ui").click(function() {
  $("#filesystem_bg_input").click();
});

$("#filesystem_bg_input").change(function() {
  var error;
  var files = $("#filesystem_bg_input")[0].files;
    if ( files
      && files[0]
      && files[0].type ) {
        var file = files[0];

        if ( file.size >  5 * 1024 * 1024 ) {
          error = "File size too great: Size: "+ ((file.size)/1024/1024).toFixed(2) + " MB.<br /> Please limit to 5 MB.";
          $.jGrowl(error, { header: "Filesystem Error" });
          console.error("filesystem:", error);
          return false;
        }

      saveImage(file, "background");
    } else {
      error = "No file selected to upload.";

      // Only show errors when relevant windows are open
      if ( $(".ui-2#editor,.ui-2#config").is(":visible") === true ) {
        $.jGrowl(error, { header: "Filesystem Error" });
      }

      console.error("filesystem:", error);
    }
});

function saveImage(file, type) {
  var error;

  if ( (file.type).match("image/") === null ) {
    error = "Not an image.<br /> Type: "+ file.type;
    $.jGrowl(error, { header: "Filesystem Error" });
    console.error("filesystem:", error);
    return false;
  }

  var reader = new FileReader();
  reader.onload = function (event) {
    var extension = file.name;
    extension = extension.split(".");
    extension = extension.pop();

    var file_name;
    if ( type === "shortcut" ) {
      destination = shortcuts;
      file_name = $(".ui-2#editor").attr("active-edit-id") + "." + extension;
    } else if ( type === "background" ) {
      destination = fs.root;
      file_name = "background." + extension;
    } else {
      error = "Not shortcut or background.";
      $.jGrowl(error, { header: "Filesystem Error" });
      console.error("filesystem:", error);
      return false;
    }

    destination.getFile(file_name, {create: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.onwriteend = function(e) {
          if ( type === "shortcut" ) {
            $("#img_url").val(fileEntry.toURL())
              .change();
          } else if ( type === "background" ) {
            $("#bg-img-css").val( "url("+fileEntry.toURL()+")" )
              .change();
          }
        };
        fileWriter.write(dataURItoBlob(event.target.result));
      }, errorHandler);
    }, errorHandler);
  };
  reader.readAsDataURL(file);
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

  $.jGrowl(msg, { header: "Filesystem Error" });
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