/*global */

import {
    simpleHash,
} from './util.js';

export default function HashedColor(props) {

    const {
        text,
        lightness,
    } = props;

    let hsh = simpleHash(text) % 360;
    const _lightness = lightness || '20%';
    const style = {
        backgroundColor: `hsl(${hsh}, 100%, ${_lightness})`,
    };

    return (
        <span style={style} className="pill"> {text} </span>
    );
}
