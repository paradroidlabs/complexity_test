import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";

type SwappableDndProviderProps = {
  items: string[];
  children: ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

export const DraggingContext = createContext(false);

export default function SwappableDndProvider({
  items,
  children,
  onDragStart,
  onDragEnd,
}: SwappableDndProviderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [isDragging, setIsDragging] = useState(false);
  const justFinishedDragging = useRef(false);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    onDragStart?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    justFinishedDragging.current = true;

    // Reset the flag after the current event loop
    setTimeout(() => {
      justFinishedDragging.current = false;
    }, 0);

    // Prevent the click that follows dragEnd
    const preventClickAfterDrag = (e: Event) => {
      if (justFinishedDragging.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", preventClickAfterDrag, {
      capture: true,
      once: true,
    });

    onDragEnd(event);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <DraggingContext.Provider value={isDragging}>
        <SortableContext items={items} strategy={rectSwappingStrategy}>
          {children}
        </SortableContext>
      </DraggingContext.Provider>
    </DndContext>
  );
}
