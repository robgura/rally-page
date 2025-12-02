/*global React Ext Rally */

// cSpell: ignore Cust wsapi

import ReleaseName from './ReleaseName.js';
import TaskTable from './TaskTable.js';

import {
    getBlockedHtml,
    getLifeCycleButton,
    getLink,
} from './util.js';
import Owner from './Owner.js';

export default function UserStoryTable(props) {

    const {
        artifact,
        onSave,
        user,
    } = props;
    // console.log('artifact', artifact);

    const [editMode, setEditMode] = React.useState(false);
    const [text, setText] = React.useState('');

    let artClassName;
    if (artifact.isDefect()) {
        artClassName = 'defect-id';
    }
    else if (artifact.isUserStory()) {
        artClassName = 'story-id';
    }
    const save = () => {
        artifact.save({
            callback: onSave,
        });
    };

    const getEstimate = () => {
        if (artifact.data.PlanEstimate || artifact.data.PlanEstimate === 0) {
            return <span className="story-estimate">{artifact.data.PlanEstimate}</span>;
        }
    };

    const toggleEditMode = () => {
        setEditMode((prev) => {
            return !prev;
        });
    };

    const onTaskAreaChange = (event) => {
        const rawText = event.target.value;
        setText(rawText);
    };

    const createTasks = () => {
        const lines = text.split('\n');
        const tasksToAdd = lines.filter((line) => {
            return line.trim().length > 0;
        }).map((line) => {
            const trim = line.trim();
            return {
                Name: trim,
                State: 'Defined',
                Estimate: 0,
                WorkProduct: artifact.data._ref,
            };
        });
        Rally.data.ModelFactory.getModel({
            type: 'Task',
            success: function(TaskModel) {
                const proms = tasksToAdd.map((tt) => {
                    const model = Ext.create(TaskModel, tt);
                    return new Promise((resolve, reject) => {
                        model.save({
                            callback: (records, operation, success) => {
                                if (success) {
                                    resolve();
                                }
                                else {
                                    reject();
                                }
                            },
                        });
                    });
                });
                Promise.allSettled(proms).then((vals) => {
                    console.log('vals', vals);
                    onSave(artifact);

                });
            },
        });
    };

    const renderTaskArea = () => {
        if (editMode) {
            return (
                <div>
                    <div>
                        <textarea
                            cols={100}
                            onChange={onTaskAreaChange}
                            rows={10}
                            value={text}
                        >
                        </textarea>
                    </div>
                    <div>
                        <button onClick={createTasks}>
                            Create Tasks
                        </button>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="story-chunk" key={artifact.data.FormattedID}>
            <div className="story-title">
                <ReleaseName artifact={artifact} />
                <span className={artClassName}>{artifact.data.FormattedID}</span>
                <span className="artifact-title"> <a href={getLink(artifact)}> {artifact.data.Name} </a> </span>
                <span className="lifecycle"> {artifact.data.c_Lifecycle} </span>
                {getLifeCycleButton(artifact, save)}
                {getEstimate()}
                {getBlockedHtml(artifact.data)}
                <span className="story-owner">
                    <Owner artifact={artifact.data} user={user} />
                </span>
                <span
                    className="button"
                    style={{ fontSize: '18px' }}
                    onClick={toggleEditMode}
                >
                    {String.fromCodePoint(0x1F589)}
                </span>
            </div>
            <TaskTable
                editMode={editMode}
                model={artifact}
                onSave={onSave}
                user={user}
            />
            <div>
                {renderTaskArea()}
            </div>
        </div>
    );
}
