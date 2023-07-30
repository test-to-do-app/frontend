import {useDispatch, useSelector} from "react-redux";


export default function useReduxState() {
    const state = useSelector(state => {
        // console.log(state)
        return state
    })
    const dispatch = useDispatch()
    return [state, (action, payload = null) => {dispatch(action(payload))}]
}