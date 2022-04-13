import { type } from 'os';
const SEND_MESSAGE = 'SEND_MESSAGE';

type DialogsType = {
    id: number
    name: string
}
type MessageType = {
    id: number
    message: string
}


let initialState = {
    dialogs: [
        { id: 1, name: 'Dimych' },
        { id: 2, name: 'Andrew' },
        { id: 3, name: 'Sveta' },
        { id: 4, name: 'Sasha' },
        { id: 5, name: 'Viktor' },
        { id: 6, name: 'Valera' }
    ] as Array<DialogsType>,
    messages: [
        { id: 1, message: 'Hi' },
        { id: 2, message: 'How is your it-kamasutra?' },
        { id: 3, message: 'Yo' },
        { id: 4, message: 'Yo' },
        { id: 5, message: 'Yo' }
    ] as Array<MessageType>
};

const dialogsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case SEND_MESSAGE:
            let body = action.newMessageBody;
            return {
                ...state,
                messages: [...state.messages, { id: 6, message: body }]
            };
        default:
            return state;
    }
}
type sendMessageCreatorType = {
    type: typeof SEND_MESSAGE,
    newMessageBody:string
}


export const sendMessageCreator = (newMessageBody:string):sendMessageCreatorType => ({ type: SEND_MESSAGE, newMessageBody })


export default dialogsReducer;