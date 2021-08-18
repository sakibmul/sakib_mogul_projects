 // Main Map	
    let myMap = L.map('map').setView([0, 0], 1);
    
    let attribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    let tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

    let tiles = L.tileLayer(tileUrl, {attribution});

    tiles.addTo(myMap);

// Button options L.easyButton plugin
L.easyButton('<strong>i<strong>', function(){ 
   $('#myModal').modal('show');
}).addTo(myMap);  

L.easyButton('fas fa-pound-sign', function(){
   $('#myModal1').modal('show');
}).addTo(myMap);

L.easyButton('fas fa-cloud-sun', function(){
   $('#myModal2').modal('show');
}).addTo(myMap);
 
L.easyButton('fas fa-city', function(){
 
}).addTo(myMap);
 
L.easyButton('fab fa-wikipedia-w', function(){
 
}).addTo(myMap);

// Knowing your location
function onLocationFound(e) {
   L.marker(e.latlng).addTo(myMap).bindPopup("You are here!").openPopup();
   }
   myMap.on('locationfound', onLocationFound);
   myMap.locate({setView: true, maxZoom: 12});
    
// Populating the country select
  $.ajax({
      url: "libs/php/getJsonData.php",
      type: 'GET',
      dataType: 'json',
      success: function (result) {
         $('#countryDropdown').append('<option value="make selection"selected disabled>Select a Country</option>');
         $.each(result.data, function(index) {
            $('#countryDropdown').append($('<option>', {
            text: result.data[index].name,
            value: result.data[index].isoCode
         }));
         });
      },
      error: function (jqXHR, textStatus, errorThrown) {
         console.log(errorThrown);
         console.log(textStatus);
         console.log(jqXHR);
      }
   });

// Country select feature, highlights and flies to the country!
$('#countryDropdown').on('change', function () {
	$.ajax({
		url: "libs/php/getJsonData.php",
		type: "GET",
		dataType: "json",
		success: function (result) {
			$filterFeature = result.data.borders.features.filter(feature => (feature.properties.iso_a3 == $('#countryDropdown').val()));
			$border = L.geoJSON($filterFeature, {
				style: function () {
					return {
						color: '#ba421e'
					};
				}
			}).addTo(myMap);
			myMap.fitBounds($border.getBounds());

      },
         error: function (jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(textStatus);
			console.log(jqXHR);
		},
	});
   // Country info call
   $.ajax({
      url: "libs/php/getCountryInfo.php",
      type: "POST",
      dataType: "json",
      data: {
         country: $('#countryDropdown').val()
      },
      success: function(result) {
   
         console.log(JSON.stringify(result));

         if (result.status.name == "ok")  {
   
         $('#results').html(result['data'][0]['continent']);
         $('#results1').html(result['data'][0]['capital']);
         $('#results2').html(result['data'][0]['languages']);
         $('#results3').html(result['data'][0]['population']);
			$('#results4').html(result['data'][0]['areaInSqKm']);				
         
         }
      },
         error: function(jqXHR, textStatus, errorThrown) {
         console.log(jqXHR);
         console.log(textStatus);
         console.log(errorThrown);
      },
   });
// next ajax call if successful



});

