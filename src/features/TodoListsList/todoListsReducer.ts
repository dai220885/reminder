import {v1} from 'uuid';
import {ResultCode, TodoListFromServerType, todoListsApi} from '../../api/todoLists-api';
import {Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {
	AppReducerActionsType,
	RequestStatusType,
	setRequestErrorAC,
	SetRequestErrorType,
	setRequestStatusAC,
	SetRequestStatusType
} from '../../app/appReducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppThunk} from 'app/store';

const initialState: TodoListType[] = [
	// {id: todoListId1, title: 'What to learn', filter: 'all'},
	// {id: todoListId2, title: 'What to buy', filter: 'all'},
]

const slice = createSlice({
	name: 'todoLists',
	initialState,
	reducers: {
		//чтобы все написанное ранее продолжало работать, названия свойств (они же его методы) объекта reducers должны совпадать с назвниями соответствующих actionCreators из redux, а логика должна совпадать с логикой соответствующего кейса из редакс редьюсера
		// на самом деле в подредьюсер приходит не state, stateDraft - что-то вроде "черновика" стейта, после чего библиотека immer его меняет иммутабельно, несмотря на казалось бы мутабельную запись.
		addTodoListAC: (state, action: PayloadAction<{ newTodoList: TodoListFromServerType }>) =>	{
			//просто пушим (в конец) или аншифтим (в начало) новый тудулист в массив тудулистов:
			state.unshift({...action.payload.newTodoList, filter: 'all', entityStatus: 'idle'})
		},

		removeTodoListAC: (state, action:PayloadAction<{todoListForRemoveId: string}>) => {
			//мутабельное удаление тудулиста: сначала находим индекс удаляемого тудулиста в массиве, затем удаляем.
			const index = state.findIndex(t => t.id === action.payload.todoListForRemoveId)
			if (index !== -1) {
				state.splice(index, 1)
			}
			//можно было иммутабельно удалить, как раньше удаляли фильтрацией
			//return state.filter(todoList => todoList.id !== action.payload.todoListForRemoveId)
		},

		changeTodoListTitleAC: (state, action:PayloadAction<{todoListForChangeId: string, newTitle: string}>)  => {
			//ищем индекс тудулиста с нужной нам айдишкой, затем меняем название у элемента массива с найденным индексом
			const index = state.findIndex(t => t.id === action.payload.todoListForChangeId)
			if (index > -1) {
				state[index].title = action.payload.newTitle
			}
		},

		changeTodoListFilterAC: (state, action:PayloadAction<{todoListForChangeId: string, newFilterValue: FilterValuesType}>)=> {
			const index = state.findIndex(t => t.id === action.payload.todoListForChangeId)
			if (index > -1) {
				state[index].filter = action.payload.newFilterValue
			}
		},

		setTodoListsAC: (state, action:PayloadAction<{todoLists: TodoListFromServerType[]}>) => {
			//возвращаем массив тудулистов
			return action.payload.todoLists.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
		},

		setEntityStatusAC: (state, action:PayloadAction<{todoListForChangeId: string, entityStatus: RequestStatusType}>) => {
			const index = state.findIndex(t => t.id === action.payload.todoListForChangeId)
			if (index > -1) {
				state[index].entityStatus = action.payload.entityStatus
			}
		}
	}
})

export const todoListsReducer = slice.reducer
export const {
	addTodoListAC,
	removeTodoListAC,
	changeTodoListTitleAC,
	changeTodoListFilterAC,
	setTodoListsAC,
	setEntityStatusAC} = slice.actions


// export const _todoListsReducer = (state: TodoListType[] = initialState, action: TodoListsReducerActionsType): TodoListType[] => {
// 	switch (action.type) {
// 		case 'ADD-NEW-TODOLIST':
// 			return [{...action.payload.newTodoList, filter: 'all', entityStatus: 'idle'}, ...state]
// 		case 'REMOVE-TODOLIST':
// 			return state.filter(todoList => todoList.id !== action.payload.todoListForRemoveId)
// 		case 'CHANGE-TODOLIST-TITLE':
// 			return state.map(td => td.id === action.payload.todoListForChangeId ? {
// 				...td,
// 				title: action.payload.newTitle
// 			} : td)
// 		case 'CHANGE-TODOLIST-FILTER-VALUE':
// 			return state.map(td => td.id === action.payload.todoListForChangeId ? {
// 				...td,
// 				filter: action.payload.newFilterValue
// 			} : td)
// 		case 'SET-TODOLISTS':
// 			return action.payload.todoLists.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
// 		case 'SET-ENTITY-STATUS':
// 			return state.map(tl => tl.id === action.payload.todolistId ? {
// 				...tl,
// 				entityStatus: action.payload.entityStatus
// 			} : tl)
// 		default:
// 			return state
// 	}
// }

//actionCreators:
// export const addTodoListAC = (newTodoList: TodoListFromServerType) =>
// 	({type: 'ADD-NEW-TODOLIST', payload: {newTodoList}} as const)
//
// export const removeTodoListAC = (todoListForRemoveId: string) =>
// 	({type: 'REMOVE-TODOLIST', payload: {todoListForRemoveId}} as const)
//
// export const changeTodoListTitleAC = (todoListForChangeId: string, newTitle: string) =>
// 	({type: 'CHANGE-TODOLIST-TITLE', payload: {todoListForChangeId, newTitle}} as const)
//
// export const changeTodoListFilterAC = (todoListForChangeId: string, newFilterValue: FilterValuesType) =>
// 	({type: 'CHANGE-TODOLIST-FILTER-VALUE', payload: {todoListForChangeId, newFilterValue}} as const)
//
// export const setTodoListsAC = (todoLists: TodoListFromServerType[]) =>
// 	({type: 'SET-TODOLISTS', payload: {todoLists}} as const)
//
// export const setEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
// 	({type: 'SET-ENTITY-STATUS', payload: {todolistId, entityStatus}} as const)


//thunkCreators:
// при типизации санки можно типизировать диспатч нужным экшен-тайпом, но, когда нам нужно задиспатчить другую санку,
// тогда нужно использовать AppThunkType, который описан в store.ts
export const getTodoListsTC = (): AppThunk => (dispatch) => {
	dispatch(setRequestStatusAC({status: 'loading'}))
	todoListsApi.getTodoLists()
		.then((res) => {
			dispatch(setTodoListsAC({todoLists: res.data}))
			dispatch(setRequestStatusAC({status: 'succeeded'}))
		}).catch((e) => {
		handleServerNetworkError(dispatch, e)
	})
}
//то же самое, что и выше, но с использованием конструкции async await и обработкой возможной ошибки конструкцией try catch:
export const _getTodoListsTC = (): AppThunk => async (dispatch) => {
	try {
		const res = await todoListsApi.getTodoLists()
		dispatch(setTodoListsAC({todoLists: res.data}))
	} catch (e: any) {
		console.log('error: ', e)
		throw new Error(e)
	}
}

//можно типизировать всю санку сразу как AppThunkType, а можно типизировать отдельно диспатч  нужным экшен-тайпом (dispatch: Dispatch<TodoListsReducerActionsType>):
export const addTodoListTC = (todoListTitle: string): AppThunk => (dispatch) => {
	dispatch(setRequestStatusAC({status: 'loading'}))
	todoListsApi.createTodoList(todoListTitle)
		.then((res) => {
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(addTodoListAC({newTodoList: res.data.data.item}))
				dispatch(setRequestStatusAC({status: 'succeeded'}))
			} else {
				handleServerAppError<{ item: TodoListFromServerType }>(dispatch, res.data)
			}
		}).catch((e) => {
		handleServerNetworkError(dispatch, e.message)
	})
}
//здесь типизирован отдельно диспатч:
export const removeTodoListTC = (todoListId: string): AppThunk => (dispatch) => {
	dispatch(setRequestStatusAC({status: 'loading'}))
	dispatch(setEntityStatusAC({todoListForChangeId: todoListId, entityStatus: 'loading'}))
	todoListsApi.deleteTodoList(todoListId)
		.then((res) => {
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(removeTodoListAC({todoListForRemoveId: todoListId}))
				dispatch(setRequestStatusAC({status: 'succeeded'}))
			} else {
				handleServerAppError(dispatch, res.data)
			}
		}).catch((e) => {
		handleServerNetworkError(dispatch, e)
		dispatch(setEntityStatusAC({todoListForChangeId: todoListId, entityStatus: 'failed'}))
	})
}

export const changeTodoListTitleTC = (todoListId: string, newTitle: string): AppThunk  =>
	(dispatch) => {
		dispatch(setRequestStatusAC({status: 'loading'}))
		dispatch(setEntityStatusAC({todoListForChangeId: todoListId, entityStatus: 'loading'}))
		todoListsApi.updateTodoList(todoListId, newTitle)
			.then((res) => {
				if (res.data.resultCode === ResultCode.OK) {
					dispatch(changeTodoListTitleAC({todoListForChangeId: todoListId, newTitle}))
					dispatch(setRequestStatusAC({status: 'succeeded'}))
					dispatch(setEntityStatusAC({todoListForChangeId: todoListId, entityStatus: 'succeeded'}))
				} else {
					handleServerAppError(dispatch, res.data)
				}
			}).catch((e) => {
			handleServerNetworkError(dispatch, e)
			dispatch(setEntityStatusAC({todoListForChangeId: todoListId, entityStatus: 'failed'}))
		})
	}

//types:
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodoListType = TodoListFromServerType & {
	filter: FilterValuesType,
	entityStatus: RequestStatusType
}

export type AddTodoListActionType = ReturnType<typeof addTodoListAC>//экспортируем тип "AddTodoListACType" т.к. этот экшн криэйтор также будем использовать в taskReducer при добавлении пустого массива тасок для нового тудулиста
export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>//экспортируем тип "RemoveTodoListACType" т.к. этот экшн криэйтор также будем использовать в taskReducer при удалении  массива тасок удаленного тудулиста
type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>
type ChangeTodoListFilterActionType = ReturnType<typeof changeTodoListFilterAC>
export type setTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type SetEntityStatusType = ReturnType<typeof setEntityStatusAC>

//Тип экшенов для TodoListReducer (можно не выносить типы в отдельные переменные, а сразу в TodoListsReducerActionsType писать ReturnType<typeof ...> :
export type TodoListsReducerActionsType =
	AddTodoListActionType
	| RemoveTodoListActionType
	| ChangeTodoListTitleActionType
	| ChangeTodoListFilterActionType
	| setTodoListsActionType
	| SetRequestStatusType
	| SetEntityStatusType
	| SetRequestErrorType