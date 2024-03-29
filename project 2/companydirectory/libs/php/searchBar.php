<?php
    
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    include("config.php");

    header('Content-Type: application/json; charset=UTF-8');
    
    $conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

    if (mysqli_connect_errno()) {
        
        $output['status']['code'] = "300";
        $output['status']['name'] = "failure";
        $output['status']['description'] = "database unavailable";
        $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output);

        exit;

    }   
    $searchTerm = ''.$_REQUEST['searchTerm'].'%';
    
    $query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (p.departmentID = d.id) LEFT JOIN location l ON (d.locationID = l.id) WHERE (p.firstName LIKE '$searchTerm' OR p.lastName LIKE '$searchTerm')";
   
   if(isset($_REQUEST["dept"]) and strlen($_REQUEST["dept"]) > 0){
        $query = $query.' and d.id ='.$_REQUEST['dept'];
    }
 
    if(isset($_REQUEST["loc"]) and strlen($_REQUEST["loc"]) > 0){
        
        $query = $query.' and l.id ='.$_REQUEST['loc'];
    } 

    $query = $query.' ORDER BY p.lastName, p.firstName, d.name, l.name';
    //echo json_encode($query);
 
    $result = $conn->query($query);

    
    
    if (!$result) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";  
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output); 

        exit;

    }
   
    $data = [];

    while ($row = mysqli_fetch_assoc($result)) {

        array_push($data, $row);

    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;
    
    mysqli_close($conn);

    echo json_encode($output); 

?>
