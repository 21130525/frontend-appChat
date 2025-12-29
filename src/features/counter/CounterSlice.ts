import {createSlice} from "@reduxjs/toolkit";

// 1. định nghĩa kiểu dữ liệu cho state
interface CounterState {
    value: number
}
// 2. khởi taoj giá trị ban đầu
const initialState: CounterState={
    value:0,
}
// 3. tạo slice
export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        increment: (state) => {
            state.value +=1;
        },

        decrement: (state) => {
            state.value -=1;
        },

        incrementByAmount: (state, action) => {
            state.value += action.payload;
        }
    }
})
// 4. Xuất các action ra để sử dụng
export const {increment, decrement, incrementByAmount} = counterSlice.actions;

export  default counterSlice.reducer;
