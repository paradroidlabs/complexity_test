export default function useClearLocationState() {
  useEffect(() => {
    window.history.replaceState(null, "");
  }, []);
}
