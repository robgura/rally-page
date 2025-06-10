/*global */

export default function Action(props) {

    const {
        artifact,
        onSave,
        user,
    } = props;

    const isMine = artifact.data?.Owner && artifact.data.Owner._refObjectUUID === user._refObjectUUID;

    const save = () => {
        artifact.save({
            callback: onSave,
        });
    };

    const unblock = () => {
        artifact.set('Blocked', false);
        save();
    };

    const blockOnPR = () => {
        if (artifact.isTask()) {
            artifact.set('State', 'Completed');
        }
        else {
            artifact.set('ScheduleState', 'Completed');
        }

        if (artifact.isDefect()) {
            artifact.set('State', 'Fixed');
            artifact.set('Resolution', 'Code Change');
            artifact.set('Fixed In Build', artifact.data.Release.Name);
        }

        artifact.set('Blocked', true);
        artifact.set('BlockedReason', 'PR');
        save();
    };

    const closeOut = () => {
        artifact.set('Blocked', false);
        save();
    };

    const take = () => {
        if (artifact.isTask()) {
            artifact.set('State', 'In-Progress');
        }
        else {
            artifact.set('ScheduleState', 'In-Progress');
        }

        artifact.set('Owner', user);
        artifact.set('Blocked', false);
        save();
    };

    const takeOwnerOnly = () => {
        artifact.set('Owner', user);
        save();
    };

    const ditch = () => {
        if (artifact.isTask()) {
            artifact.set('State', 'Defined');
        }
        else {
            artifact.set('ScheduleState', 'Defined');
        }

        artifact.set('Owner', null);
        save();
    };

    const Mapper = {
        'Defined': {
            mine: [
                {
                    label: 'Start',
                    func: take,
                },
                {
                    label: 'Ditch',
                    func: ditch,
                }
            ],
            other: [
                {
                    label: 'Take',
                    func: take,
                },
            ]
        },
        'In-Progress': {
            mine: [
                {
                    label: 'Block on PR',
                    func: blockOnPR,
                },
                {
                    label: 'Ditch',
                    func: ditch,
                }
            ],
            other: [
                {
                    label: 'Take',
                    func: take,
                },
            ]
        },
        'Completed': {
            mine: [
                {
                    label: 'Close',
                    func: closeOut,
                },
                {
                    label: 'Re-Open',
                    func: take,
                },
            ],
            other: [
                {
                    label: 'Take',
                    func: takeOwnerOnly,
                },
            ]
        }
    };

    let state;
    if (artifact.isDefect()) {
        state = artifact.data.ScheduleState;
    }
    else {
        state = artifact.data.State;
    }

    const buttonConfigs = Mapper[state][isMine ? 'mine' : 'other'] || [];
    const buttons = buttonConfigs.map((bb) => {
        return (
            <div key={bb.label} className="button" onClick={bb.func}>
                {bb.label}
            </div>
        );
    });

    if (state !== 'Completed' && artifact.data.Blocked) {
        buttons.push(
            <div key="unblock" className="button" onClick={unblock}>
                Unblock
            </div>
        );
    }

    return (
        <div className="action">
            {buttons}
        </div>
    );

}
