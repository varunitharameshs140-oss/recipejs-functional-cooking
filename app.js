// =======================
// RECIPE DATA
// =======================

const recipes = [
  {
    id: 1,
    title: "Spaghetti",
    difficulty: "easy",
    time: 20,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    description: "Classic Italian pasta.",
    ingredients: ["Pasta","Tomato sauce","Cheese"],
    steps: ["Boil water","Cook pasta","Add sauce","Serve hot"]
  },
  {
    id: 2,
    title: "Chicken Curry",
    difficulty: "medium",
    time: 45,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
    description: "Spicy Indian curry.",
    ingredients: ["Chicken","Onion","Spices"],
    steps: [
      "Heat oil",
      { text: "Prepare masala", substeps: ["Add onion","Add spices"] },
      "Add chicken",
      "Cook well"
    ]
  },
  {
    id: 3,
    title: "Beef Steak",
    difficulty: "hard",
    time: 60,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
    description: "Juicy grilled steak.",
    ingredients: ["Beef","Salt","Pepper"],
    steps: ["Season beef","Cook steak","Rest and serve"]
  },
  {
    id: 4,
    title: "Salad",
    difficulty: "easy",
    time: 10,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    description: "Fresh vegetable salad.",
    ingredients: ["Lettuce","Tomato","Cucumber"],
    steps: ["Chop vegetables","Mix","Serve"]
  },
  {
    id: 5,
    title: "Pancakes",
    difficulty: "easy",
    time: 15,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400",
    description: "Soft fluffy pancakes.",
    ingredients: ["Flour","Milk","Egg"],
    steps: ["Mix batter","Heat pan","Flip pancake"]
  },
  {
    id: 6,
    title: "Biryani",
    difficulty: "hard",
    time: 90,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400",
    description: "Traditional rice dish.",
    ingredients: ["Rice","Chicken","Spices"],
    steps: ["Cook rice","Prepare gravy","Layer and cook"]
  },
  {
    id: 7,
    title: "Fried Rice",
    difficulty: "medium",
    time: 30,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    description: "Asian style rice.",
    ingredients: ["Rice","Vegetables","Soy sauce"],
    steps: ["Cook rice","Add vegetables","Mix and fry"]
  },
  {
    id: 8,
    title: "Soup",
    difficulty: "easy",
    time: 25,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    description: "Warm comfort soup.",
    ingredients: ["Water","Vegetables","Salt"],
    steps: ["Boil water","Add vegetables","Simmer"]
  }
];

// =======================
// STATE
// =======================

let currentFilter = "all";
let currentSort = "none";
let searchQuery = "";
let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
let debounceTimer;

// =======================
// DOM
// =======================

const recipeContainer = document.getElementById("recipe-container");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const recipeCountDisplay = document.getElementById("recipe-count");

// =======================
// RECURSIVE STEPS
// =======================

const renderSteps = (steps) => {
  let html = "<ol>";
  steps.forEach(step => {
    if(typeof step === "string"){
      html += `<li>${step}</li>`;
    } else {
      html += `<li>${step.text}${renderSteps(step.substeps)}</li>`;
    }
  });
  html += "</ol>";
  return html;
};

// =======================
// CREATE CARD
// =======================

const createRecipeCard = (recipe) => {

  const isFav = favorites.includes(recipe.id);
  const heart = isFav ? "❤️" : "🤍";

  return `
    <div class="recipe-card">

      <button class="favorite-btn" data-id="${recipe.id}">
        ${heart}
      </button>

      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>

      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
      <p><strong>Time:</strong> ${recipe.time} mins</p>

      <button class="toggle-btn" data-type="steps">Show Steps</button>
      <button class="toggle-btn" data-type="ingredients">Show Ingredients</button>

      <div class="steps-container">
        ${renderSteps(recipe.steps)}
      </div>

      <div class="ingredients-container">
        <ul>
          ${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}
        </ul>
      </div>

    </div>
  `;
};

// =======================
// FILTERS
// =======================

const filterBySearch = (list, query) => {
  if(!query) return list;

  const q = query.toLowerCase();

  return list.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.ingredients.some(i => i.toLowerCase().includes(q))
  );
};

const filterFavorites = (list) => {
  return list.filter(r => favorites.includes(r.id));
};

const applyFilter = (list, filter) => {

  switch(filter){
    case "easy": return list.filter(r => r.difficulty === "easy");
    case "medium": return list.filter(r => r.difficulty === "medium");
    case "hard": return list.filter(r => r.difficulty === "hard");
    case "quick": return list.filter(r => r.time <= 30);
    case "favorites": return filterFavorites(list);
    default: return list;
  }

};

const applySort = (list, sort) => {

  switch(sort){
    case "name":
      return [...list].sort((a,b)=>a.title.localeCompare(b.title));
    case "time":
      return [...list].sort((a,b)=>a.time - b.time);
    default:
      return list;
  }

};

// =======================
// UPDATE DISPLAY
// =======================

const updateDisplay = () => {

  let result = [...recipes];

  result = filterBySearch(result, searchQuery);
  result = applyFilter(result, currentFilter);
  result = applySort(result, currentSort);

  recipeContainer.innerHTML = result.map(createRecipeCard).join("");

  if(recipeCountDisplay){
    recipeCountDisplay.textContent =
      `Showing ${result.length} of ${recipes.length} recipes`;
  }

  updateActiveButtons();
};

// =======================
// FAVORITES
// =======================

const saveFavorites = () => {
  localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
};

const toggleFavorite = (id) => {

  const numId = parseInt(id);

  if(favorites.includes(numId)){
    favorites = favorites.filter(f => f !== numId);
  } else {
    favorites.push(numId);
  }

  saveFavorites();
  updateDisplay();
};

// =======================
// EVENTS
// =======================

recipeContainer.addEventListener("click", (e)=>{

  const favBtn = e.target.closest(".favorite-btn");
  if(favBtn){
    toggleFavorite(favBtn.dataset.id);
    return;
  }

  const btn = e.target.closest(".toggle-btn");
  if(!btn) return;

  const card = btn.closest(".recipe-card");
  const type = btn.dataset.type;
  const container = card.querySelector(`.${type}-container`);

  container.classList.toggle("visible");

  btn.textContent =
    container.classList.contains("visible")
      ? `Hide ${type}`
      : `Show ${type}`;
});

// Filter buttons
filterButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    currentFilter = btn.dataset.filter;
    updateDisplay();
  });
});

// Sort buttons
sortButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    currentSort = btn.dataset.sort;
    updateDisplay();
  });
});

// Search
if(searchInput){
  searchInput.addEventListener("input", (e)=>{

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(()=>{
      searchQuery = e.target.value;
      updateDisplay();
    }, 300);

    if(clearSearchBtn){
      clearSearchBtn.style.display = e.target.value ? "block" : "none";
    }

  });
}

// Clear search
if(clearSearchBtn){
  clearSearchBtn.addEventListener("click", ()=>{
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  });
}

// =======================
// INIT
// =======================

updateDisplay();