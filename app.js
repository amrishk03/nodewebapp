var http = require("http");
var qs = require("querystring");
var StringBuilder = require("stringbuilder");

var port = 9000;

function getHome(req, resp) {
    resp.writeHead(200, { "Content-Type": "text/html" });
    resp.write("<html><head></head><body>Want to do some calc? Click <a href='calc'>here</a></body></html>");
    resp.end();
}

function get404(req, resp) {
    resp.writeHead(404, { "Content-Type": "text/html" });
    resp.write("<html><head></head><body> 404: Resourse not found<a href='/'>Home</a></body></html>");
    resp.end();
}

function get405(req, resp) {
    resp.writeHead(405, { "Content-Type": "text/html" });
    resp.write("<html><head></head><body> 405: Bad method<a href='/'>Home</a></body></html>");
    resp.end();
}

function getCalcHtml(req, resp, data) {
    var sb = new StringBuilder({ newline: "\r\n" });

    sb.appendLine("<html>");
    sb.appendLine("<head>");
    sb.appendLine("</head>");
    sb.appendLine("<body>");
    sb.appendLine("<form method='post'>");
    sb.appendLine("<table>");
    sb.appendLine("<tr>");
    sb.appendLine("<td>First Number :</td>");
    if (data && data.f_num) {
        sb.appendLine("<td><input type='text' name='f_num' id='f_num' value='{0}'></td>", data.f_num);
    } else {
        sb.appendLine("<td><input type='text' name='f_num' id='f_num' value=''></td>");
    }
    sb.appendLine("</tr>");
    sb.appendLine("<tr>");
    sb.appendLine("<td>Second Number :</td>");
    if (data && data.s_num) {
        sb.appendLine("<td><input type='text' name='s_num' id='s_num' value='{0}'></td>", data.s_num);
    } else {
        sb.appendLine("<td><input type='text' name='s_num' id='s_num' value=''></td>");

    }
    sb.appendLine("</tr>");
    sb.appendLine("<tr>");
    sb.appendLine("<td><input type='submit' value='Calculate'></td>");
    sb.appendLine("</tr>");
    if (data && data.s_num && data.f_num) {
        var sum = parseInt(data.s_num) + parseInt(data.f_num);
        sb.appendLine("<tr>");
        sb.appendLine("<td><span>Sum = {0}</span></td>", sum);
        sb.appendLine("</tr>");
    }
    sb.appendLine("</table>");
    sb.appendLine("</form>");
    sb.appendLine("</body>");
    sb.appendLine("</html>");

    sb.build(function (err, result) {
        resp.write(result);
        resp.end();
    });
}

function getCalcForm(req, resp, fomrData) {
    resp.writeHead(200, { "Content-Type": "text/html" });
    getCalcHtml(req, resp, fomrData)
}

http.createServer(function (req, resp) {
    switch (req.method) {
        case "GET":
            if (req.url === '/') {
                getHome(req, resp);
            } else if (req.url === '/calc') {
                getCalcForm(req, resp);
            } else {
                get404(req, resp);
            }
            break;
        case "POST":
            if (req.url === '/calc') {
                var reqBody = "";
                req.on('data', function (data) {
                    reqBody += data;
                    if (reqBody.length > 1e7) {
                        // 10MB
                        resp.writeHead(413, { "Content-Type": "text/html" });
                        resp.write("<html><head></head><body> 413: Too much data<a href='/'>Home</a></body></html>");
                        resp.end();
                    }
                });
                req.on('end', function (data) {
                    var formData = qs.parse(reqBody);
                    getCalcForm(req, resp, formData);
                });
                //getCalcForm(req, resp, data);
            } else {
                get404(req, resp);
            }
            break;
        default:
            get405(req, resp);
            break;
    }

}).listen(port);