import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { H1 } from "../../components/mdx/Headings";
import { UnorderedList, ListItem } from "../../components/mdx/List";
import { CreditCalculator } from "../../components/article/CreditCalculator";
import { SideNav, MobileToc, type SectionLink } from "../../components/article/SideNav";

const PUBLISHED_ISO = "2026-06-13T00:41:32Z";
const PUBLISHED_LABEL = "June 13, 2026 (UTC)";
const TITLE = "Credit vs Cash in a Two-Rate Economy";
const DESCRIPTION =
  "A framework for deciding whether to finance large purchases with credit or buy them outright in cash when a currency trades at two prices — the official bank rate and the parallel-market rate.";
const PATH = "/writing/credit-vs-cash";

export const metadata: Metadata = {
  title: `${TITLE} — Matthew Abraham`,
  description: DESCRIPTION,
  keywords: [
    "credit vs cash",
    "loan vs cash",
    "two-rate economy",
    "parallel market exchange rate",
    "currency depreciation",
    "carry trade",
    "personal finance",
    "financing large purchases",
    "TTD USD",
    "Trinidad and Tobago",
  ],
  authors: [{ name: "Matthew Abraham" }],
  creator: "Matthew Abraham",
  alternates: {
    canonical: PATH,
  },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    siteName: "Matthew Abraham",
    locale: "en_US",
    publishedTime: PUBLISHED_ISO,
    authors: ["Matthew Abraham"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const SECTIONS: SectionLink[] = [
  { id: "two-prices", label: "two prices for one dollar" },
  { id: "why-credit", label: "why credit can beat cash" },
  { id: "walkthrough", label: "the walkthrough" },
  { id: "calculator", label: "the calculator" },
  { id: "reading-gauges", label: "reading the gauges" },
  { id: "what-can-go-wrong", label: "what can go wrong" },
];

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-[var(--heading)] mb-2 mt-10 scroll-mt-6">
      <span className="text-[var(--heading)]">##</span> {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mb-4">{children}</p>;
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="border border-[var(--foreground)]/20 px-4 py-2 my-4 text-sm overflow-x-auto whitespace-nowrap">
      {children}
    </div>
  );
}

export default function CreditVsCash() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-12">
          <p className="mb-6 text-sm">
            <Link href="/" className="text-[var(--link)]">
              [home]
            </Link>
          </p>
          <SideNav sections={SECTIONS} />
        </div>
      </aside>

      <main className="max-w-2xl min-w-0">
        <p className="mb-6 text-sm lg:hidden">
          <Link href="/" className="text-[var(--link)]">
            [home]
          </Link>
        </p>

        <H1>{TITLE}</H1>
        <p className="mb-1 text-sm opacity-70">
          on financing large purchases when a currency has two prices
        </p>
        <p className="mb-8 text-sm opacity-50">
          <time dateTime={PUBLISHED_ISO}>{PUBLISHED_LABEL}</time>
        </p>

        <MobileToc sections={SECTIONS} />

        <P>
          In Trinidad &amp; Tobago, a US dollar has two prices. The banking
          system quotes one — roughly 6.8 TTD per USD. Hard currency is
          scarce, though, so a parallel market exists where the same dollar
          changes hands closer to 8.2. When one dollar has two prices, a large
          purchase made by anyone whose income is in hard currency quietly
          becomes a currency trade — and the question &ldquo;finance this or
          pay cash?&rdquo; stops being about discipline and starts being about
          arithmetic.
        </P>
        <P>
          This walkthrough lays out how to decide whether to take a TTD loan
          (or buy on credit) for a big purchase instead of paying for it
          outright. It ends with a calculator so you can turn the knobs against
          your own assumptions.
        </P>

        <Section id="two-prices">two prices for one dollar</Section>
        <P>
          The official exchange rate is what the banking system quotes:
          roughly 6.8 TTD per USD. But hard currency is scarce, so a parallel
          market exists where a US dollar clears closer to 8.2 TTD. For
          anyone whose income is denominated in USD, that income is worth
          about 20% more than the official rate admits — but only when it is
          converted at the parallel price.
        </P>
        <P>
          That gap matters for purchases because local goods are priced in
          TTD. The real cost of anything, to a hard-currency earner, is its
          TTD price divided by the rate their dollars actually fetch. A
          TT$50,000 purchase costs about US$6,100 at 8.2 — not the US$7,350
          the official rate implies.
        </P>

        <Section id="why-credit">why credit can beat cash</Section>
        <P>
          A TTD loan is, mechanically, a short position on the TTD. The
          borrower receives purchasing power today and promises to return TTD
          later. When income is in USD and the TTD keeps losing ground against
          the dollar year over year, every future installment costs fewer
          dollars than it would today. The currency does part of the repaying.
        </P>
        <P>
          There is a second effect: the dollars not spent today can sit
          somewhere that yields — a money market fund, treasury bills, even a
          conservative stablecoin position. The loan costs interest in TTD;
          the retained dollars earn yield in USD; the exchange rate drifts in
          the borrower&rsquo;s favor. The net of those three flows is the
          carry, and it can be positive.
        </P>
        <P>The intuition in one line:</P>
        <Formula>
          loan beats cash (roughly) when&nbsp;&nbsp;APR &lt; depreciation +
          USD yield
        </Formula>
        <P>
          A 12% TTD loan against 6% annual depreciation and 4% USD yield is a
          near coin-flip — which is exactly why you want to run the actual
          numbers instead of trusting the vibe.
        </P>

        <Section id="walkthrough">the walkthrough</Section>
        <P>
          <strong className="font-semibold">Step 1 — price the purchase in the currency you earn.</strong>{" "}
          Ignore the official rate entirely; it is not the rate available to
          you. The cash cost of the purchase is:
        </P>
        <Formula>cash_usd = price_ttd / parallel_rate</Formula>
        <P>
          <strong className="font-semibold">Step 2 — amortize the loan.</strong>{" "}
          A standard installment loan with monthly rate r = APR/12 over n
          months has a fixed monthly payment:
        </P>
        <Formula>M = principal × r / (1 − (1 + r)⁻ⁿ)</Formula>
        <P>
          <strong className="font-semibold">Step 3 — project the exchange rate.</strong>{" "}
          Pick an annual depreciation assumption d for the TTD against the
          USD on the parallel market, and compound it monthly:
        </P>
        <Formula>rate_t = parallel_rate × (1 + d)^(t/12)</Formula>
        <P>
          This is the most consequential knob and the least knowable. Anchor
          it to history — where was the parallel rate two or three years ago
          versus today? — and then test the verdict against gentler and
          harsher assumptions.
        </P>
        <P>
          <strong className="font-semibold">Step 4 — convert every installment back to dollars.</strong>{" "}
          Each month&rsquo;s TTD payment is covered by converting dollars at
          that month&rsquo;s projected rate, so installment t costs M / rate_t
          dollars. Later payments are cheaper in USD than earlier ones.
        </P>
        <P>
          <strong className="font-semibold">Step 5 — pay the loan from a shadow account.</strong>{" "}
          To compare fairly against paying cash, imagine funding a side
          account with exactly the cash price (cash_usd) on day one. It earns
          your USD yield. Every month you withdraw just enough to cover that
          month&rsquo;s installment. Whatever is left in the account when the
          loan ends is your carry profit. If the account runs negative, cash
          was cheaper — the shortfall is what the loan cost you.
        </P>
        <P>
          That single leftover number settles the question, because both
          routes started from identical dollars and ended with you owning the
          same good.
        </P>

        <Section id="calculator">the calculator</Section>
        <P>
          The defaults below match the scenario above: a TT$50,000 purchase,
          an 8.2 parallel rate against a 6.8 official rate,
          a 12% loan over 36 months, 6% annual depreciation, and 4% yield on
          retained dollars. Drag the knobs; the gauges and the verdict update
          live.
        </P>
        <CreditCalculator />

        <Section id="reading-gauges">reading the gauges</Section>
        <UnorderedList>
          <ListItem>
            <strong className="font-semibold">cash today vs loan, net</strong>{" "}
            — the headline comparison. &ldquo;Loan, gross&rdquo; is every
            outlay converted at projected rates with no credit for yield;
            &ldquo;loan, net&rdquo; subtracts what your retained dollars
            earned along the way. Net is the number that decides.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">breakeven depreciation</strong>{" "}
            — the annual TTD slide at which both routes cost the same. If
            you believe the currency will weaken faster than this, finance
            it; slower, pay cash. When your honest estimate straddles the
            breakeven, the trade has no edge — let convenience or liquidity
            decide instead.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">effective USD cost of debt</strong>{" "}
            — the TTD APR deflated by depreciation, (1 + APR)/(1 + d) − 1.
            Compare it directly to your USD yield: borrowing at an effective
            5.7% while earning 4% is a losing carry before convenience value.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">term length</strong> — longer
            terms give depreciation more time to work and amplify whichever
            side is winning. A marginal trade at 24 months can be clearly
            positive at 60 — but only if your depreciation assumption holds
            that long.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">down payment</strong> — every
            dollar paid up front is converted at today&rsquo;s rate and earns
            nothing, so it dilutes the carry in either direction. Minimize it
            when the loan is winning; it barely matters when cash is winning.
          </ListItem>
        </UnorderedList>

        <Section id="what-can-go-wrong">what can go wrong</Section>
        <UnorderedList>
          <ListItem>
            <strong className="font-semibold">depreciation is an assumption, not a promise.</strong>{" "}
            The parallel premium can compress — a policy shift, a new USD
            facility, an official devaluation that closes the gap. Your short
            TTD position only pays if the slide continues.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">sticker APR is rarely the real APR.</strong>{" "}
            Processing fees, mandatory insurance, and add-ons push the
            effective rate up. Recompute the true APR from the actual
            payment schedule before trusting the verdict.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">leverage plus income shock is the classic blowup.</strong>{" "}
            The carry math assumes your USD income keeps arriving. A fixed
            TTD obligation with interrupted USD income forces you to unwind
            at the worst time.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">the parallel market is not a guaranteed venue.</strong>{" "}
            Spreads widen and liquidity thins exactly when everyone needs it.
            Haircut the rate you assume you can actually achieve.
          </ListItem>
          <ListItem>
            <strong className="font-semibold">this comparison is financing-only.</strong>{" "}
            Both routes buy the good today at today&rsquo;s TTD price, so
            waiting-and-saving is not modeled — and in an importing economy,
            waiting usually means the TTD price itself rises with the rate.
          </ListItem>
        </UnorderedList>

        <P>
          None of this is financial advice — it is a framework for replacing
          a gut feeling with a number. The gut still gets a vote; it just
          votes last.
        </P>

        <hr className="my-6 border-[var(--foreground)] opacity-20" />
        <p className="text-sm">
          <Link href="/" className="text-[var(--link)]">
            [home]
          </Link>
        </p>
      </main>
    </div>
  );
}
