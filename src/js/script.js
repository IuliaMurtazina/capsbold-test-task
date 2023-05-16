import "../scss/style.scss";
import "../index.html";

import { v4 as uuid } from "uuid";

import { todoData } from "./todoData";
const todoList = document.querySelector(".todo-list");
const addTodoButton = document.querySelector(".todo__button");
const overlay = document.querySelector(".overlay");
const addTodoPopup = document.querySelector(".add-todo-popup");
const addTodoForm = document.querySelector(".add-form");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const closeTodoPopup = document.querySelector(".add-form__close");

const markupTodoHandler = (itemId, itemTitle, itemDescription) => {
  return `
  <div class="todo-item">
    <input type="checkbox" id='${itemId}' class="todo-item__checkbox">
    <label for='${itemId}' class="todo-item__content">
      <span class="todo-item__title">${itemTitle}</span>
      <p class="todo-item__description">${itemDescription}</p>
    </label>
  </div>
  `;
};

const setLocalStorageItemsHandler = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const renderTodoHandler = () => {
  let markup;

  if (localStorage.getItem("todoData") === null) {
    markup = todoData
      .map((item) => markupTodoHandler(item.id, item.title, item.description))
      .join("");
    setLocalStorageItemsHandler("todoData", todoData);
  } else {
    const data = JSON.parse(localStorage.getItem("todoData"));
    markup = data
      .map((item) => markupTodoHandler(item.id, item.title, item.description))
      .join("");
  }
  todoList.insertAdjacentHTML("afterbegin", markup);
};

renderTodoHandler();

const showAddTodoPopupHandler = () => {
  overlay.classList.remove("hidden");
  addTodoPopup.classList.remove("hidden");
};

const hideAddTodoPopupHandler = () => {
  overlay.classList.add("hidden");
  addTodoPopup.classList.add("hidden");

  titleInput.value = "";
  descriptionInput.value = "";
};

const addTodoHandler = (e) => {
  e.preventDefault();

  const title = titleInput.value;
  const description = descriptionInput.value;

  if (title.trim() === "" && description.trim() === "") return;

  const id = uuid();
  const data = { id, title, description };
  const savedData = JSON.parse(localStorage.getItem("todoData"));
  savedData.unshift(data);

  const markup = markupTodoHandler(id, title, description);
  todoList.insertAdjacentHTML("afterbegin", markup);
  hideAddTodoPopupHandler();

  localStorage.clear();
  setLocalStorageItemsHandler("todoData", savedData);
};

const invalidInputHandler = (input) => {
  if (input.value.trim() === "") {
    input.style.border = "2px solid #D95233";
  } else {
    input.style.border = "2px solid #414B62";
  }
};

titleInput.addEventListener(
  "input",
  invalidInputHandler.bind(null, titleInput),
);
descriptionInput.addEventListener(
  "input",
  invalidInputHandler.bind(null, descriptionInput),
);
addTodoButton.addEventListener("click", showAddTodoPopupHandler);
addTodoForm.addEventListener("submit", addTodoHandler);

overlay.addEventListener("click", hideAddTodoPopupHandler);
closeTodoPopup.addEventListener("click", hideAddTodoPopupHandler);
