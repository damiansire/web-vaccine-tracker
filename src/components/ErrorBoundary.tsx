import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "wouter";
import i18next from "@/i18n/config";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Sin esto, un error de render en cualquier página tumba TODA la app (React
 * desmonta el árbol completo y no hay forma de recuperarse sin recargar) —
 * en vez de eso, mostramos qué rompió y dejamos volver a intentar. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  // getDerivedStateFromError sola no deja traza en ningún lado — sin esto,
  // el punto donde murió el árbol no queda registrado (regla h: loguear,
  // nunca tragar).
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col gap-3 rounded-lg border border-rose/40 bg-rose/10 p-6">
          <h2 className="font-display text-lg font-semibold text-rose">
            {i18next.t("errorBoundary.title")}
          </h2>
          <p className="text-sm text-ink-2">{i18next.t("errorBoundary.description")}</p>
          {/* El stack trace crudo es jerga de build que no le sirve a un
           * visitante final y expone internals — visible solo en dev. */}
          {import.meta.env.DEV ? (
            <pre className="tabular overflow-auto text-xs text-ink-2">
              {this.state.error.message}
              {"\n"}
              {this.state.error.stack}
            </pre>
          ) : null}
          <div className="flex w-fit gap-2">
            <button
              type="button"
              className="rounded-md border border-hairline px-3 py-1.5 text-sm hover:bg-surface-2"
              onClick={() => this.setState({ error: null })}
            >
              {i18next.t("errorBoundary.retry")}
            </button>
            <Link
              href="/"
              className="rounded-md border border-hairline px-3 py-1.5 text-sm hover:bg-surface-2"
            >
              {i18next.t("errorBoundary.backHome")}
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
