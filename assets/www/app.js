// Variable conservant l'objet du syst�me de fichiers du terminal
var fileSystem;

// Une fois la fen�tre du navigateur charg�e, initialise PhoneGap
window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
}, false);

// Cette m�thode est appel�e une fois que PhoneGap est charg�
function onDeviceReady(){
	window.requestFileSystem (LocalFileSystem.PERSISTENT, 0, onFilesystemSuccess, onFilesystemError);
}

// Cette m�thode est appel�e une fois l'objet du syst�me de fchier est instanci� :
// les boutons peuvent �tre activ�s � ce moment-l� 
function onFilesystemSuccess (fs) {
	fileSystem = fs;
	document.querySelector ("#btnContenuRepertoire").addEventListener("touchstart", showDirectory);           
	document.querySelector ("#btnCreateFile").addEventListener("touchstart", onClickCreationFichier);           
	document.querySelector ("#btnLecture").addEventListener("touchstart", onClickLectureFichier);           
	document.querySelector ("#btnSuppression").addEventListener("touchstart", onClickSupprimeFichier);           
	showText ("Contenu du r�pertoire " + fileSystem.name + ":<br>");
	showDirectory();
}

// Une erreur est survenue lors de l'instantiation de l'objet du syst�me de fichier
function onFilesystemError (error) {
	showText (error.toString());
}

// Lance la lecture du contenu du r�pertoire
function showDirectory() {
	var dirReader = fileSystem.root.createReader();
	dirReader.readEntries (onShowDirectorySuccess, onShowDirectoryError);       
}

// Lit le contenu du r�pertoire dont les entr�es sont pass�es en param�tre
function onShowDirectorySuccess (entries) {
	var html = "";
	for (var i = 0; i < entries.length; i++) {
		html = html + "<p>" + entries[i].fullPath;
		if (entries[i].isFile) {
			html = html + " (ficher)";
		} else {
			html = html + " (r�pertoire)";
		}
		html = html + "</p>";
	}
	showText (html);
}

// Une erreur est survenue lors de la lecture du contenu du r�pertoire 
function onShowDirectoryError (error) {
	showText (error.toString());
}

// Lance la cr�ation d'un fichier
function onClickCreationFichier (e) {
	fileSystem.root.getFile ("test.txt", {create: true}, onClickCreationFichierSuccess, onClickCreationFichierError);
}

// Cr�e le fichier s'il n'existe pas et ajoute une ligne � son contenu
function onClickCreationFichierSuccess (f) {
	f.createWriter (function (writerOb) {
		// Si le fichier n'existe pas, il est cr��
		writerOb.onwrite = function() {
			showText ("Fichier cr��.<br>");
		}
		writerOb.write ("Ligne ajout�e � " + new Date().toString() + "\n");
	})
}

// Une erreur est survenue lors de la cr�ation du fichier
function onClickCreationFichierError (error) {
	showText (error.toString());
}

// Lance la lecture du fichier
function onClickLectureFichier (error) {
	fileSystem.root.getFile ("test.txt", {create:true}, onClickLectureFichierSuccess, onClickLectureFichierError);
}

// Lit le fichier sp�cifi�
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

// Affiche le texte pass� en param�tre � l'�cran
function showText (texte) {
	document.querySelector("#log").innerHTML = texte;
}
