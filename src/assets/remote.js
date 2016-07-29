(($, axios) => {
  const getQueryString = (field) => {
    let reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i')
    let string = reg.exec(window.location.href)
    return string ? string[1] : null
  }

  window.clientId = getQueryString('id')

  const sendCommand = (command, value) => {
    axios.post(`/clients/${window.clientId}/commands`, {
      command: command,
      value: value,
    })
  }

  const getCurrentValue = () => {
    let minutes = parseInt($('form#set input#minutes').val())
    let seconds = parseInt($('form#set input#seconds').val())

    return 60 * minutes + seconds
  }

  $('button#start').click(() => {
    sendCommand('start')
    return false
  })
  $('button#reset').click(() => {
    sendCommand('reset')
    return false
  })
  $('form#set').submit(() => {
    sendCommand('set', getCurrentValue())
    return false
  })
})(window.$, window.axios)
