'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filesystem = require('./filesystem');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FilesystemChangelogAdapter = function () {
  function FilesystemChangelogAdapter(config) {
    _classCallCheck(this, FilesystemChangelogAdapter);

    this.workingDirectory = config.workingDirectory;
    this.format = config.format;
    this.readOnly = config.readOnly !== undefined ? config.readOnly : true;
    this.listener = function () {};
  }

  _createClass(FilesystemChangelogAdapter, [{
    key: 'observe',
    value: function observe(handler) {
      this.listener = handler;
    }
  }, {
    key: 'write',
    value: function write(data) {
      if (this.readOnly) {
        throw new Error('[FilesystemChangelogAdapter] This adapter is read-only');
      }

      (0, _filesystem.createDirectory)(this.workingDirectory + '/' + data.type + '/' + data.id);
      (0, _filesystem.writeFile)(this.workingDirectory + '/' + data.type + '/' + data.id + '/' + data.version_id + '.' + this.format, data);

      return this.listener(data);
    }
  }, {
    key: 'init',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(types, signatureProvider) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, type, log, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, data, record;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 3;
                _iterator = types[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 38;
                  break;
                }

                type = _step.value;
                log = (0, _filesystem.readAllFiles)(this.workingDirectory + '/' + type, this.format);
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context.prev = 11;
                _iterator2 = log[Symbol.iterator]();

              case 13:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context.next = 21;
                  break;
                }

                data = _step2.value;
                record = data.id ? data : signatureProvider.signNew(type, data);
                _context.next = 18;
                return this.listener(record);

              case 18:
                _iteratorNormalCompletion2 = true;
                _context.next = 13;
                break;

              case 21:
                _context.next = 27;
                break;

              case 23:
                _context.prev = 23;
                _context.t0 = _context['catch'](11);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t0;

              case 27:
                _context.prev = 27;
                _context.prev = 28;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 30:
                _context.prev = 30;

                if (!_didIteratorError2) {
                  _context.next = 33;
                  break;
                }

                throw _iteratorError2;

              case 33:
                return _context.finish(30);

              case 34:
                return _context.finish(27);

              case 35:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 38:
                _context.next = 44;
                break;

              case 40:
                _context.prev = 40;
                _context.t1 = _context['catch'](3);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 44:
                _context.prev = 44;
                _context.prev = 45;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 47:
                _context.prev = 47;

                if (!_didIteratorError) {
                  _context.next = 50;
                  break;
                }

                throw _iteratorError;

              case 50:
                return _context.finish(47);

              case 51:
                return _context.finish(44);

              case 52:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 40, 44, 52], [11, 23, 27, 35], [28,, 30, 34], [45,, 47, 51]]);
      }));

      function init(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'isConnected',
    value: function isConnected() {
      return true;
    }
  }]);

  return FilesystemChangelogAdapter;
}();

exports.default = FilesystemChangelogAdapter;