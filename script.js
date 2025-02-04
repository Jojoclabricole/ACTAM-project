//common 
Tone.start();
const synth = new Tone.Synth({ oscillator: { type: "sine" } ,volume: 4}).toDestination();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function switchGame(gameId) {
  const sections = document.querySelectorAll('.game-section');
  sections.forEach(section => section.classList.remove('active'));

  const activeGame = document.getElementById(gameId);
  if (activeGame) activeGame.classList.add('active');
} 


//Mini-game 1

//MODEL
const nameImages = ["A", "B", "C", "C2", "D", "D2", "E", "E2", "F", "F2", "G", "G2"];

//VIEW 
function displayNewImage() {
  const whichImage = getRandomInt(nameImages.length);
  const pickedNote = nameImages[whichImage];

  const answerImg = document.getElementById("correctImage");
  answerImg.src= "img/interrogation_point.png";
  const el = document.querySelector(".imageContainer.g1");
  const newUrl = "img/partition_" + pickedNote + ".png";
  printedPartitionImage = pickedNote;
  el.style.backgroundImage = `url('${newUrl}')`;

}

function updateAnswerImage(note) {
  let img = document.getElementById("correctImage");
  if (verifyNote(note)) {
    img.src = "img/correct.png";
  }
  else {
    img.src = "img/mistake.png";
  }
  img.style.display = "block";
}

//CONTROLLER
function verifyNote(note) {
  return (note === printedPartitionImage.charAt(0)) 
}


//Mini-game 2

//MODEL
const modes = {
  0:"easy",
  1:"medium",
  2:"hard"
}
const generatingSequenceFunctions = [easySequence, mediumSequence, hardSequence];
let selectedMode; 

const notes = ["D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#"]; //17 notes, from 0 to 16
let seqToPlay = [];
let printedPartitionImage = "A";

//VIEW 

function shiftColorMode(mode) {
  Object.keys(modes).forEach((key) => {
    if (key == mode) {
      document.getElementById(modes[key]+"Mode").style.backgroundColor = "rgb(204, 101, 33)";
    }
    else {
      document.getElementById(modes[key]+"Mode").style.backgroundColor = "rgb(150, 101, 33)";
    }
  })
}
function enableButton(btn) {
  btn.disabled = false;
}

function disableButton(btn) {
  btn.disabled = true;
}

function revealFirstNote() {
  document.getElementById("tipBtn").textContent = `${notes[seqToPlay[0][0]]}`;
}
function coverFirstNote() {
  document.getElementById("tipBtn").textContent = "Tip";
}

document.addEventListener("DOMContentLoaded", function() {
  const numColumns = 5; 
  const numButtons = 10; 
  const container = document.createElement("div");
  container.classList.add("buttonContainer");
  container.style.display = "flex";
  container.style.fustifyContent = "space-around";
  
  
  for (let col = 0; col < numColumns; col++) {
      let columnDiv = document.createElement("div");
      columnDiv.classList.add("buttonColumn");
      columnDiv.style.marginRight = "30px";
      columnDiv.style.marginLeft = "30px";
      
      for (let i = 0; i < numButtons; i++) {
          let button = document.createElement("button");
          button.classList.add("Btn", "noteBtn", `${col*10 + (9 - i)}`);
          button.style.bottom = `${16 - i * 2}px`; 
          button.onclick = function() { addNote(this); };
          columnDiv.appendChild(button);
      }
      
      container.appendChild(columnDiv);
  }
  
  document.querySelector(".imageContainer.g2").appendChild(container);
});

//CONTROLLER
function shiftMode (mode) {
  selectedMode = mode;
}


function getNbrColumn(number) {
  return Math.floor(number / 10);
}
function generateNoteSequence() {  
  const indexNote = getRandomInt(notes.length)
  const indexRange = indexNote > 9 ? 4 : 3;
  let generatingFunction = generatingSequenceFunctions[selectedMode]

  return generatingFunction(indexNote, indexRange)
}

function easySequence(idxNote, idxRange) { 
  let newIdxNote = idxNote;
  let selectedNotes = [];
  let ascendance = Math.random() > 0.5 ? 1: 0; //1 for crescendo, 0 for decrecsendo

  if (ascendance && newIdxNote > 9) {
    newIdxNote = 9;
  }
  if (!ascendance && newIdxNote < 7) {
    newIdxNote = 7;
  }

  selectedNotes.push([newIdxNote, idxRange]);
  for (i = 0; i < 4; i++) {
    let oldNote = selectedNotes[selectedNotes.length - 1][0];
    let newRange = selectedNotes[selectedNotes.length - 1][1];

    let interval = Math.random() > 0.5 ?  2:  1;

    let newNote = ascendance ? oldNote + interval: oldNote - interval;
    newRange = newNote > 9 ? 4 : 3;


    selectedNotes.push([newNote, newRange]);
  }
  return selectedNotes;
}

function mediumSequence(idxNote, idxRange) {

  let newIdxNote = idxNote;
  let ascendance = Math.random() > 0.5 ? 1: 0; //1 for crescendo, 0 for decrecsendo
  
  if (ascendance && newIdxNote > 9) {
    newIdxNote = 9;
  }
  if (!ascendance && newIdxNote < 7) {
    newIdxNote = 7;
  }
  let selectedNotes = [[newIdxNote, idxRange]];

  for (j = 0; j < 2; j ++) {

    let ascendance = Math.random() > 0.5 ? 1: 0; //1 for crescendo, 0 for decrecsendo

      for (i = 0; i < 2; i++) {
      let newNote = selectedNotes[selectedNotes.length - 1][0];
      let newRange = selectedNotes[selectedNotes.length - 1][1];
      let interval = Math.random() > 0.5 ?  2:  1;
      newNote = ascendance ? newNote + interval: newNote - interval;
      
      newRange = newNote > 9 ? 4 : 3;


      selectedNotes.push([newNote, newRange]);
    }
  }
  return selectedNotes;
}

function hardSequence(idxNote, idxRange) {
  let newIdxNote = idxNote;
  let selectedNotes = [[newIdxNote, idxRange]];

  for (i = 0; i < 4; i++) {
    let newNote = getRandomInt(16);
    let newRange = newNote > 9 ? 4 : 3;
    selectedNotes.push([newNote, newRange])
  }

  return selectedNotes;
}

function modeBtnPressed(btn) {
  if (btn.id === "launchBtn" || btn.id === "launchBtnChallenge") {
    seqToPlay = generateNoteSequence();
    playSequence();
  }
  else if (btn.id === "repeatBtn" &&  seqToPlay.length === 0) {
  }
  else {
    playSequence();
  }
}

function playSequence() {
  let time = Tone.Time();
  let delay = 0;
  const duration = 0.5;
  const delayRate = 0.25;

  document.querySelectorAll(".modeBtn").forEach((el) => {
    disableButton(el);
    setTimeout(enableButton, seqToPlay.length * (duration + delayRate)*1000 , el)
  })

  for (i = 0; i < seqToPlay.length; i++) {
    let currentNote = notes[seqToPlay[i][0]] + seqToPlay[i][1];

    console.log(notes[seqToPlay[i][0]])
    
    synth.triggerAttackRelease(currentNote, duration, time + delay)
    delay += duration + delayRate
  }
}

//??
function verify() {
  const tmp = ["D", "E", "F", "G", "A", "B", "C", "D", "E", "F"];
  const selected = document.querySelectorAll(".selected");
  selected.forEach((btn) => {
    const list = btn.classList;
    const column = Math.floor(list[2] / 10);
    const lign = list[2] % 10;
    let noteSelected = tmp[lign];
    if (list.length > 4) {
      noteSelected = noteSelected + "#"
    }

    if (notes[seqToPlay[column][0]] === noteSelected ) {
      btn.style.backgroundColor = "rgb(0,255,0)";
    }
    else {
      btn.style.backgroundColor = "rgb(255,0,0)"
    }
  })
  
}

function retry() {
  document.querySelectorAll(".noteBtn").forEach((el) => {
    enableButton(el);
    el.style.backgroundColor = "rgb(32, 29, 29)";
    if (el.classList.contains("selected")) {
      el.classList.remove("selected");
    }
    if (el.classList.contains("sharp")) {
      el.classList.remove("sharp");
    }
  })
}



function addNote(btn) {
  document.querySelectorAll(".noteBtn").forEach((el) => {
    if (el === btn) {
      if (el.classList.contains("selected")) {
        el.classList.add("sharp");
        el.style.backgroundColor = "rgb(204, 101, 33)";
      }
      else {                                      
        el.classList.add("selected");
      }
    }
    if (el !== btn && getNbrColumn(el.classList[2]) === getNbrColumn(btn.classList[2])) {
      el.style.backgroundColor = "rgb(255,255,255)";
      el.disabled = true;
    }
  })
}


//Challenge

//MODEL
let attempts = 3;
let seqLeft = 5;
let score = 0;
let totalScore = 0;
let recordedNotes = [];
const scale = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

if (!localStorage.getItem("scores")) {
  localStorage.setItem("scores", JSON.stringify({}));
}

//VIEW 
document.addEventListener("DOMContentLoaded", function() {
  const container = document.createElement("div");
  container.classList.add("buttonContainer");
  container.style.display = "flex";
  container.style.fustifyContent = "space-around";
  

  for (let i = 0; i < scale.length; i++) {
      let button = document.createElement("button");
      button.classList.add("Btn", "agBtn", "challengeBtn", `${scale[i]}`);
      button.textContent = `${scale[i]}`;
      button.style.width = "70px";
      button.style.margin = "10px";
      button.onclick = function() { recordNote(this,scale[i]); };
      
      container.appendChild(button);
  }
      
  document.getElementById("noteContainer").appendChild(container);
});


function updateData() {
  document.getElementById("attempts").textContent = "Attempts: " + attempts;
  document.getElementById("seqLeft").textContent = "Number of Sequence left: " + seqLeft;
  document.getElementById("currentScore").textContent = "CurrentScore: " + score;
  document.getElementById("score").textContent = "Total score: " + totalScore;
  console.log("updated !")
}

function donePlaying() {
  if (seqLeft === 0) {
    alert("Challenge completed, save your score, update in hour");
  }
}
setInterval(updateData, 1000);
setInterval(donePlaying, 1000);

function enableButtonById(id) {
  document.getElementById(id).disabled = false;
}

function disableButtonById(id) {
  document.getElementById(id).disabled = true;
}

function enableButtons() {
  document.querySelectorAll(".challengeBtn").forEach((el) => {enableButton(el)});
}

function disableButtons () {
  document.querySelectorAll(".challengeBtn").forEach((el) => {disableButton(el)});
}

//CONTROLER

function saveScore() {
  totalScore += score;
  score = 0;
  attempts = 3;
  seqLeft -= 1;
  seqToPlay = [];
}
// ??


function calcPoint() {
  let newScore = 0;
  for (let i = 0; i < seqToPlay.length; i++) {
    console.log(notes[seqToPlay[i][0]], recordedNotes[i])
    if (notes[seqToPlay[i][0]] === recordedNotes[i]) {
      newScore += 10;
    }
  }
  score = newScore;
  attempts -= 1;

  if (attempts === 0 && seqLeft > 0) {
    totalScore += score 
    attempts = 3;
    seqLeft -= 1;
    score = 0;
    seqToPlay = [];
  }
  recordedNotes = [];
}


function launchChallengeSequence(btn) {

  if (selectedMode !== 2) {
    shiftMode(2);
  }

  modeBtnPressed(btn);
  enableButtons();
  disableButtonById("launchBtnChallenge");
}

function recordNote(btn,note) {
  if (recordedNotes.length < seqToPlay.length) {
    btn.style.backgroundColor = "rgb(0,0,0)";
    recordedNotes.push(note);
    setTimeout((el) => {el.style.backgroundColor = "rgb(204, 101, 33)"}, 150 , btn);
  } 
  else {
    disableButtons();
  }
}

