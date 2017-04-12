import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ReactDOM from 'react-dom';

import { Entity, RichUtils, AtomicBlockUtils, EditorState } from 'draft-js';

import { addNewBlock, resetBlockWithType, updateDataOfBlock, getCurrentBlock, getNode } from '../../model/index.js';

import { getSelectionRect, getSelection } from "../../utils/selection.js";

var DanteInlineTooltip = function (_React$Component) {
  _inherits(DanteInlineTooltip, _React$Component);

  function DanteInlineTooltip(props) {
    _classCallCheck(this, DanteInlineTooltip);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.display = _this.display.bind(_this);
    _this.show = _this.show.bind(_this);
    _this.hide = _this.hide.bind(_this);
    _this._toggleScaled = _this._toggleScaled.bind(_this);
    _this.scale = _this.scale.bind(_this);
    _this.collapse = _this.collapse.bind(_this);
    _this.componentWillReceiveProps = _this.componentWillReceiveProps.bind(_this);
    _this.clickOnFileUpload = _this.clickOnFileUpload.bind(_this);
    _this.handlePlaceholder = _this.handlePlaceholder.bind(_this);
    _this.insertImage = _this.insertImage.bind(_this);
    _this.handleFileInput = _this.handleFileInput.bind(_this);
    _this.widgets = _this.widgets.bind(_this);
    _this.clickHandler = _this.clickHandler.bind(_this);
    _this.relocate = _this.relocate.bind(_this);
    _this.state = {
      position: { top: 0, left: 0 },
      show: false,
      scaled: false
    };
    return _this;
  }

  DanteInlineTooltip.prototype.display = function display(b) {
    if (b) {
      return this.show();
    } else {
      return this.hide();
    }
  };

  DanteInlineTooltip.prototype.show = function show() {
    return this.setState({
      show: true });
  };

  DanteInlineTooltip.prototype.hide = function hide() {
    return this.setState({
      show: false });
  };

  DanteInlineTooltip.prototype.setPosition = function setPosition(coords) {
    return this.setState({
      position: coords });
  };

  DanteInlineTooltip.prototype._toggleScaled = function _toggleScaled(ev) {
    if (this.state.scaled) {
      return this.collapse();
    } else {
      return this.scale();
    }
  };

  DanteInlineTooltip.prototype.scale = function scale() {
    return this.setState({
      scaled: true });
  };

  DanteInlineTooltip.prototype.collapse = function collapse() {
    return this.setState({
      scaled: false });
  };

  DanteInlineTooltip.prototype.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    return this.collapse();
  };

  DanteInlineTooltip.prototype.activeClass = function activeClass() {
    //if @props.show then "is-active" else ""
    if (this.isActive()) {
      return "is-active";
    } else {
      return "";
    }
  };

  DanteInlineTooltip.prototype.isActive = function isActive() {
    return this.state.show;
  };

  DanteInlineTooltip.prototype.scaledClass = function scaledClass() {
    if (this.state.scaled) {
      return "is-scaled";
    } else {
      return "";
    }
  };

  DanteInlineTooltip.prototype.scaledWidth = function scaledWidth() {
    if (this.state.scaled) {
      return "124";
    } else {
      return "0";
    }
  };

  DanteInlineTooltip.prototype.clickOnFileUpload = function clickOnFileUpload() {
    this.refs.fileInput.click();
    this.collapse();
    return this.hide();
  };

  DanteInlineTooltip.prototype.handlePlaceholder = function handlePlaceholder(input) {
    var opts = {
      type: input.widget_options.insert_block,
      placeholder: input.options.placeholder,
      endpoint: input.options.endpoint
    };

    return this.props.onChange(resetBlockWithType(this.props.editorState, 'placeholder', opts));
  };

  DanteInlineTooltip.prototype.insertImage = function insertImage(file) {
    var opts = {
      url: URL.createObjectURL(file),
      file: file
    };

    return this.props.onChange(addNewBlock(this.props.editorState, 'image', opts));
  };

  DanteInlineTooltip.prototype.handleFileInput = function handleFileInput(e) {
    var fileList = e.target.files;
    // TODO: support multiple file uploads
    /*
    Object.keys(fileList).forEach (o)=>
      @.insertImage(fileList[0])
    */
    return this.insertImage(fileList[0]);
  };

  DanteInlineTooltip.prototype.widgets = function widgets() {
    return this.props.editor.widgets;
  };

  DanteInlineTooltip.prototype.clickHandler = function clickHandler(e, type) {
    var request_block = this.widgets().find(function (o) {
      return o.icon === type;
    });

    switch (request_block.widget_options.insertion) {
      case "upload":
        return this.clickOnFileUpload(e, request_block);
      case "placeholder":
        return this.handlePlaceholder(request_block);
      default:
        return console.log('WRONG TYPE FOR ' + request_block.widget_options.insertion);
    }
  };

  DanteInlineTooltip.prototype.getItems = function getItems() {
    return this.widgets().filter(function (o) {
      return o.widget_options.displayOnInlineTooltip;
    });
  };

  DanteInlineTooltip.prototype.isDescendant = function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  DanteInlineTooltip.prototype.relocate = function relocate() {
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
      var coords = selectionBoundary; //utils.getSelectionDimensions(node)

      var parent = ReactDOM.findDOMNode(this.props.editor);
      var parentBoundary = parent.getBoundingClientRect();

      // hide if selected node is not in editor
      // debugger
      //console.log @isDescendant(parent, nativeSelection.anchorNode)

      if (!this.isDescendant(parent, nativeSelection.anchorNode)) {
        this.hide();
        return;
      }

      // checkeamos si esta vacio
      this.display(block.getText().length === 0 && blockType === "unstyled");
      return this.setPosition({
        top: coords.top + window.scrollY,
        left: coords.left + window.scrollX - 60
      });

      /*
      @refs.image_popover.display(blockType is "image")
       if blockType is "image"
        selectionBoundary = node.anchorNode.parentNode.parentNode.parentNode.getBoundingClientRect()
        *el = document.querySelector("#dante_image_popover")
        el = @refs.image_popover.refs.image_popover
        padd   = el.offsetWidth / 2
        @refs.image_popover.setPosition
          top: selectionBoundary.top - parentBoundary.top + 60
          left: selectionBoundary.left + (selectionBoundary.width / 2) - padd
         *@setState
        *  image_popover_position:
        *    top: selectionBoundary.top - parentBoundary.top + 60
        *    left: selectionBoundary.left + (selectionBoundary.width / 2) - padd
        *
      */
    } else {
      return this.hide();
    }
  };

  DanteInlineTooltip.prototype.render = function render() {
    var _this2 = this;

    return React.createElement(
      'div',
      {
        className: 'inlineTooltip ' + this.activeClass() + ' ' + this.scaledClass(),
        style: this.state.position
      },
      React.createElement(
        'button',
        {
          className: 'inlineTooltip-button control',
          title: 'Close Menu',
          'data-action': 'inline-menu',
          onClick: this._toggleScaled
        },
        React.createElement('span', { className: 'tooltip-icon dante-icon-plus' })
      ),
      React.createElement(
        'div',
        {
          className: 'inlineTooltip-menu',
          style: { width: this.scaledWidth() + 'px' }
        },
        this.getItems().map(function (item, i) {
          return React.createElement(InlineTooltipItem, {
            item: item,
            key: i,
            clickHandler: _this2.clickHandler
          });
        }),
        React.createElement('input', {
          type: 'file',
          style: { display: 'none' },
          ref: 'fileInput',
          multiple: 'multiple',
          onChange: this.handleFileInput
        })
      )
    );
  };

  return DanteInlineTooltip;
}(React.Component);

var InlineTooltipItem = function (_React$Component2) {
  _inherits(InlineTooltipItem, _React$Component2);

  function InlineTooltipItem() {
    _classCallCheck(this, InlineTooltipItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this3 = _possibleConstructorReturn(this, _React$Component2.call.apply(_React$Component2, [this].concat(args)));

    _this3.clickHandler = _this3.clickHandler.bind(_this3);
    return _this3;
  }

  InlineTooltipItem.prototype.clickHandler = function clickHandler(e) {
    e.preventDefault();
    return this.props.clickHandler(e, this.props.item.icon);
  };

  InlineTooltipItem.prototype.render = function render() {
    return React.createElement(
      'button',
      {
        className: 'inlineTooltip-button scale',
        title: this.props.title,
        onMouseDown: this.clickHandler
      },
      React.createElement('span', { className: 'tooltip-icon dante-icon-' + this.props.item.icon })
    );
  };

  return InlineTooltipItem;
}(React.Component);

export default DanteInlineTooltip;