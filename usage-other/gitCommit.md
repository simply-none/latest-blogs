# git commit 提交脚本

<!-- tabs:start -->

<!-- tab:bash-shell -->

```bash
# 新建文件
touch gitCommit.sh
# 设置脚本执行权限
chmod 777 ./gitCommit.sh
# 运行脚本
./gitCommit.sh
```


<!-- tab:gitCommit.sh -->

```sh
git status
# 修复 bug：            :bug:
# 提升性能              :zap:“:racehorse:
# 改进代码结构/代码格式  :art:
# 移除代码或文件         :fire:
# 引入新功能            :sparkles:
# 更新 UI 和样式文件    :lipstick:
# 发行/版本标签         :bookmark:
# 工作进行中            :construction:
# 重大重构              :hammer:
# 修改配置文件           :wrench:
# 

commits='
:lipstick: commit comments
'

# echo $commits

read -p "输入y提交，输入t打版本标签，否则退出: " flag

if [[ "$flag" == "y" ]]
then
  git add --all
  git commit -m "$commits"
  echo -e '++++++++++++++++++++++++++++++++\n\n\n\n\n\n'
  git status
  echo -e '\n\n\n\n\n\n++++++++++++++++++++++++++++++++'

  # 展示操作：git push
  read -p "输入push提交，pull拉取: " flag1
  if [[ "$flag1" == "push" ]]
  then
    git push origin <local_branch>:<origin_branch>
    echo '推送'
  # 展示操作：git pull
  elif [[ "$flag1" == "pull" ]]
  then
    git pull --rebase origin <branch>
    echo '拉取'

    # 再一次提交：针对有冲突、远程有提交的情况
    # 展示操作：git push
    read -p "输入push提交: " flag11
    if [[ "$flag11" == "push" ]]
    then
      git push origin <local_branch>:<origin_branch>
      echo '推送'
    fi
  fi
elif [[ "$flag" == "t" ]]
then
  git tag -a 1.0.0 -m 'tag comment'
  git push origin 1.0.0
  echo '打标签'
else
  echo -e '\n\n\n\n\n\n没有做任何操作\n\n\n\n\n\n'
fi
```

<!-- tabs:end -->
