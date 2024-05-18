import React, { useState, useEffect, useRef } from 'react';
import "./index.css";
import AlertComponent from './AlertComponent';
import { answerApi} from './redux/slice/answerSlice';
import { useSelector } from 'react-redux';

function InputBox({onAsk}) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [message, setMessage] = useState('');

    const [triggerCozeAnswer] = answerApi.endpoints.fetchAnswer.useLazyQuery();
    const [triggerGoogleAnswer] = answerApi.endpoints.fetchGoogleAnswer.useLazyQuery();
    const [triggerGoogleMultipleModalAnswer] = answerApi.endpoints.fetchGoogleMultipleModalAnswer.useLazyQuery();

    const configData = useSelector(state => state.config.config);

    const active_provider_name = configData.llms.active_provider;

    const contentEditableRef = useRef(null);

    const [imageFile, setImageFile] = useState(null); // State to store the image file
    const [imageParts, setImageParts] = useState([]); // State to store the image file

    const handleKeyDown = async (e) => {
       
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // handleInput();
            if (!message.trim()) {
                setShowAlert(true);
                setAlertMsg("输入框为空");
                return;
            }
            ask();
        }
    };


    function fileToGenerativePart(path, mimeType) {
        return {
            inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                mimeType
            },
        };
    }


    const ask = () => {

        if (onAsk != null ) {
            onAsk();
        }
        if(imageParts.length != 0) {
            triggerGoogleMultipleModalAnswer([message,...imageParts]);
        }
        else {
            if(active_provider_name === "Coze") {
                triggerCozeAnswer(message);
            } else if(active_provider_name === "Google") {
                triggerGoogleAnswer(message);
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const items = e.dataTransfer.items;
        const imageParts = []; // Initialize an empty array to store the image parts

        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                setImageFile(file); // Assuming setImageFile is a state setter
                // console.log("imageFile", file);

                // Create a FileReader to convert the file to a base64 string
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Create the inlineData object for the file
                    const inlineData = {
                        data: event.target.result.split(',')[1], // Remove the Data URL prefix and get the base64 data
                        mimeType: file.type // Get the MIME type from the file object
                    };

                    // Create the generative part object for the file
                    const generativePart = {
                        inlineData: inlineData
                    };

                    // Add the generative part object to the imageParts array
                    imageParts.push(generativePart);

                    // Display the image in the UI
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.maxWidth = '120px';
                    img.style.height = '120px';
                    document.getElementById('editable').appendChild(img);
                };

                reader.readAsDataURL(file); // Read the file as a Data URL (base64)
            }
        }

        // After all files have been processed, you can use the imageParts array as needed
        setImageParts(imageParts);
        // If you need to set the imageParts as state, make sure to define a state setter and call it here
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
                        setMessage(text);
                    }
                });
            }
        }
    };


    const handleInput = (e) => {
        const html = contentEditableRef.current.innerHTML;
        // Create a temporary container to parse the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Extract and handle images
        const images = tempDiv.querySelectorAll('img');
        const inlineImages = [];
        images.forEach((img) => {
            const srcData = img.src.split(','); // Split the data URL to separate the MIME type and base64 data
            if (srcData.length === 2) {
                const mimeType = srcData[0].match(/:(.*?);/)[1]; // Extract MIME type using regex
                const base64Data = srcData[1]; // Get the base64 data part
                const inlineData = {
                    data: base64Data,
                    mimeType: mimeType
                };
                // Create the generative part object for the image
                const generativePart = {
                    inlineData: inlineData
                };
                // Add the generative part object to the inlineImages array
                inlineImages.push(generativePart);
            }
            // Remove the image from the temporary container after processing
            img.parentNode.removeChild(img);
        });

        // // Do something with the extracted image URLs
        // if (inlineImages.length !== 0)
        //     console.log(inlineImages);

        // The remaining content in the temporary container is the text
        const textContent = tempDiv.textContent || tempDiv.innerText;

        // Update the state with the text content and the image parts
        setMessage(textContent);
        setImageParts(inlineImages); // Assuming setImageParts is a function that updates your state
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
                <AlertComponent message={alertMsg} isVisible={showAlert} onDismiss={() => setShowAlert(false)} />
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
