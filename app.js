// =======================
// RECIPE DATA
// =======================

const recipes = [

  {
    title: "Spaghetti",
    difficulty: "easy",
    time: 20,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"
  },

  {
    title: "Chicken Curry",
    difficulty: "medium",
    time: 45,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400"
  },

  {
    title: "Beef Steak",
    difficulty: "hard",
    time: 60,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400"
  },

  {
    title: "Salad",
    difficulty: "easy",
    time: 10,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
  },

  {
    title: "Pancakes",
    difficulty: "easy",
    time: 15,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400"
  },

  {
    title: "Biryani",
    difficulty: "hard",
    time: 90,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400"
  },

  {
    title: "Fried Rice",
    difficulty: "medium",
    time: 30,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400"
  },

  {
    title: "Soup",
    difficulty: "easy",
    time: 25,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400"
  }

];


// =======================
// STATE
// =======================

let currentFilter = "all";
let currentSort = "none";


// =======================
// DOM ELEMENTS
// =======================

const recipeContainer = document.getElementById("recipe-container");

const filterButtons = document.querySelectorAll("[data-filter]");

const sortButtons = document.querySelectorAll("[data-sort]");


// =======================
// CREATE CARD FUNCTION
// =======================

const createRecipeCard = (recipe) => {

  return `
    <div class="recipe-card">

      <img src="${recipe.image}" alt="${recipe.title}">

      <h3>${recipe.title}</h3>

      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>

      <p><strong>Time:</strong> ${recipe.time} mins</p>

    </div>
  `;

};


// =======================
// RENDER FUNCTION
// =======================

const renderRecipes = (recipesList) => {

  if(recipesList.length === 0){
    recipeContainer.innerHTML = "<h2>No recipes found</h2>";
    return;
  }

  recipeContainer.innerHTML =
    recipesList.map(createRecipeCard).join("");

};


// =======================
// FILTER FUNCTION
// =======================

const applyFilter = (recipesList, filter) => {

  switch(filter){

    case "easy":
      return recipesList.filter(r => r.difficulty === "easy");

    case "medium":
      return recipesList.filter(r => r.difficulty === "medium");

    case "hard":
      return recipesList.filter(r => r.difficulty === "hard");

    case "quick":
      return recipesList.filter(r => r.time <= 30);

    default:
      return recipesList;

  }

};


// =======================
// SORT FUNCTION
// =======================

const applySort = (recipesList, sort) => {

  switch(sort){

    case "name":
      return [...recipesList].sort((a,b)=>
        a.title.localeCompare(b.title)
      );

    case "time":
      return [...recipesList].sort((a,b)=>
        a.time - b.time
      );

    default:
      return recipesList;

  }

};


// =======================
// UPDATE DISPLAY
// =======================

const updateDisplay = () => {

  let result = [...recipes];

  result = applyFilter(result, currentFilter);

  result = applySort(result, currentSort);

  renderRecipes(result);

};


// =======================
// UPDATE ACTIVE BUTTONS
// =======================

const updateActiveButtons = () => {

  filterButtons.forEach(btn => {

    btn.classList.remove("active");

    if(btn.dataset.filter === currentFilter){
      btn.classList.add("active");
    }

  });


  sortButtons.forEach(btn => {

    btn.classList.remove("active");

    if(btn.dataset.sort === currentSort){
      btn.classList.add("active");
    }

  });

};


// =======================
// EVENTS
// =======================

filterButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    currentFilter = btn.dataset.filter;

    updateActiveButtons();

    updateDisplay();

  });

});


sortButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    currentSort = btn.dataset.sort;

    updateActiveButtons();

    updateDisplay();

  });

});


// =======================
// INITIAL LOAD
// =======================

updateDisplay();
updateActiveButtons();
