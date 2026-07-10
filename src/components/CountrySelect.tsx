import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { matchesQuery } from "@/lib/search";
import { cn } from "@/lib/utils";

interface CountrySelectBaseProps {
  countries: string[];
  placeholder?: string;
  className?: string;
}

interface SingleProps extends CountrySelectBaseProps {
  multiple?: false;
  value: string | null;
  onChange: (value: string) => void;
}

interface MultiProps extends CountrySelectBaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
}

type CountrySelectProps = SingleProps | MultiProps;

/** Selector de país único, single o multi-selección. El repo anterior tenía
 * este componente duplicado entero en dos carpetas — dos copias que
 * divergieron con el tiempo (ver CLAUDE.md § d/e). Acá hay un solo lugar
 * para arreglar un bug de selección. */
export function CountrySelect(props: CountrySelectProps) {
  const { t } = useTranslation();
  const { countries, placeholder, className } = props;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = props.multiple ? props.value : props.value ? [props.value] : [];
  const atMax = props.multiple && props.max !== undefined && selected.length >= props.max;

  // 217 strings a lo sumo: filtrar en cada tecla es barato, no vale la pena
  // memoizar un array que de todos modos es una referencia nueva por render.
  const options = countries.filter(
    (country) => !selected.includes(country) && matchesQuery(country, query),
  );

  function selectCountry(country: string) {
    if (props.multiple) {
      props.onChange([...props.value, country]);
      setQuery("");
    } else {
      props.onChange(country);
      setQuery("");
      setOpen(false);
    }
  }

  function removeCountry(country: string) {
    if (props.multiple) {
      props.onChange(props.value.filter((c) => c !== country));
    }
  }

  return (
    <div ref={containerRef} className={cn("relative flex flex-col gap-2", className)}>
      {props.multiple && selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((country) => (
            <Badge key={country} variant="secondary" className="gap-1 pr-1">
              {country}
              <button
                type="button"
                aria-label={t("countrySelect.remove", { country })}
                onClick={() => removeCountry(country)}
                className="rounded-full p-0.5 hover:bg-background/40"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <Input
        value={props.multiple ? query : (props.value ?? query)}
        placeholder={
          atMax
            ? t("countrySelect.maxReached", { max: props.max })
            : (placeholder ?? t("countrySelect.searchPlaceholder"))
        }
        disabled={atMax}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onChange={(event) => {
          setQuery(event.target.value);
          if (!props.multiple) props.onChange("");
          setOpen(true);
        }}
      />

      {open && options.length > 0 ? (
        <ul className="absolute top-full z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-surface shadow-lg">
          {options.slice(0, 50).map((country) => (
            <li key={country}>
              <button
                type="button"
                className="w-full px-3 py-1.5 text-left text-sm hover:bg-surface-2"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectCountry(country)}
              >
                {country}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
