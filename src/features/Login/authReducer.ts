import {Dispatch} from 'redux';


import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authApi, LoginParamsType, ResultCode} from 'api/todoLists-api';
import {SetRequestErrorType, setRequestStatusAC, SetRequestStatusType} from 'app/appReducer';
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils';

//больше не нужна типизация инишл стейта
const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        //чтобы все написанное ранее продолжало работать, названия свойств (они же его методы) объекта reducers должны совпадать с назвниями соответствующих actionCreators из redux, а логика должна совпадать с логикой соответствующего кейса из редакс редьюсера
        setIsLoggedInAC: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            //на самом деле сюда приходит stateDraft, что-то вроде "черновика" стейта, после чего библиотека immer его меняет иммутабельно, несмотря на казалось бы мутабельную запись.
            state.isLoggedIn = action.payload.isLoggedIn
        }

    }
})

//редьюсер с помощью redux (больше не используем):
// export const _authReducer = (state: LoginStateType = initialState, action: LoginReducerActionsType): LoginStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN': {
//             return {...state, isLoggedIn: action.payload.isLoggedIn}
//         }
//         default:
//             return state
//     }
// }

//редьюсер с помощью rtk:
export const authReducer = slice.reducer

//actionCreators:

// export const setIsLoggedInAC = (isLoggedIn: boolean) =>{
//     return{type: 'login/SET-IS-LOGGED-IN', payload: {isLoggedIn}} as const
// }

//объявим экшен криэйтор setIsLoggedInAC( который возьмем из созданного слайса) который будем использовать в санках
//export const setIsLoggedInAC = slice.actions.setIsLoggedInAC
export const {setIsLoggedInAC} = slice.actions

//thunkCreators:
export const _loginTC = (data: LoginParamsType) => (dispatch: Dispatch <LoginReducerActionsType>) => {
    //debugger
    dispatch(setRequestStatusAC({status: 'loading'}))
    authApi.login(data)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(setIsLoggedInAC({isLoggedIn: true}))
                dispatch(setRequestStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e) => {
        handleServerNetworkError(dispatch, e)
    })
}

//то же самое, но с использованием async await
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch <LoginReducerActionsType>) => {
    //debugger
    dispatch(setRequestStatusAC({status: 'loading'}))
    try {
        const res = await authApi.login(data)
        if (res.data.resultCode === ResultCode.OK) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
            dispatch(setRequestStatusAC({status: 'succeeded'}))
        } else {
            handleServerAppError(dispatch, res.data)
        }
    }
    catch (error) {
        handleServerNetworkError(dispatch, error as any)
    }
}



export const logoutTC = () => (dispatch: Dispatch <LoginReducerActionsType>) => {
    //debugger
    dispatch(setRequestStatusAC({status: 'loading'}))
    authApi.logout()
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                //alert('success')
                dispatch(setIsLoggedInAC({isLoggedIn: false}))
                dispatch(setRequestStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e) => {
        handleServerNetworkError(dispatch, e)
    })
}




//types:
//больше не нужна типизация инишл стейта
// type LoginStateType = {
//     isLoggedIn: boolean
// }

export type setIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
export type LoginReducerActionsType =
    | SetRequestStatusType
    | SetRequestErrorType
    | setIsLoggedInActionType




















