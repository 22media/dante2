import _JSON$stringify from "babel-runtime/core-js/json/stringify";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import axios from "axios";
import Immutable from 'immutable';

var SaveBehavior = function () {
  function SaveBehavior(options) {
    _classCallCheck(this, SaveBehavior);

    this.getLocks = options.getLocks;
    this.config = options.config;
    this.editorContent = options.editorContent;
    this.editorState = options.editorState;
  }

  SaveBehavior.prototype.handleStore = function handleStore(ev) {
    return this.store();
  };

  SaveBehavior.prototype.store = function store(content) {
    var _this = this;

    if (!this.config.data_storage.url) {
      return;
    }
    if (this.getLocks() > 0) {
      return;
    }

    clearTimeout(this.timeout);

    return this.timeout = setTimeout(function () {
      return _this.checkforStore(content);
    }, this.config.data_storage.interval);
  };

  SaveBehavior.prototype.getTextFromEditor = function getTextFromEditor(content) {
    return content.blocks.map(function (o) {
      return o.text;
    }).join("\n");
  };

  SaveBehavior.prototype.getUrl = function getUrl() {
    var url = this.config.data_storage.url;

    if (typeof url === "function") {
      return url();
    } else {
      return url;
    }
  };

  SaveBehavior.prototype.getMethod = function getMethod() {
    var method = this.config.data_storage.method;

    if (typeof method === "function") {
      return method();
    } else {
      return method;
    }
  };

  SaveBehavior.prototype.getWithCredentials = function getWithCredentials() {
    var withCredentials = this.config.data_storage.withCredentials;

    if (typeof withCredentials === "function") {
      return withCredentials();
    } else {
      return withCredentials;
    }
  };

  SaveBehavior.prototype.getCrossDomain = function getCrossDomain() {
    var crossDomain = this.config.data_storage.crossDomain;

    if (typeof crossDomain === "function") {
      return crossDomain();
    } else {
      return crossDomain;
    }
  };

  SaveBehavior.prototype.getHeaders = function getHeaders() {
    var headers = this.config.data_storage.headers;

    if (typeof headers === "function") {
      return headers();
    } else {
      return headers;
    }
  };

  SaveBehavior.prototype.checkforStore = function checkforStore(content) {
    // ENTER DATA STORE
    var isChanged = !Immutable.is(Immutable.fromJS(this.editorContent), Immutable.fromJS(content));
    // console.log("CONTENT CHANGED:", isChanged)

    if (!isChanged) {
      return;
    }

    this.save(content);
  };

  SaveBehavior.prototype.save = function save(content) {
    var _this2 = this;

    // use save handler from config if exists
    if (this.config.data_storage.save_handler) {
      this.config.data_storage.save_handler(this, content);
      return;
    }

    if (this.config.xhr.before_handler) {
      this.config.xhr.before_handler();
    }
    // console.log "SAVING TO: #{@getMethod()} #{@getUrl()}"

    return axios({
      method: this.getMethod(),
      url: this.getUrl(),
      data: {
        editor_content: _JSON$stringify(content),
        text_content: this.getTextFromEditor(content)
      },
      withCredentials: this.getWithCredentials(),
      crossDomain: this.getCrossDomain(),
      headers: this.getHeaders()
    }).then(function (result) {
      // console.log "STORING CONTENT", result
      if (_this2.config.data_storage.success_handler) {
        _this2.config.data_storage.success_handler(result);
      }
      if (_this2.config.xhr.success_handler) {
        return _this2.config.xhr.success_handler(result);
      }
    })["catch"](function (error) {
      // console.log("ERROR: got error saving content at #{@config.data_storage.url} - #{error}")
      if (_this2.config.xhr.failure_handler) {
        return _this2.config.xhr.failure_handler(error);
      }
    });
  };

  return SaveBehavior;
}();

export default SaveBehavior;