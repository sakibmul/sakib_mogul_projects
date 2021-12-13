// Pre Loader
 $(window).on('load', function () {
    if ($('#preloader').length) {
       $('#preloader').delay(1000).fadeOut('slow',function () 
       {$(this).remove();
      });
   }}
);

// Employee Function.
$('#employeeBtn').click(function() {
    $('body').css('background', 'url(libs/images/employees-image.jpg').css('background-size', 'cover').css('background-attachment', 'fixed');
    $('#employee').show();
    $('#department').hide();
    $('#location').hide();
    getAllEmployees();
    
    function getAllEmployees() {
        $('#employeeDisplay').html('');
        // Ajax call to be placed here
        $.ajax({
            url: "libs/php/getAll.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result.data);
    
            for (let i = 0; i < result.data.length; i++) {
                $('#employeeDisplay').append(
                '<div class="col mb-4"><div class="card"><i class="fas fa-address-book fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center">Employee</h5><table class="table"><tbody><tr><th>Name</th><td id="emp1"></td></tr><tr><th>Department</th><td id="dep1"></td></tr><tr><th>Location</th><td id="loc1"></td></tr><tr><th>Email</th><td id="email1"></td></tr></tbody></table><hr><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#editEmp" title="Edit Employee"><i class="far fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#deleteEmp" title="Delete Employee"><i class="far fa-trash-alt fa-lg"></i></button></div></div></div>');
            }
            }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
             
        });
        
    }; 
    
    // Add Employee click function
    $('#addEmp').click(function() {
        $('#addEmployee').modal('show');
    });
    
}); // End of Employee button 

// Department Function
$('#departmentBtn').click(function() {
    $('body').css('background', 'url(libs/images/business-image.jpg').css('background-size', 'cover').css('background-attachment', 'fixed');
    $('#department').show();
    $('#employee').hide();
    $('#location').hide();
    getAllDepartments();

    function getAllDepartments() {
        $('#departmentDisplay').html('');
        // Ajax call to be placed here
        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result.data);
    
            for (let i = 0; i < result.data.length; i++)   {
                $('#departmentDisplay').append(
                    '<div class="col mb-4"><div class="card"><i class="fas fa-city fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center">Department</h5><table class="table"><tbody><tr><td id="depart1">Department</td></tr><tr><td>Location</td></tr></tbody></table><hr><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#editDep" title="Edit Department"><i class="far fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#deleteDep" title="Delete Department"><i class="far fa-trash-alt fa-lg"></i></button></div></div></div>'
                );
            }
    
            }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
        });
    
    }; 

    // Add department click function
    $('#addDep').click(function() {
        $('#addDepartment').modal('show');
    });
    
});

// Location Function
$('#locationBtn').click(function() {
    $('body').css('background', 'url(libs/images/world-globe.jpg)').css('background-size', 'cover').css('background-attachment', 'fixed');
    $('#location').show();
    $('#employee').hide();
    $('#department').hide();
    getAllLocations();

    function getAllLocations() {
        $('#locationDisplay').html('');
        // Ajax call to be placed here
        $.ajax({
            url: "libs/php/.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result);
    
                /*$('#locationDisplay').append(
                    '<div class="col mb-4"><div class="card"><i class="fas fa-location-arrow fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center">Locations</h5><table class="table"><tbody><tr><td id="locat1">Location</td></tr></tbody></table><hr><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#editLoc" title="Edit Location"><i class="far fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#deleteLoc" title="Delete Location"><i class="far fa-trash-alt fa-lg"></i></button></div></div></div>'
                );*/
    
             }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
        });
    
    };

    // Add location click function
    $('#addLoc').click(function() {
        $('#addLocation').modal('show');
    });

});