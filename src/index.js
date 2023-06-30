import axios from 'axios';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './js/createMarkup';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input'),
  submitBtn: document.querySelector('[type="submit"]'),
  galleryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const API_KEY = '37960229-568719668cd9d6c687eddc6ce';
const BASE_URL = 'https://pixabay.com/api/';
const maxPage = '20';
let currentPage = 1;
let currentQuery = '';
let requestUrl = '';

refs.formEl.addEventListener('submit', handlerFormSubmit);
refs.loadMore.addEventListener('click', handlerLoadMore);

async function handlerFormSubmit(e) {
  e.preventDefault();
  currentQuery = refs.inputEl.value.trim();
  currentPage = 1;

  clearGalery();
  await fetchSearchInData();
}

async function fetchSearchInData() {
  requestUrl = getRequest(currentQuery, currentPage);

  try {
    const data = await fetchImages(requestUrl);
    chackFatchResult(data);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry! An error occurred while getting the images. Please try again later'
    );
  }
}

function chackFatchResult(data) {
  const { hits, totalHits } = data;
  if (hits.lenght === 0) {
    Notiflix.Notify.failure(
      'Sorry! There are no images matching your search query. Please try again.'
    );
    hideLoadMoreBtn();
  } else {
    createMarkup(hits);
    if (currentPage * maxPage <= totalHits) {
      showLoadMoreBtn();
    } else {
      hideLoadMoreBtn();
      Notiflix.Notify.info(
        "We're sorry! But you've reached the end of search results."
      );
    }
  }
}

function getRequest(query, page) {
  const url = new URL(BASE_URL);
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('q', query);
  url.searchParams.append('image_type', 'photo');
  url.searchParams.append('orientation', 'horizontal');
  url.searchParams.append('safesearch', 'true');
  url.searchParams.append('page', page.toString());
  url.searchParams.append('per_page', maxPage.toString());
  return url.toString();
}

function clearGalery() {
  refs.galleryEl.innerHTML = '';
}

function hideLoadMoreBtn() {
  refs.loadMore.style.display = 'block';
}

function showLoadMoreBtn() {
  refs.loadMore.style.display = 'none';
}

async function handlerLoadMore() {
  currentPage += 1;
  await fetchSearchInData();
}

async function fetchImages(requestUrl) {
  try {
    const response = await axios.get(requestUrl);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}
