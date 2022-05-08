# Linux-docker 打包 Windows客户端

## 使用clash代理

1. 执行 cd && mkdir clash 在用户目录下创建 clash 文件夹。下载适合的 Clash 二进制文件并解压重命名为 clash，一般个人的64位电脑下载 [clash-linux-amd64.tar.gz](https://github.com/Dreamacro/clash/releases) 即可
2. 在终端 cd 到 Clash 二进制文件所在的目录，执行 wget -O config.yaml "xxx" 下载 Clash 配置文件
3. 执行 `./clash -d .`，若无权限，可使用`su -`root账户， 即可启动 Clash（此过程有点漫长，需下载某些依赖），同时启动 HTTP 代理和 Socks5 代理。如提示权限不足，请执行 chmod +x clash
4. 以 Ubuntu 为例，打开系统设置，选择网络，点击网络代理右边的 ⚙ 按钮，选择手动，填写 HTTP 和 HTTPS 代理为 127.0.0.1:7890，填写 Socks 主机为 127.0.0.1:7891，即可启用系统代理。




## docker 

安装docker：https://blog.csdn.net/tang070220/article/details/124281166


1. 运行docker报错：`Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get http://%2Fvar%2Frun%2Fdocker.sock/v1.24/images/json: dial unix /var/run/docker.sock: connect: permission denied`

解决方法：
```bash
sudo groupadd docker #添加docker用户组
sudo gpasswd -a <user_name> docker #将登陆用户加入到docker用户组中
newgrp docker #更新用户组
```

2. 进入到项目当前目录下，先运行项目（使用`npm install -f`强制重新安装项目依赖，获取缓存内容，以便后续带入到docker中）（或者是包含项目的上级目录）

3. 然后打开命令行，添加并运行docker容器：

```bash
docker run --rm -ti \
 --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
 --env ELECTRON_CACHE="/root/.cache/electron" \
 --env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
 -v ${PWD}:/project \
 -v ${PWD##*/}-node-modules:/project/node_modules \
 # 此步骤是将用户目录下的缓存全部映射到docker对应目录中
 -v ~/.cache/electron:/root/.cache/electron \
 -v ~/.cache/electron-builder:/root/.cache/electron-builder \
 electronuserland/builder:wine
```


