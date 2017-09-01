import './style.css';
import mediator from '../mediator';

class Login {
    constructor(domNode) {
        this._domNode = domNode;

        this._domNode.querySelector('form').addEventListener('submit', this._submit.bind(this));
        this._domNode.querySelector('.btn-default').addEventListener('click', this._submit.bind(this));
    }

    hide() {
        this._domNode.classList.add('hide');
    }

    show() {
        this._domNode.classList.remove('hide');
    }

    _submit(event) {
        event.preventDefault();
        const value = this._domNode.querySelector('.js-input').value;

        if (value) {
            mediator.emit("user:join", { 'name': value });
        }
    }
}

export default Login;
