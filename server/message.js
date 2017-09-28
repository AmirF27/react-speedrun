function Message(type, message) {
  this.type = type;
  this.message = message;
}

function ErrorMessage(message) {
  Message.call(this, 'error', message);
}

function SuccessMessage(message) {
  Message.call(this, 'success', message);
}

module.exports = { ErrorMessage, SuccessMessage };
