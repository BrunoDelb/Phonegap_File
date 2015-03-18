// Variable conservant l'objet du système de fichiers du terminal
var fileSystem;

// Une fois la fenêtre du navigateur chargée, initialise PhoneGap
window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
}, false);

// Cette méthode est appelée une fois que PhoneGap est chargé
function onDeviceReady(){
	window.requestFileSystem (LocalFileSystem.PERSISTENT, 0, onFilesystemSuccess, onFilesystemError);
}

// Cette méthode est appelée une fois l'objet du système de fchier est instancié :
// les boutons peuvent être activés à ce moment-là 
function onFilesystemSuccess (fs) {
	fileSystem = fs;
	document.querySelector ("#btnContenuRepertoire").addEventListener("touchstart", showDirectory);           
	document.querySelector ("#btnCreateFile").addEventListener("touchstart", onClickCreationFichier);           
	document.querySelector ("#btnLecture").addEventListener("touchstart", onClickLectureFichier);           
	document.querySelector ("#btnSuppression").addEventListener("touchstart", onClickSupprimeFichier);           
	showText ("Contenu du répertoire " + fileSystem.name + ":<br>");
	showDirectory();
}

// Une erreur est survenue lors de l'instantiation de l'objet du système de fichier
function onFilesystemError (error) {
	showText (error.toString());
}

// Lance la lecture du contenu du répertoire
function showDirectory() {
	var dirReader = fileSystem.root.createReader();
	dirReader.readEntries (onShowDirectorySuccess, onShowDirectoryError);       
}

// Lit le contenu du répertoire dont les entrées sont passées en paramètre
function onShowDirectorySuccess (entries) {
	var html = "";
	for (var i = 0; i < entries.length; i++) {
		html = html + "<p>" + entries[i].fullPath;
		if (entries[i].isFile) {
			html = html + " (ficher)";
		} else {
			html = html + " (répertoire)";
		}
		html = html + "</p>";
	}
	showText (html);
}

// Une erreur est survenue lors de la lecture du contenu du répertoire 
function onShowDirectoryError (error) {
	showText (error.toString());
}

// Lance la création d'un fichier
function onClickCreationFichier (e) {
	fileSystem.root.getFile ("test.txt", {create: true}, onClickCreationFichierSuccess, onClickCreationFichierError);
}

// Crée le fichier s'il n'existe pas et ajoute une ligne à son contenu
function onClickCreationFichierSuccess (f) {
	f.createWriter (function (writerOb) {
		// Si le fichier n'existe pas, il est créé
		writerOb.onwrite = function() {
			showText ("Fichier créé.<br>");
		}
		writerOb.write ("Ligne ajoutée à " + new Date().toString() + "\n");
	})
}

// Une erreur est survenue lors de la création du fichier
function onClickCreationFichierError (error) {
	showText (error.toString());
}

// Lance la lecture du fichier
function onClickLectureFichier (error) {
	fileSystem.root.getFile ("test.txt", {create:true}, onClickLectureFichierSuccess, onClickLectureFichierError);
}

// Lit le fichier spécifié
function onClickLectureFichierSuccess (fichier) {
	reader = new FileReader();
	reader.onloadend = function(e) {
	}
	reader.readAsText (fichier);
}

// Une erreur est survenue lors de la lecture du fichier
function onClickLectureFichierError (error) {
	showText (error.toString());
}

// Lance la suppression du fichier
function onClickSupprimeFichier (error) {
	fileSystem.root.getFile ("test.txt", {create: true}, onClickSupprimeFichierSuccess, onClickSupprimeFichierError);
}

// Supprime le fichier
function onClickSupprimeFichierSuccess (fichier) {
	fichier.remove (function() {
	});
}

// Une erreur est survenue lors de la suppression du fichier 
function onClickSupprimeFichierError (error) {
	showText (error.toString());
}

// Affiche le texte passé en paramètre à l'écran
function showText (texte) {
	document.querySelector("#log").innerHTML = texte;
}
