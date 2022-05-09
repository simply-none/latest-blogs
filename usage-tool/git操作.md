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

### 零散的

- 对当前提交打标签：`git tag <version_name>`

### 基本配置（config）

- git查看配置信息：`git config <--system | --global | --local> --list`
- git配置用户信息：`git config <--global | --local | --system> user.name|email xxx`

### 分支相关（branch）


- 创建分支：`git branch <branch>`
- 切换分支：`git checkout <branch>`
- 创建并切换分支：`git checkout -b <branch>`
- 删除本地分支：先切换到其他分支`git checkout <other_branch>`，然后执行`git branch -d <local_branch>`，强制删除`git branch -D <lobal_branch>`
- 删除远程分支：`git push origin --delete <origin_branch>`
- 查看远程分支：`git branch -r`
- 查看远程分支和本地分支：`git branch -a`
- 删除远程分支：`git remote rm <origin_branch>`
- 重命名远程分支：`git remote rename <origin_branch>`
- 查看远程分支的地址：`git remote show origin`
- 解除关联远程仓库：`git remote remove origin`
- 关联远程仓库：`git remote add origin <new_branch>`

### 提交、拉取（push、pull、fetch）

- 一次性push所有的远程分支：`git push --all origin`
- 一次性拉取远程所有代码：`git fetch --all`
- 一次性push所有tags到远程分支：`git push origin --tags`
- 多人协作防止出现无效的merge提交：`git pull --rebase origin <branch>`
- 将远程的分支合并到当前的分支：`git pull origin <origin_branch>:<local_branch>`


### 合并（merge）

- 合并其他分支到当前分支，比如使当前分支不落后远程分支：`git merge origin/master`
- 非快速合并，主要是防止master混入开发分支的一些新特性，在回滚时搅乱master的提交历史：`git merge --no-ff <dev_branch>`

### 日志（log）

- 统计git提交次数：`git log --author="xxx" --since='2018-10-01' --oneline | wc -l`
- 查看某文件的提交记录：`git log <file_name>`
- 查看某文件的提交记录（只展示commit-id和提交信息）：`git log --pretty=oneline <file_name>`
- 查看某文件每次提交的差异修改：`git log -p <file_name>`
- 查看当前分支提交的树状图commit：`git log --graph`

### 综合应用

git仓库迁移的方法：
- 克隆一份裸仓库`git clone --bare old.git`，推送到新仓库`git push --mirror new.git`
- 直接切换remote url，`git remote set-url origin new.git`，`git push --mirror`


## 新仓库操作（提取自github）

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