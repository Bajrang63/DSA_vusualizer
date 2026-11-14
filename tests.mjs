import assert from 'node:assert/strict';
import {sortFrames,linearFrames,treeFrames,makeTree,treeValues,height,balance,hashFrames,parseGraph,graphFrames,dpFrames} from './dist/algorithms.js';
let checks=0;const check=(value,expected)=>{assert.deepEqual(value,expected);checks++;};const last=f=>f.at(-1).data;
let seed=914;function random(){seed=(seed*16807)%2147483647;return seed/2147483647;}
for(const sort of ['bubble','selection','insertion','merge','quick','heap','radix','counting']){
 const cases=[[5,4,3,2,1],[2,2,1,1,2],[0,0,0,0,0],[1,2,3,4,5],[999,10,0,100,1],...Array.from({length:20},()=>Array.from({length:12},()=>Math.floor(random()*100)))];
 if(!['radix','counting'].includes(sort))cases.push([-20,9,-10,0,9]);
 for(const a of cases)check(last(sortFrames(a,sort)),a.slice().sort((a,b)=>a-b));
}
for(const sort of ['radix','counting']){assert.throws(()=>sortFrames([-1,0,1,2,3],sort));checks++;}
check(last(linearFrames([1,2,3],'insert',8,1)),[1,8,2,3]);check(last(linearFrames([1,2,3],'delete',0,1)),[1,3]);check(last(linearFrames([1,2,3],'reverse')), [3,2,1]);check(last(linearFrames([1,2,3],'update',7,1)),[1,7,3]);check(linearFrames([1,2,3],'search',2).at(-1).active,[1]);assert.throws(()=>linearFrames([],'delete',0,0));checks++;
function validateTree(n,lo=-Infinity,hi=Infinity,avl=false){if(!n)return;assert(n.value>lo&&n.value<hi);if(avl)assert(Math.abs(balance(n))<=1);checks++;validateTree(n.left,lo,n.value,avl);validateTree(n.right,n.value,hi,avl);}
for(const avl of [false,true]){for(let run=0;run<15;run++){let values=[...new Set(Array.from({length:20},()=>Math.floor(random()*100)))],root=makeTree(values,avl);validateTree(root,-Infinity,Infinity,avl);check(treeValues(root),values.slice().sort((a,b)=>a-b));for(const v of values){root=last(treeFrames(root,'delete',v,avl));validateTree(root,-Infinity,Infinity,avl);}check(root,null);}}
check(makeTree([30,20,10],true).value,20);check(makeTree([30,10,20],true).value,20);check(makeTree([10,30,20],true).value,20);check(makeTree([10,20,30],true).value,20);
for(const method of ['chaining','probing']){let table=method==='chaining'?Array.from({length:12},()=>[]):Array(12).fill(null);for(const v of [5,17,29,-7])table=last(hashFrames(table,'insert',v,method));check(hashFrames(table,'search',29,method).at(-1).message.includes('Found'),true);table=last(hashFrames(table,'delete',17,method));check(hashFrames(table,'search',29,method).at(-1).message.includes('Found'),true);check(hashFrames(table,'search',17,method).at(-1).message.includes('not found'),true);check(hashFrames(table,'search',-7,method).at(-1).message.includes('Found'),true);}
let table=Array(12).fill(null);for(let i=0;i<12;i++)table=last(hashFrames(table,'insert',i,'probing'));assert.throws(()=>hashFrames(table,'insert',13,'probing'));checks++;
const graph=parseGraph('A,B,C,D,E','A-B:4,A-C:2,B-D:3,C-D:1');check(graphFrames(graph,'bfs','A').at(-1).visited,['A','B','C','D']);check(graphFrames(graph,'dfs','A').at(-1).visited.length,4);check(graphFrames(graph,'dijkstra','A').at(-1).dist,{A:0,B:4,C:2,D:3,E:null});assert.throws(()=>parseGraph('A,B','A-C:3'));checks++;
check(last(dpFrames('fibonacci',10)).at(-1),55);check(last(dpFrames('fibonacci',18)).at(-1),2584);check(last(dpFrames('lcs',0,'AGGTAB','GXTXAYB')).matrix[6][7],4);check(last(dpFrames('lcs',0,'ABC','DEF')).matrix[3][3],0);check(last(dpFrames('lcs',0,'ABCBDAB','BDCABA')).matrix[7][6],4);
console.log(`PASS: ${checks} assertions across 8 sorts, array/list operations, BST/AVL insert/delete, hash collision strategies, graph traversal/shortest paths, and DP.`);
