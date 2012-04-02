/*
  Original code by Sachleen (sachleen.com // sachleen.sandhu@gmail.com)
  https://chrome.google.com/webstore/detail/feckadlaijbceoglkncdgebgkminbkia

  New Tab With Clock by Sachleen Sandhu is licensed under a Creative
  Commons Attribution-ShareAlike 3.0 Unported License.
  http://creativecommons.org/licenses/by-sa/3.0/
*/

/**
* Displays the bookmarks bar.
*
* @param {BookmarkTreeNode array} array of BookmarkTreeNode results
*/

function getBookmarks(tree)
{
    //bookmarksList = '<ul id="nav">';
    bookmarksList = '<li id="other"><a href="#"><img class="favicon" src="/images/core.bookmarkbar.folder.png" title="Other"> Other Bookmarks   </a><ul>';
    buildTree(tree[0].children[1]);
    bookmarksList += '</ul></li>';
    buildTree(tree[0].children[0]);
    //bookmarksList += '</ul>';
    $('#bookmarksBar').html(bookmarksList);
}

function buildTree(items)
{
    var items = items.children;
    for (var i = 0; i < items.length; i++)
    {
        if(items[i].url != undefined) {
            if( (items[i].url).indexOf("javascript") === -1 ) {
            bookmarksList += '<li><a href="{0}"><img height="16px" width="16px" class="favicon" src="chrome://favicon/{0}" title="{1}">{1}</a></li>'.format(items[i].url, items[i].title != "" ? " " + truncate(items[i].title, 23, true) : "");
            }
        }
        else
        {
            bookmarksList += '<li>';
            bookmarksList += '<a href="#"><img height="16px" width="16px" class="favicon" src="/images/core.bookmarkbar.folder.png" title="{0}">{0}</a>'.format(items[i].title != "" ? " " + truncate(items[i].title, 23, true) : "");
            bookmarksList += '<ul>';
            buildTree(items[i]);
            bookmarksList += '</ul></li>';
        }
    }
}

/**
* Truncates a string to specified length.
*
* @param {string} string to truncate
* @param {int} maximum length of truncated string
* @param {bool} If true, an ellipsis will be added to the end of the truncated string
* @return {string} Retruns truncated string. If string is shorter than len, unmodified string is returned.
*/
function truncate(str, len, dots)
{
    var ret = str;
    if(str.length > len)
    {
        ret = str.substring(0, len-1);
        if(dots)
            ret += "...";
    }

    return ret;
}

String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};