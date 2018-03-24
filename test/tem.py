f = open('list')
res = open('list1','w')
s = set()

for i in f:
    s.add(i.strip())

for i in s:
    res.write(i + '\n')

res.close()
print len(s)
