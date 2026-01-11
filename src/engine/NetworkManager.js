

class NetworkManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.isHost = false;
        this.callbacks = {
            onOpen: () => { },
            onData: () => { },
            onClose: () => { }
        };
    }

    async init() {
        // PeerJS provided via <script> tag in index.html
        // const { Peer } = await import('https://esm.sh/peerjs@1.5.2?bundle-deps'); 
        // global Peer

        if (typeof Peer === 'undefined') {
            console.error('PeerJS not loaded');
            return;
        }

        this.peer = new Peer();

        return new Promise((resolve) => {
            this.peer.on('open', (id) => {
                console.log('My peer ID is: ' + id);
                resolve(id);
            });

            this.peer.on('connection', (conn) => {
                this.handleConnection(conn);
            });
        });
    }

    connect(peerId) {
        if (!this.peer) return;
        const conn = this.peer.connect(peerId);
        this.handleConnection(conn);
    }

    handleConnection(conn) {
        this.conn = conn;

        this.conn.on('open', () => {
            console.log('Connected to peer');
            this.callbacks.onOpen();
        });

        this.conn.on('data', (data) => {
            this.callbacks.onData(data);
        });

        this.conn.on('close', () => {
            console.log('Connection closed');
            this.callbacks.onClose();
        });
    }

    send(data) {
        if (this.conn && this.conn.open) {
            this.conn.send(data);
        }
    }

    on(event, callback) {
        if (this.callbacks[event] !== undefined) {
            this.callbacks[event] = callback;
        }
    }
}
