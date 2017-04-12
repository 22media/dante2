import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

import React from 'react';
import ReactDOM from 'react-dom';

import { Entity, RichUtils, AtomicBlockUtils, EditorState } from 'draft-js';

import { getSelectionRect, getSelection } from "../../utils/selection.js";

import { getCurrentBlock, getNode } from '../../model/index.js';

var DanteImagePopover = function (_React$Component) {
  _inherits(DanteImagePopover, _React$Component);

  function DanteImagePopover(props) {
    _classCallCheck(this, DanteImagePopover);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.display = _this.display.bind(_this);
    _this.show = _this.show.bind(_this);
    _this.hide = _this.hide.bind(_this);
    _this._toggleScaled = _this._toggleScaled.bind(_this);
    _this.scale = _this.scale.bind(_this);
    _this.collapse = _this.collapse.bind(_this);
    _this.relocate = _this.relocate.bind(_this);
    _this.componentWillReceiveProps = _this.componentWillReceiveProps.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.state = {
      position: {
        top: 0,
        left: 0
      },
      show: false,
      scaled: false,
      buttons: [{ type: "left" }, { type: "center" }, { type: "fill" }, { type: "wide" }]
    };
    return _this;
  }

  DanteImagePopover.prototype.display = function display(b) {
    if (b) {
      return this.show();
    } else {
      return this.hide();
    }
  };

  DanteImagePopover.prototype.show = function show() {
    return this.setState({
      show: true });
  };

  DanteImagePopover.prototype.hide = function hide() {
    return this.setState({
      show: false });
  };

  DanteImagePopover.prototype.setPosition = function setPosition(coords) {
    return this.setState({
      position: coords });
  };

  DanteImagePopover.prototype._toggleScaled = function _toggleScaled(ev) {
    if (this.state.scaled) {
      return this.collapse();
    } else {
      return this.scale();
    }
  };

  DanteImagePopover.prototype.scale = function scale() {
    return this.setState({
      scaled: true });
  };

  DanteImagePopover.prototype.collapse = function collapse() {
    return this.setState({
      scaled: false });
  };

  DanteImagePopover.prototype.relocate = function relocate() {
    var editorState = this.props.editorState;


    if (editorState.getSelection().isCollapsed()) {

      var currentBlock = getCurrentBlock(editorState);
      var blockType = currentBlock.getType();

      var contentState = editorState.getCurrentContent();
      var selectionState = editorState.getSelection();

      var block = contentState.getBlockForKey(selectionState.anchorKey);

      var nativeSelection = getSelection(window);
      if (!nativeSelection.rangeCount) {
        return;
      }

      var node = getNode();

      var selectionBoundary = getSelectionRect(nativeSelection);
      var coords = selectionBoundary;

      var parent = ReactDOM.findDOMNode(this.props.editor);
      var parentBoundary = parent.getBoundingClientRect();

      this.display(blockType === "image");

      if (blockType === "image") {
        selectionBoundary = node.anchorNode.parentNode.parentNode.parentNode.getBoundingClientRect();
        var el = this.refs.image_popover;
        var padd = el.offsetWidth / 2;
        return this.setPosition({
          top: selectionBoundary.top - parentBoundary.top + 60,
          left: selectionBoundary.left + selectionBoundary.width / 2 - padd
        });
      }
    } else {
      return this.hide();
    }
  };

  DanteImagePopover.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    return this.collapse();
  };

  DanteImagePopover.prototype.getStyle = function getStyle() {
    if (!this.state.position) {
      return {};
    }
  };

  DanteImagePopover.prototype.handleClick = function handleClick(item) {
    return this.props.editor.setDirection(item.type);
  };

  DanteImagePopover.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      'div',
      {
        ref: 'image_popover',
        className: 'dante-popover popover--Aligntooltip popover--top popover--animated ' + (this.state.show ? 'is-active' : undefined),
        style: { top: this.state.position.top,
          left: this.state.position.left }
      },
      React.createElement(
        'div',
        { className: 'popover-inner' },
        React.createElement(
          'ul',
          { className: 'dante-menu-buttons' },
          this.state.buttons.map(function (item, i) {
            return React.createElement(DanteImagePopoverItem, {
              item: item,
              handleClick: _this2.handleClick,
              key: i
            });
          })
        )
      ),
      React.createElement('div', { className: 'popover-arrow' })
    );
  };

  return DanteImagePopover;
}(React.Component);

var DanteImagePopoverItem = function (_React$Component2) {
  _inherits(DanteImagePopoverItem, _React$Component2);

  function DanteImagePopoverItem() {
    _classCallCheck(this, DanteImagePopoverItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call.apply(_React$Component2, [this].concat(args)));

    _this3.handleClick = _this3.handleClick.bind(_this3);
    _this3.render = _this3.render.bind(_this3);
    return _this3;
  }

  DanteImagePopoverItem.prototype.handleClick = function handleClick(e) {
    e.preventDefault();
    return this.props.handleClick(this.props.item);
  };

  DanteImagePopoverItem.prototype.render = function render() {
    return React.createElement(
      'li',
      {
        className: 'dante-menu-button align-' + this.props.item.type,
        onMouseDown: this.handleClick },
      React.createElement('span', { className: 'tooltip-icon dante-icon-image-' + this.props.item.type })
    );
  };

  return DanteImagePopoverItem;
}(React.Component);

export default DanteImagePopover;