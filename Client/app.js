const URL = "http://localhost:7015/api/songs";
const apiUrl = "http://localhost:5248/api/songs";



// Add an event listener to the form to handle adding new songs
const form = document.getElementById('add-song-form');
form.addEventListener('submit', addSong);

// Fetch the list of songs when the page loads
getSongs();

function addSong(event) {
  event.preventDefault();

  // Get the values of the form inputs
  const name = document.getElementById('name').value;
  const author = document.getElementById('author').value;

  // Create a new song object
  const song = {
    name: name,
    author: author,
    dateAdded: new Date().toISOString(),
    favorited: false,
    deleted: false
  };

  // Make a POST request to the API to add the new song
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(song)
  })
  .then(response => response.json())
  .then(data => {
    // Add the new song to the table
    const tableBody = document.querySelector('#songs-table tbody');
    const newRow = createRow(data);
    tableBody.appendChild(newRow);

    // Clear the form inputs
    form.reset();
  })
  .catch(error => console.error(error));
}

function getSongs() {
  // Fetch the list of songs from the API
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Add each song to the table
    const tableBody = document.querySelector('#songs-table tbody');
    data.forEach(song => {
      const newRow = createRow(song);
      tableBody.appendChild(newRow);
    });
  })
  .catch(error => console.error(error));
}

function createRow(song) {
  // Create a new row in the table for the song
  const row = document.createElement('tr');
  row.dataset.id = song.id;

  // Add the song's name and author to the row
  const nameCell = document.createElement('td');
  nameCell.textContent = song.name;
  row.appendChild(nameCell);

  const authorCell = document.createElement('td');
  authorCell.textContent = song.author;
  row.appendChild(authorCell);

  // Add the date added to the row
  const dateAddedCell = document.createElement('td');
  const dateAdded = new Date(song.dateAdded).toLocaleDateString();
  dateAddedCell.textContent = dateAdded;
  row.appendChild(dateAddedCell);

  // Add a button to favorite the song
  const favoriteCell = document.createElement('td');
  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = song.favorited ? 'Unfavorite' : 'Favorite';
  favoriteButton.addEventListener('click', toggleFavorite);
  favoriteCell.appendChild(favoriteButton);
  row.appendChild(favoriteCell);

  // Add a button to delete the song
  const deleteCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', deleteSong);
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  return row;
}

function toggleFavorite(event) {
  const row = event.target.closest('tr');
  const id = row.dataset.id;

  // Toggle the song's favorited status and update the button text
  const favoriteButton = row.querySelector('button');
  const isFavorited = favoriteButton.textContent === 'Unfavorite';
  favoriteButton.textContent = isFavorited? 'Favorite' : 'Unfavorite';

  // Make a PUT request to update the song's favorited status           Problem???
  const url = "${apiUrl}/${id}/favorite";
  fetch(url, {
  method: 'PUT'
  })
  .catch(error => console.error(error));
  }
  
  function deleteSong(event) {
  const row = event.target.closest('tr');
  const id = row.dataset.id;
  
  // Make a DELETE request to remove the song               Problem???
  const url = "${apiUrl}/${id}";
  fetch(url, {
  method: 'DELETE'
  })
  .then(response => {
  // Remove the row from the table if the song was deleted successfully
  if (response.ok) {
  row.remove();
  }
  })
  .catch(error => console.error(error));
  }
// -----------------------------------------------------------------------------------------

// const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.querySelector('#song-name').value;
  const author = document.querySelector('#song-author').value;
  const dateAdded = document.querySelector('#song-date-added').value;

  const response = await fetch('/api/songs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      author,
      dateAdded,
      favorited: false,
      deleted: false
    })
  });

  if (response.ok) {
    const song = await response.json();
    addSongToTable(song);
    form.reset();
  } else {
    displayError('Failed to add song');
  }
});

function addSongToTable(song) {
  const table = document.querySelector('table tbody');

  const row = document.createElement('tr');
  row.dataset.id = song.id;

  const nameCell = document.createElement('td');
  nameCell.textContent = song.name;
  row.appendChild(nameCell);

  const authorCell = document.createElement('td');
  authorCell.textContent = song.author;
  row.appendChild(authorCell);

  const dateAddedCell = document.createElement('td');
  dateAddedCell.textContent = song.dateAdded;
  row.appendChild(dateAddedCell);

  const favoriteCell = document.createElement('td');
  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = 'Favorite';
  favoriteButton.classList.toggle('favorite', song.favorited);
  favoriteButton.addEventListener('click', async () => {
    const response = await fetch(`/api/songs/${song.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        favorited: !song.favorited
      })
    });

    if (response.ok) {
      song.favorited = !song.favorited;
      favoriteButton.classList.toggle('favorite', song.favorited);
    } else {
      displayError('Failed to update favorite status');
    }
  });
  favoriteCell.appendChild(favoriteButton);
  row.appendChild(favoriteCell);

  const deleteCell = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete');
  deleteButton.addEventListener('click', async () => {
    const confirmed = confirm('Are you sure you want to delete this song?');

    if (confirmed) {
      const response = await fetch(`/api/songs/${song.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        table.removeChild(row);
      } else {
        displayError('Failed to delete song');
      }
    }
  });
  deleteCell.appendChild(deleteButton);
  row.appendChild(table);

  table.appendChild(row);
  }
