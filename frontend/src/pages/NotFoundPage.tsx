import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
const navigate = useNavigate();

return ( <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-[var(--text)]"> <div className="w-full max-w-md text-center"> <div className="mb-6 text-8xl font-bold text-primary">
404 </div>

```
    <h1 className="text-3xl font-bold">
      Page Not Found
    </h1>

    <p className="mt-3 text-text-secondary">
      Sorry, the page you are looking for does not exist
      or may have been moved.
    </p>

    <div className="mt-8 flex justify-center gap-3">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="rounded-xl border border-border bg-surface px-5 py-3 font-medium transition hover:bg-surface-2"
      >
        Go Back
      </button>

      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-dark"
      >
        Dashboard
      </button>
    </div>
  </div>
</div>


);
}
