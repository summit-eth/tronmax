// TronLogo
setInterval(() => {

    let elem = document.getElementById('TronLogo')

    elem = elem.classList

    if (!elem.contains('animate__animated')) {
        elem.add('animate__animated', 'animate__heartBeat')
        setTimeout(() => {
            elem.remove('animate__animated', 'animate__heartBeat')
        }, 3000)
    }
}, 10000)

