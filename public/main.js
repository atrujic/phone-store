const path = require("path");
const fs = require("fs");

const dirPath = path.join(__dirname, "../_products");
let productList = [];

const getProducts = () => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return console.log("Failed to list contents of directory: " + err);
    }
    let ilist = [];
    files.forEach((file, i) => {
      let obj = {};
      let product;
      fs.readFile(`${dirPath}/${file}`, "utf8", (err, contents) => {
        const getMetadataIndices = (acc, elem, i) => {
          if (/^---/.test(elem)) {
            acc.push(i);
          }
          return acc;
        };
        const parseMetadata = ({ lines, metadataIndices }) => {
          if (metadataIndices.length > 0) {
            let metadata = lines.slice(
              metadataIndices[0] + 1,
              metadataIndices[1]
            );
            metadata.forEach((line) => {
              obj[line.split(": ")[0]] = line.split(": ")[1];
            });
            return obj;
          }
        };
        const parseContent = ({ lines, metadataIndices }) => {
          if (metadataIndices.length > 0) {
            lines = lines.slice(metadataIndices[1] + 1, lines.length);
          }
          return lines.join("\n");
        };
        const lines = contents.split("\n");
        const metadataIndices = lines.reduce(getMetadataIndices, []);
        const metadata = parseMetadata({ lines, metadataIndices });
        const content = parseContent({ lines, metadataIndices });
        const date = new Date();
        const timestamp = date.getTime() % 1000;
        product = {
          id: timestamp,
          title: metadata.title ? metadata.title : "No title given",
          image: metadata.image ? metadata.image : "No image given",
          price: metadata.price ? metadata.price : "No price given",
          company: metadata.company ? metadata.company : "No price given",
          inCart: metadata
            ? metadata.inCart.includes("true")
            : "No inCart given",
          count: metadata.count ? metadata.count : "No count given",
          total: metadata.total ? metadata.total : "No total given",
          content: content ? content : "No content given",
        };
        productList.push(product);
        ilist.push(i);
        if (ilist.length === files.length) {
          const sortedList = productList.sort((a, b) => {
            return a.id < b.id ? 1 : -1;
          });
          let data = JSON.stringify(sortedList);
          fs.writeFileSync("src/products.json", data);
        }
      });
    });
  });
  return;
};

getProducts();
