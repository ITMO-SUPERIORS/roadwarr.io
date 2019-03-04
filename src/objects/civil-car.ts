/** 
 * @name   civil-car.ts
 * @author Bastarda
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

export class CivilCar extends Phaser.GameObjects.Image{
    constructor(params){
        super(params.scene, params.x, params.y, params.key);
        this.setOrigin(0, 0);

        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(200);
        this.body.setSize(72, 84);

        this.scene.add.existing(this);

        
    }  
}