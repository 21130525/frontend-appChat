import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

// 1. Định nghĩa Interface chuẩn theo response server
export interface User {
    name: string;
    type: 0 | 1;         // 0: User, 1: Group
    actionTime: string;  // Dùng để sắp xếp (VD: "2025-12-23 11:58:32")
    online?: boolean;
}

const initialState: User[] = [];

export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (_state, action: PayloadAction<User[]>) => {
            const newUsers = action.payload;

            return newUsers.slice().sort((a, b) => {
                const timeA = new Date(a.actionTime).getTime();
                const timeB = new Date(b.actionTime).getTime();
                return timeB - timeA; // Giảm dần
            });
        },

        // (Optional) Action update trạng thái online/offline nếu cần sau này
        updateUserStatus: (state, action: PayloadAction<{ name: string, online: boolean }>) => {
            const user = state.find(u => u.name === action.payload.name);
            if (user) {
                user.online = action.payload.online;
            }
        }
    }
});

export const { setUsers, updateUserStatus } = userSlice.actions;
export default userSlice.reducer;