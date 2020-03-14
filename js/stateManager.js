import Connection from './connection';

export default class StateManager {

    constructor() {
        this.state = undefined;
        this.animation = undefined;
        this.connection = undefined;

        this.connect = (address) => {
            if(this.connection) this.connection.close();
            this.connection = new Connection(address);
            this.connection.start();
        };

        this.switchState = (state) => {
            this.state = state;
        }
    }

}