import {
	addTodoListAC,
	AddTodoListActionType, removeTodoListAC,
	RemoveTodoListActionType, setTodoListsAC,
	setTodoListsActionType, TodoListType,
} from './todoListsReducer';
import {
	ResultCode,
	TaskFromServerType,
	TaskPriorities,
	TaskStatuses, TodoListFromServerType,
	todoListsApi,
	UpdateTaskModelType
} from '../../api/todoLists-api';
import {Dispatch} from 'redux';
import {setRequestErrorAC, SetRequestErrorType, setRequestStatusAC, SetRequestStatusType} from '../../app/appReducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import { isAxiosError } from 'axios';

const initialState: TasksForTodoListType = {
	// [todoListId1]: [
	//     {id: v1(), title: 'HTML&CSS', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
	//     {id: v1(), title: 'JS', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
	// ],
	// [todoListId2]: [
	//     {id: v1(), title: 'Bread', isDone: true},
	//     {id: v1(), title: 'Milk', isDone: true},
	// ]
}

//TODO убрать из санок приписку TC

//если санка принимала несколько параметров, то их нужно оборачивать в объект, если же нужен только один параметр, то можно без оборачвания

//thunks
export const fetchTasksTC = createAsyncThunk (
	'tasks/fetchTasks',
	async (todoListId: string, thunkAPI) => {
		const {dispatch, rejectWithValue} = thunkAPI
		dispatch(setRequestStatusAC({status: 'loading'}))
			try {
				const res = await todoListsApi.getTasks(todoListId)
				const tasks = res.data.items
				dispatch(setRequestStatusAC({status: 'succeeded'}))
				return {todoListId, tasks}
				//можно не создавать промежуточную переменную tasks:
				//return {todoListId, tasks: res.data.items}
			}
			catch (e){
			let errorMessage = ''
				if (isAxiosError(e)) {
					errorMessage = e?.response?.data?.error ?? e.message
				} else if (e instanceof Error) {
					errorMessage = e.message
				} else {errorMessage = JSON.stringify(e)}
				handleServerNetworkError(dispatch, {message: errorMessage})
				return rejectWithValue (errorMessage)
			}


	}
)

//TODO пофиксить то, что убрали if else(убрали т.к. в addCase в экстраРедьюсере падала ошибка, что action.payload может быть undefined
export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (arg: {todoListId: string, taskForRemoveId: string}, thunkAPI) => {
	const {dispatch} = thunkAPI
	dispatch(setRequestStatusAC({status: 'loading'}))
	const res = await todoListsApi.deleteTask(arg.todoListId, arg.taskForRemoveId)
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(setRequestStatusAC({status: 'succeeded'}))
				return {todoListId: arg.todoListId, taskForRemoveId: arg.taskForRemoveId}
			} else {
				handleServerAppError(dispatch, res.data)
			}
})

const slice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		addTaskAC: (state, action: PayloadAction<{ todoListId: string, task: TaskFromServerType }>) => {
			state[action.payload.todoListId].unshift(action.payload.task)
		},
		changeTaskStatusAC: (state, action: PayloadAction<{ todoListId: string, taskForChangeId: string, newStatus: number }>) => {
			const tasks = state[action.payload.todoListId]
			const index = tasks.findIndex(t => t.id === action.payload.taskForChangeId)
			if (index > -1) {
				//state[action.payload.todoListId][index].status = action.payload.newStatus
				tasks[index].status = action.payload.newStatus      //tasks[index] = {...tasks[index], ...action.payload.updatedTask} - так можно делать, чтобы не менять отдельно статус и название, а передавать и изменять сразу всю таску
			}
		},
		changeTaskTitleAC: (state, action: PayloadAction<{ todoListId: string, taskForChangeId: string, newTitle: string }>) => {
			const tasks = state[action.payload.todoListId]
			const index = tasks.findIndex(t => t.id === action.payload.taskForChangeId)
			if (index > -1) {
				//state[action.payload.todoListId][index].status = action.payload.newStatus
				tasks[index].title = action.payload.newTitle
			}
		},
	},
	//extraReducers может быть как объект со свойствами (ключ-значение), а может быть функция, которая будет "собирать" экстра редьюсеры
	extraReducers: (builder) => {
		builder
			.addCase(addTodoListAC, (state, action)=> {
				state[action.payload.newTodoList.id] = []
			})
			.addCase(removeTodoListAC, (state, action) => {
				delete state[action.payload.todoListForRemoveId]
			})
			.addCase(setTodoListsAC, (state, action) => {
				action.payload.todoLists.forEach(t => {
					state[t.id] = []
				})
			})
			.addCase(fetchTasksTC.fulfilled, (state, action) => {
				if (action.payload){
					state[action.payload.todoListId] = action.payload.tasks
				}
			})
			.addCase(removeTaskTC.fulfilled, (state, action) => {
				if (action.payload) {
					const {todoListId, taskForRemoveId} = action.payload
					const tasks = state[todoListId]
						const index = tasks.findIndex(t => t.id === taskForRemoveId)
						if (index > -1) {
							//state[action.payload.todoListId].splice(index, 1)
							tasks.splice(index, 1)
						}
				}
		})
	}
	//ключ-значение(просто для примера, что так тоже можно делать)
	// 	{
	// 	[addTodoListAC.type]: (state, action: PayloadAction<{ newTodoList: TodoListFromServerType }>) => {
	// 	},
	// 	[removeTodoListAC.type]: (state, action:PayloadAction<{todoListForRemoveId: string}>) => {
	// 	},
	// 	[setTodoListsAC.type]: (state, action:PayloadAction<{todoLists: TodoListFromServerType[]}>) => {
	// 	},
	// }
})

export const tasksReducer = slice.reducer

//actions
export const {
	addTaskAC,
	//removeTaskAC,
	changeTaskStatusAC,
	changeTaskTitleAC,
	//setTasksAC
} = slice.actions

//thunkCreators:


export const addTaskTC = (todoListId: string, title: string) => (dispatch: Dispatch) => {
	dispatch(setRequestStatusAC({status: 'loading'}))
	todoListsApi.createTask(todoListId, title)
		.then((res) => {
			if (res.data.resultCode === ResultCode.OK) {
				const task = res.data.data.item
				const action = addTaskAC({todoListId, task})//можно todoListId не передавать, т.к. он есть в свойствах у таски с сервера
				dispatch(action)
				dispatch(setRequestStatusAC({status: 'succeeded'}))
				dispatch(setRequestStatusAC({status: 'idle'}))
			} else {
				handleServerAppError<{ item: TaskFromServerType }>(dispatch, res.data)
			}
		}).catch((e) => {
		handleServerNetworkError(dispatch, e)
	})
}



export const changeTaskStatusTC = (todoListId: string, taskForChangeId: string, newStatus: TaskStatuses) =>
	(dispatch: Dispatch<TasksReducerActionsType>, getState: () => RootState) => {
		dispatch(setRequestStatusAC({status: 'loading'}))
		const task = getState().tasks[todoListId].find((t) => t.id === taskForChangeId);
		if (task) {
			const model: UpdateTaskModelType = {
				title: task.title,
				deadline: task.deadline,
				startDate: task.startDate,
				priority: task.priority,
				description: task.description,
				status: newStatus
			}

			todoListsApi.updateTask(todoListId, taskForChangeId, model).then((res) => {
				if (res.data.resultCode === ResultCode.OK) {
					const action = changeTaskStatusAC({todoListId, taskForChangeId, newStatus})
					dispatch(action)
					dispatch(setRequestStatusAC({status: 'succeeded'}))
				} else {
					handleServerAppError<{ item: TaskFromServerType }>(dispatch, res.data)
				}
			}).catch((e) => {
				handleServerNetworkError(dispatch, e)
			})
		}
	}

export const changeTaskTitleTC = (todoListId: string, taskForChangeId: string, newTitle: string) =>
	async (dispatch: Dispatch<TasksReducerActionsType>, getState: () => RootState) => {
		const task = getState().tasks[todoListId].find((t) => t.id === taskForChangeId);
		if (task) {
			const model: UpdateTaskModelType = {
				title: newTitle,
				deadline: task.deadline,
				startDate: task.startDate,
				priority: task.priority,
				description: task.description,
				status: task.status
			}
			try {
				const res = await todoListsApi.updateTask(todoListId, taskForChangeId, model)
				if (res.data.resultCode === ResultCode.OK) {
					const action = changeTaskTitleAC({todoListId, taskForChangeId, newTitle})
					dispatch(action)
					dispatch(setRequestStatusAC({status: 'succeeded'}))
				}
			} catch (e: any) {
				handleServerNetworkError(dispatch, e)
			}
		}
	}

//types:
export type TasksForTodoListType = {
	[key: string]: TaskFromServerType[]
}

type AddTaskActionType = ReturnType<typeof addTaskAC>//автоматически типизируем объект, который вернет экшн криэйтор addTaskAC
//type RemoveTaskActionType = ReturnType<typeof removeTaskAC> //автоматически типизируем объект, который вернет экшн криэйтор removeTaskAC
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
//type SetTasksActionType = ReturnType<typeof setTasksAC>
//Тип экшенов для TasksReducer (можно не выносить типы в отдельные переменные, а сразу в TasksReducerActionsType писать ReturnType<typeof ...> :
export type TasksReducerActionsType =
	//| RemoveTaskActionType
	| AddTaskActionType
	| ChangeTaskStatusActionType
	| ChangeTaskTitleActionType
	| AddTodoListActionType
	| RemoveTodoListActionType
	| setTodoListsActionType
	//| SetTasksActionType
	| SetRequestStatusType
	| SetRequestErrorType





// export const _tasksReducer = (state: TasksForTodoListType = initialState, action: any): TasksForTodoListType => {
// 	switch (action.type) {
// 		case 'ADD-TASK':
// 			return {
// 				...state,
// 				[action.payload.todoListId]: [action.payload.task, ...state[action.payload.todoListId]]
// 			}
// 		case 'REMOVE-TASK':
// 			return {
// 				...state,
// 				[action.payload.todoListId]: state[action.payload.todoListId].filter(t => t.id != action.payload.taskForRemoveId)
// 			}
// 		case 'CHANGE-TASK-STATUS':
// 			return {
// 				...state,
// 				[action.payload.todoListId]: state[action.payload.todoListId].map(t => t.id === action.payload.taskForChangeId ? {
// 					...t,
// 					status: action.payload.newStatus
// 				} : t)
// 			}
// 		case 'CHANGE-TASK-TITLE':
// 			return {
// 				...state,
// 				[action.payload.todoListId]: state[action.payload.todoListId].map(t => t.id === action.payload.taskForChangeId ? {
// 					...t,
// 					title: action.payload.newTitle
// 				} : t)
// 			}
// 		//case 'ADD-NEW-TODOLIST':
// 		case addTodoListAC.type:
// 			return {...state, [action.payload.newTodoList.id]: []}
// 		//case 'REMOVE-TODOLIST':
// 		case removeTodoListAC.type:
// 			let newState = {...state}
// 			delete newState[action.payload.todoListForRemoveId]
// 			return newState
// 		//case 'SET-TODOLISTS':
// 		case setTodoListsAC.type:
// 			const copyState = {...state}
// 			action.payload.todoLists.forEach((el: TodoListType) => {
// 				copyState[el.id] = []
// 			})
// 			return copyState
// 		//то же самое, но с помощью метода reduce:
// 		//return action.payload.todoLists.reduce((acc, td) => {
// 		//newState[td.id] = []
// 		//return newState
// 		//}, {...state})
// 		case 'SET-TASKS':
// 			return {
// 				...state,
// 				[action.payload.todoListId]: action.payload.tasks
// 			}
// 		default:
// 			return state
// 	}
// }

//actionCreators:
//
// export const addTaskAC = (todoListId: string, task: TaskFromServerType) =>
//     ({type: 'ADD-TASK', payload: {todoListId, task}} as const)//можно todoListId не передавать, т.к. он есть в свойствах у таски с сервера
//
// export const removeTaskAC = (todoListId: string, taskForRemoveId: string) =>
//     ({type: 'REMOVE-TASK', payload: {todoListId, taskForRemoveId}} as const)
//
// export const changeTaskStatusAC = (todoListId: string, taskForChangeId: string, newStatus: number) =>
//     ({type: 'CHANGE-TASK-STATUS', payload: {todoListId, taskForChangeId, newStatus}} as const)
//
// export const changeTaskTitleAC = (todoListId: string, taskForChangeId: string, newTitle: string) =>
//     ({type: 'CHANGE-TASK-TITLE', payload: {todoListId, taskForChangeId, newTitle}} as const)
//
// export const setTasksAC = (todoListId: string, tasks: TaskFromServerType[]) =>
//     ({type: 'SET-TASKS', payload: {todoListId, tasks}} as const)














