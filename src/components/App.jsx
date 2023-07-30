import React from 'react'
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Header from "./Header";
import {DataGrid, GridActionsCellItem, GridToolbarContainer} from "@mui/x-data-grid";
import useReduxState from "../hooks/useReduxState.jsx";
import {ApiRequest} from "../utils/api.js";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from "@mui/material/Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {toast} from "react-toastify";
import {FormControlLabel, Switch} from "@mui/material";


export default function App() {
    const [state, setState] = useReduxState()
    const [rows, setRows] = React.useState(null)
    const [rowsCount, setRowsCount] = React.useState(1)
    const [orderBy, setOrderBy] = React.useState(null)

    const editDialogStateInitial = {
        isDialogOpened: false,
        taskId: null,
        description: null,
        isCompleted: null,
    }
    const [editDialogState, setEditDialogState] = React.useState(editDialogStateInitial)
    const openEditDialog = (taskId, description, isCompleted) => setEditDialogState({
        ...editDialogState,
        taskId: taskId,
        description: description,
        isCompleted: isCompleted,
        isDialogOpened: true,
    })
    const closeEditDialog = () => setEditDialogState({...editDialogState, isDialogOpened: false})
    const addDialogStateInitial = {
        isDialogOpened: false,
        username: null,
        email: null,
        description: null,
    }
    const [addDialogState, setAddDialogState] = React.useState(addDialogStateInitial)
    const handleAddFormOnChange = (event) => {
        setAddDialogState({
            ...addDialogState,
            [event.target.name]: event.target.value,
        })
    }
    const handleEditFormOnChange = (event) => {
        setEditDialogState({
            ...editDialogState,
            [event.target.name]: event.target.name === "isCompleted" ? event.target.checked : event.target.value,
        })
    }
    const openAddDialog = () => setAddDialogState({...addDialogState, isDialogOpened: true})
    const closeAddDialog = () => setAddDialogState({...addDialogState, isDialogOpened: false})
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 3,
        page: 0,
    })

    const loadTasks = () => {
        ApiRequest.get('/tasks', {
            page: paginationModel.page + 1,
            orderBy: orderBy,
        }).then((json) => {
            setRows(json.items)
            setRowsCount(json.count)
        })
    }

    const addTask = () => {
        if (
            !addDialogState.username ||
            addDialogState.username === 0 ||
            !addDialogState.description ||
            addDialogState.description.length === 0
        ) {
            toast.warn('Пожалуйста, проверьте введённые данные')
            return
        } else if (
            !/^[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+$/.test(addDialogState.email)
        ) {
            toast.warn('Невалидный E-Mail')
            return
        }

        ApiRequest.post('/tasks', {
            username: addDialogState.username,
            email: addDialogState.email,
            description: addDialogState.description,
        }).then((json) => {
            if (json._ok) {
                loadTasks()
                toast.success('Задача добавлена')
                setAddDialogState(addDialogStateInitial)
            } else {
                toast.error(json.detail)
            }
        })

    }
    const editTask = () => {
        if (
            !editDialogState.description ||
            editDialogState.description.length === 0
        ) {
            toast.warn('Пожалуйста, проверьте введённые данные')
            return
        }

        ApiRequest.put('/tasks/' + editDialogState.taskId, {
            description: editDialogState.description,
            isCompleted: editDialogState.isCompleted,
        }).then((json) => {
            if (json._ok) {
                loadTasks()
                toast.success('Задача отредактирована')
                setEditDialogState(editDialogStateInitial)
            } else {
                toast.error(json.detail)
            }
        })
    }

    React.useEffect(() => {
        loadTasks()
    }, [paginationModel.page, orderBy])

    const columns = [
        {
        type: 'number',
        field: 'id',
        headerName: 'ID',
        editable: false,
        aggregable: true,
        filterable: false,
        sortable: false,
        width: 75,
    }, {
        type: 'string',
        field: 'username',
        headerName: 'Имя пользователя',
        editable: false,
        hideable: false,
        aggregable: false,
        filterable: false,
        sortable: true,
        flex: 1,
    }, {
        type: 'string',
        field: 'email',
        headerName: 'E-Mail',
        editable: false,
        hideable: false,
        aggregable: false,
        filterable: false,
        sortable: true,
        flex: 1,
    }, {
        type: 'string',
        field: 'description',
        headerName: 'Описание задачи',
        aggregable: false,
        hideable: false,
        editable: false,
        filterable: false,
        sortable: false,
        flex: 2,
    }, {
        type: 'boolean',
        field: 'isCompleted',
        headerName: 'Выполнено',
        editable: false,
        hideable: false,
        aggregable: false,
        filterable: false,
        sortable: true,
        flex: .75,
    }, {
        type: 'boolean',
        field: 'editedByAdministrator',
        headerName: 'Ред.',
        editable: false,
        hideable: false,
        aggregable: false,
        filterable: false,
        sortable: false,
        flex: .75,
    }, {
        type: 'actions',
        field: 'actions',
        headerName: 'Действия',
        aggregable: false,
        hideable: false,
        filterable: false,
        sortable: false,
        width: 100,
        getActions: (params) => [
            <GridActionsCellItem
                icon={<EditRoundedIcon />}
                label="Edit"
                onClick={() => openEditDialog(params.row.id, params.row.description, params.row.isCompleted)}
                disabled={!state.isAuthorized}
            />,
        ],
    }]

    return (
        <>
            <CssBaseline />
            <Header/>
            <Container>
                <DataGrid
                    columns={columns}
                    rows={rows ? rows : []}
                    rowCount={rowsCount}
                    loading={rows == null}
                    rowHeight={30}
                    autoHeight
                    disableSelectionOnClick
                    pageSizeOptions={[]}
                    pagination
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    slots={{
                        toolbar: () => <GridToolbarContainer>
                            <Button
                                size="small"
                                startIcon={<AddRoundedIcon />}
                                onClick={openAddDialog}
                            >
                                Добавить новую задачу
                            </Button>
                        </GridToolbarContainer>
                    }}
                    sortingMode="server"
                    onSortModelChange={(model, details) => {
                        if (model.length > 0) {
                            setOrderBy(model[0].field + '_' + model[0].sort)
                        } else {
                            setOrderBy(null)
                        }
                    }}
                />
            </Container>

            {/* Add Task */}
            <Dialog
                open={addDialogState.isDialogOpened}
                onClose={closeAddDialog}
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
                            <AddRoundedIcon/> Добавить задачу
                        </Box>
                        <Box>
                            <IconButton
                                onClick={closeAddDialog}
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
                        value={addDialogState.username ? addDialogState.username : ""}
                        onChange={handleAddFormOnChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="E-Mail"
                        name="email"
                        type="text"
                        fullWidth
                        value={addDialogState.email ? addDialogState.email : ""}
                        onChange={handleAddFormOnChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Описание задачи"
                        name="description"
                        type="text"
                        fullWidth
                        value={addDialogState.description ? addDialogState.description : ""}
                        onChange={handleAddFormOnChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={addTask}>
                        Продолжить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Task */}
            <Dialog
                open={editDialogState.isDialogOpened}
                onClose={closeEditDialog}
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
                            <EditRoundedIcon/> Редактировать задачу
                        </Box>
                        <Box>
                            <IconButton
                                onClick={closeEditDialog}
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
                        label="Описание задачи"
                        name="description"
                        type="text"
                        fullWidth
                        value={editDialogState.description ? editDialogState.description : ""}
                        onChange={handleEditFormOnChange}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="isCompleted"
                                checked={editDialogState.isCompleted}
                                onChange={handleEditFormOnChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Выполнено"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={editTask}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
