/** 
 * @name   civil-car.ts
 * @author Bastarda
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

export class CivilCar extends Phaser.GameObjects.Image{
    private scaleVal: number;
    constructor(params: any){
        super(params.scene, params.x, params.y, params.key);
        this.setOrigin(0, 0);

        this.scaleVal = 0.8;
        this.setScale(this.scaleVal);
        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(200);
        this.body.setSize(this.width, this.height);

        this.scene.add.existing(this);
    }
}