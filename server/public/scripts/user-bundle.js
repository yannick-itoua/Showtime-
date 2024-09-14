/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/scripts/user.js ***!
  \*****************************/
//user.js
const socket = io();
const contentDiv = document.getElementById('content');
const listDiv = document.getElementById('list');
const userDiv = document.getElementById('userId');
const log = document.getElementById('logout');
const borrowedItemDiv = document.getElementById('borrowed-item');
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
    html += `<li class="item">${item.description} : ${item.capacity} places  <button class="emprunt" data-id="${item._id}">Réserver un ticket</button></li>`;
  });
  listDiv.innerHTML = html;
  const borrowButtons = document.querySelectorAll('.emprunt');
  borrowButtons.forEach(button => {
    button.addEventListener('click', () => {
      const itemId = button.getAttribute('data-id');
      borrowItem(itemId, button);
    });
  });
};
const borrowItem = async (itemId, button) => {
  const requestOptions = {
    method: 'PUT'
  };
  const response = await fetch(`/user/borrow/${itemId}`, requestOptions);
  const item = await response.json();
  const user = await getUser();
  const ticket = user.tickets.find(ticket => ticket.item.toString() === itemId);
  const reservedTickets = ticket ? ticket.reservedTickets : 0;
  if (item.capacity - reservedTickets <= 0) {
    button.disabled = true;
    contentDiv.textContent = 'No more place';
    displayItems();
    socket.emit('capacityZero', itemId);
    return;
  }
  contentDiv.textContent = `Spectacle avec id ${itemId} est réservé. `;
  button.parentNode.remove();
  displayItems();
  socket.emit('itemBorrowed', itemId);
};
const releaseItem = async (itemId, button) => {
  const requestOptions = {
    method: 'PUT'
  };
  const response = await fetch(`/user/release/${itemId}`, requestOptions);
  if (!response.ok) {
    throw new Error(`Failed to release item with id ${itemId}.`);
  }
  socket.emit('itemReleased', itemId);
  const item = await response.json();
  const user = await getUser();
  if (!user) {
    console.error('User not found.');
    return;
  }
  const ticket = user.tickets.find(ticket => ticket.item.toString() === itemId);
  const reservedTickets = ticket ? ticket.reservedTickets : 0;
  if (reservedTickets <= 0) {
    console.error('No tickets to release.');
    return;
  }
  contentDiv.textContent = `Spectacle avec id ${itemId} est libéré. `;
  const listItem = borrowedItemDiv.querySelector(`li[data-id=\"${itemId}\"]`);
  if (reservedTickets - 1 <= 0) {
    listItem.remove();
  } else {
    listItem.innerHTML = `${item.description || 'Description non disponible'} : ${reservedTickets - 1} places <button class=\"release\" data-id=\"${item._id}\">Annuler la réservation</button>`;
    const releaseButton = listItem.querySelector('.release');
    releaseButton.addEventListener('click', async () => {
      await releaseItem(itemId, releaseButton);
    });
  }
  await displayItems();
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
  borrowedItemDiv.innerHTML = '';
  user.tickets.forEach(ticket => {
    let listItem = document.createElement('li');
    listItem.setAttribute('data-id', ticket.item._id);
    listItem.innerHTML = `${ticket.item.description || 'Description non disponible'} : ${ticket.reservedTickets} places <button class="release" data-id="${ticket.item._id}">Annuler la réservation</button>`;
    borrowedItemDiv.appendChild(listItem);
    const releaseButton = listItem.querySelector('.release');
    releaseButton.addEventListener('click', async () => {
      await releaseItem(ticket.item._id, releaseButton);
    });
  });
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
log.addEventListener('click', logout);
getUser();
displayItems();
socket.on('itemDeleted', itemId => {
  contentDiv.textContent = `Spectacle avec id ${itemId} a été supprimé.`;
  borrowedItemDiv.innerHTML = '';
  displayItems();
});
socket.on('itemCreated', itemId => {
  contentDiv.textContent = `Spectacle avec id ${itemId._id} a été créé.`;
  displayItems();
});
socket.on('itemModified', async item => {
  contentDiv.textContent = `Spectacle avec id ${item._id} a été mis à jour.`;
  const user = await getUser();
  const ticket = user.tickets.find(ticket => ticket.item._id === item._id);
  if (ticket) {
    const listItem = borrowedItemDiv.querySelector(`li[data-id=\"${item._id}\"]`);
    listItem.innerHTML = `${item.description || 'Description non disponible'} : ${ticket.reservedTickets} places <button class="release" data-id="${item._id}">Annuler la réservation</button>`;
    const releaseButton = listItem.querySelector('.release');
    releaseButton.addEventListener('click', async () => {
      await releaseItem(item._id, releaseButton);
    });
  }
  displayItems();
});
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
//# sourceMappingURL=user-bundle.js.map