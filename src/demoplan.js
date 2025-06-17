/*global isProduction, React, ReactDOM, Ext */

// cSpell: ignore iterationstatus afterrender hierarchicalrequirement rallyiterationcombobox wsapi xtype

import './styles.css';
import DemoTable from './DemoTable.js';
import { who } from './util.js';

let extId = null;

function MainElement(props) {
    const {
        user,
    } = props;

    const [records, setRecords] = React.useState([]);

    React.useEffect(() => {
        let lcFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'c_Lifecycle',
            operator: '=',
            value: 'Demo',
        });

        lcFilter = lcFilter.or(Ext.create('Rally.data.wsapi.Filter', {
            property: 'c_Lifecycle',
            operator: '=',
            value: 'Implement',
        }));

        Ext.create('Rally.data.wsapi.artifact.Store', {
            models: ['UserStory'],
            fetch: [
                'Blocked',
                'BlockedReason',
                'c_IsCustomer',
                'c_Lifecycle',
                'Connections',
                'CreationDate',
                'Discussion',
                'DisplayName',
                'FormattedID',
                'Iteration',
                'Name',
                'Owner',
                'PlanEstimate',
                'Priority',
                'Release',
                'ScheduleState',
                'Severity',
                'State',
                'Tags',
                'TaskRemainingTotal',
                'Tasks',
                'UserName',
            ],
            autoLoad: true,
            filters: [
                lcFilter,
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
    }, [setRecords]);

    const onSave = (savedRecs) => {
        savedRecs.store.reload({
            load: function(store, _records) {
                setRecords(_records);
            }
        });
    };

    const userName = who(user);
    return (
        <div className={`main-container demo-plan ${userName}`}>
            <DemoTable records={records} user={user} onSave={onSave}/>
        </div>
    );
}

export function afterrender(app) {
    if (!isProduction) {
        // for some reason in development react only works if it is attached in the afterrender
        let root = document.getElementById(extId);
        root.style.overflow = 'visible';
        const user = app.getContext().getUser();
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(<MainElement app={app} user={user} />);
    }
}

export function onLoad(app) {
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
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(<MainElement app={app} user={user} />);
    }
}
