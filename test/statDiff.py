old = open('diff_o_o')
new = open('diff_o_n')

count = 0
l = 0
change = []

output = open('change', 'w')

while True:
    old_line = old.readline()
    new_line = new.readline()
    if old_line == '':
        break
    old_diff = old.readline()
    if old_diff == '':
        break
    old_diff = float(old_diff)
    new_diff = float(new.readline())
    if abs(new_diff - old_diff) < 0.01:
        count += 1
    if abs(new_diff - old_diff) > 0.3:
        print old_line
    l += 1
    change.append(abs(new_diff - old_diff))
    output.write(str(abs(new_diff - old_diff)) + '\n')

print float(count) / l
change.sort()
print change[len(change) / 2]
