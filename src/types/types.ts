import { AppStateType } from './../redux/redux-store';

export type ContactsType = {
    github: string | null
    vk: string | null
    facebook: string | null
    instagram: string | null
    twitter: string | null
    website: string | null
    youtube: string | null
    mainLink: string | null
}
export type PhotosType = {
    small: null | string
    large: null | string
}
export type ProfileType = {
    userId: number
    lookingForAJob: boolean
    lookingForAJobDescription: string
    fullName: string
    contacts: ContactsType
    photos: PhotosType
}
export type UsersType = {
    id: number
    name: string
    status: string
    followed: boolean
    photos: PhotosType
}

export type GetStateType = () => AppStateType