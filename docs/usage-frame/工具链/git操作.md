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

## git提交信息（包括文件名）中文自动编码转义

场景：不显示中文，中文都通过encode自动编码了

解决方法：`git config --global core.quotePath false`

## git统计操作

```bash
# 查看所有人增删代码行数
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done

# 查看排名前五的提交者及其提交数量
git log --pretty='%aN' | sort | uniq -c | sort -k1 -n -r | head -n 5


```

## git提交规范

```bash
# git提交规范
<type>([scope]): <subject>
# 空一行
[body]
# 空一行
[footer]

# type（提交类型）: feat(新功能，包括样式修改)、fix（bug修复，包括样式修改）、perf（性能优化）、docs（文档变更）、style（代码格式调整）、refactor（功能重构）、test（测试）、ci（持续集成脚本变更，例如github文件夹）、build（项目构建的变更，例如vite.config.js）、chore（杂项）

# scope（变更范围的细粒度，可选）：比如页面名、模块名、组件名

# subject（提交的简短描述）：描述为何更改

# body（详细描述）

# footer（关闭bug的描述），例如：Closes #111、Closes #123,#124
```

## 常用操作

> 对于提交失败，可使用github desktop

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

### git拉取推送失败

失败信息：

```bash
warning: ----------------- SECURITY WARNING ----------------
warning: | TLS certificate verification has been disabled! |
warning: ---------------------------------------------------
warning: HTTPS connections may not be secure. See https://aka.ms/gcm/tlsverify for more information.
remote: Permission to simply-none/redict.git denied to mmmnnnmmmnnnppp.
fatal: unable to access 'https://github.com/simply-none/redict.git/': The requested URL returned error: 403
```

解决方法：使用`git config --global http.sslVerify false`即可

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
- `git stash push file1 file2 ...`：把指定文件暂存起来
- `git stash save 'message'`：把本地的改动暂存起来，添加备注，方便查找
- `git stash pop`：应用最近一次暂存的修改，同时删除暂存记录
- `git stash apply stash@{$num}`：无参数默认使用`stash@{0}`
- `git stash list`：查看当前stash缓存列表
- `git stash drop stash@{$num}`：删除指定stash缓存
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

**rebase**:

- 作用：重写提交历史，将git提交树重写为只有一条主线
- 注意：可能会造成过多的冲突，若仅有一条主线，且是刚刚错误提交的，效果好

::: details 用法

合并commit:

```bash
# master: A -> B -> C
# dev: A -> D -> E
# 若dev分支的DE提交需要依赖master上的c提交，则可以在dev分支执行：
git rebase master
# 此时，dev分支会变成：
# dev: A -> B -> C -> D' -> E'
```

删除某个历史commit：这种在多条主线上，可能会有冲突，需要手动解决:

```bash
git rebase -i <commit_id>
# 之后会出现：
pick 1234567 commit_message
pick 1234568 commit_message
pick 1234569 commit_message
# 可将pick改为drop，即删除该commit，然后保存退出（:wq）

# 可以回退上面的操作：
git rebase --abort
```

:::

::: details git树主线

多条主线：

```bash
* 6fa5484 (HEAD -> master, feature) commit F
*   875906b Merge branch 'master' into feature
|\  
| | 5b05585 commit E
| | f5b0fc0 commit D
* * d017dff commit C
* * 9df916f commit B
|/  
* cb932a6 commit A
```

单条主线：

```bash
* 74199ce (HEAD -> master, feature) commit F
* e7c7111 commit E
* d9623b0 commit D
* 73deeed commit C
* c50221f commit B
* ef13725 commit A
```

:::

**git commit --amend**：

- 作用：回滚本地上一次的commit到暂存区（git add 之后的内容）
- 用法：
  - 如果上一次的commit有误，或者想增删内容，则可以使用`git commit --amend`
  - 可以连续使用多次该命令，相当于多次撤销

```bash
# 若仅想修改上一次的commit内容和msg，则可以：
git commit --amend
# 修改内容:xxxx
# 提交
git commit --amend -m 'new commit msg'

# 若想修改上一次的commit内容和msg，且还想继续增加内容，则可以：
# 把需要增加的内容先add到暂存区：
git add .
# 然后执行：
git commit --amend
# 修改内容:xxxxx
# 提交
git commit --amend -m 'new commit msg'

```

**参考**：

- https://waynerv.com/posts/git-rebase-intro/

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

### 标签（tag）

```bash
# 展示所有标签
git tag
git tag -l
git tag --list
# 展示标签，过滤，注意是双引号
git tag -l "v1.0*"

# 查看标签信息
git show v1.0

# 轻量标签：只是某个commit id的引用
# 创建轻量标签
git tag [tag_name]
git tag [tag_name] [commit_id]

# 附注标签：是存储在git仓库的一个完整对象，记录了标签的创建者、标签创建日期、标签信息
# 创建附注标签，使用-a参数
git tag -a [tag_name] -m "tag message"
git tag -a [tag_name] [commit_id] -m "tag message"

# 删除标签
git tag -d [tag_name]

# 推送指定的标签到远程仓库
git push origin [tag_name]
# 推送所有不在远程仓库的标签到远程仓库
git push origin --tags

# 删除远程仓库指定的标签
git push origin :refs/tags/[tag_name]
git push origin --delete [tag_name]

# 从某个标签创建分支
git checkout -b [branch_name] [tag_name]
```

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
