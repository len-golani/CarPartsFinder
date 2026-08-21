import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Search className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Auto<span className="text-primary">Parts</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Find the right car parts fast. Search by vehicle, browse by category, and get exactly what you need.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Browse</h3>
            <ul className="mt-3 space-y-2">
              {["Brakes", "Engine", "Suspension", "Lighting"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/catalog?category=${cat.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Account</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Parts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Support</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">support@autopartsfinder.com</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">1-800-AUTO-PART</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 AutoParts Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
