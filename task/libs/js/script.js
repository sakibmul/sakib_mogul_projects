	// Ocean Info function
	
	$('#btnRun1').click(function() {

		$.ajax({
			url: "libs/php/getOceanInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat:$('#lat').val(),
				lng:$('#lng').val()
			},
			success: function(result) {
	
				console.log(JSON.stringify(result));
	
				if (result.status.name == "ok") {
	
					$('#results').html("Ocean/ Sea Name: " + result['data']['name']);
					$('#results1').html("Geoname ID: " + result['data']['geonameId']);
					$('#results2').html("");
					$('#results3').html("");
					$('#results4').html("");
				}
				

			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				console.log(errorThrown)
				console.log(textStatus)
				console.log(jqXHR)
			}
		}); 
	
	});


	// Weather ICAO Info function

	$('#btnRun2').click(function() {

		$.ajax({
			url: "libs/php/getWeatherICAOInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				ICAO: $('#selIcao').val()
			},
			success: function(result) {
	
				console.log(JSON.stringify(result));
	
				if (result.status.name == "ok") {
	
					$('#results').html("Station Name: " + result['data']['stationName']);
					$('#results1').html("Date and Time: " + result['data']['datetime']);
					$('#results2').html(result['data']['temperature'] + " Degrees Celsius");
					$('#results3').html(result['data']['clouds']);
					$('#results4').html("Humidity: " + result['data']['humidity']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				console.log(errorThrown)
				console.log(textStatus)
				console.log(jqXHR)
			}
		}); 
	
	});


	// Weather Info function

	$('#btnRun3').click(function() {

		$.ajax({
			url: "libs/php/getWeatherInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#selLat').val(),
				lng: $('#selLng').val()
			},
			success: function(result) {
	
				console.log(JSON.stringify(result));
	
				if (result.status.name == "ok") {
	
					$('#results').html(result['data']['temperature'] + " Degrees Celsius");
					$('#results1').html(result['data']['windSpeed'] + " km/h");
					$('#results2').html("Country Code: " + result['data']['countryCode']);
					$('#results3').html(result['data']['clouds']);
					$('#results4').html("Date and Time: " + result['data']['datetime']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
				console.log(errorThrown)
				console.log(textStatus)
				console.log(jqXHR)
			}
		}); 
	
	});