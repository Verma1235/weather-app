
$(document).ready(function () {



    let weather_img = {
        cloudy: "weather.img/cloudy.png",
        cold: "weather.img/cold.png",
        rain: "weather.img/rain.png",
        storm: "weather.img/storm.png",
        sun: "weather.img/sun.png"
    }
        ;

    // ################################################  DOM REFERENCE ###########################################

    let img = $("#weather_img"); //img's card  bg
    let settemp = $("#temp");
    let setcity = $(".city");
    let setWindSpeed = $("#windSpeed");
    let DayN = $("#dayNeight");




    // ###################################### img acc ###################################################
    function setimg(imgname) {
        img.attr('src', weather_img[imgname]);

    }

    // ######################################## error handling ##############################################

    function errorHandel(msg) {
        img.hide();
        $(".datacont").hide();
        settemp.hide();
        setcity.hide();
        $("#msg").html(msg);
        $("#inputSearch").val("");
    }
    function reView() {
        img.show();
        $(".datacont").show();
        settemp.show();
        setcity.show();
        $("#msg").html("");
    }

    // map weathercode to short description (Open-Meteo weathercode)
    // function weatherCodeToText(code) {
    //     // simplified mapping for common codes
    //     const map = {
    //         0: "Clear sky",
    //         1: "Mainly clear",
    //         2: "Partly cloudy",
    //         3: "Overcast",
    //         45: "Fog",
    //         48: "Depositing rime fog",
    //         51: "Light drizzle",
    //         53: "Moderate drizzle",
    //         55: "Dense drizzle",
    //         61: "Slight rain",
    //         63: "Moderate rain",
    //         65: "Heavy rain",
    //         71: "Slight snow",
    //         73: "Moderate snow",
    //         75: "Heavy snow",
    //         80: "Slight rain showers",
    //         81: "Moderate rain showers",
    //         95: "Thunderstorm"
    //     };
    //     return map[code] || "Weather code " + code;
    // }

    // ######################################### weather code to text ###################################################

    function weatherCode(code) {
        // simplified mapping for common codes
        switch (code) {
            case 0: setimg("sun")
                break;
            case 1: setimg("sun")
                break;
            case 2: setimg("cloudy")
                break;
            case 3: setimg("cloudy")
                break;
            case 45: setimg("cold")
                break;
            case 48: setimg("cold")
                break;
            case 51: setimg("sun")
                break;                       //"Light drizzle",
            case 53: "Moderate drizzle"
                break;
            case 55: "Dense drizzle"
                break;
            case 61: setimg("rain")
                break;                      //"Slight rain",
            case 63: setimg("rain")
                break;                      //"Moderate rain",
            case 65: setimg("rain")
                break;                      //"Heavy rain",
            case 71: "Slight snow"
                break;
            case 73: "Moderate snow"
                break;
            case 75: "Heavy snow"
                break;
            case 80: setimg("storm")
                break;
            case 81: setimg("storm")
                break;
            case 95: setimg("storm")
                break;
            default: setimg("sun");
        };

        // map[code];
        // return map[code] || "Weather code " + code;
    }




    // #################################################### API FETCH WEATHER DATA ########################################################

    async function searcByCityNAme(cityName = 'Mumbai') {
        let createUrlWithCity = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
        try {

            let fetchedData = await fetch(createUrlWithCity);
            let data = await fetchedData.json();
            let city = data.results[0];

            console.log(city);
            // let ImpData = [{
            //     lon: city.latitude,
            //     lat: city.latitude,
            //     cityNAme: city.name,
            //     country: city.country
            // }];


            data ? setcity.html(city.name) : setcity.html("City name not exist");

            FetchWeather(city.latitude, city.latitude);


        } catch {
            console.warn("Api1 error !!");
            errorHandel(`${cityName} City Name is not valid !!`);
        }
    }



    // *********************************  weather Api fetch acc to lon and lat ***********************************

    async function FetchWeather(latitude, longitude) {
        let url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current_weather=true`;
        try {
            let response = await fetch(url);
            let getdata = await response.json();

            console.log(getdata.current_weather);

            function dn() {
                if (getdata.current_weather.is_day) 
                {
                    
                    return "Day";
                }
                else {
                    $("body").css({background:"black"});
                    return "Night";
                }
            }

            // alert("data fetched");
            getdata ? (settemp.html(`${getdata.current_weather.temperature}°C`)) : settemp.html("0°C");
            getdata ? (setWindSpeed.html(`${Math.round(getdata.current_weather.windspeed)} km/h`)) : (setWindSpeed.html(` 0 km/h`));
            getdata ? weatherCode(getdata.current_weather.weathercode) : weatherCodeToText(1);
            getdata ? DayN.html(dn()) : DayN.html("...");
            // getdata ? setcity.html(getdata.current_weather.name) : setcity.html("City name not exist");

            try {
                let now = getdata.current_weather.time; // e.g. "2025-10-24T15:30"
                let index = getdata.hourly.time.indexOf(now);
                let humidity = index !== -1 ? data.hourly.relativehumidity_2m[index] : null;
                console.log("Humidity:", humidity, "%");
            } catch {
                console.log("unable to get humidity data");
            }


        } catch {
            console.warn("Api2 error !!");
            errorHandel(`May be your internet is slow (Api error) !!`);

        }
    }
    // ****************************** end ************************************************








    // form click submit listiner
    $("#formSrc").on("submit", (e) => {
        e.preventDefault();
        reView();
        // errorHandel("work")

        let inputObj = $("#inputSearch").val();
        let inptdata = inputObj.trim();

        if (inptdata != "") {

            searcByCityNAme(inptdata);

        } else {
            alert("Enter correct city name...");
        }



    });


    // current location 

    $(document).ready(function () {

        function getCurrentCity(callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async function (position) {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        console.log("Lat:", lat, "Lon:", lon);

                        try {
                            // Open-Meteo Reverse Geocoding API
                            const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`;
                            const res = await fetch(url);
                            const data = await res.json();

                            if (data.results && data.results.length > 0) {
                                const city = data.results[0].name;
                                console.log("City:", city);
                                if (callback) callback(city, lat, lon);
                            } else {
                                console.warn("City not found");
                            }
                        } catch (err) {
                            console.error("Reverse geocoding error:", err);
                        }
                    },
                    function (error) {
                        console.error("Geolocation error:", error.message);
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        }

        // Example usage: get current city and fetch weather
        getCurrentCity(function (cityName, lat, lon) {
            setcity.html(cityName); // display city name
            FetchWeather(lat, lon);  // your weather function
        });

    });



});
