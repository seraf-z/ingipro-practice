const randomColor = require('randomcolor');
const uuidv4 = require('uuid/v4');
let store = {};
initStore();
let lock = false;
let userLock;
const types = ['camera', 'model', 'mark', 'camera', 'texture'];

function initStore() {
    store = {
        userList: [],
        layout: {},
        model: {},
        mark: {},
        camera: {},
        texture: {},
    };
}

function resetStore() {
    if (store.userList.length === 0){
        initStore();
    }
}

exports.getUser = function (userId) {
    for (let i = 0; i < store.userList.length; i++){
        if (store.userList[i].userId === userId) {
            return store.userList[i];
        }
    }
};

exports.userAdd = function (login) {
    const id = uuidv4();
    store.userList.push({
        userId: id,
        name: login,
        color: randomColor({luminosity: 'light'}),
    });
    return store;
};

exports.userDel = function (userId) {
    for (let i = 0; i < store.userList.length; i++){
        if (store.userList[i].userId === userId){
            const user = store.userList[i];
            store.userList.splice(i, 1);
            resetStore();
            return user;
        }
    }
    return null;
};

exports.lock = function (userId) {
    if (!lock) {
        userLock = userId;
        lock = true;
        return true;
    }
    return false;
};

exports.unlock = function (userId) {
    if (lock && userLock === userId) {
        lock = false;
    }
};

exports.clearWindows = function (type, payload) {
    const delElem = [];
    if (store.layout.hasOwnProperty('layoutIDs')){
        store.layout.layoutIDs.forEach((val) => {
            if (!payload['layoutIDs'].includes(val)){
                delElem.push(val);
            }
        });
    } else {
        store.layout.layoutIDs = [];
    }


    delElem.forEach(val => {
        for (let key of types){
            delete store[key][val];
        }
    });

    store.layout = payload;
};


exports.addData = function (type, payload) {
    // if (lock && userLock === payload.userId){
    const nativeType = type.slice(0, type.indexOf(':'));
    if (types.includes(nativeType)){
        store[nativeType][payload.globalId] = payload;
    }
    return true;
    // }
    // return false;
};
