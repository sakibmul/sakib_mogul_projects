<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true) / 1000;

    $decode = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);

    $countries = [];

    // loop through the geoJson file to get Info

    foreach ($decode['features'] as $feature) {
        $data['name'] = $feature['properties']['name'];
        $data['isoCode'] = $feature['properties']['iso_a3'];
        array_push($countries, $data);
    };

    // Countries into alphabetic order
    
    usort($countries, function ($a, $b) {
        return $a['name'] <=> $b['name'];
    });

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $countries;
    $output['data']['borders'] = $decode;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>