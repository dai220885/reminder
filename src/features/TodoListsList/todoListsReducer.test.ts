import {
    setEntityStatusAC,
    changeTodoListFilterAC,
    FilterValuesType,
    TodoListType,
    todoListsReducer, fetchTodoListsTC, removeTodoListTC, addTodoListTC, changeTodoListTitleTC
} from '../../features/TodoListsList/todoListsReducer'
import {v1} from 'uuid'

import {TodoListFromServerType} from '../../api/todoLists-api';
import {RequestStatusType} from '../../app/appReducer';

let todolistId1: string
let todolistId2: string
let startState: Array<TodoListType> = []

beforeEach(() => {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
        {id: todolistId2, title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todoListsReducer(startState,removeTodoListTC.fulfilled({todoListForRemoveId: todolistId1}, 'requestId', {todoListForRemoveId: todolistId1}))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let todolist: TodoListFromServerType = {
        title: 'New Todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }


    const endState = todoListsReducer(startState,  addTodoListTC.fulfilled({newTodoList: todolist}, 'requestId', {newTodoListTitle: todolist.title}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(todolist.title)
    expect(endState[0].filter).toBe('all')
})

test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist'

    const payload = {todoListForChangeId: todolistId2, newTitle: newTodolistTitle};
    const action = changeTodoListTitleTC.fulfilled(payload, 'requestId', payload)

    const endState = todoListsReducer(startState, action)

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = 'completed'

    const action = changeTodoListFilterAC({todoListForChangeId: todolistId2,newFilterValue: newFilter})

    const endState = todoListsReducer(startState, action)

    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})
test('todolists should be added', () => {

    const action = fetchTodoListsTC.fulfilled({todoLists: startState}, 'requestId')

    const endState = todoListsReducer([], action)

    expect(endState.length).toBe(2)
})
test('correct entity status of todolist should be changed', () => {
    let newStatus: RequestStatusType = 'loading'

    const action = setEntityStatusAC({todoListForChangeId: todolistId2, entityStatus: newStatus})

    const endState = todoListsReducer(startState, action)

    expect(endState[0].entityStatus).toBe('idle')
    expect(endState[1].entityStatus).toBe(newStatus)
})



