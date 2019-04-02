'use strict';
let request = require('request');
let open = require ('open');
var jp = require('jsonpath');
var puppeteer = require('puppeteer')

//Bring Readline module
const ReadLine = require('readline');
//ReadLine Functionality
const rl = ReadLine.createInterface ({
  //standard I/O
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
const matcher = require('./matcher');

const nasastring='NASA-Bot> ';
var username="";


//Output Shell
rl.setPrompt(`${username}>`);
rl.prompt();
//EventListener
rl.on('line', reply =>{
  //data is a variable used for callback
  matcher(reply,data => {
    switch (data.intent) {
      case 'Hello': 
                    
                    console.log(nasastring+`${data.entities.greeting} to you too!`);
                    rl.prompt();
                    break;

      case `IssNow`:
            {   
                console.log(nasastring+`Searching ISS Location ...`);
                //Get Data using Weather API
                issnow(data => {
                    console.log(nasastring+'The Iss is :\nLatitude :' + data.latitude+'\nLongitude :'+data.longitude+ `\nRight now (${data.timestamp})` );
                    console.log(nasastring+"Check it on the browser!")
                    open(`http://www.google.com/maps/place/${data.latitude},${data.longitude}/@${data.latitude},${data.longitude},4z`)
                });
                rl.prompt();
                break;
            }                 
        
      case `PeopleSpace`:
            {   
                console.log(nasastring+`Searching Non-Earthian-For-A-Time-People  ...`);
                //Get Data using Weather API
                peopleSpace(data => {
                    console.log(nasastring+'There is ' + data.number+' people in space.\n');
                });
                rl.prompt();

                break;
            }    
      case `Meteor`:
            {   
                console.log(nasastring+`Searching nearest crashed meteor from ${data.entities.city}...`);
                //Get Data using Weather API
                
                meteorite(data.entities.city ,result=> {

                  
                  console.log(nasastring+'Still searching ... '+result.type);
              });
                rl.prompt();
                break;
            }
      
                                              

      case 'Exit':
                    {console.log("Understandable, Have a Great Day On Planet Earth!");
                    process.exit();
                    break;
                              }
      default:
                {
                  console.log("I don't understand what you are saying");
                  rl.prompt();
                }

    }
  });
});


var issnow = function(callback){
  var url = 'http://api.open-notify.org/iss-now.json' ;
  
  request(url, function(err, response, body){
    try{		
      var result = JSON.parse(body);
      //console.log(result);
      if (result.message != 'success') {
        callback(false);
      } else {
        callback({
          latitude : result.iss_position.latitude,
          longitude : result.iss_position.longitude,
          timestamp : result.timestamp,
        });
      }
    } catch(e) {
      callback(false); 
    }
  });
}

var peopleSpace = function(callback){
    var url = 'http://api.open-notify.org/astros.json' ;
    
    request(url, function(err, response, body){
      try{		
        var result = JSON.parse(body);
        //console.log(result);
        if (result.message != 'success') {
          callback(false);
        } else {
           
          callback({
            number : result.number,
          });
        }
      } catch(e) {
        callback(false); 
      }
    });
  }
  

var meteorite = function(city, callback){
  var url = "https://data.nasa.gov/resource/y77d-th95.json" ;
  console.log(city);
  request(url, function(err, response, body){
    try{		
      var input = JSON.parse(body);
      //console.log(result);
      if (input[0].fall != 'Fell') {
        callback(false);
      } else {
        (async () => {
          var locations = jp.query(input, '$[:].geolocation.coordinates');
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(`https://www.google.com/maps/place/${city}/`);
          await page.waitFor(4000);
          const newUrl= await page.evaluate(() => {
            return  document.location.href;
            });
          // console.log(newUrl);
          var arr = newUrl.match(/@(.+),(.+),/);
          console.log(arr[0] + " " + arr[1]+" " + arr[2]);
          await browser.close();
          var min=1000;
          var result;
        
          for(let i=0;i<locations.length;i++){
            var a = locations[i][0] - arr[1];
            var b = locations[i][1] - arr[2];
            var c=Math.sqrt( a*a + b*b );
            if(c<min){
            min=c;
            result=i+1;
            }
            // console.log(i+'  '+locations[i][0]+' '+locations[i][1]+' + '+arr[1]+' = '+a+' ,  c:'+c+'  min:'+min);
          }
          // console.log('lenght'+locations.length);

          // console.log(result);
          console.log(nasastring+'The nearest meteor impact is the ' +input[result].name+ '\nAt :\n'+locations[result][0]+"  "+locations[result][1] );
          console.log("Check out the browser");
          open(`https://www.google.com/maps/dir/${arr[1]},${arr[2]}/${locations[result][0]},${locations[result][1]}/`)

        })();
        

        callback({
          
          

          type : input[0].fall,
          // longitude : result[0],
          // timestamp : result.timestamp,
        });
        
      }
    } catch(e) {
      callback(false); 
    }
  });
}

var minDist =function(array,latitude,longitude){
  var min=1000000000;
  var result;
  array.forEach(element => {
    var a = array[element][0] - latitude;
    var b = array[element][1] - longitude;
    var c=Math.sqrt( a*a + b*b );
    if(c<min)
    c=min;
    result=element;
  });
  
  return result
}

// var coldtoday = function(city,callback){
//   var url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&lang=fr&units=metric&appid=' + key.apiKey ;

//   request(
//     url,
//     {json:true},
//     (error,response,body)=>{
      
//       callback({
//         temperature : Math.round(body.list[1].main.temp)
//       });
//     }
  
//   )

// }