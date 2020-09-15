const http = require("http");
const url = require("url");
const fs = require("fs");
const axios = require("axios").default;

const clientsUrl =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";
const providersUrl =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

const baseDir = "index.html";

function clients(dataClients, callback) {
  fs.readFile(baseDir, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let text = data.toString();
      text = text.replace(/{{entidad}}/g, "clientes");
      let rows = "";
      dataClients.forEach((cliente) => {
        rows += `\t\t<tr>\n \
                    \t\t\t<th scope="row">${cliente.idCliente}</th> \n\
                    \t\t\t<td>${cliente.NombreCompania}</td> \n\
                    \t\t\t<td>${cliente.NombreContacto}</td> \n\
                    \t\t</tr> \n`;
      });

      text = text.replace(/{{dataRows}}/g, rows);
      callback(text);
    }
  });
}

function providers(dataProviders, callback) {
  fs.readFile(baseDir, "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let text = data.toString();
      text = text.replace(/{{entidad}}/g, "proveedores");
      let rows = "";
      dataProviders.forEach((proveedor) => {
        rows += `\t\t<tr>\n \
                        \t\t\t<th scope="row">${proveedor.idproveedor}</th> \n\
                        \t\t\t<td>${proveedor.nombrecompania}</td> \n\
                        \t\t\t<td>${proveedor.nombrecontacto}</td> \n\
                        \t\t</tr> \n`;
      });

      text = text.replace(/{{dataRows}}/g, rows);
      callback(text);
    }
  });
}

http
  .createServer(function (req, res) {
    let q = url.parse(req.url);
    if (q.pathname === "/api/clientes") {
      axios.get(clientsUrl).then((response) => {
        clients(response.data, (dataFinal) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(dataFinal);
        });
      });
    } else if (q.pathname === "/api/proveedores") {
      axios.get(providersUrl).then((response) => {
        providers(response.data, (dataFinal) => {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(dataFinal);
        });
      });
    }
  })
  .listen(8081);
