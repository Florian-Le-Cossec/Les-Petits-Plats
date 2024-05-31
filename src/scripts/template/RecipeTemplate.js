import Ingredient from '../models/IngredientModel.js';

export default class RecipeTemplate {
	constructor(recipe) {
		this.recipe = recipe;
	}
	
	generate() {
		const recipesContainer = document.querySelector('.recipes');
		const ingredients = this.recipe.ingredients.map((ingredient) => {
			return new Ingredient(ingredient.ingredient, ingredient.quantity, ingredient.unit);
		});


		const recipeHtml = 
		/*html*/
		`
			<article class="recipe rounded-xl bg-white min-h-[740px]">
				<img class="rounded-t-xl w-full h-[250px] object-cover" src="/src/assets/img/recipes/${this.recipe.image}" alt="${this.recipe.name}">
				<div class="p-6 pb-0 mt-2">
					<h2 class="font-title text-lg leading-normal">${this.recipe.name}</h2>
					<h3 class="text-grey text-xs font-bold uppercase tracking-[1.08px] mt-7 mb-3.5">Recette</h3>
					<p class="text-dark text-sm line-clamp-4">${this.recipe.description}</p>
					<h3 class="text-grey text-xs font-bold uppercase tracking-[1.08px] mt-7 mb-3.5">Ingrédients</h3>
					<ul class="text-dark text-sm grid grid-cols-2 gap-x-6">
						${ingredients.map((ingredient) =>
							/*html*/
							`
								<li class="flex flex-col mb-5 last:mb-0 [&:nth-last-child(2)]:mb-0">
									<span class="text-dark">${ingredient.name}</span>
									${
										ingredient.unit.length > 4 ? 
											`<span class="text-grey">${ingredient.quantity} ${ingredient.unit}</span>` 
										: 
											`<span class="text-grey">${ingredient.quantity}${ingredient.unit}</span>`
									}
								</li>
							`
						).join('')}
					</ul>
				</div>
			</article>
		`;

		const linkElement = document.createElement('a');
		linkElement.href = `#`;
		linkElement.innerHTML = recipeHtml;
		linkElement.addEventListener('click', (e) => {
			e.preventDefault();
		});
		
		recipesContainer.appendChild(linkElement);
	}
}
