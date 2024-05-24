import { recipes } from '../data/recipes.js';
import { SelectorTemplate } from './template/selectorTemplate.js';

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

function displaySelector(data, type) {
	const selectorTemplate = new SelectorTemplate(data, type);
	selectorTemplate.generate();
	selectorTemplate.handleClearInput();
}

function init() {
	displaySelector(listIngredients.sort(), 'Ingredients');
	displaySelector(listUstensils.sort(), 'Ustensils');
	displaySelector(listAppliances.sort(), 'Appliances');
}

init();

