import {TodoListType, todoListsReducer, addTodoListTC} from '../../features/TodoListsList/todoListsReducer'
import {tasksReducer, TasksForTodoListType} from '../../features/TodoListsList/tasksReducer'
import {TodoListFromServerType} from '../../api/todoLists-api'

test('ids should be equals', () => {
    const startTasksState: TasksForTodoListType = {};
    const startTodoListsState: Array<TodoListType> = [];

    let todolist: TodoListFromServerType = {
        title: 'new todolist',
        id: 'any id',
        addedDate: '',
        order: 0
    }

    const action = addTodoListTC.fulfilled({newTodoList: todolist}, 'requestId', {newTodoListTitle: todolist.title});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.newTodoList.id);
    expect(idFromTodoLists).toBe(action.payload.newTodoList.id);
});
