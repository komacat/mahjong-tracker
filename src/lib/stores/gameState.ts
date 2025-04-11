import { writable } from 'svelte/store'
import type { State } from '$lib/game/state'

const initialState: State = {
    round: 0,
    match: {
        state: 'RUNNING',
    },
    richi: 0,
    repeat: 0,
    players: [],
    history: [],
}

export const gameState = writable<State>(initialState)
