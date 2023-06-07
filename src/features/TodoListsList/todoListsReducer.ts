import {v1} from 'uuid';
import {ResultCode, TodoListFromServerType, todoListsApi} from '../../api/todoLists-api';
import {Dispatch} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {AppActionsType, AppDispatchType, AppRootStateType, AppThunkType} from '../../app/store';
import {
    AppReducerActionsType,
    RequestStatusType,
    setRequestErrorAC,
    SetRequestErrorType,
    setRequestStatusAC,
    SetRequestStatusType
} from '../../app/appReducer';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';

// export type OldTodoListType = {
//     id: string;
//     title: string;
//     filter: FilterValuesType
// }

export const todoListId1 = v1();
export const todoListId2 = v1();

const initialState: TodoListType[] = [
    // {id: todoListId1, title: 'What to learn', filter: 'all'},
    // {id: todoListId2, title: 'What to buy', filter: 'all'},
]

export const todoListsReducer = (state: TodoListType[] = initialState, action: TodoListsReducerActionsType): TodoListType[] => {
    switch (action.type) {
        case 'ADD-NEW-TODOLIST':
            return [{...action.payload.newTodoList, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'REMOVE-TODOLIST':
            return state.filter(todoList => todoList.id !== action.payload.todoListForRemoveId)
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(td => td.id === action.payload.todoListForChangeId ? {
                ...td,
                title: action.payload.newTitle
            } : td)
        case 'CHANGE-TODOLIST-FILTER-VALUE':
            return state.map(td => td.id === action.payload.todoListForChangeId ? {
                ...td,
                filter: action.payload.newFilterValue
            } : td)
        case 'SET-TODOLISTS':
            return action.payload.todoLists.map(td => ({...td, filter: 'all', entityStatus: 'idle'}))
        case 'SET-ENTITY-STATUS':
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, entityStatus: action.payload.entityStatus} : tl)
        default:
            return state
    }
}

//actionCreators:
export const addTodoListAC = (newTodoList: TodoListFromServerType) =>
    ({type: 'ADD-NEW-TODOLIST', payload: {newTodoList}} as const)

export const removeTodoListAC = (todoListForRemoveId: string) =>
    ({type: 'REMOVE-TODOLIST', payload: {todoListForRemoveId}} as const)

export const changeTodoListTitleAC = (todoListForChangeId: string, newTitle: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', payload: {todoListForChangeId, newTitle}} as const)

export const changeTodoListFilterAC = (todoListForChangeId: string, newFilterValue: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER-VALUE', payload: {todoListForChangeId, newFilterValue}} as const)

export const setTodoListsAC = (todoLists: TodoListFromServerType[]) =>
    ({type: 'SET-TODOLISTS', payload: {todoLists}} as const)

export const setEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) =>
    ({type: 'SET-ENTITY-STATUS', payload: {todolistId, entityStatus}} as const)


//thunkCreators:
// при типизации санки можно типизировать диспатч нужным экшен-тайпом, но, когда нам нужно задиспатчить другую санку,
// тогда нужно использовать AppThunkType, который описан в store.ts
export const getTodoListsTC = (): AppThunkType =>  (dispatch) => {
    dispatch(setRequestStatusAC('loading'))
    todoListsApi.getTodoLists()
        .then((res) => {
            dispatch(setTodoListsAC(res.data))
            dispatch(setRequestStatusAC('succeeded'))
        }).catch((e) => {
        handleServerNetworkError(dispatch, e)
    })
}
//то же самое, что и выше, но с использованием конструкции async await и обработкой возможной ошибки конструкцией try catch:
export const _getTodoListsTC = (): AppThunkType => async (dispatch) => {
    try {
        const res = await todoListsApi.getTodoLists()
        dispatch(setTodoListsAC(res.data))
    } catch (e: any) {
        console.log('error: ', e)
        throw new Error(e)
    }
}

//можно типизировать всю санку сразу как AppThunkType, а можно типизировать отдельно диспатч  нужным экшен-тайпом (dispatch: Dispatch<TodoListsReducerActionsType>):
export const addTodoListTC = (todoListTitle: string): AppThunkType => (dispatch) => {
    dispatch(setRequestStatusAC('loading'))
    todoListsApi.createTodoList(todoListTitle)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK){
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setRequestStatusAC('succeeded'))
            } else {
                handleServerAppError<{ item: TodoListFromServerType }>(dispatch, res.data)
            }
        }).catch((e) => {
        handleServerNetworkError(dispatch, e.message)
    })
}
//здесь типизирован отдельно диспатч:
export const removeTodoListTC = (todoListId: string): AppThunkType => (dispatch) => {
    dispatch(setRequestStatusAC('loading'))
    dispatch(setEntityStatusAC(todoListId,'loading'))
    todoListsApi.deleteTodoList(todoListId)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK) {
                dispatch(removeTodoListAC(todoListId))
                dispatch(setRequestStatusAC('succeeded'))
            }else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e)=>{
        handleServerNetworkError(dispatch, e)
        dispatch(setEntityStatusAC(todoListId,'failed'))
        })
}

export const changeTodoListTitleTC = (todoListId: string, newTitle: string) =>
    (dispatch: AppDispatchType) => {
    dispatch(setRequestStatusAC('loading'))
        dispatch(setEntityStatusAC(todoListId,'loading'))
    todoListsApi.updateTodoList(todoListId, newTitle)
        .then((res) => {
            if (res.data.resultCode === ResultCode.OK){
                dispatch(changeTodoListTitleAC(todoListId, newTitle))
                dispatch(setRequestStatusAC('succeeded'))
                dispatch(setEntityStatusAC(todoListId,'succeeded'))
            }else {
                handleServerAppError(dispatch, res.data)
            }
        }).catch((e)=>{
        handleServerNetworkError(dispatch, e)
        dispatch(setEntityStatusAC(todoListId,'failed'))
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