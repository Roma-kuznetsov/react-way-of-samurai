import { profileAPI, usersAPI } from "../api/api";
import { stopSubmit } from "redux-form";

const ADD_POST = 'ADD-POST';
const SET_USER_PROFILE = 'SET_USER_PROFILE';
const SET_STATUS = 'SET_STATUS';
const DELETE_POST = 'DELETE_POST';
const SAVE_PHOTO_SUCCESS = 'SAVE_PHOTO_SUCCESS';

type PostType = {
    id: number
    message: string
    likesCount: number
}
type ContactsType = {
    github: string | null
    vk: string | null
    facebook: string | null
    instagram: string | null
    twitter: string | null
    website: string | null
    youtube: string | null
    mainLink: string | null
}
type PhotosType = {
    small: null | string
    large: null | string
}
type ProfileType = {
    userId: number
    lookingForAJob: boolean
    lookingForAJobDescription: string
    fullName: string
    contacts: ContactsType
    photos: PhotosType

}

let initialState = {
    posts: [
        { id: 1, message: 'Hi, how are you?', likesCount: 12 },
        { id: 2, message: 'It\'s my first post', likesCount: 11 },
        { id: 3, message: 'Blabla', likesCount: 11 },
        { id: 4, message: 'Dada', likesCount: 11 }
    ] as Array<PostType>,
    profile: null as ProfileType | null,
    status: "",
    newPostText: ''
};

export type initialStateType = typeof initialState

const profileReducer = (state = initialState, action: any) => {

    switch (action.type) {
        case ADD_POST: {
            let newPost = {
                id: 5,
                message: action.newPostText,
                likesCount: 0
            };
            return {
                ...state,
                posts: [...state.posts, newPost],
                newPostText: ''
            };
        }
        case SET_STATUS: {
            return {
                ...state,
                status: action.status
            }
        }
        case SET_USER_PROFILE: {
            return { ...state, profile: action.profile }
        }

        case DELETE_POST:
            return { ...state, posts: state.posts.filter(p => p.id != action.postId) }

        case SAVE_PHOTO_SUCCESS:
            debugger;
            return { ...state, profile: { ...state.profile, photos: action.photos } }
        default:
            return state;
    }
}

type addPostActionCreatorType = {
    type: typeof ADD_POST,
    newPostText: string
}
export const addPostActionCreator = (newPostText: string): addPostActionCreatorType => ({ type: ADD_POST, newPostText })
type setUserProfileType = {
    type: typeof SET_USER_PROFILE,
    profile: ProfileType
}
export const setUserProfile = (profile: ProfileType): setUserProfileType => ({ type: SET_USER_PROFILE, profile })
type setStatusType = {
    type: typeof SET_STATUS,
    status: string | null
}
export const setStatus = (status: string | null): setStatusType => ({ type: SET_STATUS, status })
type deletePostType = {
    type: typeof DELETE_POST,
    postId: number
}
export const deletePost = (postId: number):deletePostType => ({ type: DELETE_POST, postId })
type savePhotoSuccess = {
    type: typeof SAVE_PHOTO_SUCCESS,
    photos: PhotosType
}
export const savePhotoSuccess = (photos: PhotosType):savePhotoSuccess => ({ type: SAVE_PHOTO_SUCCESS, photos })


export const getUserProfile = (userId:number) => async (dispatch:any) => {
    const response = await usersAPI.getProfile(userId);
    dispatch(setUserProfile(response.data));
}

export const getStatus = (userId:number) => async (dispatch:any) => {
    let response = await profileAPI.getStatus(userId);
    dispatch(setStatus(response.data));
}

export const updateStatus = (status:string) => async (dispatch:any) => {
    try {
        let response = await profileAPI.updateStatus(status);

        if (response.data.resultCode === 0) {
            dispatch(setStatus(status));
        }
    } catch (error) {
        //
    }
}
export const savePhoto = (file:any) => async (dispatch:any) => {
    let response = await profileAPI.savePhoto(file);

    if (response.data.resultCode === 0) {
        dispatch(savePhotoSuccess(response.data.data.photos));
    }
}
export const saveProfile = (profile:ProfileType) => async (dispatch:any, getState:any) => {
    const userId = getState().auth.userId;
    const response = await profileAPI.saveProfile(profile);

    if (response.data.resultCode === 0) {
        dispatch(getUserProfile(userId));
    } else {
        dispatch(stopSubmit("edit-profile", { _error: response.data.messages[0] }));
        return Promise.reject(response.data.messages[0]);
    }
}

export default profileReducer;