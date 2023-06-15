import React, {useCallback, useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TodoList from './TodoList/TodoList';
import {Navigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {AddItemInput} from '../../components/AddItemInput/AddItemInput'
import {
    addTodoListTC, changeTodoListFilterAC,
    changeTodoListTitleTC, FilterValuesType,
    getTodoListsTC,
    removeTodoListTC
} from '../../features/TodoListsList/todoListsReducer';
import {addTaskTC, changeTaskStatusTC, changeTaskTitleTC, removeTaskTC} from '../../features/TodoListsList/tasksReducer';
import {TaskStatuses} from '../../api/todoLists-api';

type TodoListsListPropsType = {
    demo?: boolean // нужно только для сторибука, чтобы устанавливать "демо режим", а не запрашивать тудулисты с сервера.
}

export const TodoListsList: React.FC<TodoListsListPropsType> = ({demo = false}) => {
    // console.log('\nApp is called')
    //BLL
    // с помощью useDispatch() получаем функцию dispatch, с помощью которой можем задиспатчить экшен
    //не нужно диспатчить экшены в разные редьюсеры, диспатчим все в один, а рутовый редьюсер отдаст наш экшен по всем редьюсерам, редьюсеры, которым он не подходит, просто проигнорируют его и вернут стейт без изменения
    //const dispatch = useDispatch(); // это стандартный диспатч
    //const dispatch = useDispatch<AppDispatchType>(); // можно было так протипизировать
    const dispatch = useAppDispatch(); // а можно использовать наш диспатч, который мы также типизировали
    //с помощью useSelector обращаемся к стейту и достаем из него то, что нам нужно
    const todoLists = useAppSelector(state => state.todoLists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn =  useAppSelector(state => state.auth.isLoggedIn)
    useEffect(() => {
        if(demo || !isLoggedIn) {
            return
            //если включен "деморежим", то диспатчить не будем
        }
        dispatch(getTodoListsTC())
    }, [])

    // оборачиваем функции в хук useCallback, в качестве зависимости передаем dispatch, хотя можно было и пустой массив
    // если колбэк передается в компоненту, то необходимо оборачивать его в useCallback, если уходит просто в элемент (button и т.д.), то useCallback не нужен
    const addTodoList = useCallback((newTodoListTitle: string) => {
        dispatch(addTodoListTC(newTodoListTitle))
        //достаточно отдать action в рутовый редьюсер, после чего action  попадет в оба редьюсера
    }, [dispatch])

    const changeTodoListTitle = useCallback((todoListForChangeId: string, newTitle: string) => {
        dispatch(changeTodoListTitleTC(todoListForChangeId, newTitle))
    }, [dispatch])

    const removeTodoList = useCallback((todoListForRemoveId: string) => {
        dispatch(removeTodoListTC(todoListForRemoveId))
    }, [dispatch])

    const addTask = useCallback((todoListId: string, newTaskTitle: string) => {
        dispatch(addTaskTC(todoListId, newTaskTitle))
    }, [dispatch])//+

    const removeTask = useCallback((todoListId: string, taskForRemoveId: string) => {
        dispatch(removeTaskTC({todoListId, taskForRemoveId}))
    }, [dispatch]) //+

    const changeTaskStatus = useCallback((todoListId: string, taskForChangeID: string, newStatus: TaskStatuses) => {
        dispatch(changeTaskStatusTC(todoListId, taskForChangeID, newStatus))
    }, [dispatch]) //+

    const changeTaskTitle = useCallback((todoListId: string, taskForChangeId: string, newTitle: string) => {
        dispatch(changeTaskTitleTC(todoListId, taskForChangeId, newTitle))
    }, [dispatch]) //+

    const changeFilterValue = useCallback((todoListForChangeId: string, newFilterValue: FilterValuesType) => {
        dispatch(changeTodoListFilterAC({todoListForChangeId: todoListForChangeId, newFilterValue: newFilterValue}))
    }, [dispatch]) //+

    if (!isLoggedIn) {
        return <Navigate to = {'/login'}/>
    }
    return (
        <>
            <Grid container style={{padding: '10px 0px 10px 0px'}}>
                <AddItemInput addItem={addTodoList} placeholder={'Enter new todolist title'}/>
            </Grid>
            <Grid container spacing={5}>
                {todoLists.map(el => {
                    let tasksForTodoList = tasks[el.id];
                    //раньше тут фильтровали и передавали в тудулист отфильтрованный список тасок, теперь передаем все таски, а фильтрация происходит в самом тудулисте
                    // if (el.filter === 'active') {
                    //     tasksForTodoList = tasks[el.id].filter(t => !t.isDone)
                    // }
                    // if (el.filter === 'completed') {
                    //     tasksForTodoList = tasks[el.id].filter(t => t.isDone)
                    // }
                    return (
                        <Grid item key={el.id}>
                            <Paper elevation={3} style={{padding: '15px', backgroundColor: '#fff59d'}}>
                                <TodoList
                                    //todoListId={el.id}
                                    //title={el.title}
                                    //filter={el.filter}
                                    todoList={el}
                                    tasks={tasksForTodoList}
                                    changeFilterValue={changeFilterValue}
                                    removeTask={removeTask}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    removeTodoList={removeTodoList}
                                    changeTodoListTitle={changeTodoListTitle}
                                    demo = {demo}
                                />
                            </Paper>
                        </Grid>)
                })}
            </Grid>
        </>
    )
}