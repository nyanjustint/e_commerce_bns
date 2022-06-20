/**
* Frontend.js
* For this page, we have the function for executing a search and sort. We also have a 
* function to determine what page the user is on and highlight the tab as active. 
* 
* Executing a search and sort:
* For search, we determine what the user has inputted in the search bar and direct them to the route 
* with the search results. There are 4 types of routes for search. Case 1 shows all results 
* that exists in the database (that are approved). Case 2 shows results within a specific 
* category (e.g. Books). Case 3 shows results depending what was inputted into the search 
* input box only. Case 4 shows results depending on what was selected in the dropdown menu 
* (category) and what was inputted in the search input box. For sorting, it does the same thing as
* search in terms of routing. The user can sort by Price: Low to High or Price: High to Low.
*/

function executeSearch() {
    let searchTerm = document.getElementById('search-text').value;
    let categoryTerm = document.getElementById('search-category').value;

    /**
    * Render the search result to results page based on the following conditions:
    *
    * case 1: both drop down and search are empty (search term defaults to empty string)
    * case 2: drop down is selected only
    * case 3: search input box is only inputted (haystack)
    * case 4: drop down is selected and search input box has input
    */

    if (categoryTerm == "" && !searchTerm) {
        // case 1
        location.replace('/explore/all/recent');
    } else if (categoryTerm && !searchTerm) {
        // case 2
        location.replace(`/explore/category=${categoryTerm}/recent`);
    } else if (!categoryTerm && searchTerm) {
        // case 3
        location.replace(`/search/term=${searchTerm}/recent`);
    } else {
        // case 4
        location.replace(`/search/category=${categoryTerm}/${searchTerm}/recent`);
    }
}

function executeSort() {
    let sortTerm = document.getElementById('select-sort').value;
    let searchTerm = document.getElementById('search-text').value;
    let categoryTerm = document.getElementById('search-category').value;

    if (categoryTerm == "" && !searchTerm) {
        // case 1
        location.replace(`/explore/all/${sortTerm}`);
    } else if (categoryTerm && !searchTerm) {
        // case 2
        location.replace(`/explore/category=${categoryTerm}/${sortTerm}`);
    } else if (!categoryTerm && searchTerm) {
        // case 3
        location.replace(`/search/term=${searchTerm}/${sortTerm}`);
    } else {
        // case 4
        location.replace(`/search/category=${categoryTerm}/${searchTerm}/${sortTerm}`);
    }
}

// When the user clicks search, executeSearch() function is executed.
let searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.onclick = executeSearch;
}

// When the user selects an option from the sort dropdown menu, executeSort() function is executed.
let sortButton = document.getElementById('select-sort');
if (sortButton) {
    sortButton.onchange = executeSort;
}

// Obtain the user's location (on the site) so we could highlight and set the nav tab as "active"
const currentLocation = location.href;
const link = document.querySelectorAll('a');

for (let i = 0; i < link.length; i++) {
    if (link[i].href === currentLocation && window.location.pathname !== "/") {
        link[i].className = "nav-item nav-link active";
    }
}