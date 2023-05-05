import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TimelineActionsProps {
    scale: number;
    setScale: Function;
}

export default function TimelineActions({ scale, setScale }: TimelineActionsProps) {
    return (
        <div className="timeline-actions">
            <button
                className="btn btn-secondary scale-timeline"
                onClick={() => {
                    if (scale * 0.8 >= 5) {
                        setScale(scale * 0.8);
                    }
                }}
            >
                <FontAwesomeIcon icon={faMinusCircle} />
            </button>
            <button
                className="btn btn-secondary scale-timeline"
                onClick={() => {
                    setScale(scale * 1.2);
                }}
            >
                <FontAwesomeIcon icon={faPlusCircle} />
            </button>
        </div>
    );
}
