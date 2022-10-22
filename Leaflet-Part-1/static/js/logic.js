
// Define earthquakes GeoJSON url variable
const eqURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


    // d3-read data and show me all the features objects
  d3.json(eqURL, function (data) {
    console.log(data);
    // Define a function that shows all the feature array. data.features is an object.
    Features(data.features);
      function Features(datafeatures) {
        console.log("Here are my features:", datafeatures);
        // Binding a popup to each layer
        function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>" + feature.properties.place +
        "</h2><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
      
        //Create geoJSON layer.
        let earthquakes = L.geoJSON(data, {
          onEachFeature: onEachFeature, // Run the onEachFeature for each object in the array to show on the bubble when clicked.
          pointToLayer: function (feature, coordinates) { //pointToLayer gives us a circle marker
          
            // Determine Marker Colors, Size, and Opacity for each earthquake.
            let geoMarkers = {
            radius: size(feature.properties.mag),
            fillColor: colors(feature.geometry.coordinates[2]),
            fillOpacity: 0.70,
            stroke: true,
            weight: 0.5
            }
          
            return L.circle(coordinates, geoMarkers);
          
        }

        })
  
    //  Calling the function and sending our earthquakes layer created below to the createMap function
    createMap(earthquakes);
    }
    
  });

  // assigning color functions on magnitude of the earthquakes.
  function colors(magnitude) {
    if (magnitude <= 10) {
      return color = "#6ae809";
    }
    else if (magnitude <= 30) {
      return color = "#d0ff00";
    }
    else if (magnitude <= 50) {
      return color = "#eaff00";
    }
    else if (magnitude <= 70) {
      return color = "#ffd000";
    }
    else if (magnitude <= 90) {
      return color = "#e84a0e";
    }
    else if (magnitude > 90) {
      return color = "#cc0404";
    }
    else {
      return color = "#ff00bf";
    }
  }
  
  // Determine sizes for each markers on the map
function size(magnitude) {
  return magnitude * 25000;
}

    // Create overarching function for earthquake map
  function createMap(earthquakes) {
  
      // https://api.mapbox.com/styles/v1/mapbox/outdoors-v11.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#2/20/0
      // Define outdoormap, greymap, and Satellite layers
      let outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 15,
      zoomOffset: -1,
      accessToken: API_KEY
    });
  
      let grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 15,
      accessToken: API_KEY
    });

      // https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#3.78/42.29/-92.17/0/11
      // "https://api.mapbox.com/v4/mapbox.satellite/1/0/0@2x.jpg90?access_token=pk.eyJ1Ijoic2phaG4xMTciLCJhIjoiY2w5Z3RlcnA2MDQxdzN1cnRsZ3JkajV3NSJ9.Ox8ushVQxjhpmsIJMtDyvw"
      let SatelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 15,
      accessToken: API_KEY
    });
      // Create the map object so the Satellitemap and earthquakes layers display when loaded.
      let myMap = L.map("map", {
      center: [37.09, -95.71],
      zoom: 4,
      layers: [grayscaleMap, earthquakes]
    });
    
      // Define a baseMaps object to hold our base layers
      let baseMaps = {
      "Outdoors": outdoormap,
      "Grayscale": grayscaleMap,
      "Satellite": SatelliteMap
    };
  
      // Create overlay object to hold our overlay layer
      let overlayMaps = {
      Earthquakes: earthquakes
    };
  
  
    // Create a layer control pass in our baseMaps and overlayMaps and add our layer control overlays to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  
    // Set up the legend.
    // Create a legend to display info about our map.
    let legend = L.control({ 
      position: 'bottomright' 
    });
  
    // When the layer control is added, insert a div with the class of "info legend".
    legend.onAdd = function () {
  
      let div = L.DomUtil.create('div', 'info legend'),
          magnitude = [-10, 10, 30, 50, 70, 90];
  
      // loop through the intervals and generate a label for each interval
      for (let i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors(magnitude[i] + 1) + '"></i> ' +
          magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }
  
      return div;
    };
  
    // Add the info legend to the map.
    legend.addTo(myMap);
  
  }

  
