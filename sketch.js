let imgMap;
let imgPlane;
let countryLatLong;
let selector;
let lon;
let lat;
let isFlying = true;
let price;

let activeState = 'start';

let destination;

let angle;
let departure;
let velocity;

function preload() {
    imgMap = loadImage('assets/map2.jpg');
    imgPlane = loadImage('assets/streamline_plane.png');
    countryLatLong = loadTable('countries.csv', 'csv', 'header');
    if('geolocation' in navigator){
        console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {
            selector = new CountrySelector(windowWidth / 2, windowHeight / 2)
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
    velocity = createVector(1,1);
    destination = createVector(windowWidth/2, windowHeight/2);
}

function draw() {
    // put drawing code here
    if (activeState == 'start') {
        startState();
    } else if (activeState == 'booking') {
        bookingState();
    } else if (activeState == 'confirm') {
        confirmState();
    }
}

function startState() {
    textSize(20);
    textFont('Helvetica');
    text('PRESS B FOR FLIGHT BOOKING', windowWidth/2, windowHeight/2);
}

function bookingState() {
    image(imgMap, 0, 0, windowWidth, windowHeight);
    textSize(20);
    textFont('Helvetica');

    if (isFlying) {
        price += 1;
        destination.add(velocity);
        fill(0);

        push();
        translate (destination.x, destination.y);
        rotate(-angle);
        imageMode(CENTER);
        image(imgPlane, 0, 0, 35, 35);
        pop();
        console.log(velocity.x + " " + velocity.y);
    } else {
        activeState = 'confirm';
    }

    if (selector) {
        text(selector.country, windowWidth / 2, windowHeight / 2);
        selector.display()
    }
}

function keyPressed() {
    if (key === 'b' || key === 'B') {
        activeState = 'booking';
    }
    if (keyCode === ENTER) {
        console.log("enter pressed");
        isFlying = !isFlying;
    }
    if (keyCode === 37) {
        angle += 0.1;

    }
    if (keyCode === 39) {
        angle -= 0.1;
    }
    velocity.x = sin(angle);
    velocity.y = cos(angle);
    destination.add(velocity);
    velocity.normalize()
}

function windowResized() {
    if(windowWidth > windowHeight){
        resizeCanvas(windowWidth,windowWidth/1.9938347719)}
        else{
        resizeCanvas(windowHeight*1.9938347719, windowHeight)
        }

    selector.position(windowWidth/2, windowHeight/2)
}

class CountrySelector {
    constructor(X,Y) {

        this.x = X
        this.y = Y
        this.lat= lat
        this.long = lon
        this.countryCode = 'unknown'
        this.country = this.getCountryName(this.lat,this.long)
        this.dimensions = {
            w:windowWidth,
            h:windowHeight
        }
    }
    display() {
        if (mouseIsPressed) {
            this.coordinateFinder()
        }
    }

    coordinateFinder() {
        // gui element to select a latitude and longitude
        let lat = map(mouseY, this.y -  this.dimensions.h/2, this.y +  this.dimensions.h/2, 84, -80)
        let long = map(mouseX, this.x -  this.dimensions.w/2, this.x +  this.dimensions.w/2, -180, 180)
        let NS = 'S'
        let EW = 'W'
        if (lat>0) {
            NS = 'N'
        }
        if (long>0) {
            EW = 'E'
        }
        let newCountry =  this.getCountryName(lat, long)
        if ( this.country = newCountry) {
            this.country = newCountry
        }
        fill(0)
        textAlign(CENTER)
        text(this.deg_to_dms(abs(lat))+NS+", "+this.deg_to_dms(abs(long))+EW,180,15)
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
                this.countryCode = countryLatLong.getString(r, 'ISO 3166 Country Code')
                this.countryCode = this.countryCode.toLowerCase()
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