browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { action, message, ideKey = 'PHPSTORM' } = request
    let state

    if (action === 'getState') {
        getState(ideKey).then(state => sessionStorage.setItem('state', state))
    } else if (action === 'setState') {
        setState(ideKey, message).then(state => sessionStorage.setItem('state', state))
    }

    sendResponse(sessionStorage.getItem('state') || 'disable')
})

const getState = async ideKey => {
    let state = 'disable'

    if (await getCookie('XDEBUG_SESSION') == ideKey) {
        state = 'debug'
    } else if (await getCookie('XDEBUG_PROFILE') == ideKey) {
        state = 'profile'
    } else if (await getCookie('XDEBUG_TRACE') == ideKey) {
        state = 'trace'
    }

    return state
}

const setState = async (ideKey, newState) => {
    if (newState == 'debug') {
        await setCookie('XDEBUG_SESSION', ideKey, 24)
        await deleteCookie('XDEBUG_PROFILE')
        await deleteCookie('XDEBUG_TRACE')
    } else if (newState == 'profile') {
        await deleteCookie('XDEBUG_SESSION')
        await setCookie('XDEBUG_PROFILE', ideKey, 24)
        await deleteCookie('XDEBUG_TRACE')
    } else if (newState == 'trace') {
        await deleteCookie('XDEBUG_SESSION')
        await deleteCookie('XDEBUG_PROFILE')
        await setCookie('XDEBUG_TRACE', ideKey, 24)
    } else {
        await deleteCookie('XDEBUG_SESSION')
        await deleteCookie('XDEBUG_PROFILE')
        await deleteCookie('XDEBUG_TRACE')
    }

    return await getState(ideKey)
}

const getTabUrl = async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    return tabs[0].url
}

const setCookie = async (name, value, hours) => browser.cookies.set({
    url: await getTabUrl(),
    name,
    value,
    path: '/',
})

const getCookie = async name => {
    const cookie = await browser.cookies.get({
        url: await getTabUrl(),
        name
    })
    return cookie && cookie.value
}

const deleteCookie = async name => browser.cookies.remove({
    url: await getTabUrl(),
    name,
    path: '/',
})
