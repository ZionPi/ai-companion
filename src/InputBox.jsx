import React, { useState, useEffect, useRef } from 'react';
import "./index.css";
import AlertComponent from './AlertComponent';
import { useFetchGoogleAnswerQuery, useFetchAnswerQuery } from './redux/slice/answerSlice';

function InputBox() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [message, setMessage] = useState('');

    const [executeQuery, setExecuteQuery] = useState(false);
    const [executeQueryGoogle, setExecuteQueryGoogle] = useState(false);
    const [queryMessage, setQueryMessage] = useState('');

    const { refetch: refetchAnswer } = useFetchAnswerQuery(queryMessage, { skip: !executeQuery });
    const { refetch: refetchGoogleAnswer } = useFetchGoogleAnswerQuery(queryMessage, { skip: !executeQueryGoogle });

    const contentEditableRef = useRef(null);

    const [imageFile, setImageFile] = useState(null); // State to store the image file

    useEffect(() => {
        if (executeQuery) {
            refetchAnswer().finally(() => setExecuteQuery(false));
        }
        if (executeQueryGoogle) {
            refetchGoogleAnswer().finally(() => setExecuteQueryGoogle(false));
        }
    }, [executeQuery, executeQueryGoogle, refetchAnswer, refetchGoogleAnswer]);

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleInput();
            if (!message.trim()) {
                setShowAlert(true);
                setAlertMsg("输入框为空");
                return;
            }
            ask();
        }
    };

    const ask = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setQueryMessage(message);
        setExecuteQueryGoogle(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const items = e.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                setImageFile(file);
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.maxWidth = '120px';
                    img.style.height = '120px';
                    document.getElementById('editable').appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handlePaste = (e) => {
        // Prevent the default paste behavior
        e.preventDefault();

        // Check if there's any image in the clipboard data
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index in items) {
            const item = items[index];
            if (item.kind === 'file') {
                const blob = item.getAsFile();
                if (blob.type.startsWith('image/')) {
                    // If it's an image, create an image element and insert it
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = function () {
                            // Insert the image at the current cursor position using the Selection API
                            const selection = window.getSelection();
                            if (selection.rangeCount > 0) {
                                const range = selection.getRangeAt(0);
                                range.deleteContents(); // Delete any selected text
                                range.insertNode(img); // Insert the image
                                range.collapse(false);
                            }
                        };
                    };
                    reader.readAsDataURL(blob);
                }
            } else if (item.kind === 'string' && item.type === 'text/plain') {
                // If it's text, use the Clipboard API to get the pasted data
                item.getAsString(text => {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        range.deleteContents(); // Delete any selected text
                        range.insertNode(document.createTextNode(text)); // Insert the plain text
                        range.collapse(false);
                    }
                });
            }
        }
    };



    // const handleInput = (e) => {
    //     const html = contentEditableRef.current.innerHTML;
    //     setMessage(html);
    // };

    const handleInput = (e) => {
        const html = contentEditableRef.current.innerHTML;
        // Create a temporary container to parse the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Extract and handle images
        const images = tempDiv.querySelectorAll('img');
        const imageSrcs = [];
        images.forEach((img) => {
            imageSrcs.push(img.src);
            // Remove the image from the temporary container after processing
            img.parentNode.removeChild(img);
        });

        // Do something with the extracted image URLs
        // For example, you could update the state with the URLs or upload the images to a server
        if (imageSrcs)
            console.log(imageSrcs);

        // The remaining content in the temporary container is the text
        const textContent = tempDiv.textContent || tempDiv.innerText;

        // Update the state with the text content
        setMessage(textContent);

        // If you want to store the HTML content including images, you can also update the state with the full HTML
        // setMessage(html);

        // If you need to perform additional actions with the text and images, you can do so here
        // For example:
        // uploadImages(imageSrcs);
        // processText(textContent);
    };

    // Example function to upload images (implementation depends on your backend)
    const uploadImages = (imageSrcs) => {
        // Upload the image URLs to your server
        imageSrcs.forEach((src) => {
            // Your upload logic here
        });
    };

    // Example function to process text content
    const processText = (text) => {
        // Process the text content as needed
    };


    return (
        <>
            <div className='flex items-center justify-center'>
                <AlertComponent message={alertMsg} isVisible={showAlert} />
            </div>
            <div className='mt-4'>
                <div
                    className='border-2 border-[#00d0a7] mt-1 w-full h-auto min-h-250 rounded-lg outline-none pl-2 pt-2 text-2xl resize-none overflow-auto'
                    id='editable'
                    contentEditable
                    placeholder="输入聊天内容"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onPaste={handlePaste} // Add this line
                    ref={contentEditableRef}
                ></div>
            </div>
            <div className='flex justify-end mb-5'>
                <button className="mt-1 w-20 h-10 hover:bg-[#00d0a7]" onClick={ask}>发送</button>
            </div>
        </>
    );
}

export default InputBox;
