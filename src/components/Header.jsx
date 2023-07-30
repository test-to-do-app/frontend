import * as React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid2 from "@mui/material/Unstable_Grid2";
import useReduxState from "../hooks/useReduxState";
import {logOut, setToken} from "../utils/reducer";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {ApiRequest} from "../utils/api.js";
import {toast} from "react-toastify";


export default function Header() {
    const [state, setState] = useReduxState()
    const [isLoginFormOpen, setIsLoginFormOpen] = React.useState(false)
    const credentialsInitial = {
        username: null,
        password: null,
    }
    const [credentials, setCredentials] = React.useState(credentialsInitial)

    const handleLoginFormOnChange = (event) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value,
        })
    }
    const handleCloseLoginForm = () => setIsLoginFormOpen(false)
    const handleOpenLoginForm = () => setIsLoginFormOpen(true)
    const handleLoginButton = async () => {
        if (
            !credentials.username ||
            credentials.username.length === 0 ||
            !credentials.password ||
            credentials.password.length === 0
        ) {
            toast.warn('Пожалуйста, проверьте введённые данные')
            return
        }
        const json = await ApiRequest.post('/auth', {
            username: credentials.username,
            password: credentials.password,
        })

        // Успешый ответ
        if (json._ok) {
            setState(setToken, json.token)
            toast.success('Успешно!')
            setCredentials(credentialsInitial)
            handleCloseLoginForm()

        } else {
            if (json._statusCode === 422) {
                toast.warn('Кажется, что-то не так с введёнными данными')
            } else if (json._statusCode === 401) {
                toast.warn('Неверные данные')
            } else {
                toast('😔 Что-то пошло не так')
            }
        }
    }
    const handleLogOutButton = () => setState(logOut)

    return <>
        <Container
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 2,
            }}
        >
            <Grid2></Grid2>
            <Grid2 container>
                <Button
                    variant="outlined"
                    onClick={state.isAuthorized ? handleLogOutButton : handleOpenLoginForm}
                >
                    {state.isAuthorized ? "Выйти" : "Войти"}
                </Button>
            </Grid2>
        </Container>

        {/* Форма логина */}
        <Dialog
            open={isLoginFormOpen}
            onClose={handleCloseLoginForm}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        alignItems: 'normal',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',

                            '& svg': {
                                width: 20,
                                mr: 1,
                            },
                        }}
                    >
                        <LoginRoundedIcon/> Вход в систему
                    </Box>
                    <Box>
                        <IconButton
                            onClick={handleCloseLoginForm}
                        >
                            <CloseRoundedIcon color='primary'/>
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Имя пользователя"
                    name="username"
                    type="text"
                    fullWidth
                    value={credentials.username ? credentials.username : ""}
                    onChange={handleLoginFormOnChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Пароль"
                    name="password"
                    type="password"
                    fullWidth
                    value={credentials.password ? credentials.password : ""}
                    onChange={handleLoginFormOnChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleLoginButton}>
                    Продолжить
                </Button>
            </DialogActions>
        </Dialog>
    </>
}