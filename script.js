var originalFileName; // Variable pour stocker le nom du fichier d'origine

function updateDimensionsLabel(width, height) {
    var resolution = document.getElementById('resolutionSlider').value / 100;
    var newWidth = Math.round(width * resolution);
    var newHeight = Math.round(height * resolution);
    document.getElementById('dimensionsLabel').innerText = newWidth + ' px * ' + newHeight + ' px';
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var file;
    if (evt.dataTransfer) {
        file = evt.dataTransfer.files[0];
    } else if (evt.target.files) {
        file = evt.target.files[0];
    }

    var reader = new FileReader();
    var resolutionLabel = document.getElementById('resolutionLabel');
    var resolutionSlider = document.getElementById('resolutionSlider');
    var convertButton = document.getElementById('convertButton');
    var downloadLink = document.getElementById('downloadLink');
    var imagePreview = document.getElementById('imagePreview');
    var selectedFileName = document.getElementById('selectedFileName');
    var label = document.getElementById('label');

    reader.onloadend = function () {
        imagePreview.src = reader.result;
        imagePreview.onload = function () {
            var width = imagePreview.naturalWidth;
            var height = imagePreview.naturalHeight;
            updateDimensionsLabel(width, height);
            resolutionLabel.style.display = 'inline';
            resolutionSlider.style.display = 'inline';
            convertButton.style.display = 'inline';
            label.style.display = 'block';
            selectedFileName.innerText = file.name; // Afficher le nom du fichier sélectionné
            selectedFileName.style.display = 'inline';
            downloadLink.style.display = 'none';
            imagePreview.style.visibility = 'hidden';
        };
    };

    if (file) {
        originalFileName = file.name; // Enregistrer le nom du fichier d'origine
        reader.readAsDataURL(file);
        resolutionLabel.style.display = 'inline';
        resolutionSlider.style.display = 'inline'; // Afficher le slider de résolution
        convertButton.style.display = 'inline';
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

document.getElementById('dropArea').addEventListener('dragover', handleDragOver, false);
document.getElementById('dropArea').addEventListener('drop', handleFileSelect, false);

function openFilePicker() {
    document.getElementById('fileInput').click();
}

function convertToWebP() {
    var file = document.getElementById('imagePreview').src;

    var img = new Image();
    img.src = file;

    img.onload = function () {
        var canvas = document.createElement('canvas');

        var resolution = document.getElementById('resolutionSlider').value / 100;
        var width = Math.round(img.naturalWidth * resolution);
        var height = Math.round(img.naturalHeight * resolution);
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        var webpDataURL = canvas.toDataURL('image/webp');

        var downloadLink = document.getElementById('downloadLink');

        downloadLink.href = webpDataURL;
        downloadLink.download = originalFileName.replace(/\.[^/.]+$/, '') + '.webp'; // Utiliser le même nom avec l'extension WebP
        downloadLink.style.display = 'block';
    };
}

var resolutionSlider = document.getElementById('resolutionSlider');
resolutionSlider.addEventListener('input', function () {
    document.getElementById('resolutionLabel').innerText = resolutionSlider.value + '%';
    var imagePreview = document.getElementById('imagePreview');
    if (imagePreview.complete) {
        var width = imagePreview.naturalWidth;
        var height = imagePreview.naturalHeight;
        updateDimensionsLabel(width, height);
    }
});

document.getElementById('fileInput').addEventListener('change', function (evt) {
    handleFileSelect(evt); // Appeler la fonction de gestion de fichier pour gérer la sélection via le bouton
    var imagePreview = document.getElementById('imagePreview');
    imagePreview.style.visibility = 'visible';
    updateDimensionsLabel(imagePreview.naturalWidth, imagePreview.naturalHeight);
});