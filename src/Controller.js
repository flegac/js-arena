var Controller = {};

Controller.fireKey = 32;

Controller.trustKey = 90;
Controller.leftKey = 81;
Controller.rightKey = 68;
Controller.brakeKey = 83;



Controller.onmousemove = function (event) {
  //  ARENA.crosshair.position = new Vec(event.clientX - 10, event.clientY - 10);
}
Controller.onmouseup = function (event) {
    ARENA.player.autofire = false;
    //    console.log("autoFire: " + ARENA.player.autofire);
}
Controller.onmousedown = function (event) {
    ARENA.player.autofire = true;
    //  console.log("autoFire: " + ARENA.player.autofire);
}
Controller.onwheel = function (event) {
//    console.log("zoom");
  //  ARENA.camera.scale *= 0.9;
}

Controller.onkeydown = function (event) {
    var keycode = event.keyCode || event.which;
  //  console.log(keycode);
    if (keycode === this.trustKey && !ARENA.player.trust) {
        ARENA.player.trust = true;
    }
    if (keycode === this.leftKey && !ARENA.player.turnLeft) {
        ARENA.player.turnLeft = true;
    }
    if (keycode === this.rightKey && !ARENA.player.turnRight) {
        ARENA.player.turnRight = true;
    }
    if (keycode === this.brakeKey && !ARENA.player.brake) {
        ARENA.player.brake = true;
    }

    if (keycode === this.fireKey && !ARENA.player.autofire) {
        ARENA.player.autofire = true;
    }

}

Controller.onkeyup = function (event) {
    var keycode = event.keyCode || event.which;
    if (keycode === this.trustKey && ARENA.player.trust) {
        ARENA.player.trust = false;
    }
    if (keycode === this.leftKey && ARENA.player.turnLeft) {
        ARENA.player.turnLeft = false;
    }
    if (keycode === this.rightKey && ARENA.player.turnRight) {
        ARENA.player.turnRight = false;
    }
    if (keycode === this.brakeKey && ARENA.player.brake) {
        ARENA.player.brake = false;
    }
    if (keycode === this.fireKey && ARENA.player.autofire) {
        ARENA.player.autofire = false;
    }
}

Controller.update = function (dt) {
    try {
        var player = ARENA.player;
        var mouse = ARENA.crosshair.position;

        var angularDirection = player.position.getAngularDirection(mouse);
     //   player.spin = isFinite(angularDirection) ? getAngularCorrection(player.angle, angularDirection) / dt : 0;
        //   player.speed = player.position.getDirection(mouse);
        //    player.speed.scale(.05);
        //   player.speed.scale(1.0 / dt);


        //      console.log(player);

    } catch (e) {
        console.log("ERROR(Controller.update): " + e);
    }
}