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

function inputChange(event) {
    setTimeout(function () {
        const inputElem = document.getElementById(event.target.id);
        const targetId = 'image' + event.target.id.substring(event.target.id.indexOf('input') + 5, event.target.id.length);
        const imageElem = document.getElementById(targetId);
        if (inputElem.id === "inputLoc") {
            if (inputElem.value.length > 0) {
                imageElem.innerHTML = `<i id="locIcon" class="fas fa-map-marker-alt cpg-loc-icon"></i> ${inputElem.value}`
            }
            else {
                document.getElementById('locIcon').parentNode.removeChild(document.getElementById('locIcon'));
            }
        }
        else {
            imageElem.innerText = inputElem.value;
        }
    }, 50)

}

function renderImage() {
    // UIkit.modal.dialog('<div id="imageDownloader"></div>', { "sel-close": '.uk-modal-close-outside' });
    html2canvas(document.getElementById('imageContainer'), { logging: false }).then(canvas => {
        // document.getElementById('imageDownloader').innerHTML = "<div id='imageDownloaderImg'></div>"
        document.getElementById('imageDownloaderImg').innerHTML = "";
        document.getElementById('imageDownloaderImg').appendChild(canvas);
        canvas.toBlob(function (blob) {
            // console.log(blob);
            // imageContainer.setAttribute('data-src', blob);
            // saveAs(blob, 'image.jpeg');
        }, 'image/png')

    });
}


function init() {

    document.querySelectorAll('[id^=input]').forEach(function () {
        addEventListener('keydown', inputChange, true);
        addEventListener('change', inputChange, true);
    });

    document.getElementsByName('sizeselector').forEach(function () {
        addEventListener('change', imageResizer, false);
    });

    document.getElementsByName('covermode').forEach(function () {
        addEventListener('change', changeCoverMode, false);
    });

    document.getElementById('fileUploader').addEventListener('change', imageUploadHandler, false);

    hideElem('gradientOptions');

    UIkit.util.on('#downloadModal', 'click', function (e) {
        e.preventDefault();
        e.target.blur();
        renderImage();
    });

}

