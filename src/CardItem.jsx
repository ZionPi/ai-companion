import React, { useRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx'
import { motion } from 'framer-motion';
// import {processWithRandomSpeaker,processWithRandomSpeakerForLargeText} from './read_helper'

function CardItem({ item }) {
    const textAreaRef = useRef(null);

    const containsCode = (markdownText) => {
        const inlineCodeRegex = /`[^`]+`/; // Matches inline code
        const blockCodeRegex = /```[\s\S]*?```/; // Matches block code

        const hasInlineCode = inlineCodeRegex.test(markdownText);
        const hasBlockCode = blockCodeRegex.test(markdownText);

        return hasInlineCode || hasBlockCode; // Returns true if either inline or block code is found
    };

    const extractImageUrl = (markdownText) => {
        const imageRegex = /!\[.*?\]\((.*?)\)/; // Regex to match Markdown image syntax
        const matches = markdownText.match(imageRegex);
        return matches ? matches[1] : null; // Return the URL or null if no image syntax is found
    };


    const imageUrl = extractImageUrl(item.desc);

    const hasCode = containsCode(item.desc);

    useEffect(() => {
        if (textAreaRef.current) {
            const maxHeight = 600; // Maximum height of the parent container
            textAreaRef.current.style.height = '0px'; // Reset height to recalculate
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [item.desc]); // Dependency array ensures effect runs whenever item.desc changes

    // Define your CSS to apply to the Markdown component
    const markdownStyle = {
        code: {
            whiteSpace: 'pre-wrap', // Allows code to wrap inside <code> blocks
        },
        pre: {
            whiteSpace: 'pre-wrap', // Allows code to wrap inside <pre> blocks
            wordBreak: 'break-word', // Breaks long words if necessary
        },
    };

    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
        >

            <div className="relative bg-amber-300 flex flex-col justify-center w-[200px] h-[300px] md:w-[400px] md:h-[600px] rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2.5 
            border-1 border-amber-400 border-opacity-50" >

                <div className="group absolute top-0 right-0 p-2 bg-transparent rounded-bl-lg" onClick={() => {console.log("processWithRandomSpeakerForLargeText(item.desc)")}}>
                    <svg className='w-5 h-5 opacity-0 group-hover:opacity-100' fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                </div>

                {!imageUrl && (

                    <textarea ref={textAreaRef}
                        className=" bg-amber-300 outline-none resize-none overflow-auto mx-2 my-3 text-2xl"
                        value={item.desc}
                        readOnly
                    >
                    </textarea>

                )}
                {(imageUrl) && (<Markdown options={{ overrides: markdownStyle }} className="mx-2 my-3 text-2xl">{item.desc}</Markdown>)}

            </div>
        </motion.div>

    );
}

export default CardItem;