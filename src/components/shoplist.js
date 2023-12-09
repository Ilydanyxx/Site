import { getBookById } from '../api';
import { deleteFromStorage, getStoredItems } from './localStorageApi';

let shoppingList = [];
function init() {
  const windowHeight = window.innerWidth;
  const perPage = windowHeight >= 768 ? 3 : 4;

  shoppingList = getStoredItems() || [];
  const placeHolder = document.querySelector('.shopping-empty-container');

  if (shoppingList.length !== 0) {
    placeHolder.classList.add('visually-hidden');
  } else {
    placeHolder.classList.remove('visually-hidden');
  }
}

init();

function createShoppingCard(book) {
  const { buy_links } = book;
  const cardListContainer = document.querySelector('.shopping-list-cardlist');
  const listItem = document.createElement('li');
  listItem.classList.add('shopping-list-card');
  const cardHTMLOld = `
      <img class="shopping-list-cardlogo" src="${
        book.book_image
      }" alt="book-logo" />
      <div class="shopping-list-fullinfo">
        <div class="shopping-list-cardheader">
          <div class="cardheader-titlecontainer">
            <h3 class="shopping-list-cardtitle">${book.title}</h3>
            <h4 class="shopping-list-cardcategory">${book.list_name}</h4>
          </div>
          <button class="deletecard">Х</button>
        </div>
        <p class="shopping-list-carddescription">${book.description}</p>
        <div class="shopping-list-cardfooter">
          <h4 class="shopping-list-cardauthor">${book.author}</h4>
          <ul class="shopping-list-shops">
            ${generateShopLinks(book.shops)}
          </ul>
        </div>
      </div>
  `;

  const cardHTML = `
  <img
                class="shopping-list-cardlogo"
                src="${book.book_image}"
                alt="book-logo"
              />
              <div class="shopping-list-fullinfo">
                <div class="shopping-list-cardheaer">
                  <div class="cardheaer-tittlecontainer">
                    <h3 class="shopping-list-cardtitle">${book.title}</h3>
                    <h4 class="shopping-list-cardcategory">
                      ${book.list_name}
                    </h4>
                  </div>
                  <button class="deletecard">
                  </button>
                </div>
                <p class="shopping-list-carddescription">
                  ${book.description}
                </p>
                <div class="shopping-list-cardfooter">
                  <h4 class="shopping-list-cardauthor">${book.author}</h4>
                  <ul class="shopping-list-shops">
                <li class="shopping-list-shopsitem">
                  <a href="${buy_links[0].url}" class="shopping-list-shopslink">
                    <div class="shopping-list-shopsicon1"></div>
                  </a>
                </li>
                <li class="shopping-list-shopsitem">
                  <a href="${buy_links[1].url}" class="shopping-list-shopslink">
                    <div class="shopping-list-shopsicon2"></div>
                  </a>
                </li>
                <li class="shopping-list-shopsitem">
                  <a href="${buy_links[4].url}" class="shopping-list-shopslink">
                    <div class="shopping-list-shopsicon3"></div>
                  </a>
                </li>
                  </ul>
                </div>
              </div>
  `;

  listItem.innerHTML += cardHTML;
  listItem.addEventListener(
    'click',
    deleteCard.bind({
      card: listItem,
      id: book._id,
    })
  );
  cardListContainer.append(listItem);
}

function generateShopLinks(shops) {

}

async function displayShoppingCards() {
  const cardListContainer = document.querySelector('.shopping-list-cardlist');
  cardListContainer.innerHTML = '';
  const arr = [];
  for (let i = 0; i < shoppingList.length; i++) {
    const res = await getBookById(shoppingList[i]);
    if (res) {
      arr.push(res.data);
    }
  }

  console.log(arr);

  arr.forEach(book => {
    createShoppingCard(book);
  });
}

function updateLocalStorage() {
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}

displayShoppingCards();

function deleteCard(event) {
  if (
    event.target.classList.contains('deletecard') ||
    event.target.classList.contains('shopping-list-icon')
  ) {
    deleteFromStorage(this.id);
    this.card.remove();
  }

  init();
}
