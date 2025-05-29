/*global isProduction, React, ReactDOM, Ext */

// cSpell: ignore iterationstatus afterrender hierarchicalrequirement rallyiterationcombobox wsapi xtype

import './styles.css';
import DefectSummary from './DefectSummary.js';
import DefectTable from './DefectTable.js';
import UserStoryTable from './UserStoryTable.js';

let getUpdate = null;
let extId = null;

function MainElement(props) {
    const {
        user,
    } = props;

    const [iteration, setIteration] = React.useState({
        iterationName: '',
        iterationValue: '',
    });

    const [records, setRecords] = React.useState([]);

    React.useEffect(() => {
        if (iteration.iterationValue !== '') {
            Ext.create('Rally.data.wsapi.artifact.Store', {
                models: ['UserStory', 'Defect'],
                fetch: [
                    'Blocked',
                    'BlockedReason',
                    'c_IsCustomer',
                    'c_Lifecycle',
                    'CreationDate',
                    'DisplayName',
                    'FormattedID',
                    'Name',
                    'Owner',
                    'PlanEstimate',
                    'Priority',
                    'Release',
                    'ScheduleState',
                    'Severity',
                    'State',
                    'Tasks',
                    'UserName',
                ],
                autoLoad: true,
                filters: [
                    {
                        property: 'Iteration',
                        value: iteration.iterationValue,
                    },
                    {
                        property: 'ScheduleState',
                        operator: '!=',
                        value: 'Accepted',
                    }
                ],
                listeners: {
                    load: function(store, _records) {
                        setRecords(_records);
                    }
                }
            });
        }

    }, [iteration, setRecords]);

    getUpdate = (iterationName, iterationValue) => {
        setIteration({
            iterationName,
            iterationValue,
        });
    };

    return (
        <div className="main-container">
            <DefectSummary records={records} />
            <DefectTable records={records} user={user} />
            <UserStoryTable records={records} user={user}/>
        </div>
    );
}

export function afterrender(app) {
    if (!isProduction) {
        // for some reason in development react only works if it is attached in the afterrender
        let root = document.getElementById(extId);
        root.style.overflow = 'visible';
        const user = app.getContext().getUser();
        ReactDOM.render(<MainElement app={app} user={user} />, root);
    }
}

export function onLoad(app) {
    const iterUpdate = (iterationName, iterationValue) => {
        if (getUpdate) {
            getUpdate(iterationName, iterationValue);
        }
    };

    app.add({
        xtype: 'rallyiterationcombobox',
        listeners: {
            ready: (i) => { iterUpdate(i.rawValue, i.value); },
            select: (i) => { iterUpdate(i.rawValue, i.value); },
        }
    });

    const extPanel = app.add({
        xtype: 'panel',
        height: 1000,
        layout: 'fit',
        autoScroll: true,
        items: [
            { html: '<div id="root"> </div>', }
        ]
    });

    extId = extPanel.getId();
    if (isProduction) {
        // for some reason in rally (i.e. production) react only works if is attached right away
        let root = document.getElementById(extId);
        root.style.overflow = 'visible';
        const user = app.getContext().getUser();
        ReactDOM.render(<MainElement app={app} user={user} />, root);
    }
}
