import React, { useRef, useState, useEffect } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

interface EmojiHandlerProps {
    onEmojiClick: (emoji: string) => void;
}

const EmojiHandler: React.FC<EmojiHandlerProps> = ({ onEmojiClick }) => {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const target = useRef(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleEmojiClickInternal = (emojiData: EmojiClickData) => {
        onEmojiClick(emojiData.emoji);
        console.log(emojiData.unified);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            target.current &&
            !(target.current as any).contains(event.target) &&
            popoverRef.current &&
            !popoverRef.current.contains(event.target as Node)
        ) {
            setShowEmojiPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <Button
                ref={target}
                variant="outline-secondary"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: '45px', height: '45px', marginRight: '8px' }}
                title="Emoji"
            >
                😊
            </Button>
            <Overlay
                show={showEmojiPicker}
                target={target.current}
                placement="top-start"
                containerPadding={20}
            >
                <Popover id="popover-contained" ref={popoverRef}>
                    <Popover.Body>
                        <EmojiPicker onEmojiClick={handleEmojiClickInternal} />
                    </Popover.Body>
                </Popover>
            </Overlay>
        </>
    );
};

export default EmojiHandler;