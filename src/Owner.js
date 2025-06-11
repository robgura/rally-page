/*global */

import {
    ownerIfKnown,
    who,
} from './util.js';

export default function Owner(props) {
    const {
        artifact,
        user,
    } = props;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const minutesSinceMidnight = (hours * 60) + minutes;

    let ownerName = '?';

    if (now.getDay() === 3 && minutesSinceMidnight >= 840 && minutesSinceMidnight <= 870) {
        ownerName = String.fromCodePoint(9749);
    }
    else {
        ownerName = ownerIfKnown(artifact);
    }

    let title = null;
    if (who(artifact?.Owner) === 'joe') {
        title = 'A software engineer currently from Elk Grove Village, and an Alumnus of Western Illinois University. In 2018 Joe was awarded the W. Garry Johnson Award for Excellence in Student Governance.';
    }

    if (artifact?.Owner && artifact.Owner._refObjectUUID === user._refObjectUUID && now.getHours() !== 9) {
        return <span title={title} className="me"> {ownerName} </span>;
    }

    return (
        <span title={title} > {ownerName} </span>
    );
}
