// Met la première lettre en majuscule et le reste en minuscule
function formatString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Fonction pour effectuer la recherche principale
function mainSearch(query, recipes) {
    // Si la requête est trop courte, retourne un tableau vide
    if (query.length < 3) return [];

    const lowerCaseQuery = query.toLowerCase();
    const filteredRecipes = [];

    for (let recipe of recipes) {
        let match = false;

        // Vérifie le nom de la recette
        if (recipe.name.toLowerCase().includes(lowerCaseQuery)) {
            match = true;
        }

        // Vérifie les ingrédients
        for (let ingredient of recipe.ingredients) {
            if (ingredient.ingredient.toLowerCase().includes(lowerCaseQuery)) {
                match = true;
                break;
            }
        }

        // Vérifie les ustensiles
        for (let ustensil of recipe.ustensils) {
            if (ustensil.toLowerCase().includes(lowerCaseQuery)) {
                match = true;
                break;
            }
        }

        // Vérifie l'appareil
        if (recipe.appliance.toLowerCase().includes(lowerCaseQuery)) {
            match = true;
        }

        // Si une correspondance est trouvée, ajoute la recette filtrée
        if (match) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
}

export { formatString, mainSearch };