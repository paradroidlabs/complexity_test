import debounce from "lodash/debounce";

type DebounceOptions = Parameters<typeof debounce>[2];

export default function useDebounce<T>(
  value: T,
  delay: number = 500,
  options: DebounceOptions = {},
): T | undefined {
  const { leading = false, trailing = true, maxWait } = options;
  const [debouncedValue, setDebouncedValue] = useState<T | undefined>(
    leading ? value : undefined,
  );

  const debouncedFn = useMemo(
    () =>
      debounce((newValue: T) => setDebouncedValue(newValue), delay, {
        leading,
        trailing,
        maxWait,
      }),
    [delay, leading, trailing, maxWait],
  );

  useEffect(() => {
    debouncedFn(value);

    return () => debouncedFn.cancel();
  }, [value, debouncedFn]);

  return debouncedValue;
}
