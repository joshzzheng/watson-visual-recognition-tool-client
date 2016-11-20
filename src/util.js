/**
 * Resizes an image
 * @param  {String} image   The base64 image
 * @param  {int} maxSize maximum size
 * @return {String}         The base64 resized image
 */

'use strict';

module.exports.resize = function(image, maxSize) {
  var c = window.document.createElement('canvas');
  var ctx = c.getContext('2d');
  var ratio = image.width / image.height;

  if (image.width < maxSize && image.height < maxSize) {
    c.width = image.width;
    c.height = image.height;
  } else {
    c.width = (ratio > 1 ? maxSize : maxSize * ratio);
    c.height = (ratio > 1 ? maxSize / ratio : maxSize);
  }

  ctx.drawImage(image, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg');
};

let isValidMimeTypeForZip = function(filetype) {
  return {'application/zip': true, 'application/x-zip-compressed': true}[filetype]
}

let fileSizeOK = function(fileobj) {
  return fileobj.size < (5 * 1000 * 1000)
}

let isValidFile = function(fileobj) {
  return fileSizeOK(fileobj) && isValidMimeTypeForZip(fileobj.type)
}

module.exports.isValidFile = isValidFile;

let alertsForFileInvalidity = function(fileobj) {
  if (!fileSizeOK(fileobj)) {
    // eslint-disable-next-line no-alert
    alert('This file exceeds the maximum size of 5 MB. Please choose another file');
  } else if (!isValidMimeTypeForZip(fileobj.type)) {
    // eslint-disable-next-line no-alert
    alert('You can only upload Zipped archives of images');
  }
}

module.exports.alertsForFileInvalidity = alertsForFileInvalidity;