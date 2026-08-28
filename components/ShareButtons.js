"use client";

import { useState } from "react";
import { Facebook, Send, MessageCircle, Link2, Check } from "lucide-react";

// X (Twitter) logo isn't in lucide-react's stable set under a reliable name,
// so a small inline SVG keeps this dependency-free and crisp at any size.
function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Facebook,
      color: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XIcon,
      color: "hover:bg-black hover:text-white hover:border-black",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
      color: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
      color: "hover:bg-[#26A5E4] hover:text-white hover:border-[#26A5E4]",
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked — silently ignore, link stays uncopied.
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-ink/50 mr-1">Paylaş:</span>
      {links.map(({ name, href, icon: Icon, color }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}-da paylaş`}
          className={`h-9 w-9 flex items-center justify-center rounded-full border border-black/10 text-ink/60 transition-colors ${color}`}
        >
          <Icon size={18} />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Linki kopyala"
        className="h-9 w-9 flex items-center justify-center rounded-full border border-black/10 text-ink/60 hover:bg-black/5 transition-colors"
      >
        {copied ? <Check size={18} className="text-emerald-600" /> : <Link2 size={18} />}
      </button>
      {copied && <span className="text-xs text-emerald-600 font-medium">Kopyalandı!</span>}
    </div>
  );
}
