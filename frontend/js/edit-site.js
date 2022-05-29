var categories = [];
var sites = [];
var siteToModify;
var newSiteUrl = document.getElementById("siteUrl");
var newSiteName = document.getElementById("siteName");
var newSiteUser = document.getElementById("siteUser");
var newSitePassword = document.getElementById("sitePassword");
var newSiteCategory = document.getElementById("siteCategory");
var newSiteDescription = document.getElementById("siteDescription");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const siteId = urlParams.get('siteId')

window.onload = function () {
    console.log("hola")
    getCategories();
    getSites();
    getSite();

}

function getSite(){

    fetch(`http://passsaverapi-alanz.azurewebsites.net/sites/${siteId}`)
    .then(response => response.json())
    .then(response => {
        siteToModify = response;

        newSiteUrl.value = siteToModify.url;
        newSiteName.value = siteToModify.name;
        newSiteUser.value = siteToModify.username;
        newSitePassword.value = siteToModify.password;
        newSiteCategory.value = siteToModify.categoryId;
        newSiteDescription.value = siteToModify.description;
        console.log(categories)
    });
}

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

function fillSelect() {
    let select = document.getElementById("siteCategory");
  
    for (let category of categories) {
      let option = document.createElement('option');
  
      option.setAttribute('value', `${category.id}`);
      option.innerText = category.name;
      select.appendChild(option);
    }
  }

function modifySite() {
  
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
      creationDate: siteToModify.creationDate,
      description: newSiteDescription.value,
      categoryId: newSiteCategory.value
    }
    
    sites = sites.filter(site => site.id !== siteId);
    let siteExists = sites.find(site => site.url === newSiteUrl.value && site.username === newSiteUser.value)
    if (siteExists) {
      alert("This username is already registered for this URL")
    } else {
      fetch(`http://passsaverapi-alanz.azurewebsites.net/sites/${siteId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(newSite)
      })
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
