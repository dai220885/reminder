//app-reducer.tsx
import {Dispatch} from 'redux';
import {authApi, ResultCode} from '../api/todoLists-api';
import {setIsLoggedInAC, setIsLoggedInActionType} from '../features/Login/authReducer';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type RequestErrorType = null | string

const initialState = {
    //статус показывает наличие обращения к серверу
    status: 'idle' as RequestStatusType,
    // будет храниться ошибка, которая придет в ответе с сервера (с резалткодом 1)
    error: null as RequestErrorType,
    // инициализация приложения (проверили юзера, получили данные и т.д.)
    isInitialized: false,
}

export type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.payload.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.payload.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.payload.isInitialized}
        default:
            return state
    }
}

//actionCreators
export const setRequestErrorAC = (error: RequestErrorType) => ({type: 'APP/SET-ERROR', payload: {error}} as const)
export const setRequestStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', payload: {status}} as const)
export const setAppIsInitializedAC = (isInitialized: boolean) => ({
    type: 'APP/SET-IS-INITIALIZED',
    payload: {isInitialized}
} as const)

//thunks
export const initializeAppTC = () => (dispatch: Dispatch<AppReducerActionsType>) => {
    authApi.me().then(res => {
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        } else {

        }
        dispatch(setAppIsInitializedAC(true))
    })
}


//types:
export type SetRequestErrorType = ReturnType<typeof setRequestErrorAC>
export type SetRequestStatusType = ReturnType<typeof setRequestStatusAC>
export type SetAppIsInitializedType = ReturnType<typeof setAppIsInitializedAC>

export type AppReducerActionsType =
    | SetRequestStatusType
    | SetRequestErrorType
    | SetAppIsInitializedType
    | setIsLoggedInActionType
