/*global React */

export default function Action(props) {

    const {
        artifact,
        onSave,
        user,
    } = props;

    let buttons = [];

    const save = () => {
        artifact.save({
            callback: onSave,
        });
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

    if (artifact.isDefect()) {
        if (artifact?.data?.ScheduleState === 'Defined') {
            buttons.push(
                <div key="take" className="button" onClick={take}>
                    Take
                </div>
            );
        }

        if (artifact?.data?.ScheduleState === 'In-Progress') {
            buttons.push(
                <div key="block-on-pr" className="button" onClick={blockOnPR}>
                    Block on PR
                </div>
            );
            buttons.push(
                <div key="ditch" className="button" onClick={ditch}>
                    Ditch
                </div>
            );
        }

        if (artifact?.data?.ScheduleState === 'Completed' && artifact.data.BlockedReason === 'PR') {
            buttons.push(
                <div key="close" className="button" onClick={closeOut}>
                    Close
                </div>
            );
        }
    }

    if (artifact.isTask()) {
        if (artifact?.data?.State === 'Defined') {
            buttons.push(
                <div key="take" className="button" onClick={take}>
                    Take
                </div>
            );
        }

        if (artifact?.data?.State === 'In-Progress') {
            buttons.push(
                <div key="block-on-pr" className="button" onClick={blockOnPR}>
                    Block on PR
                </div>
            );
            buttons.push(
                <div key="ditch" className="button" onClick={ditch}>
                    Ditch
                </div>
            );
        }

        if (artifact?.data?.State === 'Completed' && artifact.data.BlockedReason === 'PR') {
            buttons.push(
                <div key="close-out" className="button" onClick={closeOut}>
                    Close
                </div>
            );
        }
    }

    return (
        <div className="action">
            {buttons}
        </div>
    );

}
