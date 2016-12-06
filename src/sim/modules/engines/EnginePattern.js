
var EnginePattern = function (power) {
    console.log("EnginePattern.new");
    this.power = power;
    this.image = fireImage;
}

EnginePattern.prototype.create = function () {
    return new Engine(this);
}
