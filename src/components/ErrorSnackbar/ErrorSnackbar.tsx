import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import {useSelector} from 'react-redux';
import {AppRootStateType, useAppDispatch, useAppSelector} from '../../app/store';
import {InitialStateType, setRequestErrorAC} from '../../app/appReducer';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorSnackbar = () => {
    //const [open, setOpen] = useState(true)
    //дефолтный useSelector, который мы типизируем: <весь_стейт, часть_стейта_которую_хотим_достать>
    const _error = useSelector <AppRootStateType, null | string> ((state)=> state.app.error)

    //используем наш типизированный useSelector
    const error = useAppSelector<null | string>((state)=> state.app.error)
    const dispatch = useAppDispatch();
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        //setOpen(false)
        dispatch(setRequestErrorAC(null))
    }
    return (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='error' sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    )
}
