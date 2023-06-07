// import React, {useReducer, useState} from 'react';
// import './App.css';
// import TodoList from './components/TodoList';
// import {v1} from 'uuid';
// import {AddItemInput} from './components/AddItemInput';
// import {createTheme,ThemeProvider} from '@mui/material/styles';
// import AppBar from '@mui/material/AppBar';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
// import IconButton from '@mui/material/IconButton';
// import Paper from '@mui/material/Paper';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Menu from '@mui/icons-material/Menu';
//
// import {
//     addTaskAC,
//     changeTaskStatusAC,
//     changeTaskTitleAC,
//     removeTaskAC,
//     tasksReducer
// } from './reducers/tasksReducer';
// import {
//     addTodoListAC,
//     changeTodoListFilterAC,
//     changeTodoListTitleAC,
//     FilterValuesType,
//     removeTodoListAC,
//     todoListsReducer
// } from './reducers/todoListsReducer';
// import {TaskPriorities, TaskStatuses} from './api/TodoListsList-api';
//
// //import { createTheme } from '@material-ui/core/styles';
//
// export const theme = createTheme({
//     palette: {
//         primary: {
//             light: '#7c7979',
//             main: '#605e5e',
//             dark: '#413d3d',
//             contrastText: '#fff',
//         },
//         secondary: {
//             light: '#90a4ae',
//             main: '#607d8b',
//             dark: '#455a64',
//             contrastText: '#000',
//         },
//     },
// });
//
// const App = () => {
//     //BLL
//     let todoListId1 = v1();
//     let todoListId2 = v1();
//
//     // let [todoLists, setTodoLists] = useState<TodoListType[]>([
//     //     {id: todoListId1, title: 'What to learn', filter: 'all'},
//     //     {id: todoListId2, title: 'What to buy', filter: 'all'},
//     // ])
//
//
//     let [todoLists, todoListsDispatch] = useReducer(todoListsReducer, [
//         {id: todoListId1, title: 'What to learn',addedDate: '', order: 0, filter: 'all'},
//         {id: todoListId2, title: 'What to buy', addedDate: '', order: 1,filter: 'all'},
//     ])
//
//     // let [tasks, setTasks] = useState<TasksForTodoListType>({
//     //     [todoListId1]: [
//     //         {id: v1(), title: 'HTML&CSS', isDone: true},
//     //         {id: v1(), title: 'JS', isDone: true},
//     //         {id: v1(), title: 'ReactJS', isDone: false},
//     //         {id: v1(), title: 'Rest API', isDone: false},
//     //         {id: v1(), title: 'GraphQL', isDone: false},
//     //     ],
//     //     [todoListId2]: [
//     //         {id: v1(), title: 'Bread', isDone: true},
//     //         {id: v1(), title: 'Milk', isDone: true},
//     //         {id: v1(), title: 'Chocolate', isDone: false},
//     //         {id: v1(), title: 'Apple', isDone: false},
//     //         {id: v1(), title: 'Oranges', isDone: false},
//     //     ]
//     // })
//
//     let [tasks, tasksDispatch] = useReducer(tasksReducer,{
//          [todoListId1]: [
//              {id: v1(), title: 'HTML&CSS', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
//              {id: v1(), title: 'JS', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
//              {id: v1(), title: 'ReactJS', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
//              {id: v1(), title: 'Rest API', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
//              {id: v1(), title: 'GraphQL', status: TaskStatuses.New, todoListId: todoListId1, addedDate: '', startDate: '', deadline: '', order: 0, priority: TaskPriorities.Low, description: ''},
//          ],
//         // [todoListId2]: [
//         //     {id: v1(), title: 'Bread', isDone: true},
//         //     {id: v1(), title: 'Milk', isDone: true},
//         //     {id: v1(), title: 'Chocolate', isDone: false},
//         //     {id: v1(), title: 'Apple', isDone: false},
//         //     {id: v1(), title: 'Oranges', isDone: false},
//         // ]
//     })
//
//     // let [filter, setFilter] = useState<FilterValuesType>('all')
//     const addTodoList = (newTodoListTitle: string) => {
//         //создаем новый тудулист здесь, а не в кейсе редьюсера т.к. айди вновь созданного тудулиста нужно передать дальше в экшенкриэйтор TasksReducer-а и задиспатчить
//         //let newTodoList: TodoListType = {id: v1(), title: newTodoListTitle, filter: 'all'}
//         // setTodoLists([newTodoList, ...todoLists])
//         const action = addTodoListAC(newTodoListTitle)
//         todoListsDispatch(action)
//         //setTasks({...tasks, [newTodoList.id]: []})
//         tasksDispatch(action)
//
//     }
//     const changeTodoListTitle = (todoListForChangeId: string, newTitle: string) => {
//         // setTodoLists(todoLists.map(el => el.id === todoListId ? {...el, title: newTitle} : el))
//         todoListsDispatch(changeTodoListTitleAC(todoListForChangeId, newTitle))
//     }
//     const removeTodoList = (todoListForRemoveId: string) => {
//         // setTodoLists(todoLists.filter(el => el.id !== todoListId))
//         //т.к. нам не нужно отрисовывать таски удаленного тудулиста, то можем их удалить прямым воздействием на список тасок, а не менять таски через setTasks()
//         const action = removeTodoListAC(todoListForRemoveId)
//         todoListsDispatch(action)
//         tasksDispatch (action)
//         //??два варианта удаления тасок удаленного тудулиста: напрямую воздействуя на объект tasks и удаляя у него свойство [todoListForRemoveId]:
//         //delete tasks[todoListForRemoveId]
//         //??? или через редьюсер TasksReducer (возможно, но не точно):
//         //tasksDispatch (removeTodoListAC(todoListForRemoveId))
//         //console.log(tasks)
//     }
//     const addTask = (todoListId: string, newTaskTitle: string) => {
//         //const newTask: TaskType = {id: v1(), title: title, isDone: false}
//         //раскукожили объект tasks, переписываем его поле [todoListId], в которое кладем все старые объекты, после чего добавляем новый созданный объект newTask перед остальными тасками
//         //setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]})
//         tasksDispatch(addTaskAC(todoListId, newTaskTitle))
//     } //+
//     const removeTask = (todoListId: string, taskForRemoveId: string) => {
//         //debugger
//         //setTasks({...tasks, [todoListId]: tasks[todoListId].filter(el => el.id !== taskId)})
//         tasksDispatch(removeTaskAC(todoListId, taskForRemoveId))
//     } //+
//     const changeTaskStatus = (todoListId: string, taskForChangeID: string, newStatus: number) => {
//         // setTasks({
//         //     ...tasks,
//         //     [todoListId]: tasks[todoListId].map(el => el.id === taskId ? {...el, isDone: newIsDone} : el)
//         // })
//         // новое значение isDone получаем в параметрах, которое в конечном итоге получим в компоненте taskList из e.currentTarget.checked при клике на него. можно было не получать это значение, а просто менять isDone на !isDone, но логика была бы точно такая же
//         tasksDispatch(changeTaskStatusAC(todoListId, taskForChangeID, newStatus))
//     } //+
//     const changeTaskTitle = (todoListId: string, taskForChangeId: string, newTitle: string) => {
//         // setTasks({
//         //     ...tasks,
//         //     [todoListId]: tasks[todoListId].map(el => el.id === taskId ? {...el, title: newTitle} : el)
//         // })
//         tasksDispatch(changeTaskTitleAC(todoListId, taskForChangeId, newTitle))
//     } //+
//     const changeFilterValue = (todoListForChangeId: string, newFilterValue: FilterValuesType) => {
//         // setFilter(filter)
//         // setTodoLists(todoLists.map(el => el.id === todoListId ? {...el, filter: newFilterValue} : el))
//         todoListsDispatch(changeTodoListFilterAC(todoListForChangeId,newFilterValue))
//     } //+
//
//     // const getFilteredTasks = (tasks: Array<TaskType>, filter: FilterValuesType) => {
//     //     switch (filter) {
//     //         case 'active':
//     //             return tasks.filter(t => !t.isDone)
//     //         case 'completed':
//     //             return tasks.filter(t => t.isDone)
//     //         default:
//     //             return tasks
//     //     }
//     // }
//     //
//     // const filteredTasks: TaskType[] = getFilteredTasks(tasks, filter)
//
//     //UI
//     console.log(tasks)
//     return (
//         <div className="App" style={{backgroundColor: '#90a4ae'}}>
//             <ThemeProvider theme={theme} >
//                 <AppBar position="static">
//                     <Toolbar>
//                         <IconButton
//                             //size="large"
//                             edge="start"
//                             color="inherit"
//                             aria-label="menu"
//                             //sx={{ mr: 2 }}
//                         >
//                             <Menu/>
//                         </IconButton>
//                         <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
//                             News
//                         </Typography>
//                         <Button color="inherit">Login</Button>
//                     </Toolbar>
//                 </AppBar>
//
//                 <Container fixed style={{backgroundColor: '#cfd8dc', paddingBottom: '20px'}}>
//                     <Grid container style={{padding: '10px 0px 10px 0px'}}>
//                         <AddItemInput addItem={addTodoList} placeholder={'Enter new todolist title'}/>
//                     </Grid>
//                     <Grid container spacing={5}>
//                         {todoLists.map(el => {
//                                 let tasksForTodoList = tasks[el.id];
//                                 if (el.filter === 'active') {
//                                     tasksForTodoList = tasks[el.id].filter(t => t.status === TaskStatuses.New)
//                                 }
//                                 if (el.filter === 'completed') {
//                                     tasksForTodoList = tasks[el.id].filter(t => t.status === TaskStatuses.Completed)
//                                 }
//                                 return <Grid item key={el.id}>
//                                     <Paper elevation={3} style={{padding: '15px', backgroundColor: '#fff59d' }}>
//                                         <TodoList
//                                             //key={el.id}
//                                             todoListId={el.id}
//                                             title={el.title}
//                                             tasks={tasksForTodoList}
//                                             changeFilterValue={changeFilterValue}
//                                             removeTask={removeTask}
//                                             addTask={addTask}
//                                             changeTaskStatus={changeTaskStatus}
//                                             changeTaskTitle={changeTaskTitle}
//                                             filter={el.filter}
//                                             removeTodoList={removeTodoList}
//                                             changeTodoListTitle={changeTodoListTitle}
//                                         />
//                                     </Paper>
//                                 </Grid>
//                             }
//                         )
//                         }</Grid>
//                 </Container>
//             </ThemeProvider>
//
//         </div>
//     );
// }
//
// export default App;

export {}