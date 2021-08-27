<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true) / 1000;

    $decode = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);

    // loop through geo json file to retrieve data
    foreach ($decode['features'] as $feature) {
        if($_REQUEST['iso_code'] == $feature["properties"]["iso_a2"]){
            $geometry = $feature["geometry"];
        }
    };


    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $geometry;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>