export const getCurrentActionTime = (): string => {
    const now = new Date();

    const pad = (num: number) => num.toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1); // Tháng trong JS bắt đầu từ 0
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

console.log(getCurrentActionTime());

export const getCurrentDateTimeSQL = (): string => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0 nên phải +1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const parseMessageDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    // Chuyển "2023-10-10 10:00:00" -> "2023-10-10T10:00:00Z"
    return new Date(dateStr.replace(" ", "T") + "Z").getTime();
};

/**
 * Cộng thêm số giây vào một chuỗi ngày giờ định dạng SQL.
 * @param dateString - Chuỗi ngày giờ gốc (VD: "2023-10-25 14:30:00")
 * @param secondsToAdd - Số giây cần cộng thêm (số nguyên)
 * @returns Chuỗi ngày giờ mới sau khi cộng (VD: "2023-10-25 14:30:30")
 */
    export const addTimeToDateTimeSQL = (dateString: string, secondsToAdd: number): string => {
    const date = new Date(dateString.replace(' ', 'T'));

    if (isNaN(date.getTime())) {
        console.error("Invalid date string provided:", dateString);
        return dateString; // Hoặc ném lỗi tùy logic của bạn
    }

    date.setSeconds(date.getSeconds() + secondsToAdd);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
// Lấy thời gian hiện tại
const now = getCurrentDateTimeSQL();
console.log("Hiện tại:", now);
// Output: "2023-10-27 10:00:00"

// Cộng thêm 120 giây (2 phút)
const futureTime = addTimeToDateTimeSQL(now, 7*60*60);
console.log("Tương lai:", futureTime);
// Output: "2023-10-27 10:02:00"

// Cộng thêm số giây lớn (ví dụ qua ngày mới)
const nextDayTime = addTimeToDateTimeSQL("2023-10-27 23:59:50", 20);
console.log("Qua ngày mới:", nextDayTime);
// Output: "2023-10-28 00:00:10"