import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type ReactNode } from "react";

import { DraggingContext } from "@/components/dnd/SwappableDndProvider";

type DraggingStates = {
  isDragging: boolean;
  isAnyDragging: boolean;
};

type SwappableSortableItemProps = {
  id: string;
  children: ReactNode | ((props: DraggingStates) => ReactNode);
  className?: string | ((props: DraggingStates) => string);
  onClick?: () => void;
};

export default function SwappableSortableItem({
  id,
  children,
  className,
}: SwappableSortableItemProps) {
  const isAnyDragging = useContext(DraggingContext);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    zIndex: isDragging ? 1 : undefined,
  };

  const draggingStates = { isDragging, isAnyDragging };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        typeof className === "function" ? className(draggingStates) : className,
      )}
    >
      {typeof children === "function" ? children(draggingStates) : children}
    </div>
  );
}
