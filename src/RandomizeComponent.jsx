import CardItem from "./CardItem";
import "./index.css";
import { motion, Reorder, useAnimation } from "framer-motion"
import React, { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import AutoSizer from 'react-virtualized-auto-sizer';

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

    const gridRef = useRef();
    // Create a new instance of CellMeasurerCache
    // const cache = new CellMeasurerCache({
    //     fixedWidth: true, // Set to true if your list's width is fixed
    //     defaultHeight: 300, // Provide a default height for the cells
    // });

    const itemsPerRow = 6;

    // Calculate the number of rows needed
    const rowCount = Math.ceil(listItems.length / itemsPerRow);

    const cache = new CellMeasurerCache({
        fixedHeight: false, // or false if height is dynamic
        defaultWidth: 100,
        defaultHeight: 50, // Adjust based on your content
    });


    const cellRenderer = ({ columnIndex, rowIndex, key, parent, style }) => {

        const index = rowIndex * itemsPerRow + columnIndex;

        const item = listItems[index];

        if(!item) return null;

        return (<CellMeasurer
            cache={cache}
            columnIndex={columnIndex}
            rowIndex={rowIndex} 
            key={key}
            parent={parent}
        >
            {({ measure }) => (
                <div style={style}>
                    {/* You must call measure after the content has been rendered */}
                    <div onLoad={measure} >
                        <Reorder.Item
                            key={item.id}
                            tabIndex="0"
                            value={item}
                            id={`item-${item.id}`} // Add an ID to each item for scrolling
                            className="cursor-pointer focus:outline-none mt-16 mx-4">
                            <motion.div animate={animationControls.current[item.id]} id={`motion-item-${item.id}`}>
                                   <CardItem item={item} />
                            </motion.div>
                        </Reorder.Item>

                    </div>
                </div>
            )}
        </CellMeasurer>)
    };


    // Pass the height and width to the List component
    const renderList = useCallback(({ height, width }) => (
        <Grid
            ref={gridRef}
            cellRenderer={cellRenderer}
            columnCount={itemsPerRow}
            columnWidth={cache.columnWidth}
            height={height}
            rowCount={rowCount} // Since it's horizontal, you might only have one row
            rowHeight={cache.rowHeight} // You can set this to a fixed height
            width={width}
            overscanRowCount={2} // How many rows to render above/below the visible area
        />
    ), [listItems, listItems.length]);


    const scrollToElement = (element) => {
        const elementRect = element.getBoundingClientRect();
        const absoluteElementLeft = elementRect.left + window.pageXOffset;
        const center = absoluteElementLeft - (window.innerWidth / 2) + (elementRect.width / 2);
        window.scrollTo({ left: center, behavior: 'smooth' });
    };

    // Function to scroll to a random item
    const scrollToRandomItem = () => {
         const randomIndex = Math.floor(Math.random() * listItems.length);
    
        const rowIndex = Math.floor(randomIndex / itemsPerRow);
        const columnIndex = randomIndex % itemsPerRow;

        if (gridRef.current) {
            gridRef.current.scrollToCell({
                columnIndex: columnIndex,
                rowIndex: rowIndex,
            });
        }
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
                window.scrollTo(0, { behavior: 'smooth' });
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
                <div className="flex-1 relative w-[1400px] h-[800px]"  > {/* Ensure minimum height */}
                    <AutoSizer>
                        {renderList}
                    </AutoSizer>
                </div>
            </Reorder.Group>
        </div>

    </div>);
}

export default RandomizeComponent;