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
  let photoPool = await fetchImages();
  let leftPhoto = photoPool.shift();
  console.log(leftPhoto);
  let rightPhoto = photoPool.shift();
  console.log(rightPhoto);
  displayPhotos(leftPhoto, rightPhoto);
}

function displayPhotos(leftPhoto, rightPhoto) {
  console.log(leftPhoto, rightPhoto);
  DOMSelectors.side1.innerHTML = "";
  DOMSelectors.side2.innerHTML = "";

  DOMSelectors.side1.insertAdjacentHTML(
    "beforeend",
    `
  <h2>${leftPhoto.title}</h2>
  <img src="${leftPhoto.hdurl}" alt="${leftPhoto.title}">
  <h4>Was APOD on:</h4>
  <h2>${leftPhoto.date}</h2>`
  );
  DOMSelectors.side2.insertAdjacentHTML(
    "beforeend",
    `<h2 class="text-3xl">${rightPhoto.title}</h2>
    <img src="${rightPhoto.hdurl}" alt="${rightPhoto.title}">
    <p>Was featured</p>
    <button id="more-recent" class="btn btn-secondary ">More Recently!</button>
    <button id="less-recent" class="btn btn-accent bg-fuchsia-800 p-2 m-2 rounded">Less Recently!</button>
    <h4 class="text-xl">than ${leftPhoto.title}</h4>`
  );

  document.querySelector("#more-recent").addEventListener("click", () => {
    guess(rightPhoto, leftPhoto, "More Recent");
  });
  document.querySelector("#less-recent").addEventListener("click", () => {
    guess(rightPhoto, leftPhoto, "Less Recent");
  });
}

function guess(leftPhoto, rightPhoto, choice) {
  const leftImageDate = new Date(leftPhoto.date);
  const rightImageDate = new Date(rightPhoto.date);
  console.log(leftImageDate);
  console.log(rightImageDate);

  const correct =
    (choice === "More Recent" && rightImageDate - leftImageDate < 0) ||
    (choice === "Less Recent" && leftImageDate - rightImageDate < 0);

  console.log(correct);

  if ((choice = correct)) {
    score += 1;
    console.log("Correct");
    continueGame(leftPhoto, rightPhoto);
    if (score >= highscore) {
      // replace the highscore with your current score
      console.log(score);
    }
  } else {
    console.log("Nope");
  }
}

function continueGame(leftPhoto, rightPhoto) {
  if (photoPool.length < 3) {
    fetchImages();
  }
  console.log(photoPool);
  leftPhoto = rightPhoto;
  rightPhoto = photoPool.shift();
  console.log(photoPool);
  displayPhotos(leftPhoto, rightPhoto);
}

await startGame();
