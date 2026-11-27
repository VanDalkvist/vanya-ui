import {ActionButton,SegmentedControl,WorkspaceSplit,SurfaceHeader,ThemeToggle,type SegmentItem} from "@vanya/ui";
import {useState} from "react";
const items: SegmentItem<"a"|"b">[]=[{id:"a",label:"First"},{id:"b",label:"Second"}];
export function App(){
 const [value,setValue]=useState<"a"|"b">("a"),[count,setCount]=useState(0);
 return <main className="consumer-workspace" data-testid="workspace">
  <SurfaceHeader headingLevel={2} title="Consumer workspace" subtitle="Review and update projects" actions={<ThemeToggle/>}/>
  <WorkspaceSplit navigation={<section className="consumer-nav" aria-label="Project filters">
   <SegmentedControl aria-label="Consumer filter" items={items} value={value} onChange={setValue}/>
   <p className="ui-type-body" data-testid="filter-result">{value==="a"?"First project":"Second project"}</p>
  </section>} detail={<section className="consumer-detail" aria-label="Project details">
   <h2 className="ui-type-heading">Project details</h2>
   <p className="ui-type-body" data-testid="body-copy">Review the current project and record an update.</p>
   <ActionButton size="md" variant="text" actionState={count?"success":"idle"} onClick={()=>setCount(n=>n+1)}>Consumer action</ActionButton>
   <p className="ui-type-body" data-testid="result" aria-live="polite">Updates: {count}</p>
  </section>}/>
 </main>;
}
