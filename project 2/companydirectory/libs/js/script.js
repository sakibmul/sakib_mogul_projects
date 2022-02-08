// Pre Loader
 $(window).on('load', function () {
    if ($('#preloader').length) {
       $('#preloader').delay(1000).fadeOut('slow',function () 
       {$(this).remove();
      });
   }}
);

$('document').ready(function(){
    $('#employeeBtn').click();
});

/**************************************** Employee Function **************************************/

$('#employeeBtn').click(function() {
    $('body').css('background', 'url(libs/images/employees-image.jpg').css('background-size', 'cover').css('background-attachment', 'fixed').css('width', '100%').css('position', 'absolute').css('top', '0').css('left', '0');
    $('#employee').show();
    $('#searchEmployee').show();
    $('#addEmp').show();
    $('#searchEmployeeInp').val('');
    $('#departDepen').hide();
    $('#locatDepen').hide();
    $('#department').hide();
    $('#location').hide();
    $('#addDep').hide();
    $('#addLoc').hide();
    
        
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
                '<div class="col mb-4"><div class="card"><i class="fas fa-address-book fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Employee</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['lastName'] + ', ' + result['data'][i]['firstName'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['department'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['location'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['email'] + '</td></tr></tbody></table><button type="button" value="' + result['data'][i]['id'] + '" class="btn btn-secondary mainButtons" data-bs-toggle="modal" data-bs-target="#deleteEmp" title="Delete Location"><i class="far fa-trash-alt fa-lg"></i></button><button type="button" value="'+ result['data'][0]['id'] +'" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editEmployee" title="Edit Location"><i class="far fa-edit fa-lg"></i></button></div></div></div>');
            }// end of for loop

            }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
             
        });
    
}); // End of Employee button screen

// add employee Modal
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
        },// End of success function
        error: function (jqXHR, textStatus, errorThrown) {
             console.log(errorThrown);
             console.log(textStatus);
             console.log(jqXHR);
        },
    });

// Add new Employee
$('#addNewEmployee').click(function() {
    if ($('#empFirstName').val() != "" && $('#empLastName').val() != "" && $('#empEmail').val() != "" && $('#empDepartment').val() != "Select a Department") {
    $.ajax({
        url: "libs/php/insertEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: $('#empFirstName').val().charAt(0).toUpperCase() + $('#empFirstName').val().slice(1),
            lastName: $('#empLastName').val().charAt(0).toUpperCase() + $('#empLastName').val().slice(1),
            email: $('#empEmail').val(),
            departmentID: $('#empDepartment').val()
        },
        success: function(result) {
            console.log(result.data);
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // End of Ajax call
    }
 });// End of addNewEmployee function

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
    
         },// End of success function
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
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
            console.log(result.data);
            location.reload();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // end of ajax call
    
}); // End of deleteEmployee function

// Edit Employee
$('#editEmp').click(function() {
    $('#editEmployee').modal('show');
});

// Populate the Edit Employee Department dropdown: trigger in empToEdit change function.
$.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result.data);
        $.each(result.data, function(i) {
            $('#emp-department').append($('<option>', {
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
}); // End of populate Employee Department dropdown

// Populate the edit Employee dropdown
$.ajax({
    url: "libs/php/getAllPersonnel.php",
    type: "GET",
    dataType: "json",

    success: function(result) {
        console.log(result.data);

        $.each(result.data, function(i) {
            $('#empToEdit').append($('<option>', {
            text: result.data[i].firstName + ' ' + result.data[i].lastName,
            value: result.data[i].id
            }
         ));
         });
            
    }, 
     error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
     },
     
});

$('#empToEdit').change(function() {
    //var employeeSelected = $(this).val(); can also be used
    var employeeSelected = $('#empToEdit option:selected').val();
    
    $.ajax({
       url: "libs/php/getPersonnelByID.php",
       type: "GET",
       dataType: "json",
       data: {
               id: employeeSelected,
       },
       success: function(result) {
           console.log(result.data);
           $('#emp-firstName').val(result['data'][0]['firstName']);
           $('#emp-lastName').val(result['data'][0]['lastName']);
           $('#emp-jobTitle').val(result['data'][0]['jobTitle']);
           $('#emp-email').val(result['data'][0]['email']);
           $('#emp-department').val(result['data'][0]['departmentID']).change();
           
           // Actual Edit of Employee to be written here.
           $('#editCurrEmployee').click(function() {
               // if statement can be written here if required, if inputs are empty strings
               $.ajax({
                   url: "libs/php/editEmployee.php",
                   type: "POST",
                   dataType: "json",
                   data: {
                           employeeID: employeeSelected,
                           firstName: $('#emp-firstName').val().charAt(0).toUpperCase() + $('#emp-firstName').val().slice(1),
                           lastName: $('#emp-lastName').val().charAt(0).toUpperCase() + $('#emp-lastName').val().slice(1),
                           jobTitle: $('#emp-jobTitle').val(),
                           email: $('#emp-email').val(),
                           departmentID: $('#emp-department').val()
                   },
                   success: function(result) {
                       console.log(result.data);
                       
                    location.reload();
                       
                   },
                   error: function (jqXHR, textStatus, errorThrown) {
                       console.log(errorThrown);
                       console.log(textStatus);
                       console.log(jqXHR);
                    },
               }); // end of ajax call
            // End of if statement if required
           });

       },
       error: function (jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           console.log(textStatus);
           console.log(jqXHR);
       },
   })

}); // End of empToEdit change function

// To delete the chosen employee
$('#searchEmployeeBtn').click(function() {
    var searchEmp = $('#searchEmployeeInp').val();
    $.ajax({
        url: "libs/php/searchBar.php",
        type: "GET",
        dataType: "json",
        data: {
            searchTerm: searchEmp,
            
        },
        success: function(result) {
            console.log(result.data);

            $('#employeeDisplay').html('');
            // for loop to create cards
            for (let i = 0; i < result.data.length; i++) {
                $('#employeeDisplay').append(
                '<div class="col mb-4"><div class="card"><i class="fas fa-address-book fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Employee</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['lastName'] + ', ' + result['data'][i]['firstName'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['department'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['location'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['email'] + '</td></tr></tbody></table><button type="button" value="' + result['data'][i]['id'] + '" class="btn btn-secondary mainButtons" data-bs-toggle="modal" data-bs-target="#deleteEmp" title="Delete Location"><i class="far fa-trash-alt fa-lg"></i></button><button type="button" value="'+ result['data'][0]['id'] +'" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editEmployee" title="Edit Location"><i class="far fa-edit fa-lg"></i></button></div></div></div>');
            }// end of for loop
        

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // end of ajax call
    
}); // End of search Employee function

/****************************************Department Function *************************************/

$('#departmentBtn').click(function() {
    $('body').css('background', 'url(libs/images/business-image.jpg').css('background-size', 'cover').css('background-attachment', 'fixed').css('width', '100%').css('position', 'absolute').css('top', '0').css('left', '0');
    $('#department').show();
    $('#departDepen').show();
    $('#addDep').show();
    $('#departmentDependency').val('');
    $('#locatDepen').hide();
    $('#employee').hide();
    $('#location').hide();
    $('#searchEmployee').hide();
    $('#addEmp').hide();
    $('#addLoc').hide();
    
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
                '<div class="col mb-4"><div class="card"><i class="fas fa-city fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Department</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['name'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['location'] + '</td></tr></tbody></table><button type="button" value="' + result['data'][i]['id'] + '" class="btn btn-secondary mainButtons" data-bs-toggle="modal" data-bs-target="#deleteDep" title="Delete Location"><i class="far fa-trash-alt fa-lg"></i></button><button type="button" value="'+ result['data'][0]['id'] +'" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editDepartment" title="Edit Location"><i class="far fa-edit fa-lg"></i></button></div></div></div>');
            }; // end of for loop

        }, 
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
        },
    });

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
            name: $('#departmentAdd').val().charAt(0).toUpperCase() + $('#departmentAdd').val().slice(1),
            locationID: $('#departLocAdd').val()
        },
        success: function(result) {
            console.log(result);
            location.reload();
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // End of Ajax call 
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
         
    },// End of success function
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
    },
}); // End of populate delete dropdown

// To delete the chosen department
$('#deleteDepartment').click(function() {
    
    $.ajax({
        url: "libs/php/countPersonnelInDepartment.php",
        type: "GET",
        dataType: "json",
        data: {
            id: $('#delDepartment').val(),
        },
        success: function(result) {
           console.log(result.data); 
            
        if (result['data'][0]['persCount'] == 0) {

            $.ajax({
                url: "libs/php/deleteDepartmentByID.php",
                type: "GET",
                dataType: "json",
                data: {
                    id: $('#delDepartment').val(),
                },
                success: function(result) {
                    console.log(result);
                    location.reload();
                    
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(jqXHR);
                 },
            }); // end of ajax call

            $('#deleteDep').modal('hide');

        } else {
                $('#depDeleteStat').html('You are unable to delete this Department until all the Employees associated with it are deleted!').show();
        } // End of if, else statement

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // end of ajax call
    
});// End of deleteDepartment function

$('#editDep').click(function() {
    $('#editDepartment').modal('show');
});

// populate the Department dropdown in the Edit Department Modal
$.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $.each(result.data, function(i) {
            $('#depToEdit').append($('<option>', {
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
}); // End of dropdown

// populate the Location dropdown in the Edit Department Modal
$.ajax({
    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $.each(result.data, function(i) {
            $('#dep-location').append($('<option>', {
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
});// End of dropdown

// Department Edit 
$('#depToEdit').change(function() {
    //var departmentSelected = $(this).val(); can also be used
    var departmentSelected = $('#depToEdit option:selected').val();
    
    $.ajax({
       url: "libs/php/getDepartmentByID.php",
       type: "GET",
       dataType: "json",
       data: {
               id: departmentSelected,
       },
       success: function(result) {
           console.log(result.data);
           $('#dep-name').val(result['data'][0]['name']);
           $('#dep-location').val(result['data'][0]['locationID']).change();
           
           // Actual Edit of Department to be written here.
           $('#editCurrDepartment').click(function() {
               // if statement can be written here if required, regarding input required.
               $.ajax({
                   url: "libs/php/editDepartment.php",
                   type: "POST",
                   dataType: "json",
                   data: {
                           id: departmentSelected,
                           name: $('#dep-name').val().charAt(0).toUpperCase() + $('#dep-name').val().slice(1),
                           locationID: $('#dep-location').val()
                   },
                   success: function(result) {

                    location.reload();
                       
                   },
                   error: function (jqXHR, textStatus, errorThrown) {
                       console.log(errorThrown);
                       console.log(textStatus);
                       console.log(jqXHR);
                    },
               }); // end of ajax call
           // if statement to end here if required
           });

       },
       error: function (jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           console.log(textStatus);
           console.log(jqXHR);
       },
   })

}); // End of change function

// Populate the dependency dropdown for locations
$.ajax({

    url: "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $.each(result.data, function(i) {
            $('#departmentDependency').append($('<option>', {
            text: result.data[i].name,
            value: result.data[i].id
            }
           ));
        });
        
        $('#departmentDependency').change(function () {
            var departmentDependency = $('#departmentDependency option:selected').val();

            $.ajax({
                url: "libs/php/getDepDependencies.php",
                type: "POST",
                dataType: "json",
                data: {
                        departmentID: departmentDependency,
                },
                success: function(result) {
                    console.log(result.data);

                    $('#departmentDisplay').html('');
                    // For loop to create the cards to display
                    for (let i = 0; i < result.data.length; i++) {
                        $('#departmentDisplay').append(
                        '<div class="col mb-4"><div class="card"><i class="fas fa-address-book fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Employee</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['lastName'] + ', ' + result['data'][i]['firstName'] + '</td></tr><tr><td class="text-center">' + result['data'][i]['email'] + '</td></tr></tbody></table><button type="button" value="' + result['data'][i]['id'] + '" class="btn btn-secondary mainButtons" data-bs-toggle="modal" data-bs-target="#deleteDep" title="Delete Location"><i class="far fa-trash-alt fa-lg"></i></button><button type="button" value="'+ result['data'][0]['id'] +'" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editDepartment" title="Edit Location"><i class="far fa-edit fa-lg"></i></button></div></div></div>');
                    }// end of for loop
                    
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

/************************************** Location Function ****************************************/

$('#locationBtn').click(function() {
    $('body').css('background', 'url(libs/images/world-globe.jpg)').css('background-size', 'cover').css('background-attachment', 'fixed').css('width', '100%').css('position', 'absolute').css('top', '0').css('left', '0');
    $('#location').show();
    $('#locatDepen').show();
    $('#addLoc').show();
    $('#locationDependency').val('');
    $('#departDepen').hide();
    $('#employee').hide();
    $('#department').hide();
    $('#searchEmployee').hide();
    $('#addDep').hide();
    $('#addEmp').hide();

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
                        `<div class="col mb-4">
                        <div class="card">
                        <i class="fas fa-location-arrow fa-4x pt-2 m-auto"></i>
                        <div class="card-body">
                        <h5 class="card-title text-center fw-bold fs-5">Location</h5>
                        <table class="table"><tbody><tr>
                        <td class="text-center">` + result['data'][i]['name'] + `</td>
                        </tr></tbody></table>
                        <button id="delLoc" 
                        onclick="triggerDelLocation()"
                        type="button" 
                        data-value="${result['data'][i]['id']}" 
                        class="btn btn-secondary mainButtons" 
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteLoc" 
                        title="Delete Location">
                        <i class="far fa-trash-alt fa-lg"></i>
                        </button>
                        <button type="button" 
                        data-value="${result['data'][i]['id']}" 
                        class="btn btn-secondary" 
                        data-bs-toggle="modal" 
                        data-bs-target="#editLocation" 
                        title="Edit Location">
                        <i class="far fa-edit fa-lg"></i>
                        </button>
                        </div></div></div>`);
                }// End of loop
        
                }, 
             error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
             },
        });
    
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
            name: $('#locationAdd').val().charAt(0).toUpperCase() + $('#locationAdd').val().slice(1),
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
        
    },// End of success function
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
        console.log(textStatus);
        console.log(jqXHR);
    },
});

function triggerDelLocation () {
    var delLoc = $(this).data('value');
    $.ajax({
        url: "libs/php/getLocationID.php",
        type: "GET",
        dataType: "json",
        data: {
            id: delLoc,
        },
        success: function(result) {
            console.log(result.data);
        
        },
        error: function (jqXHR, textStatus, errorThrown) {
             console.log(errorThrown);
             console.log(textStatus);
             console.log(jqXHR);
        },

     }); // end of ajax call
}

// Delete function
$('#deleteLocation').click(function() {
    var locationSelected = $('#delLocation option:selected').val();
    $.ajax({
        url: "libs/php/countDepartmentsInLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            id: locationSelected,
        },
        success: function(result) {
            console.log(result.data);
            
            if (result['data'][0]['depCount'] == 0) {

                $.ajax({
                    url: "libs/php/deleteLocationById.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        id: $('#delLocation').val(),
                    },
                    
                    success: function(result) {

                    location.reload();
                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                         console.log(errorThrown);
                         console.log(textStatus);
                         console.log(jqXHR);
                    },

                 }); // end of ajax call

                 $('#deleteLoc').modal('hide');

            } else {
                $('#locDeleteStat').html('You are unable to delete this Location until the Departments associated with it are deleted!').show();
            }
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
             console.log(errorThrown);
             console.log(textStatus);
             console.log(jqXHR);
        },
     }); // end of ajax call

});// End of deleteLocation function

// populate the Location dropdown in the Edit Location Modal
$.ajax({
    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $.each(result.data, function(i) {
            $('#locToEdit').append($('<option>', {
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
});// End of dropdown

// Trigger lcoToEdit to be written here

// Location Edit function
$('#locToEdit').change(function() {
    //var locationSelected = $(this).val(); can also be used
    var locationSelected = $('#locToEdit option:selected').val();
    
    $.ajax({
       url: "libs/php/getLocationByID.php",
       type: "GET",
       dataType: "json",
       data: {
               id: locationSelected,
       },
       success: function(result) {
           console.log(result.data);
           $('#loc-name').val(result['data'][0]['name']).change();
           
           // Actual Edit of Location to be written here.
           $('#editCurrLocation').click(function() {
               // If statement can be added here.
               $.ajax({
                   url: "libs/php/editLocation.php",
                   type: "POST",
                   dataType: "json",
                   data: {
                           id: locationSelected,
                           name: $('#loc-name').val().charAt(0).toUpperCase() + $('#loc-name').val().slice(1),
                   },
                   success: function(result) {

                    location.reload();
                       
                   },
                   error: function (jqXHR, textStatus, errorThrown) {
                       console.log(errorThrown);
                       console.log(textStatus);
                       console.log(jqXHR);
                    },
               }); // end of ajax call
           // End of if statement if required.
           });

       },
       error: function (jqXHR, textStatus, errorThrown) {
           console.log(errorThrown);
           console.log(textStatus);
           console.log(jqXHR);
       },
   })

}); // End of change Edit function

// Populate the dependency dropdown for locations
$.ajax({

    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $.each(result.data, function(i) {
            $('#locationDependency').append($('<option>', {
            text: result.data[i].name,
            value: result.data[i].id
            }
           ));
        });
        
        $('#locationDependency').change(function () {
            var locationDependency = $('#locationDependency option:selected').val();

            $.ajax({
                url: "libs/php/getLocDependencies.php",
                type: "POST",
                dataType: "json",
                data: {
                        locationID: locationDependency,
                },
                success: function(result) {
                    console.log(result.data);

                    $('#locationDisplay').html('');
                    // For loop to create the cards to display
                    for (let i = 0; i < result.data.length; i++)   {
                        $('#locationDisplay').append(
                        '<div class="col mb-4"><div class="card"><i class="fas fa-city fa-4x pt-2 m-auto"></i><div class="card-body"><h5 class="card-title text-center fw-bold fs-5">Department</h5><table class="table"><tbody><tr><td class="text-center">' + result['data'][i]['name'] + '</td></tr></tbody></table><button type="button" value="' + result['data'][i]['id'] + '" class="btn btn-secondary mainButtons" data-bs-toggle="modal" data-bs-target="#deleteLoc" title="Delete Location"><i class="far fa-trash-alt fa-lg"></i></button><button type="button" value="'+ result['data'][0]['id'] +'" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editLocation" title="Edit Location"><i class="far fa-edit fa-lg"></i></button></div></div></div>');
                        }; // end of for loop
                    
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

$('.deleteClose').click(function() {

    // Employee
    $('#empFirstName').val('');
    $('#empLastName').val('');
    $('#empJobTitle').val('');
    $('#empEmail').val('');
    $('#empDepartment').val('');
    $('#empList').val('');
    $('#empToEdit').val('');
    $('#emp-firstName').val('');
    $('#emp-lastName').val('');
    $('#emp-jobTitle').val('');
    $('#emp-email').val('');
    $('#emp-department').val('');
    // Department
    $('#departmentAdd').val('');
    $('#departLocAdd').val('');
    $('#depDeleteStat').hide();
    $('#delDepartment').val('');
    $('#depToEdit').val('');
    $('#dep-name').val('');
    $('#dep-location').val('');
    // Location
    $('#delLocation').val('');
    $('#locDeleteStat').hide();
    $('#locationAdd').val('');
    $('#locToEdit').val('');
    $('#loc-name').val('');

});