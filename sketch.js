// Portions of this program were developed with assistance from ChatGPT.
// All code has been reviewed and modified by me.
//VARIABLES
let img1; //image on page 0

let keySigs = []; //list for every image in key signature 

let currentScreen = 0; //to switch screens

let shownSig = -1; //number will be random, assigned to different key signatures

let box; //input box needs to be defined before being used

let userInput = ''; //string variable for user input

let answered = false; //checks if answered

let score = 0; //starting score

let maxScore = 5; //score before winning

let feedbackDuration = 0; //how long feedback message stays

let answerColor = [0,0,0]; //color for wrong or right

let timeStart = 0; //start time for each question

let times = []; //list of times for each question

let avgTime = 0; //average time


//defining majors with corresponding minors
let majors = ['C','G','D','A','E','B','F#','C#','F','Bflat','Eflat','Aflat','Dflat','Gflat','Cflat'];
let minors = ['a','e','b','f#','c#','g#','d#','a#','d','g','c','f','bflat','eflat','aflat'];


//load images
function preload() {
  img1 = loadImage('image1.png'); // p5.js built-in function
  for (let i = 1; i <= 15; i++) { 
    keySigs.push(loadImage(i + ".png")); // p5.js built-in function
  }
}

function setup() {
  createCanvas(600, 600); // p5.js built-in function
  
  box = createInput(''); // p5.js built-in function
  box.size(200);
  box.hide();
}

function draw() {
  background(220); // p5.js built-in function
  
  if(currentScreen === 0) screen1();
  else if (currentScreen === 1) screen2();
  else if (currentScreen === 2) screen3();
  else if (currentScreen === 3) screen4();
}


//checks if mouse is in a box
function inBox(x, y, w, h) {
  return mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h; 
}


function mousePressed(){
  if (currentScreen === 0) {
    if (inBox(190, 300, 220, 150)) currentScreen = 1;
  } 
  else if (currentScreen === 1) { 
    currentScreen = 2; 
  }
}

//calculates average time across 5 rounds
function calculateAverage(timeList) {
  let sum = 0;

  // iteration
  for (let i = 0; i < timeList.length; i++) {
    sum += timeList[i];
  }

  // selection
  if (timeList.length === 0) {
    return 0;
  } else {
    return sum / timeList.length;
  }
}


//logic of the game
function keyPressed() {
  if (currentScreen === 2 && keyCode === ENTER && answered === false) {
    let val = box.value();

    if (val === majors[shownSig] || val === minors[shownSig]) {
      score++;
      userInput = "Correct!";
      answerColor = [0, 150, 0];
      answered = true;

      let timeTaken = millis() - timeStart; // p5.js built-in function
      times.push(timeTaken);
    
      avgTime = calculateAverage(times); 
    } else {
      userInput = "Try again!";
      answerColor = [200, 0, 0];
      answered = 'wrong';
    }

    feedbackDuration = frameCount; // p5.js built-in variable
    box.hide();
  }
}


function screen1(){ 
  textAlign(LEFT); // p5.js built-in function
  fill(0); // p5.js built-in function
  textSize(74); // p5.js built-in function
  
  text("Sight Reading", 80, 150); // p5.js built-in function
  text("Game", 190, 210);
  
  textSize(35);
  text("Key Signature", width/4+50, 500);
  
  image(img1, 190, 300, 220, 150); // p5.js built-in function
}


function screen2(){ 
  textSize(20);
  textAlign(LEFT);
  fill(0);
  
  text("Correctly type the key signature. There will be 5 displayed\n\n- Uppercase letter for Major ex: 'G'\n- Lowercase for minor ex: 'g'\n- # for sharp, 'flat' for flat ex: Gflat, G#\n\n(Click to start)", 20, 100, 560, 500);
}


//Iteration through quesitons
function nextQ() {
  shownSig = int(random(0, keySigs.length)); // p5.js built-in function
  
  answered = false;
  userInput = '';
  
  box.value('');
  box.show();
  box.position(200, 450);
  
  box.elt.focus(); // p5.js DOM feature
  timeStart = millis(); // p5.js built-in function
}


//actual game
function screen3(){ 
  if (score >= maxScore) {
    box.hide();
    currentScreen = 3;
    return;
  }

  if (shownSig === -1) {
    nextQ();
  }

  fill(50);
  textAlign(RIGHT);
  textSize(16);
  text('Score: ' + score + ' / ' + maxScore, 580, 30);
  
  text('Avg Time: ' + nf(avgTime / 1000, 1, 2) + 's', 580, 55); // p5.js built-in function

  if (shownSig !== -1) {
    imageMode(CENTER); // p5.js built-in function
    image(keySigs[shownSig], 300, 250, 300, 200);
    imageMode(CORNER);
  }

  if (answered !== false) {
    textAlign(CENTER);
    textSize(22);
    fill(answerColor);
    text(userInput, 300, 420);

    if (frameCount > feedbackDuration + 60) {
      if (answered === true) {
        nextQ();
      } else {
        answered = false;
        box.show();
        box.value('');
        box.elt.focus();
      }
    }
  }
}


//end screen
function screen4(){
  textAlign(CENTER);
  fill(0);
  textSize(32);

  if (avgTime <= 1000) {
    text("You are a virtuoso!", 300, 200);
  } else if (avgTime <= 3000) {
    text("You are a virtuino!", 300, 200);
  } else if (avgTime <= 5000) {
    text("Great job! You are a great sight reader!", 300, 200);
  } else {
    text("Keep practicing!", 300, 200);
  }

  text('Final Avg: ' + nf(avgTime / 1000, 1, 2) + 's', 300, 300); // p5.js built-in function
}