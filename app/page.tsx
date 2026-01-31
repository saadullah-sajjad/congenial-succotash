import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function maskSecret(value: string, visibleChars = 8) {
  if (!value || value.length <= visibleChars) return value ? "••••••••" : ""
  return value.slice(0, visibleChars) + "••••••••"
}

function EnvRow({
  label,
  value,
  badge,
  mask,
}: {
  label: string
  value: string
  badge?: "production" | "preview" | "development"
  mask?: boolean
}) {
  const display = mask ? maskSecret(value) : value
  return (
    <div className="flex flex-wrap items-center gap-2 py-2 border-b border-border last:border-0">
      <span className="font-medium text-muted-foreground min-w-[140px]">
        {label}
      </span>
      {badge ? (
        <Badge
          variant={
            badge === "production"
              ? "default"
              : badge === "preview"
                ? "secondary"
                : "outline"
          }
        >
          {display}
        </Badge>
      ) : (
        <span className="font-mono text-sm break-all">{display || "—"}</span>
      )}
    </div>
  )
}

export default function HomePage() {
  const vercelEnv = process.env.VERCEL_ENV ?? "development"
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "— (local)"
  const vercelBranch = process.env.VERCEL_GIT_COMMIT_REF ?? "—"
  const nodeEnv = process.env.NODE_ENV ?? "—"
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ""
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Vercel + Supabase env check
          </h1>
          <p className="text-muted-foreground">
            Main → Production · Other branches → Preview
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Deployment & environment</CardTitle>
            <CardDescription>
              Values from Vercel (auto) and env vars you add in Vercel →
              Settings → Environment Variables.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            <EnvRow
              label="VERCEL_ENV"
              value={vercelEnv}
              badge={
                vercelEnv === "production"
                  ? "production"
                  : vercelEnv === "preview"
                    ? "preview"
                    : "development"
              }
            />
            <EnvRow label="URL (this deployment)" value={vercelUrl} />
            <EnvRow label="VERCEL_GIT_COMMIT_REF" value={vercelBranch} />
            <EnvRow
              label="NODE_ENV"
              value={nodeEnv}
              badge={
                nodeEnv === "production"
                  ? "production"
                  : nodeEnv === "development"
                    ? "development"
                    : undefined
              }
            />
            {vercelEnv !== "development" && nodeEnv === "production" && (
              <p className="text-xs text-muted-foreground py-2 border-b border-border">
                On Vercel, NODE_ENV is always &quot;production&quot; (Next.js
                sets it at build time). Use{" "}
                <code className="bg-muted px-1 rounded">VERCEL_ENV</code> to
                tell Production vs Preview.
              </p>
            )}
            <div className="pt-3 mt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Supabase (set in Vercel: Production = prod DB, Preview = dev DB)
              </p>
              <EnvRow
                label="SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL"
                value={supabaseUrl}
              />
              <EnvRow
                label="SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY"
                value={supabaseAnonKey}
                mask
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">Vercel env setup</CardTitle>
            <CardDescription>
              In Vercel → Project → Settings → Environment Variables, add:
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Production</strong> (main branch):{" "}
              <code className="bg-muted px-1 rounded">SUPABASE_URL</code>,{" "}
              <code className="bg-muted px-1 rounded">SUPABASE_ANON_KEY</code>{" "}
              (or <code className="bg-muted px-1 rounded">NEXT_PUBLIC_*</code>{" "}
              if used in browser) → Production Supabase.
            </p>
            <p>
              <strong>Preview</strong> (development + feature branches): same
              names with dev values → Preview env only.
            </p>
            <p className="pt-2 mt-2 text-xs border-t border-border">
              <strong>NODE_ENV on Vercel:</strong> Next.js sets it to
              &quot;production&quot; for both Production and Preview builds. Use{" "}
              <code className="bg-muted px-1 rounded">VERCEL_ENV</code> in your
              app to distinguish prod vs preview (e.g. which API or feature flags).
            </p>
            <p className="pt-2 text-xs">
              Do not use &quot;All Environments&quot; for DB keys. Redeploy after
              changing env vars.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base">In your code</CardTitle>
            <CardDescription>
              Use VERCEL_ENV, not NODE_ENV, when you need prod vs preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                ✅ Use this
              </p>
              <pre className="bg-muted rounded-lg p-3 font-mono text-xs overflow-x-auto">
{`const isProd = process.env.VERCEL_ENV === "production"
const isPreview = process.env.VERCEL_ENV === "preview"`}
              </pre>
            </div>
            <div>
              <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                ❌ Don&apos;t rely on this on Vercel for prod vs preview
              </p>
              <pre className="bg-muted rounded-lg p-3 font-mono text-xs overflow-x-auto">
{`const isProd = process.env.NODE_ENV === "production"`}
              </pre>
            </div>
            <p className="text-muted-foreground text-xs pt-1">
              Prod vs Preview → use <code className="bg-muted px-1 rounded">VERCEL_ENV</code>.
              Supabase URL/keys are already correct per environment.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
