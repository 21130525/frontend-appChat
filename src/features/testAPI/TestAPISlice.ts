import {createSlice} from "@reduxjs/toolkit";

interface WebSocketState {
    status: string;
    messages: any[];
}

const initialState: WebSocketState = {
    status: 'DISCONNECTED',
    messages: [],
};

export const TestAPISlice = createSlice({
    name:'TestAPI',
    initialState,
    reducers:{

    }
})
// 4. Xuất các action ra để sử dụng
// eslint-disable-next-line no-empty-pattern
export const {} = TestAPISlice.actions;


export  default TestAPISlice.reducer;
