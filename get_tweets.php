<?php

require_once('twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = '1414440619-IF9fSQLDYspmkuCdfmvO7uSXKhhYs6eCpr03JUJ';
$oauth_access_token_secret = 'R3c6eimQb7wMAtUcvgsLYFfQd0TwXfxovRWCnhcFPA3sz';
$consumer_key = 'hy9AGqcOV7ydbombVHtXU6S9k';
$consumer_secret = 'IGYGgqZkYPvLUZHwO87lcLJ5Ywc38d9oXB59cleSntgu6lkl4t';
$user_id = '1414440619';
$screen_name = 'gemfrend';
$count = 5;

$twitter_url = 'search/tweets.json';
$twitter_url .= '?q=' . urlencode($_GET['search']);
$twitter_url .= '&count=' . $count;

// Create a Twitter Proxy object from our twitter_proxy.php class
$twitter_proxy = new TwitterProxy(
	$oauth_access_token,			// 'Access token' on https://apps.twitter.com
	$oauth_access_token_secret,		// 'Access token secret' on https://apps.twitter.com
	$consumer_key,					// 'API key' on https://apps.twitter.com
	$consumer_secret,				// 'API secret' on https://apps.twitter.com
	$user_id,						// User id (http://gettwitterid.com/)
	$screen_name,					// Twitter handle
	$count							// The number of tweets to pull out
);

// Invoke the get method to retrieve results via a cURL request
$tweets = $twitter_proxy->get($twitter_url);

echo $tweets;

?>