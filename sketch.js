let imgMap;
let countryLatLong;
let selector;

function preload() {
    imgMap = loadImage('assets/map2.jpg');
    countryLatLong = loadTable('countries.csv', 'csv', 'header');
}

function setup() {
  // put setup code here
    createCanvas(windowWidth, windowHeight);
    selector = new CountrySelector(windowWidth/2, windowHeight/2)
}
function draw() {
  // put drawing code here
    object.onclick = this.bookingState()State(){myScript};
}

function startState() {
    textSize(20)
    textFont('Helvetica')
    text(PRESS B FOR FLIGHT BOOKING,windowWidth/2, windowHeight/2);
    if (keyIsPressed) {
        this.bookingState()
    }
}

function bookingState() {
    image(imgMap, 0, 0, windowWidth, windowHeight);
    textSize(20)
    textFont('Helvetica')
    text(selector.country,windowWidth/2, windowHeight/2);
    selector.display()
}

function confirmState() {
    image(imgMap, 0, 0, windowWidth, windowHeight);
    textSize(20)
    textFont('Helvetica')
    text(selector.country,windowWidth/2, windowHeight/2);
    selector.display()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    selector.position(windowWidth/2, windowHeight/2)
}

class CountrySelector {
    constructor(X,Y) {

        this.x = X
        this.y = Y
        this.lat= 47
        this.long = 8
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