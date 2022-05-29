var categories = [];
var sites = [];
var filteredSites = [];

function getCategories(){
  fetch('https://passsaverapi-alanz.azurewebsites.net/categories')
  .then(response => response.json())
  .then(response => {
    categories = response;

    fillCategoriesTable(categories);
    addRowHandlers();
  });
}

function getSites(){
  fetch('https://passsaverapi-alanz.azurewebsites.net/sites')
  .then(response => response.json())
  .then(response => {
    sites = response;

    fillSitesTable(sites)
  });
}

window.onload = function() {
  console.log('document loaded');
  
  getCategories();

  getSites();

}

function addRowHandlers() {
  var table = document.getElementsByTagName('tbody')[0];
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var textClicked = table.rows[i].getElementsByTagName("a")[0];
    var createClickHandler = 
      function(row) 
      {
        return function() { 
          resetCategoriesTable();
          var cell = row.getElementsByTagName("td")[0];
          cell.style.backgroundColor = 'DarkOrange';
          var categoryName = cell.innerText;
          var categoryId = categories.find(category => category.name === categoryName).id;
          filteredSites = sites.filter(site => site.categoryId === categoryId);
          emptySitesTable();
          fillSitesTable(filteredSites);
        };
      };

      textClicked.onclick = createClickHandler(currentRow);
  }
}


function fillSitesTable(siteList) {
  let tbody = document.getElementsByTagName('tbody')[1];
  for (let site of siteList) {
    let row = document.createElement('tr')
    let nameTD = document.createElement('td')
    let userTD = document.createElement('td')
    let creationTD = document.createElement('td')
    let actionsTD = document.createElement('td')
    nameTD.innerText = site.name + " (" + site.categoryId + ")"
    userTD.innerText = site.username
    creationTD.innerText = site.creationDate
    actionsTD.innerHTML = `<a class='bi bi-search mx-2 text-black' href='http://${site.url}'></a><a class='bi bi-trash-fill text-black' onclick="deleteSite('${site.name}', '${site.username}')"></a><a class='bi bi-pencil mx-2 text-black' href='edit-site.html?siteId=${site.id}'></a>`
    row.appendChild(nameTD)
    row.appendChild(userTD)
    row.appendChild(creationTD)
    row.appendChild(actionsTD)
    tbody.appendChild(row)
  }
}

function fillCategoriesTable(categoryList) {
  let tbody = document.getElementsByTagName('tbody')[0];
  for (let category of categories) {
  let row = document.createElement('tr')

  let nameTD = document.createElement('td')

  nameTD.innerHTML = `<button class="bi bi-trash-fill me-2 btn btn-outline-danger" id="${category.name}" onclick="deleteCategory('${category.name}')"></button><a>${category.name}</a>`
  nameTD.classList.add("px-5")
  nameTD.classList.add("fs-4")
  console.log(category.name)
  row.appendChild(nameTD)
  tbody.appendChild(row)
  }
}

function emptySitesTable() {
  let rows = document.querySelectorAll('#siteList tbody tr');   
  Array.prototype.forEach.call( rows, function( node ) {
    node.parentNode.removeChild( node );
  });
}

function emptyCategoriesTable() {
  let rows = document.querySelectorAll('#categoryList tbody tr');   
  Array.prototype.forEach.call( rows, function( node ) {
    node.parentNode.removeChild( node );
  });
}

function resetCategoriesTable() {
  let table = document.getElementsByTagName('tbody')[0];
  let rows = table.getElementsByTagName("tr");
  var cell;   
  for (let i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    cell = currentRow.getElementsByTagName("td")[0];
    cell.style.backgroundColor = null;
  }
}

function addCategory() {
  let newCategoryName = document.getElementById("categoryName");

  if (newCategoryName.value === ""){ return alert("Category name field can't be empty") }

  let newCategory = {
    name: newCategoryName.value
  }
  let catExists = categories.find(category => category.name === newCategoryName.value)
  if (catExists) {
    alert("There is another category with that name. Use a different one.")
  } else {
    fetch('https://passsaverapi-alanz.azurewebsites.net/categories', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newCategory)
    })
      .then(response => response.json())    
      .then(response => {

        emptyCategoriesTable();
        categories.push(response);
        fillCategoriesTable();
        addRowHandlers();

      })    
  }
}

function deleteCategory(categoryToDelete) {
  let categoryId = categories.find(category => category.name === categoryToDelete).id;
  fetch(`https://passsaverapi-alanz.azurewebsites.net/categories/${categoryId}`, {
    method: 'DELETE'
  })
    .then(() => {
      categories = categories.filter(category => category.id !== categoryId);
      sites = sites.filter(site => site.categoryId !== categoryId);

      emptyCategoriesTable();
      emptySitesTable();
      fillCategoriesTable(categories);
      fillSitesTable(sites);

      addRowHandlers();
    }
    );
}

function deleteSite(siteToDelete, userSite) {
  let siteId = sites.find(site => site.name === siteToDelete && site.username === userSite).id;
  fetch(`https://passsaverapi-alanz.azurewebsites.net/sites/${siteId}`, {
    method: 'DELETE'
  })
    .then(() => {
      sites = sites.filter(site => site.id !== siteId);

      emptySitesTable();
      fillSitesTable(sites);
    }
    );
}

let addCatButton = document.getElementById("addCategory");

addCatButton.addEventListener("click", function() {
  let categoryForm = document.getElementById("categoryForm");
  if (categoryForm.classList.contains("d-none")) {
    categoryForm.classList.remove("d-none");
  } else {
    categoryForm.classList.add("d-none");
  }
  
})



