"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward, SkipBack, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
type StepMark = "comparing" | "swapping" | "sorted" | "pivot" | "found" | "current";

interface AlgoStep {
  array: number[];
  marks: Record<number, StepMark>;
  description: string;
  phase?: string;
  comparisons?: number;
  swaps?: number;
}

type Algorithm =
  | "bubble-sort"
  | "insertion-sort"
  | "selection-sort"
  | "quick-sort"
  | "binary-search";

// ─── Step Generators ─────────────────────────────────────────────────────────

function bubbleSort(arr: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const a = [...arr];
  const sortedIdx = new Set<number>();
  let comparisons = 0, swaps = 0;

  steps.push({ array: [...a], marks: {}, description: "Array inicial. Comenzamos Bubble Sort.", phase: "Inicio", comparisons, swaps });

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      const sortedMarks = Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark]));
      steps.push({ array: [...a], marks: { ...sortedMarks, [j]: "comparing", [j + 1]: "comparing" }, description: `Pasada ${i + 1}: Comparando ${a[j]} y ${a[j + 1]}`, phase: `Pasada ${i + 1}`, comparisons, swaps });
      if (a[j] > a[j + 1]) {
        swaps++;
        steps.push({ array: [...a], marks: { ...sortedMarks, [j]: "swapping", [j + 1]: "swapping" }, description: `${a[j]} > ${a[j + 1]} → Intercambio`, phase: `Pasada ${i + 1}`, comparisons, swaps });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], marks: { ...sortedMarks, [j]: "swapping", [j + 1]: "swapping" }, description: `Intercambio completado. Array actualizado.`, phase: `Pasada ${i + 1}`, comparisons, swaps });
      }
    }
    sortedIdx.add(a.length - 1 - i);
    const finalMarks = Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark]));
    steps.push({ array: [...a], marks: finalMarks, description: `Elemento ${a[a.length - 1 - i]} está en su posición final.`, phase: `Pasada ${i + 1}`, comparisons, swaps });
  }
  steps.push({ array: [...a], marks: Object.fromEntries(a.map((_, k) => [k, "sorted" as StepMark])), description: "¡Array completamente ordenado!", phase: "Completado", comparisons, swaps });
  return steps;
}

function insertionSort(arr: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const a = [...arr];
  let comparisons = 0, swaps = 0;

  steps.push({ array: [...a], marks: { 0: "sorted" }, description: "El primer elemento se considera ordenado.", phase: "Inicio", comparisons, swaps });

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ array: [...a], marks: { [i]: "current" }, description: `Insertando ${key} en la posición correcta.`, phase: `Elemento ${i + 1}`, comparisons, swaps });
    while (j >= 0 && a[j] > key) {
      comparisons++;
      steps.push({ array: [...a], marks: { [j]: "comparing", [j + 1]: "comparing" }, description: `${a[j]} > ${key}: desplazando ${a[j]} a la derecha.`, phase: `Elemento ${i + 1}`, comparisons, swaps });
      a[j + 1] = a[j];
      swaps++;
      steps.push({ array: [...a], marks: { [j + 1]: "swapping" }, description: `${a[j]} desplazado a posición ${j + 1}.`, phase: `Elemento ${i + 1}`, comparisons, swaps });
      j--;
    }
    a[j + 1] = key;
    const sortedMarks = Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, "sorted" as StepMark]));
    steps.push({ array: [...a], marks: sortedMarks, description: `${key} insertado en posición ${j + 1}.`, phase: `Elemento ${i + 1}`, comparisons, swaps });
  }
  steps.push({ array: [...a], marks: Object.fromEntries(a.map((_, k) => [k, "sorted" as StepMark])), description: "¡Insertion Sort completado!", phase: "Completado", comparisons, swaps });
  return steps;
}

function selectionSort(arr: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const a = [...arr];
  const sortedIdx = new Set<number>();
  let comparisons = 0, swaps = 0;

  steps.push({ array: [...a], marks: {}, description: "Buscamos el mínimo para colocarlo al inicio.", phase: "Inicio", comparisons, swaps });

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    const base = Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark]));
    steps.push({ array: [...a], marks: { ...base, [i]: "pivot" }, description: `Buscando mínimo desde posición ${i}.`, phase: `Pasada ${i + 1}`, comparisons, swaps });
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      steps.push({ array: [...a], marks: { ...base, [minIdx]: "pivot", [j]: "comparing" }, description: `Comparando ${a[j]} con mínimo actual ${a[minIdx]}`, phase: `Pasada ${i + 1}`, comparisons, swaps });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ array: [...a], marks: { ...base, [minIdx]: "pivot" }, description: `Nuevo mínimo: ${a[minIdx]} en posición ${minIdx}`, phase: `Pasada ${i + 1}`, comparisons, swaps });
      }
    }
    if (minIdx !== i) {
      swaps++;
      steps.push({ array: [...a], marks: { ...base, [i]: "swapping", [minIdx]: "swapping" }, description: `Intercambiando ${a[i]} y ${a[minIdx]}`, phase: `Pasada ${i + 1}`, comparisons, swaps });
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    sortedIdx.add(i);
    steps.push({ array: [...a], marks: Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark])), description: `${a[i]} colocado en posición final ${i}.`, phase: `Pasada ${i + 1}`, comparisons, swaps });
  }
  sortedIdx.add(a.length - 1);
  steps.push({ array: [...a], marks: Object.fromEntries(a.map((_, k) => [k, "sorted" as StepMark])), description: "¡Selection Sort completado!", phase: "Completado", comparisons, swaps });
  return steps;
}

function quickSort(arr: number[]): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const a = [...arr];
  const sortedIdx = new Set<number>();
  let comparisons = 0, swaps = 0;

  function partition(low: number, high: number) {
    const pivot = a[high];
    steps.push({ array: [...a], marks: { ...Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark])), [high]: "pivot" }, description: `Pivot: ${pivot} en posición ${high}`, phase: `[${low}..${high}]`, comparisons, swaps });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({ array: [...a], marks: { ...Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark])), [high]: "pivot", [j]: "comparing" }, description: `${a[j]} vs pivot ${pivot}`, phase: `[${low}..${high}]`, comparisons, swaps });
      if (a[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps++;
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ array: [...a], marks: { ...Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark])), [high]: "pivot", [i]: "swapping", [j]: "swapping" }, description: `Intercambio: ${a[j]} → pos ${i}`, phase: `[${low}..${high}]`, comparisons, swaps });
        }
      }
    }
    swaps++;
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    sortedIdx.add(i + 1);
    steps.push({ array: [...a], marks: { ...Object.fromEntries([...sortedIdx].map(k => [k, "sorted" as StepMark])) }, description: `Pivot ${pivot} en posición final ${i + 1}`, phase: `[${low}..${high}]`, comparisons, swaps });
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sortedIdx.add(low);
    }
  }

  steps.push({ array: [...a], marks: {}, description: "Quick Sort: dividir y conquistar.", phase: "Inicio", comparisons, swaps });
  sort(0, a.length - 1);
  steps.push({ array: [...a], marks: Object.fromEntries(a.map((_, k) => [k, "sorted" as StepMark])), description: "¡Quick Sort completado!", phase: "Completado", comparisons, swaps });
  return steps;
}

function binarySearch(arr: number[], target: number): AlgoStep[] {
  const steps: AlgoStep[] = [];
  const a = [...arr].sort((x, y) => x - y);
  let left = 0, right = a.length - 1;
  let comparisons = 0;

  steps.push({ array: a, marks: {}, description: `Buscando ${target} en el array ordenado.`, phase: "Inicio", comparisons });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;
    const leftMarks = Object.fromEntries(Array.from({ length: left }, (_, k) => [k, "current" as StepMark]));
    const rightMarks = Object.fromEntries(Array.from({ length: a.length - right - 1 }, (_, k) => [a.length - 1 - k, "current" as StepMark]));
    steps.push({ array: a, marks: { ...leftMarks, ...rightMarks, [mid]: "pivot" }, description: `Mitad: posición ${mid} = ${a[mid]}. Rango [${left}..${right}]`, phase: `Iter ${comparisons}`, comparisons });

    if (a[mid] === target) {
      steps.push({ array: a, marks: { [mid]: "found" }, description: `¡${target} encontrado en posición ${mid}!`, phase: "Encontrado", comparisons });
      return steps;
    } else if (a[mid] < target) {
      steps.push({ array: a, marks: { ...leftMarks, ...rightMarks, [mid]: "comparing" }, description: `${a[mid]} < ${target}: buscar en la mitad derecha`, phase: `Iter ${comparisons}`, comparisons });
      left = mid + 1;
    } else {
      steps.push({ array: a, marks: { ...leftMarks, ...rightMarks, [mid]: "comparing" }, description: `${a[mid]} > ${target}: buscar en la mitad izquierda`, phase: `Iter ${comparisons}`, comparisons });
      right = mid - 1;
    }
  }
  steps.push({ array: a, marks: {}, description: `${target} no encontrado en el array.`, phase: "No encontrado", comparisons });
  return steps;
}

function generateSteps(algo: Algorithm, data: number[], target?: number): AlgoStep[] {
  switch (algo) {
    case "bubble-sort": return bubbleSort(data);
    case "insertion-sort": return insertionSort(data);
    case "selection-sort": return selectionSort(data);
    case "quick-sort": return quickSort(data);
    case "binary-search": return binarySearch(data, target ?? Math.round(data[data.length >> 1]));
    default: return bubbleSort(data);
  }
}

// ─── Color map ────────────────────────────────────────────────────────────────
const markColor: Record<StepMark, string> = {
  comparing: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)]",
  swapping: "bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]",
  sorted: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
  pivot: "bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]",
  found: "bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]",
  current: "bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]",
};
const defaultBarColor = "bg-slate-600 hover:bg-slate-500";

const algoLabels: Record<Algorithm, string> = {
  "bubble-sort": "Bubble Sort",
  "insertion-sort": "Insertion Sort",
  "selection-sort": "Selection Sort",
  "quick-sort": "Quick Sort",
  "binary-search": "Binary Search",
};

// ─── Component ────────────────────────────────────────────────────────────────
interface AlgoVisualizerProps {
  algo: Algorithm;
  data?: string | number[];
  target?: number;
  speed?: number;
  height?: number;
  className?: string;
}

export function AlgoVisualizer({
  algo,
  data: rawData = "[8, 3, 5, 1, 9, 2, 7, 4, 6]",
  target,
  speed = 1,
  height = 300,
  className = "",
}: AlgoVisualizerProps) {
  const parsedData: number[] = React.useMemo(() => {
    if (Array.isArray(rawData)) return rawData;
    try { return new Function("return " + rawData)(); } catch { return [8, 3, 5, 1, 9, 2, 7, 4, 6]; }
  }, [rawData]);

  const [steps, setSteps] = useState<AlgoStep[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedMs = Math.max(100, 800 / speed);

  useEffect(() => {
    const generated = generateSteps(algo, parsedData, target);
    setSteps(generated);
    setStepIdx(0);
    setPlaying(false);
  }, [algo, parsedData, target]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx(prev => {
          if (prev >= steps.length - 1) { setPlaying(false); return prev; }
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, steps.length, speedMs]);

  const step = steps[stepIdx];
  if (!step) return null;

  const max = Math.max(...step.array);

  const reset = () => { setStepIdx(0); setPlaying(false); };

  return (
    <div className={cn("my-8 rounded-xl border border-border bg-card overflow-hidden shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">{algoLabels[algo]}</span>
          {step.phase && (
            <span className="text-[10px] text-muted-foreground border border-border rounded-full px-2 py-0.5">{step.phase}</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          {step.comparisons !== undefined && <span>🔍 {step.comparisons} comp.</span>}
          {step.swaps !== undefined && <span>🔄 {step.swaps} inter.</span>}
          <span className="text-foreground/50">{stepIdx + 1}/{steps.length}</span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-center gap-1 px-6" style={{ height: `${height}px`, paddingBottom: "24px", paddingTop: "16px" }}>
        {step.array.map((val, i) => {
          const mark = step.marks[i];
          const barH = Math.max(8, (val / max) * (height - 60));
          return (
            <div key={i} className="flex flex-col items-center gap-1 transition-all duration-200" style={{ flex: "1 1 0" }}>
              <span className="text-[9px] text-muted-foreground font-mono transition-all duration-200">{val}</span>
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-300",
                  mark ? markColor[mark] : defaultBarColor
                )}
                style={{ height: `${barH}px` }}
              />
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="px-5 py-2 min-h-[36px] border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground text-center">{step.description}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-border">
        <button onClick={reset} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Reiniciar">
          <RotateCcw size={15} />
        </button>
        <button onClick={() => setStepIdx(Math.max(0, stepIdx - 1))} disabled={stepIdx === 0} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30" title="Paso anterior">
          <ChevronLeft size={15} />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          disabled={stepIdx >= steps.length - 1}
          className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 text-xs font-semibold disabled:opacity-40"
        >
          {playing ? <><Pause size={13} /> Pausar</> : <><Play size={13} /> {stepIdx === 0 ? "Iniciar" : "Continuar"}</>}
        </button>
        <button onClick={() => setStepIdx(Math.min(steps.length - 1, stepIdx + 1))} disabled={stepIdx >= steps.length - 1} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30" title="Paso siguiente">
          <ChevronRight size={15} />
        </button>
        <button onClick={() => setStepIdx(steps.length - 1)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Ir al final">
          <SkipForward size={15} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center flex-wrap gap-3 px-4 pb-3">
        {(["comparing", "swapping", "sorted", "pivot"] as const).map(m => (
          <div key={m} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <div className={cn("w-2.5 h-2.5 rounded-sm", markColor[m])} />
            {({ comparing: "Comparando", swapping: "Intercambiando", sorted: "Ordenado", pivot: "Pivote" } as const)[m]}
          </div>
        ))}
      </div>
    </div>
  );
}
