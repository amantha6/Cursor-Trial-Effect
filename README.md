# Cursor Trail Effect

A smooth, elegant cursor trail effect created with HTML5 Canvas and JavaScript. This project creates a visually appealing glowing trail that follows your cursor movements with a spring physics simulation.

![Cursor Trail Effect Demo](screenshot.png)

## Features

- Smooth, flowing cursor trails with spring physics
- Color-shifting glow effect
- Multiple trails with slightly different physics properties
- Responsive design that works on all screen sizes
- Touch support for mobile devices

## Live Demo

Check out the live demo: [Cursor Trail Effect](https://your-vercel-deployment-url.vercel.app)

## Technologies Used

- HTML5 Canvas API
- CSS3
- Vanilla JavaScript (ES6+)
- No dependencies or libraries required

## How It Works

The cursor trail effect works by:
1. Tracking mouse/touch movement on a canvas element
2. Creating multiple trail lines that follow the cursor with spring physics
3. Each line maintains its own array of points to create a smooth trail
4. Using quadratic curves to draw smooth lines between points
5. Applying the 'lighter' composite operation to create a glow effect where lines overlap
6. Gradually changing the HSL color hue for a dynamic color-shifting effect

## Customization

You can customize the effect by modifying the following parameters in the `script.js` file:

- `f.trails`: Number of trail lines (default: 20)
- `this.maxPoints`: Maximum points per trail (default: 50)
- `this.spring`: Spring constant for physics (default: 0.4)
- `this.friction`: Friction coefficient (default: 0.5)
- `ctx.lineWidth`: Width of the trail lines (default: 3)
- `f.hue`: Starting color hue (default: 240 - blue)

