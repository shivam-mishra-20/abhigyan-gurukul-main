/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";

function upsertMeta(attrName, attrValue, content) {
  let selector = `[${attrName}="${attrValue}"]`;
  let el = document.head.querySelector(`meta${selector}`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEO({ title, metas = [], links = [], scripts = [] }) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    // keep track of added script nodes so we can remove them on cleanup
    const addedScripts = [];

    metas.forEach((m) => {
      if (m.name) upsertMeta("name", m.name, m.content);
      else if (m.property) upsertMeta("property", m.property, m.content);
    });

    links.forEach((l) => {
      if (l.rel && l.href) upsertLink(l.rel, l.href);
    });

    scripts.forEach((s) => {
      const node = document.createElement("script");
      if (s.type) node.type = s.type;
      if (s.id) node.id = s.id;
      node.text = s.innerHTML || s.src || "";
      document.head.appendChild(node);
      addedScripts.push(node);
    });

    return () => {
      // restore title
      document.title = prevTitle;
      // remove added scripts
      addedScripts.forEach((n) => n.parentNode && n.parentNode.removeChild(n));
    };
  }, [
    title,
    JSON.stringify(metas),
    JSON.stringify(links),
    JSON.stringify(scripts),
  ]);

  return null;
}
