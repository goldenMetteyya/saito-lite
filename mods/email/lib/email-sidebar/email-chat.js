const EmailChatTemplate = require('./email-chat.template.js');

module.exports = EmailChat = {

    render(app, data) {
      document.querySelector(".email-chat").innerHTML = EmailChatTemplate();
    },

    attachEvents(app, data) {

    }
}
