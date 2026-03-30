// The KPN theme runs hljs.highlightAll() which auto-detects languages on
// code blocks that don't have a language class. pymdownx.highlight puts the
// language class on the wrapper div, not the code element, so hljs doesn't
// see it. This script finds text/plain blocks via the wrapper and strips
// the bad hljs highlighting from the inner code element.
document.querySelectorAll('.language-text code, .language-plain code, .language-plaintext code').forEach(function (el) {
  el.className = 'nohighlight hljs language-undefined';
  el.innerHTML = el.textContent;
});
