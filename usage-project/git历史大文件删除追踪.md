# 关于删除 git 大文件的记录

需求：删除 repo 中某些误操作提交的无关大文件

操作方法：由于[git filter-branch](https://git-scm.com/docs/git-filter-branch)本身存在一些缺陷，git 官方文档中不推荐用此来重写提交历史

推荐使用：
1. git官方推荐：[git filter-repo](https://github.com/newren/git-filter-repo/)
2. [bfg](https://rtyley.github.io/bfg-repo-cleaner/)

## git filter-repo 用法

文档地址：

> 安装地址：https://github.com/newren/git-filter-repo/blob/main/INSTALL.md
> 手册地址https://htmlpreview.github.io/?https://github.com/newren/git-filter-repo/blob/docs/html/git-filter-repo.html

### 安装（针对 Windows）

1. [下载 git-filter-repo 源码文件](https://github.com/newren/git-filter-repo/archive/refs/tags/v2.34.0.zip)
2. 运行命令`git --exec-path`找到该地址，将文件`git-filter-repo`复制到该地址下

```bash
$ git --exec-path
Z:/apps/Git/mingw64/libexec/git-core
# 然后复制`git-filter-repo`到这个目录中
```

3. 安装 python3，将文件`git_filter_repo.py`复制到 python3 安装目录`Scripts`中

### 使用

git filter-repo：使用用户指定的过滤器快速重写整个存储库历史。这是一种破坏性的操作，不能轻易使用；它写入与存储库中的原始对象相对应（但从中过滤）的新提交、树、标签和 blob，然后删除原始历史记录并只留下新的历史记录，主要功能如下：
剥离大文件（或大目录或大扩展名）

1. 按路径剥离不需要的文件
2. 提取想要的路径及其历史（剥离其他所有内容）
3. 重构文件布局（例如将所有文件移动到一个子目录中以准备与另一个 repo 合并，使子目录成为新的顶级目录，或者将两个具有独立文件名的目录合并到一个目录中）
4. 重命名标签（也经常为与另一个 repo 合并做准备）
5. 替换或删除密码等敏感文本
6. 使用户名或电子邮件的邮件映射重写永久化
7. 使移植物或替代参考永久化
8. 重写提交消息

主要使用：
1. 命令`git filter-repo --analyze`：分析存储库历史并创建一个报告，该报告可能有助于确定在后续运行中过滤什么，生成的报告在`.git\filter-repo`目录下
2. 针对example参考进行删除（可能需要强制删除--force）就行了，然后：
   1. git需要重新git remote add origin <git-repo-url>
   2. 可能需要重新设置git config user（也可能不需要）
   3. 需要强制推送（--force），且每个分支都需要强制推送一次到远程，不然其他分支可能未删除那些大文件
3. 保险方案，可以新建一个repo进行这项操作

example

```bash
# 基于路径的过滤
# 只保留README.md文件以及目录guides和 tools/releases/：
git filter-repo --path README.md --path guides/ --path tools/releases

# 如果你想同时拥有一个包含过滤器和一个排除过滤器，只需运行 filter-repo 多次。例如，要保留 src/main 子目录但排除 src/main 下名为data的文件，请运行：
git filter-repo --path src/main/
# 星号 ( *) 将匹配多个层级的目录
git filter-repo --path-glob 'src/*/data' --invert-paths

# 如果您想删除任何目录中的所有 .DS_Store 文件，您可以使用：
git filter-repo --invert-paths --path '.DS_Store' --use-base-name

# 基于多路径的过滤

# 如果您有很长的文件、目录、glob 或正则表达式列表要过滤，您可以将它们粘贴到文件中并使用 --paths-from-file; 例如，使用名为 stuff-i-want.txt 的文件，其内容为

# Blank lines and comment lines are ignored.
# Examples similar to --path:
README.md
guides/
tools/releases

# An example that is like --path-glob:
glob:*.py

# An example that is like --path-regex:
regex:^.*/.*/[0-9]{4}-[0-9]{2}-[0-9]{2}.txt$

# An example of renaming a path
tools/==>scripts/

# An example of using a regex to rename a path
regex:(.*)/([^/]*)/([^/]*)\.text$==>\2/\1/\3.txt

# 那么你可以运行
git filter-repo --paths-from-file stuff-i-want.txt
# 获取仅包含顶级 README.md 文件、guides/ 和 tools/releases/ 目录、所有 python 文件、名称格式为 YYYY-MM-DD.txt 的文件的存储库，其中至少有两个子目录深，并将重命名tools/ 到 scripts/ 并将 foo/bar/baz.text 等文件重命名为 bar/foo/baz.txt。注意 and 的特殊行前缀glob:和 表示重命名regex:的特殊字符串。==>
# 有时您可以轻松生成所需的所有文件。例如，如果您知道当前跟踪的文件中没有任何换行符或特殊字符（请参阅 core.quotePath from git config --help），那么这git ls-files将逐行打印所有文件，并且您知道您只想保留文件当前跟踪的（因此从历史中的所有提交中删除仅出现在其他分支上或仅出现在较旧提交中的任何文件），那么您可以使用一对命令，例如
git ls-files >../paths-i-want.txt
git filter-repo --paths-from-file ../paths-i-want.txt
# 同样，您可以使用 --paths-from-file 删除许多文件。例如，您可以运行git filter-repo --analyze以获取报告，查看 .git/filter-repo/analysis/path-deleted-sizes.txt 等文件并将所有文件名复制到 /tmp/files-i-dont- 等文件中want-anymore.txt 然后运行
git filter-repo --invert-paths --paths-from-file /tmp/files-i-dont-want-anymore.txt

# 基于内容的过滤

# 如果要过滤掉所有大于某个大小的文件，可以使用 --strip-blobs-bigger-than一些大小（可以识别 K、M 和 G 后缀），例如：
git filter-repo --strip-blobs-bigger-than 10M

# 部分历史重写

# 要仅在一个分支上重写历史记录（这可能导致它不再与其他分支共享任何公共历史记录），请使用--refs. 例如，要从master分支中删除一个名为extraneous.txt的文件：
git filter-repo --invert-paths --path extraneous.txt --refs master
# 仅重写一些最近的提交：
git filter-repo --invert-paths --path extraneous.txt --refs master~3..master
```

# bfg用法

> 官方文档：https://rtyley.github.io/bfg-repo-cleaner/

BFG特点：
1. 更快：比git-filter-branch快10 - 720倍
2. 更简单：功能少，但更专注

BFG使用体验：
1. 若符合删除的文件包含在最新的一次commit中时，该文件不会被删除
2. 删除后的文件，将被替换成一个和原文件类似的文件占用标志`原文件名.REMOVED.git-id`

用法：
1. 下载bfg jar包：https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar
2. 克隆一个新的裸repo副本：git clone --mirror <git-reop-url>
3. 在运行第四步前，可能需要运行命令：`git gc`，不然可能不会执行第四步操作
4. 运行命令：`java -jar bfg.jar --strip-blobs-bigger-than 100M some-big-repo.git`，此步骤不会删除指定文件
5. 进入repo目录删除文件：`git reflog expire --expire=now --all && git gc --prune=now --aggressive`
6. 推送到远程：`git push`

example:
```bash
# 在所有这些示例bfg中，都是java -jar bfg.jar

# 删除所有名为 'id_rsa' 或 'id_dsa' 的文件：
$ bfg --delete-files id_{dsa,rsa}  my-repo.git

# 删除所有大于 50 兆字节的 blob：
$ bfg --strip-blobs-bigger-than 50M  my-repo.git

# 删除所有名为“.git”的文件夹或文件 - Git 中的保留文件名。当从 Mercurial 等其他源代码控制系统迁移到 Git 时，这些通常会有问题：
$ bfg --delete-folders .git --delete-files .git  --no-blob-protection  my-repo.git
```


## 附录

### 本地git服务器搭建（用于模拟远程仓库）

服务器选择：gitblit

参考：https://www.cnblogs.com/wyt007/p/9869926.html

注意事项：
1. `gitblit.properties`文件设定服务器的IP地址，其中server.httpsBindInterface、server.httpBindInterface两者都设置成localhost，然后浏览器打开设置的gitblit服务就搭好了
2. `installService.cmd`文件不需要修改CD(即教程中修改的第3步)

