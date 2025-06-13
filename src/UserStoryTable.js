/*global */

// cSpell: ignore Cust

import TaskTable from './TaskTable.js';

import {
    getBlockedHtml,
    getLink,
    storySort,
} from './util.js';
import Owner from './Owner.js';

export default function UserStoryTable(props) {

    const {
        onSave,
        records,
        user,
    } = props;

    const renderRecords = () => {
        return records
            .filter((rr) => {
                if (rr.data.ScheduleState === 'Defined' || rr.data.ScheduleState === 'In-Progress') {
                    // anything that can and does have tasks will be displayed
                    if (rr.canHaveTasks() && rr.data.Tasks.Count > 0) {
                        return true;
                    }
                    // all users stories will be displayed regardless of if they have tasks
                    if (rr.isUserStory()) {
                        return true;
                    }
                }
                else if (rr.data.Blocked && rr.isUserStory()) {
                    return true;
                }

                if (rr.isUserStory() && rr.data.c_Lifecycle !== 'Demo') {
                    return true;
                }

                return false;
            })
            .sort(storySort)
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
                    if (rr.data.c_Lifecycle === 'Complete') {
                        return null;
                    }
                    if (rr.data.ScheduleState === 'Completed' && !rr.data.Blocked && rr.data.c_Lifecycle !== 'Demo' && rr.data.c_Lifecycle !== 'Complete') {
                        return (
                            <span className="action">
                                <span key="move-to-demo" className="button lifecycle" onClick={moveToDemo}>
                                    Move to Demo
                                </span>
                            </span>
                        );
                    }
                    if (rr.data.c_Lifecycle !== 'Implement') {
                        return (
                            <span className="action">
                                <span key="move-to-implement" className="button lifecycle" onClick={moveToImplement}>
                                    Move to Implement
                                </span>
                            </span>
                        );
                    }
                };

                return (
                    <div className="story-chunk" key={rr.data.FormattedID}>
                        <div className="story-title">
                            <span className="release-name">{rr.data.Release.Name}</span>
                            <span className={artClassName}>{rr.data.FormattedID}</span>
                            <span className="artifact-title"> <a href={getLink(rr)}> {rr.data.Name} </a> </span>
                            <span className="lifecycle"> {rr.data.c_Lifecycle} </span>
                            {getLifeCycleButton()}
                            {getEstimate()}
                            {getBlockedHtml(rr.data)}
                            <span className="story-owner">
                                <Owner artifact={rr.data} user={user} />
                            </span>
                        </div>
                        <TaskTable model={rr} user={user} onSave={onSave} />
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
