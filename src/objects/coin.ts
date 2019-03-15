/** 
 * @name   civil-car.ts
 * @author Bastarda
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

export class Coin extends Phaser.GameObjects.Image{
    scaleVal: number;
    coinFrame: number;
    constructor(params: any){
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.scaleVal = 0.4;
        this.setScale(this.scaleVal);
        this.setOrigin(0, 0);
        this.coinFrame = params.frame;
        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(200);
        this.body.setSize(this.width, this.height);
        this.scene.add.existing(this);
    }

    public getFrame(): number{
        return this.coinFrame;
    }

}