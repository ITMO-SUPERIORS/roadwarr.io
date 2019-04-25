/** 
 * @name   civil-car.ts
 * @author Bastarda
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
import { Object } from "../../shared/models"

export class CivilCar extends Phaser.GameObjects.Image{
    private scaleVal: number;
    carFrame: number;
    constructor(params: Object){
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

    public getFrame(): number{
        return this.carFrame;
    }
}