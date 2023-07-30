import {createTheme} from "@mui/material";
import {ruRU} from "@mui/material/locale";
import {ruRU as DataGrid_ruRU} from '@mui/x-data-grid';


export const darkTheme = createTheme({
    'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, select:-webkit-autofill, select:-webkit-autofill:hover, select:-webkit-autofill:focus': {
        '-webkit-box-shadow': '0 0 0px 1000px #141414 inset !important'
    },
    typography: {
        fontFamily: 'Montserrat'
    },
    palette: {
        mode: 'light',
        primary: {
            main: '#000000',
        },
        secondary: {
            main: '#bd1800',
        },
        // primary: {
        //     main: '#0D0D0E',
        // },
        // secondary: {
        //     main: '#ffffff',
        // },
        // background: {
        //     default: '#ffffff',
        //     paper: '#0D0D0E',
        // },
        // text: {
        //     primary: '#0D0D0E',
        //     secondary: '#ffffff',
        // },
        // divider: '#313131',
    },
}, DataGrid_ruRU, ruRU)
