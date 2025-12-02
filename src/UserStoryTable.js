/*global */

import UserStory from './UserStory.js';

import {
    storySort,
} from './util.js';

export default function UserStoryTable(props) {

    const {
        onSave,
        records,
        user,
    } = props;

    const renderRecords = () => {
        return records
            .sort(storySort)
            .map((rr) => {
                return (
                    <UserStory
                        key={rr.data.FormattedID}
                        artifact={rr}
                        onSave={onSave}
                        user={user}
                    />
                );
            });
    };
    return (
        <div className="story-display">
            {renderRecords()}
        </div>
    );
}
