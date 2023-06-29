import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ControlPointOutlined from '@mui/icons-material/ControlPointOutlined';

export type AddItemInputPropsType = {
    addItem: (title: string) => void
    placeholder?: string
    style?: any
    disabled?: boolean

}
//обернули компонент в React.memo()
export const AddItemInput = React.memo (({disabled = false, ...props}: AddItemInputPropsType) => {
   // console.log(`AddItemInput is called`)
    const [title, setTitle] = useState<string>('')//локальный стейт для хранения значения, введенного в инпуте
    const [error, setError] = useState<boolean>(false)//локальный стейт для хранения значения, есть ли ошибка ввода(ошибка пустой строки, ошибка превышения лимита введенных символов)
    const changeLocalTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error && setError(false) //снимаем ошибку, если начали печатать
        //!isUserMessageValid && setError(true)
        setTitle(e.currentTarget.value)
    }
    const addItem = () => {
        const trimmedTitle = title.trim()
        if (isUserMessageValid) {
            props.addItem(trimmedTitle);
            setTitle('')
        }//если введен текст не длиннее 15 символов и не короче одного, то добавляем таску и обнуляем инпут
        else if (isUserMessageToShot||isUserMessageToLong) {
            setError(true)
        } // если пытаемся добавить слишком длинную или слишком короткую таску, то добавить ошибку (если error в стейте равно true, то показывается ошибка о том, что слишком короткая строчка (
    }

    const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === 'Enter' && addItem()
    }

    //то же самое, но в другой записи, без ретурна и фигурных скобок
    // const filterHandlerCreator2 = (filter: FilterValuesType) => () => props.changeFilterValue(props.todoListId, filter)

    //старый вариант:
    // const setAllFilterValue = () => props.changeFilterValue(props.todoListId, 'all')
    // const setActiveFilterValue = () => props.changeFilterValue(props.todoListId, 'active')
    // const setCompletedFilterValue = () => props.changeFilterValue(props.todoListId, 'completed')

    const maxLengthMessage: number = 20000 //намеренно указал большое число, чтобы проверить, как показывается всплывающая ошибка при возвращении с сервера ответа о том, что текст сообщения слишком длинный
    const isUserMessageToLong: boolean = title.length > maxLengthMessage
    const isUserMessageToShot: boolean = title.trim().length < 1
    const isUserMessageValid: boolean = !isUserMessageToLong && !isUserMessageToShot

    //использовалось раньше, до TextField из material.ui, когда показывали дивки с текстом ошибки, теперь используем helperText
    // const userMaxLengthMassage = isUserMessageToLong && <div style={{color: 'red'}}>too long task</div>
    // const errorMessage = error && isUserMessageToShot && <div style={{color: 'red'}}>title is required</div>
    const isBtnDisabled = !title.trim().length || isUserMessageToLong
    return (
        <div>
            {/*вариант для юзрефа, когда не нужно в реальном времени отвлеживать, что именно находится в инпуте*/}
            {/*<input ref={addTaskInput}/>*/}
            {/*<button onClick={addTask}>+</button>*/}
            {/*вариант с постоянным отслеживанием ввода*/}
            {/*в value в инпуте устанавливаем значение из title, то есть в режиме раельного времени мы видим, что находится в локальном стейте и до момента отправки формы мы отслеживаем и можем проводить валидацию введенных данных в реальном времени*/}

            {/*Старый вариант с инпутом:*/}
            {/*<input*/}
            {/*    placeholder={props.placeholder||""} //добавит placeholder, если пришел в пропсах, иначе оставит пустым*/}
            {/*    value={title}*/}
            {/*    onChange={changeLocalTitle}*/}
            {/*    onKeyDown={onKeyDownAddTask}*/}
            {/*    className={error || isUserMessageToLong ? 'input-error' : ''}*/}
            {/*/>*/}
            {/*Новый  вариант с TextField из material.ui:*/}
            <TextField
                label={props.placeholder||""}//добавит placeholder, если пришел в пропсах, иначе оставит пустым
                variant="outlined"
                value={title}
                disabled={disabled}
                onChange={changeLocalTitle}
                onKeyDown={onKeyDownAddTask}
                error ={!!error}
                style={props.style}
                helperText={(isUserMessageToLong && 'too long title')||(error && isUserMessageToShot && 'title is required') }
            />
            {/*кнопка становится неактивной disabled={true}, когда выполняются указанные нами условия(ввели пустую строку, либо одни пробелы, или ввели текст длиннее 15 символов)*/}
            {/*<button disabled={isBtnDisabled} onClick={addItem}>+</button>*/}
            <IconButton
                disabled={isBtnDisabled}
                onClick={addItem}
                //variant={'contained'}
                color={'primary'}
                style = {{margin: '6px 0px 0px 3px' }}
            >
                <ControlPointOutlined />
            </IconButton> {/*кнопка из material.ui*/}
            {/*старый вариант(до использования helperText в TextField из material.ui:
            следующие дивки будут показаны только в случае выполнения условий, которые стоят у них в начале (в первом случае длина строки без пробелов более 15 символов, в втором случае - если состояние стейта с ошибкой будет true и длина строки без учета пробелов по краям будет меньше одного символа)*/}
            {/*{userMaxLengthMassage}*/}
            {/*{errorMessage}*/}
        </div>)


})