import React, { useState, useEffect, useRef } from 'react';
import "./index.css";
import AlertComponent from './AlertComponent';
import { answerApi } from './redux/slice/answerSlice';
import { useSelector } from 'react-redux';

function InputBox({ onAsk }) {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [message, setMessage] = useState('');

    const [triggerCozeAnswer] = answerApi.endpoints.fetchAnswer.useLazyQuery();
    const [triggerGoogleAnswer] = answerApi.endpoints.fetchGoogleAnswer.useLazyQuery();
    const [triggerGoogleMultipleModalAnswer] = answerApi.endpoints.fetchGoogleMultipleModalAnswer.useLazyQuery();

    const configData = useSelector(state => state.config.config);

    const active_provider_name = configData.llms.active_provider;

    const contentEditableRef = useRef(null);

    const [fileParts, setFileParts] = useState([]);

    const [isUploading, setIsUploading] = useState(false); // State to track upload status

    const [embeddedContentSources, setEmbeddedContentSources] = useState(new Set());


    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const html = contentEditableRef.current.innerHTML;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const textContent = tempDiv.textContent || tempDiv.innerText;
            setMessage(textContent); // Update the message state

            // Use a timeout to allow state to update
            setTimeout(() => {
                if (!message.trim()) {
                    setShowAlert(true);
                    setAlertMsg("输入框为空");
                    return;
                }
                ask();
            }, 0);
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

        if (onAsk != null) {
            onAsk();
        }
        if (fileParts.length != 0) {
            triggerGoogleMultipleModalAnswer([message, ...fileParts]);
        }
        else {
            if (active_provider_name === "Coze") {
                triggerCozeAnswer(message);
            } else if (active_provider_name === "Google") {
                triggerGoogleAnswer(message);
            }
        }

        // if (onAsk != null) {
        //     onAsk();
        // }

    };



    const getPromptFileData = (prompt, mimeType, uri) => {
        return [
            {
                text: prompt
            },
            {
                fileData: {
                    mimeType: mimeType,
                    fileUri: uri
                }
            }
        ];
    }



    const uploadFilesToServer = (files) => {
        setIsUploading(true); // Start uploading
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        fetch('http://127.0.0.1:3000/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${configData.llms.provider_list.find((t) => t.provider == "Google").api_key}`
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);

                const uri = data.file.fileUri;
                const mimetype = data.file.mimeType;

                console.log('uri:', uri);

                console.log('mimetype:', mimetype);

                const uploadPart = {
                    fileData: {
                        mimeType: mimetype,
                        fileUri: uri
                    }
                };

                const _fileParts = [];

                _fileParts.push(uploadPart);

                console.log("fileParts", _fileParts);

                setFileParts(_fileParts);
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                setIsUploading(false); // Ensure the button is re-enabled after upload
            });
    };




    const handleDrop = async (e) => {
        e.preventDefault();
        const items = e.dataTransfer.items;

        const files = [];

        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                files.push(file);
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const inlineData = {
                            data: event.target.result.split(',')[1], // Remove the Data URL prefix and get the base64 data
                            mimeType: file.type // Get the MIME type from the file object
                        };

                        const fileParts = []; // Initialize an empty array to store the file parts
                        const generativePart = { inlineData: inlineData };
                        fileParts.push(generativePart);
                        setFileParts(fileParts);
                        const imgContainer = document.createElement('div');
                        imgContainer.contentEditable = false;
                        imgContainer.style.display = 'inline-block'; // Ensure it behaves as an inline element
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.style.maxWidth = '120px';
                        img.style.height = '120px';
                        imgContainer.appendChild(img);
                        document.getElementById('editable').appendChild(imgContainer);
                    };
                    reader.readAsDataURL(file); // Read the file as a Data URL (base64)
                } else if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
                    const mediaContainer = document.createElement('div');
                    mediaContainer.contentEditable = false;
                    mediaContainer.style.display = 'inline-block'; // Ensure it behaves as an inline element
                    mediaContainer.tabIndex = 0; // Make it focusable

                    const media = document.createElement(file.type.startsWith('audio/') ? 'audio' : 'video');
                    media.controls = true;
                    if (file.type.startsWith('video/')) {
                        media.style.maxWidth = '240px';
                        media.style.height = 'auto';
                    }
                    media.src = URL.createObjectURL(file);
                    mediaContainer.appendChild(media);
                    document.getElementById('editable').appendChild(mediaContainer);
                } else if ([
                    'text/plain', 'text/html', 'text/css', 'text/javascript', 'application/x-javascript',
                    'text/x-typescript', 'application/x-typescript', 'text/csv', 'text/markdown',
                    'text/x-python', 'application/x-python-code', 'application/json', 'text/xml',
                    'application/rtf', 'text/rtf'
                ].includes(file.type)) {
                    const fileLinkContainer = document.createElement('div');
                    fileLinkContainer.contentEditable = false;
                    fileLinkContainer.style.display = 'inline-block'; // Ensure it behaves as an inline element
                    fileLinkContainer.tabIndex = 0; // Make it focusable
                    const fileLink = document.createElement('a');
                    fileLink.href = URL.createObjectURL(file);
                    fileLink.textContent = ` ${file.name}`;
                    fileLink.download = file.name;
                    fileLink.style.color = '#00d0a7'; // Set the color of the link
                    fileLinkContainer.appendChild(fileLink);
                    document.getElementById('editable').appendChild(fileLinkContainer);
                } else {
                    // files.push(file);
                }
            }
        }

        if (files.length != 0)
            uploadFilesToServer(files);

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

        // Extract current embedded elements (images, audios, videos, links)
        const currentEmbeddedElements = tempDiv.querySelectorAll('img, audio, video, a');
        const currentEmbeddedSources = new Set([...currentEmbeddedElements].map(el => el.src || el.href));

        // If no embedded elements are present, clear fileParts
        if (currentEmbeddedElements.length === 0 && embeddedContentSources.size > 0) {
            setFileParts([]);
        }

        // Update the embeddedContentSources state to reflect the current state of embedded elements
        setEmbeddedContentSources(currentEmbeddedSources);

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
                setFileParts(inlineImages);
            }
            // Remove the image from the temporary container after processing
            img.parentNode.removeChild(img);
        });

        // // Do something with the extracted image URLs
        // if (inlineImages.length !== 0)
        //     console.log(inlineImages);

        // Remove <a> tags from the temporary container to avoid including hyperlink text
        const links = tempDiv.querySelectorAll('a');

        links.forEach(link => link.parentNode.removeChild(link));

        // The remaining content in the temporary container is the text
        const textContent = tempDiv.textContent || tempDiv.innerText;

        // Update the state with the text content and the image parts
        setMessage(textContent);
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
                <button
                    className={`mt-1 w-20 h-10 ${isUploading ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'hover:bg-[#00d0a7]'}`}
                    onClick={ask}
                    disabled={isUploading}
                >
                    发送
                </button>
            </div>
        </>
    );
}

export default InputBox;
