import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import {SegmentedControl} from "../../src/components/SegmentedControl";

function DynamicTabs() {
  const [value, setValue] = useState("a");
  const [disabled, setDisabled] = useState(false);
  const [removed, setRemoved] = useState(false);
  const items = [
    ...(!removed ? [{id: "a", label: "Alpha", disabled, tabId: "qa-tab-a", panelId: "qa-panel-a"}] : []),
    {id: "b", label: "Beta", tabId: "qa-tab-b", panelId: "qa-panel-b"},
  ];
  return <section aria-label="Dynamic tabs QA">
    <button onClick={() => setDisabled(true)}>Disable Alpha</button>
    <button onClick={() => setRemoved(true)}>Remove Alpha</button>
    <SegmentedControl semantics="tabs" aria-label="Dynamic tabs" items={items} value={value} onChange={setValue}/>
    <div role="tabpanel" id={"qa-panel-" + value} aria-labelledby={"qa-tab-" + value} tabIndex={0}>{value === "a" ? "Alpha content" : "Beta content"}</div>
  </section>;
}

const host = document.createElement("div");
host.style.cssText = "position:fixed;inset:100px 20px auto;z-index:9999;background:var(--ground);padding:20px";
document.body.append(host);
createRoot(host).render(<DynamicTabs/>);
