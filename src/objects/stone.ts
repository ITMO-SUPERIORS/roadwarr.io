/** 
 * @name   stone.ts
 * @author MantisSuperior
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/

export class Stone extends Phaser.GameObjects.Image{
    scaleVal: number;
    constructor(params: any){
        super(params.scene, params.x, params.y, params.key);
        this.setOrigin(0, 0);

        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(350);
        this.body.setSize(this.width, this.height);
        this.scaleVal = 0.4;
        this.setScale(this.scaleVal);

        this.scene.add.existing(this);

        
    }  
}