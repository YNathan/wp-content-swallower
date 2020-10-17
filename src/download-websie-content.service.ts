// tslint:disable-next-line: no-var-requires
const { linkType, get } = require("get-content");
import { createWriteStream, existsSync, mkdirSync, writeFileSync } from "fs";
// tslint:disable-next-line: no-var-requires
const fx = require('mkdir-recursive');
// tslint:disable-next-line: no-var-requires
var download = require('download-file');
// tslint:disable-next-line: no-var-requires
const request = require('request');

export class DownloadWebsiteContent {

  ignoreStrings = ["?C=N;O=D", "?C=M;O=A", "?C=S;O=A", "?C=D;O=A", "/wp-content/", "/wp-content/", "/wp-content/uploads/"];
  baseUrl: string = "";

  async downloadFileFromUrl(url: string): Promise<void> {
    if (this.baseUrl === "") {
      this.baseUrl = url;
    }
    try {
      const pageContent: string = await get(url);

      const regex = /href="\s*(.*?)\s*"/g;

      let m: any;
      const matches: string[] = [];
      while (m = regex.exec(pageContent)) {
        matches.push(m[1]);
      }

      for (const route of matches) {
        if (!this.ignoreStrings.includes(route) && !route.includes("wp-content")) {
          if (this.isAFile(route)) {
            console.log(`its a file ${route}`);
            await this.handleFile(url, route);
          } else {
            await this.downloadFileFromUrl(url + "/" + route);
          }
        }
      }

      return Promise.resolve();

    } catch (err) {
      console.log(err)
    }
  }


  async handleFile(url: string, route: string): Promise<void> {
    const fullUrl = url + route;
    // tslint:disable-next-line: no-construct
    let localPathDir = new String(url);

    localPathDir = localPathDir.replace('http://upload.wikimedia.org/wikipedia/', "");;
    localPathDir = localPathDir.replace(this.baseUrl, "");
    localPathDir = localPathDir.split("//").join("/");
    localPathDir = localPathDir.split("/").join("-");
    localPathDir = "./content/" + localPathDir;


    if (!existsSync(localPathDir.toString())) {
      await this.mkdirRecurssiveAsync(localPathDir.toString());
    }

    // tslint:disable-next-line: no-construct
    let localFileName = new String(route);
    if (localFileName.length > 50) { 
      localFileName = localFileName.substr(localFileName.length - 20, localFileName.length);
    }
   const options = {
     directory: ".",
     filename: localPathDir+"-"+localFileName
  }

    if (localFileName.includes(".jpg")) {
  
      await request(fullUrl).pipe(createWriteStream(localPathDir+"-"+localFileName));
    } else { 

      await this.downloadFileAsync(fullUrl,options);
    }

  }


  isAFile(route: string) {
    const extention = (/[.]/.exec(route)) ? /[^.]+$/.exec(route) : undefined;

    return extention;
  }

  async downloadFileAsync(url: string, options: {}): Promise<void> {
    return new Promise((resolve) => {
      download(url, options, (err: any) => {
        resolve();
      })
    })
  }

  async mkdirRecurssiveAsync(path: string): Promise<void> {
    return new Promise((resolve) => {
      fx.mkdir(path, () => {
        resolve();
      })
    })
  }

}

