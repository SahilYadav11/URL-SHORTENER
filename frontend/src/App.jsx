import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url || loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#fff_0%,#fafbf9_42%,#f1f5f1_100%)] px-5 py-12 font-sans text-[#18352e] sm:px-6 sm:py-[72px]">
      <section className="relative z-10 w-full max-w-[620px] text-center" aria-labelledby="page-title">
        <h1 id="page-title" className="text-[clamp(40px,7vw,62px)] font-extrabold leading-[1.08] tracking-[-.055em] text-[#193c31]">
          Make your links<br /><span className="text-[#73a48d]">short and sweet.</span>
        </h1>

        <div className="mt-8 flex flex-col gap-[7px] rounded-[14px] border border-[#e4eae5] bg-white p-2 sm:mt-9 sm:flex-row sm:gap-2 sm:rounded-2xl sm:p-[7px]">
          <label className="sr-only" htmlFor="long-url">Your long URL</label>
          <div className="flex min-h-[45px] min-w-0 flex-1 items-center gap-[11px] px-3 sm:min-h-0">
            <svg className="size-[19px] shrink-0 stroke-[#9aaba2]" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 13.5a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 4.84l-1.72 1.72" />
              <path d="M14 10.5a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 19.16l1.72-1.72" />
            </svg>
            <input
              id="long-url"
              type="text"
              className="w-full min-w-0 border-0 bg-transparent text-sm text-[#26483c] outline-none placeholder:text-[#a5b1aa]"
              placeholder="Paste your long link here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            onClick={handleShorten}
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 whitespace-nowrap rounded-[11px] bg-[#286b55] px-5 text-[13px] font-bold text-white transition hover:bg-[#1d5945] disabled:cursor-wait disabled:opacity-80 sm:w-auto"
          >
            {loading ? <><span className="size-[14px] animate-spin rounded-full border-2 border-white/40 border-t-white" /> Making link</> : "Shorten link"}
          </button>
        </div>

        {!shortUrl ? (
          <div className="mt-[22px] text-xs text-[#91a098]">Your link, ready in a moment</div>
        ) : (
          <section className="mt-6 rounded-[18px] border border-[#e5ebe6] bg-white p-[18px] text-left shadow-[0_14px_36px_#233f300d] sm:mt-[30px] sm:p-[22px]" aria-live="polite" aria-label="Your shortened link">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-[#eaf4ed] font-bold text-[#38805c]" aria-hidden="true">✓</span>
              <div className="min-w-0">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[.04em] text-[#6e8177]">Your short link is ready</p>
                <a className="block break-all text-sm font-semibold text-[#286b55] hover:underline sm:text-[15px]" target="_blank" rel="noreferrer" href={shortUrl}>{shortUrl}</a>
              </div>
            </div>
            <button
              className={`mt-[19px] flex min-h-[43px] w-full items-center justify-center gap-2 rounded-[10px] border text-[13px] font-bold transition ${copied ? "border-[#d8eadb] bg-[#eef7ef] text-[#397653]" : "border-[#dce8df] bg-[#f6faf6] text-[#286b55] hover:bg-[#edf5ef]"}`}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy link"}
              {!copied && <svg className="size-[17px] stroke-current" viewBox="0 0 20 20" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7" y="6" width="9" height="11" rx="2" /><path d="M12 6V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2" /></svg>}
            </button>
            <div className="my-5 h-px bg-[#edf0ed]" />
            <div className="flex items-center gap-[17px]">
              <div className="shrink-0 rounded-xl border border-[#edf0ed] p-[9px] leading-none"><QRCode value={shortUrl} size={104} /></div>
              <div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[.04em] text-[#6e8177]">Take it anywhere</p>
                <p className="max-w-[250px] text-xs leading-relaxed text-[#87958d]">Scan this code to open your link on any device.</p>
                {qrImage && <a className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#286b55] hover:underline" download="qr-code.png" href={qrImage}>Download QR code <span aria-hidden="true">↓</span></a>}
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
