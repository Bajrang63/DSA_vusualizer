// Pure, deterministic frame generators shared by the interface and validation.
export const clone = x => JSON.parse(JSON.stringify(x));
const end = frames => frames.at(-1);
export function sortFrames(input, algorithm) {
  let a = [...input], frames = [], comparisons = 0, writes = 0;
  const emit = (message, active = [], line = 1, sorted = []) => frames.push({data:[...a],active,sorted,line,message,comparisons,writes});
  const compare = (i,j) => {comparisons++;emit(`Compare ${a[i]} and ${a[j]}.`,[i,j],2);};
  const swap = (i,j) => {if(i!==j){[a[i],a[j]]=[a[j],a[i]];writes+=2;emit(`Swap positions ${i} and ${j}.`,[i,j],3);}};
  emit('Ready. Follow the highlighted values and code, one step at a time.');
  if(algorithm==='bubble') {
    for(let i=0;i<a.length-1;i++){let changed=false;for(let j=0;j<a.length-i-1;j++){compare(j,j+1);if(a[j]>a[j+1]){swap(j,j+1);changed=true;}}emit(`${a[a.length-i-1]} is in its final position.`,[],4,Array.from({length:i+1},(_,k)=>a.length-k-1));if(!changed)break;}
  } else if(algorithm==='selection') {
    for(let i=0;i<a.length-1;i++){let min=i;for(let j=i+1;j<a.length;j++){compare(min,j);if(a[j]<a[min])min=j;}swap(i,min);emit(`Place the smallest remaining value at index ${i}.`,[i],4,Array.from({length:i+1},(_,k)=>k));}
  } else if(algorithm==='insertion') {
    for(let i=1;i<a.length;i++){let j=i;while(j>0){compare(j-1,j);if(a[j-1]<=a[j])break;swap(j-1,j);j--;}emit(`The first ${i+1} values are sorted.`,[],4,Array.from({length:i+1},(_,k)=>k));}
  } else if(algorithm==='merge') {
    function merge(l,r){if(r-l<2)return;const m=Math.floor((l+r)/2);merge(l,m);merge(m,r);const left=a.slice(l,m),right=a.slice(m,r);let i=0,j=0,k=l;while(i<left.length||j<right.length){if(i<left.length&&j<right.length)comparisons++;const value=j>=right.length||(i<left.length&&left[i]<=right[j])?left[i++]:right[j++];a[k]=value;writes++;emit(`Merge: write ${value} at index ${k}.`,[k],3);k++;}emit(`Merged positions ${l} through ${r-1}.`,[],4);}
    merge(0,a.length);
  } else if(algorithm==='quick') {
    function quick(l,r){if(l>=r)return;const pivot=a[r];emit(`Choose ${pivot} as the pivot.`,[r],1);let i=l;for(let j=l;j<r;j++){compare(j,r);if(a[j]<pivot){swap(i,j);i++;}}swap(i,r);emit(`Pivot ${pivot} is now fixed at index ${i}.`,[i],4);quick(l,i-1);quick(i+1,r);}
    quick(0,a.length-1);
  } else if(algorithm==='heap') {
    function sift(n,i){let largest=i;for(const j of [2*i+1,2*i+2])if(j<n){compare(j,largest);if(a[j]>a[largest])largest=j;}if(largest!==i){swap(i,largest);sift(n,largest);}}
    for(let i=Math.floor(a.length/2)-1;i>=0;i--)sift(a.length,i);for(let n=a.length-1;n>0;n--){swap(0,n);emit(`Move the maximum to index ${n}.`,[n],4);sift(n,0);}
  } else if(algorithm==='counting') {
    if(a.some(x=>x<0||x>999))throw Error('Counting Sort accepts integers from 0 to 999.');
    const count=Array(Math.max(0,...a)+1).fill(0);for(let i=0;i<a.length;i++){count[a[i]]++;emit(`Count ${a[i]}: frequency is ${count[a[i]]}.`,[i],2);}let k=0;for(let v=0;v<count.length;v++)while(count[v]-->0){a[k]=v;writes++;emit(`Write ${v} at position ${k}.`,[k++],3);}
  } else if(algorithm==='radix') {
    if(a.some(x=>x<0||x>999))throw Error('Radix Sort accepts integers from 0 to 999.');
    const max=Math.max(0,...a);for(let exp=1;exp<=max;exp*=10){const buckets=Array.from({length:10},()=>[]);a.forEach((v,i)=>{buckets[Math.floor(v/exp)%10].push(v);emit(`Value ${v} goes into digit bucket ${Math.floor(v/exp)%10} (place ${exp}).`,[i],2);});a=buckets.flat();writes+=a.length;emit(`Collect buckets for the ${exp===1?'ones':exp===10?'tens':'hundreds'} place.`,[],3);}
  } else throw Error('Unknown sorting algorithm.');
  emit('Sorted! Every value is in ascending order.',[],5,a.map((_,i)=>i));return frames;
}

export function linearFrames(input,op,value,index,kind='array'){
  let a=[...input],frames=[];const emit=(message,active=[],line=1)=>frames.push({data:[...a],message,active,line});emit(`Ready to ${op}.`);
  if(op==='search'){let found=false;for(let i=0;i<a.length;i++){emit(`Check index ${i}: ${a[i]} ${a[i]===value?'matches':'does not match'} ${value}.`,[i],2);if(a[i]===value){found=true;emit(`Found ${value} at index ${i}.`,[i],4);break;}}if(!found)emit(`${value} was not found.`,[],4);}
  else if(op==='insert'){if(index<0||index>a.length)throw Error(`Position must be between 0 and ${a.length}.`);for(let i=a.length-1;i>=index;i--)emit(`Make room after index ${i}.`,[i],2);a.splice(index,0,value);emit(`Inserted ${value} at index ${index}.`,[index],3);}
  else if(op==='delete'){if(!a.length)throw Error(`${kind} is empty.`);if(index<0||index>=a.length)throw Error(`Position must be between 0 and ${a.length-1}.`);emit(`Remove ${a[index]} at index ${index}.`,[index],2);a.splice(index,1);emit(`Removed value. ${a.length} item${a.length===1?'':'s'} remain.`,[],3);}
  else if(op==='update'){if(index<0||index>=a.length)throw Error('Choose a position that exists.');a[index]=value;emit(`Updated index ${index} to ${value}.`,[index],3);}
  else if(op==='reverse'){for(let l=0,r=a.length-1;l<r;l++,r--){[a[l],a[r]]=[a[r],a[l]];emit(`Reverse positions ${l} and ${r}.`,[l,r],3);}emit('Reversed the sequence.',[],4);}
  else if(op==='sort')return sortFrames(a,'insertion');
  else if(op==='peek'){if(!a.length)throw Error(`${kind} is empty.`);const i=kind==='stack'?a.length-1:0;emit(`${kind==='stack'?'Top':'Front'} value is ${a[i]}.`,[i],3);}
  else if(op==='isEmpty')emit(a.length?`False — ${kind} contains ${a.length} items.`:`True — ${kind} is empty.`,[],3);
  return frames;
}

export const height=n=>n?1+Math.max(height(n.left),height(n.right)):0;
export const balance=n=>n?height(n.left)-height(n.right):0;
export function treeFrames(root,op,value,avl=false){
  let tree=clone(root),frames=[];const emit=(message,active=[],line=1)=>frames.push({data:clone(tree),message,active,line});emit(`Ready to ${op} ${value}.`);
  const get=path=>path.reduce((n,k)=>n?.[k],tree);
  const put=(path,n)=>{if(!path.length)tree=n;else get(path.slice(0,-1))[path.at(-1)]=n;};
  const right=y=>{const x=y.left;y.left=x.right;x.right=y;return x;};
  const left=x=>{const y=x.right;x.right=y.left;y.left=x;return y;};
  if(op==='inorder'){function visit(n){if(!n)return;visit(n.left);emit(`In-order visit: ${n.value}.`,[n.value],2);visit(n.right);}visit(tree);emit('In-order traversal complete.',[],4);return frames;}
  let path=[],node=tree;
  while(node){emit(`Compare ${value} with node ${node.value}.`,[node.value],2);if(node.value===value)break;path.push(value<node.value?'left':'right');node=get(path);}
  if(op==='search'){emit(node?`Found ${value}.`:`${value} was not found.`,node?[value]:[],4);return frames;}
  if(op==='insert'){
    if(node){emit(`${value} already exists. Duplicate tree keys are ignored.`,[value],4);return frames;}
    put(path,{value,left:null,right:null});emit(`Inserted ${value} as a new leaf.`,[value],3);
  }else if(op==='delete'){
    if(!node){emit(`${value} was not found. The tree is unchanged.`,[],4);return frames;}
    if(node.left&&node.right){let successorPath=[...path,'right'],successor=get(successorPath);while(successor.left){emit(`Find the in-order successor: visit ${successor.value}.`,[successor.value],2);successorPath.push('left');successor=get(successorPath);}const replacement=successor.value;node.value=replacement;put(successorPath,successor.right);path=successorPath;emit(`Replace ${value} with successor ${replacement} and remove the successor leaf.`,[replacement],3);}
    else{put(path,node.left||node.right);emit(`Removed ${value}; reconnect its remaining child, if any.`,[],3);}
  }
  if(avl){for(let depth=path.length-1;depth>=0;depth--){const p=path.slice(0,depth);let n=get(p);if(!n)continue;const b=balance(n);
    if(b>1){if(balance(n.left)<0){const v=n.left.value;n.left=left(n.left);emit(`Left-right case: rotate left at ${v}.`,[v,n.left.value],4);}const v=n.value;put(p,right(n));emit(`Rotate right at ${v} to restore balance.`,[v,get(p).value],4);}
    else if(b< -1){if(balance(n.right)>0){const v=n.right.value;n.right=right(n.right);emit(`Right-left case: rotate right at ${v}.`,[v,n.right.value],4);}const v=n.value;put(p,left(n));emit(`Rotate left at ${v} to restore balance.`,[v,get(p).value],4);}
  }emit('AVL invariant restored: every balance factor is −1, 0, or 1.',[],4);}
  else emit('The binary search tree is updated.',[],4);
  return frames;
}
export function makeTree(values,avl=false){let r=null;for(const v of values)r=end(treeFrames(r,'insert',v,avl)).data;return r;}
export function treeValues(n){return n?[...treeValues(n.left),n.value,...treeValues(n.right)]:[];}

export function hashFrames(input,op,value,method='chaining'){
  const data=clone(input),frames=[];const mod=v=>((v%12)+12)%12;const emit=(message,active=[],line=1)=>frames.push({data:clone(data),message,active,line});const h=mod(value);emit(`h(${value}) = ((${value} % 12) + 12) % 12 = ${h}.`,[h],1);
  if(method==='chaining'){let bucket=data[h];if(op==='insert'){bucket.push(value);emit(`Append ${value} to bucket ${h}${bucket.length>1?' to resolve the collision':''}.`,[h],3);}else{const i=bucket.indexOf(value);emit(`Search the chain in bucket ${h}.`,[h],2);if(i<0)emit(`${value} was not found.`,[h],4);else if(op==='delete'){bucket.splice(i,1);emit(`Removed ${value} from the chain.`,[h],3);}else emit(`Found ${value} in bucket ${h}.`,[h],4);}}
  else{let target=-1;for(let p=0;p<12;p++){const i=(h+p)%12;emit(`Probe slot ${i}.`,[i],2);if(op==='insert'){if(data[i]===null||data[i]==='deleted'){target=i;break;}}else{if(data[i]===value){target=i;break;}if(data[i]===null)break;}}
    if(op==='insert'){if(target<0)throw Error('The hash table is full. Delete a value first.');data[target]=value;emit(`Stored ${value} in slot ${target}.`,[target],3);}else if(target<0)emit(`${value} was not found.`,[],4);else if(op==='delete'){data[target]='deleted';emit(`Deleted ${value}; keep a tombstone so probing stays correct.`,[target],3);}else emit(`Found ${value} in slot ${target}.`,[target],4);
  }return frames;
}

export function parseGraph(nodesText,edgesText){
  const nodes=nodesText.split(/[\s,]+/).map(x=>x.trim().toUpperCase()).filter(Boolean);if(nodes.length<2||nodes.length>9||new Set(nodes).size!==nodes.length||nodes.some(x=>! /^[A-Z]$/.test(x)))throw Error('Use 2–9 unique node labels, A–Z, separated by commas.');
  const edges=[];for(const part of edgesText.split(',').map(x=>x.trim()).filter(Boolean)){const m=part.toUpperCase().match(/^([A-Z])-([A-Z])(?::(\d+))?$/);if(!m||!nodes.includes(m[1])||!nodes.includes(m[2])||m[1]===m[2])throw Error('Use edges like A-B:4, B-C:2 between existing, different nodes.');const weight=Number(m[3]||1);if(weight<1||weight>99)throw Error('Edge weights must be 1–99.');if(edges.some(e=>(e.a===m[1]&&e.b===m[2])||(e.a===m[2]&&e.b===m[1])))throw Error('Each undirected edge should appear once.');edges.push({a:m[1],b:m[2],weight});}
  if(!edges.length)throw Error('Add at least one edge.');return {nodes,edges};
}
export function graphFrames(graph,algorithm,start){
  if(!graph.nodes.includes(start))throw Error('Start node must exist in the graph.');let visited=[],frontier=[start],dist=Object.fromEntries(graph.nodes.map(n=>[n,n===start?0:null])),frames=[];
  const emit=(message,active=[],line=1,edge=null)=>frames.push({data:clone(graph),visited:[...visited],frontier:[...frontier],dist:{...dist},message,active,line,edge});emit(`Start ${algorithm.toUpperCase()} at ${start}.`);
  const neighbors=n=>graph.edges.filter(e=>e.a===n||e.b===n).map(e=>({node:e.a===n?e.b:e.a,weight:e.weight}));
  if(algorithm==='dijkstra'){while(true){const u=graph.nodes.filter(n=>!visited.includes(n)&&dist[n]!==null).sort((a,b)=>dist[a]-dist[b])[0];if(!u)break;visited.push(u);frontier=graph.nodes.filter(n=>!visited.includes(n)&&dist[n]!==null);emit(`Settle ${u} with shortest distance ${dist[u]}.`,[u],2);for(const {node:v,weight} of neighbors(u)){if(visited.includes(v))continue;const next=dist[u]+weight;if(dist[v]===null||next<dist[v]){dist[v]=next;frontier=graph.nodes.filter(n=>!visited.includes(n)&&dist[n]!==null);emit(`Relax ${u} → ${v}: distance becomes ${next}.`,[u,v],3,[u,v]);}}}}
  else{const queued=new Set([start]);while(frontier.length){let u=algorithm==='dfs'?frontier.pop():frontier.shift();if(visited.includes(u))continue;visited.push(u);emit(`Visit ${u}. ${algorithm==='dfs'?'Stack':'Queue'}: ${frontier.join(', ')||'empty'}.`,[u],2);let ns=neighbors(u);if(algorithm==='dfs')ns.reverse();for(const {node:v} of ns)if(!queued.has(v)){queued.add(v);frontier.push(v);emit(`Discover ${v} from ${u}.`,[v],3,[u,v]);}}}emit(`Finished. Reachable nodes: ${visited.join(' → ')}.${algorithm==='dijkstra'?' ∞ means unreachable.':''}`,[],4);return frames;
}
export function dpFrames(mode,n=10,s='AGGTAB',t='GXTXAYB'){
  let frames=[];if(mode==='fibonacci'){let a=Array(n+1).fill(null);a[0]=0;a[1]=1;const emit=(message,active,line)=>frames.push({data:[...a],message,active,line});emit('Base cases: F(0) = 0 and F(1) = 1.',[0,1],1);for(let i=2;i<=n;i++){a[i]=a[i-1]+a[i-2];emit(`F(${i}) = F(${i-1}) + F(${i-2}) = ${a[i-1]} + ${a[i-2]} = ${a[i]}.`,[i-2,i-1,i],3);}emit(`F(${n}) = ${a[n]}. Tabulation computes each subproblem once.`,[n],4);}
  else{let matrix=Array.from({length:s.length+1},()=>Array(t.length+1).fill(0));const emit=(message,cell,line)=>frames.push({data:{matrix:clone(matrix),s,t},message,cell,active:[],line});emit('Initialize the empty-prefix row and column to zero.',[0,0],1);for(let i=1;i<=s.length;i++)for(let j=1;j<=t.length;j++){const match=s[i-1]===t[j-1];matrix[i][j]=match?matrix[i-1][j-1]+1:Math.max(matrix[i-1][j],matrix[i][j-1]);emit(match?`${s[i-1]} matches: take diagonal + 1 = ${matrix[i][j]}.`:`${s[i-1]} ≠ ${t[j-1]}: max(top, left) = ${matrix[i][j]}.`,[i,j],match?2:3);}let i=s.length,j=t.length,lcs='';while(i&&j){if(s[i-1]===t[j-1]){lcs=s[i-1]+lcs;i--;j--;}else if(matrix[i-1][j]>=matrix[i][j-1])i--;else j--;}emit(`LCS length = ${matrix[s.length][t.length]}. One longest common subsequence: ${lcs||'(empty)'}.`,[s.length,t.length],4);}return frames;
}
