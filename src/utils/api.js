import {api} from "../config";
import {store} from "./reducer.js";


export const ApiRequest = {
    get: async (endpoint, params) => {
        return request(endpoint, {
            method: 'GET',
            headers: api.headers,
        }, params)
    },
    post: async (endpoint, body) => {
        return request(endpoint, {
            method: 'POST',
            headers: api.headers,
            body: JSON.stringify(body)
        })
    },
    put: async (endpoint, body) => {
        return request(endpoint, {
            method: 'PUT',
            headers: api.headers,
            body: JSON.stringify(body)
        })
    },
    patch: async (endpoint, body) => {
        return request(endpoint, {
            method: 'PATCH',
            headers: api.headers,
            body: JSON.stringify(body)
        })
    },
    delete: async (endpoint) => {
        return request(endpoint, {
            method: 'DELETE',
            headers: api.headers,
        })
    }
}

async function request(endpoint, requestOptions, params) {
    let url = new URL(api.baseUrl + endpoint)

    const token = store.getState().token
    if (token) requestOptions.headers[api.tokenHeaderName] = store.getState().token

    if (params) {
        for (let k in params) {
            url.searchParams.append(k, params[k])
        }
    }
    return fetch(
        url,
        Object.assign({
            credentials: 'include',
        }, requestOptions)

    ).then(async (response) => {
        let json

        try {
            json = await response.json()
        } catch {
            json = {}
        }

        json._statusCode = response.status
        json._ok = response.status < 400

        console.log(json._ok, json)

        return json
    })

    .catch((error) => {
        console.error(error)
    })
}
