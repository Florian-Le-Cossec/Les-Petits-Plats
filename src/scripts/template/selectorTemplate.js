export class SelectorTemplate {
	constructor(data, type) {
		this.data = data;
		this.type = type;
		this.selector = null;
	}

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
		${item} 
		<svg class="remove-item-button fill-dark hidden" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
			<circle cx="8.5" cy="8.5" r="8.5"/>
			<path d="M11 11L8.5 8.5M8.5 8.5L6 6M8.5 8.5L11 6M8.5 8.5L6 11" stroke="#FFD15B" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
		</li>`).join('');

		const dropdownList = 
		/*html*/
		`
			${searchInput}
			<ul class="max-h-52 overflow-y-auto mt-4">
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
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = selectorHtml;
		this.selector = tempDiv.firstElementChild;

		this.selector.querySelector('.selector__button').addEventListener('click', function () {
			const dropdown = this.nextElementSibling;
			const chevron = this.querySelector('.chevron');
			const searchInput = document.querySelector('.search-input');
			
			dropdown.classList.toggle('hidden');
			chevron.classList.toggle('rotate-180');
			searchInput.focus();
		});

		selectContainer.appendChild(this.selector);

		this.handleSearch();
		this.handleAddTag();
		this.handleRemoveTag();
		this.handleClearInput();
	}

	handleClearInput() {
		const searchInput = document.querySelector('.search-input');
		const clearButton = document.querySelector('.clear-button');
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
			const query = searchInput.value.toLowerCase();
			const filteredData = query ? this.data.filter(item => item.toLowerCase().includes(query)) : this.data;
			const itemList = filteredData.map(item => `<li class="py-2 px-4 text-sm hover:bg-yellow cursor-pointer">${item}</li>`).join('');
			dropdownList.innerHTML = itemList;
		});
	}

	handleAddTag() {
		const dropdownListItems = this.selector.querySelectorAll('ul li');
		dropdownListItems.forEach(item => {
			item.addEventListener('click', () => {
				const selectedItem = item.textContent;
				const tagList = document.querySelector('.tag-list');
				const existingTags = tagList.querySelectorAll('.tag span:first-child');
				let isAlreadySelected = false;

				existingTags.forEach(tag => {
					if (tag.textContent === selectedItem) {
						isAlreadySelected = true;
					}
				});

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
					tagList.innerHTML += tag;
					item.classList.add('bg-yellow');
					const removeItemBtn = item.querySelector('.remove-item-button');
					if (removeItemBtn) {
						removeItemBtn.classList.remove('hidden');
					}
				}
			});
		});
	}

	handleRemoveTag() {
		const dropdownListItems = this.selector.querySelectorAll('ul li');
		const tagList = document.querySelector('.tag-list');
		dropdownListItems.forEach(item => {
			const svgItem = item.querySelector('.remove-item-button')
			svgItem.addEventListener('click', () => {
				svgItem.classList.add('hidden');
				item.classList.remove('bg-yellow');
				console.log(tagList);
			});
		});
	}
}

