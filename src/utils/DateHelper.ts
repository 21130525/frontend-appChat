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
