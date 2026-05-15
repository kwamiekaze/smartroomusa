import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from "lucide-react";

// Atlanta, GA coordinates (hardcoded — no geolocation prompt)
const ATL_LAT = 33.749;
const ATL_LON = -84.388;

const codeToIcon = (code: number) => {
  if (code === 0 || code === 1) return Sun;
  if (code === 2 || code === 3) return Cloud;
  if (code >= 45 && code <= 48) return CloudFog;
  if (code >= 51 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code >= 95) return CloudLightning;
  return Sun;
};

export const WeatherPill = () => {
  const [temp, setTemp] = useState<number | null>(null);
  const [code, setCode] = useState<number>(0);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${ATL_LAT}&longitude=${ATL_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setTemp(Math.round(d?.current?.temperature_2m));
        setCode(d?.current?.weather_code ?? 0);
      })
      .catch(() => {});
  }, []);

  const Icon = codeToIcon(code);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-background/60 backdrop-blur-md border border-border/40 px-3 py-1.5 text-sm text-cream shadow-sm">
      <Icon className="h-4 w-4 text-primary" />
      <span className="tabular-nums">{temp !== null ? `${temp}°F` : "—°F"}</span>
    </div>
  );
};
