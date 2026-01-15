import type {Message, MessageResponse} from "../features/chat/chatWindow/ChatRoomDTO.ts";
import {parseMessageDate} from "./DateHelper.ts";



export const processAndSortMessages = (
    messages: MessageResponse[] | Message[], // Chấp nhận cả 2 loại input
    currentUser: string
): Message[] => {
    // 1. Map dữ liệu (Thêm isMe)
    const processed = messages.map((msg) => ({
        ...msg,
        isMe: msg.name === currentUser,
        createAt: msg.createAt || new Date().toISOString(),
        mes: decodeMessage(msg.mes) // Decode the message content
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

/**
 * Chuyển Text chứa Emoji thật -> Text chứa mã Hex đặc biệt
 */
const encodeMessage = (text: string): string => {
    if (!text) return "";

    const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\udff4])|(?:\ud83d[\udc00-\ude4f])|(?:\ud83e[\udc00-\udeff])|[\u2600-\u26FF]|\ud83c[\udf00-\udfff]|\ud83d[\ude00-\udeff]|\ud83e[\udd00-\udeff])/g;

    return text.replace(regex, (match) => {

        const codePoints = [...match].map(char => char.codePointAt(0)!.toString(16));

        const hexString = codePoints.join('-');

        return `[:${hexString}:]`;
    });
};

/**
 * Chuyển Text chứa mã Hex -> Text chứa Emoji hiển thị được
 */
const decodeMessage = (textWithHex: string): string => {
    if (!textWithHex) return "";

    const regex = /\[:([a-f0-9-]+):\]/g;

    return textWithHex.replace(regex, (match, hexCodeGroup) => {
        try {
            const hexParts = hexCodeGroup.split('-');

            const decimalPoints = hexParts.map((hex: string) => parseInt(hex, 16));

            return String.fromCodePoint(...decimalPoints);
        } catch (e) {
            return match;
        }
    });
};

export { encodeMessage, decodeMessage };


