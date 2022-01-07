// Pre Loader
 $(window).on('load', function () {
    if ($('#preloader').length) {
       $('#preloader').delay(1000).fadeOut('slow',function () 
       {$(this).remove();
      });
   }}
);

/**************************************** Employee Function **************************************/
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
    
            // For loop to create the cards to display
            for (let i = 0; i < result.data.length; i++) {
                $('#employeeDisplay').append(
                '<div class="col mb-4"><div class="card"><i class="fas fa-address-book fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Employee</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['lastName'] + ', ' + result['data'][i]['firstName'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['department'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['location'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['email'] + '</td></tr></tbody></table></div></div></div>');
            }// end of for loop

            }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
             
        });
        
    }; 
    
}); // End of Employee button screen

// add employee Function
$('#addEmp').click(function() {
    $('#addEmployee').modal('show');
});
    // populate the add new Employee department drop down
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "POST",
        dataType: "json",
        success: function(result) {
            console.log(result);
         $.each(result.data, function(i) {
             $('#empDepartment').append($('<option>', {
             text: result.data[i].name,
             value: result.data[i].id
             }
          ));
          });
          
          // Add new Employee
          $('#addNewEmployee').click(function() {
            if ($('#empFirstName').val() != "" && $('#empLastName').val() != "" && $('#empEmail').val('#empDepartment').val() != "Select a Department") {
            $.ajax({
                url: "libs/php/insertEmployee.php",
                type: "POST",
                dataType: "json",
                data: {
                    firstName: $('#empFirstName').val(),
                    lastName: $('#empLastName').val(),
                    email: $('#empEmail').val(),
                    departmentID: $('#empDepartment').val()
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
            }
         });
         },// End of success function
         error: function (jqXHR, textStatus, errorThrown) {
             console.log(errorThrown);
             console.log(textStatus);
             console.log(jqXHR);
          },
     });

// delete Employee Function
$('#delEmp').click(function() {
    $('#deleteEmp').modal('show');
});
// Populate delete employee dropdown so that it can be deleted from screen 
   $.ajax({
       
       url: "libs/php/getAllPersonnel.php", 
       type: "POST",
       dataType: "json",
       success: function(result) {
           console.log(result);
        $.each(result.data, function(i) {
            $('#empList').append($('<option>', {
            text: result.data[i].firstName + ' ' + result.data[i].lastName,
            value: result.data[i].id
            }
         ));
         
         });
    
         // To delete the chosen employee
         $('#deleteEmployee').click(function() {
            $.ajax({
                url: "libs/php/deleteEmployeeById.php",
                type: "GET",
                dataType: "json",
                data: {
                        id: $('#empList').val(), 
                },
                success: function(result) {
                    if (result.status.name == "ok") {
                        location.reload();
                    }
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(jqXHR);
                 },
            }); // end of ajax call
            
        });
        },// End of success function
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    });

/****************************************Department Function *************************************/

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

        // For loop to create the cards to display
            for (let i = 0; i < result.data.length; i++)   {
                $('#departmentDisplay').append(
                '<div class="col mb-4"><div class="card"><i class="fas fa-city fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Department</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['name'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['location'] + '</td></tr></tbody></table></div></div></div>');
            }; // end of for loop

        }, 
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
        },
    });
    
};// End of get all departments function

});// End of Department Main screen function 

// Add department click function
$('#addDep').click(function() {
    $('#addDepartment').modal('show');
});
// populate the add new department drop down for specific location
$.ajax({
    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
      success: function(result) {
        console.log(result);
         $.each(result.data, function(i) {
             $('#departLocAdd').append($('<option>', {
             text: result.data[i].name,
             value: result.data[i].id
             }
          ));
          });
      },// End of success function
      error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
      },
});
     
// Add new department
$('#addNewDepartment').click(function() {
    if ($('#departmentAdd').val() != "" && $('#departmentLocAdd').val() != "Select a Location") {
    $.ajax({
        url: "libs/php/insertDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $('#departmentAdd').val(),
            locationID: $('#departLocAdd').val()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // End of Ajax call location.reload() can be placed under
    }
 });

 $('#delDep').click(function() {
    $('#deleteDep').modal('show');
});
// Populate delete department dropdown so that it can be deleted from screen 
$.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $.each(result.data, function(i) {
            $('#delDepartment').append($('<option>', {
            text: result.data[i].name,
            value: result.data[i].id
            }
         ));
    });
         
    // To delete the chosen department
         $('#deleteDepartment').click(function() {
            $.ajax({
                url: "libs/php/deleteDepartmentByID.php",
                type: "GET",
                dataType: "json",
                data: {
                    id: $('#delDepartment').val(),
                },
                success: function(result) {
                    if (result.status.name == "ok") {
                        location.reload();
                    }
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(jqXHR);
                 },
            }); // end of ajax call
            
        });
    },// End of success function
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
    },
}); // End of populate delete dropdown
    
/************************************** Location Function ****************************************/

$('#locationBtn').click(function() {
    $('body').css('background', 'url(libs/images/world-globe.jpg)').css('background-size', 'cover').css('background-attachment', 'fixed');
    $('#location').show();
    $('#employee').hide();
    $('#department').hide();
    getAllLocations();

    function getAllLocations() {
        $('#locationDisplay').html('');
        
        $.ajax({
            url: "libs/php/getAllLocations.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result.data);

                // For loop to create the cards to display
                for (let i = 0; i < result.data.length; i++) {
                    $('#locationDisplay').append(
                        '<div class="col mb-4"><div class="card"><i class="fas fa-location-arrow fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Location</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['name'] + '</td></tr></tbody></table></div></div></div>'
                    );
                }// End of loop

                }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
        });
    
    }; // End of get all location function

});// End Location main screen function

// Add location click function
$('#addLoc').click(function() {
    $('#addLocation').modal('show');
});

// Add new location function
$('#addNewLocation').click(function() {
    if ($('#locationAdd').val() != "") { 
    $.ajax({
        url: "libs/php/insertLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $('#locationAdd').val(),
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
        },
    }); // End of Ajax call location.reload() can under
    }
});

$('#delLoc').click(function() {
    $('#deleteLoc').modal('show');
});
// Populate delete Location dropdown so it can be removed from screen
$.ajax({
    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $.each(result.data, function(i) {
            $('#delLocation').append($('<option>', {
            text: result.data[i].name,
            value: result.data[i].id
            }
           ));
        });
          
        // To delete the chosen Location
        $('#deleteLocation').click(function() {
            
            $.ajax({
                url: "libs/php/deleteLocationById.php",
                type: "GET",
                dataType: "json",
                data: {
                    id: $('#delLocation').val(),
                },
                
                success: function(result) {
                    if (result.status.name == "ok") {
                        location.reload();
                    }
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                     console.log(errorThrown);
                     console.log(textStatus);
                     console.log(jqXHR);
                },
             }); // end of ajax call
             
         });
    },// End of success function
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
    },
});
