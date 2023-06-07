import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    setTodoListsActionType,
    todoListId1,
    todoListId2
} from './todoListsReducer';
import {
    ResultCode,
    TaskFromServerType,
    TaskPriorities,
    TaskStatuses,
    todoListsApi,
    UpdateTaskModelType
} from '../../api/todoLists-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {setRequestErrorAC, SetRequestErrorType, setRequestStatusAC, SetRequestStatusType} from '../../app/appReducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';

// export type OldTaskType = {
//     id: string;
//     title: string;
//     isDone: boolean;
// }

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

export const tasksReducer = (state: TasksForTodoListType = initialState, action: TasksReducerActionsType): TasksForTodoListType => {
    switch (action.type) {
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.todoListId]: [action.payload.task, ...state[action.payload.todoListId]]
            }
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].filter(t => t.id != action.payload.taskForRemoveId)
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].map(t => t.id === action.payload.taskForChangeId ? {
                    ...t,
                    status: action.payload.newStatus
                } : t)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.payload.todoListId]: state[action.payload.todoListId].map(t => t.id === action.payload.taskForChangeId ? {
                    ...t,
                    title: action.payload.newTitle
                } : t)
            }
        case 'ADD-NEW-TODOLIST':
            return {...state, [action.payload.newTodoList.id]: []}
        case 'REMOVE-TODOLIST':
            let newState = {...state}
            delete newState[action.payload.todoListForRemoveId]
            return newState
        case 'SET-TODOLISTS':
            const copyState = {...state}
            action.payload.todoLists.forEach((el) => {
                copyState[el.id] = []
            })
            return copyState
            //то же самое, но с помощью метода reduce:
            //return action.payload.todoLists.reduce((acc, td) => {
            //newState[td.id] = []
            //return newState
            //}, {...state})
        case 'SET-TASKS':
            return {
                ...state,
                [action.payload.todoListId]: action.payload.tasks
            }
        default:
            return state
    }
}

//actionCreators:

export const addTaskAC = (todoListId: string, task: TaskFromServerType) =>
    ({type: 'ADD-TASK', payload: {todoListId, task}} as const)//можно todoListId не передавать, т.к. он есть в свойствах у таски с сервера

export const removeTaskAC = (todoListId: string, taskForRemoveId: string) =>
    ({type: 'REMOVE-TASK', payload: {todoListId, taskForRemoveId}} as const)

export const changeTaskStatusAC = (todoListId: string, taskForChangeId: string, newStatus: number) =>
    ({type: 'CHANGE-TASK-STATUS', payload: {todoListId, taskForChangeId, newStatus}} as const)

export const changeTaskTitleAC = (todoListId: string, taskForChangeId: string, newTitle: string) =>
    ({type: 'CHANGE-TASK-TITLE', payload: {todoListId, taskForChangeId, newTitle}} as const)

export const setTasksAC = (todoListId: string, tasks: TaskFromServerType[]) =>
    ({type: 'SET-TASKS', payload: {todoListId, tasks}} as const)

//thunkCreators:
export const fetchTasksTC = (todoListId: string) => (dispatch: Dispatch) => {
    dispatch(setRequestStatusAC('loading'))
    todoListsApi.getTasks(todoListId)
        .then((res) => {
            dispatch(setTasksAC(todoListId, res.data.items))
            dispatch(setRequestStatusAC('succeeded'))
        }).catch((e) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const addTaskTC = (todoListId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setRequestStatusAC('loading'))
    todoListsApi.createTask(todoListId, title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                const task = res.data.data.item
                const action = addTaskAC(todoListId, task)//можно todoListId не передавать, т.к. он есть в свойствах у таски с сервера
                dispatch(action)
                dispatch(setRequestStatusAC('succeeded'))
                dispatch(setRequestStatusAC('idle'))
            } else {
                handleServerAppError<{ item: TaskFromServerType }>(dispatch, res.data)
            }
        }).catch((e) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const removeTaskTC = (todoListId: string, taskId: string) => (dispatch: Dispatch<TasksReducerActionsType>) => {
    dispatch(setRequestStatusAC('loading'))
    todoListsApi.deleteTask(todoListId, taskId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK){
                dispatch(removeTaskAC(todoListId, taskId))
                dispatch(setRequestStatusAC('succeeded'))
            }else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e) => {
        handleServerNetworkError(dispatch, e)
    })
}

export const changeTaskStatusTC = (todoListId: string, taskId: string, newStatus: TaskStatuses) =>
    (dispatch: Dispatch<TasksReducerActionsType>, getState: () => AppRootStateType) => {
        dispatch(setRequestStatusAC('loading'))
        const task = getState().tasks[todoListId].find((t) => t.id === taskId);
        if (task) {
            const model: UpdateTaskModelType = {
                title: task.title,
                deadline: task.deadline,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                status: newStatus
            }

            todoListsApi.updateTask(todoListId, taskId, model).then((res)=>{
                if (res.data.resultCode === ResultCode.OK) {
                    const action = changeTaskStatusAC(todoListId, taskId, newStatus)
                    dispatch(action)
                    dispatch(setRequestStatusAC('succeeded'))
                }
                else {handleServerAppError<{ item: TaskFromServerType }>(dispatch, res.data)}
            }).catch((e) => {
                handleServerNetworkError(dispatch, e)
            })
        }
    }

export const changeTaskTitleTC = (todoListId: string, taskId: string, newTitle: string) =>
    async (dispatch: Dispatch<TasksReducerActionsType>, getState: () => AppRootStateType) => {
        const task = getState().tasks[todoListId].find((t) => t.id === taskId);
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
                const res = await todoListsApi.updateTask(todoListId, taskId, model)
                if (res.data.resultCode === ResultCode.OK) {
                    const action = changeTaskTitleAC(todoListId, taskId, newTitle)
                    dispatch(action)
                    dispatch(setRequestStatusAC('succeeded'))
                }
            } catch(e: any) {handleServerNetworkError(dispatch, e)}
        }
    }

//types:
export type TasksForTodoListType = {
    [key: string]: TaskFromServerType[]
}

type AddTaskActionType = ReturnType<typeof addTaskAC>//автоматически типизируем объект, который вернет экшн криэйтор addTaskAC
type RemoveTaskActionType = ReturnType<typeof removeTaskAC> //автоматически типизируем объект, который вернет экшн криэйтор removeTaskAC
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>
//Тип экшенов для TasksReducer (можно не выносить типы в отдельные переменные, а сразу в TasksReducerActionsType писать ReturnType<typeof ...> :
export type TasksReducerActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | setTodoListsActionType
    | SetTasksActionType
    | SetRequestStatusType
    | SetRequestErrorType




















