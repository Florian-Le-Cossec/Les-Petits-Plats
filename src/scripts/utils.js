// Met la première lettre en majuscule et le reste en minuscule
function formatString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function clearSearchInput() {
    const searchInput = document.querySelector('.main-search');
    searchInput.value = '';
}

function normalizeString(str) {
    return str.normalize('NFD')  // normalize 'nfd' permet de décomposer les caractères accentués
           .replace(/[\u0300-\u036f]/g, '') // enlever les diacritiques (accents)
           .replace(/[^a-zA-Z]/g, '') // enlever tout caractère non alphanumérique
           .toLowerCase();
}

function searchInIngredients(query, recipe) {
    for (let j = 0; j < recipe.ingredients.length; j++) {
        let ingredient = recipe.ingredients[j];
        if (normalizeString(ingredient.ingredient).includes(query)) {
            return true;
        }
    }
}

function searchInUstensils(query, recipe) {
    for (let k = 0; k < recipe.ustensils.length; k++) {
        let ustensil = recipe.ustensils[k];
        if (normalizeString(ustensil).includes(query)) {
            return true;
        }
    }
}

// Fonction pour effectuer la recherche principale
function mainSearch(query, recipes) {
    const lowerCaseQuery = normalizeString(query);
    const filteredRecipes = [];

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        // Vérifie le nom de la recette
        if (normalizeString(recipe.name).includes(lowerCaseQuery)) {
            filteredRecipes.push(recipe);
            continue;
        }

        // Vérifie les ingrédients
        if (searchInIngredients(query, recipe)) {
            filteredRecipes.push(recipe);
            continue;
        }

        // Vérifie les ustensiles
        if (searchInUstensils(query, recipe)) {
            filteredRecipes.push(recipe);
            continue;
        }

        // Vérifie la description
        if (normalizeString(recipe.description).includes(lowerCaseQuery)) {
            filteredRecipes.push(recipe);
            continue;
        }

        // Vérifie l'appareil
        if (normalizeString(recipe.appliance).includes(lowerCaseQuery)) {
            filteredRecipes.push(recipe);
            continue;
        }
    }

    return filteredRecipes;
}

export { formatString, clearSearchInput, mainSearch };
