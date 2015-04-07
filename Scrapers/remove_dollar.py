
inFile = open("gamecube.csv", 'r')
outFile = open('gamecubeNoDollar.csv', 'a')

for line in inFile:
    newLine = line.split(',')
    newLine[3] = newLine[3].strip().strip('$')
    newLine[4] = newLine[4].strip().strip('$')
    newLine[5] = newLine[5].strip().strip('$')
    outFile.write(newLine[0] + "," + newLine[1] + "," + newLine[2] + "," + newLine[3] + "," + newLine[4] + "," + newLine[5] + "," + newLine[6])
    #outFile.write('{},{},{},{},{},{},{}'.format(newLine[0], newLine[1], newLine[2], newLine[3], newLine[4], newLine[5], newLine[6]) )
inFile.close()
outFile.close()