/*global */

// cSpell: ignore Cust

import TaskTable from './TaskTable.js';

import {
    getBlockedHtml,
    getLifeCycleButton,
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

    if (left.data.Iteration?.Name) {
        let iteration = left.data.Iteration.Name.localeCompare(right.data.Iteration?.Name);
        if (iteration !== 0) {
            return iteration;
        }
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

                const getEstimate = () => {
                    if (rr.data.PlanEstimate || rr.data.PlanEstimate === 0) {
                        return <span className="story-estimate">{rr.data.PlanEstimate}</span>;
                    }
                };

                const renderTaskTable = () => {
                    if ((rr.data.ScheduleState !== 'Completed' && rr.data.ScheduleState !== 'Accepted') || rr.data.Blocked) {
                        return <TaskTable model={rr} user={user} onSave={onSave} />;
                    };
                };

                return (
                    <div className="story-chunk" key={rr.data.FormattedID}>
                        <div className="story-title">
                            <span className="release-name">{rr.data.Release?.Name}</span>
                            <span className={artClassName}>{rr.data.FormattedID}</span>
                            <span className="artifact-title"> <a href={getLink(rr)}> {rr.data.Name} </a> </span>
                            <span className=""> {rr.data.Iteration?.Name} </span>
                            <span className="lifecycle lifecycle-name"> {rr.data.c_Lifecycle} </span>
                            {getLifeCycleButton(rr, save)}
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
