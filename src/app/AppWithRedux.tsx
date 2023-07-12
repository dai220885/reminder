import React, {useCallback, useEffect} from 'react';
import '../trash/App.css';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/icons-material/Menu';
import {CircularProgress, LinearProgress} from '@mui/material';

import {useSelector} from 'react-redux';
import {initializeAppTC, RequestStatusType} from './appReducer';
//import {AppRootStateType} from './store';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {logoutTC} from '../features/Login/authReducer';
import {Login} from '../features/Login/Login';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {TodoListsList} from '../features/TodoListsList/TodoListsList';

//import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
	palette: {
		primary: {
			light: '#7c7979',
			main: '#605e5e',
			dark: '#413d3d',
			contrastText: '#fff',
		},
		secondary: {
			light: '#90a4ae',
			main: '#607d8b',
			dark: '#455a64',
			contrastText: '#000',
		},
	},
});

//просто палитра для экспериментов:
export const theme2 = createTheme({
	palette: {
		primary: {
			light: '#7c7979',
			main: '#605e5e',
			dark: '#413d3d',
			contrastText: '#fff',
		},
		secondary: {
			light: '#90a4ae',
			main: '#607d8b',
			dark: '#455a64',
			contrastText: '#000',
		},
	},
});

type PropsType = {
	demo?: boolean// нужно только для сторибука, чтобы устанавливать "демо режим", а не запрашивать тудулисты с сервера.
}
const AppWithRedux: React.FC<PropsType> = ({demo = false}) => {
	//UI
	//console.log(tasks)
	const dispatch = useAppDispatch();
	//const status = useSelector<AppRootStateType, RequestStatusType>((state) =>state.app.status)
	const status = useAppSelector((state) => state.app.status)

	const isInitialized = useAppSelector((state) => state.app.isInitialized)
	const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

	useEffect(() => {
		if (!demo) {
			dispatch(initializeAppTC())
		}
	}, [])


	const logoutHandler = useCallback(() => {
		dispatch(logoutTC())
	}, [])

	if (!isInitialized) {
		return (
			<div style={{
				position: 'fixed', top: '30%', textAlign: 'center', width:
					'100%'
			}}>
				<CircularProgress/>
			</div>)
	}

	return (
		// basename={'/reminder-rtk'} нужно, чтобы работали роутинги на gh-pages
		//   <BrowserRouter basename={'/reminder'}>
		//<BrowserRouter basename={'/reminder-rtk'}>
		<div className="App" style={{backgroundColor: '#90a4ae'}}>
			<ThemeProvider theme={theme2}>
				<AppBar position="fixed">
					<Toolbar>
						<IconButton
							//*size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							//*sx={{ mr: 2 }}
						>
							<Menu/>
						</IconButton>
						<Typography variant="h6" component="div" sx={{flexGrow: 1}}>
							News
						</Typography>
						{isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
					</Toolbar>
				</AppBar>
				{status === 'loading' && <LinearProgress color="secondary"/>}
				<Container fixed style={{backgroundColor: '#cfd8dc', paddingBottom: '20px', minHeight: '880px'}}>
					<Routes>
						<Route path="/" element={<TodoListsList demo={demo}/>}/>
						<Route path="/login" element={<Login/>}/>
						<Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>}/>
						<Route path="*" element={<Navigate to={'/404'}/>}/>
						{/*<Route path = "/1-todolist" element = {<Navigate to={'/'}/>}/>*/}
						{/*<Route path='*' element={<h1>404: PAGE NOT FOUND</h1>} />*/}
					</Routes>
				</Container>
				<ErrorSnackbar/>
			</ThemeProvider>
		</div>
		// </BrowserRouter>
	);
}
export default AppWithRedux;
