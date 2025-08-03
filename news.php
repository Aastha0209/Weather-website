<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$apiKey = "35b3171387ea4fb998394f0cf7a96c5c"; // Your NewsAPI Key
$url = "https://newsapi.org/v2/everything?q=weather&sortBy=publishedAt&language=en&pageSize=5&apiKey=$apiKey";

// Fetch data from NewsAPI
$response = file_get_contents($url);
echo $response;
?>
