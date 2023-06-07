import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react';
import TextField from '@mui/material/TextField';

export type EditableSpanPropsType = {
    title: string
    onChange: (newTitleValue: string) => void
    className?: string
    style?: {}

}
export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    //console.log(`EditableSpan '${props.title}' is called`)
    let [editMode, setEditMode] = useState<boolean>(false)//стейт для хранения режима отображения (просмотр-ViewMode или редактирование-EditMode)
    let [title, setTitle] = useState<string>('') //стейт для хранения вводимого значения (перезаписывается при onChange)

    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }
    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }
    const onChangeTitleHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }, [title])
    let onKeyDownHandler = useCallback((event: KeyboardEvent<HTMLInputElement>)=>{
        //console.log(event)
        // if((event.code==="Enter"||event.code==="NumpadEnter") && event.ctrlKey)//так тоже работает
        if(event.key==="Enter"){
            activateViewMode()
        }
    },[editMode, title])
    return (
        editMode
            ?
            // <input type="text" onChange={onChangeTitleHandler} onKeyDown={onKeyDownHandler} value={title} onBlur={activateViewMode} autoFocus={true} /> //старый вариант
            <TextField
                type="text"
                onChange={onChangeTitleHandler}
                onKeyDown={onKeyDownHandler}
                value={title}
                onBlur={activateViewMode}
                autoFocus={true}
                variant="standard"
            />
            :
            <span className={props.className || ''} onDoubleClick={activateEditMode} style={props.style}>
                {/*при использовании @mui/material для изменения стилей используется не className и стили в css файле, а атрибут style в теге */}
                {props.title}
            </span>
    )
})