import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {loginTC} from './authReducer';
import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';



//free-аккаунт (Email: free@samuraijs.com Password: free)
type FormValuesType = {
    email: string,
    password: string,
    rememberMe: boolean,
}
export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state =>  state.auth.isLoggedIn)
    const formik = useFormik({
        validate: (values) => {
            if (!values.email) {
                // можно сделать так:
                // errors.email = 'Required'
                //а можно вернуть объект, к которому можно обратиться: formik.errors.email
                return {
                    email: 'email is required'
                }
            }
            //проверка валидности имейла
            // else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            //     return {
            //         email: 'Invalid email address'
            //     }
            // }
            if (!values.password) {
                return {
                    password: 'password is required'
                }
            }

        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: async (values, formikHelpers :FormikHelpers<FormValuesType>) => {
            const action = await dispatch(loginTC({loginParams: values}));
            if (loginTC.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError (error.field, error.error)
                }
            }

            //formikHelpers.setFieldError ('email', 'testEmailError')
            //formikHelpers.setFieldError ('password', 'testPasswordError')
            //можно зачистить поля ввода:
            //formik.resetForm();
        },
    })

    if (isLoggedIn) {
        return <Navigate to = {'/'}/>
    }
    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                            //можно по отдельности передавать пропсы:
                            // name = 'email'
                            // onChange = {formik.handleChange}
                            // value = {formik.values.email}
                            // а можно деструктуризировать и забрать пропсы для определенного поля(филда), в нашем случае для 'email':
                                   {...formik.getFieldProps('email')}/>
                        {/*при наличии ошибки в имэйле, отображаем ее под полем имейл:*/}
                        {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   name="password"
                                   onChange={formik.handleChange}
                                   value={formik.values.password}
                        />
                        {/*при наличии ошибки в пароле, отображаем ее под полем пароля:*/}
                        {formik.errors.password ? <div>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox onChange={formik.handleChange}
                                                             checked={formik.values.rememberMe}
                                                             name="rememberMe"/>}/>
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}