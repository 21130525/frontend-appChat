import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

// 1. Định nghĩa Interface chuẩn theo response server
export interface User {
    name: string;
    type: 0 | 1;         // 0: User, 1: Group
    actionTime: string;  // VD: "2025-12-23 11:58:32"
    online?: boolean;
}

const initialState: User[] = [];

export const userSlice = createSlice({
    name: 'listUser',
    initialState,
    reducers: {
        setUsers: (_state, action: PayloadAction<User[]>) => {
            const newUsers = action.payload;

            return newUsers.slice().filter(u => u.name !== localStorage.getItem('username'))
                .sort((a, b) => {
                const timeA = new Date(a.actionTime).getTime();
                const timeB = new Date(b.actionTime).getTime();
                return timeB - timeA; // Giảm dần
            });
        },
        addUser: (state, action: PayloadAction<User>) => {
            const newUser = action.payload;
            state.push(newUser);

            return state.sort((a, b) => {
                const timeA = new Date(a.actionTime).getTime();
                const timeB = new Date(b.actionTime).getTime();
                return timeB - timeA;
            });
        },
        // (Optional) Action update trạng thái online/offline nếu cần sau này
        updateUserStatus: (state, action: PayloadAction<{ name: string, online: boolean }>) => {
            const user = state.find(u => u.name === action.payload.name);
            if (user) {
                user.online = action.payload.online;
            }
        },
        updateActionTime: (state, action: PayloadAction<{ name: string, actionTime: string }>) => {
            const user = state.find(u => u.name === action.payload.name);
            if (user) {
                user.actionTime = action.payload.actionTime;
            }
        },
        sortUser: (state) => {
             state.sort((a, b) => {
                const timeA = new Date(a.actionTime).getTime();
                const timeB = new Date(b.actionTime).getTime();
                return timeB - timeA; // Giảm dần
            });
        }
    }
});

export const { setUsers, addUser, updateUserStatus,updateActionTime, sortUser } = userSlice.actions;
export default userSlice.reducer;