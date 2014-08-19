var markers = [];
var map;
var earthquakesInfo = [];

function initialize() {

    var mapOptions = {
        center : new google.maps.LatLng(0, 0),
        zoom : 2,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    var topControlDiv = document.createElement('div');
    var topControl = new TopControl(topControlDiv, map);
    topControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(topControlDiv);

    google.maps.event.addListener(map, 'idle',showMarkers);

    autoPlaceComplete();

}

//Perform GEO auto complete feature
function autoPlaceComplete(){
    //Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);


    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);  // Why 13? Because it looks good.
        }

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        showMarkers();

    });
}

function getGeoURL(boundingBox,optional){
    //todo
    // if boundingBox is null

    optional = typeof minMagnitude !== 'undefined' ? optional : {};
    var today = new Date();
    var date = typeof date !== 'undefined' ? optional.date : today.getFullYear()+ '-' + (today.getMonth()+1) + '-' +today.getDate();
    var minMagnitude = typeof minMagnitude !== 'undefined' ? optional.minMagnitude : 1;
    var maxRows = typeof maxRows !== 'undefined' ? optional.maxRows : 30;


    var south = boundingBox.getSouthWest().lat()
    var west = boundingBox.getSouthWest().lng()
    var north = boundingBox.getNorthEast().lat()
    var east = boundingBox.getNorthEast().lng()

    return 'http://api.geonames.org/earthquakesJSON?' +
        'north='+north+
        "&south="+south+
        '&east='+east+
        '&west='+west+
        '&date='+ date+
        '&minMagnitude='+ minMagnitude+
        '&maxRows='+ maxRows+
        '&username=shellyan';
}


function getMarkers(geoURL){

    //todo check if no earthquakes
    $.getJSON(geoURL,function(data){

            if(data.earthquakes.length==0) return alert("No earthquakes found in this bounding box.")
            var earthquake = [];
            for(var i=0;i<data.earthquakes.length;i++){
                earthquake = earthquakesInfo[i];
                earthquakesInfo[i] = {
                    "datetime":data.earthquakes[i].datetime,
                    "depth":data.earthquakes[i].depth,
                    "lng":data.earthquakes[i].lng,
                    "src":data.earthquakes[i].src,
                    "eqid":data.earthquakes[i].eqid,
                    "magnitude":data.earthquakes[i].magnitude,
                    "lat":data.earthquakes[i].lat
                }

                addMarker(earthquake);

                }
            }

    );

}

function addMarker(earthquake){
    var contentString='<div id="content">' +
        '<p> Eeathquake ID: '+ earthquake.eqid + '</p>' +
        '<p> Magnitude: ' + earthquake.magnitude +'</p>' +
        'Depth:'+ earthquake.depth + '</p>' +
        '<p> Latitude: ' + earthquake.lat +'</p>' +
        'Longitude: '+ earthquake.lng + '</p>' +
        '<p> Time: ' + earthquake.datetime +'</p>' +
        'Source: '+ earthquake.src + '</p>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content : contentString,
        disableAutoPan : false

    });

    var myLatlng = new google.maps.LatLng(earthquake.lat,earthquake.lng);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: 'Earthquake'

    });

    markers.push(marker);
    google.maps.event.addListener(marker, 'mouseover', function () {
        infowindow.open(map, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
    });

}

//Try to use map.contol
function TopControl(controlDiv, map) {
    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map
    controlDiv.style.padding = '5px';

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to check the Top 10';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '25px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Top 10</b>';
    controlUI.appendChild(controlText);

    cleanMarkers();

    google.maps.event.addDomListener(controlUI, 'click', function() {

        map.setCenter(new google.maps.LatLng(0, 0));
        map.setZoom(2);
        var geoURL = 'http://api.geonames.org/earthquakesJSON?maxRows=300&' +
            'north=180&south=-180&east=180&west=-180&username=shellyan';
        var today = new Date();
        var lastYear = (today.getFullYear()-1)+ '-' + (today.getMonth()+1) + '-' +today.getDate();

        var topTen = [];
        $.getJSON(geoURL,function(data){
            var rawData = data.earthquakes;
            rawData.forEach( function(i) {
                if(i.datetime > lastYear) {
                    topTen.push(i);
                }
            });
        if(topTen.length>=1){
            topTen = topTen.slice(0,10);
            topTen.forEach(function(i){
                addMarker(i);
            })
        }else{
            cleanMarkers();

            return alert('No earthquakes found for the past 12 months.')

        }
            console.log("top10:"+topTen);
        });
    });

}



// Shows any markers currently in the array.
function showMarkers() {

    var boundingBox = map.getBounds();
    var geoURL = getGeoURL(boundingBox);

    getMarkers(geoURL);
}

function cleanMarkers(){
    setAllMap(null);
    markers = [];
}
function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}




google.maps.event.addDomListener(window, 'load', initialize);
