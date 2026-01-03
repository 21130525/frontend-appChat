import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface SearchData {
    searchTerm: string;
    status: boolean;
}
const initialState: SearchData = {
    searchTerm:'',
    status: false,
}
export const searchSlice = createSlice({
    name:'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setStatus: (state, action: PayloadAction<boolean>) => {
            state.status = action.payload;
        }
    }
})
export const {setSearchTerm, setStatus} = searchSlice.actions;
export default searchSlice.reducer;