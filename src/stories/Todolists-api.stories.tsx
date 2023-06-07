//src/stories/TodoListsList-api.stories.tsx
import React, {useEffect, useState} from 'react'
import axios from 'axios';
import {todoListsApi} from '../api/todoLists-api';

export default {
    title: 'TODOLISTS/API'
}
const instance = axios.create(
    {
        withCredentials: true,
        baseURL: 'https://social-network.samuraijs.com/api/1.1',
        headers: {
            'API-KEY': '3128443d-f108-4e76-956c-6d97ad90fd1e'
        }
    }
)


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        todoListsApi.getTodoLists()
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoListsApi.createTodoList('new todolist from App')
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistID = '1230ff59-50c7-40d5-9740-fa598d8a4ea3'
        todoListsApi.deleteTodoList(todolistID)
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        //let todolistID = '760ced6c-7b9b-4a3f-bbe2-92bcfd7d457f'
        let todolistID = 'b65ad442-503a-487b-9d0f-ea3609863612'
        let newTitle = 'todolist from App 222 (with tasks)'
        todoListsApi.updateTodoList(todolistID, newTitle)
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    // useEffect(() => {
    //     //let todolistID = '760ced6c-7b9b-4a3f-bbe2-92bcfd7d457f'
    //     //let todolistID = 'b65ad442-503a-487b-9d0f-ea3609863612'
    //     let todolistID = 'ed280b4f-2e77-4574-b13e-672ab961d9fb'
    //     totolistsAPI.getTasks(todolistID)
    //         .then((res) => {
    //             //debugger
    //             setState(res.data)
    //         })
    // }, [])
    const onGetTaskHandler = () => {
        todoListsApi.getTasks(todolistId)
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }
    return (
        <div>{JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value)
                    }}
                />
                <button onClick={onGetTaskHandler}>get tasks</button>
            </div>
        </div>
    )
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')
    // useEffect(() => {
    //     //let todolistID = '760ced6c-7b9b-4a3f-bbe2-92bcfd7d457f'
    //     //let todolistID = 'b65ad442-503a-487b-9d0f-ea3609863612'
    //     let todolistID = 'ed280b4f-2e77-4574-b13e-672ab961d9fb'
    //     let newTaskTitle = 'new task 9999999999999999999'
    //     totolistsAPI.createTask(todolistID, newTaskTitle)
    //         .then((res) => {
    //             //debugger
    //             setState(res.data)
    //         })
    // }, [])
    const onCreateTaskHandler = () => {
        todoListsApi.createTask(todolistId, taskTitle)
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }
    return (
        <div>{JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {setTodolistId(e.currentTarget.value)}}
                />
                <input
                    placeholder={'taskTitle'}
                    value={taskTitle}
                    onChange={(e) => {setTaskTitle(e.currentTarget.value)}}
                />
                <button onClick={onCreateTaskHandler}>create task</button>
            </div>
        </div>
    )

}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    // useEffect(() => {
    //     //let todolistID = '760ced6c-7b9b-4a3f-bbe2-92bcfd7d457f'
    //     let todolistID = 'b65ad442-503a-487b-9d0f-ea3609863612'
    //     let taskID = '1ecb0217-a29e-4c8f-84c1-83ef11e6f581'
    //     totolistsAPI.deleteTask(todolistID, taskID)
    //         .then((res) => {
    //             //debugger
    //             setState(res.data)
    //         })
    // }, [])
    const onDeleteTaskHandler = () => {
        //let todolistID = '760ced6c-7b9b-4a3f-bbe2-92bcfd7d457f'
        //let todolistID = 'b65ad442-503a-487b-9d0f-ea3609863612'
        //let taskID = '1ecb0217-a29e-4c8f-84c1-83ef11e6f581'
        todoListsApi.deleteTask(todolistId, taskId)
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }
    return (
        <div>{JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskId}
                    onChange={(e) => {
                        setTaskId(e.currentTarget.value)
                    }}
                />
                <button onClick={onDeleteTaskHandler}>delete task</button>
            </div>
        </div>
    )

}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    const [newTaskTitle, setNewTaskTitle] = useState<string>('')
    let taskModel = {
        title: 'updated title',
        description: 'updated description',
        completed: true,
        status: 0,
        priority: 1,
        startDate: null,
        deadline: null,
    }
    // useEffect(() => {
    //     let todolistID = '760ced6c-7b9b-4a3f-bbe2-92bcfd7d457f'
    //     let taskID = '8b7c268c-c001-4cd6-9285-f85ceb2eaaba'
    //
    //     totolistsAPI.updateTask(todolistID, taskID, taskModel)
    //         .then((res) => {
    //             //debugger
    //             setState(res.data)
    //         })
    // }, [])
    const onUpdateTaskHandler = () => {
        todoListsApi.updateTask(todolistId, taskId, {...taskModel, title: newTaskTitle})
            .then((res) => {
                //debugger
                setState(res.data)
            })
    }
    return (
        <div>{JSON.stringify(state)}
            <div>
                <input
                    placeholder={'todolistId'}
                    value={todolistId}
                    onChange={(e) => {
                        setTodolistId(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'taskId'}
                    value={taskId}
                    onChange={(e) => {
                        setTaskId(e.currentTarget.value)
                    }}
                />
                <input
                    placeholder={'newTaskTitle'}
                    value={newTaskTitle}
                    onChange={(e) => {
                        setNewTaskTitle(e.currentTarget.value)
                    }}
                />
                <button onClick={onUpdateTaskHandler}>update task</button>
            </div>
        </div>
    )
}