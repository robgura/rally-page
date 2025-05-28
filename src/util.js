/*global Rally */

String.prototype.capFirst = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

export function ownerIfKnown(arti) {
    let owner = '';
    let hasDisplay = false;

    if (arti.Owner) {
        if (arti.Owner.DisplayName) {
            owner = arti.Owner.DisplayName;
            hasDisplay = true;
        }
        else if (arti.Owner.UserName) {
            owner = arti.Owner.UserName;
        }
    }

    if (!hasDisplay) {
        const firstLastNameEmail = owner.match(/([^.]+)\.([^.]+)@.*/);

        if (firstLastNameEmail) {
            owner = firstLastNameEmail[2].capFirst() + ', ' + firstLastNameEmail[1].capFirst();
        }

        const firstInitialEmail = owner.match(/(.)(.+)@/);

        if (firstInitialEmail) {
            owner = firstInitialEmail[1].capFirst() + '. ' + firstInitialEmail[2].capFirst();
        }
    }

    return owner;
}

export function Owner(props) {
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
    if (artifact?.Owner && artifact.Owner._refObjectUUID === '2b6db043-4cca-4a90-9b7d-c00b15925a07') {
        title = 'A software engineer currently from Elk Grove Village, and an Alumnus of Western Illinois University. In 2018 Joe was awarded the W. Garry Johnson Award for Excellence in Student Governance.';
    }

    if (artifact?.Owner && artifact.Owner._refObjectUUID === user._refObjectUUID && now.getHours() !== 9) {
        let meClass = 'me';
        if (artifact.Owner._refObjectUUID === '275cb8d4-d665-4b34-8fc4-4c153e49e40b') {
            meClass = 'matt';
        }

        return <span title={title} className={meClass}> {ownerName} </span>;
    }

    return (
        <span title={title} > {ownerName} </span>
    );
}

export function itemSort2(left, right) {
    if (left.isDefect() && !right.isDefect()) {
        return -1;
    }
    if (!left.isDefect() && right.isDefect()) {
        return 1;
    }

    if (left.data.ScheduleState === 'Completed' && right.data.ScheduleState !== 'Completed') {
        return -1;
    }

    if (left.data.ScheduleState !== 'Completed' && right.data.ScheduleState === 'Completed') {
        return 1;
    }

    if (left.data.ScheduleState === 'Completed' && right.data.ScheduleState === 'Completed') {
        if (left.data.Blocked && !right.data.Blocked) {
            return -1;
        }
        if (!left.data.Blocked && right.data.Blocked) {
            return 1;
        }
    }

    if (left.data.ScheduleState === 'In-Progress' && right.data.ScheduleState !== 'In-Progress') {
        return -1;
    }

    if (left.data.ScheduleState !== 'In-Progress' && right.data.ScheduleState === 'In-Progress') {
        return 1;
    }

    if (left.data.ScheduleState === 'In-Progress' && right.data.ScheduleState === 'In-Progress') {
        if (left.data.Blocked && !right.data.Blocked) {
            return -1;
        }
        if (!left.data.Blocked && right.data.Blocked) {
            return 1;
        }
    }

    if (left.data.Priority === 'Immediate' && right.data.Priority !== 'Immediate') {
        return -1;
    }

    if (left.data.Priority !== 'Immediate' && right.data.Priority === 'Immediate') {
        return -1;
    }

    if (left.data.Priority === 'Critical' && right.data.Priority !== 'Critical') {
        return -1;
    }

    if (left.data.Priority !== 'Critical' && right.data.Priority === 'Critical') {
        return -1;
    }

    if (left.data.Priority === 'High' && right.data.Priority !== 'High') {
        return -1;
    }

    if (left.data.Priority !== 'High' && right.data.Priority === 'High') {
        return -1;
    }

    if (left.data.Priority === 'Normal' && right.data.Priority !== 'Normal') {
        return -1;
    }

    if (left.data.Priority !== 'Normal' && right.data.Priority === 'Normal') {
        return 1;
    }

    if (left.data.Priority === 'Low' && right.data.Priority !== 'Low') {
        return -1;
    }

    if (left.data.Priority !== 'Low' && right.data.Priority === 'Low') {
        return 1;
    }

    const leftOwner = ownerIfKnown(left.data);
    const rightOwner = ownerIfKnown(right.data);
    const ownerCompare = leftOwner.localeCompare(rightOwner);
    if (ownerCompare !== 0) {
        return ownerCompare;
    }

    return left.data.FormattedID.localeCompare(right.data.FormattedID);
}

export function taskSort(left, right) {
    if (left.data.State === 'Completed' && right.data.State !== 'Completed') {
        return -1;
    }

    if (left.data.State !== 'Completed' && right.data.State === 'Completed') {
        return 1;
    }

    if (left.data.State === 'In-Progress' && right.data.State !== 'In-Progress') {
        return -1;
    }

    if (left.data.State !== 'In-Progress' && right.data.State === 'In-Progress') {
        return 1;
    }

    if (left.data.State === 'Defined' && right.data.State !== 'Defined') {
        return -1;
    }

    if (left.data.State !== 'Defined' && right.data.State === 'Defined') {
        return 1;
    }

    if (!left.data.Blocked && right.data.Blocked) {
        return -1;
    }

    if (left.data.Blocked && !right.data.Blocked) {
        return 1;
    }

    return left.data.FormattedID.localeCompare(right.data.FormattedID);
}

export function getBlockedHtml(item) {
    if (item.Blocked) {
        const icon = <span style={{ fontSize: '22px' }} > {String.fromCodePoint(11042)} </span>;
        // if (item.BlockedReason.match(/pr/i)) {
        //     const pr = true;
        // }

        const style = {
            color: 'red',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5em',
            justifyContent: 'space-evenly',
        };
        return <span style={style}> {icon} {item.BlockedReason || null} </span>;
    }
}

export function getLink(model) {
    return Rally.nav.Manager.getDetailUrl(model);
}
