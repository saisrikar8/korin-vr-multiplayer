class SteeringWheel{
    constructor(){

        imageMode(CENTER);

        this.imgElement = createImg("/assets/car/steering.png", "steering wheel");
        this.imgElement.style("z-index", "10");
        this.imgElement.position(windowWidth - 220, windowHeight - 220);
        this.imgElement.style("position", "absolute");
        this.imgElement.attribute("id", "steering-wheel")
    }
    resetPosition(){
        this.imgElement.position(windowWidth - 220, windowHeight - 220);
    }
    rotateSteeringWheel(angle){
        this.imgElement.style("transform", `rotate(${angle}deg)`)
    }
}