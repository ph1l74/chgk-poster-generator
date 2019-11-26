function imageUploadHandler(evt) {
    const files = evt.target.files;
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


document.getElementById('fileUploader').addEventListener('change', imageUploadHandler, false);
