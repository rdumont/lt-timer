(($) => {
  let clientId
  let es = new EventSource('/sse')
  es.addEventListener('client-id', (message) => {
    clientId = JSON.parse(message.data).id
    $('#client-id span').text(clientId)
    let url = 'http://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
      window.location.href + '/remote?id=' + clientId
    $('#client-id img').attr('src', url)
  })

  es.addEventListener('message', (message) => {
    let json = JSON.parse(message.data)
    switch (json.command) {
      case 'start':
        timer.start()
        console.log('start')
        break

      case 'reset':
        timer.reset()
        console.log('reset')
        break

      case 'set':
        timer.set(json.value)
        console.log('set to ' + json.value)
        break
    }
  })

  const pad = (value) => value >= 10 ? value.toString() : '0' + value
  let audio = document.getElementById('myAudio')
  audio.loop = true

  let timer = new function () {
    let _self = this
    _self.startTime = 300
    _self.currentTime = 300
    _self.running = false
    _self.interval = undefined

    _self.start = () => {
      if (_self.running) {
        clearInterval(_self.interval)
        _self.running = false
        $('div#indicator').attr('class', 'paused')
      } else {
        _self.interval = setInterval(() => _self.update(_self.currentTime - 1), 1000)
        _self.running = true
        $('div#indicator').attr('class', 'running')
      }
    }

    _self.reset = () => {
      _self.dismiss()
      if (_self.running) {
        clearInterval(_self.interval)
        _self.running = false
      }
      $('div#indicator').attr('class', 'paused')
      _self.update(_self.startTime)
    }

    _self.set = (value) => {
      _self.startTime = value
      _self.reset()
    }

    _self.update = (value) => {
      if (value <= 0) {
        value = 0
        _self.alarm()
      }

      _self.currentTime = value
      $('#minutes').text(pad(Math.floor(value / 60)))
      $('#seconds').text(pad(value % 60))
    }

    _self.alarm = () => {
      _self.running = false
      clearInterval(_self.interval)
      $('div#indicator').attr('class', 'alarm')
      audio.play()
    }

    _self.dismiss = () => {
      audio.pause()
      audio.load()
    }
  }()

  $('button#show-code').click(() => $('p#client-id').toggle())
})(window.$)
