import type { PopoverOpenChangeDetails } from "@ark-ui/react";
import { LuX } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const tags = [
  { id: 1, name: "React" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "JavaScript" },
  { id: 4, name: "Next.js" },
  { id: 5, name: "TailwindCSS" },
  { id: 6, name: "Node.js" },
  { id: 7, name: "Express" },
  { id: 8, name: "MongoDB" },
  { id: 9, name: "PostgreSQL" },
  { id: 10, name: "GraphQL" },
  { id: 11, name: "Docker" },
  { id: 12, name: "Kubernetes" },
  { id: 13, name: "AWS" },
  { id: 14, name: "Firebase" },
  { id: 15, name: "Redux" },
  { id: 16, name: "Vue.js" },
  { id: 17, name: "Angular" },
  { id: 18, name: "Python" },
  { id: 19, name: "Java" },
  { id: 20, name: "Go" },
  { id: 21, name: "Rust" },
  { id: 22, name: "Swift" },
  { id: 23, name: "Kotlin" },
  { id: 24, name: "Ruby" },
  { id: 25, name: "PHP" },
  { id: 26, name: "C++" },
  { id: 27, name: "C#" },
  { id: 28, name: "Scala" },
  { id: 29, name: "Elixir" },
  { id: 30, name: "Dart" },
];

export default function TagsInput() {
  const [selectedTags, setSelectedTags] = useState<typeof tags>([]);
  const [open, setOpen] = useState(false);

  const handleSelect = (tag: (typeof tags)[0]) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleOpenChange = (details: PopoverOpenChangeDetails) => {
    setOpen(details.open);
  };

  return (
    <div className="x:flex x:flex-col x:gap-2">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button>
            {selectedTags.length > 0 ? (
              <span>{selectedTags.length} tags selected</span>
            ) : (
              <span>Add Tag</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="x:w-[300px] x:p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList className="x:p-1 x:[&_[cmdk-list-sizer]]:flex x:[&_[cmdk-list-sizer]]:flex-row x:[&_[cmdk-list-sizer]]:flex-wrap">
              {tags.map((tag) => {
                const isSelected = selectedTags.some((t) => t.id === tag.id);
                return (
                  <CommandItem
                    key={tag.id}
                    className={cn({
                      "x:m-1 x:w-max x:cursor-pointer x:rounded-md x:px-2 x:py-0.5 x:text-sm x:transition-colors":
                        true,
                      "x:bg-primary x:text-primary-foreground": isSelected,
                      "x:bg-secondary": !isSelected,
                    })}
                    onSelect={() =>
                      isSelected ? removeTag(tag.id) : handleSelect(tag)
                    }
                  >
                    {isSelected ? (
                      <span className="x:flex x:items-center x:gap-1">
                        {tag.name}
                        <LuX className="x:h-3 x:w-3" />
                      </span>
                    ) : (
                      tag.name
                    )}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
