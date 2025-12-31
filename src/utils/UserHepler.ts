interface User {
    name: string;
    type: number;
    actionTime: string;
}
interface UserResponse {
    data: User[]
}
export function getSortedUsers(response: UserResponse, order: 'asc' | 'desc' = 'desc'): User[] {
    // Tạo một bản sao của mảng để không làm thay đổi dữ liệu gốc
    const users = [...response.data];

    return users.sort((a, b) => {
        const timeA = new Date(a.actionTime).getTime();
        const timeB = new Date(b.actionTime).getTime();

        if (order === 'asc') {
            return timeA - timeB; // Cũ đến mới
        } else {
            return timeB - timeA; // Mới đến cũ
        }
    });
}