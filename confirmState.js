function confirmState(departure, destination, price) {
    background(255);
    fill(0);
    imageMode(CENTER)
    textSize(36)
    textAlign(LEFT,CENTER);
    text(departure.toUpperCase(), windowWidth/2.2, windowHeight/2.6);
    image(imgDeparture,windowWidth/2.4, windowHeight/2.6,50,50);
    text(destination.toUpperCase(), windowWidth/2.2, windowHeight/2.2);
    image(imgDestination,windowWidth/2.4, windowHeight/2.2,50,50);
    image(imgDollar,windowWidth/2.4,windowHeight/1.8,30,30);
    textSize(30)
    text(price+' CHF', windowWidth/2.2, windowHeight/1.8);
    textAlign(RIGHT, BOTTOM);
    text('PRESS R FOR RESET', windowWidth-50, windowHeight - 35);
}