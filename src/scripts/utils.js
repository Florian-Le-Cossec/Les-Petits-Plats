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

function mainSearch(query, recipes) {
    const lowerCaseQuery = normalizeString(query);

    return recipes.filter((recipe) => {
        return normalizeString(recipe.name).includes(lowerCaseQuery) ||
            recipe.ingredients.some(ingredient => normalizeString(ingredient.ingredient).includes(lowerCaseQuery)) ||
            recipe.ustensils.some(ustensil => normalizeString(ustensil).includes(lowerCaseQuery)) ||
            normalizeString(recipe.description).includes(lowerCaseQuery) ||
            normalizeString(recipe.appliance).includes(lowerCaseQuery)
    });
}

export { formatString, clearSearchInput, mainSearch };
