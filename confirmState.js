function confirmState(departure, destination, price) {
    background(255);
    fill(0);
    imageMode(CENTER)
    textSize(36)
    textAlign(LEFT,CENTER);
    text(departure, windowWidth/2.2, windowHeight/2.6);
    image(imgDeparture,windowWidth/2.4, windowHeight/2.6,50,50);
    text(destination, windowWidth/2.2, windowHeight/2.2);
    image(imgDestination,windowWidth/2.4, windowHeight/2.2,50,50);
    text('CHF',windowWidth/2.6,windowHeight/1.8);
    text(price, windowWidth/2, windowHeight/1.8);
}