import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import { config } from '../config';

// The "Vehicle" class
function Vehicle(location, mass, ctx) {
    'use strict';

    var predict = vec2.create();
    var dir = vec2.create();
    var a = vec2.create();
    var b = vec2.create();
    var ap = vec2.create();
    var ab = vec2.create();
    var clonea = vec2.create();
    var predictLoc = vec2.create();
    var accelerationVec = vec2.fromValues(0, 0);
    var steerVec = vec2.create();
    var diffVec = vec2.create();

    this.location = location;
    this.mass = mass;
    this.maxspeed = 5 / this.mass;
    this.maxforce = 1 / 5;
    this.radius = this.mass * 2;
    this.acceleration = vec2.create();
    this.velocity = vec2.fromValues(this.maxspeed, 0);

    this.hue = Math.random() * 360;

    this.applyBehaviors = function (vehicles, path) {
        var f = this.follow(path);
        var s = this.separate(vehicles);

        // Scale up forces to produce stronger impact
        vec2.scale(f, f, 2);    // f = f * 2
        vec2.scale(s, s, 4);    // s = s * 4

        // Calculate the average force
        var forces = vec2.add(vec2.create(), f, s);
        vec2.scale(forces, forces, 1 / this.mass);    // divide force by its mass

        // Apply force
        this.applyForce(forces);
    };

    /**
     * Apply force on the vehicle
     */
    this.applyForce = function (force) {
        vec2.add(this.acceleration, this.acceleration, force);
    };

    /**
     * Run Vehicle loop
     */
    this.run = function () {
        this.update();
        //this.borders();
        this.render();
    };

    /**
     * Implement Craig Reynolds' path following algorithm
     */
    this.follow = function (path) {

        // Predict future location
        predict.set(this.velocity);

        vec2.normalize(predict, predict);
        vec2.scale(predict, predict, 25);

        predictLoc.set([0, 0]);
        vec2.add(predictLoc, predict, this.location);

        // Define things
        var target = null;
        // Will be updated with shortest distance to path. Start with a very high value.
        var worldRecord = 1000000;

        // Loop through each point of the path
        for (var i = 0, len = path.points.length; i < len; i++) {

            // Get current and next point of the path
            a.set(path.points[i]);
            b.set(path.points[(i + 1) % path.points.length]);

            // Calculate a normal point
            var normalPoint = this.getNormalPoint(predictLoc, a, b);

            // Calculate direction towards the next point
            dir.set(b);
            vec2.sub(dir, dir, a);

            // Set a normal point to the end of the current path segment and recalculate direction if the vehicle is not within it
            if (normalPoint[0] < Math.min(a[0], b[0]) || normalPoint[0] > Math.max(a[0], b[0]) ||
                normalPoint[1] < Math.min(a[1], b[1]) || normalPoint[1] > Math.max(a[1], b[1])) {

                normalPoint.set(b);
                a.set(path.points[(i + 1) % path.points.length]);
                b.set(path.points[(i + 2) % path.points.length]);

                dir.set(b);
                vec2.sub(dir, dir, a);
            }

            // Get a distance between future location and normal point
            var d = vec2.dist(predictLoc, normalPoint);

            // Calculate steering target for current path segment if the vehicle is going in segment direction
            if (d < worldRecord) {
                worldRecord = d;
                target = normalPoint;

                vec2.normalize(dir, dir);
                vec2.scale(dir, dir, 25);
                vec2.add(target, target, dir);
            }
        }

        // Steer if the vehicle is out of the 1/5 of the path's radius
        if (worldRecord > path.radius / 5) {
            return this.seek(target);
        } else {
            return vec2.fromValues(0, 0);
        }
    };

    // Find normal point of the future location on current path segment
    this.getNormalPoint = function (p, a, b) {
        ap.set(p);
        vec2.sub(ap, ap, a);
        ab.set(b);
        vec2.sub(ab, ab, a);

        vec2.normalize(ab, ab);
        vec2.scale(ab, ab, vec2.dot(ap, ab));

        clonea.set(a);

        return vec2.add(vec2.create(), clonea, ab);
    };

    // Update vehicle's location
    this.update = function () {
        // New location = current location + (velocity + acceleration) limited by maximum speed
        // Reset acceleration to avoid permanent increasing
        vec2.add(this.velocity, this.velocity, this.acceleration);
        vec2.limit(this.velocity, this.velocity, this.maxspeed);
        vec2.add(this.location, this.location, this.velocity);

        accelerationVec.set([0, 0]);
        this.acceleration = accelerationVec;
    };

    // Produce path following behavior
    // @param {Array} target Point on the Path where vehicle is steering to
    this.seek = function (target) {
        vec2.sub(target, target, this.location);
        var steer;

        vec2.normalize(target, target);
        vec2.scale(target, target, this.maxspeed);

        steer = target;

        vec2.sub(steer, steer, this.velocity);
        vec2.limit(steer, steer, this.maxforce);

        return steer;
    };

    this.separate = function (boids) {
        var desiredSepartion = this.radius * 2 + 2,
            count = 0,
            steer;

        steerVec.set([0, 0]);
        steer = steerVec;

        // Loop through each vehicle
        for (var i = 0, len = boids.length; i < len; i++) {
            var other = boids[i],
                d = this.location;

            // Get distance between current and other vehicle
            d = vec2.dist(d, other.location);

            if ((d > 0) && (d < desiredSepartion)) {

                // Point away from the vehicle
                vec2.sub(diffVec, this.location, other.location);

                vec2.normalize(diffVec, diffVec);

                // The closer the other vehicle is, the more current one will flee
                vec2.scale(diffVec, diffVec, 1 / d);

                vec2.add(steer, steer, diffVec);

                count++;
            }
        }

        if (count > 0) {
            vec2.scale(steer, steer, 1 / count);
        }
        return steer;
    };

    //this.borders = function() {
    //
    //};

    this.render = function () {
        if (config.renderShadow) {
            ctx.shadowBlur = this.radius;
            ctx.shadowColor = 'hsl(' + this.hue + ',100%,60%)';
        }
        // ctx.fillStyle = 'hsl(' + this.hue + ',100%,60%';
        ctx.strokeStyle = 'hsl(' + this.hue + ',100%,80%';
        ctx.lineWidth = Math.max(3, this.radius / 8);

        ctx.beginPath();
        ctx.arc(this.location[0], this.location[1], this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        // ctx.fill();
        ctx.stroke();
    };
}

export default Vehicle;
