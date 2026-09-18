const TIME_SLOTS = [
    '12:00', '12:30', '13:00', '13:30',
    '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30'
];

interface Props {
    value: string | null;
    onChange: (time: string) => void;
}

function TimeSlotPicker({ value, onChange }: Props) {
    return (
        <div className="grid grid-cols-4 gap-2">
            {TIME_SLOTS.map((time) => (
                <button
                    key={time}
                    type="button"
                    onClick={() => onChange(time)}
                    className={`py-2 text-sm border transition-colors ${
                        value === time
                            ? 'bg-brass border-brass text-forest-dark font-medium'
                            : 'border-sage text-ink hover:border-brass'
                    }`}
                >
                    {time}
                </button>
            ))}
        </div>
    );
}

export default TimeSlotPicker;