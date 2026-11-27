import {ActionButton,SegmentedControl,type SegmentItem} from "@vanya/ui";
import {useState} from "react";
const items: SegmentItem<"a"|"b">[]=[{id:"a",label:"First"},{id:"b",label:"Second"}];
export function App(){const [value,setValue]=useState<"a"|"b">("a");return <main><ActionButton variant="text">Consumer action</ActionButton><SegmentedControl aria-label="Consumer filter" items={items} value={value} onChange={setValue}/></main>}
