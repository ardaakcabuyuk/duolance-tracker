import pyautogui
import base64
from io import BytesIO
import sys
from pathlib import Path

def capture(id: str):
    res = {}

    try:
        myScreenshot = pyautogui.screenshot(Path.cwd() / 'screenshot.png')
        image = resize_image(myScreenshot)
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        encoded = base64.b64encode(buffered.getvalue())
        encoded = 'data:image/png;base64,' + encoded.decode('utf-8')
        res = {"status": "success", "encoded": encoded}
    except Exception as e:
        res = {"status": "error", "error": str(e).replace('"', '')}

    res = str(res).replace("'", '"')

    return res

def resize_image(image):
    image.thumbnail((1000, 1000))
    return image

def main(args):
    return capture(args[1])

if __name__ == '__main__':
    print(main(sys.argv))