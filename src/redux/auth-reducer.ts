import { authAPI, securityAPI } from "../api/api";
import { stopSubmit } from "redux-form";
import { AppStateType } from './redux-store';
import { ThunkAction } from 'redux-thunk';

const SET_USER_DATA = 'samurai-network/auth/SET_USER_DATA';
const GET_CAPTCHA_URL_SUCCESS = 'samurai-network/auth/GET_CAPTCHA_URL_SUCCESS';

let initialState = {
    userId: null as number | null,
    email: null as string | null,
    login: null as string | null,
    isAuth: false as boolean,
    captchaUrl: null as string | null // if null, then captcha is not required
};

type InitialStateType1 = typeof initialState

const authReducer = (state = initialState, action: ActionsType): InitialStateType1 => {
    switch (action.type) {
        case SET_USER_DATA:
        case GET_CAPTCHA_URL_SUCCESS:
            return {
                ...state,
                ...action.payload,
            }
        default:
            return state;
    }

}

type ActionsType = setAuthUserDataType | getCaptchaUrlSuccessType


type setAuthUserDataPayloadType = {
    userId: number | null
    email: string | null
    login: string | null
    isAuth: boolean
}
type setAuthUserDataType = {
    type: typeof SET_USER_DATA,
    payload: setAuthUserDataPayloadType
}
export const setAuthUserData = (userId: number | null, email: string | null, login: string | null, isAuth: boolean)
    : setAuthUserDataType => ({
        type: SET_USER_DATA, payload:
            { userId, email, login, isAuth }
    });


type getCaptchaUrlSuccessType = {
    type: typeof GET_CAPTCHA_URL_SUCCESS,
    payload: { captchaUrl: string }
}
export const getCaptchaUrlSuccess = (captchaUrl: string): getCaptchaUrlSuccessType => ({
    type: GET_CAPTCHA_URL_SUCCESS, payload: { captchaUrl }
});

export type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsType>


export const getAuthUserData = ():ThunkType => async (dispatch) => {
    let response = await authAPI.me();

    if (response.data.resultCode === 0) {
        let { id, login, email } = response.data.data;
        dispatch(setAuthUserData(id, email, login, true));
    }
}

export const login = (email: string, password: string, rememberMe: boolean, captcha: any) => async (dispatch: any) => {
    let response = await authAPI.login(email, password, rememberMe, captcha);
    if (response.data.resultCode === 0) {
        // success, get auth data
        dispatch(getAuthUserData())
    } else {
        if (response.data.resultCode === 10) {
            dispatch(getCaptchaUrl());
        }

        let message = response.data.messages.length > 0 ? response.data.messages[0] : "Some error";
        dispatch(stopSubmit("login", { _error: message }));
    }
}

export const getCaptchaUrl = ():ThunkType => async (dispatch) => {
    const response = await securityAPI.getCaptchaUrl();
    const captchaUrl = response.data.url;
    dispatch(getCaptchaUrlSuccess(captchaUrl));
}



export const logout = ():ThunkType => async (dispatch) => {
    let response = await authAPI.logout();

    if (response.data.resultCode === 0) {
        dispatch(setAuthUserData(null, null, null, false));
    }
}

export default authReducer;