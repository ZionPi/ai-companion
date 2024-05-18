import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import Vehicle  from './vehicle';
const StringSimulation = () => {


    const sceneRef = useRef(null);
    const engine = useRef(Matter.Engine.create());
    const render = useRef(null);
    const world = engine.current.world;

    const mouseConstraintRef = useRef(null);

    // Outside of useEffect, you can define a variable to store the ground reference
    let ground = [];
   
    let vehicles = [];

    const target = { x: 300, y: 300 };

    useEffect(() => {

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

        // Inside useEffect, after setting up the Matter world
        Matter.Events.on(engine.current, 'beforeUpdate', (event) => {

            const balloons = Matter.Composite.allBodies(world).filter(body => body.label === 'balloon');
            balloons.forEach(balloon => {
                Matter.Body.applyForce(balloon, balloon.position, {
                    x: 0,
                    y: -0.095 * balloon.mass,
                });
            });

            vehicles.forEach(vehicle => {
                // vehicle.flee(target);
                // vehicle.update();
                vehicle.seek2({x: vehicle.x,y: vehicle.y});
                vehicle.update(); 
            });

        });


        Matter.Events.on(render.current, 'afterRender', () => {
            const context = render.current.context;
            const balloons = Matter.Composite.allBodies(world).filter(body => body.label === 'ball');

            balloons.forEach(balloon => {
                if (balloon.render.text) {
                    drawText(context, balloon.render.text, balloon.position);
                }
            });
        });

        // Inside your useEffect hook, after initializing the engine and world
        Matter.Events.on(engine.current, 'collisionStart', (event) => {
            // Loop through all pairs of colliding bodies
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;

                // Check if one of the bodies is a ball and the other is the ground
                if ((bodyA.label === 'ball' && ground.includes(bodyB)) ||
                    (bodyB.label === 'ball' && ground.includes(bodyA))) {
                    // One of the bodies is a ball and the other is the ground
                    const ball = bodyA.label === 'ball' ? bodyA : bodyB;

                    const collisionPoint = pair.collision.supports[0]; // Get the collision point


                    // Check if this is the first collision for the ball
                    if (!ball.hasCollidedWithGround) {
                        // Handle the first collision with the ground
                        console.log('Ball has collided with the ground for the first time');

                    
                        // Set a flag to indicate that the ball has collided with the ground
                        ball.hasCollidedWithGround = true;

                        // Perform any additional actions you want to take on first collision
                        // For example, change the color of the ball, apply additional forces, etc.
                    }
                }
            });
        });

        // Create a runner
        const runner = Matter.Runner.create();

        // Run the engine with the runner
        Matter.Runner.run(runner, engine.current);

        // Run the renderer
        Matter.Render.run(render.current);


        // Set canvas dimensions to fit the parent container or the viewport
        const updateCanvasSize = () => {
            const width = sceneRef.current.clientWidth;
            const height = sceneRef.current.clientHeight;

            target.x = width /2;
            target.y = height /2;

            render.current.canvas.width = width;
            render.current.canvas.height = height;
            render.current.options.width = width;
            render.current.options.height = height;
            render.current.canvas.style.border = '3px solid green'; // Add a red border to the canvas for debugging


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
            const holeSize = 45; // The size of the gap between each segment

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
                        label: 'ground', 
                        isStatic: true,
                        render: {
                            fillStyle: 'brown'
                        }
                    }
                );

                // Add the segment to the world
                // Matter.World.add(world, segment);

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

    
    const createVehicles = (numberOfVehicles) => {
        for (let i = 0; i < numberOfVehicles; i++) {
            const width = sceneRef.current.clientWidth;
            const height = sceneRef.current.clientHeight;
            const x = Math.random() * width; // Random x position
            const y = Math.random() * height; // Random y position
            const vehicle = new Vehicle(x, y);
            vehicles.push(vehicle);
            Matter.World.add(world, vehicle.body);
        }
    };

    function canvas2Img(canvas) {
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');

        // Create a link element
        const link = document.createElement('a');
        link.href = dataURL;
        // Set download attribute with desired filename
        link.download = 'my-image.png';

        // Simulate click on the link to trigger download
        link.click();
    }



    function getSamplePositions(text, canvasWidth, canvasHeight) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.fillStyle = 'red';

        // Start with a large font size
        let fontSize = canvasWidth; // Initial guess, assuming width is the constraint

        // Adjust font size until text fits within canvas
        while (context.measureText(text).width > canvasWidth || fontSize > canvasHeight) {
            fontSize--;
            context.font = `bold ${fontSize}px Arial`;
        }

        // Calculate text position for centering
        const textWidth = context.measureText(text).width;
        const x = (canvasWidth - textWidth) / 2;
        const y = canvasHeight * 3 / 4; // Assuming vertical centering is desired

        context.fillText(text, x, y);

        const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;

        const samplePositions = [];
        const colorThreshold = 250; // Adjust as needed; lower values mean darker pixels

        const chance = 0.0015;

        for (let y = 0; y < canvasHeight; y++) {
            for (let x = 0; x < canvasWidth; x++) {
                const index = (y * canvasWidth + x) * 4;
                const red = data[index];
                const green = data[index + 1];
                const blue = data[index + 2];
                // Check if the pixel is dark (close to black)
                // if (red < colorThreshold && green < colorThreshold && blue < colorThreshold) {
                //     samplePositions.push({ x: x, y: y });
                // }
                if (red > colorThreshold && (Math.random() < chance)) {
                    samplePositions.push({ x: x, y: y });
                }
            }
        }

        console.log("samplePositions", samplePositions);

        samplePositions.forEach(pos => {

            const x = Math.random() * canvasWidth; // Random x position
            const y = Math.random() * canvasHeight; // Random y position

            var vehicle = new Vehicle(x,y);
            vehicle.x = pos.x;
            vehicle.y = pos.y;
            vehicles.push(vehicle);
            Matter.World.add(world, vehicle.body);
        });

        return samplePositions;
    }



    

    const getRandomColor = () => {
        // Generate a random integer between 0 and 255 for each color component
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        // Return the RGB color string
        return `rgb(${red}, ${green}, ${blue})`;
    };


    const handleMouseDown = (e) => {
        const mouseConstraint = mouseConstraintRef.current;

        if (!mouseConstraint) return;

        // // Get the mouse position from the mouseConstraint
        // const mousePosition = mouseConstraint.mouse.position;

        // const randomRadius = Matter.Common.random(10, 30);
        // const randomColor = getRandomColor();
        // const balloon = Matter.Bodies.circle(mousePosition.x, mousePosition.y, randomRadius, {
        //     label: 'ball',
        //     density: 0.00005,
        //     restitution: 0.9,
        //     render: {
        //         fillStyle: randomColor,
        //     },
        // });

        // // Apply an upward force to simulate buoyancy
        // Matter.Body.applyForce(balloon, balloon.position, {
        //     x: 0, // No horizontal force
        //     y: -0.08 * balloon.mass, // Upward force proportional to mass (adjust as needed)
        // });

        // Matter.World.add(world, balloon);

        // createVehicles(100); // Create 10 vehicles for example

        getSamplePositions("Love", sceneRef.current.clientWidth,sceneRef.current.clientHeight);

       
    };


    return (
        <div ref={sceneRef} onMouseDown={handleMouseDown} className='w-full h-full' />
    );
};

export default StringSimulation;
