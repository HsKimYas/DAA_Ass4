export function lis(a){
 const n=a.length,dp=Array(n).fill(1),parent=Array(n).fill(-1),events=[];
 for(let i=0;i<n;i++){
  for(let j=0;j<i;j++)if(a[j]<a[i]&&dp[j]+1>dp[i]){dp[i]=dp[j]+1;parent[i]=j;}
  events.push({label:`dp[${i}]`,value:dp[i],dp:[...dp],parent:[...parent],i,whyEN:`The best strictly increasing subsequence ending at index ${i} has length ${dp[i]}. Only earlier smaller values are eligible.`,whyRU:`Лучшая строго возрастающая подпоследовательность, заканчивающаяся в ${i}, имеет длину ${dp[i]}. Подходят только предыдущие меньшие значения.`});
 }
 let end=-1;for(let i=0;i<n;i++)if(end<0||dp[i]>dp[end])end=i;
 const indices=[];for(let u=end;u>=0;u=parent[u])indices.push(u);indices.reverse();
 return {events,dp,parent,value:end<0?0:dp[end],indices,sequence:indices.map(i=>a[i])};
}
export function lcs(a,b){
 const dp=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0)),events=[];
 for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++){
  const equal=a[i-1]===b[j-1];dp[i][j]=equal?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  events.push({label:`L[${i}][${j}]`,value:dp[i][j],i,j,dp:dp.map(r=>[...r]),whyEN:equal?`Characters ${a[i-1]} and ${b[j-1]} match. Add 1 to the diagonal value ${dp[i-1][j-1]}.`:`Characters ${a[i-1]} and ${b[j-1]} differ. max(above=${dp[i-1][j]}, left=${dp[i][j-1]}) = ${dp[i][j]}.`,whyRU:equal?`Символы ${a[i-1]} и ${b[j-1]} совпали. Прибавляем 1 к диагональному значению ${dp[i-1][j-1]}.`:`Символы ${a[i-1]} и ${b[j-1]} различаются. max(сверху=${dp[i-1][j]}, слева=${dp[i][j-1]}) = ${dp[i][j]}.`});
 }
 let i=a.length,j=b.length;const chars=[];
 while(i&&j){if(a[i-1]===b[j-1]){chars.push(a[i-1]);i--;j--;}else if(dp[i-1][j]>=dp[i][j-1])i--;else j--;}
 return {events,dp,value:dp[a.length][b.length],sequence:chars.reverse().join('')};
}
export function matrixChain(p){
 const n=p.length-1,dp=Array.from({length:n+1},()=>Array(n+1).fill(0)),split=Array.from({length:n+1},()=>Array(n+1).fill(0)),events=[];
 for(let len=2;len<=n;len++)for(let i=1;i+len-1<=n;i++){
  const j=i+len-1,candidates=[];dp[i][j]=Infinity;
  for(let k=i;k<j;k++){
   const value=dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j];candidates.push({k,value,left:dp[i][k],right:dp[k+1][j],combine:p[i-1]*p[k]*p[j]});
   if(value<dp[i][j]){dp[i][j]=value;split[i][j]=k;}
  }
  const choices=candidates.map(c=>`k=${c.k}: ${c.left}+${c.right}+${c.combine}=${c.value}`).join('; ');
  events.push({label:`M[${i}][${j}]`,value:dp[i][j],i,j,candidates,dp:dp.map(r=>[...r]),whyEN:`${choices}. Minimum = ${dp[i][j]}, split after ${split[i][j]}.`,whyRU:`${choices}. Минимум = ${dp[i][j]}, разбиение после ${split[i][j]}.`});
 }
 const expression=(i,j)=>i===j?`A${i}`:`(${expression(i,split[i][j])}${expression(split[i][j]+1,j)})`;
 return {events,dp,split,value:n?dp[1][n]:0,expression:n?expression(1,n):''};
}
export function knapsack(weights,values,W){
 const dp=Array.from({length:weights.length+1},()=>Array(W+1).fill(0)),events=[];
 for(let i=1;i<=weights.length;i++)for(let c=0;c<=W;c++){
  const skip=dp[i-1][c],take=weights[i-1]<=c?values[i-1]+dp[i-1][c-weights[i-1]]:null;
  dp[i][c]=Math.max(skip,take??-Infinity);
  events.push({label:`K[${i}][${c}]`,value:dp[i][c],i,j:c,dp:dp.map(r=>[...r]),whyEN:`Skip gives ${skip}. ${take===null?'The item does not fit.':`Take gives ${take} using the previous row.`} Best = ${dp[i][c]}.`,whyRU:`Пропуск даёт ${skip}. ${take===null?'Предмет не помещается.':`Выбор даёт ${take}, используем предыдущую строку.`} Лучшее = ${dp[i][c]}.`});
 }
 let c=W;const indices=[];for(let i=weights.length;i>0;i--)if(dp[i][c]>dp[i-1][c]){indices.push(i-1);c-=weights[i-1];}
 return {events,dp,value:dp[weights.length][W],indices:indices.reverse()};
}
export function treeIndependent(weights,edges){
 const n=weights.length,graph=Array.from({length:n},()=>[]);for(const [u,v] of edges){graph[u].push(v);graph[v].push(u);}
 const parent=Array(n).fill(-2),order=[],take=Array(n).fill(0),skip=Array(n).fill(0),events=[];
 if(!n)return {events,value:0,selected:[],take,skip,parent,order};
 parent[0]=-1;const stack=[0];
 while(stack.length){const u=stack.pop();order.push(u);for(const v of graph[u])if(parent[v]===-2){parent[v]=u;stack.push(v);}}
 if(order.length!==n||edges.length!==n-1)throw Error('Input must be a tree');
 for(const u of [...order].reverse()){
  take[u]=weights[u];for(const v of graph[u])if(parent[v]===u){take[u]+=skip[v];skip[u]+=Math.max(take[v],skip[v]);}
  events.push({label:`take[${u}]`,value:take[u],u,take:[...take],skip:[...skip],whyEN:`At node ${u}: take = weight ${weights[u]} + child skip values = ${take[u]}; skip = sum of each child's best = ${skip[u]}.`,whyRU:`Вершина ${u}: take = вес ${weights[u]} + skip детей = ${take[u]}; skip = сумма лучших состояний детей = ${skip[u]}.`});
 }
 const selected=[],todo=[[0,false]];while(todo.length){const [u,blocked]=todo.pop();const choose=!blocked&&take[u]>skip[u];if(choose)selected.push(u);for(const v of graph[u])if(parent[v]===u)todo.push([v,choose]);}
 return {events,take,skip,parent,order,value:Math.max(take[0],skip[0]),selected:selected.sort((a,b)=>a-b)};
}
export function isSubsequence(a,b){let j=0;for(const x of b)if(j<a.length&&a[j]===x)j++;return j===a.length;}
