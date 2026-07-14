const handleUnauthorized = (response, redirectOnUnauthorized = true) => {
    if (redirectOnUnauthorized && response.status === 401) {
        localStorage.removeItem("token")

        if (window.location.pathname !== "/login") {
            window.location.replace("/login")
        }
    }

    return response
}

const apiFetch = async (path, options, {redirectOnUnauthorized = true} = {}) => {
    const response = await fetch(`${import.meta.env.VITE_API_PATH}${path}`, options)
    return handleUnauthorized(response, redirectOnUnauthorized)
}

export const userRegister = async ({username, password, name, role}) => {
    return await apiFetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            name,
            role
        }),
    }, {redirectOnUnauthorized: false})
}

export const userLogin = async ({username, password}) => {
    return await apiFetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
    }, {redirectOnUnauthorized: false})
}

export const userDetailName = async (token) => {
    return await apiFetch('/users/current', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        },
    })
}

export const userDetailRole = async (token) => {
    return await apiFetch('/users/current', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        },
    })
}

export const userDetail = async (token) => {
    return await apiFetch('/users/current', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        },
    })
}

export const userUpdateProfile = async (token, {name, role}) => {
    return await apiFetch('/users/current', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            name,
            role
        }),
    })
}

export const userUpdatePassword = async (token, {password}) => {
    return await apiFetch('/users/current', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            password,
        }),
    })
}

export const userLogout = async (token) => {
    return await apiFetch('/users/logout', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    })
}
