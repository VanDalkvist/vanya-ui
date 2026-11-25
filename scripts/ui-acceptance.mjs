// Portable task acceptance protocol; validates recorded evidence structure, never visual truth.
const criterion=(id,title,canonical,acceptance,method,required=false)=>({id,title,canonical,acceptance,method,required});
export const criteria=[
 criterion("UI-01","Task boundary and user action","docs/patterns/ui-feature-pipeline.md","Name the requested change, affected routes/states and unchanged surfaces; verify the requested action/result.","source",true),
 criterion("UI-02","Real components, tokens and version","docs/versioning.md","Check actual installed exports/props, package pin and CSS entrypoint; reuse shared primitives where applicable; explain intentional local components.","source",true),
 criterion("UI-03","Composition and first screen","docs/composition/working-surfaces.md","Inspect the affected surface at wide and narrow widths: useful content fills available space, hierarchy and grouping support the primary action; no duplicate headers or competing dividers.","browser"),
 criterion("UI-04","Typography and text","docs/patterns/typography.md","Check semantic roles, computed size/line-height/tracking, rendered fonts and actual language; no clipped text; editorial serif only for applicable content.","browser"),
 criterion("UI-05","Copy and actual outcomes","docs/patterns/writing-and-editorial.md","Read visible labels, first-screen message and recovery instructions; compare claims/counts/status with actual data and actions.","browser"),
 criterion("UI-06","Interaction and accessibility","docs/patterns/interaction-states.md","Exercise mouse/touch as applicable, keyboard focus, hover/pressed/selected/disabled, accessible names and contrast; verify correct actual activation.","browser"),
 criterion("UI-07","Action feedback","docs/patterns/action-feedback.md","Execute affected actions; check pressed response and real pending/result/error, repeated activation and focus as applicable.","browser"),
 criterion("UI-08","Navigation and scroll","docs/patterns/browser-navigation.md","Check affected links, direct route/reload/history and scroll owners; reader/list independence and shared header geometry when applicable.","browser"),
 criterion("UI-09","Dynamic state and geometry","docs/composition/working-surfaces.md","Compare affected loading/empty/error/partial/ready states, actual result content and unaffected geometry across transitions.","browser"),
 criterion("UI-10","Keyboard shortcuts","docs/patterns/keyboard-shortcuts.md","Verify visible alternative, shortcut help, input/IME exclusion, focus and disable mechanism for character shortcuts as applicable.","browser"),
 criterion("UI-11","Responsive and theme review","DESIGN.md","Review affected rendered surface at representative narrow/wide sizes and supported themes; check overflow, hit targets and zoom when applicable. Record actual dimensions and themes.","browser",true),
 criterion("UI-12","Identity and external sources","docs/identity/brand.md","Check actual approved brand assets and relevant external sources/rights; no invented provenance or copied assets without rights.","source"),
 criterion("UI-13","Build and regression execution","docs/patterns/ui-feature-pipeline.md","Run target build and affected browser/unit scripts; record actual command/results. For static artifacts with no runnable build, record why and use observed rendering for UI-11.","command"),
 criterion("UI-14","Privacy and publication boundary","docs/patterns/publication-safety.md","Review the changed files and relevant built output for secrets/private data; if deploying, record destination and live readback separately.","source",true),
];
export const scopes=["feature","screen","migration"];
const statuses=["PENDING","PASS","FAIL","N/A","NOT_VERIFIED"];
const nonempty=x=>typeof x==="string"&&x.trim().length>0;
const allowedMethods=["source","browser","command"];
export function createAcceptancePlan({task,target,scope="feature",libraryVersion=null}={}){
 if(!nonempty(task)||!nonempty(target))throw Error("plan requires --task and --target (affected route, component or artifact)");
 if(!scopes.includes(scope))throw Error("Unknown task scope: "+scope);
 return {schemaVersion:1,libraryVersion,task,target,scope,criteria:criteria.map(c=>({...c,status:"PENDING",reason:"",evidence:[]}))};
}
export function reviewAcceptance(receipt){
 const errors=[],unresolved=[];
 if(!receipt||receipt.schemaVersion!==1||!nonempty(receipt.task)||!nonempty(receipt.target)||!scopes.includes(receipt.scope)){
  return {status:"invalid",errors:["Expected schemaVersion 1, task, target and valid scope"],unresolved,visualReview:"DECLARED_ONLY"};
 }
 if(!Array.isArray(receipt.criteria))return {status:"invalid",errors:["Missing criteria array"],unresolved,visualReview:"DECLARED_ONLY"};
 const byId=new Map();
 for(const row of receipt.criteria){
  if(!row||!criteria.some(c=>c.id===row.id)){errors.push("Unknown criterion: "+String(row?.id));continue}
  if(byId.has(row.id)){errors.push("Duplicate criterion: "+row.id);continue}
  byId.set(row.id,row);
 }
 for(const c of criteria){
  const r=byId.get(c.id);
  if(!r){errors.push("Missing criterion: "+c.id);continue}
  if(!statuses.includes(r.status)){errors.push(c.id+": invalid status");continue}
  if(r.status==="N/A"){
   if(c.required||(receipt.scope==="migration"&&["UI-03","UI-04","UI-06","UI-13"].includes(c.id)))errors.push(c.id+": cannot be N/A for this scope");
   if(!nonempty(r.reason))errors.push(c.id+": N/A requires task-specific reason");
   continue;
  }
  if(r.status!=="PASS"){
   unresolved.push({id:c.id,status:r.status,reason:r.reason||""});
   if(r.status!=="PENDING"&&!nonempty(r.reason))errors.push(c.id+": "+r.status+" requires explanation");
   continue;
  }
  const ev=Array.isArray(r.evidence)?r.evidence:[];
  if(!ev.length||ev.some(x=>!x||!allowedMethods.includes(x.method)||!nonempty(x.target)||!nonempty(x.observation)))errors.push(c.id+": PASS requires method, target and concrete observation");
  if(!ev.some(x=>x?.method===c.method&&(c.method!=="browser"||(nonempty(x.viewport)&&nonempty(x.theme)))&&(c.method!=="command"||nonempty(x.command))))errors.push(c.id+": PASS requires "+c.method+" evidence"+(c.method==="browser"?" with viewport and theme":c.method==="command"?" with executed command":""));
 }
 return {status:errors.length?"invalid":unresolved.length?"incomplete":"recorded",errors,unresolved,visualReview:"DECLARED_ONLY",note:"Structure only: inspect actual evidence before accepting UI; this command does not execute or authenticate observations."};
}
