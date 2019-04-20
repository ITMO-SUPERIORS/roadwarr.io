"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_model_1 = require("../../shared/events.model");
class LoginScene {
    constructor() {
        this.createForm();
    }
    createForm() {
        this.formContainer = document.createElement("div");
        this.formContainer.className = "form-container";
        this.loginPage = document.createElement("div");
        this.loginPage.className = "login-page";
        this.form = document.createElement("div");
        this.form.className = "form";
        this.loginForm = document.createElement("form");
        this.input = document.createElement("input");
        this.input.setAttribute("type", "text");
        this.input.placeholder = "username";
        this.input.id = "your-name";
        this.input.focus();
        this.button = document.createElement("button");
        this.button.innerText = "Join game";
        this.button.addEventListener("click", e => this.createPlayer(e));
        this.loginForm.appendChild(this.input);
        this.loginForm.appendChild(this.button);
        this.loginPage.appendChild(this.form);
        this.form.appendChild(this.loginForm);
        this.formContainer.appendChild(this.loginPage);
        document.body.appendChild(this.formContainer);
    }
    createPlayer(e) {
        e.preventDefault();
        this.toggleLogin();
        const name = this.input.value;
        window.socket.emit(events_model_1.GameEvent.authentification, { name }
        // {
        //     x: window.innerWidth,
        //     y: window.innerHeight,
        // }
        );
    }
    toggleLogin() {
        this.formContainer.classList.toggle("visible");
    }
}
exports.LoginScene = LoginScene;
//# sourceMappingURL=login-scene.js.map