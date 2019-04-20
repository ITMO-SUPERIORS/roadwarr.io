"use strict";
/**
 * @name   civil-car.ts
 * @author Bastarda
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
Object.defineProperty(exports, "__esModule", { value: true });
class CivilCar extends Phaser.GameObjects.Image {
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.scaleVal = 0.8;
        this.setScale(this.scaleVal);
        this.setOrigin(0, 0);
        this.carFrame = params.frame;
        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(200);
        this.body.setSize(this.width, this.height);
        this.scene.add.existing(this);
    }
    getFrame() {
        return this.carFrame;
    }
}
exports.CivilCar = CivilCar;
//# sourceMappingURL=civil-car.js.map