module.exports = {
    parse (messages, type) {
        for (let i in messages) {
            if (i == '_external') {
                this.parse(messages[i], type);
                continue;
            }

            this.show(messages[i], type);
        }
    },
    show (msg, type, icon) {
        window.noty({
            layout: 'topRight',
            type: type || 'success',
            icon: icon || 'fa fa-ok',
            text: decodeURIComponent(msg)
        });
    },
    error (message) {
        this.show(message, 'error');
    }
}