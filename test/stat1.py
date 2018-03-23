old = open('old_time')
new = open('new_time')

count = 0
old_count = 0
new_s = 0
new_ss = []
old_s = 0
old_ss = []
l = 0
Diff = []
lc = 0

while True:
    old_line = old.readline()
    new_line = new.readline()
    if old_line == '':
        break
    if float(new_line) < 35:
        new_s += float(new_line)
        count += 1
    if float(old_line) < 35:
        old_count += 1
        old_s += float(old_line)
    new_ss.append(float(new_line))
    old_ss.append(float(old_line))
    l += 1
    Diff.append((float(new_line) - float(old_line))/ float(old_line))

print l    

print old_count, count 
print new_s/ count, old_s/ old_count
new_ss.sort()
old_ss.sort()
print new_ss[len(new_ss) / 2], old_ss[len(old_ss) / 2]
Diff.sort()
print Diff[len(Diff) / 2]
