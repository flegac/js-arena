var CollisionDetector = function (simulator) {
    this.simulator = simulator;
}


CollisionDetector.prototype.update = function () {
    try {

        for (var key1 in this.simulator.ships) {
            var ship1 = this.simulator.ships[key1];
            var shield1 = ship1.getActiveShield();
            var sim1 = shield1 != null ? shield1 : ship1;


            for (var key2 in this.simulator.ships) {
                var ship2 = this.simulator.ships[key2];
                var shield2 = ship2.getActiveShield();
                var sim2 = shield2 != null ? shield2 : ship2;

                var direction = ship1.position.getDirection(ship2.position);
                var dist = direction.getNorm();
                direction.x += (Math.random() - .5) * .01;
                direction.y += (Math.random() - .5) * .01;
                direction.scale(.8);

                //ship hull collision
                if (dist < ship1.radius + ship2.radius) {
                    ship1.speed.x -= direction.x;
                    ship1.speed.y -= direction.y;
                    ship2.speed.x += direction.x;
                    ship2.speed.y += direction.y;
                    continue;
                }


                //shield collision
                if (sim1 === shield1) {
                    direction.scale(.4);
                }
                if (sim2 === shield2) {
                    direction.scale(.4);
                }

                if (dist < sim1.radius + sim2.radius) {
                    ship1.speed.x -= direction.x;
                    ship1.speed.y -= direction.y;
                    ship2.speed.x += direction.x;
                    ship2.speed.y += direction.y;
                }



            }
        }







        for (var key1 in this.simulator.shots) {
            var shot = this.simulator.shots[key1];
            if (250*(this.simulator.time - shot.creationTime) < shot.speed.getNorm()  * this.simulator.DT) {
                continue;
            }
            for (var key2 in this.simulator.ships) {
                var ship = this.simulator.ships[key2];
                var shield = ship.getActiveShield();

                if (shield != null && ship.position.distance(shot.position) < shield.radius + shot.radius) {
                    shot.creationTime = -1000;
                    this.simulator.register("impact", new Impact(shot.position, 15));
                    shield.life -= shot.damage;
                    shieldStop = true;
                    break;
                }


                if (ship.position.distance(shot.position) < ship.radius + shot.radius) {
                    shot.creationTime = -1000;
                    this.simulator.register("impact", new Impact(shot.position, 15));
                    ship.life -= shot.damage;
                }
            }
        }
    } catch (e) {
        console.log("ERROR(CollisionDetector.update): " + e);
    }
}