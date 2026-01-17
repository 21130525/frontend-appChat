import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface hasNewMesState {
    userReceives: string[];
}

const initialState: hasNewMesState = {
    userReceives: []
}
const ReceivesNewMesSlice = createSlice({
    name: 'receivesNewMessage',
    initialState: initialState,
    reducers: {
        addUserReceives: (state, action: PayloadAction<string>) => {
            if(state.userReceives.includes(action.payload)){
                return;
            }
            state.userReceives.push(action.payload)
        },
      removeUserReceive: (state, action: PayloadAction<string>) => {
          const idx = state.userReceives.indexOf(action.payload);
          if (idx !== -1) {
              state.userReceives.splice(idx, 1);
          }
      },
        resetUserReceive: (state) => {
            state.userReceives = []
        }
    }
})
export const {addUserReceives, removeUserReceive, resetUserReceive} = ReceivesNewMesSlice.actions;
export default ReceivesNewMesSlice.reducer