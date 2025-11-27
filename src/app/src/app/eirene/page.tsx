"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type EireneEntry = {
  date: string;
  label: string;
  bloque: string;
  estado_emocional: string;
  activacion: number;
  satisfaccion: number;
  sitiacion: number;
  sueno_horas: number;
};

export default function EirenePage() {
  const [data, setData] = useState<EireneEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/eirene-5d.json")
      .then((res) => res.json())
      .then((json: EireneEntry[]) => {
        const sorted = [...json].sort((a, b) => a.date.localeCompare(b.date));
        setData(sorted);
      })
      .catch((err) => console.error("Error cargando eirene-5d.json", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Cargando datos de eirēnē…</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">
          Eirēnē Dashboard 5D
        </h1>
        <p className="text-slate-500 text-sm">
          No hay datos todavía. Crea el archivo{" "}
          <code className="bg-slate-900 text-slate-100 px-1 py-0.5 rounded">
            public/eirene-5d.json
          </code>{" "}
          con tus días 5D.
        </p>
      </div>
    );
  }

  const categories = data.map((d) => d.date);

  const satisfactionSeries = [
    {
      name: "Satisfacción (1–5)",
      data: data.map((d) => d.satisfaccion),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Eirēnē — Dashboard 5D
        </h1>
        <p className="text-slate-500 text-sm">
          Visualización de tus cierres de día: Satisfacción, Activación,
          Sitiación y Sueño a lo largo del tiempo.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-4">
        <h2 className="text-sm font-semibold mb-1">
          Satisfacción a lo largo del tiempo
        </h2>
        <ReactApexChart
          type="line"
          height={280}
          series={satisfactionSeries}
          options={{
            chart: { toolbar: { show: false } },
            xaxis: { categories },
            yaxis: { min: 0, max: 5 },
            stroke: { width: 3 },
            dataLabels: { enabled: false },
            theme: { mode: "dark" },
          }}
        />
      </section>
    </div>
  );
}
