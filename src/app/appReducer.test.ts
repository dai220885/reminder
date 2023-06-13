import {appReducer, InitialStateType, setRequestErrorAC, setRequestStatusAC} from '../app/appReducer'

let startState: InitialStateType;

beforeEach(() => {
    startState = {
        error: null,
        status: 'idle',
        isInitialized: false
    }
})

test('correct error message should be set', () => {

    const endState = appReducer(startState, setRequestErrorAC({error: 'some error'}))

    expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {

    const endState = appReducer(startState, setRequestStatusAC({status: 'loading'}))

    expect(endState.status).toBe('loading');
})

