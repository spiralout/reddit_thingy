var timer;
var REFRESH_INTERVAL = 60 * 1000;

var REDDIT_URL               = 'http://www.reddit.com';
var REDDIT_PROXY_TOP_STORIES = 'top_stories_proxy.php';
var REDDIT_PROXY_SUBREDDITS  = 'subreddit_list_proxy.php';

//
// Set a status message
//
function setStatus(status) {
    $('#status_indicator').empty();
    $('#status_indicator').html(status);
}

//
// Populate the subreddit list
// 
function populateSubreddits(data) {
    setStatus('Loading reddits...');
    
    var select = $('#subreddit_list');
    select.empty();
   
    $.each(data, function(index, value) {
        select.append($('<option></option>').attr('value', value.url).text(value.url));
    });

    setStatus('');
}

//
// Display the top stories for the selected subreddit
// 
function displayTopStories(data) {
    setStatus('Loading top stories...');
   
    // handle errors from reddit API
    if (data.error > 0) {
        if (data.error == 429) {
            setStatus('Reddit is busy');
        } else {
            setStatus('Unknown error '+ data.error);
        }
        
        return;
    }
    
    // helper for thumbnail content
    var thumbnail = function(thumb) {
        if (/^http:\/\//i.test(thumb)) {
            return '<img src="' + thumb + '" />';
        } else {                                    
            return '&nbsp;';
        }
    };

    // helper for up and down votes content
    var score = function(data) {
        return data.score + '<br /><span class="smaller">' + data.ups + '&uarr;  ' + 
            data.downs + '&darr;</span>';
    }

    // helper for link title
    var description = function(data) {
        return '<a href="' + data.url + '">' + data.title + '</a><br />' +
            '<span class="smaller">' + data.num_comments + ' comments, posted by ' + data.author + 
            ', <a href="' + REDDIT_URL + data.permalink + '">reddit link</a></span>';
}
    
    $('#top_stories_table tbody').empty();
    
    // render row for each link
    $.each(data, function(index, value) {
        $('#top_stories_table > tbody:last').append(
            '<tr' + (index % 2 == 0 ? '' : ' class="alt"') + '>' + 
            '<td>' + thumbnail(value.thumbnail) + '</td>' +
            '<td class="score">' + score(value) + '</td>' + 
            '<td>' + description(value) + '</td>' +
            '</tr>'
        );
    });

    setStatus('');
}

//
// Button click handler
// starts timer once clicked
// 
function clickHandler() {
    $.getJSON(REDDIT_PROXY_TOP_STORIES + '?subreddit=' + $('#subreddit_list').val(), displayTopStories);            
    timer = setTimeout(clickHandler, REFRESH_INTERVAL);
}


$(document).ready(function() {
    $('#top_stories_button').click(clickHandler);

    // changing the subreddit stops the auto-refresh
    $('#subreddit_list').change(function() {
        clearTimeout(timer);
    });

    $.getJSON(REDDIT_PROXY_SUBREDDITS, populateSubreddits);
});

