import os
import re
import requests

for dirpath, dirnames, filenames in os.walk("./page"):
    for filename in filenames:
        filepath = os.path.join(dirpath, filename)
        
        with open(filepath, 'r') as f:
            text = f.read()
        
        regex = re.compile(r"src=\"\/image\/([\w\-\/\.]+)\"")

        for image in regex.findall(text):
            imagepath = f"./image/{image}"
            url = f"http://71.174.62.16/image/{image}"

            print(url,end=" -> ")

            os.makedirs(os.path.dirname(imagepath), exist_ok=True)
            if os.path.exists(imagepath): 
                print("already scraped")
                continue

            response = requests.get(url)

            if (response.ok):
                if "svg" in response.headers.get("Content-Type"):
                    with open(imagepath, "w") as f:
                        f.write(response.text)
                else:
                    with open(imagepath, "wb") as f:
                        f.write(response.content)
                print(f"created {imagepath}")
            else:
                print("request failed")
