function formatString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function clearSearchInput() {
    const searchInput = document.querySelector('.main-search');
    searchInput.value = '';
}

function mainSearch(query, recipes) {
    const normalizeString = (str) => 
        str.normalize('NFD')  // normalize 'nfd' permet de décomposer les caractères accentués
           .replace(/[\u0300-\u036f]/g, '') // enlever les diacritiques (accents)
           .replace(/[^a-zA-Z]/g, '') // enlever tout caractère non alphanumérique
           .toLowerCase();

    const lowerCaseQuery = normalizeString(query);
    const filteredRecipes = [];

    for (let recipe of recipes) {
        let match = false;

        // Vérifie le nom de la recette
        if (normalizeString(recipe.name).includes(lowerCaseQuery)) {
            match = true;
        }

        // Vérifie les ingrédients
        for (let ingredient of recipe.ingredients) {
            if (normalizeString(ingredient.ingredient).includes(lowerCaseQuery)) {
                match = true;
                break;
            }
        }

        // Vérifie les ustensiles
        for (let ustensil of recipe.ustensils) {
            if (normalizeString(ustensil).includes(lowerCaseQuery)) {
                match = true;
                break;
            }
        }

        // Vérifie l'appareil
        if (normalizeString(recipe.appliance).includes(lowerCaseQuery)) {
            match = true;
        }

        // Si une correspondance est trouvée, ajoute la recette filtrée
        if (match) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
}

export { formatString, clearSearchInput, mainSearch };
