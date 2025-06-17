/*global */

// cSpell: ignore Cust

import TaskTable from './TaskTable.js';

import {
    getBlockedHtml,
    getLink,
} from './util.js';
import Owner from './Owner.js';

export function demoStorySort(left, right) {
    if (left.isDefect() && !right.isDefect()) {
        return -1;
    }
    if (!left.isDefect() && right.isDefect()) {
        return 1;
    }
    if (left.isDefect() && right.isDefect()) {
        return left.data.FormattedID.localeCompare(right.data.FormattedID);
    }

    if (left.data.c_Lifecycle === 'Demo' && right.data.c_Lifecycle !== 'Demo') {
        return -1;
    }

    if (left.data.c_Lifecycle !== 'Demo' && right.data.c_Lifecycle === 'Demo') {
        return 1;
    }

    const leftDone = left.data.ScheduleState === 'Completed' && !left.data.Blocked;
    const rightDone = right.data.ScheduleState === 'Completed' && !right.data.Blocked;

    if (leftDone && !rightDone) {
        return -1;
    }

    if (!leftDone && rightDone) {
        return 1;
    }

    let remaining = left.data.TaskRemainingTotal - right.data.TaskRemainingTotal;
    if (remaining !== 0) {
        return remaining;
    }

    let iteration = left.data.Iteration.Name.localeCompare(right.data.Iteration.Name);
    if (iteration !== 0) {
        return iteration;
    }

    return left.data.FormattedID.localeCompare(right.data.FormattedID);
}

export default function UserStoryTable(props) {

    const {
        onSave,
        records,
        user,
    } = props;

    const renderRecords = () => {
        return records
            .filter((_rr) => {
                return true;
            })
            .sort(demoStorySort)
            .map((rr) => {
                let artClassName;
                if (rr.isDefect()) {
                    artClassName = 'defect-id';
                }
                else if (rr.isUserStory()) {
                    artClassName = 'story-id';
                }
                const save = () => {
                    rr.save({
                        callback: onSave,
                    });
                };

                const moveToImplement = () => {
                    rr.set('c_Lifecycle', 'Implement');
                    save();
                };

                const moveToComplete = () => {
                    rr.set('c_Lifecycle', 'Complete');
                    save();
                };

                const moveToDemo = () => {
                    rr.set('c_Lifecycle', 'Demo');
                    save();
                };

                const getEstimate = () => {
                    if (rr.data.PlanEstimate || rr.data.PlanEstimate === 0) {
                        return <span className="story-estimate">{rr.data.PlanEstimate}</span>;
                    }
                };
                const getLifeCycleButton = () => {
                    let rv = [];
                    if (rr.data.c_Lifecycle === 'Complete') {
                        return null;
                    }
                    if (rr.data.ScheduleState === 'Completed' && !rr.data.Blocked && rr.data.c_Lifecycle !== 'Demo' && rr.data.c_Lifecycle !== 'Complete') {
                        rv.push(
                            <span key='move-to-demo' className="action">
                                <span key="move-to-demo" className="button lifecycle" onClick={moveToDemo}>
                                    Move to Demo
                                </span>
                            </span>
                        );
                    }
                    if (rr.data.c_Lifecycle !== 'Implement') {
                        rv.push(
                            <span key="move-to-implement" className="action">
                                <span key="move-to-implement" className="button lifecycle" onClick={moveToImplement}>
                                    Move to Implement
                                </span>
                            </span>
                        );
                    }
                    if (rr.data.c_Lifecycle === 'Demo') {
                        rv.push(
                            <span key="move-to-complete" className="action">
                                <span key="move-to-implement" className="button lifecycle" onClick={moveToComplete}>
                                    Move to Complete
                                </span>
                            </span>
                        );
                    }
                    return rv;
                };

                const renderTaskTable = () => {
                    if (rr.data.ScheduleState !== 'Completed' && rr.data.ScheduleState !== 'Accepted') {
                        return <TaskTable model={rr} user={user} onSave={onSave} />;
                    };
                };

                return (
                    <div className="story-chunk" key={rr.data.FormattedID}>
                        <div className="story-title">
                            <span className="release-name">{rr.data.Release.Name}</span>
                            <span className={artClassName}>{rr.data.FormattedID}</span>
                            <span className="artifact-title"> <a href={getLink(rr)}> {rr.data.Name} </a> </span>
                            <span className=""> {rr.data.Iteration?.Name} </span>
                            <span className="lifecycle lifecycle-name"> {rr.data.c_Lifecycle} </span>
                            {getLifeCycleButton()}
                            {getEstimate()}
                            {getBlockedHtml(rr.data)}
                            <span className="story-owner">
                                <Owner artifact={rr.data} user={user} />
                            </span>
                        </div>
                        {renderTaskTable()}
                    </div>
                );
            });
    };
    return (
        <div className="story-display">
            {renderRecords()}
        </div>
    );
}
