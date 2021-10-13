import {useState, useEffect } from 'react';

export default function ChatRoom(props) {
    const [formValue, setFormValue] = useState('');


    const sendMessage = async(e) => {
        if (e.keyCode === 13) {
            if (formValue === '') {
                return;
            }
            console.log(props.username, "trying to send message:", formValue);
        }
    }

    return (
        <div className="chatbox">
            <input className="chat-input" onKeyDown={(e) => sendMessage(e)} value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
        </div>
    )
}


