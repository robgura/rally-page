/*global React */

export default function StateView(props) {

    const {
        item,
        onSave,
    } = props;

    const save = React.useCallback(() => {
        item.save({
            callback: onSave,
        });
    }, [item, onSave]);

    const saveState = (ss) => {
        item.set('State', ss);
        save();
    };

    const saveScheduleState = (ss) => {
        item.set('ScheduleState', ss);
        save();
    };

    if (item.isTask()) {
        if (item.data.State === 'Defined') {
            return (
                <div className="state-view-container">
                    <div className="box-letter yes" onClick={() => saveState('Defined')}> D </div>
                    <div className="box-letter" onClick={() => saveState('In-Progress')}> P </div>
                    <div className="box-letter" onClick={() => saveState('Completed')}> C </div>
                </div>
            );
        }
        if (item.data.State === 'In-Progress') {
            return (
                <div className="state-view-container">
                    <div className="box-letter yes" onClick={() => saveState('Defined')}> D </div>
                    <div className="box-letter yes" onClick={() => saveState('In-Progress')}> P </div>
                    <div className="box-letter" onClick={() => saveState('Completed')}> C </div>
                </div>
            );
        }
        if (item.data.State === 'Completed') {
            return (
                <div className="state-view-container">
                    <div className="box-letter yes" onClick={() => saveState('Defined')}> D </div>
                    <div className="box-letter yes" onClick={() => saveState('In-Progress')}> P </div>
                    <div className="box-letter yes" onClick={() => saveState('Completed')}> C </div>
                </div>
            );
        }
        return (
            <div> {item.data.State} </div>
        );
    }
    if (item.data.ScheduleState === 'Defined') {
        return (
            <div className="state-view-container">
                <div className="box-letter yes" onClick={() => saveScheduleState('Defined')}> D </div>
                <div className="box-letter" onClick={() => saveScheduleState('In-Progress')}> P </div>
                <div className="box-letter" onClick={() => saveScheduleState('Completed')}> C </div>
                <div className="box-letter" onClick={() => saveScheduleState('Accepted')}> A </div>
            </div>
        );
    }
    if (item.data.ScheduleState === 'In-Progress') {
        return (
            <div className="state-view-container">
                <div className="box-letter yes" onClick={() => saveScheduleState('Defined')}> D </div>
                <div className="box-letter yes" onClick={() => saveScheduleState('In-Progress')}> P </div>
                <div className="box-letter" onClick={() => saveScheduleState('Completed')}> C </div>
                <div className="box-letter" onClick={() => saveScheduleState('Accepted')}> A </div>
            </div>
        );
    }
    if (item.data.ScheduleState === 'Completed') {
        return (
            <div className="state-view-container">
                <div className="box-letter yes" onClick={() => saveScheduleState('Defined')}> D </div>
                <div className="box-letter yes" onClick={() => saveScheduleState('In-Progress')}> P </div>
                <div className="box-letter yes" onClick={() => saveScheduleState('Completed')}> C </div>
                <div className="box-letter" onClick={() => saveScheduleState('Accepted')}> A </div>
            </div>
        );
    }
    if (item.data.ScheduleState === 'Accepted') {
        return (
            <div className="state-view-container">
                <div className="box-letter yes" onClick={() => saveScheduleState('Defined')}> D </div>
                <div className="box-letter yes" onClick={() => saveScheduleState('In-Progress')}> P </div>
                <div className="box-letter yes" onClick={() => saveScheduleState('Completed')}> C </div>
                <div className="box-letter yes" onClick={() => saveScheduleState('Accepted')}> A </div>
            </div>
        );
    }
    return (
        <div> {item.data.ScheduleState} </div>
    );
}
