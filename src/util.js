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

function priorityCompare(left, right) {
    if (left.data.Priority === 'Immediate' && right.data.Priority !== 'Immediate') {
        return -1;
    }

    if (left.data.Priority !== 'Immediate' && right.data.Priority === 'Immediate') {
        return 1;
    }

    if (left.data.Priority === 'Critical' && right.data.Priority !== 'Critical') {
        return -1;
    }

    if (left.data.Priority !== 'Critical' && right.data.Priority === 'Critical') {
        return 1;
    }

    if (left.data.Priority === 'High' && right.data.Priority !== 'High') {
        return -1;
    }

    if (left.data.Priority !== 'High' && right.data.Priority === 'High') {
        return 1;
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

    return 0;
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

        const pValue = priorityCompare(left, right);
        if (pValue !== 0) {
            return pValue;
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

        const pValue = priorityCompare(left, right);
        if (pValue !== 0) {
            return pValue;
        }
    }

    const pValue = priorityCompare(left, right);
    if (pValue !== 0) {
        return pValue;
    }

    if (left.data.c_IsCustomer && !right.data.c_IsCustomer) {
        return -1;
    }

    if (!left.data.c_IsCustomer && right.data.c_IsCustomer) {
        return 1;
    }

    // the return values are swapped because Internal will go at the end
    if (left.data.Severity === 'Internal' && right.data.Severity !== 'Internal') {
        return 1;
    }

    if (left.data.Severity !== 'Internal' && right.data.Severity === 'Internal') {
        return -1;
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

        if (item.BlockedReason) {
            return (
                <div className='blocked'>
                    <span>{icon}</span>
                    {item.BlockedReason}
                </div>
            );
        }
        return <span className='blocked'>{icon}</span>;
    }
}

export function getLink(model) {
    return Rally.nav.Manager.getDetailUrl(model);
}

const UserMap = {
    'dj': 'a375ddac-0210-4b35-a2c7-5a6dc126b4e1',
    'filipe': '99025ed1-84f6-4141-a6ac-2f14ca381266',
    'jack': '780d5844-efd8-42ae-be55-1253701babe0',
    'jake': '4b00aca8-8eb5-4f5e-9a39-1ed9e55ca7e6',
    'jeff': '32ce4a4b-1976-4cd2-91c0-8dcefa9f254b',
    'joe': '2b6db043-4cca-4a90-9b7d-c00b15925a07',
    'kristen': 'bee30687-fc8c-4bfa-996c-c5125ae229c8',
    'matt': '275cb8d4-d665-4b34-8fc4-4c153e49e40b',
    'lauren': '53a1b702-a863-4780-a783-76135e6ecb66', // matt k
    'antonio': '647d23bf-f38a-450a-bf01-8f193c9b3c8b',
    'rob': '839ab687-1c66-4788-9328-c5d47c74b1bf',
};

const UserIdMap = Object.entries(UserMap).reduce((acc, [key, value]) => { acc[value] = key; return acc; }, {});

export function who(user) {
    return UserIdMap[user?._refObjectUUID] || 'unknown';
}
