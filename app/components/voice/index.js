import mediator from '../mediator';

class Voice {
    constructor() {
        //console.log('Voice constructor work!');
        this.vox = VoxImplant.getInstance();
        this.vox.addEventListener(VoxImplant.Events.SDKReady, this._handleSDKReady);
        this.vox.addEventListener(VoxImplant.Events.ConnectionEstablished, this._handleConnectionEstablished.bind(this));
        this.vox.addEventListener(VoxImplant.Events.ConnectionFailed, this._handleConnectionFailed);
        this.vox.addEventListener(VoxImplant.Events.ConnectionClosed, this._handleConnectionClosed.bind(this));
        this.vox.addEventListener(VoxImplant.Events.AuthResult, this._handleAuthResult.bind(this));


        console.log('Voice constructor work!');

        navigator.mediaDevices.getUserMedia({audio: true})
            .then(() => navigator.mediaDevices.enumerateDevices())
            .then(devices => ({
                hasMicrophone: devices.some(device => device.kind === 'audioinput'),
            }))
            .catch(() => ({
                hasMicrophone: false,
            }))
            .then(settings => this.vox.init({
                useRTCOnly: true,
                micRequired: settings.hasMicrophone,
            }))
            .then(() => this.vox.connect())
            .catch(e => console.log(e.message || e.name));

    }

    _handleSDKReady() {
        if (typeof console !== 'undefined') {
            console.log('SDK ready!!!');
        }
    }
    _handleConnectionEstablished() {
        const USER_NAME = 'user1';
        const USER_PASS = 'foruser1';
        const ACCOUNT_NAME = 'dovyden';
        const APP_NAME = 'ingipro-practice';
        if (typeof console !== 'undefined') {
            console.log(`Connected to VoxImplant: ${this.vox.connected()}`);
        }
        this.vox.login(`${USER_NAME}@${APP_NAME}.${ACCOUNT_NAME}.voximplant.com`, USER_PASS);
    }

    _handleConnectionFailed(e) {
        if (typeof console !== 'undefined') {
            console.log(`Connection to VoxImplant failed:${ e.message}`);
        }
    }

    _handleConnectionClosed() {
        if (typeof console !== 'undefined') {console.log(`Connected to VoxImplant:${ this.vox.closed()}`);}
    }
    _handleAuthResult(e) {
        if (typeof console !== 'undefined') {
            console.log(`Authorized to VoxImplant:${ e.result } ${ (e.result) ? '' : e.code}`);
        }
        mediator.on('user:join', this._handleUserJoin.bind(this));
    }
    _handleUserJoin(event) {
        this.userName = event.name;
        this.userId = event.name + Date.now();

        this.currentCall = this.vox.call({
            number: 'entrypoint',
            video: false,
            extraHeaders: {
                'X-User-Id': this.userId, // some user id
                'X-User-Name': this.userName, // dovyden
            },
        });
        this.currentCall.addEventListener(VoxImplant.CallEvents.Connected, this._onCallConnected);
        this.currentCall.addEventListener(VoxImplant.CallEvents.Failed, this._onCallFailed);
        this.currentCall.addEventListener(VoxImplant.CallEvents.Disconnected, this._onCallDisconnected);
    }
    _onCallConnected() {
        if (typeof console !== 'undefined') {
            console.log('You are in the conference.');
        }
    }
    _onCallFailed(e) {
        if (typeof console !== 'undefined') {
            console.log(`Call failed:${ e.code }: ${ e.reason}`);
        }
    }
    _onCallDisconnected(e) {
        if (typeof console !== 'undefined') {
            console.log('You left the conference.');
        }
    }
}

// kind of Singleton pattern
export default new Voice();
