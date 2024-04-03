import React, { useRef, useEffect } from 'react';
import Markdown from 'markdown-to-jsx'
import { motion } from 'framer-motion';

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

            <div className=" bg-amber-300 flex flex-col justify-center w-[200px] h-[300px] md:w-[400px] md:h-[600px] rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2.5 
            border-1
             border-amber-400 border-opacity-50">
                {!imageUrl  && (<textarea ref={textAreaRef}
                    className=" bg-amber-300 outline-none resize-none overflow-auto mx-2 my-3 text-2xl"
                    value={item.desc}
                    readOnly
                >
                </textarea>)}
                {(imageUrl  ) && (<Markdown options={{ overrides: markdownStyle }} className="mx-2 my-3 text-2xl">{item.desc}</Markdown>)}

            </div>
        </motion.div>

    );
}

export default CardItem;