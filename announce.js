//const config = require("./config.json");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
class ociGraphQL {
  constructor(config, cb) {
    this.config = config;
    this.time=0;
    this.callback = cb;
  }
  // promisify
  invokeExec(command) {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log(stderr);
          reject(err);
        }
        resolve(stdout);
      });
    });
  }
  // 执行脚本拉取某一项目oci构建数据
  async fetchData() {
    exec("chmod +x spyder.sh");
    try {
      await this.invokeExec(`${path.join(__dirname, "./spyder.sh")}`);
    } catch (err) {
      throw err;
    }
  }
  sleep(time = 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time*1000);
    })
  };
  // 对某一个项目进行处理
  async processOneProject() {
    await this.fetchData();
    const res = fs.readFileSync("index.html");
    const pos=res.toString().indexOf("release")
    if(pos===-1){
        console.log('房子出了！！！！')
    }
    else{
        this.time+=1;
        console.log(`房子还没出，正在进行第${this.time}次查询`)
        await this.sleep(5)
        this.processOneProject()
    }
  }
  // 运行前的准备工作
  preRun() {
    const { Wechaty } = require('wechaty') // import { Wechaty } from 'wechaty'
    Wechaty.instance() // Global Instance
    .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`))
    .on('login',            user => console.log(`User ${user} logged in`))
    .on('message',       message => console.log(`Message: ${message}`))
    .start()
  }
  // 执行
  async run() {
    //const { projectNames } = this.config;
    // get default config from ./config.json
    this.preRun();
    //await this.processOneProject();
  }
}
//export default ociGraphQL;
module.exports = { ociGraphQL };
//可以如下进行使用
let oci = new ociGraphQL({}, console.log);
oci.run();
