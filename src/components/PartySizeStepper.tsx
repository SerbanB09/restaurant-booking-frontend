interface Props {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

function PartySizeStepper({ value, onChange, min = 1, max = 12 }: Props) {
    return (
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                className="w-10 h-10 border border-forest text-forest disabled:opacity-30 disabled:cursor-not-allowed text-xl leading-none"
            >
                −
            </button>
            <span className="font-display text-2xl w-20 text-center">
                {value} {value === 1 ? 'guest' : 'guests'}
            </span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                className="w-10 h-10 border border-forest text-forest disabled:opacity-30 disabled:cursor-not-allowed text-xl leading-none"
            >
                +
            </button>
        </div>
    );
}

export default PartySizeStepper;