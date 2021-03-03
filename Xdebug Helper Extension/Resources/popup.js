const sendMessage = message => event => {
    document.querySelectorAll('button').forEach(el => el.classList.remove('enabled'))
    event.target.classList.add('enabled')
    browser.runtime.sendMessage({ action: 'setState', message })
}

document.addEventListener('DOMContentLoaded', async () => {
    const state = await browser.runtime.sendMessage({ action: 'getState' })
    if (state) {
        document.querySelector(`button[id=${state}]`).classList.add('enabled')
    }
    
    ['debug', 'profile', 'trace', 'disable'].forEach(message => document.getElementById(message).addEventListener('click', sendMessage(message)))
})
