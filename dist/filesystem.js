'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readAllFiles = exports.getFileNames = exports.readFile = exports.createDirectory = exports.writeFile = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _arrayFlatten = require('array-flatten');

var _arrayFlatten2 = _interopRequireDefault(_arrayFlatten);

var _fileExtension = require('file-extension');

var _fileExtension2 = _interopRequireDefault(_fileExtension);

var _contentParser = require('./content-parser');

var _contentParser2 = _interopRequireDefault(_contentParser);

var _contentEncoder = require('./content-encoder');

var _contentEncoder2 = _interopRequireDefault(_contentEncoder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var writeFile = exports.writeFile = function writeFile(path, data) {
  _fs2.default.writeFileSync(path, (0, _contentEncoder2.default)((0, _fileExtension2.default)(path), data));
};

var createDirectory = exports.createDirectory = function createDirectory(path) {
  if (!_fs2.default.existsSync(path)) {
    _fs2.default.mkdirSync(path);
  }
};

var readFile = exports.readFile = function readFile(path) {
  var content = _fs2.default.readFileSync(path, 'utf8');
  return (0, _contentParser2.default)((0, _fileExtension2.default)(path), content);
};

var getFileNames = exports.getFileNames = function getFileNames(directory) {
  return (0, _arrayFlatten2.default)(_fs2.default.readdirSync(directory).filter(function (name) {
    return name[0] !== '.';
  }).map(function (name) {
    var location = directory + '/' + name;
    if (_fs2.default.lstatSync(location).isDirectory()) {
      return getFileNames(location);
    }

    return location;
  }));
};

var readAllFiles = exports.readAllFiles = function readAllFiles(path, format) {
  var result = [];
  var names = getFileNames(path);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var name = _step.value;

      if (!format || (0, _fileExtension2.default)(name) === format) {
        var file = readFile(name);
        if (file) {
          result.push(file);
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
};