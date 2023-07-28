import React, {useCallback, useEffect} from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import {fetchTasksTC} from '../tasksReducer';
import {FilterValuesType, TodoListType} from '../../../features/TodoListsList/todoListsReducer';
import {TaskFromServerType, TaskStatuses} from '../../../api/todoLists-api';
import {useAppDispatch} from '../../../app/hooks';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {AddItemInput} from '../../../components/AddItemInput/AddItemInput';
import TaskList from '../../../features/TodoListsList/TodoList/TaskList/TaskList';
//import {TaskType} from '../reducers/tasksReducer';

type TodoListPropsType = {
    todoList: TodoListType
    tasks: TaskFromServerType[]
    changeFilterValue: (todoListId: string, filter: FilterValuesType) => void
    removeTask: (todoListId: string, taskId: string) => void
    addTask: (todoListId: string, title: string) => void
    changeTaskStatus: (todoListId: string, taskId: string, newStatus: TaskStatuses) => void
    changeTaskTitle: (todoListId: string, taskId: string, newTitle: string) => void
    removeTodoList: (todoListId: string) => void
    changeTodoListTitle: (todoListId: string, newTitle: string) => void
    demo?: boolean // нужно только для сторибука, чтобы устанавливать "демо режим", а не запрашивать тудулисты с сервера.
}

//деструктуризируем все пропсы, чтобы достать из них demo и задать значение по умолчинию
const TodoList = React.memo(({demo = false, ...props}: TodoListPropsType) => {
    //console.log(`todolist '${props.title}' is called`)
    //const dispatch = useDispatch(); // это стандартный диспатч
    //const dispatch = useDispatch<AppDispatchType>(); // можно было так протипизировать
        const dispatch = useAppDispatch(); // а можно использовать наш диспатч, который мы также типизировали

    useEffect(() =>{
        if (demo) {
            return;
            //если включен "деморежим", то диспатчить не будем
        }
        dispatch(fetchTasksTC(props.todoList.id))
    }, [])



    const removeTodoListHandler = () => {
        props.removeTodoList(props.todoList.id)
    }
    //создаем универсальный создатель функции, который вернет функцию, в которую передаст параметр, переданный в него ))))))) Делаем так из-за того, что в button onClick мы сразу запускаем filterHandlerCreator() и передаем в нее параметр, поэтому filterHandlerCreator должна вернуть функцию, которая, в свою очередь, будет запущена после события onClick. Можно было написать в баттоне: onClick={()=>filterHandlerCreator('значение фильтра')}, тогда в определении filterHandlerCreator не нужно было возвращать функцию, а просто  props.changeFilterValue(props.todoListId, filter)
    const filterHandlerCreator = useCallback((filter: FilterValuesType) => {
        return () => props.changeFilterValue(props.todoList.id, filter)
    }, [props.changeFilterValue, props.todoList.id])

    //то же самое, но в другой записи, без ретурна и фигурных скобок
    // const filterHandlerCreator2 = (filter: FilterValuesType) => () => props.changeFilterValue(props.todoListId, filter)
    //старый вариант:
    // const setAllFilterValue = () => props.changeFilterValue(props.todoListId, 'all')
    // const setActiveFilterValue = () => props.changeFilterValue(props.todoListId, 'active')
    // const setCompletedFilterValue = () => props.changeFilterValue(props.todoListId, 'completed')

    const addTask = useCallback((title: string) => props.addTask(props.todoList.id, title), [props.addTask, props.todoList.id])//передаем функцию дальше в AddItemInput, где она получит title, затем передаст его в props.addTask вместе с props.todoListId, который пришел в todolist из App

    const changeTodoListTitleHandler = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.todoList.id, newTitle)
    },[props.changeTodoListTitle, props.todoList.id])

    //в пропсих получаем все таски, а фильтруем непосредственно тут:
    let tasksForTodoList = props.tasks
    if (props.todoList.filter === 'active') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todoList.filter === 'completed') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return (
        <div className={'todolist'} style={{position: 'relative'}}>
            <Tooltip title={'delete todolist'} placement="right-start">
            <IconButton aria-label="delete"
                        onClick={removeTodoListHandler}
                        disabled={props.todoList.entityStatus === 'loading'}
                        style={{position: 'absolute', right: '-10px', top: '-30px'}}>
                <Delete/>
            </IconButton>
            </Tooltip>

            <h3>
                <EditableSpan
                    title={props.todoList.title}
                    onChange={changeTodoListTitleHandler}
                />

            </h3>
            <AddItemInput
                addItem={addTask}
                placeholder={'Enter new task title'}
                disabled={props.todoList.entityStatus === 'loading'}
                buttonHoverText={'add task'}
            />
            <TaskList
                todoListId={props.todoList.id}
                //tasks={props.tasks}
                tasks={tasksForTodoList}
                removeTask={props.removeTask}
                changeTaskStatus={props.changeTaskStatus}
                changeTaskTitle={props.changeTaskTitle}
            />
            <div className="filter-btn-container" >
                {/*онклики в баттонах будут выполнены сразу же, после загрузки страницы, (т.к. стоит вызов функции), но вместо себя оставит колбэк функцию с переданным в нее соответствующий параметр*/}
                <Button
                    color={'inherit'}
                    // className={props.filter === 'all' ? 'active-filter-btn' : 'filter-btn'}
                    variant={props.todoList.filter === 'all' ? 'contained' : 'text'}
                    onClick={filterHandlerCreator('all')}
                >All
                </Button>
                <Button
                    color={'primary'}
                    // className={props.filter === 'active' ? 'active-filter-btn' : 'filter-btn'}
                    variant={props.todoList.filter === 'active' ? 'contained' : 'text'}
                    onClick={filterHandlerCreator('active')}
                >Active
                </Button>
                <Button
                    color={'secondary'}
                    //className={props.filter === 'completed' ? 'active-filter-btn' : 'filter-btn'}
                    variant={props.todoList.filter === 'completed' ? 'contained' : 'text'}
                    onClick={filterHandlerCreator('completed')}
                >Completed
                </Button>
            </div>
        </div>
    );
});

export default TodoList;





