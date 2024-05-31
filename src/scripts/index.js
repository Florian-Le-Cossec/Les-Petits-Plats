import { recipes } from '../data/recipes.js';
import { SelectorTemplate } from './template/selectorTemplate.js';
import RecipeTemplate from './template/RecipeTemplate.js';
import RecipeModel from './models/RecipeModel.js';

const listIngredients = [];
const listUstensils = [];
const listAppliances = [];

recipes.forEach(recipe => {
    recipe.ingredients.forEach(item => {
        const formattedIngredient = item.ingredient.charAt(0).toUpperCase() + item.ingredient.slice(1).toLowerCase();
        if (!listIngredients.includes(formattedIngredient)) {
            listIngredients.push(formattedIngredient);
        }
    });
});

recipes.forEach(recipe => {
    recipe.ustensils.forEach(item => {
		const formattedUstensil = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        if (!listUstensils.includes(formattedUstensil)) {
            listUstensils.push(formattedUstensil);
        }
    });
});

recipes.forEach(recipe => {
	const formattedAppliance = recipe.appliance.charAt(0).toUpperCase() + recipe.appliance.slice(1).toLowerCase();
    if (!listAppliances.includes(formattedAppliance)) {
        listAppliances.push(formattedAppliance);
    }
});

function displayRecipes(recipes) {
	recipes
        .map(recipe => new RecipeModel(recipe))
        .forEach(recipe => {
            const recipeTemplate = new RecipeTemplate(recipe);
            recipeTemplate.generate();
        });

}

function displaySelector(data, type) {
	const selectorTemplate = new SelectorTemplate(data, type);
	selectorTemplate.generate();
	selectorTemplate.handleClearInput();
}

function init() {
	displaySelector(listIngredients.sort(), 'Ingrédients');
	displaySelector(listAppliances.sort(), 'Appareils');
	displaySelector(listUstensils.sort(), 'Ustensiles');
    displayRecipes(recipes);
}

init();

