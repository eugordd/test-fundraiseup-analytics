class Tracker {
    constructor() {
        this.events = [];
        this.sendTimeoutDelay = 1000;
        this.sendTimeoutId = null;

        const onPageLeave = async () => {
            await this.#forceSend();
        }
        window.addEventListener('beforeunload', onPageLeave);
    }

    async track(event, ...tags) {
        if (typeof(event) !== 'string') return;
        if (tags.length > 0 && tags.some(tag => typeof(tag) !== 'string')) return;

        const eventObj = {
            event,
            tags: [ ...tags ],
            url: document.URL,
            title: document.title,
            ts: new Date().toISOString()
        }
        this.events.push(eventObj);

        if (this.events.length > 2 && !this.sendTimeoutId) {
            await this.#send();
        }
    }

    static async #fetch(events) {
        return await fetch('http://localhost:8001/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                events: JSON.stringify(events)
            })
        });
    }

    static #sendBeacon(events) {
        navigator.sendBeacon(
            'http://localhost:8001/track',
            new URLSearchParams({ events: JSON.stringify(events) })
        );
    }

    async #send() {
        if (this.events.length > 0) {
            let response = await Tracker.#fetch(this.events);
            if (response.status !== 200) {
                this.sendTimeoutId = setTimeout(async () => {
                    await this.#send();
                }, this.sendTimeoutDelay)
                return;
            }
            if (response.status === 200) {
                if (this.sendTimeoutId) clearInterval(this.sendTimeoutId);
                this.events = [];
            }
        }
    }

    async #forceSend() {
        clearInterval(this.sendTimeoutId);
        if (this.events.length > 0) Tracker.#sendBeacon(this.events);
        this.events = [];
    }
}

window.tracker = new Tracker();