
/*global React */

const ESTIMATES = [0.1, 0.2, 0.3, 0.5, 1, 2, 3, 5];

export default function TaskEstimate(props) {

    const {
        item,
        onSave,
    } = props;

    const save = React.useCallback(() => {
        item.save({
            callback: onSave,
        });
    }, [item, onSave]);

    const buttons = React.useMemo(() => {
        const saveEstimate = (ss) => {
            item.set('Estimate', ss);
            save();
        };

        return ESTIMATES.map((EST, idx) => {
            const gridIdx = idx + 1;

            let className = `task-estimate-${gridIdx}`;
            if (EST === item.data.Estimate) {
                className += ' task-estimate-selected';
            }
            let use = EST;
            if (use === 0.1) {
                use = String.fromCodePoint(10112);
                className += ' task-estimate-decimal';
            }
            else if (use === 0.2) {
                use = String.fromCodePoint(10113);
                className += ' task-estimate-decimal';
            }
            else if (use === 0.3) {
                use = '➂';
                use = String.fromCodePoint(10114);
                className += ' task-estimate-decimal';
            }
            else if (use === 0.5) {
                use = String.fromCodePoint(10116);
                className += ' task-estimate-decimal';
            }

            return (
                <div key={EST} onClick={(() => saveEstimate(EST))} className={className}>{use}</div>
            );
        });
    }, [item, save]);

    const number = React.useMemo(() => {
        if (ESTIMATES.includes(item.data.Estimate)) {
            return;
        }
        const NumberForm = new Intl.NumberFormat(undefined, {
            style: 'decimal',
            minimumIntegerDigits: 1,
            minimumFractionDigits: 1,
        });

        return (
            <div className="task-estimate-9">
                {NumberForm.format(item.data.Estimate)}
            </div>
        );
    }, [item.data.Estimate]);

    return (
        <div className="task-estimate-grid">
            {buttons}
            {number}
        </div>
    );
}
