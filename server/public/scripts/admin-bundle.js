/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!******************************!*\
  !*** ./src/scripts/admin.js ***!
  \******************************/
//admin.js
const socket = io();
const listDiv = document.getElementById('list');
const contentDiv = document.getElementById('content');
const createItemBtn = document.getElementById('create');
const userDiv = document.getElementById('userId');
const log = document.getElementById('logout');
const displayItems = async () => {
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch('/item/', requestOptions);
  if (!response.ok) {
    throw new Error('Response not ok');
  }
  const items = await response.json();
  let html = '<p>Les spectacles:</p><ul>';
  items.forEach(item => {
    html += `<li class="item">${item.description} : ${item.capacity} places 
      <button class="modify" data-id="${item._id}">Modifier</button> <button class="delete" data-id="${item._id}">Supprimer</button></li>`;
  });
  listDiv.innerHTML = html;
  const deleteButtons = document.querySelectorAll('.delete');
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', () => {
      const itemId = deleteButton.getAttribute('data-id');
      deleteItem(itemId, deleteButton);
    });
  });
  const modifyButtons = document.querySelectorAll('.modify');
  modifyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const itemId = button.getAttribute('data-id');
      updateItem(itemId, button);
    });
  });
};
const createItem = async () => {
  const description = document.getElementById('desc').value;
  const capacity = document.getElementById('capacity').value;
  if (!description) {
    contentDiv.textContent = 'La description du spectacle ne peut pas être vide.';
    return;
  }
  if (!capacity) {
    contentDiv.textContent = 'La capacité du spectacle ne peut pas être vide.';
    return;
  }
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      description,
      capacity
    })
  };
  const response = await fetch('/item/', requestOptions);
  if (!response.ok) {
    throw new Error('Response not ok');
  }
  const createdItem = await response.json();
  contentDiv.textContent = `Spectacle avec id ${createdItem._id} a été créé.`;
  displayItems();
  clearFields();
  socket.emit('itemCreated', createdItem);
};
const deleteItem = async (itemId, button) => {
  const requestOptions = {
    method: 'DELETE'
  };
  const response = await fetch(`/item/${itemId}`, requestOptions);
  if (response.ok) {
    contentDiv.textContent = `Spectacle avec id ${itemId} a été supprimé.`;
    button.parentNode.remove();
    socket.emit('itemDeleted', itemId);
  } else {
    contentDiv.textContent = `Spectacle avec id ${itemId} ne peut pas être supprimé`;
  }
  displayItems();
};
const updateItem = async (itemId, button) => {
  const newDescription = prompt('Enter a new description for the item:');
  if (!newDescription) {
    contentDiv.textContent = 'New item description cannot be empty.';
    return;
  }
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      newDescription
    })
  };
  const response = await fetch(`/item/update/${itemId}`, requestOptions);
  if (!response.ok) {
    const error = await response.json();
    contentDiv.textContent = error.message;
    return;
  }
  const updatedItem = await response.json();
  contentDiv.textContent = `Item with id ${updatedItem._id} was updated.`;
  displayItems();
  socket.emit("itemModified", updatedItem);
};
const getUser = async () => {
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch('/user/me', requestOptions);
  if (!response.ok) {
    throw new Error('Failed to get user.');
  }
  const user = await response.json();
  userDiv.textContent = `${user.name}` || '';
  displayItems();
  return user;
};
const logout = async () => {
  const requestOptions = {
    method: 'GET'
  };
  const response = await fetch(`/access/logout`, requestOptions);
  if (response.ok) {
    window.location.href = '/access/login';
  }
};
const clearFields = () => {
  const descriptionInput = document.getElementById('desc');
  const capacityInput = document.getElementById('capacity');
  descriptionInput.value = '';
  capacityInput.value = '';
};
createItemBtn.addEventListener('click', createItem);
log.addEventListener('click', logout);
getUser();
displayItems();
socket.on('itemBorrowed', itemId => {
  contentDiv.textContent = `Spectacle avec id ${itemId} est réservé.`;
  displayItems();
});
socket.on('itemReleased', itemId => {
  contentDiv.textContent = `Spectacle avec id ${itemId} est libéré .`;
  displayItems();
});
socket.on('capacityZero', itemId => {
  displayItems();
});
/******/ })()
;
//# sourceMappingURL=admin-bundle.js.map