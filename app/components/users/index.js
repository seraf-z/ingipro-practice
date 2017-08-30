import './style.css';
import mediator from '../mediator';

class Users {
    constructor(domNode) {
        this._domNode = domNode;

        this._domNode.querySelector('.microphone-button').addEventListener('click', this._changeButton.bind(this));

        this._currentUser = '';
        this._stateButton = true;

        mediator.on('conference:sync', this._showUsers.bind(this));
        mediator.on('conference:join', this._addUser.bind(this));
        mediator.on('conference:leave', this._deleteUser.bind(this));

    }

    hide() {
        this._domNode.classList.add('hide');
    }

    show() {
        this._domNode.classList.remove('hide');
    }

    _showUsers(payload) {
        payload.userList.forEach(item => this._showUser(item));

        this._currentUser = payload.userList[payload.userList.length - 1];
    }

    _showUser(item) {
        const newUser = document.createElement('div');
        newUser.id = item.userId;
        newUser.className = 'user';
        this._domNode.appendChild(newUser);

        const userColor = document.createElement('div');
        userColor.className = 'userColor';
        userColor.innerHTML = '●';
        userColor.style.color = item.color;
        newUser.appendChild(userColor);

        const userName = document.createElement('div');
        userName.className = 'userName';
        userName.innerHTML = item.name;
        newUser.appendChild(userName);
    }

    _addUser(payload) {
        this._showUser(payload);
    }

    _deleteUser(payload) {
        document.getElementById(payload.userId).remove();
    }

    _changeButton() {
        const microphoneButton = this._domNode.querySelector('.microphone-text');
        const microphoneIcon = this._domNode.querySelector('.microphone-icon');

        mediator.emit('voice:mute', this._currentUser);

        if (this._stateButton === true) {
            this._stateButton = false;
            microphoneButton.innerHTML = 'Микрофон выключен';
            microphoneIcon.src = 'https://png.icons8.com/mute-unmute/ios7/25';
        } else {
            this._stateButton = true;
            microphoneButton.innerHTML = 'Микрофон включен';
            microphoneIcon.src = 'https://png.icons8.com/microphone/ios7/25';
        }
    }
}

export default Users;
