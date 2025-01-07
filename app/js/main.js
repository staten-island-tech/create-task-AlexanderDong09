import { DOMSelectors } from "./dom.js";

let photoPool = [];
let score = 0;
let highscore = 0;

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
    lose();
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

function lose() {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-green bg-opacity-25 flex justify-center items-center z-50 opacity-0";

  modal.innerHTML = ` 
  <div class="bg-black w-[95%] md:w-[75%] h-[80%]  overflow-auto rounded-lg shadow-lg p-2 relative border-[3px] border-green">
  <button class="btn btn-square btn-outline btn-sm md:btn-md absolute top-2 right-2 md:top-3 md:right-3" id="close-modal">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
  <h2>Your Score: ${score}</h2> 
  </div>
  `;

  document.body.appendChild(modal);

  const closeModal = document.getElementById("close-modal");
  closeModal.addEventListener("click", function () {
    modal.remove();
  });
}

function continueGame(newLeftPhoto) {
  if (photoPool.length < 3) {
    fetchImages();
  }
  let newRightPhoto = photoPool.shift();
  displayPhotos(newLeftPhoto, newRightPhoto);
}

startGame();
