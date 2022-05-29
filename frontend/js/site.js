var categories = [];
var sites = [];



function getCategories(){
  fetch('http://passsaverapi-alanz.azurewebsites.net/categories')
  .then(response => response.json())
  .then(response => {
    categories = response;

    fillSelect();
  });
}

function getSites(){
  fetch('http://passsaverapi-alanz.azurewebsites.net/sites')
  .then(response => response.json())
  .then(response => {
    sites = response;
  });
}

window.onload = function() {
  console.log('document loaded');
  
  getCategories();

  getSites();

}

function fillSelect() {
  let select = document.getElementById("siteCategory");

  for (let category of categories) {
    let option = document.createElement('option');

    option.setAttribute('value', `${category.id}`);
    option.innerText = category.name;
    select.appendChild(option);
  }
}

function addSite() {
  let newSiteUrl = document.getElementById("siteUrl");
  let newSiteName = document.getElementById("siteName");
  let newSiteUser = document.getElementById("siteUser");
  let newSitePassword = document.getElementById("sitePassword");
  let newSiteCategory = document.getElementById("siteCategory");
  let newSiteDescription = document.getElementById("siteDescription");

  if (newSiteUrl.value === ""){ return alert("Category URL field can't be empty") }
  if (newSiteName.value === ""){ return alert("Category name field can't be empty") }
  if (newSiteUser.value === ""){ return alert("Category username field can't be empty") }
  if (newSitePassword.value === ""){ return alert("Category password field can't be empty") }
  if (newSiteCategory.value === "Select category"){ return alert("Select a category") }

  let newSite = {
    name: newSiteName.value,
    url: newSiteUrl.value,
    username: newSiteUser.value,
    password: newSitePassword.value,
    creationDate: '',
    description: newSiteDescription.value,
    categoryId: newSiteCategory.value
  }

  let siteExists = sites.find(site => site.url === newSiteUrl.value && site.username === newSiteUser.value)
  if (siteExists) {
    alert("This username is already registered for this URL")
  } else {
    fetch('http://passsaverapi-alanz.azurewebsites.net/sites', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newSite)
    })
      .then(response => response.json())
      .then(() => {
        setTimeout('', 5000);
        window.location.href = 'index.html';
      })
  }
}

var passwordInput = document.getElementById("sitePassword");
var generatePass = document.getElementById("generatePass");
var showPass = document.getElementById("showPass");

generatePass.addEventListener("click", function() {
  passwordInput.value = Math.random().toString(36).slice(-12);
})

showPass.addEventListener("click", function() {
  if (passwordInput.getAttribute("type")==="password"){
    passwordInput.setAttribute("type", "text")
  } else {
    passwordInput.setAttribute("type", "password")
  }
})
  
