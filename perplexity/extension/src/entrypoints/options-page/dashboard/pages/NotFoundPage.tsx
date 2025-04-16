import { TbError404 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import { Result } from "@/components/Result";

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/plugins");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="x:flex x:h-full x:min-h-screen x:items-center x:justify-center">
      <Result
        icon={TbError404}
        title="Page not found"
        description={
          <div className="x:text-balance">
            You will be redirected to the home page in 5 seconds...
          </div>
        }
      />
    </div>
  );
}
