// import { GameEvent } from "../../shared/events.model";

// declare const window: Window;

export class LoginScene extends Phaser.Scene{
    socket: SocketIOClient.Emitter;
    private background: Phaser.GameObjects.TileSprite | undefined;
    private worldHeight: number = 0;
    public formContainer: HTMLDivElement | undefined;
    public loginPage: HTMLDivElement | undefined;
    public form: HTMLDivElement | undefined;
    public loginForm: HTMLFormElement | undefined;
    public inputHTML: HTMLInputElement | undefined;
    public button: HTMLButtonElement | undefined;
    public name: String = "";
    constructor(socket: SocketIOClient.Emitter){
        super({
            key: "LoginScene"
        });
        this.socket = socket;
    }

   create() {
        this.worldHeight = this.game.canvas.height;
        this.background = this.add
            .tileSprite(0, 0, 0, this.worldHeight, "background")
            .setOrigin(0, 0);
        this.background.setScale(1.8, 1.8);
        this.formContainer = document.createElement("div");
        this.formContainer.className = "form-container";
        
        this.loginPage = document.createElement("div");
        this.loginPage.className = "login-page";

        this.form = document.createElement("div");
        this.form.className = "form";

        this.loginForm = document.createElement("form");

        this.inputHTML = document.createElement("input");
        this.inputHTML.setAttribute("type", "text");
        this.inputHTML.placeholder = "username";
        this.inputHTML.id = "your-name";
        this.inputHTML.focus();

        this.button = document.createElement("button");
        this.button.innerText = "Join game";
        this.button.addEventListener("click", e => this.createPlayer(e));

        this.loginForm.appendChild(this.inputHTML);
        this.loginForm.appendChild(this.button);
        this.loginPage.appendChild(this.form);
        this.form.appendChild(this.loginForm);
        this.formContainer.appendChild(this.loginPage);

        document.body.appendChild(this.formContainer);
    }

    private createPlayer(e: Event): void {
        e.preventDefault();
        this.toggleLogin();
        if (this.inputHTML)
            this.name = this.inputHTML.value;
        if (this.socket){
            this.socket.emit('login');
            this.scene.start("MenuScene", this.socket)

        }
    }

    private toggleLogin(): void {
        if (this.formContainer)
            this.formContainer.classList.toggle("visible");
    }
}