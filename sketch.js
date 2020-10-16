let imgMap;
let imgPlane;
let imgDeparture;
let imgDestination;
let imgDollar;
let countryLatLong;
let selector;
let lon;
let lat;
let price;

let activeState = 'start';

let destination;
let angle;
let departure;
let destName;
let velocity;

let path=[];

function preload() {
    imgMap = loadImage('assets/map3.jpg');
    imgPlane = loadImage('assets/streamline_plane.png');
    imgDeparture = loadImage('assets/streamline_departure.png');
    imgDestination = loadImage('assets/streamline_destination.png');
    imgDollar = loadImage('assets/streamline_bag.png');
    countryLatLong = loadTable('countries.csv', 'csv', 'header');
    selector = new CountrySelector(windowWidth / 2, windowHeight / 2);
    if('geolocation' in navigator){
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {

            lat = position.coords.latitude;
            lon = position.coords.longitude;
            selector.location(position.coords.longitude, position.coords.latitude);
        });
    } else {
        console.log('geolocation not available');
    }
    angle = 0;
}

function setup() {
    // put setup code here
    createCanvas(windowWidth, windowHeight);
    velocity = createVector(2,2);
    destination = createVector(windowWidth/2, windowHeight/2);
}

function reset() {
    path = [];
    if (selector) {
        let pos = selector.mapCoordinatesToXY(lat, lon);
        destination = createVector(pos.x, pos.y);
    } else {
        destination = createVector(selector.mapCoordinatesToXY(46.8181877, 8.2275124));
    }
}

function draw() {
    // put drawing code here
    if (activeState == 'start') {
        startState();
        reset();
    } else if (activeState == 'booking') {
        bookingState();
    } else if (activeState == 'confirm') {
        departure = selector.getCountryName(lat,lon);
        destName = selector.coordinateFinder(destination.x,destination.y);
        price = path.length*2;
        confirmState(departure, destName, price);
    }
}

function startState() {
    background(255);
    if (key === 'b' || key === 'B') {
        activeState = 'booking';
    }
    textSize(20);
    textFont('Helvetica');
    textAlign(CENTER, CENTER);
    text('PRESS B FOR FLIGHT BOOKING', windowWidth/2, windowHeight/2);
    textSize(15);

   // textAlign(RIGHT, BOTTOM);
    //text('DESIGNED BY AATHMIGAN', windowWidth-50, windowHeight - 35);

}

function bookingState() {
    if (keyIsDown(ENTER)) {
        activeState = 'confirm'
    }
    if (keyIsDown(LEFT_ARROW)) {
        angle += 0.05;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        angle -= 0.05;
    }
    velocity.x = sin(angle);
    velocity.y = cos(angle);
    velocity.normalize();

    imageMode(CORNER);
    image(imgMap, 0, 0, windowWidth, windowHeight);
    textSize(20);
    textFont('Helvetica');

    path.push({x:destination.x,y:destination.y})
    destination.add(velocity);
    push();
    translate (destination.x, destination.y);
    rotate(-angle);
    imageMode(CENTER);
    image(imgPlane, 0, 0, 35, 35);
    pop();

    if (selector) {
        text(selector.country, windowWidth / 2, windowHeight / 2);
    }

    for(let i = 0; i<path.length; i=i+10){
        noStroke();
        fill(0,0,0)
        circle(path[i].x,path[i].y,5);
    }

    textAlign(RIGHT, BOTTOM);
    text('USE ARROW KEYS FOR CONTROL, PRESS ENTER TO LAND', windowWidth-50, windowHeight - 35);
}


function keyPressed() {
    if (key === 'r' || key === 'R') {
        reset();
        activeState = 'start';
    }
    if (key === 'b' || key === 'B') {
        activeState = 'booking';
    }
    if (keyCode === ENTER) {
        activeState = 'confirm'
    }
}

function windowResized() {
    selector.position(windowWidth/2, windowHeight/2)
}

class CountrySelector {
    constructor(X,Y) {

        this.x = X
        this.y = Y
        this.lat= lat
        this.long = lon
        this.dimensions = {
            w:windowWidth,
            h:windowHeight
        }
    }

    mapCoordinatesToXY(lat, long) {
        return {
            y: map(lat, 84, -80, this.y -  this.dimensions.h/2, this.y +  this.dimensions.h/2),
            x: map(long, -180, 180, this.x -  this.dimensions.w/2, this.x +  this.dimensions.w/2)
        }
    }

    mapXYToCoordinates(x, y) {
        return {
            lat: map(y, this.y -  this.dimensions.h/2, this.y +  this.dimensions.h/2, 84, -80),
            long: map(x, this.x -  this.dimensions.w/2, this.x +  this.dimensions.w/2, -180, 180)
        }
    }

    coordinateFinder(x,y) {
        // gui element to select a latitude and longitude
        let coordinates = this.mapXYToCoordinates(x,y);
        let NS = 'S'
        let EW = 'W'
        if (coordinates.lat>0) {
            NS = 'N'
        }
        if (coordinates.long>0) {
            EW = 'E'
        }
        text(this.deg_to_dms(abs(coordinates.lat))+NS+", "+this.deg_to_dms(abs(coordinates.long))+EW,180,15)
        return this.getCountryName(coordinates.lat, coordinates.long)
    }

    location(long, lat) {
        this.long = long;
        this.lat = lat;
    }

    position(x, y) {
        this.x = x
        this.y = y
    }

    getCountryName(lat, long) {
        // find country name based on lat and long
        let nearestCountry = ""
        let distance = dist(-90,-180,90,180)
        for (let r = 0; r < countryLatLong.getRowCount(); r++) {
            let newLat =  float(countryLatLong.getString(r, 'Latitude'))
            let newLong = float(countryLatLong.getString(r, 'Longitude'))
            let newDistance = dist(lat, long, newLat, newLong)
            if (newDistance < distance) {
                distance = newDistance
                nearestCountry = countryLatLong.getString(r, 'Country')
            }
        }
        return nearestCountry
    }
    deg_to_dms(deg) {
        // converts decimal degrees to degrees-minutes-seconds
        let d = Math.floor (deg)
        let minfloat = (deg-d)*60
        let m = Math.floor(minfloat)
        let secfloat = (minfloat-m)*60
        let s = Math.round(secfloat)
        if (s==60) {
            m++
            s=0
        }
        if (m==60) {
            d++
            m=0
        }
        let dFormated = ("0" + d).slice(-2)
        if (d>100) {
            dFormated = d
        }
        let mFormated = ("0" + m).slice(-2)
        let sFormated = ("0" + s).slice(-2)
        return ("" + dFormated + "°" + mFormated + "\'" + sFormated+"\"")
    }
}