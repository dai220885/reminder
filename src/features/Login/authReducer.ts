import {Dispatch} from 'redux';


import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authApi, FieldErrorType, LoginParamsType, ResultCode} from '../../api/todoLists-api';
import {SetRequestErrorType, setRequestStatusAC, SetRequestStatusType} from '../../app/appReducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {isAxiosError} from 'axios';

//Для уточнения типа createAsyncThunk в дженерике указываем: что санка возвращает, что санка принимает, что получается, при ошибке
export const loginTC = createAsyncThunk<
	undefined,
	{ loginParams: LoginParamsType },
	{ rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }>('auth/login', async (arg: { loginParams: LoginParamsType }, thunkAPI) => {
	const {dispatch, rejectWithValue} = thunkAPI
	dispatch(setRequestStatusAC({status: 'loading'}))
	try {
		const res = await authApi.login(arg.loginParams)
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(setRequestStatusAC({status: 'succeeded'}))
			//ничего не ретурним в случае успеха, а в кейсе extraReducers просто меняем стейт: state.isLoggedIn = true
			return //можно даже явно не писать return, т.к. в случае успешной логинизации не сработает ветка else в блоке try и не отработает catch, в любом случае вернется undefined
		} else {
			handleServerAppError(dispatch, res.data)
			//return {isLoggedIn: false}
			return rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
		}
	} catch (e) {
		handleServerNetworkError(dispatch, e as any)
		let errorMessage = ''
		if (isAxiosError(e)) {
			errorMessage = e?.response?.data?.error ?? e.message
		} else if (e instanceof Error) {
			errorMessage = e.message
		} else {
			errorMessage = JSON.stringify(e)
		}
		return rejectWithValue({errors: [errorMessage], fieldsErrors: undefined})
	}
})

export const logoutTC = createAsyncThunk('auth/logout',
	async (arg, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(setRequestStatusAC({status: 'loading'}))
		try {
			const res = await authApi.logout()
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(setRequestStatusAC({status: 'succeeded'}))
					//dispatch(setIsLoggedInAC({isLoggedIn: false}))
				//ничего не ретурним в случае успеха, а в кейсе extraReducers просто меняем стейт: state.isLoggedIn = true
				return //можно даже явно не писать return, т.к. в случае успешной логинизации не сработает ветка else в блоке try и не отработает catch, в любом случае вернется undefined
			} else {
				handleServerAppError(dispatch, res.data)
				return rejectWithValue({})
			}
		} catch (e) {
			handleServerNetworkError(dispatch, e as any)
			let errorMessage = ''
			if (isAxiosError(e)) {
				errorMessage = e?.response?.data?.error ?? e.message
			} else if (e instanceof Error) {
				errorMessage = e.message
			} else {
				errorMessage = JSON.stringify(e)
			}
			return rejectWithValue({errors: [errorMessage], fieldsErrors: undefined})
		}
	})

const slice = createSlice({
	name: 'auth',
	initialState: {
		isLoggedIn: false
	},
	reducers: {
		//чтобы все написанное ранее продолжало работать, названия свойств (они же его методы) объекта reducers должны совпадать с назвниями соответствующих actionCreators из redux, а логика должна совпадать с логикой соответствующего кейса из редакс редьюсера
		setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
			//на самом деле сюда приходит stateDraft, что-то вроде "черновика" стейта, после чего библиотека immer его меняет иммутабельно, несмотря на казалось бы мутабельную запись.
			state.isLoggedIn = action.payload.isLoggedIn
		},
	},
	extraReducers: builder => {
		builder
			.addCase(loginTC.fulfilled, (state, action) => {
				//if (action.payload){
				state.isLoggedIn = true
				//}
			})
			.addCase(logoutTC.fulfilled, (state, action) => {
				state.isLoggedIn = false
			})
	}
})

//редьюсер с помощью rtk:
export const authReducer = slice.reducer

//объявим экшен криэйтор setIsLoggedInAC( который возьмем из созданного слайса) который будем использовать в санках
//export const setIsLoggedInAC = slice.actions.setIsLoggedInAC
export const {setIsLoggedInAC} = slice.actions

//thunkCreators:


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




















