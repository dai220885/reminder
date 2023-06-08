import {setRequestErrorAC, SetRequestErrorType, setRequestStatusAC, SetRequestStatusType} from '../app/appReducer';
import {Dispatch} from 'redux';
import {ResponseType} from '../api/todoLists-api';

//используем, в санках в методе .catch (в запросе на сервер)
export const handleServerNetworkError = (dispatch: Dispatch<ErrorUtilsDispatchType>, error: { message: string }) => {
    //debugger
    if (error.message.length) {
        dispatch(setRequestErrorAC({error: error.message}))
    } else {
        dispatch(setRequestErrorAC({error: 'Some network error...'}))
    }
    dispatch(setRequestStatusAC({status: 'failed'}))
}


//используем, в санках, когда с сервера приходит статус 200, но resultCode не равен нулю (то есть, операция на стороне сервера не выполнилась)
export const handleServerAppError = <T> (dispatch: Dispatch<ErrorUtilsDispatchType>, data: ResponseType<T>) => {
    //debugger
    if (data.messages.length) {
        dispatch(setRequestErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setRequestErrorAC({error: 'Some error...'}))
    }
    dispatch(setRequestStatusAC({status: 'failed'}))
}

type ErrorUtilsDispatchType = SetRequestStatusType | SetRequestErrorType