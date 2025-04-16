export type SearchFilterType = "threads" | "spaces" | null;

export type CommandMenuItem = {
  id: string;
  label: string;
  keywords?: string[];
  icon?: React.ReactNode;
  onSelect: () => void;
};

export type CommandMenuState = {
  open: boolean;
  searchValue: string;
  selectedValue: string;
  filter: SearchFilterType;
  inputRef: React.RefObject<HTMLInputElement> | null;
  setOpen: (open: boolean) => void;
  setSearchValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  setFilter: (filter: SearchFilterType) => void;
  setInputRef: (ref: React.RefObject<HTMLInputElement>) => void;
};
