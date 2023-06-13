import React from 'react';
import {Meta, StoryObj} from '@storybook/react';
import AppWithRedux from './AppWithRedux';
import {BrowserRouterDecorator, ReduxStoreProviderDecorator} from '../ReduxStoreProviderDecorator';
import StoryRouter from 'storybook-react-router'

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

const meta: Meta<typeof AppWithRedux> = {
    title: 'TODOLISTS/AppWithRedux',
    component: AppWithRedux,
    tags: ['autodocs'],
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator]

};

export default meta;
type Story = StoryObj<typeof AppWithRedux>;

export const AppWithReduxStory: Story = {
    //render: () => <Provider store={store}><AppWithRedux/></Provider>
    render: () => <AppWithRedux demo={true}/>
}
