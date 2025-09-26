import os
import re
import requests

VERSIONS = ["1977","1984","1990","1995","MDC","notes"]

if __name__ == "__main__":
    with open("./index.html", "r") as f:
        index = f.read()

    regex = re.compile(r"GetText\('ShowPage', '(\w*)', '\w*', '\w*'\);")

    for page in regex.findall(index):
        for version in VERSIONS:

            filename = f"./page/{version}/{page}.html"
            url = f"http://71.174.62.16/Demo/AnnoStd?Action=ShowPage&Edition={version}&Page={page}"

            print(url,end=" -> ")

            if os.path.exists(filename): 
                print("already scraped")
                continue

            response = requests.get(url)

            if (response.ok):
                with open(filename, "w") as f:
                    f.write(response.text)
                print(f"created {filename}")
            else:
                print("request failed")
