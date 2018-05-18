// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {BrowserWindow} = require('electron').remote
const newWindowBtn = document.getElementById('frameless-window')

const path = require('path')

newWindowBtn.addEventListener('click', (event) => {
  const modalPath = path.join('file://', __dirname, 'modal.html')
  let win = new BrowserWindow({ frame: false })

  win.on('close', () => { win = null })
  win.loadURL(modalPath)
  win.show()
})