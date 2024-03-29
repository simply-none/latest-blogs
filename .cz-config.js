module.exports = {
  //可选类型
  types: [
    { value: 'docs', name: 'docs:   文档变更' },
    { value: 'pref', name: 'docs:   博客主题的细节修复及优化' },
    { value: 'feat', name: 'feat:   新功能' },
    { value: 'fix', name: 'fix:   修复' },
    { value: 'style', name: 'style:   代码格式(不影响代码运行的变动)' },
    {
      value: 'refactor',
      name: 'refactor:重构(既不是增加feature)，也不是修复bug'
    },
    { value: 'perf', name: 'perf:   性能优化' },
    { value: 'test', name: 'test:   增加测试' },
    { value: 'chore', name: 'chore:   构建过程或辅助功能的变动' },
    { value: 'revert', name: 'revert:   回退' },
    { value: 'build', name: 'build:   打包' },
    { value: 'revert', name: 'revert:   回退' }
  ],
  //消息步骤 
  messages: {
    type: '请选择提交类型',
    scope: '\n更改范围 (可选):',
    customScope: '请输入修改范围(可选)',
    subject: '请简要描述提交(必填)',
    body: '请输入详细描述(可选)',
    breaking: '列出重大变更 (可选):\n',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确认以上信息提交?(y/n)'
  },
  scopes: [
    { name: '修改笔记' },
    { name: '新增笔记' },
    { name: '删除笔记' },
    { name: '优化' },
    { name: '配置文件' },
    { name: '添加文档功能' },
    { name: '修复文档功能' },
    { name: '其他' }
  ],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  //跳过问题
  skipQuestions: [''],
  //subject文字长度默认是
  subjectLimit: 72
}
