import { recipes } from '../data/recipes.js';
import { SelectorTemplate } from './template/selectorTemplate.js';
import { formatString } from './utils.js';
import RecipeTemplate from './template/RecipeTemplate.js';
import RecipeModel from './models/RecipeModel.js';

let selectedTags = [];

// function pour initialiser les selectors
function initializeSelectors() {
    // créer des sets pour stocker les valeurs des selectors et éviter les doublons
    const listIngredients = new Set();
    const listUstensils = new Set();
    const listAppliances = new Set();

    // parcourir les recettes pour ajouter les valeurs des selectors au set
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(item => listIngredients.add(formatString(item.ingredient)));
        recipe.ustensils.forEach(item => listUstensils.add(formatString(item)));
        listAppliances.add(formatString(recipe.appliance));
    });

    // convertir les sets en tableaux triés
    const sortedIngredients = [...listIngredients].sort();
    const sortedUstensils = [...listUstensils].sort();
    const sortedAppliances = [...listAppliances].sort();

    // créer les selectors
    const ingredientSelector = new SelectorTemplate(sortedIngredients, 'Ingrédients');
    const ustensilSelector = new SelectorTemplate(sortedUstensils, 'Ustensiles');
    const applianceSelector = new SelectorTemplate(sortedAppliances, 'Appareils');

    // générer les selectors
    ingredientSelector.generate();
    ustensilSelector.generate();
    applianceSelector.generate();

    // retourner les selectors  
    return { ingredientSelector, ustensilSelector, applianceSelector };
}
// appeler la fonction pour initialiser les selectors
const { ingredientSelector, ustensilSelector, applianceSelector } = initializeSelectors();

// function pour filtrer les recettes par tags
function filterRecipesByTags(tags) {
    // filtrer les recettes par tags
    const filteredRecipes = recipes.filter(recipe => {
        // vérifier si chaque tag correspond à un ingrédient, un ustensil ou un appareil
        return tags.every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === tag.toLowerCase()) ||
            recipe.ustensils.some(ustensil => ustensil.toLowerCase() === tag.toLowerCase()) ||
            recipe.appliance.toLowerCase() === tag.toLowerCase()
        );
    });

    // mettre à jour les selectors
    updateSelectors(filteredRecipes);
    
    // retourner les recettes filtrées
    return filteredRecipes;
}

// function pour mettre à jour les selectors
function updateSelectors(filteredRecipes) {
    // créer des sets pour stocker les nouvelles valeurs des selectors et éviter les doublons
    const newIngredients = new Set();
    const newUstensils = new Set();
    const newAppliances = new Set();

    // parcourir les recettes filtrées pour ajouter les nouvelles valeurs des selectors au set
    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(item => newIngredients.add(formatString(item.ingredient)));
        recipe.ustensils.forEach(item => newUstensils.add(formatString(item)));
        newAppliances.add(formatString(recipe.appliance));
    });

    // mettre à jour les selectors
    ingredientSelector.updateData([...newIngredients].sort());
    ustensilSelector.updateData([...newUstensils].sort());
    applianceSelector.updateData([...newAppliances].sort());
}

// écouter l'événement custom tagAdded
document.addEventListener('tagAdded', (event) => {
    // récupérer les tags
    const tags = event.detail.tags;
    
    // ajouter les tags à selectedTags en évitant les doublons
    selectedTags = [...new Set([...selectedTags, ...tags])];
    
    // filtrer les recettes par tags
    const filteredRecipes = filterRecipesByTags(selectedTags);
    
    // afficher les recettes filtrées
    displayRecipes(filteredRecipes);
});

document.addEventListener('tagRemoved', (event) => {
    // récupérer les tags
    const tags = event.detail.tags;
    console.log(tags)

    // Filtrer les tags à supprimer
    const uniqueTags = [...new Set(tags)];
    selectedTags = selectedTags.filter(tag => !uniqueTags.includes(tag));

    // Filtrer et afficher les recettes
    const filteredRecipes = filterRecipesByTags(selectedTags);
    displayRecipes(filteredRecipes);
});

// function pour vider le conteneur des recettes
function clearRecipes() {
    const recipeContainer = document.querySelector('.recipes');
    recipeContainer.innerHTML = '';
}

// function pour afficher les recettes
function displayRecipes(recipes) {
    // vider le conteneur des recettes
    clearRecipes();
    // sélectionner le conteneur des recettes
    const recipeContainer = document.querySelector('.recipes');

    // vérifier si il n'y a pas de recette  
    if (recipes.length === 0) {
        // créer un élément h3 pour afficher un message
        const noRecipeMessage = document.createElement('h3');
        noRecipeMessage.textContent = 'Aucune recette trouvée';
        recipeContainer.appendChild(noRecipeMessage);
    }

    // parcourir les recettes pour afficher les recettes    
    recipes.forEach(recipe => {
        // créer un nouveau modèle de recette
        const recipeModel = new RecipeModel(recipe);
        const recipeTemplate = new RecipeTemplate(recipeModel);
        const recipeElement = recipeTemplate.generate();
        recipeContainer.appendChild(recipeElement);
    });
    const recipeNumber = document.querySelector('.recipe-number');
    
    if (recipes.length === 1) {
        recipeNumber.textContent = `${recipes.length} recette`;
    } else {
        recipeNumber.textContent = `${recipes.length} recettes`;
    }
}

// function pour initialiser l'application
function init() {
    displayRecipes(recipes);
}

init();