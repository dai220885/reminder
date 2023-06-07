import {setRequestErrorAC, SetRequestErrorType, setRequestStatusAC, SetRequestStatusType} from '../app/appReducer';
import {Dispatch} from 'redux';
import {ResponseType} from '../api/todoLists-api';

//используем, в санках в методе .catch (в запросе на сервер)
export const handleServerNetworkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: { message: string }) => {
    //debugger
    if (error.message.length) {
        dispatch(setRequestErrorAC(error.message))
    } else {
        dispatch(setRequestErrorAC('Some network error...'))
    }
    dispatch(setRequestStatusAC('failed'))
}


//используем, в санках, когда с сервера приходит статус 200, но resultCode не равен нулю (то есть, операция на стороне сервера не выполнилась)
export const handleServerAppError = <T> (dispatch: Dispatch<ErrorUtilsDispatchType>, data: ResponseType<T>) => {
    //debugger
    if (data.messages.length) {
        dispatch(setRequestErrorAC(data.messages[0]))
    } else {
        dispatch(setRequestErrorAC('Some error...'))
    }
    dispatch(setRequestStatusAC('failed'))
}

type ErrorUtilsDispatchType = SetRequestStatusType | SetRequestErrorType