import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/book")({
  component: BookRedirect,
});

function BookRedirect() {
  return <Navigate to="/book-a-call" replace />;
}
