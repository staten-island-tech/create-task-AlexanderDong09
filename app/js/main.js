import { DOMSelectors } from "./dom.js";

async function fetchImages(count = 5) {
  // 2nd api call, getting the data from a specific date
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
}
