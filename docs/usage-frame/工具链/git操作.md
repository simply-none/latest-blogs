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
9. 验证是否连接到github：`ssh -T git@github.com`

## git统计操作

```bash
# 查看所有人增删代码行数
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done

# 查看排名前五的提交者及其提交数量
git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5


```

## 常用操作

### git提交失败

失败信息有：
```bash
fatal: unable to access 'https://github.com/simply-none/redict.git/': HTTP/2 stream 1 was not closed cleanly before end of the underlying stream

unable to access 'https://github.com/simply-none/redict.git/': Failed to connect to github.com port 443 after 21442 ms: Timed out

unable to access 'https://github.com/simply-none/redict.git/': Proxy CONNECT aborted

```

以上失败信息，可通过设置代理，删除代理，挂载代理生效


```bash
# 设置代理：
git config --global http.proxy http://127.0.0.1:[代理端口号]
git config --global https.proxy https://127.0.0.1:[代理端口号]

# 删除代理
git config --global --unset http.proxy
git config --global --unset https.proxy

# 查看代理
git config --global -l
```

### 零散的

- 对当前提交打标签：`git tag <version_name>`

## 拉取项目作为初始化模板

拉取项目作为初始化模板: 使用degit命令

degit命令功能：
- 对git仓库进行复制
- 只会复制最新的提交，比git clone快得多

```bash
npm install -g degit

# 使用
degit user/repo
degit github:user/repo
degit git@github.com:user/repo
degit https://github.com/user/repo

degit gitlab:user/repo
degit url

# 分别指定branch、tag、commit
degit user/repo#dev
degit user/repo#v1.2.3
degit user/repo#1fd41saf4
```

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
- 一次性拉取远程所有代码：`git fetch --all`，与`git pull`不同的是，他仅仅是拉取远程代码，不会自动进行`merge`操作
  - 拉取特定分支：`git fetch origin branch_name`
- 一次性push所有tags到远程分支：`git push origin --tags`
- 多人协作防止出现无效的merge提交：`git pull --rebase origin <branch>`
- 将远程的分支合并到当前的分支：`git pull origin <origin_branch>:<local_branch>`

### 暂存工作区间（stash）

- `git stash`：把本地的改动暂存起来
- `git stash save 'message'`：把本地的改动暂存起来，添加备注，方便查找
- `git stash pop`：应用最近一次暂存的修改，同时删除暂存记录
- `git stash apply stash@{$num}`：无参数默认使用`stash@{0}`
- `git stash list`：查看当前stash缓存列表
- `git stash clear`：删除所有stash缓存

### 提交回滚（revert、reset）

**revert**：
- 作用：
  - 撤销某次操作，但不会影响原本的提交记录，而是会增加一条新的提交记录来撤回之前的提交
- 操作：
  - `git revert commit_id`：针对普通commit
  - `git revert commit_id -m`：针对merge的commit
  - `git revert commit_id1 commit_id2`：回滚多次commit，即`(commit_id1, commit_id2]`

**reset**：
- 作用：
  - 直接将提交记录退回到指定的commit上

### 合并（merge、rebase、cherry-pick）

**merge**：
- 作用：
  - 适用于多人协作场合
  - 即把一个分支的修改合并到当前分支上，同时会产生一条额外的合并记录，类似`merge branch xxx into xxx`
- 用法：
  - 合并其他分支到当前分支，比如使当前分支不落后远程分支：`git merge origin/master`
  - 非快速合并，主要是防止master混入开发分支的一些新特性，在回滚时搅乱master的提交历史：`git merge --no-ff <dev_branch>`

**rebase**：
- 作用：
  - 适用于个人分支
  - 变基，即把一个分支的修改合并到当前分支上

**cherry-pick**：
- 作用：
  - 意为挑拣，即将某个分支的单个commit，作为一个新的提交引入到当前分支上
- 用法：
  - `git cherry-pick commit_id`
  - `git cherry-pick commit_id1...commit_id2`：应用多个commit，左开右闭
  - `git cherry-pick commit_id1^...commit_id2`：应用多个commit，左闭右闭

### 日志（log）

- 统计总的git提交次数：`git log --oneline | wc -l`
- 统计git提交次数（某人某段时间）：`git log --author="xxx" --since='2018-10-01' --oneline | wc -l`
- 查看某文件的提交记录：`git log <file_name>`
- 查看某文件的提交记录（只展示commit-id和提交信息）：`git log --pretty=oneline <file_name>`
- 查看某文件每次提交的差异修改：`git log -p <file_name>`
- 查看当前分支提交的树状图commit：`git log --graph`
- 查看git所有的贡献人提交排名：`git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r`
- 查看所有贡献人贡献的代码量：`git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done`
- 查看某个贡献人贡献的代码量：`git log --author="<user_name>" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'`

### 别名（alias）

作用：将长命令简写

注意：
- 通过`--global`配置的别名，可在git全局配置文件中`.gitconfig`找到，其别名在`[alias]`条目下

```bash
git config --global alias.[简写名称] "长命令"
# 例如
# 原命令：查看日志信息
git log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
# 别名
git config --global alias.jlg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
# 使用别名，效果和上面原命令一致
git jlg
```

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