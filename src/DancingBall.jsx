import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const BallPit = () => {
    const sceneRef = useRef(null);
    const engine = useRef(Matter.Engine.create());
    const render = useRef(null);
    const world = engine.current.world;
    const spawnInterval = 3000; // Milliseconds between spawns
    let lastSpawnTime = Date.now();

    const mouseConstraintRef = useRef(null);

    // Outside of useEffect, you can define a variable to store the ground reference
    let ground = [];

    useEffect(() => {

        console.log('useEffect called'); // Check that useEffect is called
        if (!sceneRef.current) {
            console.log('sceneRef.current is null'); // Check that sceneRef is not null
            return;
        }

        // Get initial size of the parent container
        const initialWidth = sceneRef.current.clientWidth;
        const initialHeight = sceneRef.current.clientHeight;

        // Create a renderer
        render.current = Matter.Render.create({
            element: sceneRef.current,
            engine: engine.current,
            options: {
                width: initialWidth,
                height: initialHeight,
                wireframes: false, // Set to false to see the colors
                // background: 'white', 
            },
        });

        // Create mouse control
        const mouse = Matter.Mouse.create(render.current.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine.current, {
            mouse: mouse,
            constraint: {
                render: { visible: false },
            },
        });

        // Store the mouseConstraint in a ref so it can be accessed outside this hook
        mouseConstraintRef.current = mouseConstraint;

        Matter.World.add(world, mouseConstraint);


        // Create a runner
        const runner = Matter.Runner.create();

        // Run the engine with the runner
        Matter.Runner.run(runner, engine.current);

        // Run the renderer
        Matter.Render.run(render.current);

        // Spawn balls at an interval
        const intervalId = setInterval(() => {
            if (Date.now() - lastSpawnTime >= spawnInterval) {
                spawnBallAtCenter();
                lastSpawnTime = Date.now();
            }
        }, spawnInterval);







        // Set canvas dimensions to fit the parent container or the viewport
        const updateCanvasSize = () => {
            const width = sceneRef.current.clientWidth;
            const height = sceneRef.current.clientHeight;

            console.log("width", width);
            console.log("height", height);
            render.current.canvas.width = width;
            render.current.canvas.height = height;
            render.current.options.width = width;
            render.current.options.height = height;
            render.current.canvas.style.border = '3px solid red'; // Add a red border to the canvas for debugging


            // // Remove existing ground if it exists
            // if (ground) {
            //     Matter.World.remove(world, ground);
            // }

            ground.forEach(segment => Matter.World.remove(world, segment));
            ground = [];

            // Create ground at the bottom of the canvas
            // Define the number and width of the ground segments
            const numSegments = 5; // For example, 5 segments
            const segmentWidth = width / numSegments;
            const holeSize = 20; // The size of the gap between each segment

            // Remove existing ground segments if they exist
            if (ground && Array.isArray(ground)) {
                ground.forEach(segment => Matter.World.remove(world, segment));
                ground = [];
            }

            // Create ground segments with holes between them
            for (let i = 0; i < numSegments; i++) {
                // Calculate the position for each segment
                let posX = i * segmentWidth + segmentWidth / 2;
                let posY = height * 6 / 7;

                // Adjust position for the holes
                if (i > 0) {
                    posX += holeSize / 2;
                }

                // Create a segment of the ground
                const segment = Matter.Bodies.rectangle(
                    posX, posY,
                    i < numSegments - 1 ? segmentWidth - holeSize : segmentWidth, // Reduce width for the hole, except for the last segment
                    60,
                    {
                        isStatic: true,
                        render: {
                            fillStyle: 'brown'
                        }
                    }
                );

                // Add the segment to the world
                Matter.World.add(world, segment);

                // Store the segment reference in an array
                ground.push(segment);
            }

            // You may need to call Matter.Render.lookAt to adjust the view if you're using a camera
            // Matter.Render.lookAt(render.current, { min: { x: 0, y: 0 }, max: { x: width, y: height } });
        };

        // Initial canvas size update
        updateCanvasSize();

        // Add event listener to update canvas size on window resize
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            clearInterval(intervalId);
            Matter.Runner.stop(runner);
            Matter.Render.stop(render.current);
            Matter.World.clear(world);
            Matter.Engine.clear(engine.current);
            window.removeEventListener('resize', updateCanvasSize);

            // Remove the canvas from the DOM
            if (sceneRef.current && render.current.canvas) {
                sceneRef.current.removeChild(render.current.canvas);
            }

        };
    }, []);

    const spawnBallAtCenter = () => {
        const width = render.current.options.width;
        const height = render.current.options.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const randomRadius = Matter.Common.random(10, 30);
        const randomColor = Matter.Common.choose(['red', 'green', 'blue', 'yellow']);
        const ball = Matter.Bodies.circle(centerX, centerY, randomRadius, {
            restitution: 0.9,
            render: {
                fillStyle: randomColor,
            },
        });
        Matter.World.add(world, ball);
    };


    const handleMouseDown = (e) => {
        const mouseConstraint = mouseConstraintRef.current;

        if (!mouseConstraint) return;

        // Get the mouse position from the mouseConstraint
        const mousePosition = mouseConstraint.mouse.position;

        const randomRadius = Matter.Common.random(10, 30);
        const randomColor = Matter.Common.choose(['red', 'green', 'blue', 'yellow']);
        const ball = Matter.Bodies.circle(mousePosition.x, mousePosition.y, randomRadius, {
            restitution: 0.9,
            render: {
                fillStyle: randomColor,
            },
        });
        Matter.World.add(world, ball);
    };


    return (
        <div ref={sceneRef} onMouseDown={handleMouseDown} className='w-full h-full' />
    );
};

export default BallPit;
