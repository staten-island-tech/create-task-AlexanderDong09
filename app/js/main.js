import { DOMSelectors } from "./dom.js";

let photoPool = [];
let score = 0;
let attempts = 0;
const maxAttempts = 3;

async function fetchImages(count = 5) {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=ul8UJtZB9tVcNUR2v9fwokows0p7JuQ4atB6G65d&count=${count}`
    );
    if (response.status != 200) {
      throw new Error(response);
    } else {
      const data = await response.json();
      const filteredData = data.filter((item) => item.media_type != "video");
      photoPool.push(...filteredData);
      console.log(photoPool);
      return filteredData;
    }
  } catch (error) {
    console.log(error);
    alert("An error occured! Try refreshing the page.");
  }
}

async function startEndlessGame() {
  score = 0;
  attempts = 0;
  document.querySelector("#scoreDisplay").innerHTML = "Score: 0";
  document.querySelector(
    "#attemptDisplay"
  ).innerHTML = `Attempts Remaining: ${maxAttempts}`;
  photoPool = await fetchImages();
  let leftPhoto = photoPool.shift();
  let rightPhoto = photoPool.shift();
  displayPhotos(leftPhoto, rightPhoto);
}

function displayPhotos(leftPhoto, rightPhoto) {
  DOMSelectors.side1.innerHTML = "";
  DOMSelectors.side2.innerHTML = "";

  DOMSelectors.side1.insertAdjacentHTML(
    "beforeend",
    `
    <h2>${leftPhoto.title}</h2>
    <img class="size-2/3"  src="${leftPhoto.hdurl}" alt="${leftPhoto.title}">
    <h4>Was APOD on:</h4>
    <h2>${leftPhoto.date}</h2>
    `
  );

  DOMSelectors.side2.insertAdjacentHTML(
    "beforeend",
    `<h2 class="">${rightPhoto.title}</h2>
    <img class="size-2/3" src="${rightPhoto.hdurl}" alt="${rightPhoto.title}">
    <p>Was featured</p>
    <button id="more-recent" class="btn btn-secondary ">More Recently!</button>
    <button id="less-recent" class="btn btn-accent bg-fuchsia-800 p-2 m-2 ">Less Recently!</button>
    <h4 class="">than ${leftPhoto.title}</h4>`
  );

  document.querySelector("#more-recent").onclick = () => {
    guess(rightPhoto, leftPhoto, "More Recent");
  };
  document.querySelector("#less-recent").onclick = () => {
    guess(rightPhoto, leftPhoto, "Less Recent");
  };
}

function updateGameInfo() {
  DOMSelectors.scoreDisplay.innerHTML = "";
  DOMSelectors.scoreDisplay.insertAdjacentHTML(
    "afterbegin",
    `<h2 class="text-black text-3xl">Score: ${score}</h2>`
  );
  document.querySelector("#attemptDisplay").innerHTML = `Attempts Remaining: ${
    maxAttempts - attempts
  }`;
}

function guess(leftPhoto, rightPhoto, choice) {
  const leftImageDate = new Date(leftPhoto.date);
  const rightImageDate = new Date(rightPhoto.date);
  const correct =
    (choice === "More Recent" && rightImageDate < leftImageDate) ||
    (choice === "Less Recent" && rightImageDate > leftImageDate);

  while (attempts < maxAttempts) {
    if (correct) {
      score++;
      updateGameInfo();
      continueGame(leftPhoto);
      break;
    } else {
      attempts++;
      updateGameInfo();
      if (maxAttempts - 1 > attempts) {
        alert(
          `Incorrect, sorry! You have ${
            maxAttempts - attempts
          } attempts remaining`
        );
      } else if (attempts === maxAttempts - 1) {
        alert(`Incorrect, sorry! You have ONE attempt remaining!`);
      } else {
        document.querySelector(
          "#attemptDisplay"
        ).innerHTML = `Attempts Remaining: ZERO`;
        if (leftImageDate > rightImageDate) {
          alert(
            `Game Over!
            ${leftPhoto.title} was featured on ${leftPhoto.date}, which was MORE recent than ${rightPhoto.title}`
          );
        } else {
          alert(
            `Game Over!
            ${leftPhoto.title} was featured on ${leftPhoto.date}, which was LESS recent than ${rightPhoto.title}`
          );
        }
      }
      break;
    }
  }
  if (attempts >= maxAttempts) {
    lose(score);
  }
}

function lose(score) {
  const modal = document.createElement("div");
  modal.className =
    "bg-black fixed inset-0 bg-green bg-opacity-25 flex justify-center items-center z-50";
  modal.style.backgroundImage = "url('background.png')";
  modal.style.backgroundSize = "cover";

  modal.innerHTML = ` 
  <div class= "w-full h-full flex flex-col justify-center items-center overflow-auto rounded-lg shadow-lg">
  <h1 class="text-white text-5xl mb-6">you chose incorrectly and lost :(</h1>
  <h2 class="text-white text-2xl md:text-4xl">Your Score: ${score}</h2>
  <button class="btn btn-primary mt-4" id="play-again">Play Again</button>
  </div>
  `;

  document.body.appendChild(modal);

  const playAgain = document.getElementById("play-again");
  playAgain.addEventListener("click", function () {
    modal.remove();
  });

  startEndlessGame();
}

function continueGame(newLeftPhoto) {
  if (photoPool.length < 3) {
    fetchImages();
  }
  let newRightPhoto = photoPool.shift();
  displayPhotos(newLeftPhoto, newRightPhoto);
}

startEndlessGame();

// This code uses the NASA APOD (Astronomy Picture of the Day) API
// API URL: https://api.nasa.gov/planetary/apod
// This code was made freely available by NASA: https://api.nasa.gov/
