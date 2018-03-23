old = open('old_dromaeo')
new = open('new_dromaeo')

maxD = 0
maxN = ""
allD = []

while True:
    old_line = old.readline()
    new_line = new.readline()
    if old_line == '':
        break
    name = old_line.split(',')[0]
    old_time = float(old_line.split(',')[1])
    new_time = float(new_line.split(',')[1])
    if old_time > new_time:
        tem = (old_time - new_time) / old_time
        if tem > maxD:
            maxD = tem
            maxN = name
    tem = (old_time - new_time) / old_time
    allD.append(tem)

print maxD, maxN
allD.sort()
print len(allD)
print allD[len(allD) / 2]
less = 0
for i in allD:
    if i < 0:
        less += 1
print less, len(allD) - less
