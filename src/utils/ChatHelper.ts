import type {Message, MessageResponse} from "../features/chat/chatWindow/ChatRoomDTO.ts";

const parseMessageDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    // Chuyển "2023-10-10 10:00:00" -> "2023-10-10T10:00:00Z"
    return new Date(dateStr.replace(" ", "T") + "Z").getTime();
};

export const processAndSortMessages = (
    messages: MessageResponse[] | Message[], // Chấp nhận cả 2 loại input
    currentUser: string
): Message[] => {
    // 1. Map dữ liệu (Thêm isMe)
    const processed = messages.map((msg) => ({
        ...msg,
        isMe: msg.name === currentUser,
        createAt: msg.createAt || new Date().toISOString()
    })) as Message[];

    processed.sort((a, b) => {
        const timeA = parseMessageDate(a.createAt);
        const timeB = parseMessageDate(b.createAt);
        return timeB - timeA;
    });

    return processed;
};

// ham xu ly ngay gui tin nhan trả về string : today neu trong ngay, ngay trông tuần neu trong vong 7 ngay, ngay thang cu the
export const handleDateSendMes = (dateStr: string): string => {
    if (!dateStr) return '';

    const messageDate = new Date(dateStr.replace(" ", "T"));
    const now = new Date();

    const messageDateOnly = new Date(messageDate.toDateString());
    const nowDateOnly = new Date(now.toDateString());

    const diffTime = nowDateOnly.getTime() - messageDateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return messageDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    if (diffDays > 0 && diffDays < 7) {
        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        return days[messageDate.getDay()] + ' '+ messageDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    return messageDate.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};


