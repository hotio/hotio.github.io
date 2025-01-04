$(function loadJSON() {
    var image = document.getElementsByTagName("h1")[0].innerHTML;
    const splitImage = image.split("/");
    document.getElementById("github-link").href="https://github.com/" + image;
    document.getElementById("dockerio-link").href="https://hub.docker.com/r/" + image;
    document.getElementById("ghcrio-link").href="https://github.com/orgs/" + splitImage[0] + "/packages/container/package/" + splitImage[1];

    $.getJSON('https://raw.githubusercontent.com/' + image + '/master/links.json', function(data) {
        $.each(data.links, function(i, f) {
            const svg = '<span class="twemoji"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></span>'
            var link = `${svg} <a href="${f.url}" class="header-icons" target="_blank" rel="noopener">${f.name}</a><br>`
            $(link).appendTo("#project-links");
        });
    });

    $.getJSON('https://raw.githubusercontent.com/' + image + '/master/tags.json', function(data) {
        $.each(data, function(i, f) {
            var hide = f.hide;
            if (hide != true) {
                var last_updated = f.last_updated;
                var last_updated_url = f.last_updated_url;
                var description = f.description;
                if (description == undefined) {
                    description = "";
                }
                var latest = f.latest;
                var extraTag = "";
                if (latest == true) {
                    extraTag = "<div class=\"tag-decoration tag-decoration-latest\">latest</div><br>";
                }
                var tags = "";
                var tags_code = "";
                $.each(f.tags, function(i, f) {
                    tags = tags + ", " + f;
                    tags_code = tags_code + "<div class=\"tag-decoration\">" + f + "</div><br>";
                });
                tags = tags.replace(/^,/, '');
                var d = new Date(last_updated);
                var currentDate = new Date();
                var days = (d, currentDate) =>{
                    let difference = currentDate.getTime() - d.getTime();
                    let TotalDays = Math.floor(difference / (1000 * 3600 * 24));
                    if (TotalDays ==  0) {
                        TotalDays = Math.floor(difference / (1000 * 3600 * 1));
                        return `${TotalDays} hour(s)`;
                    } else {
                        return `${TotalDays} day(s)`;
                    }
                }
                var datestring = d.getFullYear() + "-" + (d.getMonth()+1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0') + " " + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ":" + d.getSeconds().toString().padStart(2, '0');
                if (last_updated_url != undefined) {
                    var last_updated_string = `<a href="${last_updated_url}" target="_blank">${datestring}</a>`;
                } else {
                    var last_updated_string = `${datestring}`
                }
                console.log(`Tags: ${tags}, Last Updated: ${datestring}, Age: ${days(d, currentDate)}`);
                var tblRow = `
                    <tr>
                    <td style=\"white-space:nowrap;\">${extraTag}${tags_code}</td>
                    <td>${description}</td>
                    <td style=\"white-space:nowrap;\">${last_updated_string}</td>
                    <td>${days(d, currentDate)}</td>
                    </tr>
                `
                $(tblRow).appendTo("#tags-table tbody");
            }
        });
    });
});
