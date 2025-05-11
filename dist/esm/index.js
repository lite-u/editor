import Editor from './main/editor.js';
import convertUnit from './core/converter.js';
import nid from './core/nid.js';
export { Editor, nid, convertUnit };
export var Unit;
(function (Unit) {
    Unit["MM"] = "mm";
    Unit["INCHES"] = "inches";
    Unit["PX"] = "px";
    Unit["CM"] = "cm";
})(Unit || (Unit = {}));
