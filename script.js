
const container = document.getElementById('audio-container')
const file = document.getElementById('fileupload')

let audioSource;
let analyzer;



file.addEventListener('change', function () {
    const files = file.files
    const audio1 = document.getElementById('audio1');
    audio1.src = URL.createObjectURL(files[0]);
    audio1.load();
    audio1.play();

    const audioCtx = new AudioContext();
    audioSource = audioCtx.createMediaElementSource(audio1);
    // Connects to analyzer node
    analyzer = audioCtx.createAnalyser();
    audioSource.connect(analyzer);
    // Connect to speakers
    analyzer.connect(audioCtx.destination)
    // Sets FFT size?
    //TODO: Look in to FFT More.
    // FFT or Fast Fourier Transforms music in terms of time to terms of frequency where the x-axis is frequency and the y-axis is amplitude.
    analyzer.fftSize = 2048;
    const bufferLength = analyzer.frequencyBinCount;
    //converting bufferLength to what's needed for the array. this is what visualizes the waveform
    //Can only be Uint8Array because getByteFrequencyData() is designed to return a array of frequency data in the form of 8bit integers
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 3
    let barHeight;
    let x;

// -----------------------------Particles And Lines--------------------------------------------------------------------------------------------


const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
const pts = document.getElementById('points')
const strt = document.getElementById('start')

canvas.width = window.innerWidth

canvas.height = window.innerHeight
let active = true;
let points =  0 ;

let particlesArray;
let lineArray;


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

    resize(minSize, maxSize) {
        this.size = Math.random() * (maxSize - minSize) + minSize;
      }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color
        ctx.fill();
        // The particle
    }

    // ChatGPT's idea for maintaining the initial state of the fame
    reset() {
        this.directionX = (Math.random() * 2) - 2.5;
        this.directionY = (Math.random() * 2) - 2.5;
        // this.directionX = 0
        // this.directionY = 0
    
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

            // Triggers game over functionality
                canvas.style.background = 'hsl(0, 0%, 100%)';
                pts.style.top = '50%'
                pts.style.left = '50%'
            
                active = false
                console.log(points)
                this.directionX = this.directionX/2
                this.directionX = this.directionX/2
            
                particlesArray = particlesArray.filter((particles) => { 
                    return particles.directionX == this.directionX
            
                })
                particlesArray.forEach((particle) => { 
                     particle.color = "#000000"
            
                })

                particlesArray.reset;
            
            



                
                }
            


// draw particle
this.draw();
    }

}

function restartGame() {
    active = true;
    pts.innerText = 0
    clearInterval(intervalId);

    intervalId = setInterval(incrementPoints, 1000);

    // Reset the BG

                pts.style.top = '90%'
                pts.style.left = '90%'
                strt.innerText = ""

    // Reset the points
    points = 0;
    // Reset the game state
    canvas.style.background = 'radial-gradient(#ffc38c, #ff9b40);';

}


// class Line {

//     constructor(x1, y1,x2,y2, size, color,opacity) {
//         this.x1 = x1;
//         this.y1 = y1;
//         this.x2 = x2;
//         this.y2 = y2;
//         this.size = size;
//         this.color = color;
//         this.opacity

//     }
// }

// class Line{
// constructor(midpointx,midpointy,opacity){

// this.midpointx = midpointx;
// this.midpointy = midpointy;
// this.opacity = opacity;

// }
// }
// lineArray = []

// draws a line between nearby particles
function connect() {
    let opacityValue = 1
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {


            //Essentially pythagorean theorem:Solving for C
            // Need to use this to generate points of contact on the line
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                // If 2 particles are close enough to each other
                // GOAL: The lines will be breakable by the mouse
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000)
                // ctx.strokeStyle = 'rgba(140,85,31,' + opacityValue + ')';
                ctx.strokeStyle = particlesArray[a].color ;
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
let linepoints = []
let linepoint = {

midpointx: (particlesArray[a].x + particlesArray[b].x)/2,
midpointy: (particlesArray[a].y + particlesArray[b].y)/2
}

// lineArray.push(new Line(linepoint.midpointx,linepoint.midpointy, opacityValue))

// console.log(linepoint.midpointx + " " + linepoint.midpointy)
// console.log(opacityValue)

// lineArray = lineArray.filter((line) => {
//     return line.opacity > 0.2

// })

// Starting on a way to cross a line
// if(mouse.x )
// console.log("YAY!!!")
// console.log(lineArray.length)


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

        let directionX = 0
        let directionY = 0
        let color = '#8C5523';

        let particle = new Particle(x, y, directionX, directionY, size, color);
        particlesArray.push(particle);


        resetParticles()


    }

}

function resetParticles() {
    particlesArray.forEach((particle) => {
        particle.reset();
    });
}


// animation loop

function animate() {

    requestAnimationFrame(animate);
    analyzer.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        
        const red = i * dataArray[i] / 2;
        const green = i *dataArray[i] / 2;
        const blue = i*dataArray[i] / 2;
        if (active == true){
            canvas.style.background = 'rgb('+ red/60 +',' + green/60 + ',' + blue/60 + ')';
            }
        particlesArray.forEach(particle => {
            //resize particles using music data
            particle.resize(particle.size, dataArray[i]/15); 
            // particle.style.filter = 'invert(100%)'

// parse the background color into an RGB color value
const backgroundColor = canvas.style.background;


const rgbValues = backgroundColor.match(/\d+/g).map(Number);

// calculate the inverse of each RGB color component
const invertedRgbValues = rgbValues.map(value => 255 - value);

// combine the inverted RGB values into a CSS color string
const invertedColor = `rgb(${invertedRgbValues.join(', ')})`;

// set the particle color to the inverted color
particle.color = invertedColor;
            // particle.color = 'rgb('+ red +',' + green + ',' + blue + ')'

          });

          

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


function start(){

    // Reload the current page
container.style.zIndex = 0
init();
if(active == true){
animate();
}
else{
    restartGame()
}
}


// Point Counter
let intervalId = setInterval(incrementPoints, 1000);

function incrementPoints() {
  points++;
  pts.innerText = points
//   console.log(`Points: ${points}`);
  

if (!active) {

    clearInterval(intervalId);
    pts.innerText = "Gameover"
    strt.innerText = "retry"

  }
}


start()

})
