if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const c=e=>i(e,t),d={module:{uri:t},exports:o,require:c};s[t]=Promise.all(n.map((e=>d[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-c1760cce"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.fa6523de.css",revision:null},{url:"assets/index.ff611030.js",revision:null},{url:"index.html",revision:"989d19373210c4f1d0ddc9eb509f225d"},{url:"registerSW.js",revision:"284cc844df7d6a9eadcc70481e290cfa"},{url:"manifest.webmanifest",revision:"1ef0f47f07bc326813816a20211a8c6e"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
