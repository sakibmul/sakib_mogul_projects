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
            url: "libs/php/supplied/getAll.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result.data);
    
            // For loop to create the cards to display
            for (let i = 0; i < result.data.length; i++) {
                $('#employeeDisplay').append(
                '<div class="col mb-4"><div class="card"><i class="fas fa-address-book fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Employee</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['lastName'] + ', ' + result['data'][i]['firstName'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['department'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['location'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['email'] + '</td></tr></tbody></table><hr><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#editEmp" title="Edit Employee"><i class="far fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#deleteEmp" title="Delete Employee"><i class="far fa-trash-alt fa-lg"></i></button></div></div></div>');
            }// end of for loop

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
            url: "libs/php/supplied/getAllDepartments.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
            console.log(result.data);

            // For loop to create the cards to display
            for (let i = 0; i < result.data.length; i++)   {
                $('#departmentDisplay').append(
                '<div class="col mb-4"><div class="card" style="height: 20rem;"><i class="fas fa-city fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Department</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['name'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['location'] + '</td></tr></tbody></table><hr><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#editDep" title="Edit Department"><i class="far fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#deleteDep" title="Delete Department"><i class="far fa-trash-alt fa-lg"></i></button></div></div></div>');
                }// end of for loop

            }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
        });
    
    };// End of get all departments function

});

// Add department click function
$('#addDep').click(function() {
    $('#addDepartment').modal('show');

    $('#addNewDepartment').click(function() {
    // Ajax call to insert new Department
    $.ajax({
        url: "libs/php/supplied/insertDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $('#departmentAdd').val(),
            locationID: $('#departLocAdd').val(),
        },
        success: function(result) {
            console.log(result.data);
            
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // End of Ajax call

});
});   

// Populate department dropdown so that it can be deleted from screen 
   $.ajax({
       url: "libs/php/supplied/getAllDepartments.php",
       type: "POST",
       dataType: "json",
       success: function(dropresult) {
           console.log(dropresult);
        $.each(dropresult.data, function(i) {
            $('#delDepartment').append($('<option>', {
            text: dropresult.data[i].name,
            value: dropresult.data[i].id
            }
         ));
         $('#delDepartment').val(dropresult['data']['id']).change();
         });
         // To delete the chosen department
         $('#deleteDepartment').click(function() {
            $.ajax({
                url: "libs/php/supplied/deleteDepartmentByID.php",
                type: "GET",
                dataType: "json",
                data: {
                    id: $('#delDepartment').val(),
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(jqXHR);
                 },
            })
            location.reload();
        });
        },// End of success function
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
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
            url: "libs/php/created/getAllLocations.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result.data);

                // For loop to create the cards to display
                for (let i = 0; i < result.data.length; i++) {
                    $('#locationDisplay').append(
                        '<div class="col mb-4"><div class="card"><i class="fas fa-location-arrow fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Location</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['name'] + '</td></tr></tbody></table><hr><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#editLoc" title="Edit Location"><i class="far fa-edit fa-lg"></i></button><button type="button" class="btn btn-secondary links mx-1" data-bs-toggle="modal" data-bs-target="#deleteLoc" title="Delete Location"><i class="far fa-trash-alt fa-lg"></i></button></div></div></div>'
                    );
                }// End of loop
    
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