import PIL.Image



ASCII_2_85 = ["▓","▓", " ", " "]
ASCII_2_85_inv = [" "," ", "▓", "▓"]
ASCII_6_50 = ["✠","♰","†","?",","," "]
ASCII_11_25 = ["✠", "♰", "C", "%", "?", "*", "+", ";", ":", ",", " "]

def resizeimg(img, n_width=109):
    width, height = img.size
    print((width, height))
    ratio = height/width/1.65
    n_height = int(n_width * ratio)
    n_img = img.resize((n_width,n_height))
    return n_img

def to_grey(img):
    grey_img = img.convert("L")
    return grey_img

#covert greyscale data to ascii char
def pixToAscii(img):
    pixels = img.getdata()
    # print(list(pixels))
    chars = "".join([ASCII_2_85[pixel//85] for pixel in pixels])
    return chars

def main(n_width=109):
    path = input("filepath:\n")
    try:
        image = PIL.Image.open(path)
    except:
        print(path, "cannot find file")
    
    n_imgdata = pixToAscii(to_grey(resizeimg(image)))
    pixelcount = len(n_imgdata)
    # ascii_img = "\n".join(n_imgdata[i:(i+n_width)] for i in range(0, pixelcount))
    ascii_img = "\n".join([n_imgdata[i:(i+n_width)] for i in range(0, pixelcount, n_width)])

    print(ascii_img)

    with open("./writeart.txt", 'w') as f:
        f.write(ascii_img)
main()
