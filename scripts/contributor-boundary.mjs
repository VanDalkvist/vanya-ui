// Application operation; same CLI, explicit publication phases.
import {validatePolicy,scanEntries} from './contributor-policy.mjs';
import {resolveRoot,readPrivatePolicy,sourceEntries,outgoingEntries,builtEntries} from './contributor-inventory.mjs';
const row=(id,status,count)=>({id,status,...(count===undefined?{}:{count})});
export function checkContribution({project,phase,policy,base}){
 try{
  if(!project||!['preflight','source','built'].includes(phase)||phase!=='preflight'&&base)throw Error('Invalid contributor phase');
  const root=resolveRoot(project);
  if(phase==='preflight'&&!policy)throw Error('Private policy required for preflight');
  const identifiers=policy?validatePolicy(readPrivatePolicy(root,policy)):[];
  const outgoing=phase==='preflight'?outgoingEntries(root,base):null;
  const entries=phase==='built'?builtEntries(root):sourceEntries(root,{includeUntracked:phase==='preflight'});
  const result=scanEntries([...entries,...(outgoing?.entries||[])],identifiers);
  const checks=[
   row('PUB-01','PASS',result.text+result.binary),
   row('PUB-02',policy?(result.privateHits?'FAIL':'PASS'):'NOT_APPLICABLE',policy?result.privateHits:undefined),
   row('PUB-03',result.portabilityHits?'FAIL':'PASS',result.portabilityHits),
   row('PUB-04',phase==='built'?(result.privateHits||result.portabilityHits?'FAIL':'PASS'):'NOT_APPLICABLE'),
   row('PUB-05','NOT_VERIFIED',result.binary),
  ];
  return {status:checks.some(x=>x.status==='FAIL')?'fail':'pass',phase,checks,coverage:{text:result.text,binaryManual:result.binary,outgoingCommits:outgoing?.commits??0},policyScope:policy?'private':'generic',semanticReview:'NOT_VERIFIED',...(outgoing?{head:outgoing.head}:{})};
 }catch{
  return {status:'blocked',phase:['preflight','source','built'].includes(phase)?phase:'invalid',checks:[row('PUB-01','BLOCKED'),row('PUB-02','NOT_VERIFIED'),row('PUB-03','NOT_VERIFIED'),row('PUB-04','NOT_VERIFIED'),row('PUB-05','NOT_VERIFIED')],issues:['Invalid or unavailable publication inputs; check root, phase, local base, policy and file coverage. No private values printed.']};
 }
}
