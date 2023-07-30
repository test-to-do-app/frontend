import {configureStore, createSlice} from "@reduxjs/toolkit";

const stateSlice = createSlice({
    name: 'main',
    initialState: {
        isAuthorized: false,
        token: null,
    },
    reducers: {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        setState: (state, action) => {
            return action.payload
        },
        setToken: (state, { payload }) => {
            return {
                ...state,
                token: payload,
                isAuthorized: true,
            }
        },
        logOut: (state) => {
            return {
                ...state,
                token: null,
                isAuthorized: false,
            }
        },
    }
})

export const { setState, setToken, logOut } = stateSlice.actions

const LOCALSTORAGE_KEY = 'state'

let persistedState
try {
    persistedState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
} catch {
    persistedState = null
}

export const store = configureStore({
    reducer: stateSlice.reducer,
    preloadedState: persistedState ? persistedState : stateSlice.getInitialState()
})

// Записываем в localstorage при обновлении Redux
let currentValue
store.subscribe(() => {
    let previousValue = currentValue
    currentValue = store.getState()

    if (previousValue !== currentValue)
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(currentValue))
})

// Наоборот
window.addEventListener('storage', () => {
    let value = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))
    store.dispatch(setState(value))
})