"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RichTextEditor;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeWebview = require("react-native-webview");
var _editor = _interopRequireDefault(require("./editor"));
var _RichTextToolbar = _interopRequireWildcard(require("./RichTextToolbar"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
// let htmlSource = require('./editor.html');
// if (Platform.OS === 'android' || Platform.OS === 'web') {
var htmlSource = {
  html: _editor.default
};
// }

function RichTextEditor(props) {
  var _props$minHeight;
  var editorStyle = _reactNative.StyleSheet.flatten(props.editorStyle);
  var linkStyle = _reactNative.StyleSheet.flatten(props.linkStyle);
  var [value, setValue] = (0, _react.useState)(props.value);
  var [inited, setInited] = (0, _react.useState)(false);
  var [minHeight] = (0, _react.useState)((_props$minHeight = props.minHeight) !== null && _props$minHeight !== void 0 ? _props$minHeight : 40);
  var [height, setHeight] = (0, _react.useState)(minHeight);
  var [selectedActionKeys, setSelectedActionKeys] = (0, _react.useState)([]);
  var webViewRef = (0, _react.useRef)(null);
  var toolbarRef = (0, _react.useRef)(null);
  var Actions = {
    changeHtml: html => {
      setValue(html);
      props.onValueChange(html);
    },
    changeHeight: newHeight => {
      if (newHeight < minHeight) {
        newHeight = minHeight;
      }
      var offset = (editorStyle === null || editorStyle === void 0 ? void 0 : editorStyle.fontSize) || 16;
      setHeight(newHeight + offset);
    },
    onClickLink: url => {
      if (props.onClickLink) {
        return props.onClickLink(url);
      }
      _reactNative.Linking.openURL(url);
    },
    onFocus: () => {
      var _props$onFocus;
      (_props$onFocus = props.onFocus) === null || _props$onFocus === void 0 ? void 0 : _props$onFocus.call(props);
    },
    onBlur: () => {
      var _props$onBlur;
      (_props$onBlur = props.onBlur) === null || _props$onBlur === void 0 ? void 0 : _props$onBlur.call(props);
    },
    log: message => {
      if (props.debug) {
        console.log(message);
      }
    }
  };
  var sendAction = (0, _react.useCallback)((type, data) => {
    var _webViewRef$current;
    if (data === undefined || data === null) {
      return;
    }
    var message = JSON.stringify({
      type,
      data
    });
    (_webViewRef$current = webViewRef.current) === null || _webViewRef$current === void 0 ? void 0 : _webViewRef$current.postMessage(message);
  }, [webViewRef]);
  var onMessage = _ref => {
    var {
      nativeEvent
    } = _ref;
    try {
      var message = JSON.parse(nativeEvent.data);
      var action = Actions[message === null || message === void 0 ? void 0 : message.type];
      if (action) {
        action(message.data);
      } else {
        console.warn("Missing Actions.".concat(message.type, " method"));
      }
    } catch (e) {
      console.error('onMessage: ', e);
    }
  };
  var onLoad = () => {
    setInited(true);
  };
  var onError = _ref2 => {
    var {
      nativeEvent
    } = _ref2;
    console.warn('WebView error: ', nativeEvent);
  };
  var onPress = actionKey => {
    if (!props.disabled) {
      handleSelectedActionKeys(actionKey);
      sendAction(_RichTextToolbar.ActionKey[actionKey], '');
    }
  };
  var handleSelectedActionKeys = actionKey => {
    if (actionKey === _RichTextToolbar.ActionKey.code) {
      var contains = selectedActionKeys.includes(_RichTextToolbar.ActionKey.code);
      var actionKeys = contains ? [] : [_RichTextToolbar.ActionKey.code];
      setSelectedActionKeys(actionKeys);
    }
  };
  (0, _react.useEffect)(() => {
    setValue(props.value);
  }, [inited, props.value]);
  (0, _react.useEffect)(() => {
    if (inited) {
      sendAction('setHtml', value);
    }
  }, [inited, value, sendAction]);
  (0, _react.useEffect)(() => {
    if (inited) {
      sendAction('setColor', editorStyle === null || editorStyle === void 0 ? void 0 : editorStyle.color);
      sendAction('setFontFamily', editorStyle === null || editorStyle === void 0 ? void 0 : editorStyle.fontFamily);
      sendAction('setFontSize', editorStyle === null || editorStyle === void 0 ? void 0 : editorStyle.fontSize);
      sendAction('setLinkColor', linkStyle === null || linkStyle === void 0 ? void 0 : linkStyle.color);
      sendAction('setSelectionColor', props.selectionColor);
    }
  }, [inited, editorStyle, linkStyle, props.selectionColor, sendAction]);
  (0, _react.useEffect)(() => {
    if (inited) {
      sendAction('setDisabled', !!props.disabled);
    }
  }, [inited, props.disabled, sendAction]);
  return <>
            {props.actionMap && <_RichTextToolbar.default ref={toolbarRef} style={props.toolbarStyle} actionMap={props.actionMap} selectedActionKeys={selectedActionKeys} onPress={onPress} />}
            <_reactNative.View style={[styles.editorContainer, editorStyle]}>
                <_reactNativeWebview.WebView ref={webViewRef} source={htmlSource} style={[styles.webView, {
        height
      }]} textZoom={100} scrollEnabled={false} hideKeyboardAccessoryView={true} keyboardDisplayRequiresUserAction={false} onMessage={onMessage} originWhitelist={['*']} dataDetectorTypes={'none'} bounces={false} onLoad={onLoad} onError={onError} />
            </_reactNative.View>
        </>;
}
var styles = _reactNative.StyleSheet.create({
  editorContainer: {
    flex: 1
  },
  webView: {
    flex: 0,
    backgroundColor: 'transparent'
  }
});