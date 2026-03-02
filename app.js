// =======================
// RECIPE DATA
// =======================

const recipes = [

  {
    title: "Spaghetti",
    difficulty: "easy",
    time: 20,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    ingredients: ["Pasta","Tomato sauce","Cheese"],
    steps: [
      "Boil water",
      "Cook pasta",
      "Add sauce",
      "Serve hot"
    ]
  },

  {
    title: "Chicken Curry",
    difficulty: "medium",
    time: 45,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400",
    ingredients: ["Chicken","Onion","Spices"],
    steps: [
      "Heat oil",
      {
        text: "Prepare masala",
        substeps: [
          "Add onion",
          "Add spices"
        ]
      },
      "Add chicken",
      "Cook well"
    ]
  },

  {
    title: "Beef Steak",
    difficulty: "hard",
    time: 60,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400",
    ingredients: ["Beef","Salt","Pepper"],
    steps: ["Season beef","Cook steak","Rest and serve"]
  },

  {
    title: "Salad",
    difficulty: "easy",
    time: 10,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    ingredients: ["Lettuce","Tomato","Cucumber"],
    steps: ["Chop vegetables","Mix","Serve"]
  },

  {
    title: "Pancakes",
    difficulty: "easy",
    time: 15,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400",
    ingredients: ["Flour","Milk","Egg"],
    steps: ["Mix batter","Heat pan","Flip pancake"]
  },

  {
    title: "Biryani",
    difficulty: "hard",
    time: 90,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400",
    ingredients: ["Rice","Chicken","Spices"],
    steps: ["Cook rice","Prepare gravy","Layer and cook"]
  },

  {
    title: "Fried Rice",
    difficulty: "medium",
    time: 30,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
    ingredients: ["Rice","Vegetables","Soy sauce"],
    steps: ["Cook rice","Add vegetables","Mix and fry"]
  },

  {
    title: "Soup",
    difficulty: "easy",
    time: 25,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    ingredients: ["Water","Vegetables","Salt"],
    steps: ["Boil water","Add vegetables","Simmer"]
  }

];


// =======================
// STATE
// =======================

let currentFilter = "all";
let currentSort = "none";


// =======================
// DOM
// =======================

const recipeContainer = document.getElementById("recipe-container");
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");


// =======================
// RECURSIVE STEPS RENDER
// =======================

const renderSteps = (steps) => {
  let html = "<ol>";

  steps.forEach(step => {

    if(typeof step === "string"){
      html += `<li>${step}</li>`;
    } else {
      html += `<li>${step.text}`;
      html += renderSteps(step.substeps);
      html += `</li>`;
    }

  });

  html += "</ol>";
  return html;
};


// =======================
// CREATE CARD
// =======================

const createRecipeCard = (recipe) => {

  return `
    <div class="recipe-card">

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
// FILTER & SORT
// =======================

const applyFilter = (recipesList, filter) => {

  switch(filter){
    case "easy": return recipesList.filter(r => r.difficulty === "easy");
    case "medium": return recipesList.filter(r => r.difficulty === "medium");
    case "hard": return recipesList.filter(r => r.difficulty === "hard");
    case "quick": return recipesList.filter(r => r.time <= 30);
    default: return recipesList;
  }

};

const applySort = (recipesList, sort) => {

  switch(sort){
    case "name":
      return [...recipesList].sort((a,b)=>a.title.localeCompare(b.title));
    case "time":
      return [...recipesList].sort((a,b)=>a.time - b.time);
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

  recipeContainer.innerHTML = result.map(createRecipeCard).join("");

};


// =======================
// TOGGLE (Event Delegation)
// =======================

recipeContainer.addEventListener("click", (e)=>{

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


// =======================
// BUTTON EVENTS
// =======================

filterButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    currentFilter = btn.dataset.filter;
    updateDisplay();
  });
});

sortButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    currentSort = btn.dataset.sort;
    updateDisplay();
  });
});


// =======================
// INITIAL LOAD
// =======================

updateDisplay();