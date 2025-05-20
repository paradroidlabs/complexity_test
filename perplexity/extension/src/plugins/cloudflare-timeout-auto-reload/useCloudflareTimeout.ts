import usePplxUserSettings from "@/hooks/usePplxUserSettings";

export default function useCloudflareTimeout() {
  const { failureReason } = usePplxUserSettings();

  const [isSessionTimeout, setIsSessionTimeout] = useState(false);

  useEffect(() => {
    if (isSessionTimeout) return;

    setIsSessionTimeout(failureReason?.message === "Cloudflare timeout");
  }, [failureReason, isSessionTimeout]);

  const handleReload = useCallback(() => {
    console.log("Session timeout (most likely cloudflare), refreshing page");

    window.location.reload();
  }, []);

  return { isSessionTimeout, handleReload };
}
