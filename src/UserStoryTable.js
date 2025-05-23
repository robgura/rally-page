/*global */

// cSpell: ignore Cust

import TaskTable from './TaskTable.js';

import {
    getBlockedHtml,
    getLink,
    itemSort2,
    ownerIfKnown,
} from './util.js';

export default function UserStoryTable(props) {

    const {
        records,
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
                return false;
            })
            .sort(itemSort2)
            .map((rr) => {
                let artClassName;
                if (rr.isDefect()) {
                    artClassName = 'defect-id';
                }
                else if (rr.isUserStory()) {
                    artClassName = 'story-id';
                }
                const getEstimate = () => {
                    if (rr.data.PlanEstimate || rr.data.PlanEstimate === 0) {
                        return <span className="story-estimate">{rr.data.PlanEstimate}</span>;
                    }
                };

                return (
                    <div className="story-chunk" key={rr.data.FormattedID}>
                        <div className="story-title">
                            <span className="release-name">{rr.data.Release.Name}</span>
                            <span className={artClassName}>{rr.data.FormattedID}</span>
                            <span className="artifact-title"> <a href={getLink(rr)}> {rr.data.Name} </a> </span>
                            {getEstimate()}
                            {getBlockedHtml(rr.data)}
                            <span className="story-owner">{ownerIfKnown(rr.data)}</span>
                        </div>
                        <TaskTable model={rr} />
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
