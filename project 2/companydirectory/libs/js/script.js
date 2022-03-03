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
    $('#employee').show();
    $('#searchEmployee').show();
    $('#addEmp').show();
    $('#locationEmployees').show();
    $('#departmentEmployees').show();
    $('#searchEmployeeInp').val('');
    $('#departDepen').hide();
    $('#locatDepen').hide();
    $('#department').hide();
    $('#location').hide();
    $('#addDep').hide();
    $('#addLoc').hide();
    
        // Ajax call to be placed here
        $.ajax({
            url: "libs/php/getAll.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result.data);
    
            // For loop to create the cards to display
            $('#employeeDisplay').html('');
            for (let i = 0; i < result.data.length; i++) {
                $('#employeeDisplay').append(
                `<div class="col mb-4">
                <div class="card">
                <div class="card-body">
                <table class="table">
                <tbody><tr>
                <td class="text-center">` + result['data'][i]['lastName'] + `, ` + result['data'][i]['firstName'] + `</td></tr>
                <tr><td class="text-center">` + result['data'][i]['department'] + `</td></tr>
                <tr><td class="text-center">` + result['data'][i]['location'] + `</td></tr>
                <tr><td class="text-center">` + result['data'][i]['email'] + `</td></tr>
                </tbody></table>
                <button 
                type="button" 
                data-value="${result['data'][i]['id']}" 
                class="btn btn-secondary mainButtons" 
                data-bs-toggle="modal" 
                data-bs-target="#deleteEmp" 
                title="Delete Employee">
                <i class="far fa-trash-alt fa-lg"></i>
                </button>
                <button 
                type="button" 
                data-value="${result['data'][i]['id']}" 
                class="btn btn-secondary" 
                data-bs-toggle="modal" 
                data-bs-target="#editEmployee" 
                title="Edit Employee">
                <i class="far fa-edit fa-lg"></i>
                </button>
                </div></div></div>`);
            }// end of for loop

             // Trigger delete employee drop down
             $('button[data-bs-target="#deleteEmp"]').click(function(){
                console.log($(this).data("value"));
            
                $('#empList').val($(this).data("value")).change();

            });//end of button click function

            // Trigger employee Edit drop down
            $('button[data-bs-target="#editEmployee"]').click(function(){
                console.log($(this).data("value"));
            
                $('#empToEdit').val($(this).data("value")).change();

            });// end of button click function

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
    function populateAddNewEmpDepDrop () {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "POST",
        dataType: "json",
        success: function(result) {
            console.log(result);
        $('#empDepartment').find('option:not(:first)').remove();
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
    });// End of drop down
}
populateAddNewEmpDepDrop();

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
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // End of Ajax call
    }
 });// End of addNewEmployee function

// Populate delete employee dropdown so that it can be deleted from screen 
function populateDeleteEmployeeDrop () {
   $.ajax({
       url: "libs/php/getAllPersonnel.php", 
       type: "POST",
       dataType: "json",
       success: function(result) {
           console.log(result);
           $('#empList').html('');
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
    });// End of drop down
}
populateDeleteEmployeeDrop();

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
            
            $('#empList').html('');
            $('#empToEdit').html('');
            $('#employeeDisplay').html('');
                        
            populateEditEmployeeDrop();
            populateDeleteEmployeeDrop();
            $('#employeeBtn').click();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // end of ajax call
    
}); // End of deleteEmployee function

// Populate the Edit Employee Department dropdown: trigger in empToEdit change function.
function populateEditEmpDepDrop () {
$.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result.data);
        $('#emp-department').html('');
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
}
populateEditEmpDepDrop();

// Populate the edit Employee dropdown
function populateEditEmployeeDrop () {
$.ajax({
    url: "libs/php/getAllPersonnel.php",
    type: "GET",
    dataType: "json",

    success: function(result) {
        console.log(result.data);
        $('#empTpEdit').html('');
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
});// End of drop down
}
populateEditEmployeeDrop();

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
                       
                       $('#empList').html('');
                       $('#empToEdit').html('');
                       $('#employeeDisplay').html('');
                        
                       populateEditEmployeeDrop();
                       populateDeleteEmployeeDrop();
                       $('#employeeBtn').click();
                       
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

// Search bar function, department Employee drop down
function searchEmployeeByDepartment () {
$.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",

    success: function(result) {
        console.log(result.data);
        //$('#').html('');
        $.each(result.data, function(i) {
            $('#departmentEmps').append($('<option>', {
            text: result.data[i].name,
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
});// End of drop down
}// End of function
searchEmployeeByDepartment();

// Location Employee search drop down function
function searchEmployeeByLocation () {
$.ajax({
    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",

    success: function(result) {
        console.log(result.data);
        //$('#').html('');
        $.each(result.data, function(i) {
            $('#locationEmps').append($('<option>', {
            text: result.data[i].name,
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
});// End of drop down
} // End of function
searchEmployeeByLocation();


// Employee Search Box
$('#searchEmployeeBtn').click(function() {
    var searchEmp = $('#searchEmployeeInp').val();
    var dept = $('#departmentEmps').val() || "";
    var loc = $('#locationEmps').val() || "";
    $.ajax({
        url: "libs/php/searchBar.php",
        type: "GET",
        dataType: "json",
        data: {
            searchTerm: searchEmp,
            dept: dept,
            loc: loc,
            
        },
        success: function(result) {
            console.log(result.data);

            $('#employeeDisplay').html('');
            // for loop to create cards
            for (let i = 0; i < result.data.length; i++) {
                $('#employeeDisplay').append(
                `<div class="col mb-4">
                <div class="card">
                <div class="card-body">
                <table class="table">
                <tbody>
                <tr><td class="text-center">` + result['data'][i]['lastName'] + ` , ` + result['data'][i]['firstName'] + `</td></tr>
                <tr><td class="text-center">` + result['data'][i]['department'] + `</td></tr>
                <tr><td class="text-center">` + result['data'][i]['location'] + `</td></tr>
                <tr><td class="text-center">` + result['data'][i]['email'] + `</td></tr>
                </tbody>
                </table>
                <button 
                type="button" 
                data-value="${result['data'][i]['id']}" 
                class="btn btn-secondary mainButtons" 
                data-bs-toggle="modal" 
                data-bs-target="#deleteEmp" 
                title="Delete Employee">
                <i class="far fa-trash-alt fa-lg"></i>
                </button>
                <button type="button" 
                data-value="${result['data'][i]['id']}" 
                class="btn btn-secondary" 
                data-bs-toggle="modal" 
                data-bs-target="#editEmployee" 
                title="Edit Employee">
                <i class="far fa-edit fa-lg"></i>
                </button>
                </div></div></div>`);
            }// end of for loop

            // Trigger delete employee drop down
            $('button[data-bs-target="#deleteEmp"]').click(function(){
                console.log($(this).data("value"));
            
                $('#empList').val($(this).data("value")).change();

            });//end of button click function

            // Trigger employee Edit drop down
            $('button[data-bs-target="#editEmployee"]').click(function(){
                console.log($(this).data("value"));
            
                $('#empToEdit').val($(this).data("value")).change();

            });// end of button click function

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // end of ajax call
    
});// End of search Employee function

/****************************************Department Function *************************************/

$('#departmentBtn').click(function() {
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
    $('#locationEmployees').hide();
    $('#departmentEmployees').hide();
    
    // Ajax call to be placed here
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
    
        success: function(result) {
            console.log(result.data);

        // For loop to create the cards to display
            $('#departmentDisplay').html('');
            for (let i = 0; i < result.data.length; i++)   {
                $('#departmentDisplay').append(
                `<div class="col mb-4">
                <div class="card">
                <div class="card-body">
                <table class="table">
                <tbody><tr>
                <td class="text-center">${result['data'][i]['name']}</td></tr>
                <tr>
                <td class="text-center">${result['data'][i]['location']}</td>
                </tr></tbody></table>
                </div>
                <div class="card-footer">
                <button 
                type="button" 
                data-value="${result['data'][i]['id']}" 
                class="btn btn-secondary mainButtons" 
                data-bs-target="#deleteDep"
                data-bs-toggle="modal" 
                title="Delete Department">
                <i class="far fa-trash-alt fa-lg"></i>
                </button>
                <button type="button" 
                data-value="${result['data'][i]['id']}" 
                class="btn btn-secondary" 
                data-bs-toggle="modal" 
                data-bs-target="#editDepartment" 
                title="Edit Department">
                <i class="far fa-edit fa-lg"></i>
                </button>
                </div></div></div>`);
            }; // end of for loop

             // Trigger delete department drop down
             $('button[data-bs-target="#deleteDep"]').click(function(){
                console.log($(this).data("value"));
                
                var deleteDepartmentSelected = $(this).data("value");

                // To delete the chosen department

                    $.ajax({
                        url: "libs/php/countPersonnelInDepartment.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                            id: deleteDepartmentSelected,
                        },
                        success: function(result) {
                        console.log(result.data); 
                            
                        if (result['data'][0]['persCount'] == 0) {

                            $('#deleteDep').modal('show');

                            $.ajax({
                                url: "libs/php/getDepartmentByID.php",
                                type: "GET",
                                dataType: "json",
                                data: {
                                        id: deleteDepartmentSelected,
                                },
                                success: function(result) {
                                console.log(result.data);
                                $('#depToDelete').val(result['data'][0]['name']).change();

                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log(errorThrown);
                                console.log(textStatus);
                                console.log(jqXHR);
                            },
                            }); // End of department id

                            $('#deleteDepartment').click(function() {
                            $.ajax({
                                url: "libs/php/deleteDepartmentByID.php",
                                type: "GET",
                                dataType: "json",
                                data: {
                                    id: deleteDepartmentSelected,
                                },
                                success: function(result) {
                                    console.log(result);
                                    
                                    $('#departmentDependency').find('option:not(:first)').remove();
                                    $('#empDepartment').find('option:not(:first)').remove();
                                    $('#departmentEmps').find('option:not(:first)').remove();
                                    $('#emp-department').html('');
                                    //$('#delDepartment').html('');
                                    //$('#depToEdit').html('');
                                    $('#departmentDisplay').html('');
                                    
                                    searchEmployeeByDepartment();
                                    populateDepartmentDependency();
                                    populateAddNewEmpDepDrop();
                                    populateEditEmpDepDrop();
                                    //populateEditDepartmentDrop();
                                    //populateDeleteDepartmentDrop();
                                    $('#departmentBtn').click();
                                    
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log(errorThrown);
                                    console.log(textStatus);
                                    console.log(jqXHR);
                                },
                            }); // end of ajax call

                        });// End of deleteDepartment function

                        } else if (result['data'][0]['persCount'] == 1) {

                                $('#departmentUnable').modal('show');
                                $('#depDeleteStat').html('You are unable to delete this Department because there is ' + result['data'][0]['persCount'] + ' Employee based here!');
                        
                        } else {

                            $('#departmentUnable').modal('show');
                            $('#depDeleteStat').html('You are unable to delete this Department because there are ' + result['data'][0]['persCount'] + ' Employees based here!');

                        }

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                            console.log(textStatus);
                            console.log(jqXHR);
                        },
                    }); // end of ajax call
                    
                });//end of button click function

                // Trigger department Edit drop down
                $('button[data-bs-target="#editDepartment"]').click(function(){
                    console.log($(this).data("value"));

                    var editDepartmentSelected = $(this).data("value");
                    
                    $.ajax({
                        url: "libs/php/getDepartmentByID.php",
                        type: "GET",
                        dataType: "json",
                        data: {
                                id: editDepartmentSelected,
                        },
                        success: function(result) {
                            console.log(result.data);
                            $('#dep-name').val(result['data'][0]['name']);
                            $('#dep-location').val(result['data'][0]['locationID']).change();
                            
                            $('#editCurrDepartment').click(function() {
                                
                                $.ajax({
                                    url: "libs/php/editDepartment.php",
                                    type: "POST",
                                    dataType: "json",
                                    data: {
                                            id: editDepartmentSelected,
                                            name: $('#dep-name').val().charAt(0).toUpperCase() + $('#dep-name').val().slice(1),
                                            locationID: $('#dep-location').val()
                                    },
                                    success: function(result) {

                                        $('#departmentDependency').find('option:not(:first)').remove();
                                        $('#empDepartment').find('option:not(:first)').remove();
                                        $('#departmentEmps').find('option:not(:first)').remove();
                                        $('#dep-name').empty();
                                        $('#emp-department').html('');
                                        $('#departmentDisplay').html('');
                                        
                                        searchEmployeeByDepartment();
                                        populateDepartmentDependency();
                                        populateAddNewEmpDepDrop();
                                        populateEditEmpDepDrop();
                                        $('#departmentBtn').click();
                                        
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.log(errorThrown);
                                        console.log(textStatus);
                                        console.log(jqXHR);
                                        },
                                }); // end of ajax call
                            
                            });// End edit current department

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                            console.log(textStatus);
                            console.log(jqXHR);
                        },
                        
                        }); //End of id function

                        });// end of button function

                        }, 
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                            console.log(textStatus);
                            console.log(jqXHR);
                        },

        });

});// End of Department Main Screen function 

// populate the Location dropdown in the Edit Department Modal
function populateLocDropInEditDep () {
    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "POST",
        dataType: "json",
        success: function(result) {
            console.log(result);
            $('#dep-location').find('option:not(:first)').remove();
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
    }
populateLocDropInEditDep();



// Add department click function
$('#addDep').click(function() {
    $('#addDepartment').modal('show');
});

// populate the add new department drop down for specific location
function populateAddNewDepLocDrop () {
$.ajax({
    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
      success: function(result) {
        console.log(result);
        $('#departLocAdd').find('option:not(:first)').remove();
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
}// End of Drop down
populateAddNewDepLocDrop();
     
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
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
            console.log(textStatus);
            console.log(jqXHR);
         },
    }); // End of Ajax call 
    }
 });










// Populate the dependency dropdown for locations
function populateDepartmentDependency () {
$.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $('#departmentDependency').find('option:not(:first)').remove();
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
                        `<div class="col mb-4">
                        <div class="card">
                        <div class="card-body">
                        <table class="table"><tbody>
                        <tr><td class="text-center">` + result['data'][i]['lastName'] + ` , ` + result['data'][i]['firstName'] + `</td></tr>
                        <tr><td class="text-center">` + result['data'][i]['department'] + `</td></tr>
                        <tr><td class="text-center">` + result['data'][i]['location'] + `</td></tr>
                        <tr><td class="text-center">` + result['data'][i]['email'] + `</td></tr>
                        </tbody></table>
                        <button 
                        type="button" 
                        data-value="${result['data'][i]['id']}" 
                        class="btn btn-secondary mainButtons" 
                        data-bs-toggle="modal" 
                        data-bs-target="#deleteEmp" 
                        title="Delete Department">
                        <i class="far fa-trash-alt fa-lg"></i>
                        </button>
                        <button 
                        type="button" 
                        data-value="${result['data'][i]['id']}" 
                        class="btn btn-secondary" 
                        data-bs-toggle="modal" 
                        data-bs-target="#editEmployee" 
                        title="Edit Department">
                        <i class="far fa-edit fa-lg"></i>
                        </button>
                        </div></div></div>`);
                    }// end of for loop

                // Trigger delete Location drop down
                $('button[data-bs-target="#deleteEmp"]').click(function(){
                    console.log($(this).data("value"));
                
                    //$('#empList').val($(this).data("value")).change();

                });//end of button click function

                // Trigger Location Edit drop down
                $('button[data-bs-target="#editEmployee"]').click(function(){
                    console.log($(this).data("value"));
                
                    //$('#empToEdit').val($(this).data("value")).change();

                });// end of button click function
                    
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
}// End of function
populateDepartmentDependency();

/************************************** Location Function ****************************************/

$('#locationBtn').click(function() {
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
    $('#locationEmployees').hide();
    $('#departmentEmployees').hide();
    
        $.ajax({
            url: "libs/php/getAllLocations.php",
            type: "GET",
            dataType: "json",
    
            success: function(result) {
                console.log(result.data);
    
                // For loop to create the cards to display
                $('#locationDisplay').html('');
                for (let i = 0; i < result.data.length; i++) {
                    $('#locationDisplay').append(
                        `<div class="col mb-4">
                        <div class="card">
                        <i class="fas fa-location-arrow fa-3x pt-2 m-auto"></i>
                        <div class="card-body">
                        <table class="table"><tbody><tr>
                        <td class="text-center">${result['data'][i]['name']}</td>
                        </tr></tbody></table>
                        </div>
                        <div class="card-footer">
                        <button
                        type="button" 
                        data-bs-target="#deleteLoc"
                        data-bs-toggle="modal"
                        data-value="${result['data'][i]['id']}" 
                        class="btn btn-secondary mainButtons" 
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
                }// End of for loop

                // Trigger delete Location
                $('button[data-bs-target="#deleteLoc"]').click(function(){
                    console.log($(this).data("value"));

                    // Delete function
                    var deleteLocationSelected = $(this).data("value");
                   // Actual Delete of Location to be written here.
                        $.ajax({
                                url: "libs/php/countDepartmentsInLocation.php",
                                type: "POST",
                                dataType: "json",
                                data: {
                                    id: deleteLocationSelected,
                                },
                                success: function(result) {
                                    console.log(result.data);
                                    
                                    if (result['data'][0]['depCount'] == 0) {
                                        
                                        $('#deleteLoc').modal('show');
                                        
                                        $.ajax({
                                            url: "libs/php/getLocationByID.php",
                                            type: "GET",
                                            dataType: "json",
                                            data: {
                                                    id: deleteLocationSelected,
                                            },
                                            success: function(result) {
                                            console.log(result.data);
                                            $('#locToDelete').val(result['data'][0]['name']).change();

                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            console.log(errorThrown);
                                            console.log(textStatus);
                                            console.log(jqXHR);
                                        },
                                        }); // End of location id
                                        
                                        $('#deleteLocation').click(function () { 
                                        $.ajax({
                                            url: "libs/php/deleteLocationById.php",
                                            type: "GET",
                                            dataType: "json",
                                            data: {
                                                id: deleteLocationSelected,
                                            },
                                            success: function(result) {
    
                                            $('#locationDependency').find('option:not(:first)').remove();
                                            $('#departLocAdd').find('option:not(:first)').remove();
                                            $('#locationEmps').find('option:not(:first)').remove();
                                            //$('#dep-location').html('');
                                            $('#locationDisplay').html('');
                                            
                                            searchEmployeeByLocation();
                                            populateLocationDependency();
                                            populateAddNewDepLocDrop();
                                            //populateLocDropInEditDep();
                                            $('#locationBtn').click();
                                            },
                                            error: function (jqXHR, textStatus, errorThrown) {
                                                console.log(errorThrown);
                                                console.log(textStatus);
                                                console.log(jqXHR);
                                            },
    
                                        }); // end of ajax call
                                    });
                                    
                                    } else if (result['data'][0]['depCount'] == 1) {

                                        $('#locationUnable').modal('show');
                                        $('#locDeleteStat').html('You are unable to delete this Location because there is ' + result['data'][0]['depCount'] + ' department here!');
                                    
                                    } else {

                                        $('#locationUnable').modal('show');
                                        $('#locDeleteStat').html('You are unable to delete this Location because there are ' + result['data'][0]['depCount'] + ' departments here!');

                                    }
                                    
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.log(errorThrown);
                                    console.log(textStatus);
                                    console.log(jqXHR);
                                },
                            }); // end of ajax call
    
                    });// end of Delete button click function

                // button to target Edit modal 
                $('button[data-bs-target="#editLocation"]').click(function(){
                    console.log($(this).data("value"));
                    
                // Location Edit function
                var editLocationSelected = $(this).data("value");
                $.ajax({
                    url: "libs/php/getLocationByID.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                            id: editLocationSelected,
                    },
                    success: function(result) {
                    console.log(result.data);
                    $('#loc-name').val(result['data'][0]['name']).change();
    
                    // Actual Edit of Location to be written here.
                    $('#editCurrLocation').click(function() {
                    
                    $.ajax({
                        url: "libs/php/editLocation.php",
                        type: "POST",
                        dataType: "json",
                        data: {
                                id: editLocationSelected,
                                name: $('#loc-name').val().charAt(0).toUpperCase() + $('#loc-name').val().slice(1),
                        },
                        success: function(result) {
         
                                $('#locationDependency').find('option:not(:first)').remove();
                                $('#departLocAdd').find('option:not(:first)').remove();
                                $('#locationEmps').find('option:not(:first)').remove();
                                //$('#dep-location').find('option:not(:first)').remove();
                                $('#locationDisplay').html('');
   
                                searchEmployeeByLocation();
                                populateLocationDependency();
                                populateAddNewDepLocDrop();
                                //populateLocDropInEditDep();
                                $('#locationBtn').click();
         
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                            console.log(textStatus);
                            console.log(jqXHR);
                        },
                    }); // end of ajax call
                
                });// end of edit current location click function
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
            },
            }); // End of location id


            });// end of Edit button click function
                
            }, 
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(jqXHR);
             },

    });// End of Ajax call Main screen

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

// Populate the dependency dropdown for locations
function populateLocationDependency () {
$.ajax({
    url: "libs/php/getAllLocations.php",
    type: "POST",
    dataType: "json",
    success: function(result) {
        console.log(result);
        $('#locationDependency').find('option:not(:first)').remove();
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
                            `<div class="col mb-4">
                            <div class="card">
                            <div class="card-body">
                            <table class="table"><tbody><tr>
                            <td class="text-center">` + result['data'][i]['name'] + `</td>
                            </tr></tbody></table>
                            <button  
                            type="button" 
                            data-value="${result['data'][i]['id']}" 
                            class="btn btn-secondary mainButtons" 
                            data-bs-toggle="modal" 
                            data-bs-target="#deleteDep" 
                            title="Delete Location">
                            <i class="far fa-trash-alt fa-lg"></i></button>
                            <button 
                            type="button" 
                            data-value="${result['data'][i]['id']}" 
                            class="btn btn-secondary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#editDepartment" 
                            title="Edit Location">
                            <i class="far fa-edit fa-lg"></i>
                            </button>
                            </div></div></div>`);
                        }; // end of for loop

                // Trigger delete department drop down
                $('button[data-bs-target="#deleteDep"]').click(function(){
                    console.log($(this).data("value"));
                
                    //$('#delDepartment').val($(this).data("value")).change();

                });//end of button click function

                // Trigger department Edit drop down
                $('button[data-bs-target="#editDepartment"]').click(function(){
                    console.log($(this).data("value"));
                
                    //$('#depToEdit').val($(this).data("value")).change();

                });// end of button click function
                
                }, 
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown);
                    console.log(textStatus);
                    console.log(jqXHR);
             },
            });// end of ajax

            });
                    
            },// end of success
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(errorThrown);
                console.log(textStatus);
                console.log(jqXHR);
         },
               
});
}// End of Location Dependency
populateLocationDependency();

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
    //$('#depDeleteStat').hide();
    //$('#delDepartment').val('');
    $('#depToEdit').val('');
    $('#dep-name').val('');
    $('#deleteDep').modal('hide');
    
    // Location
    $('#locationAdd').val('');
    $('#loc-name').val('');
    $('#deleteLoc').modal('hide');
    $('#dep-location').find('option:not(:first)').remove();
    populateLocDropInEditDep();
});


