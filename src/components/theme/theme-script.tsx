/**
 * Runs before first paint (inline, not deferred, not a module). It sets:
 *   data-theme   pinned choice, else the system preference (dark otherwise)
 *   data-motion  "paused" when the global pause was saved
 *   data-reveal  "on" when motion is allowed: enables M3 hidden-then-revealed
 *                text. Absent with JS off or reduced motion, so text is static.
 *   data-intro   "play" on the first visit of a session (M1), never under
 *                reduced motion, Save-Data or the pause.
 *   data-vt      "none" when the View Transitions API is missing: route
 *                changes then use a CSS fade instead of the morph (M8).
 */
const script = `(function(){var d=document.documentElement,t,p=false,rm=matchMedia("(prefers-reduced-motion: reduce)").matches,c=navigator.connection,sd=!!(c&&c.saveData);try{t=localStorage.getItem("theme");p=localStorage.getItem("motion")==="paused"}catch(e){}if(p)d.dataset.motion="paused";if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.dataset.theme=t;var m=document.querySelector('meta[name="color-scheme"]');if(m)m.content=t;if(!rm&&!p)d.dataset.reveal="on";if(!document.startViewTransition)d.dataset.vt="none";try{if(!rm&&!p&&!sd&&!sessionStorage.getItem("intro")){d.dataset.intro="play";sessionStorage.setItem("intro","1")}}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
