<?php
define('REDDIT_URL', 'http://www.reddit.com');

if (!isset($_REQUEST['subreddit'])) {
    header('HTTP/1.0 400 Bad Request');
    exit;
}

$endpoint = REDDIT_URL . $_REQUEST['subreddit'] .'/.json';
$content = json_decode(file_get_contents($endpoint));
$stories = array();

if (isset($content->error)) {
    header('Content-type: application/json');
    die(json_encode($content));
}

foreach ($content->data->children as $child) {
    $stories[] = array(
        'title' => $child->data->title,
        'permalink' => $child->data->permalink,
        'url' => $child->data->url,
        'author' => $child->data->author,
        'ups' => $child->data->ups,
        'downs' => $child->data->downs,
        'score' => $child->data->score,
        'num_comments' => $child->data->num_comments,
        'thumbnail' => $child->data->thumbnail
    );    
}

header('Content-type: application/json');
die(json_encode($stories));

