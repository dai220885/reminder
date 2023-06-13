import axios from 'axios';


const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    headers: {
        'API-KEY': '3128443d-f108-4e76-956c-6d97ad90fd1e'
    }
})

//api:
export const todoListsApi = {
    getTodoLists() {
        return instance.get <TodoListFromServerType[]>('/todo-lists')
    },

    createTodoList(title: string) {
        return instance.post<ResponseType<{item: TodoListFromServerType}>>('/todo-lists', {title: title})
    },

    deleteTodoList(todolistID: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistID}`)
    },

    updateTodoList(todolistID: string, newTitle: string) {
        return instance.put<ResponseType>(`/todo-lists/${todolistID}`, {title: newTitle})
    },

    getTasks(todolistID: string) {
        return instance.get <GetTasksType> (`/todo-lists/${todolistID}/tasks`)
    },

    createTask(todolistID: string, title: string) {
        return instance.post <ResponseType<{ item: TaskFromServerType }>>(`/todo-lists/${todolistID}/tasks`, {title: title})
    },

    deleteTask(todolistID: string, taskID: string) {
        return instance.delete <ResponseType> (`/todo-lists/${todolistID}/tasks/${taskID}`)
    },

    updateTask(todolistID: string, taskID: string, taskModel: UpdateTaskModelType ) {
        return instance.put (`/todo-lists/${todolistID}/tasks/${taskID}`, {...taskModel})
    },
}

export const authApi = {
    login(data: LoginParamsType) {
        return instance.post <ResponseType<{userId?: number}>>('/auth/login', data)
    },
    logout() {
        return instance.delete <ResponseType<{userId?: number}>>('/auth/login')
    },
    me() {
        return instance.get <ResponseType<{id: number, email: string, login: string}>>('/auth/me')
    }
}

//types:
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}
export enum ResultCode {
    OK = 0,
    ERROR = 1,
    ERROR_CAPTCHA = 2,
}
export type TodoListFromServerType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}
export type ResponseType<D={}> = { //если параметр D не передавать, н он по умолчанию будет пустым объектом
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskFromServerType = {
    id: string
    title:string
    description: string | null
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string | null
    deadline: string | null
    addedDate: string
}
type GetTasksType = {
    items: TaskFromServerType[]
    totalCount: number
    error: string | null
}
export type UpdateTaskModelType = {
    title: string
    description: string | null
    //completed: boolean
    status: number
    priority: number
    startDate: string | null
    deadline: string | null
}

//уже не используем, вместо них ResponseType<D>
type CreateTodolistResponseType = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: {
        item: TodoListFromServerType
    }
}
type DeleteTodolistResponseType = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: {
    }
}
type UpdateTodolistResponseType = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: {
    }
}
