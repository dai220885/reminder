import React from 'react';
import {Provider} from 'react-redux';
import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import {tasksReducer} from './features/TodoListsList/tasksReducer';
import {todoListsReducer} from './features/TodoListsList/todoListsReducer';
import {v1} from 'uuid';
import {TaskPriorities, TaskStatuses} from './api/todoLists-api';
import {appReducer, RequestStatusType} from './app/appReducer';
import thunk from 'redux-thunk';
import {authReducer} from './features/Login/authReducer';
import {RootReducerType, RootState} from './app/store';
import {configureStore} from '@reduxjs/toolkit';
import {HashRouter} from 'react-router-dom';


const rootReducer: RootReducerType = combineReducers({
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
})

const initialGlobalState = {
    todoLists: [
        {id: "todolistId1", title: "What to learn",addedDate: '', order: 0, filter: "all", entityStatus: 'idle'},
        {id: "todolistId2", title: "What to buy",addedDate: '', order: 1, filter: "all", entityStatus: 'loading'}
    ] ,
    tasks: {
        ["todolistId1"]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.New, todoListId: "todolistId1", addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
            {id: v1(), title: "JS", status: TaskStatuses.New, todoListId: "todolistId1", addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''}
        ],
        ["todolistId2"]: [
            {id: v1(), title: "Milk", status: TaskStatuses.New, todoListId: "todolistId2", addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
            {id: v1(), title: "React Book", status: TaskStatuses.New, todoListId: "todolistId2", addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''}
        ]
    },
    app: {
        status: 'succeeded' as RequestStatusType,
        error: null as null | string,
        isInitialized: true,
    },
    auth: {
        isLoggedIn: true
    }
};

//export const storyBookStore = createStore(rootReducer, initialGlobalState as RootState, applyMiddleware(thunk));
export const storyBookStore = configureStore(
  {
      reducer: rootReducer,
      preloadedState: initialGlobalState as RootState,
      middleware: (getDefaultMiddleware) =>getDefaultMiddleware()
        .prepend(thunk)
  }
)


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

export const BrowserRouterDecorator = (storyFn: () => React.ReactNode) => {
    return <HashRouter>{storyFn()}</HashRouter>
}