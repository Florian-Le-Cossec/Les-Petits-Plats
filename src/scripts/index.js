import { recipes } from '../data/recipes.js';
import { SelectorTemplate } from './template/SelectorTemplate.js';
import { formatString, clearSearchInput, mainSearch, sanitizeInput } from './utils.js';
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
function filterRecipes(query, tags) {
    // Utiliser mainSearch pour filtrer les recettes par la recherche principale
    const mainSearchResults = mainSearch(query, recipes);

    // Filtrer les résultats de mainSearch par tags
    const filteredRecipes = mainSearchResults.filter(recipe => {
        return tags.every(tag => 
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === tag.toLowerCase()) ||
            recipe.ustensils.some(ustensil => ustensil.toLowerCase() === tag.toLowerCase()) ||
            recipe.appliance.toLowerCase() === tag.toLowerCase()
        );
    });

    // Mettre à jour les selectors
    updateSelectors(filteredRecipes);
    
    // Retourner les recettes filtrées
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
    // filtrer les recettes par tags et recherche principale
    const query = sanitizeInput(document.querySelector('.main-search').value.trim());
    const filteredRecipes = filterRecipes(query, selectedTags);
    
    // afficher les recettes filtrées
    displayRecipes(filteredRecipes);
    
    // afficher les recettes filtrées
    displayRecipes(filteredRecipes);
});

document.addEventListener('tagRemoved', (event) => {
    // récupérer les tags
    const tags = event.detail.tags;

    // Filtrer les tags à supprimer
    const uniqueTags = [...new Set(tags)];
    selectedTags = selectedTags.filter(tag => !uniqueTags.includes(tag));

    // Filtrer les recettes par tags et recherche principale
    const query = sanitizeInput(document.querySelector('.main-search').value.trim().toLowerCase());
    const filteredRecipes = filterRecipes(query, selectedTags);
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
        // vérifier si le message existe déjà
        let noRecipeMessage = document.querySelector('.no-recipe-message');
        if (!noRecipeMessage) {
            // créer un élément h3 pour afficher un message
            noRecipeMessage = document.createElement('h3');
            noRecipeMessage.classList.add('no-recipe-message', 'mt-10', 'text-xl');
            const searchInputValue = document.querySelector('.main-search').value;
            noRecipeMessage.textContent = `Aucune recette ne contient "${searchInputValue}". Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
            // insérer le message avant le conteneur des recettes
            recipeContainer.parentNode.insertBefore(noRecipeMessage, recipeContainer);
        } else {
            // mettre à jour le message existant
            const searchInputValue = document.querySelector('.main-search').value;
            noRecipeMessage.textContent = `Aucune recette ne contient "${searchInputValue}". Vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
        }
    } else {
        // supprimer le message s'il existe
        const noRecipeMessage = document.querySelector('.no-recipe-message');
        if (noRecipeMessage) {
            noRecipeMessage.remove();
        }
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

// Fonction pour gérer la recherche principale
function handleMainSearch(event) {
    const query = sanitizeInput(event.target.value.trim());

    // Ne rien faire si la longueur de la requête est inférieure à 3 caractères et aucun tag n'est sélectionné
    if (query.length < 3 && selectedTags.length === 0) {
        clearRecipes();
        updateSelectors(recipes);
        displayRecipes(recipes);
        return;
    }
    
    // Filtrer les recettes en fonction de la requête et des tags
    const filteredRecipes = filterRecipes(query, selectedTags);
    displayRecipes(filteredRecipes);
}

// sélectionner l'input search
const searchInput = document.querySelector('.main-search');
// Ajouter un écouteur d'événement sur l'input search
searchInput.addEventListener('input', handleMainSearch);


document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner le bouton de suppression et l'input search
    const clearButton = document.querySelector('.clear');
    const searchInput = document.querySelector('.main-search');

     // vérifie si le bouton de suppression est display
    clearButton.style.display = searchInput.value ? 'block' : 'none';

    // Écouteur d'événement pour effacer l'input search
    clearButton.addEventListener('click', () => {
        clearSearchInput();
        clearButton.style.display = 'none';
        // Réinitialiser les recettes et les selectors
        clearRecipes();
        updateSelectors(recipes);
        displayRecipes(recipes);
    });

    // Écouteur d'événement pour toggle le btn suppression
    searchInput.addEventListener('input', () => {
        clearButton.style.display = searchInput.value ? 'block' : 'none';
    });
});

// function pour initialiser l'application
function init() {
    displayRecipes(recipes);
}

init();
