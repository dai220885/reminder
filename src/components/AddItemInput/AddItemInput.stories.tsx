import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

import { action } from '@storybook/addon-actions'
import {Meta, StoryObj} from '@storybook/react';
import Button from '@mui/material/Button';
import {log} from 'util';
import TextField from '@mui/material/TextField';
import {AddItemInput, AddItemInputPropsType} from './AddItemInput';

// type Story = StoryObj<typeof AddItemForm>;
//
// export default {
//     title: 'AddItemForm Component',
//     component: AddItemForm
// }
// const callback = action('button "add" was pressed inside the form')
//
// export const AddItemFormBaseExample = (props: any) => {
//
//     return <AddItemForm callBack={callback}/>
// }



const meta: Meta<typeof AddItemInput> = {
    title: 'TODOLISTS/AddItemInput',
    component: AddItemInput,
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        addItem: {
            description: 'some description',
            //action: 'clicked'
        }
    },
};

export default meta;
type Story = StoryObj<typeof AddItemInput>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const AddItemInputStory: Story = {
    args: {
        addItem: action('button "add" was pressed inside the form')
    }
};

export const AddItemInputWithErrorStory: any = (args: AddItemInputPropsType) => {
    //console.log('AddItemForm')
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>("Title is required")

    const addTask = () => {
        if (title.trim() !== "") {
            args.addItem(title.trim());
            setTitle("");
        } else {
            setError("Title is required");
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) {setError(null);}
        if (e.charCode === 13) {
            addTask();
        }
    }
    const buttonSettings = {
        maxWidth: '38px',
        maxHeight: '38px',
        minWidth: '38px',
        minHeight: '38px',
        backgroundColor: 'black',
    }
    return (
        <div>
            {/*<input value={title}*/}
            {/*       onChange={onChangeHandler}*/}
            {/*       onKeyPress={onKeyPressHandler}*/}
            {/*       className={error ? "error" : ""}*/}
            {/*/>*/}
            <TextField
                value={title}
                onChange={onChangeHandler}
                placeholder={'Title'}
                onKeyPress={onKeyPressHandler}
                id="outlined-basic"
                label={error? 'title is required': 'Please type out...'}
                variant="outlined"
                size={'small'}
                error={!!error} //быстренько string переводим в boolean
            />
            {/*<button onClick={addTask}>+</button>*/}
            <Button
                size="small"
                variant="contained"
                onClick={addTask}
                style={buttonSettings}
            >+</Button>
            {/*{error && <div className="error-message">{error}</div>}*/}
        </div>
    )
}


export const AddItemInputStory2: Story = {
    render: () => <AddItemInput addItem={()=>action('11111')} placeholder={'Title'}/>
};

export const AddItemInputDisabledStory = (props: any) => {
    return (
        <AddItemInput disabled = {true} addItem={()=>{}} placeholder={'Title'}/>
    )

}