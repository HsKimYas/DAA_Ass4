"""A4 public-result validation. No implementations of required algorithms."""

MIN_INT, MAX_INT = -(2**63), 2**63-1
def integer(value):
    return type(value) is int and MIN_INT <= value <= MAX_INT
def ints(value):
    return type(value) is list and all(integer(i) for i in value)
def subsequence(s, text):
    it=iter(text)
    return all(any(c==v for v in it) for c in s)

def check(x,y,e):
    if type(y) is not dict:
        return False
    try:
        return _check(x,y,e)
    except (KeyError,TypeError,ValueError,IndexError):
        return False

def _check(x,y,e):
    t=x['task']
    if t=='ping':
        return y.get('status')=='ready'
    if t=='lcs':
        s=y['sequence']
        return (integer(y['length']) and type(s) is str and
                y['length']==e['length']==len(s) and subsequence(s,x['a']) and subsequence(s,x['b']))
    if t=='merge':
        if not integer(y['cost']) or type(y['plan']) is not list:
            return False
        sizes=x['sizes']; blocks=[(i,i) for i in range(len(sizes))]; cost=0
        for item in y['plan']:
            if not ints(item) or len(item)!=3:
                return False
            l,k,r=item
            if (l,k) not in blocks:
                return False
            j=blocks.index((l,k))
            if j+1>=len(blocks) or blocks[j+1]!=(k+1,r):
                return False
            blocks[j:j+2]=[(l,r)]
            cost+=sum(sizes[l:r+1])
        return (len(y['plan'])==max(0,len(sizes)-1) and
                cost==y['cost']==e['cost'] and len(blocks)<=1)
    if t=='tree':
        selected=y['selected']
        if not ints(selected) or not integer(y['weight']):
            return False
        chosen=set(selected)
        return (len(chosen)==len(selected) and all(0<=v<x['n'] for v in selected) and
                not any(u in chosen and v in chosen for u,v in x['edges']) and
                sum(x['weights'][v] for v in selected)==y['weight']==e['weight'])
    if t in ('naive','kmp','rk'):
        return ints(y['positions']) and y['positions']==e['positions']
    if t=='suffix':
        s=y['repeated']; text=x['text']
        return (ints(y['sa']) and ints(y['lcp']) and type(s) is str and
                y['sa']==e['sa'] and y['lcp']==e['lcp'] and
                len(s)==len(e['repeated']) and
                (not s or sum(text.startswith(s,i) for i in range(len(text)))>=2))
    if t=='aho':
        counts=y['counts']
        return (type(counts) is list and len(counts)==len(x['texts']) and
                all(ints(row) and len(row)==len(x['patterns']) and all(v>=0 for v in row) for row in counts) and
                counts==e['counts'])
    return False
