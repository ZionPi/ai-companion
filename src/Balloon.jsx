import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const BallPit = () => {

    let processWithRandomSpeakerForLargeText;

    if (process.env.NODE_ENV === 'development') {
        import('./read_helper').then((module) => {
            processWithRandomSpeakerForLargeText = module.default;
        }).catch(error => {
            console.error('Error importing processWithRandomSpeakerForLargeText:', error);
        });
    }


    const sceneRef = useRef(null);
    const engine = useRef(Matter.Engine.create());
    const render = useRef(null);
    const world = engine.current.world;
    const spawnInterval = 3000; // Milliseconds between spawns
    let lastSpawnTime = Date.now();

    const randomWords = ['Joy', 'Peace', 'Love', 'Adventure', 'Dream', 'Fun', 'Laughter', 'Success', 'Magic', 'Hope'];

    const mouseConstraintRef = useRef(null);

    // Outside of useEffect, you can define a variable to store the ground reference
    let ground = [];

    // Function to create particles at a given position
    const createParticles = (x, y) => {
        const numParticles = 10; // Number of particles to create
        const particleOptions = {
            isStatic: false,
            render: {
                fillStyle: '#ffffff',
            },
        };

        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2; // Random angle for particle direction
            const speed = Math.random() * 5; // Random speed for particle
            const particle = Matter.Bodies.circle(x, y, 1, particleOptions); // Create a small circle body as a particle

            // Apply force to the particle in a random direction
            Matter.Body.applyForce(particle, { x, y }, {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed,
            });

            // Add the particle to the world
            Matter.World.add(world, particle);
        }
    };


    const drawText = (context, text, position) => {
        context.save();
        context.translate(position.x, position.y);
        context.fillStyle = 'white'; // Text color
        context.font = '14px Arial'; // Text font and size
        context.textAlign = 'center';
        context.fillText(text, 0, 5); // Adjust the position if needed
        context.restore();
    };

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

                    // Create particles at the collision point
                    createParticles(collisionPoint.x, collisionPoint.y);

                    // Check if this is the first collision for the ball
                    if (!ball.hasCollidedWithGround) {
                        // Handle the first collision with the ground
                        console.log('Ball has collided with the ground for the first time');


                        if (process.env.NODE_ENV === 'development' && processWithRandomSpeakerForLargeText) {
                            if (ball.render.text) {
                                processWithRandomSpeakerForLargeText(ball.render.text);
                            } else {
                                processWithRandomSpeakerForLargeText("哎呦， 好痛!");
                            }
                        }
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
        const randomColor = getRandomColor();
        const averageCharWidth = 4;
        const maxWordLength = Math.max(...randomWords.map(word => word.length));
        const minimumRadius = (maxWordLength / 2) * averageCharWidth;

        // Calculate randomRadius, ensuring it's not smaller than minimumRadius
        const randomRadius = Math.max(minimumRadius,  Matter.Common.random(10, 30));

        const balloon = Matter.Bodies.circle(centerX, centerY, randomRadius, {
            label: 'ball',
            // Make the density lower than default (0.001 is the default density for air in Matter.js)
            density: 0.0005,
            restitution: 0.9,
            render: {
                fillStyle: randomColor,
                text: randomWords[Math.floor(Math.random() * randomWords.length)]
            },
        });

        // Apply an upward force to simulate buoyancy
        Matter.Body.applyForce(balloon, balloon.position, {
            x: 0, // No horizontal force
            y: -0.08 * balloon.mass, // Upward force proportional to mass (adjust as needed)
        });

        Matter.World.add(world, balloon);
    };

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

        // Get the mouse position from the mouseConstraint
        const mousePosition = mouseConstraint.mouse.position;

        const randomRadius = Matter.Common.random(10, 30);
        const randomColor = getRandomColor();
        const balloon = Matter.Bodies.circle(mousePosition.x, mousePosition.y, randomRadius, {
            label: 'ball',
            density: 0.00005,
            restitution: 0.9,
            render: {
                fillStyle: randomColor,
                text: randomWords[Math.floor(Math.random() * randomWords.length)]
            },
        });

        // Apply an upward force to simulate buoyancy
        Matter.Body.applyForce(balloon, balloon.position, {
            x: 0, // No horizontal force
            y: -0.08 * balloon.mass, // Upward force proportional to mass (adjust as needed)
        });

        Matter.World.add(world, balloon);
    };


    return (
        <div ref={sceneRef} onMouseDown={handleMouseDown} className='w-full h-full' />
    );
};

export default BallPit;
