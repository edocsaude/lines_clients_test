const electron = require('electron')
const swal = require('sweetalert2')
const R = require('ramda')

const lineService = electron.remote.require('./src/line_service')

function getTicket(preferred) {

  const t = { teste: 'teste' }
  swal({
    title: 'Imprimindo senha',
    text: 'Aguarda alguns instantes',
  })
  swal.showLoading()

  return lineService.createTicket(preferred)
    .then(ticket => {
      return electron
      .ipcRenderer
      .sendSync('print-ticket', ticket)
    })
    .then(() => swal({
      title: 'Sua senha foi impressa',
      type: 'success',
      timer: 1500,
      showConfirmButton: false,
    }).catch(swal.noop))
    .catch(() => swal({
      title: 'Erro ao imprimir senha',
      type: 'error',
      timer: 1500,
      showConfirmButton: false,
    }).catch(swal.noop))
}

electron.ipcRenderer.on('logo', (event, logo) => {
  if (logo) {
    document.getElementById('logo-header').src = logo
  } else {
    document.getElementById('logo-header').style.display = 'none'
  }
})

document.addEventListener('DOMContentLoaded', function() {
  electron.ipcRenderer.send('get-logo')

  document.getElementById('normal_queue')
    .addEventListener('click', () => {
      getTicket(false)
    })

  document.getElementById('preferencial_queue')
    .addEventListener('click', () => {
      getTicket(true)
    })
})
