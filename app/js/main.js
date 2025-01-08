import { DOMSelectors } from "./dom.js";

let photoPool = [];
let score = 0;

// This code was made freely available by the NASA APOD (Astronomy Photo of the Day) API.
async function fetchImages(count = 5) {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=ul8UJtZB9tVcNUR2v9fwokows0p7JuQ4atB6G65d&count=${count}`
    );
    if (response.status != 200) {
      throw new Error(response);
    } else {
      const data = await response.json();
      console.log(data);

      const filteredData = data.filter((item) => item.media_type != "video");
      photoPool.push(...filteredData); // pushes api data into array. use w/ shift and maybe to display card info by using an index (at the end?)
      return filteredData;
    }
  } catch (error) {
    console.log(error);
    console.log("sorry coudlnt fid that");
  }
}

async function startGame() {
  score = 0;
  document.querySelector("#scoreDisplay").innerHTML = "";
  photoPool = await fetchImages();
  let leftPhoto = photoPool.shift();
  let rightPhoto = photoPool.shift();
  displayPhotos(leftPhoto, rightPhoto);
  DOMSelectors.scoreDisplay.insertAdjacentHTML(
    "afterbegin",
    `<h2>Score: 0</h2>`
  );
}

function displayPhotos(leftPhoto, rightPhoto) {
  // console.log(leftPhoto, rightPhoto);
  DOMSelectors.side1.innerHTML = "";
  DOMSelectors.side2.innerHTML = "";

  DOMSelectors.side1.insertAdjacentHTML(
    "beforeend",
    `
  <h2>${leftPhoto.title}</h2>
  <img class="size-2/3"  src="${leftPhoto.hdurl}" alt="${leftPhoto.title}">
  <h4>Was APOD on:</h4>
  <h2>${leftPhoto.date}</h2>`
  );

  DOMSelectors.side2.insertAdjacentHTML(
    "beforeend",
    `<h2 class="">${rightPhoto.title}</h2>
    <img class="size-2/3" src="${rightPhoto.hdurl}" alt="${rightPhoto.title}">
    <p>Was featured</p>
    <button id="more-recent" class="btn btn-secondary ">More Recently!</button>
    <button id="less-recent" class="btn btn-accent bg-fuchsia-800 p-2 m-2 rounded">Less Recently!</button>
    <h4 class="">than ${leftPhoto.title}</h4>`
  );

  document.querySelector("#more-recent").onclick = () => {
    guess(rightPhoto, leftPhoto, "More Recent");
  };
  document.querySelector("#less-recent").onclick = () => {
    guess(rightPhoto, leftPhoto, "Less Recent");
  };
}

function guess(leftPhoto, rightPhoto, choice) {
  const leftImageDate = new Date(leftPhoto.date);
  const rightImageDate = new Date(rightPhoto.date);
  console.log("this is the left image's date: " + leftImageDate);
  console.log("this is the rugt image's date: " + rightImageDate);

  const correct =
    (choice === "More Recent" && rightImageDate < leftImageDate) ||
    (choice === "Less Recent" && rightImageDate > leftImageDate);

  if (correct) {
    updScore();
    console.log("Correct");
    continueGame(leftPhoto);
    console.log("your score is: " + score);
    // if (score >= highscore) {
    //   // replace the highscore with your current score
    //   console.log(score);
    // }
  } else {
    lose(score);
    console.log("Nope");
  }
}

function updScore() {
  score++;
  DOMSelectors.scoreDisplay.innerHTML = "";
  DOMSelectors.scoreDisplay.insertAdjacentHTML(
    "afterbegin",
    `<h2>Score: ${score}</h2>`
  );
}

function lose(score) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-green bg-opacity-25 flex justify-center items-center z-50";
  modal.style.backgroundImage = "url('background.png')";
  modal.style.backgroundSize = "cover";

  modal.innerHTML = ` 
  <div class= "w-full h-full flex flex-col justify-center items-center overflow-auto rounded-lg shadow-lg">
  <h1 class="text-white text-5xl mb-6">you lost :(</h1>
  <h2 class="text-white text-2xl md:text-4xl">Your Score: ${score}</h2>
  <button class="btn btn-primary mt-4" id="play-again">Play Again</button>
  </div>
  `;

  document.body.appendChild(modal);

  const playAgain = document.getElementById("play-again");
  playAgain.addEventListener("click", function () {
    modal.remove();
  });

  startGame();
}

function continueGame(newLeftPhoto) {
  if (photoPool.length < 3) {
    fetchImages();
  }
  let newRightPhoto = photoPool.shift();
  displayPhotos(newLeftPhoto, newRightPhoto);
}

startGame();
