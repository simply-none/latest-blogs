# git常用操作

## git使用ssh免密登录github

1. 生成ssh密钥：`ssh-keygen -t rsa -C 'you@email.com'`
2. 设置生成密钥保存的路径，默认是`user/.ssh/id_rsa`，可进行修改，直接写名称则保存在当前目录
3. 设置ssh提交的密码，默认无密码
4. 之后会生成对应名称的私钥和对应名称 + `.pub`的公钥
5. 修改`user/.ssh/config`文件，添加内容如下：
   ```bash
    Host github.com
      IdentityFile C:\Users\Administrator\.ssh\github_rsa
   ```
6. 登录github -> setting -> SSH and GPG keys -> New SSH key -> 输入名称（可随便命名），填入key（生成的公钥内容）
7. 克隆项目，使用`git clone git@github.com:<github_name>/<github_repo>.git`
8. 之后git push提交就不需要github密码了

## 常用操作

1. git查看配置信息：`git config <--system | --global | --local> --list`
2. 统计git提交次数：`git log --author="xxx" --since='2018-10-01' --oneline | wc -l`


## 新仓库操作

```bash

Command line instructions
You can also upload existing files from your computer using the instructions below.


Git global setup
git config --global user.name "Jade Qiu"
git config --global user.email "jousindea@163.com"

Create a new repository
git clone xxx.git
cd xxx
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master

Push an existing folder
cd existing_folder
git init
git remote add origin xxx.git
git add .
git commit -m "Initial commit"
git push -u origin master

Push an existing Git repository
cd existing_repo
git remote rename origin old-origin
git remote add origin xxx.git
git push -u origin --all
git push -u origin --tags
```