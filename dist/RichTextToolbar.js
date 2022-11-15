"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ActionKey = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var ActionKey;
exports.ActionKey = ActionKey;
(function (ActionKey) {
  ActionKey[ActionKey["undo"] = 0] = "undo";
  ActionKey[ActionKey["redo"] = 1] = "redo";
  ActionKey[ActionKey["bold"] = 2] = "bold";
  ActionKey[ActionKey["italic"] = 3] = "italic";
  ActionKey[ActionKey["underline"] = 4] = "underline";
  ActionKey[ActionKey["unorderedList"] = 5] = "unorderedList";
  ActionKey[ActionKey["orderedList"] = 6] = "orderedList";
  ActionKey[ActionKey["clear"] = 7] = "clear";
  ActionKey[ActionKey["code"] = 8] = "code";
})(ActionKey || (exports.ActionKey = ActionKey = {}));
function RichTextToolbar(props, ref) {
  var id = (0, _react.useId)();
  var [actions, setActions] = (0, _react.useState)([]);
  var createActions = (actionKeys, selectedActionKeys) => {
    return actionKeys.map(key => ({
      key,
      selected: selectedActionKeys.includes(key)
    }));
  };
  var renderAction = action => {
    var iconElement = props.actionMap[action.key](action);
    return <_reactNative.Pressable onPress={() => props.onPress(action.key)}>
                <_reactNative.View style={styles.actionContainer}>{iconElement}</_reactNative.View>
            </_reactNative.Pressable>;
  };
  var keyExtractor = action => "".concat(id, "-").concat(action.key);
  (0, _react.useImperativeHandle)(ref, () => ({
    click: actionKey => {
      props.onPress(actionKey);
    }
  }));
  (0, _react.useEffect)(() => {
    var actionKeys = Object.keys(props.actionMap).map(key => parseInt(key, 10));
    setActions(createActions(actionKeys, props.selectedActionKeys));
  }, [props.actionMap, props.selectedActionKeys]);
  if (actions.length === 0) {
    return null;
  }
  return <_reactNative.View style={[styles.toolbarContainer, props.style]}>
            <_reactNative.FlatList horizontal={true} keyExtractor={keyExtractor} data={actions} alwaysBounceHorizontal={false} showsHorizontalScrollIndicator={false} renderItem={_ref => {
      var {
        item
      } = _ref;
      return renderAction(item);
    }} />
        </_reactNative.View>;
}
var styles = _reactNative.StyleSheet.create({
  toolbarContainer: {},
  actionContainer: {
    marginRight: 8
  }
});
var _default = (0, _react.forwardRef)(RichTextToolbar);
exports.default = _default;