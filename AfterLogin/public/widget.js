window.onload = function loadHandler() {
    var musicUrl = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=9bc40d0cc8dcf0097fe795aa754292d2",
        chart = $('#chart');
    
    //     Function responsible for retrieving XML data from Last.fm API
    $.get(musicUrl, function(data) {
        chart.append('<h3> CURRENT TOP HITS </h3>');
        $(data).find('track').each(function (index, track) {
            var img = $(track).find('image')[1],
                imgSrc = $(img).text(),
                songTitleObj = $(track).find('name')[0],
                songTitle = $(songTitleObj).text();
                artist = $(track).find('artist').find('name').text();
            
                var hitNumber = index + 1;
            chart.append('<div class="musicContent">');
            var curContent = $('.musicContent')[index];
            $(curContent).append('<div class="hitNumber">' + hitNumber + '</div>');
            $(curContent).append('<div class="trackImg"><img src="' + imgSrc + '" alt="Track Cover">');
            $(curContent).append('<div class="trackDesc">' + songTitle + '<br>' + artist );
            
        });
        
        if ($('.musicContent').length == 0){ chart.append('<div id="musicContentErr">API Service Temporarily Unavailable </div>');} 
    });
    
    
    //     Function responsible for retrieving location and fetching weather data from Open Weather Map API
    function getLocation() {
        var weather = $('#weather');
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showForecast, showError);
            } 
            else { 
                weather.append("Geolocation is not supported by this browser.");
            }
        }


    //Function responsible for retrieving 5-Day forecast
    function showForecast(position) { 
        
    var url = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=10&mode=xml&lat="+ position.coords.latitude + "&lon=" + position.coords.latitude + "&units=metric&APPID=cc2c216f7cdfada676a4b909c0adef24",
        weather = $('#weather');

    $.get(url, function(data) {
        $(data).find('time').each( function(index, time){
            
        if (index >= 1 && index <= 5) {
            var date = time.getAttribute('day'),
                symbolNum = $(data).find('symbol')[index].getAttribute('number'),
                high = $(data).find('temperature')[index].getAttribute('max'),
                low = $(data).find('temperature')[index].getAttribute('min'),
                wind = $(data).find('windSpeed')[index].getAttribute('name'),
                clouds = $(data).find('clouds')[index].getAttribute('value');
            
            if (symbolNum < 200) {
                symbol = '<img src=images/NA.png />'
            }
            else {
                symbol = '<img src=images/' + symbolNum.toString() + '.png />'
            }
            
            weather.append('<div class="col-md-1 col-lg-1 col-xs-1 forecast">High: ' + Math.round(high) + '&deg; C </br><div class="forecastSym">' + symbol + '</div></br>Low: ' + Math.round(low) + '&deg; C </br>' +  date.substr(5) + '</div>');
        }
        });
    });
    
    showWeather(position.coords.latitude,position.coords.longitude);
    
}

    function showWeather(lat, lon) {

    var url = "http://api.openweathermap.org/data/2.5/weather?lat="+ lat + "&lon=" + lon + "&units=metric&APPID=cc2c216f7cdfada676a4b909c0adef24";
    
    $.get(url, function(data) {
        var weather = $('#weather'),
            temp = data.main.temp,
            low = data.main.temp_min,
            high = data.main.temp_max,
            desc = data.weather,
            windDir = data.wind.deg,
            windSpd = data.wind.speed,
            Press = data.main.pressure,
            humid = data.main.humidity;    
            
        
        weather.prepend('<div id="location" class="col-md-2 col-xs-2 col-lg-2">' + data.name.toUpperCase() + '</br>' + desc[0].description + '</div>');
        $('<div id="curWeather" class="col-md-3 col-lg-3 col-xs-3"></div>').appendTo('#weather');
        
        curWeather = $('#curWeather');
        
        curWeather.append('Temperature: ' + Math.round(temp) + '&deg; C </br>' + 'Low: ' + Math.round(low) + '&deg; C  ' + 'High: ' + Math.round(high) + '&deg; C </br>' + 'Wind: ');
        
        if(windDir == null)
            {
               windDir = '-';
            }
        
       curWeather.append( windSpd + 'm/s ' + windDir + '&deg;</br> Pressure: ' + Press + 'mB</br>Humidity: ' + humid + '%');
    });

}
    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
        }

    }
    getLocation();
    
    $('#addBtn').click(function() {
        if ($('#addToList').css('visibility') == 'visible' ){
            $('#addToList').css('visibility','hidden');
        }
            
        else {
            $('#addToList').css('visibility','visible');
        }
        
    });
    
    $('input[name=completed]').change( function () {
        $(this).parent().submit();
        
    });
}
