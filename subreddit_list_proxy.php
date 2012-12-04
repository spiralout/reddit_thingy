<?php
define('REDDIT_URL', 'http://www.reddit.com/');
define('REDDITS_ENDPOINT', REDDIT_URL .'reddits/.json');

$reddits = array();
$content = json_decode(file_get_contents(REDDITS_ENDPOINT));

foreach ($content->data->children as $child) {
    $reddits[] = array('title' => $child->data->title, 'url' => $child->data->url);
}

header('Content-type: application/json');
die(json_encode($reddits));
