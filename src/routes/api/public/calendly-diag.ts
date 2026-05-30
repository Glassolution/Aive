import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/calendly-diag")({
  server: {
    handlers: {
      GET: async () => {
        const token = process.env.CALENDLY_API_TOKEN;
        const webhook = process.env.ZAPIER_WEBHOOK_URL;
        const out: Record<string, unknown> = {
          hasToken: !!token,
          hasWebhook: !!webhook,
        };
        if (token) {
          try {
            const res = await fetch("https://api.calendly.com/users/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            out.calendlyStatus = res.status;
            out.calendlyBody = await res.text();
          } catch (e) {
            out.calendlyError = String(e);
          }
        }
        return Response.json(out);
      },
    },
  },
});
