// Centralized State Management
class StateManager {
    constructor() {
        this.state = {
            user: null,
            appointments: [],
            medications: [],
            chatHistory: [],
            notifications: []
        };
        this.subscribers = new Map();
        this.loadFromStorage();
    }

    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, []);
        }
        this.subscribers.get(key).push(callback);
    }

    setState(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        // Notify subscribers
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).forEach(callback => {
                callback(value, oldValue);
            });
        }
        
        this.saveToStorage();
    }

    getState(key) {
        return this.state[key];
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('healthApp_state');
            if (stored) {
                this.state = { ...this.state, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('healthApp_state', JSON.stringify(this.state));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    }
}

export default new StateManager();