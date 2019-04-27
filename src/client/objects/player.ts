/** 
 * @name   player.ts
 * @author Bastarda
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
import { GMObject } from "../models"
export class Player extends Phaser.GameObjects.Image{
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private speed: number;
    private isDead: boolean;
    private scaleVal: number;
    constructor(params: GMObject){
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.speed = 4;
        this.isDead = false;

        // sprite
        this.setOrigin(0.5, 0.5);

        // input
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.scaleVal = 0.8;
        this.setScale(this.scaleVal);
        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(this.width, this.height);

        this.scene.add.existing(this);
    }

    // Смэрть
    public getDead(): boolean{
        return this.isDead;
    }
    public setDead(dead: boolean): void {
        this.isDead = dead;
    }

    update(): void{
        this.handleImput();
    }

    // управление автомобилем
    private handleImput(): void{
        if (this.cursors.right && this.cursors.left && this.cursors.up && this.cursors.down)
            if(this.cursors.right.isDown && this.cursors.down.isDown){
                this.x += this.speed;
                this.y += this.speed;
            } else if(this.cursors.right.isDown && this.cursors.up.isDown){
                this.x += this.speed;
                this.y -= this.speed;
            } else if(this.cursors.left.isDown && this.cursors.down.isDown){
                this.x -= this.speed;
                this.y += this.speed;
            } else if(this.cursors.left.isDown && this.cursors.up.isDown){
                this.x -= this.speed;
                this.y -= this.speed;
            } else if (this.cursors.right.isDown){
                this.x += this.speed;
            } else if(this.cursors.left.isDown){
                this.x -= this.speed;
            } else if(this.cursors.up.isDown){
                this.y -= this.speed;
            } else if(this.cursors.down.isDown){
                this.y += this.speed;
            } 
    }
    
}

