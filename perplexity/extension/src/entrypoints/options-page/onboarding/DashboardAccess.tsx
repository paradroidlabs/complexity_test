import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";

export default function DashboardAccess() {
  const [isPinnedOnToolbar, setShouldShow] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    chrome.action.getUserSettings().then((settings) => {
      setShouldShow(settings.isOnToolbar);
    });
  }, []);

  return (
    <>
      <div className="x:mx-auto x:flex x:max-w-2xl x:flex-col x:items-center x:gap-4 x:px-2 x:md:gap-8 x:md:px-4">
        <H1 className="x:text-center x:text-balance">Dashboard</H1>
        <div className="x:w-full x:text-center x:text-balance">
          The Settings Dashboard is a new way to manage all of your Complexity
          settings and data. You can always access it via{" "}
          <span className="x:underline">right-clicking</span> the
          extension&apos;s icon.
        </div>
        <div className="x:max-w-[500px] x:rounded-md x:border x:border-border/50">
          <img
            src="https://i.imgur.com/zgT1Wlz.png"
            alt="Dashboard Shortcut"
            className="x:relative x:w-full x:rounded-md x:shadow-lg"
          />
        </div>
      </div>

      {!isPinnedOnToolbar && !isDismissed && (
        <div
          className="x:fixed x:top-4 x:right-4 x:hidden x:w-[500px] x:flex-col x:items-center x:justify-center x:gap-4 x:rounded-md x:border x:border-border/50 x:bg-secondary x:p-4 x:duration-300 x:animate-in x:fade-in x:slide-in-from-top-4 x:md:flex"
          onClick={() => setIsDismissed(true)}
        >
          <img
            src="https://i.imgur.com/M8LQwV0.png"
            alt="pin-dashboard-instruction"
          />
          <div>
            Pin the extension to your toolbar to always have access to the
            Dashboard. And <span className="x:underline">left-click</span> the
            extension icon to open a new tab of Perplexity.ai.
          </div>
          <Button variant="default">Dismiss</Button>
        </div>
      )}
    </>
  );
}
