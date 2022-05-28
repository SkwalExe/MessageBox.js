const MessageBox = class {
  constructor(title = null, message = null, buttons = null, askingForFile = false) {
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

    this.askForFile = () => {
      this.askingForFile = true;
      return this;
    }

    this.buttons = [];
    this.addButton = (text, color = 'blue') => {
      this.buttons.push({ text: text, color: this.Colors[color] || color });
      return this;
    }

    this.show = () => new Promise(resolve => {

      if (this.askingForFile) {
        this.buttons = [
          { text: 'Cancel', color: 'red' },
          { text: 'Select', color: 'green' }
        ]
      }

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
          if (this.askingForFile) {
            if (button.text === 'Select')
              resolve(this.fileInput.files[0] || null);
            else if (button.text === 'Cancel')
              resolve(null);
          }
          resolve(button.text);
        })
        buttons.appendChild(buttonElement);

      })

      if (this.askingForFile) {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.classList.add('message-box-file-input');

        this.inputText = document.createElement('p');
        this.inputText.textContent = 'Select or drop a file';

        this.dropZone = document.createElement('div');
        this.dropZone.classList.add('message-box-drop-zone');

        this.dropZone.onclick = () => this.fileInput.click()


        this.dropZone.ondrop = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.fileInput.files = e.dataTransfer.files;
          this.fileInput.oninput();
        }

        this.dropZone.ondragover = (e) => {
          e.preventDefault();
          e.stopPropagation();
        }

        this.fileInput.oninput = () => {
          this.inputText.textContent = this.fileInput.files[0].name;
        }
        this.dropZone.appendChild(this.inputText);
        this.dropZone.appendChild(this.fileInput);
      }


      box.appendChild(title);
      box.appendChild(message);
      if (this.askingForFile)
        box.appendChild(this.dropZone);
      box.appendChild(buttons);


      boxContainer.appendChild(box);
      document.body.appendChild(boxContainer);
    })


    if (title) {
      this.setTitle(title);
    }
    if (message) {
      this.setMessage(message);
    }

    if (buttons) {
      this.buttons = buttons;
    }

    this.askingForFile = askingForFile;
  }
}

module.exports = MessageBox
