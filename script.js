function imageUploadHandler(event) {
    const files = event.target.files;
    if (files.length > 1) {
        UIkit.notification('Выберите только один файл', { status: 'danger' });
        return false;
    }

    if (!files[0].type.match('image.*')) {
        UIkit.notification('Можно прикреплять только файлы изображений', { status: 'danger' });
        return false;
    }

    const imageContainer = document.getElementById('imageContainer');
    const reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {
            imageContainer.setAttribute('data-src', e.target.result);
            imageContainer.setAttribute('title', escape(theFile.name));
        };
    })(files[0]);

    reader.readAsDataURL(files[0]);
}

function imageResizer(event) {
    document.getElementById('imageContainer').style.height = `${event.target.value}px`
}

function displayNone(elem) {
    elem.style.display = 'none';
}

function hideElem(id) {
    const elem = document.getElementById(id);
    elem.classList.remove('animated', 'fadeInDown', 'faster');
    elem.classList.add('animated', 'fadeOutDown', 'faster');
    elem.addEventListener('animationend', displayNone(elem));
}

function showElem(id) {
    const elem = document.getElementById(id);
    elem.removeEventListener('animationend', displayNone(elem));
    elem.style.display = 'block';
    elem.classList.remove('animated', 'fadeOutDown', 'faster');
    elem.classList.add('animated', 'fadeInDown', 'faster');
}

function changeCoverMode(event) {
    let selectedMode = event.target.value;
    if (selectedMode === 'gradient') {
        hideElem('uploadOptions');
        showElem('gradientOptions');
    }
    else {
        showElem('uploadOptions');
        hideElem('gradientOptions');
    }
}

function init() {
    document.getElementsByName('sizeselector').forEach(function () {
        addEventListener('change', imageResizer, false);
    });

    document.getElementsByName('covermode').forEach(function () {
        addEventListener('change', changeCoverMode, false);
    });

    document.getElementById('fileUploader').addEventListener('change', imageUploadHandler, false);

    hideElem('gradientOptions');

}

