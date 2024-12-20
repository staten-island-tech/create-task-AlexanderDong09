import { DOMSelectors } from "./dom.js";

let photoPool = [];

async function fetchImages(count = 5) {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=ul8UJtZB9tVcNUR2v9fwokows0p7JuQ4atB6G65d&count=${count}` // fetch returns a promise (a promise that you'll get something) (like a receipt)
    );
    // gaurd clause
    if (response.status != 200) {
      throw new Error(response);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    console.log("sorry coudlnt fid that");
  }
  photoPool.push(...data); // pushes api data into array. use w/ shift and maybe to display card info by using an index (at the end?)
}

function startGame() {
  const leftPhoto = photoPool.shift();
  const rightPhoto = photoPool.shift();

  displayPhotos(leftPhoto, rightPhoto);
}

function displayPhotos(leftPhoto, rightPhoto) {
  document.querySelector("#side1").innerHTML = `
    <h2>${leftPhoto.title}</h2>
    <img src="${item.hdurl}" alt="${item.title}
    <p>Was APOD on: ${leftPhoto.date}</p>
  `;

  document.querySelector("#side2").innerHTML = `
    <h2>${rightPhoto.title}</h2>
    <img src="${item.hdurl}" alt="${item.title}
    <button class="btn" id="more-recent">More Recent</button>
    <button class="btn" id="less-recent">Less Recent</button>
    <p>Featured on: ???</p>
  `;

  // make sure to set up the buttons function and put here
}

startGame();
