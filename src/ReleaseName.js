
import HashedColor from './HashedColor.js';

export default function ReleaseName(props) {
    const {
        artifact,
    } = props;

    let name = artifact.data.Release?.Name;
    if (name === 'Sales and Marketing') {
        name = 'S&M';
    }

    return <HashedColor text={name} lightness='50%' />;
}
