interface User {
    name: string;
    type: number;
    actionTime: string;
}

/**
 * Return a new array of users sorted by their `actionTime`.
 *
 * @param usersData - The array of `User` objects to sort.
 * @param order - Sort direction: `'asc'` for oldest-to-newest, `'desc'` for newest-to-oldest (default `'desc'`).
 * @returns A new array of `User` sorted by `actionTime`; returns an empty array if `usersData` is not an array.
 */
export function getSortedUsers(usersData: User[], order: 'asc' | 'desc' = 'desc'): User[] {
    // Kiểm tra nếu usersData không phải là mảng thì trả về mảng rỗng để tránh lỗi
    if (!Array.isArray(usersData)) {
        console.error("getSortedUsers: Expected an array but got", usersData);
        return [];
    }

    // Tạo một bản sao của mảng để không làm thay đổi dữ liệu gốc
    const users = [...usersData];

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