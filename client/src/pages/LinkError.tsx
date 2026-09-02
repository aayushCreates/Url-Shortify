import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, XCircle, AlertCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { buildShortUrl } from "../lib/utils/format";

export default function LinkError() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get("error") || "UNKNOWN_ERROR";
  const errorMessage =
    searchParams.get("message") ||
    "An unexpected error occurred while processing this link.";

  const [password, setPassword] = useState("");

  const isPasswordError =
    errorCode === "PASSWORD_REQUIRED" || errorCode === "INVALID_PASSWORD";
  const isNotFound = errorCode === "NOT_FOUND";
  const isGone = errorCode === "GONE";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !password) return;

    // Redirect the browser directly to the backend URL with the password query parameter
    window.location.href = `${buildShortUrl(slug)}?pwd=${encodeURIComponent(password)}`;
  };

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-border p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-primary-light" />

        <div className="flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-bg-muted rounded-full">
            {isPasswordError ? (
              <Lock className="h-10 w-10 text-primary" />
            ) : isNotFound ? (
              <AlertCircle className="h-10 w-10 text-warning" />
            ) : (
              <XCircle className="h-10 w-10 text-danger" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {isPasswordError
              ? "Password Required"
              : isNotFound
                ? "Link Not Found"
                : isGone
                  ? "Link Unavailable"
                  : "Access Error"}
          </h1>

          <p className="text-text-secondary mb-8">{errorMessage}</p>

          {isPasswordError ? (
            <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={
                  errorCode === "INVALID_PASSWORD"
                    ? "Incorrect password, please try again."
                    : undefined
                }
                autoFocus
              />
              <Button type="submit" className="w-full">
                Access Link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              onClick={() => navigate("/")}
              className="w-full"
              variant="secondary"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Homepage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
