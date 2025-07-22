// Advanced Notification System
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
        this.maxNotifications = 5;
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', options = {}) {
        const id = Date.now().toString();
        const notification = this.createNotification(id, message, type, options);
        
        // Remove oldest if at max capacity
        if (this.notifications.size >= this.maxNotifications) {
            const oldestId = this.notifications.keys().next().value;
            this.remove(oldestId);
        }

        this.notifications.set(id, notification);
        this.container.appendChild(notification.element);

        // Auto-remove after duration
        if (options.duration !== 0) {
            setTimeout(() => this.remove(id), options.duration || 5000);
        }

        return id;
    }

    createNotification(id, message, type, options) {
        const element = document.createElement('div');
        element.className = `notification notification-${type}`;
        element.style.cssText = `
            padding: 16px;
            border-radius: 8px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            backdrop-filter: blur(10px);
            color: var(--text-light);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        const icon = this.getIcon(type);
        const content = document.createElement('div');
        content.textContent = message;
        content.style.flex = '1';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-light);
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
        `;
        closeBtn.onclick = () => this.remove(id);

        element.appendChild(icon);
        element.appendChild(content);
        element.appendChild(closeBtn);

        // Animate in
        requestAnimationFrame(() => {
            element.style.transform = 'translateX(0)';
        });

        return { element, type, message };
    }

    getIcon(type) {
        const icon = document.createElement('i');
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        icon.className = iconMap[type] || iconMap.info;
        return icon;
    }

    remove(id) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.element.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.element.parentNode) {
                    notification.element.parentNode.removeChild(notification.element);
                }
                this.notifications.delete(id);
            }, 300);
        }
    }

    clear() {
        this.notifications.forEach((_, id) => this.remove(id));
    }
}

export default new NotificationSystem();