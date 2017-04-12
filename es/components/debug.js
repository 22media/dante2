import _JSON$stringify from "babel-runtime/core-js/json/stringify";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "babel-runtime/helpers/possibleConstructorReturn";
import _inherits from "babel-runtime/helpers/inherits";
import React from 'react';

var Debug = function (_React$Component) {
  _inherits(Debug, _React$Component);

  function Debug() {
    _classCallCheck(this, Debug);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.handleToggleReadOnly = _this.handleToggleReadOnly.bind(_this);
    _this.handleTestEmitAndDecode = _this.handleTestEmitAndDecode.bind(_this);
    _this.handleTestEmitTEXT = _this.handleTestEmitTEXT.bind(_this);
    _this.testEmitAndDecode = _this.testEmitAndDecode.bind(_this);
    _this.testEmitTEXT = _this.testEmitTEXT.bind(_this);
    _this.logState = _this.logState.bind(_this);
    _this.toggleDisplay = _this.toggleDisplay.bind(_this);
    _this.open = _this.open.bind(_this);
    _this.render = _this.render.bind(_this);
    _this.state = {
      output: "",
      display: "none"
    };
    return _this;
  }

  Debug.prototype.handleToggleReadOnly = function handleToggleReadOnly(e) {
    e.preventDefault();
    this.props.editor.toggleEditable();
    return false;
  };

  Debug.prototype.handleTestEmitAndDecode = function handleTestEmitAndDecode(e) {
    e.preventDefault();
    return this.testEmitAndDecode();
  };

  Debug.prototype.handleTestEmitTEXT = function handleTestEmitTEXT(e) {
    e.preventDefault();
    return this.testEmitTEXT();
  };

  Debug.prototype.testEmitAndDecode = function testEmitAndDecode(e) {
    var raw_as_json = this.props.editor.emitSerializedOutput();
    this.props.editor.setState({
      editorState: this.props.editor.decodeEditorContent(raw_as_json) }, this.logState(_JSON$stringify(raw_as_json)));
    return false;
  };

  Debug.prototype.testEmitTEXT = function testEmitTEXT() {
    var text = this.props.editor.getTextFromEditor();
    return this.logState(text);
  };

  Debug.prototype.logState = function logState(raw) {
    return this.setState({ output: raw }, this.open);
  };

  Debug.prototype.toggleDisplay = function toggleDisplay(e) {
    e.preventDefault();
    var d = this.state.display === "block" ? "none" : this.state.display;
    return this.setState({
      display: d });
  };

  Debug.prototype.open = function open() {
    return this.setState({
      display: "block" });
  };

  Debug.prototype.render = function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "debugControls" },
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            " LOCKS: ",
            this.props.editor.state.locks,
            " "
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#", onClick: this.handleToggleReadOnly },
              "EDITABLE: ",
              this.props.editor.state.read_only ? 'NO' : 'YES'
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#", onClick: this.handleTestEmitTEXT },
              "EDITOR TEXT"
            )
          ),
          React.createElement(
            "li",
            null,
            React.createElement(
              "a",
              { href: "#", onClick: this.handleTestEmitAndDecode },
              "EDITOR STATE"
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "debugZone", style: { display: this.state.display } },
        React.createElement("a", { href: "#", className: "dante-debug-close close", onClick: this.toggleDisplay }),
        React.createElement(
          "div",
          { className: "debugOutput" },
          React.createElement(
            "h2",
            null,
            "EDITOR OUTPUT"
          ),
          this.state.output.length > 0 ? React.createElement(
            "pre",
            null,
            this.state.output
          ) : undefined
        )
      )
    );
  };

  return Debug;
}(React.Component);

export default Debug;