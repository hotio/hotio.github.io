$(function loadJSON() {
    var image = document.getElementsByTagName("h1")[0].innerHTML;
    $.getJSON('https://raw.githubusercontent.com/' + image + '/master/tags.json', function(data) {
        console.log("Pulls: " + data.pulls + ", Stars: " + data.stars);
        const objPulls = document.getElementById("stats-pulls");
        animateValue(objPulls, 0, data.pulls, 1000);
        const objStars = document.getElementById("stats-stars");
        animateValue(objStars, 0, data.stars, 1000);
        $.each(data.tags, function(i, f) {
            console.log("Tag: " + f.name + ", Version: " + f.version + ", Commit: " + f.commit + ", Last Updated: " + f.lastUpdated);
            if (f.lastUpdated == "") {
                return;
            }
            var extraTag = ""
            if (f.name == "release") {
                extraTag = " (latest)";
            }
            var version = ""
            if (f.version != "") {
                version = "<code>" + f.version + "</code>";
            }
            var d = new Date(f.lastUpdated);
            var datestring = d.getFullYear() + "-" + (d.getMonth()+1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0') + " " + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ":" + d.getSeconds().toString().padStart(2, '0');
            var tblRow = "<tr>" + "<td><code>" + f.name + "</code>" + extraTag + "</td>" + "<td>" + f.upstream + "</td>" + "<td>" + version + "</td>" + "<td><a class=\"header-icons\" target=\"_blank\" rel=\"noopener noreferrer\" href=\"https://github.com/" + image + "/tree/" + f.commit + "\">" + f.commit + "</a></td>" + "<td style=\"white-space:nowrap;\">" + datestring + "</td>" + "</tr>"
            $(tblRow).appendTo("#tags-table tbody");
            $("<span>docker pull " + image + ":" + f.name + "</span><br>").appendTo("#tags-codeblock code");
            $("<span>docker pull " + image + ":" + f.name + "-" + f.version + "</span><br>").appendTo("#tags-codeblock code");
            $("<span>docker pull " + image + ":" + f.name + "-" + f.commit + "</span><br>").appendTo("#tags-codeblock code");
        });
        var codeBlock = document.getElementById("tags-codeblock").getElementsByTagName( 'code' )[0].innerHTML;
        if (codeBlock == "") {
            document.getElementById("tags-table").remove();
            $("<span>Couldn't load tags! Try again later...</span><br>").appendTo("#tags-codeblock code");
        }
    });
});

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = (Math.floor(progress * (end - start) + start)).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
