export class SelectorTemplate {
	constructor(data, type) {
		this.data = data;
		this.type = type;
	}

	generate() {
		const selectContainer = document.querySelector('.select-container');
		const searchInput = 
		/*html*/
		`
			<div class="relative mx-4 mt-3">
				<input class="search-input w-full truncate focus:outline-none border border-lighter-grey text-sm p-2" type="text"></input>
				<div class="flex gap-2 absolute transform -translate-y-1/2 top-1/2 p-2.5 right-0">
					<button class="clear-button">
						<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 17 17" fill="none">
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

		const itemList = this.data.map(item => /*html*/ `<li class="py-2 px-4 text-sm hover:bg-yellow cursor-pointer">${item}</li>`).join('');

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
		const selector = tempDiv.firstElementChild;

		selector.querySelector('.selector__button').addEventListener('click', function () {
			const dropdown = this.nextElementSibling;
			const chevron = this.querySelector('.chevron');
			const searchInput = document.querySelector('.search-input');
			
			dropdown.classList.toggle('hidden');
			chevron.classList.toggle('rotate-180');
			searchInput.focus();
		});

		selectContainer.appendChild(selector);

	}
}

