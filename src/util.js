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

export function itemSort(left, rite) {
    const computedValue = function(item) {
        let rv = 0;

        if (item.State === 'Completed' || item.ScheduleState === 'Completed') {
            rv += 1000;

            if (!item.Blocked) {
                rv += 100;
            }
        }
        else if (item.State === 'In-Progress' || item.ScheduleState === 'In-Progress') {
            rv += 2000;

            if (!item.Blocked) {
                rv += 100;
            }
        }
        else {
            rv += 3000;
            if (item.Blocked) {
                rv += 100;
            }
        }

        if (item.Priority === 'Immediate' || item.Priority === 'Critical') { rv += 10; }
        else if (item.Priority === 'High') { rv += 20; }
        else if (item.Priority === 'Normal') { rv += 30; }
        else if (item.Priority === 'Low') { rv += 40; }
        else { rv += 50; }

        return rv;
    };

    let rv = computedValue(left.data) - computedValue(rite);
    if (rv === 0) {
        const leftOwner = ownerIfKnown(left.data);
        const riteOwner = ownerIfKnown(rite);
        rv = leftOwner.localeCompare(riteOwner);

        if (rv === 0) {
            // if left and rite are both defects sort by defect number as a proxy for age
            if (left.isDefect() && rite.isDefect()) {
                const mm_l = left.data.FormattedID.match(/(?<type>\D+)(?<number>\d+)/);
                const mm_r = rite.data.FormattedID.match(/(?<type>\D+)(?<number>\d+)/);
                rv = parseInt(mm_l.groups.number, 10) - parseInt(mm_r.groups.number, 10);
            }
            else {
                if ((left.data.TaskIndex || left.data.TaskIndex === 0) && (rite.data.TaskIndex || rite.data.TaskIndex === 0)) {
                    rv = left.data.TaskIndex - rite.data.TaskIndex;
                }
                else if (left.data.Rank && rite.data.Rank) {
                    rv = left.data.Rank - rite.data.Rank;
                }
            }

        }
    }
    if (rv < 0) {
        rv = -1;
    }
    else if (rv > 0) {
        rv = 1;
    }
    return rv;
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
