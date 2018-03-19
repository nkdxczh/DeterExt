import cv2

urls = 0
diff = 0

with open("list") as f:
    for url in f:
        url = url.strip()
        image1 = cv2.imread("old1/" + url,0)
        image2 = cv2.imread("old/" + url,0)
        if image1 is None or image2 is None:
            continue
        rows = min(len(image1), len(image2))
        cols = min(len(image1[0]), len(image2[0]))
        #print url, rows, cols
        count = 0
        size = rows * cols
        for i in range(rows):
            for j in range(cols):
                if image1[i][j] != image2[i][j]:
                    count += 1

        print url
        print float(count) / size
        diff += float(count) / size
        urls += 1

print diff / urls
