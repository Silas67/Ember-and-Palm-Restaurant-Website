import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowRight, CalendarDays, Check, ChevronDown, Clock3, Instagram, MapPin, Menu, Minus, Phone, Plus, ShoppingBag, Star, Utensils, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const phone = '+234 801 234 5678';
const whatsappNumber = '2348012345678';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tag?: string;
};

const menuItems: MenuItem[] = [
  { id: 'suya', name: 'Smoked Suya', description: 'Charred beef fillet, yaji, pickled onion, peanut dust', price: 8500, category: 'Small plates', image: 'https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg?auto=compress&cs=tinysrgb&w=900', tag: "House favourite" },
  { id: 'prawns', name: 'Prawn Peppered Toast', description: 'Tiger prawns, ata rodo butter, sourdough, lime', price: 12500, category: 'Small plates', image: 'https://images.pexels.com/photos/5718029/pexels-photo-5718029.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'plantain', name: 'Dodo & Whipped Feta', description: 'Sweet plantain, cultured feta, honeyed scotch bonnet', price: 7500, category: 'Small plates', image: 'https://images.pexels.com/photos/5848496/pexels-photo-5848496.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'fish', name: 'Ember Fish', description: 'Whole grilled croaker, charred tomato relish, herbs', price: 28000, category: 'From the fire', image: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=900', tag: 'To share' },
  { id: 'chicken', name: 'Ofada Chicken', description: 'Free-range chicken, green pepper sauce, crispy rice', price: 19500, category: 'From the fire', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'short-rib', name: 'Palm Wine Short Rib', description: '12-hour beef rib, palm wine glaze, smoked yam', price: 26000, category: 'From the fire', image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'rice', name: 'Jollof Ember Rice', description: 'Basmati, fire-roasted pepper, fried plantain, egg', price: 11000, category: 'From the garden', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'salad', name: 'Garden of Wuse', description: 'Market greens, cashew, citrus, tigernut dressing', price: 9500, category: 'From the garden', image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'puffpuff', name: 'Puff-Puff & Dark Chocolate', description: 'Warm puff-puff, 70% chocolate sauce, sea salt', price: 7000, category: 'Sweet things', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=900' },
  { id: 'zobo', name: 'Zobo Spritz', description: 'Hibiscus, ginger, citrus, sparkling water', price: 5500, category: 'Drinks', image: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=900' },
];

const categories = ['All plates', 'Small plates', 'From the fire', 'From the garden', 'Sweet things', 'Drinks'];
const formatNaira = (price: number) => `₦${price.toLocaleString('en-NG')}`;

function Home() {
  const [activeCategory, setActiveCategory] = useState('All plates');
  const [order, setOrder] = useState<Record<string, number>>({});
  const [orderOpen, setOrderOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);

  const visibleItems = useMemo(
    () => activeCategory === 'All plates' ? menuItems : menuItems.filter((item) => item.category === activeCategory),
    [activeCategory],
  );
  const orderLines = useMemo(
    () => menuItems.filter((item) => order[item.id]).map((item) => ({ ...item, quantity: order[item.id] })),
    [order],
  );
  const itemCount = orderLines.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = orderLines.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToOrder = (id: string) => {
    setOrder((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setOrderOpen(true);
  };
  const changeQuantity = (id: string, change: number) => {
    setOrder((current) => {
      const next = Math.max(0, (current[id] || 0) + change);
      const copy = { ...current };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };
  const reserve = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReservationSent(true);
  };
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  const whatsappMessage = encodeURIComponent(
    orderLines.length
      ? `Hello Ember & Palm, I'd like to order:\n${orderLines.map((line) => `${line.quantity} × ${line.name}`).join('\n')}\n\nEstimated total: ${formatNaira(orderTotal)}`
      : 'Hello Ember & Palm, I would like to place an order.',
  );

  return (
    <div className="grain site-shell bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-30 text-[#f6eee0]">
        <div className="section-wrap flex items-center justify-between border-b border-[#f6eee0]/25 py-5">
          <a href="#top" className="group flex items-center gap-3" data-testid="link-brand">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f6eee0] text-sm font-bold transition-transform group-hover:rotate-12">E</span>
            <span className="hidden text-sm font-bold tracking-[.19em] sm:inline">EMBER <i className="font-display font-normal tracking-normal">&</i> PALM</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a className="nav-link" href="#menu" data-testid="link-menu">Menu</a>
            <a className="nav-link" href="#story" data-testid="link-story">Our table</a>
            <a className="nav-link" href="#visit" data-testid="link-visit">Find us</a>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => scrollTo('reserve')} className="btn btn-lime hidden min-h-9 px-4 text-[.65rem] sm:inline-flex" data-testid="button-header-reserve"><CalendarDays size={14} /> Reserve</button>
            <button type="button" className="relative rounded-full border border-[#f6eee0]/50 p-2.5 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Open navigation" data-testid="button-mobile-menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <button type="button" onClick={() => setOrderOpen(true)} className="relative rounded-full border border-[#f6eee0]/50 p-2.5" aria-label="Open order" data-testid="button-header-order">
              <ShoppingBag size={17} />
              {itemCount > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d8e55b] px-1 text-[9px] font-bold text-[#211b1d]" data-testid="text-order-count">{itemCount}</span>}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-b border-[#f6eee0]/20 bg-[#211b1d] px-6 py-6 md:hidden">
            <div className="flex flex-col gap-5">
              <button type="button" onClick={() => scrollTo('menu')} className="text-left font-display text-3xl" data-testid="button-mobile-menu-link">The menu</button>
              <button type="button" onClick={() => scrollTo('story')} className="text-left font-display text-3xl" data-testid="button-mobile-story-link">Our table</button>
              <button type="button" onClick={() => scrollTo('visit')} className="text-left font-display text-3xl" data-testid="button-mobile-visit-link">Find us</button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero-grid relative grid min-h-[720px] bg-[#211b1d] text-[#f6eee0] md:grid-cols-[1.05fr_.95fr]" aria-label="Ember and Palm welcome">
          <div className="relative flex flex-col justify-end px-6 pb-16 pt-36 sm:px-12 md:px-[max(48px,calc((100vw-1200px)/2))] md:pb-20">
            <div className="reveal absolute left-6 top-32 flex items-center gap-3 text-[#d8e55b] sm:left-12 md:left-[max(48px,calc((100vw-1200px)/2))]">
              <span className="h-px w-9 bg-[#d8e55b]" />
              <span className="eyebrow">Wuse 2, Abuja · Est. 2024</span>
            </div>
            <div className="relative z-10 reveal reveal-delay-1">
              <p className="eyebrow mb-5 text-[#f6eee0]/60">A contemporary Nigerian table</p>
              <h1 className="display-xl max-w-3xl">Come for the <em className="text-[#d8e55b]">fire.</em><br />Stay for the <em className="text-[#ef7a47]">feeling.</em></h1>
              <p className="mt-8 max-w-sm text-sm leading-7 text-[#f6eee0]/70 sm:text-base">A bright, generous room where Abuja gathers around the best bits of home — cooked over flame and passed to the middle.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button type="button" onClick={() => scrollTo('menu')} className="btn btn-lime" data-testid="button-hero-menu">Explore the menu <ArrowDownRight size={16} /></button>
                <button type="button" onClick={() => scrollTo('reserve')} className="btn btn-outline border-[#f6eee0]/40 text-[#f6eee0]" data-testid="button-hero-reserve">Book a table</button>
              </div>
            </div>
            <div className="absolute bottom-6 right-7 hidden -rotate-90 text-[.6rem] uppercase tracking-[.2em] text-[#f6eee0]/45 md:block">Scroll to gather</div>
          </div>
          <div className="relative min-h-[390px] overflow-hidden md:min-h-0">
            <img className="hero-photo image-cover absolute inset-0" src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="Warmly lit dining room with tables prepared for dinner" data-testid="img-hero-interior" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211b1d]/40 to-transparent" />
            <div className="absolute bottom-8 left-8 flex items-center gap-3 text-[#f6eee0]"><span className="h-2 w-2 rounded-full bg-[#d8e55b]" /><span className="eyebrow">Dinner is served nightly</span></div>
            <div className="absolute right-7 top-28 flex h-28 w-28 -rotate-12 items-center justify-center rounded-full bg-[#d8e55b] text-center text-[.62rem] font-bold uppercase leading-tight tracking-wider text-[#211b1d]">Made for<br />sharing<br /><ArrowDownRight size={15} className="mt-1" /></div>
          </div>
        </section>

        <div className="overflow-hidden border-b border-[#211b1d]/15 bg-[#d8e55b] py-4 text-[#211b1d]">
          <div className="marquee flex w-max items-center gap-8"><span className="eyebrow">Local hands · loud flavours · open hearts</span><span className="text-2xl" aria-hidden="true">+</span><span className="eyebrow">Local hands · loud flavours · open hearts</span><span className="text-2xl" aria-hidden="true">+</span><span className="eyebrow">Local hands · loud flavours · open hearts</span><span className="text-2xl" aria-hidden="true">+</span></div>
        </div>

        <section className="bg-[#f6eee0] py-24 sm:py-32" id="story">
          <div className="section-wrap grid items-end gap-14 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow mb-8 text-[#d85c2c]" data-testid="text-story-eyebrow">Not your usual night out</p>
              <h2 className="display-lg">The table is the <em className="text-[#d85c2c]">point.</em></h2>
              <p className="mt-8 max-w-md text-[.95rem] leading-8 text-[#4f4542]">Ember & Palm is a love letter to the way we eat in Nigeria: a little loud, a little late, and always with room for one more. Our kitchen takes the flavours we grew up with and lets them wander.</p>
              <button type="button" onClick={() => scrollTo('visit')} className="group mt-8 inline-flex items-center gap-3 border-b border-[#211b1d] pb-2 text-xs font-bold uppercase tracking-wider" data-testid="button-story-visit">Come as you are <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></button>
            </div>
            <div className="grid grid-cols-[1.2fr_.8fr] items-end gap-4">
              <figure className="relative aspect-[.82] overflow-hidden rounded-t-full bg-[#d85c2c]">
                <img className="image-cover" src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Colourful plate of food being shared at a table" data-testid="img-story-food" />
                <figcaption className="absolute bottom-4 left-4 right-4 flex justify-between text-[#f6eee0]"><span className="eyebrow">Our kind of comfort</span><ArrowDownRight size={16} /></figcaption>
              </figure>
              <div className="pb-3">
                <div className="mb-4 border-t border-[#211b1d]/25 pt-3"><span className="eyebrow text-[#d85c2c]">01 /</span><p className="mt-2 text-sm leading-6">Fire-kissed ingredients from the markets we know.</p></div>
                <div className="border-t border-[#211b1d]/25 pt-3"><span className="eyebrow text-[#d85c2c]">02 /</span><p className="mt-2 text-sm leading-6">A room that feels like coming home to the good china.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#211b1d] py-24 text-[#f6eee0] sm:py-32" id="menu">
          <div className="section-wrap">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div><p className="eyebrow mb-5 text-[#d8e55b]">The good stuff</p><h2 className="display-lg">Plates worth<br /><em className="text-[#ef7a47]">passing around.</em></h2></div>
              <p className="max-w-xs text-sm leading-7 text-[#f6eee0]/60">Our menu moves with the market. Start small, order generously, and let the table decide where the night goes.</p>
            </div>
            <div className="mt-12 flex gap-2 overflow-x-auto pb-3" role="tablist" aria-label="Menu categories">
              {categories.map((category) => (
                <button key={category} type="button" role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[.68rem] uppercase tracking-wider transition-colors ${activeCategory === category ? 'border-[#d8e55b] bg-[#d8e55b] text-[#211b1d]' : 'border-[#f6eee0]/25 text-[#f6eee0]/65 hover:border-[#f6eee0]'}`} data-testid={`tab-menu-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {visibleItems.map((item) => (
                <article className="menu-card group grid grid-cols-[92px_1fr_auto] gap-4 rounded-2xl border border-[#f6eee0]/15 bg-[#2b2325] p-3 sm:grid-cols-[120px_1fr_auto] sm:gap-5 sm:p-4" key={item.id} data-testid={`card-menu-${item.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-xl"><img className="image-cover" src={item.image} alt={item.name} data-testid={`img-menu-${item.id}`} />{item.tag && <span className="absolute left-2 top-2 rounded-full bg-[#d8e55b] px-2 py-1 text-[.55rem] font-bold uppercase tracking-wide text-[#211b1d]">{item.tag}</span>}</div>
                  <div className="flex min-w-0 flex-col justify-center"><h3 className="font-display text-[1.55rem] leading-none sm:text-[1.7rem]">{item.name}</h3><p className="mt-2 max-w-[230px] text-xs leading-5 text-[#f6eee0]/55">{item.description}</p><p className="mt-3 font-mono-label text-xs text-[#ef7a47]">{formatNaira(item.price)}</p></div>
                  <button type="button" className="menu-add self-end rounded-full border border-[#f6eee0]/30 p-2.5 text-[#f6eee0]" onClick={() => addToOrder(item.id)} aria-label={`Add ${item.name} to order`} data-testid={`button-add-${item.id}`}><Plus size={17} /></button>
                </article>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-[#f6eee0]/15 pt-6 sm:flex-row sm:items-center"><p className="font-mono-label text-[.65rem] uppercase tracking-wider text-[#f6eee0]/50">Kitchen hours · Tue — Sun · 12:00 — 22:30</p><button type="button" onClick={() => setOrderOpen(true)} className="btn btn-lime" data-testid="button-view-order"><ShoppingBag size={15} /> View your order {itemCount > 0 && `(${itemCount})`}</button></div>
          </div>
        </section>

        <section className="bg-[#ef7a47] py-20 text-[#211b1d] sm:py-28">
          <div className="section-wrap grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div><p className="eyebrow mb-5">A little ritual</p><h2 className="display-lg">Lunch that<br /><em>takes its time.</em></h2></div>
            <div className="grid gap-6 sm:grid-cols-2"><p className="text-sm leading-7">Weekday lunches, reimagined for the Wuse pace. A short menu, a cold glass, and enough time to remember that the day is yours.</p><div className="border-t border-[#211b1d]/30 pt-4"><p className="font-mono-label text-xs uppercase">Tuesday — Friday</p><p className="mt-2 font-display text-3xl">12:00 — 16:00</p><button type="button" onClick={() => scrollTo('reserve')} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider" data-testid="button-lunch-reserve">Reserve lunch <ArrowRight size={15} /></button></div></div>
          </div>
        </section>

        <section className="bg-[#f6eee0] py-24 sm:py-32">
          <div className="section-wrap">
            <div className="mb-10 flex items-end justify-between"><div><p className="eyebrow mb-5 text-[#d85c2c]">A peek inside</p><h2 className="display-lg">The room,<br /><em>after dark.</em></h2></div><p className="hidden max-w-[180px] text-right text-xs leading-5 text-[#4f4542] sm:block">Come early for golden hour. Stay for the last song.</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-[220px_160px]">
              <figure className="gallery-frame col-span-2 row-span-2 overflow-hidden rounded-tl-[4rem] bg-[#d85c2c]"><img className="gallery-img image-cover" src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Friends sharing dinner in a warmly lit restaurant" data-testid="img-gallery-one" /></figure>
              <figure className="gallery-frame overflow-hidden rounded-tr-3xl bg-[#d8e55b]"><img className="gallery-img image-cover" src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fresh herbs and ingredients on a kitchen counter" data-testid="img-gallery-two" /></figure>
              <figure className="gallery-frame overflow-hidden rounded-bl-3xl bg-[#211b1d]"><img className="gallery-img image-cover" src="https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Atmospheric restaurant bar with warm lights" data-testid="img-gallery-three" /></figure>
              <figure className="gallery-frame col-span-2 overflow-hidden rounded-br-[4rem] bg-[#ef7a47]"><img className="gallery-img image-cover" src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Shared plates arranged on a dinner table" data-testid="img-gallery-four" /></figure>
            </div>
          </div>
        </section>

        <section className="bg-[#d8e55b] py-20 text-[#211b1d] sm:py-28">
          <div className="section-wrap grid gap-10 md:grid-cols-[.65fr_1.35fr] md:items-start"><div><p className="eyebrow mb-5">Good company</p><h2 className="display-lg">Say it<br /><em>like it is.</em></h2></div><div className="grid gap-6 md:grid-cols-2"><blockquote className="border-t border-[#211b1d]/40 pt-4"><div className="mb-7 flex gap-1">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><p className="font-display text-3xl leading-[1.03]">“The kind of meal that makes you forget to check your phone.”</p><footer className="mt-8 font-mono-label text-[.65rem] uppercase">— Amaka O. · Google review</footer></blockquote><blockquote className="border-t border-[#211b1d]/40 pt-4 md:mt-20"><div className="mb-7 flex gap-1">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><p className="font-display text-3xl leading-[1.03]">“Abuja needed a place like this. Warm, generous, and properly delicious.”</p><footer className="mt-8 font-mono-label text-[.65rem] uppercase">— Tunde K. · Dinner guest</footer></blockquote></div></div>
        </section>

        <section className="bg-[#211b1d] py-24 text-[#f6eee0] sm:py-32" id="reserve">
          <div className="section-wrap grid gap-14 md:grid-cols-[.85fr_1.15fr]">
            <div><p className="eyebrow mb-5 text-[#d8e55b]">Make it a date</p><h2 className="display-lg">Your table<br /><em className="text-[#ef7a47]">is waiting.</em></h2><p className="mt-8 max-w-sm text-sm leading-7 text-[#f6eee0]/60">For groups of 8 or more, celebrations, or the table in the corner, call us and we will make it special.</p><a href={`tel:${phone.replaceAll(' ', '')}`} className="mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#d8e55b]" data-testid="link-reservation-call"><Phone size={16} /> {phone}</a></div>
            {reservationSent ? (
              <div className="flex min-h-[390px] flex-col items-start justify-center rounded-3xl bg-[#f6eee0] p-8 text-[#211b1d] sm:p-12" data-testid="status-reservation-confirmation"><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#d8e55b]"><Check size={25} /></div><p className="eyebrow text-[#d85c2c]">Request received</p><h3 className="mt-4 font-display text-5xl leading-none">We’ll keep<br />a seat warm.</h3><p className="mt-5 max-w-sm text-sm leading-6 text-[#4f4542]">Thank you. Our host will call you shortly to confirm your table and any delicious details.</p><button type="button" onClick={() => setReservationSent(false)} className="mt-8 text-xs font-bold uppercase tracking-wider underline underline-offset-4" data-testid="button-reservation-again">Make another request</button></div>
            ) : (
              <form onSubmit={reserve} className="rounded-3xl bg-[#f6eee0] p-6 text-[#211b1d] sm:p-10" data-testid="form-reservation">
                <div className="mb-8 flex items-center justify-between border-b border-[#211b1d]/15 pb-5"><h3 className="font-display text-3xl">Reserve a table</h3><span className="eyebrow text-[#d85c2c]">01 / 01</span></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="text-xs font-bold">Name<input required className="input-field mt-2" placeholder="Your name" name="name" data-testid="input-reservation-name" /></label>
                  <label className="text-xs font-bold">Phone<input required type="tel" className="input-field mt-2" placeholder="+234 ..." name="phone" data-testid="input-reservation-phone" /></label>
                  <label className="text-xs font-bold">Date<input required type="date" className="input-field mt-2" name="date" data-testid="input-reservation-date" /></label>
                  <label className="text-xs font-bold">Time<select className="input-field mt-2" name="time" defaultValue="19:30" data-testid="select-reservation-time"><option>18:00</option><option>19:30</option><option>21:00</option></select></label>
                  <label className="text-xs font-bold sm:col-span-2">Party size<select className="input-field mt-2" name="party" defaultValue="2 guests" data-testid="select-reservation-party"><option>2 guests</option><option>3 guests</option><option>4 guests</option><option>5–7 guests</option></select></label>
                </div>
                <button type="submit" className="btn btn-primary mt-7 w-full" data-testid="button-submit-reservation">Request my table <ArrowRight size={16} /></button>
                <p className="mt-4 text-center text-[.65rem] leading-5 text-[#4f4542]">We hold tables for 15 minutes. For same-day bookings, please call.</p>
              </form>
            )}
          </div>
        </section>

        <section className="bg-[#f6eee0] py-24 sm:py-32" id="visit">
          <div className="section-wrap grid gap-12 md:grid-cols-[1.1fr_.9fr]">
            <div><p className="eyebrow mb-5 text-[#d85c2c]">Come find us</p><h2 className="display-lg">Right in the<br /><em>middle of it.</em></h2><div className="mt-10 grid gap-7 sm:grid-cols-2"><div><p className="eyebrow text-[#d85c2c]">Address</p><p className="mt-3 text-sm leading-6">12 Agadez Crescent<br />Wuse 2, Abuja</p><a href="https://www.google.com/maps/search/?api=1&query=12+Agadez+Crescent+Wuse+2+Abuja" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider underline underline-offset-4" data-testid="link-directions">Get directions <ArrowUpRightIcon /></a></div><div><p className="eyebrow text-[#d85c2c]">Hours</p><p className="mt-3 text-sm leading-6">Tue — Thu · 12:00 — 22:30<br />Fri — Sat · 12:00 — 23:30<br />Sunday · 12:00 — 21:30</p></div></div></div>
            <div className="relative min-h-[330px] overflow-hidden rounded-[2rem] bg-[#d8e55b] p-6 sm:min-h-[390px]"><div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, #211b1d 1px, transparent 1px), linear-gradient(-45deg, #211b1d 1px, transparent 1px)', backgroundSize: '28px 28px' }} /><div className="relative flex h-full flex-col justify-between"><div className="flex justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#211b1d] text-[#d8e55b]"><MapPin size={20} /></span><span className="eyebrow">Wuse 2 / Abuja</span></div><div className="flex items-end justify-between"><p className="max-w-[180px] font-display text-4xl leading-[.9]">Follow the<br /><em>good smell.</em></p><a href="https://www.google.com/maps/search/?api=1&query=12+Agadez+Crescent+Wuse+2+Abuja" target="_blank" rel="noreferrer" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ef7a47] transition-transform hover:rotate-45" aria-label="Open map" data-testid="button-open-map"><ArrowUpRightIcon /></a></div></div></div>
          </div>
        </section>
      </main>

      <footer className="bg-[#211b1d] py-10 text-[#f6eee0]">
        <div className="section-wrap flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><a href="#top" className="flex items-center gap-3" data-testid="link-footer-brand"><span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f6eee0] text-sm font-bold">E</span><span className="text-sm font-bold tracking-[.19em]">EMBER <i className="font-display font-normal tracking-normal">&</i> PALM</span></a><p className="mt-5 max-w-xs text-xs leading-6 text-[#f6eee0]/50">Contemporary Nigerian dining, cooked with fire and a generous spirit.</p></div><div className="flex flex-col gap-4 sm:items-end"><div className="flex gap-5"><a className="nav-link" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp">WhatsApp</a><a className="nav-link" href="https://instagram.com" target="_blank" rel="noreferrer" data-testid="link-footer-instagram"><Instagram size={15} /></a><a className="nav-link" href={`tel:${phone.replaceAll(' ', '')}`} data-testid="link-footer-phone">Call</a></div><p className="font-mono-label text-[.6rem] uppercase text-[#f6eee0]/35">© 2024 Ember & Palm · Abuja</p></div></div>
      </footer>

      <div className={`fixed inset-0 z-40 bg-[#211b1d]/50 transition-opacity ${orderOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`} onClick={() => setOrderOpen(false)} aria-hidden="true" data-testid="button-close-order-overlay" />
      <aside className={`order-drawer fixed right-0 top-0 z-50 flex h-[100dvh] w-full max-w-md flex-col bg-[#f6eee0] text-[#211b1d] transition-transform duration-300 ${orderOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-label="Your order" aria-hidden={!orderOpen}>
        <div className="flex items-center justify-between border-b border-[#211b1d]/15 p-6"><div><p className="eyebrow text-[#d85c2c]">For the table</p><h2 className="mt-1 font-display text-4xl">Your order</h2></div><button type="button" onClick={() => setOrderOpen(false)} className="rounded-full border border-[#211b1d]/20 p-2" aria-label="Close order" data-testid="button-close-order"><X size={18} /></button></div>
        {orderLines.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center p-8 text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d8e55b]"><Utensils size={25} /></div><h3 className="font-display text-3xl">Nothing on the table yet.</h3><p className="mt-3 max-w-[230px] text-sm leading-6 text-[#4f4542]">Browse the menu and add something you would happily share.</p><button type="button" onClick={() => { setOrderOpen(false); scrollTo('menu'); }} className="btn btn-primary mt-7" data-testid="button-order-browse">Browse the menu</button></div> : <><div className="flex-1 overflow-y-auto p-6"><div className="space-y-4">{orderLines.map((line) => <div className="flex gap-3 border-b border-[#211b1d]/10 pb-4" key={line.id} data-testid={`row-order-${line.id}`}><img src={line.image} alt="" className="h-16 w-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="font-display text-xl leading-none">{line.name}</p><p className="mt-2 font-mono-label text-[.68rem] text-[#d85c2c]">{formatNaira(line.price * line.quantity)}</p><div className="mt-2 flex items-center gap-2"><button type="button" className="rounded-full border border-[#211b1d]/20 p-1" onClick={() => changeQuantity(line.id, -1)} aria-label={`Remove one ${line.name}`} data-testid={`button-decrease-${line.id}`}><Minus size={12} /></button><span className="w-5 text-center text-xs font-bold" data-testid={`text-quantity-${line.id}`}>{line.quantity}</span><button type="button" className="rounded-full border border-[#211b1d]/20 p-1" onClick={() => changeQuantity(line.id, 1)} aria-label={`Add one ${line.name}`} data-testid={`button-increase-${line.id}`}><Plus size={12} /></button></div></div></div>)}</div></div><div className="border-t border-[#211b1d]/15 p-6"><div className="flex items-baseline justify-between"><span className="eyebrow">Estimated total</span><span className="font-display text-3xl" data-testid="text-order-total">{formatNaira(orderTotal)}</span></div><a className="btn btn-primary mt-5 w-full" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" data-testid="link-whatsapp-order">Order on WhatsApp <ArrowRight size={16} /></a><p className="mt-3 text-center text-[.65rem] leading-5 text-[#4f4542]">We’ll confirm availability and delivery details with you.</p></div></>}
      </aside>
      <button type="button" onClick={() => setOrderOpen(true)} className="mobile-order-bar fixed bottom-4 left-4 right-4 z-30 items-center justify-between rounded-full bg-[#d8e55b] px-5 py-3 text-[#211b1d] shadow-xl" data-testid="button-mobile-order-bar"><span className="flex items-center gap-2 text-xs font-bold"><ShoppingBag size={15} /> {itemCount ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : 'Start an order'}</span><span className="font-mono-label text-[.7rem]">{itemCount ? formatNaira(orderTotal) : 'View menu'}</span></button>
    </div>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={15} className="-rotate-45" />;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;