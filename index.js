document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        window.addEventListener("resize", (event) => {
            ResizeColumns();
        });
        ResizeColumns();
        document.getElementById("HeaderCell2").style.textAlign = "center";
        document.getElementById("PageTitle").innerHTML =
            'The Annotated M[UMPS] Standards<br/><font size="-2">Most recent update: 14-Mar-2024, 11:47:35</font>';
    }
};

async function GetText(type, page, item, value) {
    const header = new Headers();
    header.append("Content-Type", "text/html");
    var url = "?Action=" + type + "&Edition=" + document.form.Edition.value + "&Page=" + page;
    if (type == "ShowLiterature") {
        if (item == "Authors") {
            url += "&Authors=" + value;
        }
        if (item == "Keywords") {
            url += "&Keywords=" + value;
        }
        if (item == "Publications") {
            url += value;
        }
        if (item == "Item") {
            url += "&Item=" + value;
        }
    }
    document.getElementById("Dialog").close();
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: header,
        });
        if (!response.ok) {
            console.error(response.status);
        } else {
            const html = await response.text();
            document.getElementById("DisplaySection").innerHTML = html;
            if (item == "scroll") {
                MoveTo(value);
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}

function HighLight(object, InOrOut, color) {
    if (InOrOut > 0) {
        object.style.backgroundColor = color;
        object.style.cursor = "pointer";
    } else {
        object.style.backgroundColor = "inherit";
        object.style.cursor = "auto";
    }
}

async function LookUp(gadget) {
    const url = "?Action=LookUp" + "&Value=" + encodeURIComponent(gadget.value);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(response.status);
        } else {
            const json = await response.json();
            if (json.Status == "Error") {
                document.getElementById("Dialog").close();
            }
            if (json.Status == "None Found") {
                document.getElementById("Dialog").close();
            }
            if (json.Status == "Found One") {
                document.getElementById("Dialog").close();
                GetText("ShowPage", json.Page, "", "");
            }
            if (json.Status == "OK") {
                document.getElementById("Dialog").innerHTML = json.Dialog;
                document.getElementById("Dialog").show();
                gadget.focus();
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}

function MoveTo(label) {
    const labels = document.getElementsByTagName("a");
    var ii;
    for (ii = 0; ii < labels.length; ii++) {
        if (labels[ii].name) {
            if (labels[ii].name == label) {
                labels[ii].scrollIntoView();
            }
        }
    }
}

function ResizeColumns() {
    var column = ["Menu", "DisplaySection"];
    var ii;
    var cell;
    for (ii = 0; ii < column.length; ii++) {
        cell = document.getElementById(column[ii]);
        var offsets = cell.getBoundingClientRect();
        var space = window.innerHeight - Math.floor(offsets.top) - 25;
        cell.style.maxHeight = space + "px";
        cell.style.overflow = "auto";
    }
}

function ToggleMenu(standard) {
    var list = ["a", "b", "c", "d", "f"];
    var ii;
    for (ii = 0; ii < list.length; ii++) {
        document.getElementById("Standard_" + list[ii]).style.display = "none";
    }
    document.getElementById("Standard_" + standard).style.display = "block";
}
