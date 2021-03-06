import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';

import { convertToRaw, CompositeDecorator, getVisibleSelectionRect, getDefaultKeyBinding, getSelectionOffsetKeyForNode, KeyBindingUtil, ContentState, Editor, EditorState, Entity, RichUtils } from 'draft-js';

import { getSelectionRect, getSelection } from "../../utils/selection.js";

import { getCurrentBlock } from '../../model/index.js';

var DanteTooltip = function (_React$Component) {
  _inherits(DanteTooltip, _React$Component);

  function DanteTooltip(props) {
    _classCallCheck(this, DanteTooltip);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this._clickInlineHandler = _this._clickInlineHandler.bind(_this);
    _this.display = _this.display.bind(_this);
    _this.show = _this.show.bind(_this);
    _this.hide = _this.hide.bind(_this);
    _this.relocate = _this.relocate.bind(_this);
    _this._clickBlockHandler = _this._clickBlockHandler.bind(_this);
    _this.displayLinkMode = _this.displayLinkMode.bind(_this);
    _this.displayActiveMenu = _this.displayActiveMenu.bind(_this);
    _this._enableLinkMode = _this._enableLinkMode.bind(_this);
    _this._disableLinkMode = _this._disableLinkMode.bind(_this);
    _this.handleInputEnter = _this.handleInputEnter.bind(_this);
    _this.confirmLink = _this.confirmLink.bind(_this);
    _this.inlineItems = _this.inlineItems.bind(_this);
    _this.blockItems = _this.blockItems.bind(_this);
    _this.getDefaultValue = _this.getDefaultValue.bind(_this);
    _this.getVisibleSelectionRect = getVisibleSelectionRect;
    _this.state = {
      link_mode: false,
      show: false,
      position: {}
    };
    return _this;
  }

  DanteTooltip.prototype._clickInlineHandler = function _clickInlineHandler(ev, style) {
    var _this2 = this;

    ev.preventDefault();

    this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, style));

    return setTimeout(function () {
      return _this2.relocate();
    }, 0);
  };

  DanteTooltip.prototype.display = function display(b) {
    if (b) {
      return this.show();
    } else {
      return this.hide();
    }
  };

  DanteTooltip.prototype.show = function show() {
    return this.setState({
      show: true });
  };

  DanteTooltip.prototype.hide = function hide() {
    return this.setState({
      link_mode: false,
      show: false
    });
  };

  DanteTooltip.prototype.setPosition = function setPosition(coords) {
    return this.setState({
      position: coords });
  };

  DanteTooltip.prototype.isDescendant = function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  DanteTooltip.prototype.relocate = function relocate() {

    var currentBlock = getCurrentBlock(this.props.editorState);
    var blockType = currentBlock.getType();
    // display tooltip only for unstyled

    if (this.props.configTooltip.selectionElements.indexOf(blockType) < 0) {
      this.hide();
      return;
    }

    if (this.state.link_mode) {
      return;
    }
    if (!this.state.show) {
      return;
    }

    var el = this.refs.dante_menu;
    var padd = el.offsetWidth / 2;

    var nativeSelection = getSelection(window);
    if (!nativeSelection.rangeCount) {
      return;
    }

    var selectionBoundary = getSelectionRect(nativeSelection);

    var parent = ReactDOM.findDOMNode(this.props.editor);
    var parentBoundary = parent.getBoundingClientRect();

    // hide if selected node is not in editor
    if (!this.isDescendant(parent, nativeSelection.anchorNode)) {
      this.hide();
      return;
    }

    var top = selectionBoundary.top - parentBoundary.top - -90 - 5;
    var left = selectionBoundary.left + selectionBoundary.width / 2 - padd;

    if (!top || !left) {
      return;
    }

    // console.log "SET SHOW FOR TOOLTIP INSERT MENU"
    return this.setState({
      show: true,
      position: {
        left: left,
        top: top
      }
    });
  };

  DanteTooltip.prototype._clickBlockHandler = function _clickBlockHandler(ev, style) {
    var _this3 = this;

    ev.preventDefault();

    this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, style));

    return setTimeout(function () {
      return _this3.relocate();
    }, 0);
  };

  DanteTooltip.prototype.displayLinkMode = function displayLinkMode() {
    if (this.state.link_mode) {
      return "dante-menu--linkmode";
    } else {
      return "";
    }
  };

  DanteTooltip.prototype.displayActiveMenu = function displayActiveMenu() {
    if (this.state.show) {
      return "dante-menu--active";
    } else {
      return "";
    }
  };

  DanteTooltip.prototype._enableLinkMode = function _enableLinkMode(ev) {
    ev.preventDefault();
    return this.setState({
      link_mode: true });
  };

  DanteTooltip.prototype._disableLinkMode = function _disableLinkMode(ev) {
    ev.preventDefault();
    return this.setState({
      link_mode: false,
      url: ""
    });
  };

  DanteTooltip.prototype.hideMenu = function hideMenu() {
    return this.hide();
  };

  DanteTooltip.prototype.handleInputEnter = function handleInputEnter(e) {
    if (e.which === 13) {
      return this.confirmLink(e);
    }
  };

  DanteTooltip.prototype.confirmLink = function confirmLink(e) {
    e.preventDefault();
    var editorState = this.props.editorState;

    var urlValue = e.currentTarget.value;
    var contentState = editorState.getCurrentContent();
    var selection = editorState.getSelection();

    var opts = {
      url: urlValue,
      showPopLinkOver: this.props.showPopLinkOver,
      hidePopLinkOver: this.props.hidePopLinkOver
    };

    var entityKey = Entity.create('LINK', 'MUTABLE', opts);

    if (selection.isCollapsed()) {
      console.log("COLLAPSED SKIPPING LINK");
      return;
    }

    this.props.onChange(RichUtils.toggleLink(editorState, selection, entityKey));

    return this._disableLinkMode(e);
  };

  DanteTooltip.prototype.getPosition = function getPosition() {
    var pos = this.state.position;
    return pos;
  };

  DanteTooltip.prototype.inlineItems = function inlineItems() {
    return this.props.widget_options.block_types.filter(function (o) {
      return o.type === "inline";
    });
  };

  DanteTooltip.prototype.blockItems = function blockItems() {
    return this.props.widget_options.block_types.filter(function (o) {
      return o.type === "block";
    });
  };

  DanteTooltip.prototype.getDefaultValue = function getDefaultValue() {
    var _this4 = this;

    if (this.refs.dante_menu_input) {
      this.refs.dante_menu_input.value = "";
    }

    var currentBlock = getCurrentBlock(this.props.editorState);
    var blockType = currentBlock.getType();
    var selection = this.props.editor.state.editorState.getSelection();
    var selectedEntity = null;
    var defaultUrl = null;
    return currentBlock.findEntityRanges(function (character) {
      var entityKey = character.getEntity();
      selectedEntity = entityKey;
      return entityKey !== null && Entity.get(entityKey).getType() === 'LINK';
    }, function (start, end) {
      var selStart = selection.getAnchorOffset();
      var selEnd = selection.getFocusOffset();
      if (selection.getIsBackward()) {
        selStart = selection.getFocusOffset();
        selEnd = selection.getAnchorOffset();
      }

      if (start === selStart && end === selEnd) {
        defaultUrl = Entity.get(selectedEntity).getData().url;
        return _this4.refs.dante_menu_input.value = defaultUrl;
      }
    });
  };

  DanteTooltip.prototype.render = function render() {
    var _this5 = this;

    return React.createElement(
      'div',
      {
        id: 'dante-menu',
        ref: 'dante_menu',
        className: 'dante-menu ' + this.displayActiveMenu() + ' ' + this.displayLinkMode(),
        style: this.getPosition()
      },
      React.createElement(
        'div',
        { className: 'dante-menu-linkinput' },
        React.createElement('input', {
          className: 'dante-menu-input',
          ref: 'dante_menu_input',
          placeholder: 'Paste or type a link',
          onKeyPress: this.handleInputEnter,
          defaultValue: this.getDefaultValue()
        }),
        React.createElement('div', { className: 'dante-menu-button', onMouseDown: this._disableLinkMode })
      ),
      React.createElement(
        'ul',
        { className: 'dante-menu-buttons' },
        this.blockItems().map(function (item, i) {
          return React.createElement(DanteTooltipItem, {
            key: i,
            item: item,
            handleClick: _this5._clickBlockHandler,
            editorState: _this5.props.editorState,
            type: 'block',
            currentStyle: _this5.props.editorState.getCurrentInlineStyle
          });
        }),
        React.createElement(DanteTooltipLink, {
          editorState: this.props.editorState,
          enableLinkMode: this._enableLinkMode
        }),
        this.inlineItems().map(function (item, i) {
          return React.createElement(DanteTooltipItem, {
            key: i,
            item: item,
            type: 'inline',
            editorState: _this5.props.editorState,
            handleClick: _this5._clickInlineHandler
          });
        })
      )
    );
  };

  return DanteTooltip;
}(React.Component);

var DanteTooltipItem = function (_React$Component2) {
  _inherits(DanteTooltipItem, _React$Component2);

  function DanteTooltipItem() {
    _classCallCheck(this, DanteTooltipItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this6 = _possibleConstructorReturn(this, _React$Component2.call.apply(_React$Component2, [this].concat(args)));

    _this6.handleClick = _this6.handleClick.bind(_this6);
    _this6.activeClass = _this6.activeClass.bind(_this6);
    _this6.isActive = _this6.isActive.bind(_this6);
    _this6.activeClassInline = _this6.activeClassInline.bind(_this6);
    _this6.activeClassBlock = _this6.activeClassBlock.bind(_this6);
    _this6.render = _this6.render.bind(_this6);
    return _this6;
  }

  DanteTooltipItem.prototype.handleClick = function handleClick(ev) {
    return this.props.handleClick(ev, this.props.item.style);
  };

  DanteTooltipItem.prototype.activeClass = function activeClass() {
    if (this.isActive()) {
      return "active";
    } else {
      return "";
    }
  };

  DanteTooltipItem.prototype.isActive = function isActive() {
    if (this.props.type === "block") {
      return this.activeClassBlock();
    } else {
      return this.activeClassInline();
    }
  };

  DanteTooltipItem.prototype.activeClassInline = function activeClassInline() {
    if (!this.props.editorState) {
      return;
    }
    //console.log @props.item
    return this.props.editorState.getCurrentInlineStyle().has(this.props.item.style);
  };

  DanteTooltipItem.prototype.activeClassBlock = function activeClassBlock() {
    //console.log "EDITOR STATE", @props.editorState
    if (!this.props.editorState) {
      return;
    }
    var selection = this.props.editorState.getSelection();
    var blockType = this.props.editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    return this.props.item.style === blockType;
  };

  DanteTooltipItem.prototype.render = function render() {
    return React.createElement(
      'li',
      { className: 'dante-menu-button ' + this.activeClass(), onMouseDown: this.handleClick },
      React.createElement('i', { className: 'dante-icon dante-icon-' + this.props.item.label, 'data-action': 'bold' })
    );
  };

  return DanteTooltipItem;
}(React.Component);

var DanteTooltipLink = function (_React$Component3) {
  _inherits(DanteTooltipLink, _React$Component3);

  function DanteTooltipLink() {
    _classCallCheck(this, DanteTooltipLink);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var _this7 = _possibleConstructorReturn(this, _React$Component3.call.apply(_React$Component3, [this].concat(args)));

    _this7.promptForLink = _this7.promptForLink.bind(_this7);
    return _this7;
  }

  DanteTooltipLink.prototype.promptForLink = function promptForLink(ev) {
    var selection = this.props.editorState.getSelection();
    if (!selection.isCollapsed()) {
      return this.props.enableLinkMode(ev);
    }
  };

  DanteTooltipLink.prototype.render = function render() {
    return React.createElement(
      'li',
      { className: 'dante-menu-button', onMouseDown: this.promptForLink },
      React.createElement(
        'i',
        { className: 'dante-icon icon-createlink', 'data-action': 'createlink' },
        'link'
      )
    );
  };

  return DanteTooltipLink;
}(React.Component);

export default DanteTooltip;
