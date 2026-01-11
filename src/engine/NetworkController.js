class NetworkController extends Controller {
    constructor() {
        super();
        this.networkInput = {};
    }

    // Called when data is received from the network
    onNetworkInput(data) {
        if (data.type === 'input') {
            this.networkInput = data.state;
        }
    }

    update(fighter, opponent, deltaTime) {
        // Just copy network state to local input state
        this.input.left = this.networkInput.left || false;
        this.input.right = this.networkInput.right || false;
        this.input.up = this.networkInput.up || false;
        this.input.down = this.networkInput.down || false;
        this.input.attack1 = this.networkInput.attack1 || false;
        this.input.attack2 = this.networkInput.attack2 || false;
    }
}
