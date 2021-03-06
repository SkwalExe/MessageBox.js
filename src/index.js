const MessageBox = class {
  constructor() {
    this.Colors = {
      blue: '#3992D0',
      red: '#E74C3C',
      green: '#2ECC71',
      cyan: '#00CFC8',
      purple: '#6742D1'
    }

    this.message = ''
    this.title = ''

    this.buttons = [];

    this.askingFor = 'button'

    this.setTitle = (title) => {
      this.title = title;
      return this;
    }

    this.setMessage = (message) => {
      this.message = message;
      return this;
    }

    this.addButton = (text, color = 'blue') => {
      this.buttons.push({ text: text, color: this.Colors[color] || color });
      return this;
    }

    this.askForFile = (multiple = false, accept = null) => {
      this.askingFor = 'file';
      this.multipleFiles = multiple;
      this.accept = accept;
      return this;
    }

    this.askForInput = (placeholder = '', charLimit = null) => {
      this.askingFor = 'input';
      this.placeholder = placeholder;
      this.charLimit = charLimit;
      return this;
    }

    this.show = () => new Promise(resolve => {
      /*
       * Check if a string matches a MIME type :
       * "image/*" matches "image/png" and "image/jpeg" and so on
       * "image/gif" matches "image/gif" only
       */
      let validateFileFormat = (acceptedTypes, type) => {
        return acceptedTypes.replace(/\s/g, '').split(',').filter(accept => {
          return new RegExp(accept.replace(/\*/g, '.*')).test(type);
        }).length > 0;
      }


      if (this.askingFor === 'file') {
        this.buttons = [
          { text: 'Cancel', color: 'red' },
          { text: 'Select', color: 'green' }
        ]
      } else if (this.askingFor === 'input') {
        this.buttons = [
          { text: 'Cancel', color: 'red' },
          { text: 'OK', color: 'green' }
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
          if (this.askingFor === 'file') {
            if (button.text === 'Select') {
              if (this.multipleFiles)
                resolve(this.fileInput.files || null);
              resolve(this.fileInput.files[0] || null);
            } else if (button.text === 'Cancel')
              resolve(null);
          } else if (this.askingFor === 'input') {
            if (button.text === 'OK')
              resolve(this.input.value);
            else
              resolve(null);
          }
          resolve(button.text);
        })
        buttons.appendChild(buttonElement);

      })

      if (this.askingFor === 'file') {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.classList.add('message-box-file-input');
        if (this.multipleFiles)
          this.fileInput.setAttribute('multiple', 'multiple');
        if (this.accept)
          this.fileInput.accept = this.accept;

        this.inputText = document.createElement('p');
        this.inputText.textContent = 'Select or drop a file';

        this.dropZone = document.createElement('div');
        this.dropZone.classList.add('message-box-drop-zone');

        this.dropZone.onclick = () => this.fileInput.click()


        this.dropZone.ondrop = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.accept && Array.from(e.dataTransfer.files).some(file => !validateFileFormat(this.accept, file.type))) {
            this.inputText.textContent = 'Invalid file format, accpeted formats are: ' + this.accept;
            return;
          }
          if (!this.multipleFiles && e.dataTransfer.files.length > 1) {
            this.inputText.textContent = 'Only one file can be selected';
            return;
          }
          this.fileInput.files = e.dataTransfer.files;
          this.fileInput.oninput();
        }

        this.dropZone.ondragover = (e) => {
          e.preventDefault();
          e.stopPropagation();
        }

        this.fileInput.oninput = () => {
          this.inputText.textContent = Array.from(this.fileInput.files).map(file => file.name).join(', ');
        }
        this.dropZone.appendChild(this.inputText);
        this.dropZone.appendChild(this.fileInput);
      } else if (this.askingFor === 'input') {
        this.input = document.createElement('input');
        this.input.classList.add('message-box-input');
        this.input.placeholder = this.placeholder;
        if (this.charLimit)
          this.input.maxLength = this.charLimit;
      }


      box.appendChild(title);
      box.appendChild(message);
      if (this.askingFor === 'file')
        box.appendChild(this.dropZone);
      else if (this.askingFor === 'input')
        box.appendChild(this.input);
      box.appendChild(buttons);


      boxContainer.appendChild(box);
      document.body.appendChild(boxContainer);
    })
  }
}

module.exports = MessageBox
