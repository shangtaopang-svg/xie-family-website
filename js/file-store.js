/* ============================================
   宁海下枫槎村 · 谢氏家族网站
   IndexedDB 文件存储 + 服务端上传
   ============================================ */

const DB_NAME = 'XieFamilyFiles';
const DB_VERSION = 1;
const STORE_NAME = 'files';

function openFileDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' });
      }
    };
    req.onsuccess = function(e) { resolve(e.target.result); };
    req.onerror = function(e) { reject(e.target.error); };
  });
}

function saveFile(name, dataUrl) {
  return openFileDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({ name: name, dataUrl: dataUrl, time: Date.now() });
      tx.oncomplete = function() { db.close(); resolve(); };
      tx.onerror = function(e) { db.close(); reject(e.target.error); };
    });
  });
}

function getFile(name) {
  return openFileDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(STORE_NAME, 'readonly');
      var req = tx.objectStore(STORE_NAME).get(name);
      req.onsuccess = function() { db.close(); resolve(req.result); };
      req.onerror = function(e) { db.close(); reject(e.target.error); };
    });
  });
}

function getAllFiles(prefix) {
  return openFileDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(STORE_NAME, 'readonly');
      var req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = function() {
        db.close();
        var results = req.result || [];
        if (prefix) {
          results = results.filter(function(f) { return f.name.startsWith(prefix); });
        }
        resolve(results);
      };
      req.onerror = function(e) { db.close(); reject(e.target.error); };
    });
  });
}

function deleteFile(name) {
  return openFileDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(name);
      tx.oncomplete = function() { db.close(); resolve(); };
      tx.onerror = function(e) { db.close(); reject(e.target.error); };
    });
  });
}

function readFileAsDataURL(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = function() { reject(reader.error); };
    reader.readAsDataURL(file);
  });
}

// ===== 服务端文件上传（二进制直传，更快更稳定） =====

function uploadToServer(name, file) {
  return fetch('/api/upload/bin/' + encodeURIComponent(name), {
    method: 'POST',
    body: file
  }).then(function(r) {
    if (!r.ok) {
      return r.json().then(function(err) { throw new Error(err.error || 'HTTP ' + r.status); });
    }
    return r.json();
  });
}

function deleteFromServer(filename) {
  return fetch('/api/upload/' + encodeURIComponent(filename), {
    method: 'DELETE'
  }).then(function(r) { return r.json(); });
}

// ===== Photo helpers =====
function savePhoto(id, title, file) {
  return readFileAsDataURL(file).then(function(dataUrl) {
    return saveFile('photo_' + id, dataUrl).then(function() {
      var photos = JSON.parse(localStorage.getItem('xie_admin_photos') || '[]');
      var found = false;
      for (var i = 0; i < photos.length; i++) {
        if (photos[i].id === id) {
          photos[i].hasFile = true;
          photos[i].fileName = file.name;
          found = true;
          break;
        }
      }
      if (!found) {
        photos.push({ id: id, title: title, hasFile: true, fileName: file.name, icon: '🖼️', color: '#0f0f1a' });
      }
      localStorage.setItem('xie_admin_photos', JSON.stringify(photos));
    });
  });
}

function deletePhoto(id) {
  return deleteFile('photo_' + id);
}

function getAllPhotos() {
  return getAllFiles('photo_');
}

// Video helpers
function saveVideoFile(id, file) {
  return readFileAsDataURL(file).then(function(dataUrl) {
    return saveFile('video_' + id, dataUrl);
  });
}

// Binary blob storage (for video files — avoids base64 overhead)
function saveBlob(name, blob) {
  return openFileDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({ name: name, blob: blob, time: Date.now() });
      tx.oncomplete = function() { db.close(); resolve(); };
      tx.onerror = function(e) { db.close(); reject(e.target.error); };
    });
  });
}

// Music helpers
function saveMusicFile(file) {
  return readFileAsDataURL(file).then(function(dataUrl) {
    return saveFile('bg_music', dataUrl);
  });
}

function getMusicFile() {
  return getFile('bg_music');
}

window.uploadToServer = uploadToServer;
window.deleteFromServer = deleteFromServer;
window.savePhoto = savePhoto;
window.deletePhoto = deletePhoto;
window.getAllPhotos = getAllPhotos;
window.saveVideoFile = saveVideoFile;
window.saveMusicFile = saveMusicFile;
window.getMusicFile = getMusicFile;
window.saveFile = saveFile;
window.getFile = getFile;
window.deleteFile = deleteFile;
window.getAllFiles = getAllFiles;
window.readFileAsDataURL = readFileAsDataURL;
window.saveBlob = saveBlob;
