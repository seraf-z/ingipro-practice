import mediator from '../mediator';
import './style.css';

const SHOW_DURATION = 2000;
const POPUP_SHOW_STYLE = 'popup-show';
const INITIAL_LOCK_STATUS = 'Управление доступно для захвата';

const LOCK_STATUS = {
    tryLock: 'Попытка захвата управления...',
    lockAccepted: 'Успешный захват управления!',
    lockDenied: 'Захват управления не удался!',
};

const LABEL_STYLE = {
    tryLock: 'popup-try-lock',
    lockAccepted: 'popup-lock-accepted',
    lockDenied: 'popup-lock-denied',
};

class Popup {

    constructor(domNode) {
        this._domNodes = Array.from(domNode);

        //parse .popup-label 'p's into .popup-locker 'div's
        this._innerPs = this._domNodes.map((currVal) => {
            return currVal.querySelector('.popup-label');
        });
        this._innerPs[1].innerHTML = INITIAL_LOCK_STATUS;

        this._timerId = null;

        this._hide = this._hidePopup.bind(this);

        mediator.on('canvas:lock', this.lockStatusHandler.bind(this));
        mediator.on('lock:*', this.lockStatusHandler.bind(this));
        mediator.on('conference:lock', this.showActiveLocker.bind(this));
        mediator.on('conference:unlock', this.showActiveLocker.bind(this));
    }

    _resetDeferred() {
        if (this._timerId) {
            clearTimeout(this._timerId);
        }

        this._timerId = null;
    }

    _setClass(className, nodeToModify, classContainer) {
        if (!nodeToModify.classList.contains(className)) {
            if (classContainer !== 'undefined') {
                for (let prop in classContainer) {
                    nodeToModify.classList.remove(classContainer[prop]);
                }
            }

            nodeToModify.classList.add(className);
        }
    }

    _showPopup() {
        this._domNodes[0].classList.add(POPUP_SHOW_STYLE);
        this._timerId = setTimeout(this._hide, SHOW_DURATION);
    }

    _hidePopup() {
        this._domNodes[0].classList.remove(POPUP_SHOW_STYLE);
        this._resetDeferred();
    }

    hide() {
        this._domNodes.forEach((currNode) => {
            currNode.classList.add('hide');
        });
    }

    show() {
        this._domNodes.forEach((currNode) => {
            currNode.classList.remove('hide');
        });
    }

    lockStatusHandler(data, type) {
        const parsedType = type.split(':');
        let typeHandler = 'tryLock';

        //if event type name is not 'canvas:lock' (but 'lock:[accept/denied]')
        if (parsedType[0] !== 'canvas') {
            typeHandler = (parsedType[1] === 'accept') ? 'lockAccepted' :
                'lockDenied';
        }

        if (!!this._timerId) {
            this._resetDeferred();
        }

        this._innerPs[0].innerHTML = LOCK_STATUS[typeHandler];
        this._setClass(LABEL_STYLE[typeHandler], this._domNodes[0],
            LABEL_STYLE);

        this._showPopup();
    }

    showActiveLocker(data, type) {
        let status;
        let eventType = type.split(':')[1];

        if (eventType === 'lock') {
            status = 'Управление: ' + data.name;
        } else {
            status = INITIAL_LOCK_STATUS;
        }

        this._innerPs[1].innerHTML = status;
    }
};

export default Popup;
