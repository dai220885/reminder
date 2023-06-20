import {TaskPriorities, TaskStatuses} from '../../api/todoLists-api';
import {
	addTaskTC,
	fetchTasksTC, removeTaskTC,
	TasksForTodoListType,
	tasksReducer, updateTaskTC
} from '../../features/TodoListsList/tasksReducer'
import {addTodoListTC, fetchTodoListsTC, removeTodoListTC} from '../../features/TodoListsList/todoListsReducer';


let startState: TasksForTodoListType = {};
beforeEach(() => {
	startState = {
		'todolistId1': [
			{
				id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
				startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
			},
			{
				id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '',
				startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
			},
			{
				id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1', description: '',
				startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
			}
		],
		'todolistId2': [
			{
				id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
				startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
			},
			{
				id: '2', title: 'milk', status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '',
				startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
			},
			{
				id: '3', title: 'tea', status: TaskStatuses.New, todoListId: 'todolistId2', description: '',
				startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
			}
		]
	};
});

test('correct task should be deleted from correct array', () => {
	//получим action из экшенкриэйтора
	//const action = removeTaskAC({todoListId: "todolistId2", taskForRemoveId: "2"});
	//чтобы получить action из санки (отдельно экшенкриэйтор мы уже не описываем), достаем его из свойства fulfilled, после чего в качестве параметров передаем объект, который сама санка возвращает при успешно запросе, далее какие-то args в виде пустой строки (или значения для requestId - нужно только для тестов, в приложении туда всё автоматом прилетает) и то, что сама санка получает в качестве параметра - в нашем случае todoListId
	const action = removeTaskTC.fulfilled({
		todoListId: 'todolistId2',
		taskForRemoveId: '2'
	}, 'requestId', {todoListId: 'todolistId2', taskForRemoveId: '2'});
	const endState = tasksReducer(startState, action)

	expect(endState['todolistId1'].length).toBe(3);
	expect(endState['todolistId2'].length).toBe(2);
	expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy();
});
test('correct task should be added to correct array', () => {
	const task = {
		todoListId: 'todolistId2',
		title: 'juce',
		status: TaskStatuses.New,
		addedDate: '',
		deadline: '',
		description: '',
		order: 0,
		priority: 0,
		startDate: '',
		id: 'id exists'
	}
	//const action = addTaskAC({todoListId: "todolistId2", task });
	//чтобы получить action из санки (отдельно экшенкриэйтор мы уже не описываем), достаем его из свойства fulfilled, после чего в качестве параметров передаем объект, который сама санка возвращает при успешно запросе, далее какие-то args в виде пустой строки (или значения для requestId - нужно только для тестов, в приложении туда всё автоматом прилетает) и то, что сама санка получает в качестве параметра - в нашем случае todoListId
	const action = addTaskTC.fulfilled(task, 'requestId', {todoListId: 'todolistId2', title: task.title})
	const endState = tasksReducer(startState, action)

	expect(endState['todolistId1'].length).toBe(3);
	expect(endState['todolistId2'].length).toBe(4);
	expect(endState['todolistId2'][0].id).toBeDefined();
	expect(endState['todolistId2'][0].title).toBe('juce');
	expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
});
// test('status of specified task should be changed', () => {
//     const action = changeTaskStatusAC({todoListId: 'todolistId2', taskForChangeId: '2', newStatus: TaskStatuses.New});
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
//     expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
// });


// test('title of specified task should be changed', () => {
//     const action = changeTaskTitleAC({todoListId: 'todolistId2', taskForChangeId: '2',newTitle: 'yogurt'});
//
//     const endState = tasksReducer(startState, action)
//
//     expect(endState["todolistId1"][1].title).toBe("JS");
//     expect(endState["todolistId2"][1].title).toBe("yogurt");
//     expect(endState["todolistId2"][0].title).toBe("bread");
// });


test('status of specified task should be changed', () => {
	const dataForUpdate = {todoListId: 'todolistId2', taskForUpdateId: '2', model: {status: TaskStatuses.New}};
	const action = updateTaskTC.fulfilled(dataForUpdate, 'requestId', dataForUpdate)

	const endState = tasksReducer(startState, action)

	expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed)
	expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
})
test('title of specified task should be changed', () => {
	const dataForUpdate = {todoListId: 'todolistId2', taskForUpdateId: '2', model: {title: 'yogurt'}};
	const action = updateTaskTC.fulfilled(dataForUpdate, 'requestId', dataForUpdate)

	const endState = tasksReducer(startState, action)

	expect(endState['todolistId1'][1].title).toBe('JS')
	expect(endState['todolistId2'][1].title).toBe('yogurt')
	expect(endState['todolistId2'][0].title).toBe('bread')
})


test('new array should be added when new todolist is added', () => {

	const dataForAdd = {
		newTodoList: {
			id: 'blabla',
			title: 'new todolist',
			order: 0,
			addedDate: ''
		}
	};
	const action = addTodoListTC.fulfilled(dataForAdd, 'requestId', {newTodoListTitle: dataForAdd.newTodoList.title});

	const endState = tasksReducer(startState, action)


	const keys = Object.keys(endState);
	const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');
	if (!newKey) {
		throw Error('new key should be added')
	}

	expect(keys.length).toBe(3);
	expect(endState[newKey]).toEqual([]);
});
test('propertry with todolistId should be deleted', () => {
	const action = removeTodoListTC.fulfilled({todoListForRemoveId: 'todolistId2'}, 'requestId', {todoListForRemoveId: 'todolistId2'});

	const endState = tasksReducer(startState, action)

	const keys = Object.keys(endState);

	expect(keys.length).toBe(1);
	expect(endState['todolistId2']).not.toBeDefined();
});



//чтобы получить action из санки (отдельно экшенкриэйтор мы уже не описываем), достаем его из свойства fulfilled, после чего в качестве параметров передаем объект, который сама санка возвращает при успешно запросе, далее какие-то args в виде пустой строки (или значения для requestId - нужно только для тестов, в приложении туда всё автоматом прилетает) и то, что сама санка получает в качестве параметра -
//(task, 'requestId', {todoListId: 'todolistId2', title: task.title})
test('empty arrays should be added when we set todolists', () => {
	const action = fetchTodoListsTC.fulfilled({
		todoLists: [
			{id: '1', title: 'title 1', order: 0, addedDate: ''},
			{id: '2', title: 'title 2', order: 0, addedDate: ''}
		]
	}, 'requestId')

	const endState = tasksReducer({}, action)

	const keys = Object.keys(endState)

	expect(keys.length).toBe(2)
	expect(endState['1']).toBeDefined()
	expect(endState['2']).toBeDefined()
})
test('tasks should be added for todolist', () => {
	//получим action из экшенкриэйтора
	//const action = setTasksAC({todoListId: 'todolistId1',tasks: startState['todolistId1']});
	//чтобы получить action из санки (отдельно экшенкриэйтор мы уже не описываем), достаем его из свойства fulfilled, после чего в качестве параметров передаем объект, который сама санка возвращает при успешно запросе, далее какие-то args в виде пустой строки (или значения для requestId - нужно только для тестов, в приложении туда всё автоматом прилетает) и то, что сама санка получает в качестве параметра - в нашем случае todoListId
	const action = fetchTasksTC.fulfilled({
		todoListId: 'todolistId1',
		tasks: startState['todolistId1']
	}, 'requestId', 'todolistId1');

	const endState = tasksReducer({
		'todolistId2': [],
		'todolistId1': []
	}, action)

	expect(endState['todolistId1'].length).toBe(3)
	expect(endState['todolistId2'].length).toBe(0)
})

