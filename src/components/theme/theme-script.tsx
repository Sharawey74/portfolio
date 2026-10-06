/**
 * Runs before first paint (inline, not deferred, not a module) so a pinned
 * theme never flashes. Without a pinned choice the system preference wins;
 * dark is the default otherwise. Also restores the global animation pause.
 */
const script = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("theme");if(localStorage.getItem("motion")==="paused")d.dataset.motion="paused"}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t;var m=document.querySelector('meta[name="color-scheme"]');if(m)m.content=t})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
