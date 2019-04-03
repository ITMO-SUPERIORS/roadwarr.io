/** 
 * @name   player.ts
 * @author Bastarda
 * @description roadwarr.io: Object
 * @template Digitsensitive <digit.sensitivee@gmail.com>
**/
 
export class Player extends Phaser.GameObjects.Image{
    private cursors: Phaser.Input.Keyboard.CursorKeys;
    private speed: number;
    private isDead: boolean;
    private scaleVal: number;
    constructor(params){
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.initVariables();
        // sprite
        this.initImage();
        
        // input
        this.initInput();

        this.scaleVal = 0.8;
        this.setScale(this.scaleVal);
        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setSize(this.width, this.height);

        this.scene.add.existing(this);
    }

    // инициализация переменных
    private initVariables(): void {
        this.speed = 4;
        this.isDead = false;
        // this.diagSpeed = this.speed / Math.sqrt(this.speed); // скорость по диагонали    
    }
    
    private initImage(): void {
        this.setOrigin(0.5, 0.5);
    }
    private initInput(): void {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    // public setVelocity(velocity: number): void{
    //     this.body.setVelocityY(velocity);
    // }

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
        if(this.cursors.right.isDown && this.cursors.down.isDown){
            // this.x += this.diagSpeed;
            // this.y += this.diagSpeed;
            this.x += this.speed;
            this.y += this.speed;
        } else if(this.cursors.right.isDown && this.cursors.up.isDown){
            // this.x += this.diagSpeed;
            // this.y -= this.diagSpeed;
            this.x += this.speed;
            this.y -= this.speed;
        } else if(this.cursors.left.isDown && this.cursors.down.isDown){
            // this.x -= this.diagSpeed;
            // this.y += this.diagSpeed;
            this.x -= this.speed;
            this.y += this.speed;
        } else if(this.cursors.left.isDown && this.cursors.up.isDown){
            // this.x -= this.diagSpeed;
            // this.y -= this.diagSpeed;
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

