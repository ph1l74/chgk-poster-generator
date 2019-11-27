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
            setActuialTextBackground
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

function downloadImage() {
    // Image rendering:
    html2canvas(document.getElementById('imageContainer'), { logging: false }).then(canvas => {
        canvas.toBlob(function (blob) {
            saveAs(blob, 'image.jpeg');
        }, 'image/png')

    });
}

function getImagePalette(imageId) {
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
        canvas = document.createElement('imageCanvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imageId.naturalHeight || imageId.offsetHeight || imageId.height;
    width = canvas.width = imageId.naturalWidth || imageId.offsetWidth || imageId.width;

    context.drawImage(imageId, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        UIkit.notification('Ошибка безопаности сервиса', { status: 'danger' });
        return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    console.log(rgb);
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
}

function setTitleBackgroundColour(colour) {
    document.querySelectorAll('.cpg-image-text-with-bg').forEach(function (elem) {
        elem.style.background = colour;
    });
}

function generateRandomGradient() {

    var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];

    function populate(a) {
        for (var i = 0; i < 6; i++) {
            var x = Math.round(Math.random() * 14);
            var y = hexValues[x];
            a += y;
        }
        return a;
    }

    var newColor1 = populate('#');
    var newColor2 = populate('#');
    var angle = Math.round(Math.random() * 360);

    var gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";

    document.getElementById("imageContainer").setAttribute('data-src', '');
    document.getElementById("imageContainer").style.background = gradient;
    setActuialTextBackground();
}

function setActuialTextBackground() {
    const colour = getImagePalette("imageContainer");
    setTitleBackgroundColour(colour);
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

    document.getElementById('generateGradient').addEventListener('click', generateRandomGradient, false);

    document.getElementById('downloadImage').addEventListener('click', downloadImage, false);

    hideElem('gradientOptions');

}

