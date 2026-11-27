import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";
import {InspectDrawer} from "../../src/components/InspectDrawer";
import {ReceiptDigestModal} from "../../src/components/ReceiptDigestModal";

// Test-only controlled consumer. Closing the lower modal from outside its
// inert UI models a caller changing props (e.g. a route or data update).
function StackedDialogs() {
  const [outer, setOuter] = useState(false);
  const [inner, setInner] = useState(false);
  useEffect(() => {
    const removeOuter = () => setOuter(false);
    window.addEventListener("qa:remove-outer-dialog", removeOuter);
    return () => window.removeEventListener("qa:remove-outer-dialog", removeOuter);
  }, []);
  return <>
    <button onClick={() => setOuter(true)}>Открыть внешний QA диалог</button>
    <InspectDrawer isOpen={outer} title="Внешний QA диалог" onClose={() => setOuter(false)}>
      <button onClick={() => setInner(true)}>Открыть внутренний QA диалог</button>
    </InspectDrawer>
    <ReceiptDigestModal isOpen={inner} title="Внутренний QA диалог"
      narrative="Контролируемый сценарий двух модалок" receipts={[]}
      onClose={() => setInner(false)}/>
  </>;
}

const host = document.createElement("div");
host.id = "qa-stacked-dialogs";
host.style.cssText = "position:fixed;inset:100px 20px auto;z-index:9999;background:var(--ground);padding:20px";
document.body.append(host);
createRoot(host).render(<StackedDialogs/>);
