const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlesArray;

// get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 100) * (canvas.width / 100)
}

window.addEventListener('mousemove', function (event) {

    mouse.x = event.x;
    mouse.y = event.y;


});

// create particle

class Particle {

    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#8C5523'
        ctx.fill();
        // The particle
    }

    

    // check particle position, check mouse position, move and draw the particle
    update() {
        // check if particle is still within canvas
        // If it hits an edge, it looks like its bouncing but it going in the opposite direction of what it hit
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX
        }
        if (this.y > canvas.width || this.y < 0) {
            this.directionY = -this.directionY;
        }
        // check collision detection - mouse position/particle position
        // This is the distance from the mouse to a particle
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // move particle
        this.x += this.directionX;
        this.y += this.directionY;

        //position of incidence(where in space does it hits)
        if (distance *8 <= this.size + mouse.radius) {

            // Calculate the angle of incidence
            let angle = Math.atan2(dy, dx);

            // Calculate the angle of reflection
            let reflectionAngle = angle + (Math.PI - angle) * 2;

            // Move the particle in the direction of the reflection angle
            this.x += Math.cos(reflectionAngle) * 10;
            this.y += Math.sin(reflectionAngle) * 10;

            this.directionX = Math.cos(reflectionAngle);
            this.directionY = Math.sin(reflectionAngle);

        }


// draw particle
this.draw();
    }

}


class line {

    constructor(x1, y1,x2,y2, size, color,opacity) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.size = size;
        this.color = color;
        this.opacity

    }
}
// draws a line between nearby particles
function connect() {
    let opacityValue = 1
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {

            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                // If 2 particles are close enough to each other
                // GOAL: The lines will be breakable by the mouse
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000)
                ctx.strokeStyle = 'rgba(140,85,31,' + opacityValue + ')';
                ctx.lineWidth = 2;

                // This creates each line
                ctx.beginPath();
                //This targets a specfic particle
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
                //this is what makes the line to another particle
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
                //this is what adds color and opacity to the line
                ctx.stroke();

                // scenario where the mouse touches the line

            }
        }
    }


}

function init() {

    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);

        let directionX = (Math.random() * 5) - 2.5
        let directionY = (Math.random() * 5) - 2.5
        let color = '#8C5523';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }

}



// animation loop

function animate() {

    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
    }
    connect();
}




// resize event
window.addEventListener('resize', function () {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

// mouse out event
window.addEventListener('mouseout',
    function () {
        mouse.x = undefined
        mouse.y = undefined

    })


init();
animate();
