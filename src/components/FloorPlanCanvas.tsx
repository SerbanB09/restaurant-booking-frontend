import type { FloorPlan, FloorPlanTable } from '../api/staffData';

interface Props {
    floorPlan: FloorPlan;
    onSelectTable: (table: FloorPlanTable) => void;
}

const CANVAS_MAX_WIDTH = 700;
const TABLE_SIZE = 56;

function FloorPlanCanvas({ floorPlan, onSelectTable }: Props) {
    const { area, tables } = floorPlan;
    const scale = Math.min(1, CANVAS_MAX_WIDTH / area.width);
    const canvasWidth = area.width * scale;
    const canvasHeight = area.height * scale;

    return (
        <div
            className="relative border border-sage bg-ivory"
            style={{ width: canvasWidth, height: canvasHeight }}
        >
            {tables.map((table) => {
                const isBooked = table.booking !== null;
                return (
                    <button
                        key={table.id}
                        onClick={() => isBooked && onSelectTable(table)}
                        className={`absolute flex flex-col items-center justify-center text-xs font-sans border ${
                            isBooked
                                ? 'bg-wine/90 border-wine text-ivory cursor-pointer'
                                : 'bg-available/90 border-available text-ivory cursor-default'
                        }`}
                        style={{
                            left: table.position_x * scale,
                            top: table.position_y * scale,
                            width: TABLE_SIZE,
                            height: TABLE_SIZE
                        }}
                    >
                        <span className="font-medium">{table.name}</span>
                        <span className="opacity-80">{table.seat_count} seats</span>
                    </button>
                );
            })}
        </div>
    );
}

export default FloorPlanCanvas;