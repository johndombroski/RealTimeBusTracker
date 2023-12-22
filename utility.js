// ---------------- initialize global parameters
const mapLonLat = [-71.08457978, 42.34245663];
const busList = [];
var jsonBusData;

// ---------------- busClass
class busCL {
  label;
  hasActiveData;
  isAttachedToMap = 0;
  latitude;
  longitude;
  marker;

  updateSelf(jsonData){
    this.latitude = jsonData.attributes.latitude
    this.longitude = jsonData.attributes.longitude
    
    if(this.isAttachedToMap == 0){
      const el = document.createElement('div');
      el.className = 'marker';
      this.marker = new mapboxgl.Marker(el);
      this.updatePosition();
      this.marker.addTo(map);
      this.isAttachedToMap = 1;
    }

    if(this.hasActiveData){
      this.updatePosition();
    }
  }

  updatePosition() {
    this.marker.setLngLat([this.longitude, this.latitude]);
  }
}

// ---------------- mapping 

// initialize the map
mapboxgl.accessToken = '';
// initialize map
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: mapLonLat,
  zoom: 14,
});

async function startTracker() {

  jsonBusData = await loadBusData();
  let dateDiv = document.getElementById("dtgDiv");
  dateDiv.innerHTML = 'Updated: ' + new Date();
  resolveBusData();

  // wrap in a timeout and recurse
  setTimeout(() => {
    startTracker();
  }, 15000);
 
}

async function loadBusData(){
  const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
  const response = await fetch(url);
  const json     = await response.json();
  return json.data;
}

function resolveBusData(){
  if(busList.length == 0){
    // first time thru
    nBus = new busCL();
    nBus.label = jsonBusData[0].attributes.label;
    nBus.hasActiveData = 1;
    busList.push(nBus);
  }
  // reset all buses
  busList.forEach((element) => element.hasActiveData = 0)

  for(let i=0; i<jsonBusData.length; i++){
    let cBus = busList.find(element => element.label == jsonBusData[i].attributes.label);
    if(cBus){
      cBus.hasActiveData = 1;
      cBus.updateSelf(jsonBusData[i]);
    }
    else{
      nBus = new busCL();
      nBus.label = jsonBusData[i].attributes.label;
      nBus.hasActiveData = 1;
      nBus.updateSelf(jsonBusData[i]);
      busList.push(nBus);
    }
  }
  

}
  

// Request bus data from MBTA
async function getBusLocations(){
const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
const response = await fetch(url);
const json     = await response.json();
return json.data;
}





