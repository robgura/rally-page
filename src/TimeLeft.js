/*global moment */

export default function DefectSummary(props) {

    const {
        date,
    } = props;

    if (!date) {
        return;
    }

    const left = moment(new Date(date)).fromNow();

    return (
        <div className="time-left" > Ends {left}</div>
    );

}
