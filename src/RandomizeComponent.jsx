import CardItem from "./CardItem";
import "./index.css";
import { motion, Reorder, useAnimation } from "framer-motion"
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';


function RandomizeComponent() {

    const controls = useAnimation();

    const messageList = useSelector(state => state.messages.messageList);

    const filterMessageList = messageList.filter(item => item.desc !== "");

    const [listItems, setListItems] = useState(filterMessageList);

    // Create a ref to store the animation controls for each item
    const animationControls = useRef(listItems.reduce((acc, item) => {
        acc[item.id] = useAnimation();
        return acc;
    }, {}));


    const scrollToElement = (element) => {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementLeft = elementRect.left + window.pageXOffset;
        const center = absoluteElementLeft - (window.innerWidth / 2) + (elementRect.width / 2);
        window.scrollTo({ left: center, behavior: 'smooth' });
    };

    // Function to scroll to a random item
    const scrollToRandomItem = () => {
        const randomIndex = Math.floor(Math.random() * listItems.length);
        const elementToScrollTo = document.getElementById(`item-${listItems[randomIndex].id}`);
        // elementToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Use the custom function to scroll
        scrollToElement(elementToScrollTo);
        // Start the animation after the element is in view
        setTimeout(() => {
            animationControls.current[listItems[randomIndex].id].start({
                scale: 1.1,
                transition: { duration: 0.3 },
            });


            // Reset the scale after the animation
            setTimeout(() => {
                animationControls.current[listItems[randomIndex].id].start({ scale: 1 });
            }, 700); // Delay before resetting the scale
        }, 700); // Delay to allow for the scroll to finish
    };


    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.code === 'Space') {
                event.preventDefault(); // Prevent the default spacebar action
                scrollToRandomItem();
            } else if (event.metaKey && event.code === 'Digit0') {
                event.preventDefault(); // Prevent the default Command + 0 action
                // Scroll to the first item
                window.scrollTo(0, {behavior: 'smooth'});
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Clean up the event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [listItems]);


    return (<div >

        <div className="flex justify-center items-center h-screen mx-4">
            <Reorder.Group
                axis="x" // Change to "x" for horizontal reordering
                onReorder={setListItems}
                values={listItems}
                className="flex gap-10" // Ensure flex row layout

            >
                {listItems.map((el) => (
                    <Reorder.Item
                        key={el.id}
                        tabIndex="0"
                        value={el}
                        id={`item-${el.id}`} // Add an ID to each item for scrolling
                        className="cursor-pointer focus:outline-none">
                        <motion.div animate={animationControls.current[el.id]} id={`motion-item-${el.id}`}>
                            <CardItem item={el} />
                        </motion.div>
                    </Reorder.Item>
                ))}

            </Reorder.Group>
        </div>
        {/* <div className="flow flow-row flex justify-around gap-10 mt-20">
            <svg className="w-10 h-10" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>

            <svg className="w-10 h-10" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
        </div> */}
    </div>);
}

export default RandomizeComponent;