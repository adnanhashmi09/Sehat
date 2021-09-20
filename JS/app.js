var url = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php";
var countriesURL = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php";
var infoCards = document.querySelectorAll('.info');
var tableUrl = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php";

/*-------------------------------------------*/
/*  FETCHING LATEST INFORMATION  */
/*-------------------------------------------*/

function fetchStats(){
    Promise.all([
        fetch(url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "c30dadb445msh8bd05b1076c275bp10ca83jsnc0826eb2e2b7"
        }
        }),
        fetch(countriesURL, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "c30dadb445msh8bd05b1076c275bp10ca83jsnc0826eb2e2b7"
        }
        })
    ]).then(responses=>{
        Promise.all(responses.map(response=> response.json()))
        .then(data=>{
            infoCards.forEach((cards,index)=>{
                var type = cards.dataset.type;
                if(index!==3){
                    cards.querySelector('h2').innerHTML = `${data[0][type]}`;
                }else if(index===3){
                    cards.querySelector('h2').innerHTML = `${data[0][type]}`;
                }
            })

        })
        .catch(err=>{
            alert(err)
        })
    });

    var statsArr=[];

    fetch(tableUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "c30dadb445msh8bd05b1076c275bp10ca83jsnc0826eb2e2b7"
        }
    })
    .then(res=>{
        if(!res.ok){
            throw Error("There is some problem with the request");
        }
        return res.json()
    })
    .then(data=>{
        //console.log("hello")
        for(let i=0;i<data.countries_stat.length;i++){
            statsArr.push(data.countries_stat[i])
        }
        insertHTML();


    })
    .catch(err=>{
        alert(err+ ". Failed to get the data from the server")
    })


    var sortIcons = document.querySelectorAll('ion-icon[name="swap-vertical-outline"]');
    var checkAsc = {
        country_name:{
            a : 1,
            b: -1
        },
        cases:{
            a : 1,
            b: -1
        },
        total_recovered:{
            a : 1,
            b: -1
        },
        active_cases:{
            a : 1,
            b: -1
        },
        deaths:{
            a : 1,
            b: -1
        },
        
    };
    sortIcons.forEach(icon=>{
        icon.addEventListener('click',()=>{
            let data = icon.dataset.sort;
            statsArr.forEach(el=>{
                el.cases=el.cases.replace(/,/g , "");
                el.cases = parseInt(el.cases);
                el.total_recovered=el.total_recovered.replace(/,/g , "");
                el.total_recovered = parseInt(el.total_recovered);
                el.active_cases=el.active_cases.replace(/,/g , "");
                el.active_cases = parseInt(el.active_cases);
                el.deaths=el.deaths.replace(/,/g , "");
                el.deaths = parseInt(el.deaths);
            })
            statsArr.sort((a,b)=>{  
                if(a[data] < b[data] ) { 
                    return checkAsc[data].a
                }
                if(a[data]  > b[data] ) { 
                    return checkAsc[data].b
                    }
                return 0;
            });
            statsArr.forEach(el=>{
                el.cases = el.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                el.total_recovered = el.total_recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                el.active_cases = el.active_cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                el.deaths = el.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            })     
            var table= document.querySelector('.table');
            table.innerHTML="";
            insertHTML();
            checkAsc[data].a *=(-1);
            checkAsc[data].b *=(-1);
           
        });
    });

    var locationData;

    function flyMap(country){
        //console.log(locationData)
        // locationData.forEach(el=>{
        //     if(el.country == country){
        //         mymap.flyTo([el.coordinates.latitude, el.coordinates.longitude])
        //         console.log(el.coordinates.latitude )
        //         console.log(el.coordinates.longitude )
        //         return
        //     }
        // })

        for(let i=0;i<locationData.length;i++){
            if(locationData[i].country === country){
                if(country === "United Kingdom"){
                    mymap.flyTo(["55.3781","-3.4360000000000004"],7)
                    break;
                }else{
                    mymap.flyTo([locationData[i].coordinates.latitude,locationData[i].coordinates.longitude],7)
                    // console.log(locationData[i].coordinates.latitude )
                    // console.log(locationData[i].coordinates.longitude )
                    break;
                }
                
            }
        }

    }

    function insertHTML(){
        for(let i=0;i<statsArr.length;i++){
            var table= document.querySelector('.table');
            var increase = `+${statsArr[i].new_cases}`;
            if(increase ==0){
                increase = "";
            }
            var newHtml = `<div data-id="${i}" class="row values">
            <div class="row-cell"><h5 data-field="country">${statsArr[i].country_name}</h5></div><div class="row-cell"><h5 data-field="total">${statsArr[i].cases}</h5><span class="increase">${increase}</span></div><div class="row-cell"><h5 data-field="recovered">${statsArr[i].total_recovered}</h5></div><div class="row-cell"><h5 data-field="active">${statsArr[i].active_cases}</h5></div><div class="row-cell"><h5 data-field="deaths">${statsArr[i].deaths}</h5></div></div>`;
            table.insertAdjacentHTML('beforeend',newHtml);
            let rows = document.querySelectorAll('.values');
            rows.forEach((row)=>{
                row.addEventListener('click',()=>{
                    
                    var id = row.dataset.id;
                    for(let i=0;i<rows.length;i++){
                        if(rows[i].dataset.id==id){
                            rows[i].classList.add('active-row')
                        }else{
                            rows[i].classList.remove('active-row')
                        }
                    }
                })
            })
        }

        let rows = document.querySelectorAll(".values");

        rows.forEach(row=>{
            row.addEventListener("click",()=>{
                var country = row.querySelector('h5[data-field="country"]').innerHTML;
                if(country=="USA"){
                    country="US"
                }else if(country=="UK"){
                    country="United Kingdom"
                }else if(country=="UAE"){
                    country = "United Arab Emirates"
                }
                else if(country=="S. Korea"){
                    country = "Korea, South"
                }
                document.querySelector('h3[data-graph="country"]').innerHTML = `${country}`;
                getCountryWise(country);
                    
                flyMap(country);
                document.querySelector('.marker_info').classList.remove('hide');
                let markerInfoHeading = document.querySelector('.marker_info_heading');
                let htmlHeading = `${country}<ion-icon name="close"></ion-icon>`;
                markerInfoHeading.innerHTML = `${htmlHeading}`
                document.querySelector('ion-icon[name="close"]').addEventListener('click', ()=>{
                    document.querySelector('.marker_info').classList.add('hide');
                 })
                
                var fields= document.querySelectorAll('.marker_info_body-item');
                fields[0].innerHTML =`Confirmed : ${row.querySelector('h5[data-field="total"]').innerHTML}`;
                fields[1].innerHTML =`Deaths : ${row.querySelector('h5[data-field="deaths"]').innerHTML}`;
                fields[2].innerHTML =`Recovered : ${row.querySelector('h5[data-field="recovered"]').innerHTML}`;

                
            })
        })

        
    }

    var global = {
        type: 'line',
        gui:{
            contextMenu:{
                button:{
                    visible:false
                }
            }
        },
        "crosshair-x": {
            lineColor: "#5fc5ba",
                lineStyle: "dashed",
                lineWidth: 2,
                alpha:0.5,
            'plot-label': {
                'font-size': 12,
                'border-width': 0,
                'border-radius':"10px",
                'background-color': "white",
                padding: "10%",
                callout: false
              },
              scaleLabel: { //label associated to scaleX index
                bold: true,
                backgroundColor: "#5fc5ba",
                borderRadius: 5,
                fontColor: "#fff",
                fontSize: "14px",
                callout: true,
                paddingTop: 2
              },
        },
        globals:{   
            alpha:1,
            fontFamily:"Raleway"
          },
        "background-color":"#f5f5f5",
        "legend": {
            "layout": "float",
            "background-color": "none",
            "border-width": 0,
            "shadow": 0,
            "align": "center",
            "adjust-layout": true,
            "toggle-action": "hide",
            "vertical-align":"bottom",      
            marker:{
                type:"circle"
            },
            "item": {
              "padding": 0,
              "marginRight": 17,
              "cursor": "hand",
              "font-weight":"600",
              "font-size":12
             
            }
          },
        title: {
          text: '',
          fontSize: 24,
          color: '#5d7d9a'
        },
       
        scaleX: {
          // set scale label
          label: {
            text: ''
          },
          // convert text on scale indices
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        scaleY: {
          // scale label with unicode character
          label: {
            text: ''
          },
          multiplier:"true",
          placement:"opposite",
          progression:"lin",
          guide:{
              visible:false
          }
        },
        plot: {
        //   animation: {
        //     effect: 1,
        //     method: 0,
        //     sequence: 2,
        //     speed: "100",
        //   },
        "line-width":5 ,

          "tooltip":{
              visible:"false"
          }
        },
        series: [{
            // plot 1 values, linear data
            values: [],
            text: 'Confirmed',
            backgroundColor: '#334d4d',
            "legend-marker":{
                "background-color":"#334d4d",
                "border-color":"#334d4d"
            },
            "line-color":'#334d4d',//#609595
            "marker": {
                "background-color": "#334d4d",
                "border-width": 1,
                "shadow": 0,
                "border-color": "#334d4d",
                alpha:0
              },
          },
          {
            // plot 2 values, linear data
            values: [],
            text: 'Deaths',
            backgroundColor: '#ff6b6b',
            "line-color":'#ff6b6b',
            "legend-marker":{
                "background-color":"#ff6b6b",
                "border-color":"#ff6b6b"
            },
            "marker": {
                "background-color": "#ff6b6b",
                "border-width": 1,
                "shadow": 0,
                "border-color": "#ff6b6b",
                alpha:0
              },
          },

          {
            // plot 2 values, linear data
            values: [],
            text: 'Recovered',
            backgroundColor: '#5fc5ba',
            "line-color":'#5fc5ba',
            "legend-marker":{
                "background-color":"#5fc5ba",
                "border-color":"#5fc5ba"
            },
            "marker": {
                "background-color": "#5fc5ba",
                "border-width": 1,
                "shadow": 0,
                "border-color": "#5fc5ba",
                alpha:0
              },
            
          }
        ]
      };

    function renderGraphGlobal(){
          // render chart with width and height to
          // fill the parent container CSS dimensions
          zingchart.render({
            id: 'global',
            data: global,
            height: '100%',
            width: '100%'
          });
    
    }

    var countryWise = {
        type: 'line',
        gui:{
            contextMenu:{
                button:{
                    visible:false
                }
            }
        },
        "crosshair-x": {
            lineColor: "#5fc5ba",
                lineStyle: "dashed",
                lineWidth: 2,
                alpha:0.5,
            'plot-label': {
                'font-size': 12,
                'border-width': 0,
                'border-radius':"10px",
                'background-color': "white",
                padding: "10%",
                callout: false
              },
              scaleLabel: { //label associated to scaleX index
                bold: true,
                backgroundColor: "#5fc5ba",
                borderRadius: 5,
                fontColor: "#fff",
                fontSize: "14px",
                callout: true,
                paddingTop: 2
              },
        },
        globals:{   
            alpha:1,
            fontFamily:"Raleway"
          },
        "background-color":"#f5f5f5",
        "legend": {
            "layout": "float",
            "background-color": "none",
            "border-width": 0,
            "shadow": 0,
            "align": "center",
            "adjust-layout": true,
            "toggle-action": "hide",
            "vertical-align":"bottom",      
            marker:{
                type:"circle"
            },
            "item": {
              "padding": 0,
              "marginRight": 17,
              "cursor": "hand",
              "font-weight":"600",
              "font-size":12
             
            }
          },
        title: {
          text: '',
          fontSize: 24,
          color: '#5d7d9a'
        },
       
        scaleX: {
          // set scale label
          label: {
            text: ''
          },
          // convert text on scale indices
          labels: []
        },
        scaleY: {
          // scale label with unicode character
          label: {
            text: ''
          },
          multiplier:"true",
          placement:"opposite",
          progression:"lin",
          guide:{
              visible:false
          }
        },
        plot: {
        //   animation: {
        //     effect: 1,
        //     method: 0,
        //     sequence: 2,
        //     speed: "100",
        //   },
        "line-width":5 ,

          "tooltip":{
              visible:"false"
          }
        },
        series: [{
            // plot 1 values, linear data
            values: [],
            text: 'Confirmed',
            backgroundColor: '#334d4d',
            "legend-marker":{
                "background-color":"#334d4d",
                "border-color":"#334d4d"
            },
            "line-color":'#334d4d',//#609595
            "marker": {
                "background-color": "#334d4d",
                "border-width": 1,
                "shadow": 0,
                "border-color": "#334d4d",
                alpha:0
              },
          },
          {
            // plot 2 values, linear data
            values: [],
            text: 'Deaths',
            backgroundColor: '#ff6b6b',
            "line-color":'#ff6b6b',
            "legend-marker":{   
                "background-color":"#ff6b6b",
                "border-color":"#ff6b6b"
            },
            "marker": {
                "background-color": "#ff6b6b",
                "border-width": 1,
                "shadow": 0,
                "border-color": "#ff6b6b",
                alpha:0
              },
          },

          {
            // plot 2 values, linear data
            values: [],
            text: 'Recovered',
            backgroundColor: '#5fc5ba',
            "line-color":'#5fc5ba',
            "legend-marker":{
                "background-color":"#5fc5ba",
                "border-color":"#5fc5ba"
            },
            "marker": {
                "background-color": "#5fc5ba",
                "border-width": 1,
                "shadow": 0,
                "border-color": "#5fc5ba",
                alpha:0
              },
            
          }
        ]
      };

      function renderGraphCountryWise(){
        // render chart with width and height to
        // fill the parent container CSS dimensions
        zingchart.render({
          id: 'country',
          data: countryWise,
          height: '100%',
          width: '100%'
        });
  
  }

  renderGraphCountryWise();

    
    function convertDate(date){
        var dateR = new Date(`'${date}'`);
        var string = dateR.toDateString()
        var arr = string.split(' ');
        arr.pop();
        arr.splice(0,1);
        var str = arr.join(" ");
        return str;
      }
      var dateArr = [];
      var confirmedArr = [];
      var deathsArr = [];
      var recoveredArr = [];

    function getWorldGraphStats(){
        fetch("https://pkgstore.datahub.io/core/covid-19/worldwide-aggregated_json/data/42cc2ec500aac9c9d9f4e24051ff585a/worldwide-aggregated_json.json")
        .then(res=>{
        return res.json();
        })
        .then(data=>{
            //console.log(data);
            data.forEach(el=>{
                dateArr.push(convertDate(el.Date));
                confirmedArr.push(el.Confirmed);
                deathsArr.push(el.Deaths);
                recoveredArr.push(el.Recovered);
            })

            global.series[0].values = confirmedArr;
            global.series[1].values = deathsArr;
            global.series[2].values = recoveredArr;
            global.scaleX.labels = dateArr;

            renderGraphGlobal();

        })
    }

    

    getWorldGraphStats();
    var dateArrC = [];
    var confirmedArrC = [];
    var deathsArrC = [];
    var recoveredArrC = [];


    function getCountryWise(country){
        dateArrC = [];
        confirmedArrC = [];
        deathsArrC = [];
        recoveredArrC = [];
        fetch("https://pkgstore.datahub.io/core/covid-19/countries-aggregated_json/data/7a2f399433b75b89bfd27ad802a3e850/countries-aggregated_json.json")
        .then(res=>{
            return res.json()
        })
        .then(data=>{
            data.forEach(el=>{
                if(el.Country == country){
                    dateArrC.push(convertDate(el.Date));
                    confirmedArrC.push(el.Confirmed)
                    recoveredArrC.push(el.Recovered);
                    deathsArrC.push(el.Deaths);
                }
            })
            if(dateArrC.length==0){
                countryWise.globals.alpha = 0.0;
                renderGraphCountryWise();
                document.querySelector('p.error').style.display = "block";

            }else if(dateArrC.length!==0){
                countryWise.globals.alpha = 1;
                countryWise.scaleX.labels = dateArrC;
                countryWise.series[0].values = confirmedArrC;
                countryWise.series[1].values = deathsArrC;
                countryWise.series[2].values = recoveredArrC;
                renderGraphCountryWise();
                document.querySelector('p.error').style.display = "none";



            }
            
            

        })
    }

    getCountryWise("India");

    


    let graphType = {
        "global":{
            index : -1,
            "1" : "lin",
            "-1" : "log",
            render : function(){
                renderGraphGlobal();
            }
        },
        "countryWise":{
            index : -1,
            "1" : "lin",
            "-1" : "log",
            render: function(){
                renderGraphCountryWise();
            }
        }
    }

    document.querySelector(".circle").addEventListener("click", () => {
        document.querySelector(".circle").classList.toggle("toggle");
        });

        document.querySelectorAll(".circle-log").forEach(btn=>{
            btn.addEventListener("click",()=>{
                btn.classList.toggle("toggle-log");
                btn.parentElement.classList.toggle("active");
               eval(btn.parentElement.parentElement.parentElement.className).scaleY.progression = graphType[btn.parentElement.parentElement.parentElement.className][graphType[btn.parentElement.parentElement.parentElement.className].index];
               graphType[btn.parentElement.parentElement.parentElement.className].index *= -1;
               graphType[btn.parentElement.parentElement.parentElement.className].render();
            })
        })


        /*-------------------------------------------- */
        /*--------------------MAP--------------------- */
        /*-------------------------------------------- */


        var mymap = L.map('map',{
            center: [21,78],
            zoom: 5,
            worldCopyJump:true,
            inertia:true
        });
        
        L.tileLayer('https://api.mapbox.com/styles/v1/abraxaslucifuge/ck98olzdf036o1io0341wvp30/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWJyYXhhc2x1Y2lmdWdlIiwiYSI6ImNrOThqeXNuZjAybnYzbW15eDQxZzhsdHEifQ.tFD5Ftxa4pm94j_CEkQHeQ', {
            maxZoom: 18,
            minZoom:1,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(mymap);
        
        document.querySelector('.legendBtn').addEventListener('click',()=>{
            document.querySelector('.legend_info_box').classList.toggle('show')
        })
        
        function addMarkers(dataSet,confirmed){
            dataSet.forEach(el => {
                var fillColor;
                if(el.latest.confirmed > 0 && el.latest.confirmed<=8000){
                    fillColor ="#5fc599";
                }else if(el.latest.confirmed > 8000 && el.latest.confirmed<=25000){
                    fillColor ="#5fc5ba";
                }else if(el.latest.confirmed > 25000 && el.latest.confirmed<=100000){
                    fillColor ="#ff9c6b";
                }else if(el.latest.confirmed > 100000){
                    fillColor ="#ff6b6b";
                }
                var circle = L.circleMarker([el.coordinates.latitude, el.coordinates.longitude], {
                    color: 'red',
                    fillColor: fillColor,
                    fillOpacity: 0.5,
                    radius: 10 ,
                    stroke:false
                }).on('click',(e)=>{
                    //mymap.flyTo([21,78],9)
                    
                    let country;
                    var provinceC ="";
                    for(let i=0;i<dataSet.length;i++){
                        if(e.latlng.lng == dataSet[i].coordinates.longitude && e.latlng.lat == dataSet[i].coordinates.latitude){
                            //console.log(dataSet[i])
                            country = dataSet[i].country;
                            document.querySelector('h3[data-graph="country"]').innerHTML = `${country}`;

                            getCountryWise(country);
                            if(dataSet[i].province!=""){
                                provinceC = `${dataSet[i].province}`;
                            }
                        }

                        if(country=="US"){
                            country="USA"
                        }else if(country=="United Kingdom"){
                            country="UK"
                        }else if(country=="United Arab Emirates"){
                            country = "UAE"
                        }
                        else if(country=="Korea, South"){
                            country = "S. Korea"
                        }

                        document.querySelector('.marker_info').classList.remove('hide');
                        let markerInfoHeading = document.querySelector('.marker_info_heading');
                        let htmlHeading = `${country}<br><span style="font-weight:600;font-size:1.3rem">${provinceC}</span><ion-icon name="close"></ion-icon>`;
                        markerInfoHeading.innerHTML = `${htmlHeading}`
                        document.querySelector('ion-icon[name="close"]').addEventListener('click', ()=>{
                            document.querySelector('.marker_info').classList.add('hide');
                        })
                    }

                    statsArr.forEach(el=>{
                        var fields= document.querySelectorAll('.marker_info_body-item');
                        if(el.country_name == country){
                            for(let i=0; i<dataSet.length;i++){
                                if(e.latlng.lng == dataSet[i].coordinates.longitude && e.latlng.lat == dataSet[i].coordinates.latitude){
                                        if(dataSet[i].province!=""){
                                            fields[0].innerHTML =`Confirmed : ${dataSet[i].latest.confirmed}`;
                                            fields[1].innerHTML =`Deaths : ${dataSet[i].latest.deaths}`;
                                            fields[2].innerHTML =`Recovered : N/A`;
                                        }else{
                                            fields[0].innerHTML =`Confirmed : ${el.cases}`;
                                            fields[1].innerHTML =`Deaths : ${el.deaths}`;
                                            fields[2].innerHTML =`Recovered : ${el.total_recovered}`;
                                        }
                                    }
                                }
                            
                        }
                    })
                }).addTo(mymap);
        
            });
        }
        
        
        var data;
        
        function getDataFromLocalStorage(){
            var dataStringified = localStorage.getItem('data');
            return JSON.parse(dataStringified) || null;
        }
        
        data = getDataFromLocalStorage();
         function areDataOutdated(receivedAt){
             if(!receivedAt|| isNaN(Date.parse(receivedAt))){
                 return true
             }
        
             var checkDate = new Date(new Date().getTime() -(60*60*1000*4));
             return new Date(receivedAt).getTime() < checkDate.getTime();
         }
        
         if(!data || areDataOutdated(data && data.receivedAt)){
             fetch("https://coronavirus-tracker-api.herokuapp.com/v2/locations")
             .then(res=>{
                 return res.json();
             })
             .then(data=>{
                 if(data.locations.length!==0){
                    //console.log(data)
                    localStorage.setItem('data',JSON.stringify({response:data,receivedAt:new Date()}))
                    console.log('getting data from api using fetch')
                    addMarkers(JSON.parse(localStorage.getItem('data')).response.locations)
                    locationData = JSON.parse(localStorage.getItem('data')).response.locations;
                 }else{
                    document.querySelector('.map').classList.add('errMap');
                    document.querySelector('.errApiMsg').style.display="block";
                 }
        
             })
             .catch(err=>{
                 console.log(err);
                 document.querySelector('.map').classList.add('errMap');
                 document.querySelector('.errApiMsg').style.display="block";
             })
         }else{
             //console.log(JSON.parse(localStorage.getItem('data')))
             addMarkers(JSON.parse(localStorage.getItem('data')).response.locations,JSON.parse(localStorage.getItem('data')).response.latest.confirmed)
             locationData = JSON.parse(localStorage.getItem('data')).response.locations;

         }
        
         
        



    
}

var popularNewsURL = "https://newsapi.org/v2/top-headlines?q=covid&sortBy=popularity&pageSize=10&language=en&apiKey=06d643609e7e4d3da735fb808ca1df76";

/*-------------------------------------------*/
/*  FETCHING NEWS FROM NEWSAPI */
/*-------------------------------------------*/
function getNews(){
    fetch(popularNewsURL)
    .then(res=>{return res.json()})
    .then(data=>{
        var bgArr = document.querySelectorAll('.popular');
        bgArr.forEach((bg,index)=>{
            bg.href = `${data.articles[index].url}`;
            bg.querySelector('img').src = `${data.articles[index].urlToImage}`;
            bg.querySelector('.title').innerHTML = `${data.articles[index].title}`;
            bg.querySelector('.source-box').innerHTML=`${data.articles[index].source.name}`;
            if(bg.querySelector('.credits')){
                var author = data.articles[index].author;
                if(author){
                    var arr = author.split(' ');
                    arr.splice(2,arr.length);
                    author = arr.join(" ");
                }else{
                    author = "";
                }
                
                var date = new Date(`${data.articles[index].publishedAt}`);
                var dateStr = date.toDateString();
                var dateArr = dateStr.split(' ');
                dateArr.splice(0,1);
                dateStr = dateArr.join(" ")
                bg.querySelector('.credits').innerHTML=`<span>${author}</span>${dateStr} `;
                if(author=""){
                    bg.querySelector('span').style.marginRight="0px";
                }
            }
        })
    })
    .catch(err=>{
        alert("Failed to load the resource");
    })
    
    var urlNewsLatest = "https://newsapi.org/v2/everything?q=(covid%20OR%20corona)&pageSize=20&language=en&sortBy=publishedAt&apiKey=06d643609e7e4d3da735fb808ca1df76";
    fetch(urlNewsLatest)
    .then(res=>{
        return res.json()
    })
    .then(data=>{
        var i=0;
        var brkCtr=0;
        var html;
        var parentNews = document.querySelector('.news-cards-container');

        var observer;
        var options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5
        };
        var loader = document.querySelector('.loader');
        observer = new IntersectionObserver(entries=>{
            entries.forEach(entry=>{
                if(entry.intersectionRatio>0){
                    //put function hear
                    setTimeout(()=>{
                        for(i;i<data.articles.length;i++){
                            if(data.articles[i].description===null){
                                continue;
                            }

                            if(data.articles[i].description!=null || data.articles[i].description!==" "|| data.articles[i].description!==""||data.articles[i].description!="null"){
                                if(data.articles[i].description.includes("<"))continue;
                                else{
                                    var date = new Date(`${data.articles[i].publishedAt}`);
                                    var dateStr = date.toDateString();
                                    var dateArr = dateStr.split(' ');
                                    dateArr.splice(0,1);
                                    dateStr = dateArr.join(" ");
                                    
                                    var imgSrc = data.articles[i].urlToImage;
                                    if(imgSrc==null || imgSrc==""){
                                        imgSrc= "../IMAGES/component.png";
                                    }
                                    html = `<a href="${data.articles[i].url}" class="news-card"><div class="news-card-image-box"><img src="${imgSrc}"></div><div class="source">${data.articles[i].source.name}</div><div class="news-card-text-box"><p class="date">${dateStr}</p><h2 class="title">${data.articles[i].title}</h2><p class="description">${data.articles[i].description}</p></div></a>`;
                                    parentNews.insertAdjacentHTML('beforeend',html);
                                    brkCtr++;
                                    if(brkCtr ===9){
                                        i++;
                                        brkCtr=0;
                                        break;
                                    }
                                }
                            }else{
                                continue
                            }

                        }
                    },1000)

                    if(i == data.articles.length ){
                        loader.style.display="none";
                        document.querySelector('footer').classList.remove('hidden')
                    }
                }
            })
        }, options);
        observer.observe(loader);

        
    })

}