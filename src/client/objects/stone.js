"use strict";
/**
 * @name   stone.ts
 * @author MantisSuperior
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
Object.defineProperty(exports, "__esModule", { value: true });
class Stone extends Phaser.GameObjects.Image {
    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.scaleVal = 0.6;
        this.setScale(this.scaleVal);
        this.setOrigin(0, 0);
        this.stoneFrame = params.frame;
        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(500);
        this.body.setSize(this.width, this.height);
        this.scene.add.existing(this);
    }
    getFrame() {
        return this.stoneFrame;
    }
}
exports.Stone = Stone;
//# sourceMappingURL=stone.js.map