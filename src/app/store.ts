import {combineReducers} from 'redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {todoListsReducer, TodoListsReducerActionsType} from '../features/TodoListsList/todoListsReducer';
import {tasksReducer, TasksReducerActionsType} from '../features/TodoListsList/tasksReducer';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {appReducer, AppReducerActionsType} from './appReducer';
import {authReducer} from '../features/Login/authReducer';
//import logger from 'redux-logger'

const rootReducer = combineReducers(
    {
        todoLists: todoListsReducer,
        tasks: tasksReducer,
        app: appReducer,
        auth: authReducer,
    }
)
// создаем store
//export const store = createStore(rootReducer, applyMiddleware(thunk))
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>getDefaultMiddleware()
    .prepend(thunk)
    //.concat(logger)
})


//types
export type AppDispatchType = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
  >;
export type RootReducerType = typeof rootReducer //этот тип нужен для ReduxStoreProviderDecorator
//варианты типизации стейта приложения
//export type RootState = ReturnType<typeof rootReducer>;
//export type RootState = ReturnType<RootReducerType>;


//создаем кастомный хук useAppDispatch, который будет возвращать стандартный useDispatch from 'react-redux', но протипизированный нашим типом AppDispatchType

//export type AppDispatchType = ThunkDispatch <AppRootStateType, unknown, AppActionsType>

//общий тип стейта для всего приложения:
//export type AppRootStateType = ReturnType<typeof rootReducer>
//или так: export type AppRootStateType = ReturnType<typeof store.getState>

//общий тим экшенов для всего App, который понадобится для общего типа санки или же чтобы типизировать диспатч в любой санке
//export type AppActionsType = TodoListsReducerActionsType | TasksReducerActionsType | AppReducerActionsType //(AppReducerActionsType можно было не добавлять, т.к. типы экшенов из него мы добавляли в  TasksReducerActionsType и TodoListsReducerActionsType соответственно

//общий тип санок (на случай, когда нужно в санке задиспатчить другую санку), если это не нужно,
// можно в санке просто типизировать диспатч: dispatch: Dispatch<ТипЭкшенов>
// export type AppThunkType<ReturnType = void> = ThunkAction<void, AppRootStateType, unknown, AppActionsType>


// @ts-ignore
window.store = store