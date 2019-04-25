//database class - wrapper around firebase
//set information - key value 
//set reactive callback for getting the value


class Database{
    constructor() {
        this.keyValues = {};
        this.keyCallbacks = {};

    }
    setValue(key, value){
        this.keyValues[key] = value;
        if (this.keyCallbacks[key]){
            this.keyCallbacks[key](value);
        }
    }
    onSetValue(key, callback){
        this.keyCallbacks[key] = callback;
        if (this.keyValues[key]){
            callback(this.keyValues[key]);
        }
    }
}
