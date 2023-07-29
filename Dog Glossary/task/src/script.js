'use strict';

const content = document.getElementById('content');

const showMessage = function(message) {
  content.innerHTML = '';
  content.insertAdjacentHTML('afterbegin', `<p>${message}</p>`);
};

const getDogResponseMessage = async function(url) {
  try {
    const dogResponse = await fetch(url);
    const dogImage = await dogResponse.json();
    if (dogImage.status !== 'success') throw new Error('Could not fetch image');
    return dogImage.message;
  } catch (e) {
    throw (e);
  }
};

const getRandomDogHref = async function() {
  try {
    return await getDogResponseMessage(
        'https://dog.ceo/api/breeds/image/random');
  } catch (e) {
    throw e;
  }
};
const showDogImage = function(dogImage, alt = 'Dog image') {
  content.innerHTML = '';
  const imageElement = new Image();
  imageElement.src = dogImage;
  imageElement.alt = alt;
  imageElement.id = 'dog-image';
  imageElement.classList.add('img-thumbnail');
  imageElement.addEventListener('load',
      () => content.insertAdjacentElement('afterbegin', imageElement));
  imageElement.addEventListener('error', () => showMessage(
      'Image could not be loaded. Check your internet connection'));
};

const showRandomDog = async function() {
  try {
    const dogImage = await getRandomDogHref();
    showDogImage(dogImage, 'Random dog image');
  } catch (e) {
    showMessage('Could not fetch the dog image! Check your internet connection');
  }
};

const getBreedName = function() {
  return document.getElementById('input-breed').value.toLowerCase();
};

const getBreedHref = async function(breed) {
  try {
    return await getDogResponseMessage(
        `https://dog.ceo/api/breed/${breed}/images/random`);
  } catch (e) {
    throw (e);
  }
};

const showBreed = async function() {
  const breed = getBreedName();
  try {
    const breedHref = await getBreedHref(breed);
    showDogImage(breedHref, `Dog of ${breed} breed`);
  } catch (e) {
    showMessage('Breed not found!');
  }

};

const getSubBreedList = async function(breed) {
  try {
    return getDogResponseMessage(`https://dog.ceo/api/breed/${breed}/list`);
  } catch (e) {
    throw e;
  }
};

const showList = function(list) {
  if (Array.isArray(list) && list.length === 0) return showMessage(
      'No sub-breeds found!');
  content.innerHTML = '';
  let html = `<ol class="list-group list-group-numbered" id="sub-breeds-list">`;
  list.forEach(
      subBreed => html += `<li class="list-group-item">${subBreed}</li>`);
  html += '</ol>';
  content.insertAdjacentHTML('afterbegin', html);
};

const showSubBreeds = async function() {
  const breed = getBreedName();
  try {
    const subBreeds = await getSubBreedList(breed);
    showList(subBreeds);
  } catch (e) {
    showMessage('Breed not found!');
  }
};

const getAllBreedsWithSubBreeds = async function() {
  try {
    return await getDogResponseMessage('https://dog.ceo/api/breeds/list/all');
  } catch (e) {
    throw e;
  }
};

const generateAllBreedsMarkup = function(allBreeds) {
  return `<ol class="list-group list-group-numbered" id="all-breeds-list">
        ${Object.keys(allBreeds).map(breed => {
    return `
            <li class="list-group-item">${breed}
            ${allBreeds[breed].length !== 0 ? `<ul>${allBreeds[breed].map(
        element => `<li>${element}</li>`).join('')}</ul>` : ''}
            </li>`;
  }).join('')}
    </ol>`;

};

const showAllBreeds = async function() {
  try {
    const allBreeds = await getAllBreedsWithSubBreeds();
    const html = generateAllBreedsMarkup(allBreeds);
    content.innerHTML = '';
    content.insertAdjacentHTML('afterbegin', html);
  } catch (e) {
    showMessage(
        'Could not load list of all breeds. Check your internet connection');
  }
};

document.getElementById('button-random-dog').
    addEventListener('click', showRandomDog);
document.getElementById('button-show-breed').
    addEventListener('click', showBreed);
document.getElementById('button-show-sub-breed').
    addEventListener('click', showSubBreeds);
document.getElementById('button-show-all').
    addEventListener('click', showAllBreeds);
