import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import {useSelector} from 'react-redux';

import {InitialStateType, setRequestErrorAC} from '../../app/appReducer';
import {useAppDispatch, useAppSelector} from '../../app/hooks';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const ErrorSnackbar = () => {
    //const [open, setOpen] = useState(true)
    //дефолтный useSelector, который мы типизируем: <весь_стейт, часть_стейта_которую_хотим_достать>
    //используем наш типизированный useSelector
    const error = useAppSelector((state)=> state.app.error)
    const dispatch = useAppDispatch();
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        //setOpen(false)
        dispatch(setRequestErrorAC({error: null}))
    }
    return (
        <Snackbar open={!!error} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='error' sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    )
}
