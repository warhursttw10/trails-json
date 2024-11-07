import { initializePage, downloadJSON } from "./trails.js";

initializePage();

document.querySelector('.js-download').addEventListener('click', () => {
    downloadJSON();
});