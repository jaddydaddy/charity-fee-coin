import { ArrowRight, BadgeCheck, BanknoteArrowUp, ChartNoAxesCombined, CircleDollarSign, Coins, ExternalLink, FileCheck2, HandHeart, LockKeyhole, Megaphone, ReceiptText, ShieldCheck, Sparkles, Wallet } from 'lucide-react';

const steps = [
  {
    icon: Coins,
    title: 'Launch or connect a coin',
    text: 'Creators choose a fundraiser, set the donation split, and connect the fee stream they control from the Pump.fun launch.',
  },
  {
    icon: Wallet,
    title: 'Fees accumulate on-chain',
    text: 'Every donation-intended fee lands in a public treasury wallet with live Solana transaction history and a campaign dashboard.',
  },
  {
    icon: BanknoteArrowUp,
    title: 'Crypto converts to cash',
    text: 'A verified operator or regulated off-ramp converts SOL/USDC to fiat. The conversion batch, rate, and wallet movement are logged.',
  },
  {
    icon: HandHeart,
    title: 'Donation is posted',
    text: 'The fiat donation is sent to the GoFundMe, then matched with receipt screenshots, timestamps, and the source transaction batch.',
  },
];

const concepts = [
  ['100% charity coin', 'All controlled launch fees route to the fundraiser after conversion and receipt verification.'],
  ['Split model', 'Example: 70% GoFundMe, 20% ads for reach, 10% ops/reserve — clearly displayed before buying.'],
  ['Milestone releases', 'Unlock donations in batches when the community hits volume, holder, or market-cap milestones.'],
  ['Proof wall', 'A permanent feed of treasury deposits, off-ramp batches, donation receipts, and fundraiser progress.'],
];

const safeguards = [
  'No fake “instant donation” claims unless GoFundMe accepts the payment directly.',
  'Human approval before each fiat donation batch so mistakes cannot auto-send funds to the wrong campaign.',
  'Clear disclosure of custody, conversion fees, timing delays, and who controls the treasury wallet.',
  'Sensitive campaign review to avoid exploiting tragedies, impersonation, misinformation, or harassment.',
];

const receipts = [
  { label: 'Fee wallet deposit', value: '12.42 SOL', status: 'On-chain' },
  { label: 'Converted batch', value: 'A$2,913', status: 'Reconciled' },
  { label: 'GoFundMe donation', value: 'A$2,850', status: 'Receipt pending' },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="nav">
          <div className="brand"><span><HandHeart size={18} /></span> GivePump</div>
          <a href="#proof">View proof model <ArrowRight size={16} /></a>
        </div>

        <div className="heroGrid">
          <div className="heroCopy">
            <div className="pill"><Sparkles size={15} /> Meme coin fees, made useful</div>
            <h1>Turn Pump.fun fee streams into verified GoFundMe donations.</h1>
            <p>
              GivePump is a charity memecoin launch layer: creators route the fees they control into a public treasury, convert crypto to fiat through a documented batch process, then publish GoFundMe receipts so the community can verify every dollar.
            </p>
            <div className="actions">
              <a className="primary" href="#flow">See the flow <ArrowRight size={18} /></a>
              <a className="secondary" href="#risk">Read safeguards</a>
            </div>
            <div className="miniStats">
              <div><b>Public</b><span>treasury wallet</span></div>
              <div><b>Batch</b><span>crypto → fiat</span></div>
              <div><b>Receipt</b><span>matched donation</span></div>
            </div>
          </div>

          <div className="terminalCard">
            <div className="cardTop"><span>Live campaign mock</span><BadgeCheck size={18} /></div>
            <h2>Help Mia’s Recovery Fund</h2>
            <p className="muted">Coin: $MIA • Donation split: 85% fundraiser / 15% growth</p>
            <div className="progress"><span style={{ width: '64%' }} /></div>
            <div className="raised"><b>A$18,420</b><span>tracked toward next donation batch</span></div>
            <div className="receiptList">
              {receipts.map((item) => <div key={item.label}><span>{item.label}</span><b>{item.value}</b><em>{item.status}</em></div>)}
            </div>
            <button>Donate next batch <ExternalLink size={16} /></button>
          </div>
        </div>
      </section>

      <section className="section" id="flow">
        <div className="sectionHead">
          <p>How it works</p>
          <h2>The hard part is not the token. It is trustworthy reconciliation.</h2>
        </div>
        <div className="steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return <article key={step.title} className="step"><div className="num">0{index + 1}</div><Icon size={26} /><h3>{step.title}</h3><p>{step.text}</p></article>;
          })}
        </div>
      </section>

      <section className="split section" id="proof">
        <div className="panel dark">
          <div className="eyebrow"><ReceiptText size={16} /> Proof wall</div>
          <h2>Every campaign gets a public accounting page.</h2>
          <p>Not vague “we donated” marketing. A campaign shows deposits, swap/off-ramp batches, GoFundMe donation screenshots, receipt IDs, and any fees lost to spread or processing.</p>
          <div className="ledger">
            <div><span>7G3k...9pQ</span><b>+2.18 SOL</b><em>Fee deposit</em></div>
            <div><span>Batch #014</span><b>A$1,260</b><em>Converted</em></div>
            <div><span>GoFundMe</span><b>A$1,220</b><em>Donated</em></div>
          </div>
        </div>
        <div className="panel">
          <div className="eyebrow"><ChartNoAxesCombined size={16} /> Campaign modes</div>
          <h2>More than one charity mechanic.</h2>
          <div className="concepts">
            {concepts.map(([title, text]) => <div key={title}><b>{title}</b><p>{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section risk" id="risk">
        <div className="sectionHead">
          <p>Trust layer</p>
          <h2>If this touches real fundraisers, it needs guardrails.</h2>
        </div>
        <div className="riskGrid">
          {safeguards.map((item) => <div key={item} className="riskItem"><ShieldCheck size={20} />{item}</div>)}
        </div>
      </section>

      <section className="cta">
        <div>
          <p><Megaphone size={17} /> MVP direction</p>
          <h2>Start as a transparent donation router, not a fully autonomous money machine.</h2>
          <span>Phase one should prove: controlled Pump.fun fee stream → public treasury → manual off-ramp batch → GoFundMe receipt wall. Automate the dashboard first. Automate money movement only after legal/compliance review.</span>
        </div>
        <a href="mailto:hello@givepump.example">Join beta <ArrowRight size={18} /></a>
      </section>
    </main>
  );
}
