const MessageBox = class {
  constructor(title = null, message = null, buttons = null) {
    this.setTitle = (title) => {
      this.title = title;
      return this;
    }

    this.Colors = {
      blue: '#3992D0',
      red: '#E74C3C',
      green: '#2ECC71',
      cyan: '#00CFC8',
      purple: '#6742D1'
    }

    this.setMessage = (message) => {
      this.message = message;
      return this;
    }

    this.buttons = [];
    this.addButton = (text, color = 'blue') => {
      this.buttons.push({ text: text, color: this.Colors[color] || color });
      return this;
    }

    this.show = () => {
      return new Promise(resolve => {
        let boxContainer = document.createElement('div');
        boxContainer.classList.add('message-box-container');

        let box = document.createElement('div');
        box.classList.add('message-box');

        let title = document.createElement('h1');
        title.classList.add('message-box-title');
        title.innerText = this.title;

        let message = document.createElement('p');
        message.classList.add('message-box-message');
        message.innerText = this.message;

        let buttons = document.createElement('div');
        buttons.classList.add('message-box-buttons');

        if (this.buttons.length < 1) {
          this.addButton('OK');
        }
        this.buttons.forEach((button) => {
          let buttonElement = document.createElement('button');
          buttonElement.classList.add('message-box-button');
          buttonElement.innerText = button.text;
          buttonElement.style.backgroundColor = button.color;
          buttonElement.addEventListener('click', () => {
            boxContainer.remove();
            resolve(button.text);
          })
          buttons.appendChild(buttonElement);

        })


        box.appendChild(title);
        box.appendChild(message);
        box.appendChild(buttons);
        boxContainer.appendChild(box);
        document.body.appendChild(boxContainer);
      })
    }

    if (title) {
      this.setTitle(title);
    }
    if (message) {
      this.setMessage(message);
    }

    if (buttons) {
      this.buttons = buttons;
    }
  }
}

module.exports = MessageBox
