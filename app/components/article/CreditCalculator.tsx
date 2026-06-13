"use client";

import { useMemo, useState } from "react";

interface Inputs {
  price: number; // purchase price, TTD
  official: number; // official TTD per USD
  parallel: number; // parallel-market TTD per USD
  dep: number; // expected annual TTD depreciation vs USD, %
  apr: number; // loan APR, %
  termMonths: number;
  downPct: number; // down payment, % of price
  usdYield: number; // annual yield on retained USD, %
}

const DEFAULTS: Inputs = {
  price: 50000,
  official: 6.8,
  parallel: 8.2,
  dep: 6,
  apr: 12,
  termMonths: 36,
  downPct: 0,
  usdYield: 4,
};

interface YearRow {
  year: number;
  ttdPaid: number;
  usdPaid: number;
  endRate: number;
  endBalance: number;
}

interface Result {
  premium: number; // parallel premium over official, %
  cashUsd: number; // buy outright today, USD
  monthlyPayment: number; // TTD
  totalTtd: number; // down + all installments
  loanUsdNominal: number; // all outlays converted at projected rates, no yield
  loanUsdNet: number; // net of yield earned on retained USD
  carry: number; // cashUsd - loanUsdNet (positive = loan wins)
  effectiveUsdApr: number; // %
  firstPaymentUsd: number;
  lastPaymentUsd: number;
  endRate: number;
  breakevenDep: number | null; // annual dep % where carry = 0; null if loan wins even at 0%
  years: YearRow[];
}

function amortPayment(principal: number, aprPct: number, n: number): number {
  if (n <= 0) return principal;
  const r = aprPct / 100 / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

// Carry profit of the loan route vs paying cash, in USD today-equivalents:
// fund a side account with exactly the cash-purchase amount, pay the down
// payment and every installment out of it (converted at the projected
// parallel rate), let the rest earn the USD yield. Whatever is left at the
// end of the term is the carry.
function carryProfit(i: Inputs, dep: number): number {
  const cashUsd = i.price / i.parallel;
  const downTtd = (i.downPct / 100) * i.price;
  const m = amortPayment(i.price - downTtd, i.apr, i.termMonths);
  const monthlyYield = Math.pow(1 + i.usdYield / 100, 1 / 12) - 1;
  let bal = cashUsd - downTtd / i.parallel;
  for (let t = 1; t <= i.termMonths; t++) {
    bal *= 1 + monthlyYield;
    const rate = i.parallel * Math.pow(1 + dep / 100, t / 12);
    bal -= m / rate;
  }
  return bal;
}

function simulate(i: Inputs): Result {
  const premium = (i.parallel / i.official - 1) * 100;
  const cashUsd = i.price / i.parallel;
  const downTtd = (i.downPct / 100) * i.price;
  const downUsd = downTtd / i.parallel;
  const m = amortPayment(i.price - downTtd, i.apr, i.termMonths);
  const monthlyYield = Math.pow(1 + i.usdYield / 100, 1 / 12) - 1;

  let bal = cashUsd - downUsd;
  let usdNominal = downUsd;
  let rate = i.parallel;
  let firstPaymentUsd = 0;
  let lastPaymentUsd = 0;
  const years: YearRow[] = [];
  let yearTtd = downTtd;
  let yearUsd = downUsd;

  for (let t = 1; t <= i.termMonths; t++) {
    bal *= 1 + monthlyYield;
    rate = i.parallel * Math.pow(1 + i.dep / 100, t / 12);
    const usdPay = m / rate;
    bal -= usdPay;
    usdNominal += usdPay;
    yearTtd += m;
    yearUsd += usdPay;
    if (t === 1) firstPaymentUsd = usdPay;
    if (t === i.termMonths) lastPaymentUsd = usdPay;
    if (t % 12 === 0 || t === i.termMonths) {
      years.push({
        year: Math.ceil(t / 12),
        ttdPaid: yearTtd,
        usdPaid: yearUsd,
        endRate: rate,
        endBalance: bal,
      });
      yearTtd = 0;
      yearUsd = 0;
    }
  }

  const carry = bal;
  const effectiveUsdApr = ((1 + i.apr / 100) / (1 + i.dep / 100) - 1) * 100;

  // Breakeven depreciation: carry is monotonically increasing in dep, so
  // bisect for the rate where the two routes cost the same.
  let breakevenDep: number | null;
  if (carryProfit(i, 0) >= 0) {
    breakevenDep = null; // loan wins even with a flat exchange rate
  } else if (carryProfit(i, 60) < 0) {
    breakevenDep = Infinity; // loan can't win below 60%/yr depreciation
  } else {
    let lo = 0;
    let hi = 60;
    for (let k = 0; k < 60; k++) {
      const mid = (lo + hi) / 2;
      if (carryProfit(i, mid) < 0) lo = mid;
      else hi = mid;
    }
    breakevenDep = (lo + hi) / 2;
  }

  return {
    premium,
    cashUsd,
    monthlyPayment: m,
    totalTtd: downTtd + m * i.termMonths,
    loanUsdNominal: usdNominal,
    loanUsdNet: cashUsd - carry,
    carry,
    effectiveUsdApr,
    firstPaymentUsd,
    lastPaymentUsd,
    endRate: rate,
    breakevenDep,
    years,
  };
}

function fmt(n: number, digits = 0): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function bar(value: number, max: number, width = 22): string {
  const filled = Math.round(Math.max(0, Math.min(1, value / max)) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}

function Knob({ label, value, min, max, step, display, onChange }: KnobProps) {
  return (
    <label className="block">
      <span className="flex justify-between text-sm mb-1">
        <span>
          <span className="text-[var(--bullet)]">*</span> {label}
        </span>
        <span className="text-[var(--heading)]">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--heading)] cursor-pointer"
      />
    </label>
  );
}

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  display: string;
}

function Gauge({ label, value, max, display }: GaugeProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      <span className="w-24 shrink-0 opacity-70">{label}</span>
      <span className="tracking-tighter" aria-hidden="true">
        {bar(value, max)}
      </span>
      <span className="text-[var(--heading)]">{display}</span>
    </div>
  );
}

export function CreditCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const result = useMemo(() => simulate(inputs), [inputs]);

  const set = (key: keyof Inputs) => (v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }));

  const loanWins = result.carry >= 0;
  const carryPct = (Math.abs(result.carry) / result.cashUsd) * 100;
  const gaugeMax = Math.max(result.cashUsd, result.loanUsdNet, result.loanUsdNominal);

  return (
    <div className="border border-[var(--foreground)]/20 my-6">
      {/* Knobs */}
      <div className="px-4 py-4 sm:px-5">
        <p className="text-[var(--heading)] text-sm mb-4">knobs</p>
        <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <Knob
            label="purchase price"
            value={inputs.price}
            min={5000}
            max={500000}
            step={5000}
            display={`TT$${fmt(inputs.price)}`}
            onChange={set("price")}
          />
          <Knob
            label="parallel rate"
            value={inputs.parallel}
            min={6}
            max={12}
            step={0.05}
            display={`${fmt(inputs.parallel, 2)} TTD/USD`}
            onChange={set("parallel")}
          />
          <Knob
            label="official rate"
            value={inputs.official}
            min={6}
            max={8}
            step={0.05}
            display={`${fmt(inputs.official, 2)} TTD/USD`}
            onChange={set("official")}
          />
          <Knob
            label="TTD depreciation"
            value={inputs.dep}
            min={0}
            max={20}
            step={0.5}
            display={`${fmt(inputs.dep, 1)} %/yr`}
            onChange={set("dep")}
          />
          <Knob
            label="loan APR"
            value={inputs.apr}
            min={0}
            max={30}
            step={0.25}
            display={`${fmt(inputs.apr, 2)} %`}
            onChange={set("apr")}
          />
          <Knob
            label="loan term"
            value={inputs.termMonths}
            min={6}
            max={84}
            step={6}
            display={`${inputs.termMonths} months`}
            onChange={set("termMonths")}
          />
          <Knob
            label="down payment"
            value={inputs.downPct}
            min={0}
            max={90}
            step={5}
            display={`${inputs.downPct} %`}
            onChange={set("downPct")}
          />
          <Knob
            label="USD yield"
            value={inputs.usdYield}
            min={0}
            max={15}
            step={0.25}
            display={`${fmt(inputs.usdYield, 2)} %/yr`}
            onChange={set("usdYield")}
          />
        </div>
      </div>

      {/* Gauges */}
      <div className="border-t border-[var(--foreground)]/20 px-4 py-4 sm:px-5 text-sm space-y-1.5 overflow-x-auto">
        <p className="text-[var(--heading)] mb-3">gauges</p>
        <Gauge
          label="cash today"
          value={result.cashUsd}
          max={gaugeMax}
          display={`US$${fmt(result.cashUsd)}`}
        />
        <Gauge
          label="loan, gross"
          value={result.loanUsdNominal}
          max={gaugeMax}
          display={`US$${fmt(result.loanUsdNominal)}`}
        />
        <Gauge
          label="loan, net"
          value={result.loanUsdNet}
          max={gaugeMax}
          display={`US$${fmt(result.loanUsdNet)}`}
        />

        <p className="pt-3">
          <span className="text-[var(--bullet)]">{">>"}</span>{" "}
          {loanWins ? (
            <span>
              the loan carries a profit of{" "}
              <span className="text-[var(--heading)]">
                US${fmt(result.carry)} ({fmt(carryPct, 1)}%)
              </span>{" "}
              over paying cash
            </span>
          ) : (
            <span>
              paying cash is cheaper by{" "}
              <span className="text-[var(--heading)]">
                US${fmt(-result.carry)} ({fmt(carryPct, 1)}%)
              </span>
            </span>
          )}
        </p>

        <div className="pt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
          <p>
            <span className="opacity-70">parallel premium:</span>{" "}
            {fmt(result.premium, 1)}% over official
          </p>
          <p>
            <span className="opacity-70">monthly payment:</span> TT$
            {fmt(result.monthlyPayment)}
          </p>
          <p>
            <span className="opacity-70">effective USD cost of debt:</span>{" "}
            {fmt(result.effectiveUsdApr, 2)}%/yr
          </p>
          <p>
            <span className="opacity-70">installment in USD:</span> US$
            {fmt(result.firstPaymentUsd)} first, US${fmt(result.lastPaymentUsd)}{" "}
            last
          </p>
          <p>
            <span className="opacity-70">breakeven depreciation:</span>{" "}
            {result.breakevenDep === null
              ? "0% — loan wins even flat"
              : result.breakevenDep === Infinity
                ? ">60%/yr — loan can't win here"
                : `${fmt(result.breakevenDep, 1)}%/yr`}
          </p>
          <p>
            <span className="opacity-70">projected rate at term end:</span>{" "}
            {fmt(result.endRate, 2)} TTD/USD
          </p>
        </div>
      </div>

      {/* Schedule */}
      <details className="border-t border-[var(--foreground)]/20 px-4 py-3 sm:px-5 text-sm">
        <summary className="cursor-pointer text-[var(--heading)]">
          year-by-year schedule
        </summary>
        <div className="overflow-x-auto">
          <table className="mt-3 w-full text-left whitespace-nowrap">
            <thead>
              <tr className="opacity-70">
                <th className="pr-4 font-normal">year</th>
                <th className="pr-4 font-normal">TTD paid</th>
                <th className="pr-4 font-normal">USD paid</th>
                <th className="pr-4 font-normal">rate</th>
                <th className="font-normal">side account</th>
              </tr>
            </thead>
            <tbody>
              {result.years.map((y) => (
                <tr key={y.year}>
                  <td className="pr-4">{y.year}</td>
                  <td className="pr-4">TT${fmt(y.ttdPaid)}</td>
                  <td className="pr-4">US${fmt(y.usdPaid)}</td>
                  <td className="pr-4">{fmt(y.endRate, 2)}</td>
                  <td
                    className={
                      y.endBalance < 0 ? "text-[var(--heading)]" : undefined
                    }
                  >
                    US${fmt(y.endBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 opacity-70">
          totals: TT${fmt(result.totalTtd)} repaid; US$
          {fmt(result.loanUsdNominal)} gross outlay vs US${fmt(result.cashUsd)}{" "}
          cash.
        </p>
      </details>
    </div>
  );
}
