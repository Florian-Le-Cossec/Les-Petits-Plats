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
        .toLowerCase(); // mettre en minuscules
}


function sanitizeInput(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mainSearch(query, recipes) {
    const lowerCaseQuery = normalizeString(query);
    // filter les recettes qui contiennent le query dans leur nom, description, appliance, ustensils ou ingredients
    return recipes.filter((recipe) => {
        // vérifie si le nom de la recette contient le query
        return normalizeString(recipe.name).includes(lowerCaseQuery) ||
            // vérifie si l'un des ingrédients de la recette contient la query
            recipe.ingredients.some(ingredient => normalizeString(ingredient.ingredient).includes(lowerCaseQuery)) ||
            // vérifie si l'un des ustensils de la recette contient la query
            recipe.ustensils.some(ustensil => normalizeString(ustensil).includes(lowerCaseQuery)) ||
            // vérifie si la description de la recette contient la query
            normalizeString(recipe.description).includes(lowerCaseQuery) ||
            // vérifie si l'appareil de la recette contient la query
            normalizeString(recipe.appliance).includes(lowerCaseQuery)
    });
}

export { formatString, clearSearchInput, mainSearch, sanitizeInput };
