import styles from './Dragger.module.scss'

export default function Dragger({value}) {
    const onDragStart = (e) => {
        e.dataTransfer.setData('text/plain', `${value}`);
    };

    return (
        <div
            className={styles.Dragger}
            draggable="true"
            onDragStart={onDragStart}
        >
            {value}
        </div>
    )
}