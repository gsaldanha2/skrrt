/**
 * Created by Gregory on 6/12/17.
 */

export default class Connection {

    constructor(serverURL) {

        this._socket = null;

        this.start = () => {
            this._socket = new WebSocket(serverURL);
            this._socket.binaryType = "arraybuffer";
        };

        this.setConnectionCallback = (callback) => {
            this._socket.onopen = callback;
        };

        this.setMessageCallback = (callback) => {
            this._socket.onmessage = callback;
        };

        this.setDisconnectionCallback = (callback) => {
            this._socket.onclose = callback;
        };

        this.send = (data) => {
            // if(this._socket.readyState === this._socket.CLOSED) return;
            this._socket.send(data);
        }

    }

}