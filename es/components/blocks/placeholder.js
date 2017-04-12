import _Object$assign from 'babel-runtime/core-js/object/assign';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

import React from 'react';
import ReactDOM from 'react-dom';

import { Entity, RichUtils, AtomicBlockUtils, EditorBlock } from 'draft-js';

var PlaceholderBlock = function (_React$Component) {
  _inherits(PlaceholderBlock, _React$Component);

  function PlaceholderBlock(props) {
    _classCallCheck(this, PlaceholderBlock);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.placeholderText = _this.placeholderText.bind(_this);
    _this.placeholderFromProps = _this.placeholderFromProps.bind(_this);
    _this.defaultText = _this.defaultText.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.classForDefault = _this.classForDefault.bind(_this);
    _this.state = {
      enabled: false,
      data: _this.props.blockProps.data.toJS()
    };
    return _this;
  }

  PlaceholderBlock.prototype.placeholderText = function placeholderText() {
    if (this.state.enabled) {
      return "";
    }
    return this.props.blockProps.data.toJS().placeholder || this.placeholderFromProps() || this.defaultText();
  };
  //if @.props.blockProps.data then @.props.blockProps.data.placeholder else @defaultText()


  PlaceholderBlock.prototype.placeholderFromProps = function placeholderFromProps() {
    return this.props.block.toJS().placeholder;
  };

  PlaceholderBlock.prototype.defaultText = function defaultText() {
    return "write something ";
  };

  PlaceholderBlock.prototype.componentDidMount = function componentDidMount() {};

  PlaceholderBlock.prototype.handleFocus = function handleFocus(e) {
    var _this2 = this;

    // console.log "focus on placeholder"
    return setTimeout(function () {
      return _this2.setState({
        enabled: true });
    }, 0);
  };

  PlaceholderBlock.prototype.classForDefault = function classForDefault() {
    if (!this.state.enabled) {
      return "defaultValue defaultValue--root";
    } else {
      return "";
    }
  };

  PlaceholderBlock.prototype.render = function render() {
    return React.createElement(
      'span',
      { className: this.classForDefault(), onMouseDown: this.handleFocus },
      this.placeholderText(),
      React.createElement(EditorBlock, _Object$assign({}, this.props, {
        "className": "imageCaption",
        "placeholder": "escrive alalal"
      }))
    );
  };

  return PlaceholderBlock;
}(React.Component);

export default PlaceholderBlock;