import React, {FC} from 'react';
//import {TaskType} from '../reducers/tasksReducer';
import {Task, TaskComponentType} from './Task/Task';
import {TaskFromServerType} from '../../../../api/todoLists-api';

type TasksListPropsType = {
    todoListId: string
    tasks: TaskFromServerType[]
    removeTask: (todoListId: string, taskId: string) => void
    changeTaskStatus: (todoListId: string, taskId: string, newStatus: number) => void
    changeTaskTitle: (todoListId: string, taskId: string, newTitle: string) => void
}

const TasksList: FC<TasksListPropsType> = (props): JSX.Element => {
    const tasksItems: JSX.Element| TaskComponentType[] =
        props.tasks.length
            ? props.tasks.map((task) => {
                return(
                        <Task
                            todoListId={props.todoListId}
                            removeTask={props.removeTask}
                            changeTaskStatus={props.changeTaskStatus}
                            changeTaskTitle={props.changeTaskTitle}
                            task={task}
                            key = {task.id}
                        />
                    )
            })
            : <span>Your taskslist is empty</span>
    return (
        <ul>
            {tasksItems}
        </ul>
    );
};

export default TasksList;

