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
        let reason = 'Blocked';
        if (item.BlockedReason && item.BlockedReason.match(/pr/i)) {
            reason = item.BlockedReason;
        }
        else {
            const br = item.BlockedReason;
            if (!br) {
                reason = 'Blocked';
            }
        }

        const style = {
            color: 'red',
        };
        return <span style={style}> {reason} </span>;
    }
}

export function getLink(model) {
    return Rally.nav.Manager.getDetailUrl(model);
}
