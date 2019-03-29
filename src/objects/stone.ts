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
        this.scaleVal = 0.6;
        this.setScale(this.scaleVal);
        this.body.setVelocityY(500);
        this.body.setSize(this.width, this.height);
        

        this.scene.add.existing(this);

        
    }  
}