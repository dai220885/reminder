import {ResultCode, TodoListFromServerType, todoListsApi} from '../../api/todoLists-api';
import {RequestStatusType, SetRequestErrorType, setRequestStatusAC, SetRequestStatusType} from '../../app/appReducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';


//thunk
//Для уточнения типа createAsyncThunk в дженерике указываем: что санка возвращает, что санка принимает, что получается, при ошибке
export const fetchTodoListsTC = createAsyncThunk<{todoLists: TodoListFromServerType[]}, void>(
	'todoLists/fetchTodoLists',
	async (arg, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(setRequestStatusAC({status: 'loading'}))
		try {
			const res = await todoListsApi.getTodoLists()
			dispatch(setRequestStatusAC({status: 'succeeded'}))
			return {todoLists: res.data}
		} catch (e) {
			let errorMessage = ''
			if (isAxiosError(e)) {
				errorMessage = e?.response?.data?.error ?? e.message
			} else if (e instanceof Error) {
				errorMessage = e.message
			} else {
				errorMessage = JSON.stringify(e)
			}
			handleServerNetworkError(dispatch, {message: errorMessage})
			return rejectWithValue(errorMessage)
		}
	}
)

export const addTodoListTC = createAsyncThunk<{newTodoList: TodoListFromServerType}, {newTodoListTitle: string}>(
	'todoLists/addTodoList',
	async (arg, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(setRequestStatusAC({status: 'loading'}))
		try {
		const res = await todoListsApi.createTodoList(arg.newTodoListTitle)
			if (res.data.resultCode === ResultCode.OK) {
				const newTodoList = res.data.data.item
				dispatch(setRequestStatusAC({status: 'succeeded'}))
				return {newTodoList}
			} else {
				handleServerAppError<{ item: TodoListFromServerType }>(dispatch, res.data)
				return rejectWithValue(res.data)
			}
		} catch (e) {
			let errorMessage = ''
			if (isAxiosError(e)) {
				errorMessage = e?.response?.data?.error ?? e.message
			} else if (e instanceof Error) {
				errorMessage = e.message
			} else {
				errorMessage = JSON.stringify(e)
			}
			handleServerNetworkError(dispatch, {message: errorMessage})
			return rejectWithValue(errorMessage)
		}
	}
)

export const removeTodoListTC = createAsyncThunk<{todoListForRemoveId: string } , {todoListForRemoveId: string}>(
	'todoLists/removeTodoList',
	async (arg, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(setRequestStatusAC({status: 'loading'}))
		//изменяет статус конкретного тудулиста, чтобы в нем можно было что-то дизейблить
		dispatch(setEntityStatusAC({todoListForChangeId: arg.todoListForRemoveId, entityStatus: 'loading'}))
		try {
			const res = await todoListsApi.deleteTodoList(arg.todoListForRemoveId)
			if (res.data.resultCode === ResultCode.OK) {
				//dispatch(removeTodoListAC({todoListForRemoveId: arg.todoListForRemoveId}))
				dispatch(setRequestStatusAC({status: 'succeeded'}))
				return arg
			} else {
				handleServerAppError(dispatch, res.data)
				return rejectWithValue(res.data)
			}
		} catch (e) {
			let errorMessage = ''
			if (isAxiosError(e)) {
				errorMessage = e?.response?.data?.error ?? e.message
			} else if (e instanceof Error) {
				errorMessage = e.message
			} else {
				errorMessage = JSON.stringify(e)
			}
			handleServerNetworkError(dispatch, {message: errorMessage})
			return rejectWithValue(errorMessage)
		}
	}
)

export const changeTodoListTitleTC = createAsyncThunk<{todoListForChangeId: string, newTitle: string}, {todoListForChangeId: string, newTitle: string}>(
	'todoLists/changeTodoListTitle',
	async (arg, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(setRequestStatusAC({status: 'loading'}))
		dispatch(setEntityStatusAC({todoListForChangeId: arg.todoListForChangeId, entityStatus: 'loading'}))
	try {
			const res = await todoListsApi.updateTodoList(arg.todoListForChangeId, arg.newTitle)
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(setRequestStatusAC({status: 'succeeded'}))
			dispatch(setEntityStatusAC({todoListForChangeId: arg.todoListForChangeId, entityStatus: 'succeeded'}))
			//return {todoListForChangeId: arg.todoListForChangeId, newTitle: arg.newTitle}
			return arg
		} else {
			handleServerAppError(dispatch, res.data)
			return rejectWithValue(res.data)
		}

	}
	catch (e) {
		let errorMessage = ''
		if (isAxiosError(e)) {
			errorMessage = e?.response?.data?.error ?? e.message
		} else if (e instanceof Error) {
			errorMessage = e.message
		} else {
			errorMessage = JSON.stringify(e)
		}
		handleServerNetworkError(dispatch, {message: errorMessage})
		return rejectWithValue(errorMessage)
	}

	})








const slice = createSlice({
	name: 'todoLists',
	initialState: [] as TodoListType[],
	reducers: {
		//чтобы все написанное ранее продолжало работать, названия свойств (они же его методы) объекта reducers должны совпадать с назвниями соответствующих actionCreators из redux, а логика должна совпадать с логикой соответствующего кейса из редакс редьюсера
		// на самом деле в подредьюсер приходит не state, stateDraft - что-то вроде "черновика" стейта, после чего библиотека immer его меняет иммутабельно, несмотря на казалось бы мутабельную запись.
		// addTodoListAC: (state, action: PayloadAction<{ newTodoList: TodoListFromServerType }>) =>	{
		// 	//просто пушим (в конец) или аншифтим (в начало) новый тудулист в массив тудулистов:
		// 	state.unshift({...action.payload.newTodoList, filter: 'all', entityStatus: 'idle'})
		// },

		// removeTodoListAC: (state, action:PayloadAction<{todoListForRemoveId: string}>) => {
		// 	//мутабельное удаление тудулиста: сначала находим индекс удаляемого тудулиста в массиве, затем удаляем.
		// 	const index = state.findIndex(t => t.id === action.payload.todoListForRemoveId)
		// 	if (index !== -1) {
		// 		state.splice(index, 1)
		// 	}
		// 	//можно было иммутабельно удалить, как раньше удаляли фильтрацией
		// 	//return state.filter(todoList => todoList.id !== action.payload.todoListForRemoveId)
		// },

		// changeTodoListTitleAC: (state, action:PayloadAction<{todoListForChangeId: string, newTitle: string}>)  => {
		// 	//ищем индекс тудулиста с нужной нам айдишкой, затем меняем название у элемента массива с найденным индексом
		// 	const index = state.findIndex(t => t.id === action.payload.todoListForChangeId)
		// 	if (index > -1) {
		// 		state[index].title = action.payload.newTitle
		// 	}
		// },

		changeTodoListFilterAC: (state, action:PayloadAction<{todoListForChangeId: string, newFilterValue: FilterValuesType}>)=> {
			const index = state.findIndex(t => t.id === action.payload.todoListForChangeId)
			if (index > -1) {
				state[index].filter = action.payload.newFilterValue
			}
		},

		// setTodoListsAC: (state, action:PayloadAction<{todoLists: TodoListFromServerType[]}>) => {
		// 	//возвращаем массив тудулистов
		// 	return action.payload.todoLists.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
		// },

		setEntityStatusAC: (state, action:PayloadAction<{todoListForChangeId: string, entityStatus: RequestStatusType}>) => {
			const index = state.findIndex(t => t.id === action.payload.todoListForChangeId)
			if (index > -1) {
				state[index].entityStatus = action.payload.entityStatus
			}
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTodoListsTC.fulfilled, (state, action ) => {
				return action.payload.todoLists.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
			})
			.addCase(addTodoListTC.fulfilled, (state, action) => {
				state.unshift({...action.payload.newTodoList, filter: 'all', entityStatus: 'idle'})
			})
			.addCase(removeTodoListTC.fulfilled, (state, action) => {
				const index = state.findIndex(t => t.id === action.payload.todoListForRemoveId)
				//debugger
				if (index !== -1) {
					state.splice(index, 1)
				}
			})
			.addCase(changeTodoListTitleTC.fulfilled, (state, action) => {
				const index = state.findIndex(t => t.id === action.payload.todoListForChangeId)
				if (index > -1) {
					state[index].title = action.payload.newTitle
				}
			})
	}
})

export const todoListsReducer = slice.reducer
export const {
	//addTodoListAC,
	//removeTodoListAC,
	//changeTodoListTitleAC,
	changeTodoListFilterAC,
	//setTodoListsAC,
	setEntityStatusAC} = slice.actions


//types:
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListType = TodoListFromServerType & {
	filter: FilterValuesType,
	entityStatus: RequestStatusType
}

//export type AddTodoListActionType = ReturnType<typeof addTodoListAC>//экспортируем тип "AddTodoListACType" т.к. этот экшн криэйтор также будем использовать в taskReducer при добавлении пустого массива тасок для нового тудулиста
//export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>//экспортируем тип "RemoveTodoListACType" т.к. этот экшн криэйтор также будем использовать в taskReducer при удалении  массива тасок удаленного тудулиста
//type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>
type ChangeTodoListFilterActionType = ReturnType<typeof changeTodoListFilterAC>
//export type setTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type SetEntityStatusType = ReturnType<typeof setEntityStatusAC>

//Тип экшенов для TodoListReducer (можно не выносить типы в отдельные переменные, а сразу в TodoListsReducerActionsType писать ReturnType<typeof ...> :
export type TodoListsReducerActionsType =
	//AddTodoListActionType
	//| RemoveTodoListActionType
	//| ChangeTodoListTitleActionType
	| ChangeTodoListFilterActionType
	//| setTodoListsActionType
	| SetRequestStatusType
	| SetEntityStatusType
	| SetRequestErrorType