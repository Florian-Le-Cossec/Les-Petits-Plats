# Project 7 - Les Petits Plats

Pour visionner les deux implémentations de la recherche, il faut checkout sur les branches suivantes :
- `main-search-first-option` pour la recherche avec boucles natives
- `main-search-second-option` pour la recherche avec boucle filter

<pre>
	<code>
		git checkout main-search-first-option
	</code>
	<button onclick="copyToClipboard('git checkout main-search-first-option')">Copier</button>
</pre>

<pre>
	<code>
		git checkout main-search-second-option
	</code>
	<button onclick="copyToClipboard('git checkout main-search-second-option')">Copier</button>
</pre>

<script>
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(function() {
			alert('Texte copié: ' + text);
		}, function(err) {
			console.error('Erreur lors de la copie: ', err);
		});
	}
</script>