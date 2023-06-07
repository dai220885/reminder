
import React, {ChangeEvent, useCallback} from 'react';
import Checkbox from '@mui/material/Checkbox';
import {EditableSpan} from '../../../../../components/EditableSpan/EditableSpan';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import {TaskFromServerType, TaskStatuses} from '../../../../../api/todoLists-api';

export type TaskComponentPropsType = {
    todoListId: string
    removeTask: (todoListId: string, taskId: string) => void
    changeTaskStatus: (todoListId: string, taskId: string, newStatus: number) => void
    changeTaskTitle: (todoListId: string, taskId: string, newTitle: string) => void
    task: TaskFromServerType
}
export type TaskComponentType = ReturnType<typeof Task>
export const Task = React.memo((props: TaskComponentPropsType) => {
    const taskClasses = ['task']
    props.task.status === TaskStatuses.Completed && taskClasses.push('task-done')

    const removeTaskHandler = useCallback(() => props.removeTask(props.todoListId, props.task.id),[props.removeTask, props.todoListId, props.task.id])


    const changeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newTaskStatus = e.currentTarget.checked ? TaskStatuses.Completed: TaskStatuses.New
        props.changeTaskStatus(props.todoListId, props.task.id, newTaskStatus)
    },[props.changeTaskStatus, props.todoListId, props.task.id])

    const changeTaskTitleHandler = useCallback((newTitle: string) => {
        props.changeTaskTitle(props.todoListId, props.task.id, newTitle)
    },[props.changeTaskTitle, props.todoListId, props.task.id])

    return (
        <div key={props.task.id}>{/*key нужен для того, чтобы при изменении списка (перерендеринг) React понимал, какой элемент из списка добавился, а какой уже был ранее*/}
            {/*старый вариант с инпутом:*/}
            {/*<input*/}
            {/*    type="checkbox"*/}
            {/*    checked={task.isDone}*/}
            {/*    onChange={changeTaskStatusHandler}*/}
            {/*/>*/}
            <Checkbox
                //checked={props.task.isDone}
                checked={props.task.status === TaskStatuses.Completed}
                onChange={changeTaskStatusHandler}
            />
            {/*добавим спану классНейм, который будет состоять из task  и (в случае отмеченной галочки) task-done*/}
            {/*<span className={`task ${task.isDone? "task-done": ''}`}>{task.title}</span>*/}
            {/*делаем то же самое, но используем значения, положенные в массив taskClasses, который объявили в мэпе*/}
            {/*<span className={taskClasses.join(" ")}>{task.title}</span>*/}
            <EditableSpan
                className={taskClasses.join(' ')}
                title={props.task.title}
                onChange={changeTaskTitleHandler}
                style={props.task.status === TaskStatuses.Completed ? {opacity: '0.5', textDecoration: 'line-through'} : {}}
            />
            {/*<button onClick={removeTaskHandler}>x</button>*/}
            {/*кнопка из material.ui:*/}
            <IconButton aria-label="delete" onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </div>
    )

})