import { sanitizeInput } from '../utils.js'; // Assurez-vous que le chemin est correct

export class SelectorTemplate {
	constructor(data, type) {
		this.data = data;
		this.type = type;
		this.selector = null;
		this.listOfTags = [];
		this.eventsAdded = false;
	}
	// fonction pour générer un selector
	generate() {
		const selectContainer = document.querySelector('.select-container');
		const searchInput = 
		/*html*/
		`
			<div class="relative mx-4 mt-3">
				<input class="search-input w-full pr-12 focus:outline-none border border-lighter-grey text-sm p-2" type="text"></input>
				<div class="flex gap-2 absolute transform -translate-y-1/2 top-1/2 p-2.5 right-0">
					<button class="clear-button hidden">
						<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 17 17" fill="none">
							<path d="M15 15L8.5 8.5M8.5 8.5L2 2M8.5 8.5L15 2M8.5 8.5L2 15" stroke="#7A7A7A" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<button class="search-button">
						<svg class="stroke-dark" width="13" height="14" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="10" cy="10" r="9.5"/>
							<line x1="18.3536" y1="18.6464" x2="27.3536" y2="27.6464"/>
						</svg>
					</button>
				</div>
			</div>
		`;

		const itemList = this.data.map(item => /*html*/ `<li class="flex items-center justify-between py-2 px-4 text-sm hover:bg-yellow cursor-pointer">
		<span>${item}</span>
		<svg class="remove-item-button fill-dark hidden" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
			<circle cx="8.5" cy="8.5" r="8.5"/>
			<path d="M11 11L8.5 8.5M8.5 8.5L6 6M8.5 8.5L11 6M8.5 8.5L6 11" stroke="#FFD15B" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		<!-- le join permet de concaténer les éléments du tableau en une seule chaîne de caractères -->
		</li>`).join('');

		const dropdownList = 
		/*html*/
		`
			${searchInput}
			<ul class="max-h-52 overflow-y-auto mt-4 w-[200px]">
				${itemList}
			</ul>
		`;

		const selectorHtml = 
		/*html*/
		`
			<div class="bg-white border-none p-4 rounded-xl w-[200px] h-min relative">
				<button class="selector__button flex items-center justify-between w-full rounded">
					<span>${this.type}</span>
					<span class="chevron">
						<svg class="transition-transform duration-300" width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M1 1L7.5 7L14 1" stroke="#1B1B1B" stroke-linecap="round"/>
						</svg>
					</span>
				</button>
				<div class="hidden absolute mt-1 h-min bg-white left-0 rounded-b-xl">${dropdownList}</div>
			</div>
		`;
		// la tempDiv est un div temporaire qui contient le selectorHtml
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = selectorHtml;
		// on récupère le premier enfant du div temporaire
		this.selector = tempDiv.firstElementChild;

		// on ajoute un écouteur d'événements au bouton du selector
		this.selector.querySelector('.selector__button').addEventListener('click', function () {
			// ici le this fait référence au bouton du selector donc on sélectionne l'élément immédiatement suivant ce bouton
			const dropdown = this.nextElementSibling;
			const chevron = this.querySelector('.chevron');
			const searchInput = this.parentElement.querySelector('.search-input');
			
			dropdown.classList.toggle('hidden');
			chevron.classList.toggle('rotate-180');
			searchInput.focus();
		});


		selectContainer.appendChild(this.selector);

		this.handleSearch();
		this.handleAddTag();
		this.handleRemoveTagFromList();
		this.handleRemoveTagFromTagList();
		this.handleClearInput();
	}

	updateData(newData) {
		// mettre à jour les données
		this.data = newData;
		const dropdownList = this.selector.querySelector('ul');

		// permet de trier les tags afin d'avoir ceux qui sont selectionnés en premier
		const sortedData = [...this.data].sort((a, b) => {
			const aSelected = this.listOfTags.includes(a);
			const bSelected = this.listOfTags.includes(b);
			if (aSelected && !bSelected) return -1;
			if (!aSelected && bSelected) return 1;
			return a.localeCompare(b);
		});

		const itemList = sortedData.map(item => /*html*/ `<li class="flex items-center justify-between py-2 px-4 text-sm hover:bg-yellow cursor-pointer">
		<span>${item}</span>
		<svg class="remove-item-button fill-dark hidden" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
			<circle cx="8.5" cy="8.5" r="8.5"/>
			<path d="M11 11L8.5 8.5M8.5 8.5L6 6M8.5 8.5L11 6M8.5 8.5L6 11" stroke="#FFD15B" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		</li>`).join('');
		dropdownList.innerHTML = itemList;
		this.handleAddTag();
		this.handleRemoveTagFromList();
		this.handleRemoveTagFromTagList();
		this.applyStyles();
	}

	applyStyles() {
		const dropdownListItems = this.selector.querySelectorAll('ul li');
		dropdownListItems.forEach(item => {
			const itemName = item.querySelector('span').textContent;
			if (this.listOfTags.includes(itemName)) {
				item.classList.add('bg-yellow');
				const removeItemBtn = item.querySelector('.remove-item-button');
				if (removeItemBtn) {
					removeItemBtn.classList.remove('hidden');
				}
			}
		});
	}

	handleClearInput() {
		const searchInput = this.selector.querySelector('.search-input');
		const clearButton = this.selector.querySelector('.clear-button');
		searchInput.addEventListener('input', (e) => {
			if(e.target.value) {
				clearButton.classList.remove('hidden');
			} else {
				clearButton.classList.add('hidden');
			}
		});
		clearButton.addEventListener('click', () => {
			searchInput.value = '';
			searchInput.focus();
			clearButton.classList.add('hidden');

			searchInput.dispatchEvent(new Event('input'));
		});
	}

	handleSearch() {
		const searchInput = this.selector.querySelector('.search-input');
		const dropdownList = this.selector.querySelector('ul');
	
		searchInput.addEventListener('input', () => {
			const query = sanitizeInput(searchInput.value.toLowerCase()); // Sanitize input
			const filteredData = query ? this.data.filter(item => item.toLowerCase().includes(query)) : this.data;
			const itemList = filteredData.map(item => /*html*/ `<li class="flex items-center justify-between py-2 px-4 text-sm hover:bg-yellow cursor-pointer">
			<span>${item}</span>
			<svg class="remove-item-button fill-dark hidden" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
				<circle cx="8.5" cy="8.5" r="8.5"/>
				<path d="M11 11L8.5 8.5M8.5 8.5L6 6M8.5 8.5L11 6M8.5 8.5L6 11" stroke="#FFD15B" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			</li>`).join('');

			dropdownList.innerHTML = itemList;
			this.handleAddTag();
			this.handleRemoveTagFromList();
			this.handleRemoveTagFromTagList();
			this.applyStyles();
		});
	}

	handleAddTag() {
		// on sélectionne tous les éléments de la liste déroulante
		const dropdownListItems = this.selector.querySelectorAll('ul li');
		// on sélectionne l'input de recherche
		const searchInput = this.selector.querySelector('.search-input');
		// on parcourt tous les éléments de la liste déroulante
		dropdownListItems.forEach(item => {
			item.addEventListener('click', (event) => {
				// on stoppe la propagation de l'événement
				event.stopPropagation();
				// on récupère le texte du span de l'élément cliqué
				const selectedItem = item.querySelector('span').textContent;
				const tagList = document.querySelector('.tag-list');
				const existingTags = tagList.querySelectorAll('.tag span:first-child');
				
				// on initialise une variable pour savoir si l'élément est déjà sélectionné
				let isAlreadySelected = false;

				// on parcourt tous les éléments de la liste des tags
				existingTags.forEach(tag => {
					// si l'élément est déjà sélectionné
					if (tag.textContent === selectedItem) {
						isAlreadySelected = true;
					}
				});

				// si l'élément n'est pas déjà sélectionné
				if (!isAlreadySelected) {
					const tag = 
					/*html*/ 
					`
						<div class="tag flex items-center w-[210px] h-[50px] bg-yellow rounded-xl p-4 border-none justify-between">
							<span>${selectedItem}</span>
							<button class="remove-tag-button">
								<svg class="stroke-dark" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17 17" fill="none">
									<path d="M15 15L8.5 8.5M8.5 8.5L2 2M8.5 8.5L15 2M8.5 8.5L2 15" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							</button>
						</div>
					`;
					// on ajoute l'élément à la liste des tags
					this.listOfTags.push(selectedItem);
					// on crée un nouvel événement personnalisé
					const event = new CustomEvent('tagAdded', { detail: { tags: this.listOfTags } });
					// on dispatch l'event pour pouvoir l'écouter depuis l'index.js
					document.dispatchEvent(event);
					// on ajoute l'élément à la liste des tags
					tagList.innerHTML += tag;
					item.classList.add('bg-yellow');
					const removeItemBtn = item.querySelector('.remove-item-button');
					if (removeItemBtn) {
						removeItemBtn.classList.remove('hidden');
					}
					searchInput.value = '';
				}
			});
		});
	}

	handleRemoveTagFromList() {
		// on sélectionne tous les éléments de la liste déroulante
		const dropdownListItems = this.selector.querySelectorAll('ul li');
		// on sélectionne la liste des tags
		const tagListElement = document.querySelector('.tag-list');
		// on parcourt tous les éléments de la liste déroulante
		dropdownListItems.forEach(item => {
			// on sélectionne le bouton de suppression de l'élément
			const svgItem = item.querySelector('.remove-item-button');
			svgItem.addEventListener('click', (event) => {
				event.stopPropagation();
				// on récupère le texte du span de l'élément cliqué
				const tagName = item.querySelector('span').textContent;
				// on sélectionne tous les éléments de la liste des tags
				const existingTags = tagListElement.querySelectorAll('.tag');
				// on parcourt tous les éléments de la liste des tags
				existingTags.forEach(tag => {
					const span = tag.querySelector('span:first-child');
					// si l'élément est déjà sélectionné
					if (span.textContent === tagName) {
						// on retire l'élément de la liste des tags
						tag.remove();
						this.listOfTags = this.listOfTags.filter(tag => tag !== tagName);
						// on dispatch l'event pour pouvoir l'écouter depuis l'index.js
						const newEvent = new CustomEvent('tagRemoved', { detail: { tags: [tagName] } });
						document.dispatchEvent(newEvent);
					}
				});
				// on cache le bouton de suppression de l'élément
				svgItem.classList.add('hidden');
				// on retire la classe bg-yellow de l'élément
				item.classList.remove('bg-yellow');
			});
		});
	}

	handleRemoveTagFromTagList() {
		// flag pour éviter d'ajouter plusieurs fois les événements on ajoute un flag
		if (this.eventsAdded) return;
		this.eventsAdded = true;
		// on sélectionne la liste des tags
		const tagListElement = document.querySelector('.tag-list');
		// on sélectionne tous les éléments de la liste déroulante
		const dropdownListItems = this.selector.querySelectorAll('ul li');
		// on ajoute un écouteur d'événements à la liste des tags
		tagListElement.addEventListener('click', (event) => {
			event.stopPropagation();
			// on sélectionne le bouton de suppression du tag
			const removeButton = event.target.closest('.remove-tag-button');
			// si le bouton de suppression existe
			if (removeButton) {
				// on sélectionne le tag parent
				const tag = removeButton.closest('.tag');
				// on récupère le texte du span du tag
				const tagName = tag.querySelector('span').textContent;

				// Supprimer le tag de la liste des tags
				tag.remove();

				// Mettre à jour les éléments de la liste déroulante
				dropdownListItems.forEach(item => {
					if (item.querySelector('span').textContent === tagName) {
						const removeItemBtn = item.querySelector('.remove-item-button');
						if (removeItemBtn) {
							removeItemBtn.classList.add('hidden');
						}
						item.classList.remove('bg-yellow');
					}
				});
				// on retire l'élément de la liste des tags
				this.listOfTags = this.listOfTags.filter(tag => tag !== tagName);
				// on dispatch l'event pour pouvoir l'écouter depuis l'index.js
				const newEvent = new CustomEvent('tagRemoved', { detail: { tags: [tagName] } });
				document.dispatchEvent(newEvent);
			}
		});
	}
}