const APIKEY="45fee3b5bae7da96bdecd67a4da73b80";

$(document).ready(function(){
        createSearchList();
    function geo(cityname){
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIKEY}`,
                method: "GET"
            }).then(function(response){
               let lat= response.coord.lat;
               let lon= response.coord.lon;
                console.log(response)
                report(lat, lon, cityname);

            })
    }
    function report(lat, lon, cityname){
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${APIKEY}`,
                method: "GET"
            }).then(function(response){
                let today= moment.unix(response.current.dt).format("MM/DD/YYYY");
                $("#city").html(`${cityname} (${today}) <img src="http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png"/>`);
                $("#humidity").html(`${response.current.humidity}%`);
                $("#temp").html(`${response.current.temp} &deg;F`);
                $("#uv").text(response.current.uvi);
                $("#windspeed").text("Windspeed: " + response.current.wind_speed);
                let icon= response.current.weather[0].icon
                console.log(icon);
            console.log(response);
            createFiveDay(response.daily);


          ///  use response.daily for the next 5. 
            })
    }
    
    $("#searchSubmit").click(function(e){
        e.preventDefault();
        document.getElementById("fiveDay").innerHTML="";
        let value=$("#search").val();
        if (value.length>0){
            geo(value);
            addToLocalStorage(value, Date.now());
        }
    });


    function addToLocalStorage(value, timestamp){
        let ls=JSON.parse(window.localStorage.getItem("usersearch"));
        let object={
            city:value,
            timestamp:timestamp,
        
        }
        console.log(ls);

         if(!ls){
            ls = []; //initializing ls to an empty array.
            ls.push(object); //pushing the object we created above into the empty array.
            window.localStorage.setItem("usersearch", JSON.stringify(ls)); // setting the key "usersearch" in local storage to the stringified version of the array we just created.
             }
             else{
                let flag=false;
                ls.forEach((item, index)=>{
                    if(item.city===value){
                        item.timestamp=Date.now();
                        flag=true; 
                    }
                });
                if(!flag){
                    ls.push(object);
                }
                ls.sort(function(a,b){
                    return b.timestamp-a.timestamp;
                });
                window.localStorage.setItem("usersearch", JSON.stringify(ls));
             }
             createSearchList();

        }
    function createFiveDay(data){
        let container=document.getElementById("fiveDay");
        data.forEach((day, index)=>{
            if(index>0 && index<6){
                let card=document.createElement("div");
                card.classList.add("fivedaycard");
                let date=document.createElement("div");
                date.classList.add("date");
                date.innerHTML=moment(day.dt*1000).format("l");
                //append the date to the card
                card.appendChild(date);
                let image=document.createElement("img");
                image.classList.add("icon");
                image.src=`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
                card.appendChild(image);
                let temp=document.createElement("div");
                temp.classList.add("temp");
                temp.innerHTML=`Temp: ${day.temp.day}&deg;F`;
                card.appendChild(temp);
                let hum=document.createElement("div");
                hum.classList.add("humidity");
                hum.innerHTML=`Humidity: ${day.humidity}%`;
                card.appendChild(hum);
                container.appendChild(card);
            }

        });
    }


    function createSearchList(){
        let container=document.getElementById("searchResults");
        container.innerHTML="";
        let list=JSON.parse(window.localStorage.getItem("usersearch"));
        if (list){
            list.forEach((item, index)=>{
                let button=document.createElement("button");
                button.classList.add("result");
                button.innerText=item.city;
                container.appendChild(button);
            })
        }

    }
    }
)
